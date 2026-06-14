import './style.css';
import { store } from './store.js';
import { setupScene } from './scene.js';
import { SolarSystem } from './core/SolarSystem.js';
import { Animator } from './core/Animator.js';
import { Sidebar } from './ui/Sidebar.js';
import planetsData from './data/planets.json';

const app = document.querySelector('#app');
app.innerHTML = `
  <canvas id="glcanvas"></canvas>
  <div id="sidebar-container" style="position: absolute; top: var(--space-4); right: var(--space-4); bottom: var(--space-4); width: 320px;"></div>
`;

const canvas = document.getElementById('glcanvas');
const { scene, camera, renderer } = setupScene(canvas);

const solarSystem = new SolarSystem(scene);
solarSystem.init();

const animator = new Animator(solarSystem, renderer, scene, camera, store);

// Initial Load
store.dispatch({ type: 'SET_PLANETS', payload: planetsData });
planetsData.forEach(p => solarSystem.addPlanet(p));

// Wire UI
const sidebarContainer = document.getElementById('sidebar-container');
const sidebar = new Sidebar(sidebarContainer, store);
sidebar.render();

// React to store changes
store.on('change', () => sidebar.render());

store.on('ADD_PLANET', (action) => solarSystem.addPlanet(action.payload));
store.on('DELETE_PLANET', (action) => solarSystem.removePlanet(action.id));

animator.start();
