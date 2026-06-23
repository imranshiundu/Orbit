import * as THREE from 'three';

export class RaycasterManager {
  constructor(camera, scene, store) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.scene = scene;
    this.store = store;

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // We want to intersect planet meshes and orbit paths
    const meshes = [];
    this.scene.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry.type !== 'PlaneGeometry') {
        meshes.push(child);
      }
    });

    const intersects = this.raycaster.intersectObjects(meshes);
    let hoveredId = null;

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const state = this.store.getState();
      
      if (hitMesh.userData.id) {
        hoveredId = hitMesh.userData.id;
      }
    }

    const currentState = this.store.getState();
    if (currentState.hoveredId !== hoveredId) {
      this.store.dispatch({ type: 'SET_HOVERED', id: hoveredId });
    }

    if (hoveredId) {
      this.store.emit('MOUSE_MOVE', { x: event.clientX, y: event.clientY });
    }
  }
}
