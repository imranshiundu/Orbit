export class Animator {
  constructor(solarSystem, state) {
    this.solarSystem = solarSystem;
    this.state = state;
    this.lastTime = performance.now();
    this.animationId = null;
  }

  start() {
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
    this.lastTime = currentTime;

    if (!this.state.paused) {
      this.solarSystem.update(deltaTime, this.state.speed);
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
