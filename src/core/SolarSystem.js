import { Planet } from './Planet.js';
import { Sun } from './Sun.js';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.sun = new Sun();
    this.planets = [];
  }

  init() {
    this.sun.init(this.scene);
  }

  addPlanet(planetData) {
    const planet = new Planet(planetData);
    this.planets.push(planet);
    return planet;
  }

  update(deltaTime, speedMultiplier) {
    this.planets.forEach(p => p.update(deltaTime, speedMultiplier));
  }
}
