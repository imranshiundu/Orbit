import * as THREE from 'three';
import { Planet } from './Planet.js';
import { Sun } from './Sun.js';
import { scaleDistance } from '../utils/scaling.js';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.sun = new Sun();
    this.planets = new Map();
    this.asteroids = null;
  }

  init() {
    this.sun.init(this.scene);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('asteroids') === 'true') {
      this.createAsteroidBelt();
    }
  }

  createAsteroidBelt() {
    const minDistance = scaleDistance(2.0);
    const maxDistance = scaleDistance(3.5);
    const asteroidCount = 2000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(asteroidCount * 3);

    for (let i = 0; i < asteroidCount; i++) {
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3]     = Math.cos(angle) * distance;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = Math.sin(angle) * distance;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1.0,
      transparent: true,
      opacity: 0.7,
    });

    this.asteroids = new THREE.Points(geometry, material);
    this.scene.add(this.asteroids);
  }

  /** Toggle the asteroid belt on/off. Returns true if now visible. */
  toggleAsteroidBelt() {
    if (this.asteroids) {
      this.scene.remove(this.asteroids);
      this.asteroids.geometry.dispose();
      this.asteroids.material.dispose();
      this.asteroids = null;
      return false;
    }
    this.createAsteroidBelt();
    return true;
  }

  addPlanet(planetData, pivotRotationY = 0) {
    if (this.planets.has(planetData.id)) return;
    const planet = new Planet(planetData, this.scene);
    planet.pivot.rotation.y = pivotRotationY;
    this.planets.set(planetData.id, planet);
  }

  removePlanet(id) {
    const planet = this.planets.get(id);
    if (planet) {
      const savedRotation = planet.pivot.rotation.y;
      planet.destroy();
      this.planets.delete(id);
      return savedRotation;
    }
    return 0;
  }

  /**
   * Patch only the moons on an existing planet in-place.
   * Avoids the freeze caused by full planet destroy-rebuild when adding/editing moons.
   */
  updatePlanetMoons(planetId, moonsData) {
    const planet = this.planets.get(planetId);
    if (!planet) return;
    planet.rebuildMoons(moonsData);
  }

  update(deltaTime) {
    this.planets.forEach(p => p.update(deltaTime));

    if (this.asteroids) {
      this.asteroids.rotation.y += 0.05 * deltaTime;
    }
  }
}
