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
    // Asteroid belt between Mars (1.52 AU) and Jupiter (5.2 AU)
    const minDistance = scaleDistance(2.0);
    const maxDistance = scaleDistance(3.5);
    const asteroidCount = 2000;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(asteroidCount * 3);
    const sizes = new Float32Array(asteroidCount);

    for (let i = 0; i < asteroidCount; i++) {
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      const angle = Math.random() * Math.PI * 2;
      
      positions[i * 3] = Math.cos(angle) * distance;
      // slight vertical scatter
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5; 
      positions[i * 3 + 2] = Math.sin(angle) * distance;
      
      sizes[i] = Math.random() * 0.8 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1.0,
      transparent: true,
      opacity: 0.7
    });

    this.asteroids = new THREE.Points(geometry, material);
    this.scene.add(this.asteroids);
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

  update(deltaTime) {
    this.planets.forEach(p => p.update(deltaTime));
    
    if (this.asteroids) {
      // Asteroids orbit slowly
      this.asteroids.rotation.y += 0.05 * deltaTime;
    }
  }
}
