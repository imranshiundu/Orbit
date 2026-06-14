import * as THREE from 'three';

export class OrbitPath {
  constructor(radius) {
    this.mesh = null;
    this.create(radius);
  }

  create(radius) {
    const geometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.1 
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2;
  }
}
