import * as THREE from 'three';

export class Sun {
  constructor() {
    this.name = "Sun";
    this.mesh = null;
    this.light = null;
  }

  init(scene) {
    const geometry = new THREE.SphereGeometry(20, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xF5A623 });
    
    import('./TextureLoader.js').then(({ textureLoader }) => {
      material.map = textureLoader.load('/textures/2k_sun.jpg');
      material.color.setHex(0xffffff); // remove tint
      material.needsUpdate = true;
    });

    this.mesh = new THREE.Mesh(geometry, material);
    
    this.light = new THREE.PointLight(0xffffff, 2, 0, 0);
    this.mesh.add(this.light);
    
    scene.add(this.mesh);
  }
}
