import * as THREE from 'three';

export class Animator {
  constructor(solarSystem, renderer, scene, camera, store, controls) {
    this.solarSystem = solarSystem;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.store = store;
    this.controls = controls;
    this.lastTime = performance.now();
    this.rafId = null;

    this._lastSelectedId = undefined;

    // Label cache: id → { el, lastX, lastY }
    this._labelCache = new Map();
    this._labelsContainer = null;

    this._setupKeyboardNav();
    this._setupDoubleClickFocus();
    this._setupCustomEvents();
  }

  // ── Keyboard navigation ────────────────────────────────────────────────────
  _setupKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();

      if (key === 'h' || key === 'home') {
        // Home — back to sun
        this.store.dispatch({ type: 'SET_SELECTED', id: null });
      }

      if (key === 'r') {
        // Reset camera to initial position
        this._resetCamera();
      }

      if (key === 'f') {
        // Focus the selected planet (re-trigger animation)
        const { selectedId } = this.store.getState();
        if (selectedId && selectedId !== 'new') {
          this._lastSelectedId = null; // force re-trigger
        }
      }

      if (key === '=' || key === '+') {
        // Zoom in
        this._zoom(-0.15);
      }

      if (key === '-' || key === '_') {
        // Zoom out
        this._zoom(0.15);
      }

      // Number keys 1-9 → focus nth planet
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key) - 1;
        const planets = this.store.getState().planets;
        if (planets[idx]) {
          this.store.dispatch({ type: 'SET_SELECTED', id: planets[idx].id });
        }
      }
    });
  }

  _zoom(delta) {
    if (!this.controls) return;
    const dir = new THREE.Vector3();
    dir.subVectors(this.camera.position, this.controls.target).normalize();
    const dist = this.camera.position.distanceTo(this.controls.target);
    const step = dist * delta;
    this.camera.position.addScaledVector(dir, step);
    this.controls.update();
  }

  _resetCamera() {
    if (!this.controls) return;
    const targetPos = new THREE.Vector3(0, 300, 600);
    const targetLook = new THREE.Vector3(0, 0, 0);
    this._animateCameraTo(targetPos, targetLook, 80);
  }

  _animateCameraTo(targetPos, targetLook, frames = 60) {
    let f = 0;
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out

    // Stylish arc for movement
    const midPos = startPos.clone().lerp(targetPos, 0.5);
    midPos.y += startPos.distanceTo(targetPos) * 0.2; // Add height to arc
    const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, targetPos);

    const animate = () => {
      if (f >= frames) return;
      f++;
      const t = ease(f / frames);

      this.camera.position.copy(curve.getPoint(t));
      this.controls.target.lerpVectors(startTarget, targetLook, t);
      this.controls.update();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  // ── Double-click to focus ──────────────────────────────────────────────────
  _setupDoubleClickFocus() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('dblclick', (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const meshes = [];
      this.scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.userData?.id) meshes.push(child);
      });

      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0 && hits[0].object.userData.id) {
        const id = hits[0].object.userData.id;
        // Find if it's a planet id
        const planetId = this.store.getState().planets.find(p => p.id === id)?.id;
        if (planetId) {
          this.store.dispatch({ type: 'SET_SELECTED', id: planetId });
          this._zoomToPlanet(planetId);
        }
      }
    });
  }

  // Zoom camera close to the planet with a smooth animation
  _zoomToPlanet(planetId) {
    const planet = this.solarSystem.planets.get(planetId);
    if (!planet || !this.controls) return;

    const pos = new THREE.Vector3();
    planet.mesh.getWorldPosition(pos);

    // Target position: pull back from planet based on its size
    const radius = planet.mesh.geometry.parameters?.radius || 10;
    const pullBack = Math.max(radius * 6, 40);
    const offset = new THREE.Vector3(pullBack, pullBack * 0.4, pullBack);

    const camTarget = pos.clone().add(offset);
    this._animateCameraTo(camTarget, pos.clone(), 70);
  }

  // ── Custom events (from Sidebar reset button) ─────────────────────────────
  _setupCustomEvents() {
    window.addEventListener('orbit:reset-camera', () => this._resetCamera());
  }

  start() {
    this.lastTime = performance.now();
    const tick = (timestamp) => {
      const delta = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      const state = this.store.getState();
      if (!state.paused) {
        const urlParams = new URLSearchParams(window.location.search);
        const isRealTime = urlParams.get('realtime') === 'true';
        const timeMultiplier = isRealTime ? (1 / 86400) : state.speed;
        this.solarSystem.update(delta * timeMultiplier);
      }

      this._handleSelectionChange(state);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.updateLabels();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  _handleSelectionChange(state) {
    const { selectedId } = state;
    if (selectedId === this._lastSelectedId) return;
    this._lastSelectedId = selectedId;
    if (!this.controls) return;

    if (selectedId && selectedId !== 'new') {
      const planet = this.solarSystem.planets.get(selectedId);
      if (!planet) return;

      // One-shot 70-frame smooth camera target slide
      let frames = 0;
      const maxFrames = 70;
      const animate = () => {
        if (frames >= maxFrames) return;
        frames++;
        const pos = new THREE.Vector3();
        planet.mesh.getWorldPosition(pos);
        const t = 1 - Math.pow(0.88, frames); // ease-out
        this.controls.target.lerp(pos, t * 0.12);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      let frames = 0;
      const maxFrames = 70;
      const origin = new THREE.Vector3(0, 0, 0);
      const animate = () => {
        if (frames >= maxFrames) return;
        frames++;
        this.controls.target.lerp(origin, 0.08);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }

  // ── Labels — fast path: skip DOM write if pixel position is unchanged ─────
  updateLabels() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('labels') !== 'true') return;

    if (!this._labelsContainer) {
      this._labelsContainer = document.getElementById('labels-container');
    }

    this.solarSystem.planets.forEach((planet, id) => {
      const pos = new THREE.Vector3();
      planet.mesh.getWorldPosition(pos);
      pos.project(this.camera);

      // Behind the camera — hide immediately
      if (pos.z > 1) {
        const cached = this._labelCache.get(id);
        if (cached) cached.el.style.display = 'none';
        return;
      }

      const x = Math.round((pos.x * 0.5 + 0.5) * window.innerWidth);
      const y = Math.round((pos.y * -0.5 + 0.5) * window.innerHeight) - 20;

      let cached = this._labelCache.get(id);
      if (!cached) {
        const el = document.createElement('div');
        el.className = 'planet-label';
        el.textContent = planet.data.name;
        this._labelsContainer.appendChild(el);
        cached = { el, lastX: null, lastY: null };
        this._labelCache.set(id, cached);
      }

      // Only touch the DOM when position has moved more than 1px
      if (cached.lastX !== x || cached.lastY !== y) {
        cached.el.style.display = 'block';
        cached.el.style.transform = `translate3d(${x}px,${y}px,0)`;
        cached.lastX = x;
        cached.lastY = y;
      }
    });
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
