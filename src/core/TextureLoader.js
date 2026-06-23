import * as THREE from 'three';

class AsyncTextureLoader {
  constructor() {
    this.loader = new THREE.TextureLoader();
    this.cache = new Map();
  }

  load(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    const texture = this.loader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(url, texture);
    return texture;
  }
}

export const textureLoader = new AsyncTextureLoader();
