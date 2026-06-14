import { Planet } from './Planet.js';
import { Sun } from './Sun.js';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.sun = new Sun();
    this.planets = new Map();
  }

  init() {
    this.sun.init(this.scene);
  }

  addPlanet(planetData) {
    if (this.planets.has(planetData.id)) return;
    const planet = new Planet(planetData, this.scene);
    this.planets.set(planetData.id, planet);
  }

  removePlanet(id) {
    const planet = this.planets.get(id);
    if (planet) {
      planet.destroy();
      this.planets.delete(id);
    }
  }

  update(deltaTime) {
    this.planets.forEach(p => p.update(deltaTime));
  }
}
