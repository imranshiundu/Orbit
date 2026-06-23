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
  <div id="labels-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 10;"></div>
  <div id="sidebar-container" style="position: absolute; top: var(--space-4); right: var(--space-4); bottom: var(--space-4); width: 320px;"></div>
  <div id="panel-container" style="position: absolute; top: var(--space-4); right: calc(320px + var(--space-4) * 2); bottom: var(--space-4); width: 320px;"></div>
  <div id="tooltip-container" style="position: absolute; top: 0; left: 0; pointer-events: none;"></div>
`;

const canvas = document.getElementById('glcanvas');
const { scene, camera, renderer } = setupScene(canvas);

const solarSystem = new SolarSystem(scene);
solarSystem.init();

const animator = new Animator(solarSystem, renderer, scene, camera, store);

store.dispatch({ type: 'SET_PLANETS', payload: planetsData });
planetsData.forEach(p => solarSystem.addPlanet(p));

const sidebarContainer = document.getElementById('sidebar-container');
const sidebar = new Sidebar(sidebarContainer, store);
sidebar.render();

import { PlanetPanel } from './ui/PlanetPanel.js';
import { Tooltip } from './ui/Tooltip.js';
import { RaycasterManager } from './utils/raycaster.js';

const panelContainer = document.getElementById('panel-container');
const planetPanel = new PlanetPanel(panelContainer, store);
planetPanel.render();

const tooltipContainer = document.getElementById('tooltip-container');
const tooltip = new Tooltip(tooltipContainer, store);

new RaycasterManager(camera, scene, store);

store.on('change', () => {
  sidebar.render();
  planetPanel.render();
  tooltip.render();
});

store.on('ADD_PLANET', (action) => solarSystem.addPlanet(action.payload));
store.on('DELETE_PLANET', (action) => solarSystem.removePlanet(action.id));
store.on('UPDATE_PLANET', (action) => {
  solarSystem.removePlanet(action.id);
  const state = store.getState();
  const planetData = state.planets.find(p => p.id === action.id);
  solarSystem.addPlanet(planetData);
});

animator.start();
