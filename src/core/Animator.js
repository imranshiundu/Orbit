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

      this.focusSelectedPlanet(state);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.updateLabels();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  focusSelectedPlanet(state) {
    if (!this.controls) return;
    const { selectedId } = state;
    const zero = { x: 0, y: 0, z: 0 };
    const target = this.controls.target;

    if (selectedId && selectedId !== 'new') {
      const planet = this.solarSystem.planets.get(selectedId);
      if (planet) {
        const pos = new THREE.Vector3();
        planet.mesh.getWorldPosition(pos);
        target.x += (pos.x - target.x) * 0.05;
        target.y += (pos.y - target.y) * 0.05;
        target.z += (pos.z - target.z) * 0.05;
        return;
      }
    }
    target.x += (zero.x - target.x) * 0.05;
    target.y += (zero.y - target.y) * 0.05;
    target.z += (zero.z - target.z) * 0.05;
  }

  updateLabels() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('labels') !== 'true') return;

    if (!this.labelsContainer) {
      this.labelsContainer = document.getElementById('labels-container');
      this.labelElements = new Map();
    }

    import('three').then((THREE) => {
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
    });
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
