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
    
    // Add sun glow sprite
    const spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(this.createGlowTexture()),
      color: 0xF5A623,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(60, 60, 1);
    this.mesh.add(sprite);

    scene.add(this.mesh);
  }

  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return canvas;
  }
}
