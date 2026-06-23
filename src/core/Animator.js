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
        const urlParams = new URLSearchParams(window.location.search);
        const isRealTime = urlParams.get('realtime') === 'true';
        // In our system, speed = 1 means 1 second = 1 day
        // In real time, 1 second = 1 second. Since 1 day = 86400 seconds,
        // we multiply delta by (1 / 86400) to get real-time behavior.
        const timeMultiplier = isRealTime ? (1 / 86400) : state.speed;
        
        this.solarSystem.update(delta * timeMultiplier);
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
