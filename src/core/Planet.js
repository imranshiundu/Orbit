import * as THREE from 'three';
import { scaleDistance, scaleSize } from '../utils/scaling.js';
import { OrbitPath } from './OrbitPath.js';
import { Moon } from './Moon.js';
import { textureLoader } from './TextureLoader.js';

export class Planet {
  constructor(data, scene) {
    this.id = data.id;
    this.data = data;
    this.scene = scene;
    
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    const radius = scaleSize(data.diameterKm);
    const distance = scaleDistance(data.distanceAU);

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const materialOptions = {};
    if (data.texture) {
      materialOptions.map = textureLoader.load(`/textures/${data.texture}`);
    } else {
      materialOptions.color = data.color || 0xffffff;
    }
    
    const material = new THREE.MeshStandardMaterial(materialOptions);
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = distance;
    this.mesh.userData = { id: data.id };
    
    if (data.axialTiltDeg) {
      this.mesh.rotation.z = THREE.MathUtils.degToRad(data.axialTiltDeg);
    }
    
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
    this.pivot.add(this.mesh);

    // Add Saturn's rings
    if (data.id === 'saturn') {
      const ringGeo = new THREE.RingGeometry(radius * 1.2, radius * 2.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc9b08f,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      this.mesh.add(ringMesh);
    }

    this.orbitPath = new OrbitPath(distance);
    this.orbitPath.mesh.userData = { id: data.id };
    this.scene.add(this.orbitPath.mesh);

    this.moons = [];
    if (data.moons && data.moons.length > 0) {
      data.moons.forEach(moonData => {
        this.moons.push(new Moon(moonData, this.mesh));
      });
    }
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
    
    if (this.moons) {
      this.moons.forEach(moon => moon.update(deltaTime));
    }
  }

  destroy() {
    if (this.moons) {
      this.moons.forEach(moon => moon.destroy());
    }
    this.scene.remove(this.pivot);
    this.scene.remove(this.orbitPath.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.orbitPath.mesh.geometry.dispose();
    this.orbitPath.mesh.material.dispose();
  }
}
