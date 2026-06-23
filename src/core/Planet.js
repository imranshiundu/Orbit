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

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const materialOptions = {};
    
    if (data.texture) {
      import('./TextureLoader.js').then(({ textureLoader }) => {
        materialOptions.map = textureLoader.load(`/textures/${data.texture}`);
        this.mesh.material = new THREE.MeshStandardMaterial(materialOptions);
        this.mesh.material.needsUpdate = true;
      });
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

    this.orbitPath = new OrbitPath(distance);
    this.orbitPath.mesh.userData = { id: data.id };
    this.scene.add(this.orbitPath.mesh);

    this.moons = [];
    if (data.moons && data.moons.length > 0) {
      import('./Moon.js').then(({ Moon }) => {
        data.moons.forEach(moonData => {
          this.moons.push(new Moon(moonData, this.mesh));
        });
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
