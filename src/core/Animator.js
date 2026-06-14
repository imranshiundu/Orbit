export class Animator {
  constructor(solarSystem, renderer, scene, camera, store) {
    this.solarSystem = solarSystem;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.store = store;
    
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
        this.solarSystem.update(delta * state.speed);
      }

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
