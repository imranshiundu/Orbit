import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupScene(canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 300, 600);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2× to avoid GPU overload

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 20;     // don't crash into the sun
  controls.maxDistance = 2500;   // don't fly off to infinity
  controls.screenSpacePanning = true; // pan feels natural (not tilt-based)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Star particle background
  const starGeo = new THREE.BufferGeometry();
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 4000;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.8 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls };
}
