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

    // Track the last selected ID so we only re-focus when the selection actually changes
    this._lastSelectedId = undefined;
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

  /**
   * When the selected planet CHANGES, smoothly animate the camera target toward it
   * for ~1 second (60 frames). After that, the user has full control — we don't
   * keep fighting them every frame.
   */
  _handleSelectionChange(state) {
    const { selectedId } = state;

    if (selectedId === this._lastSelectedId) return; // no change, nothing to do
    this._lastSelectedId = selectedId;

    if (!this.controls) return;

    if (selectedId && selectedId !== 'new') {
      const planet = this.solarSystem.planets.get(selectedId);
      if (!planet) return;

      // Animate target toward the planet over ~60 frames
      let frames = 0;
      const maxFrames = 60;

      const animate = () => {
        if (frames >= maxFrames) return;
        frames++;

        const pos = new THREE.Vector3();
        planet.mesh.getWorldPosition(pos);
        this.controls.target.x += (pos.x - this.controls.target.x) * 0.1;
        this.controls.target.y += (pos.y - this.controls.target.y) * 0.1;
        this.controls.target.z += (pos.z - this.controls.target.z) * 0.1;

        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      // Return to origin
      let frames = 0;
      const maxFrames = 60;
      const animate = () => {
        if (frames >= maxFrames) return;
        frames++;
        this.controls.target.x += (0 - this.controls.target.x) * 0.1;
        this.controls.target.y += (0 - this.controls.target.y) * 0.1;
        this.controls.target.z += (0 - this.controls.target.z) * 0.1;
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }

  updateLabels() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('labels') !== 'true') return;

    if (!this.labelsContainer) {
      this.labelsContainer = document.getElementById('labels-container');
      this.labelElements = new Map();
    }

    this.solarSystem.planets.forEach((planet, id) => {
      const pos = new THREE.Vector3();
      planet.mesh.getWorldPosition(pos);
      pos.project(this.camera);

      const x = (pos.x * .5 + .5) * window.innerWidth;
      const y = (pos.y * -.5 + .5) * window.innerHeight;

      if (!this.labelElements.has(id)) {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.color = 'white';
        el.style.fontSize = '12px';
        el.style.textShadow = '0 0 3px black';
        el.textContent = planet.data.name;
        this.labelsContainer.appendChild(el);
        this.labelElements.set(id, el);
      }

      const el = this.labelElements.get(id);
      if (pos.z > 1) {
        el.style.display = 'none';
      } else {
        el.style.display = 'block';
        el.style.transform = `translate(${x}px, ${y - 20}px)`;
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
