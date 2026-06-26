import * as THREE from 'three';
import { scaleSize } from '../utils/scaling.js';
import { OrbitPath } from './OrbitPath.js';
import { textureLoader } from './TextureLoader.js';

export class Moon {
  constructor(data, parentMesh) {
    this.id = data.id;
    this.data = data;
    this.parentMesh = parentMesh;
    
    this.pivot = new THREE.Group();
    this.parentMesh.add(this.pivot);

    const radius = scaleSize(data.diameterKm);
    // distance is much smaller, let's scale it down more reasonably 
    // real distance Earth-Moon is 384,400km, Earth is 12,742km. Ratio is ~30x.
    // In our scene, earth radius is scaleSize(12742) = 6. 
    // We'll set a base distance so it's visible.
    const distance = (data.distancePlanetKm / 12742) * 1.5; 

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const materialOptions = {};
    
    if (!data.texture) {
      materialOptions.color = data.color || 0xffffff;
    }
    
    const material = new THREE.MeshStandardMaterial(materialOptions);
    if (data.texture) {
      material.map = textureLoader.load(`/textures/${data.texture}`);
    }
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = distance;
    this.mesh.userData = { id: data.id };
    this.pivot.add(this.mesh);

    // Orbit path for the moon
    this.orbitPath = new OrbitPath(distance);
    this.orbitPath.mesh.userData = { id: data.id };
    // Add orbit path to the parent mesh so it orbits with it
    this.parentMesh.add(this.orbitPath.mesh);
  }

  update(deltaTime) {
    if (this.data.orbitalPeriodDays) {
      const orbitalSpeed = (2 * Math.PI) / this.data.orbitalPeriodDays;
      // Multiply by a factor to make moon orbit visible
      this.pivot.rotation.y += orbitalSpeed * deltaTime * 10;
    }
  }

  destroy() {
    this.parentMesh.remove(this.pivot);
    this.parentMesh.remove(this.orbitPath.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.orbitPath.mesh.geometry.dispose();
    this.orbitPath.mesh.material.dispose();
  }
}
