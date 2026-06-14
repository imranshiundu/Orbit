import * as THREE from 'three';
import { scaleDistance, scaleSize } from '../utils/scaling.js';
import { OrbitPath } from './OrbitPath.js';

export class Planet {
  constructor(data, scene) {
    this.id = data.id;
    this.data = data;
    this.scene = scene;
    
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    const radius = scaleSize(data.diameterKm);
    const distance = scaleDistance(data.distanceAU);

    // Planet mesh
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color || 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = distance;
    
    if (data.axialTiltDeg) {
      this.mesh.rotation.z = THREE.MathUtils.degToRad(data.axialTiltDeg);
    }
    
    this.pivot.add(this.mesh);

    // Orbit path
    this.orbitPath = new OrbitPath(distance);
    this.scene.add(this.orbitPath.mesh);
  }

  update(deltaTime) {
    if (this.data.orbitalPeriodDays) {
      const orbitalSpeed = (2 * Math.PI) / this.data.orbitalPeriodDays;
      this.pivot.rotation.y += orbitalSpeed * deltaTime;
    }
    
    if (this.data.rotationPeriodHours) {
      const rotationSpeed = (2 * Math.PI) / (this.data.rotationPeriodHours / 24);
      this.mesh.rotation.y += rotationSpeed * deltaTime;
    }
  }

  destroy() {
    this.scene.remove(this.pivot);
    this.scene.remove(this.orbitPath.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.orbitPath.mesh.geometry.dispose();
    this.orbitPath.mesh.material.dispose();
  }
}
