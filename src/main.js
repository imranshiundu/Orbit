import './style.css';
import { store } from './store.js';
import { setupScene } from './scene.js';
import { SolarSystem } from './core/SolarSystem.js';
import { Animator } from './core/Animator.js';
import { Sidebar } from './ui/Sidebar.js';
import { PlanetPanel } from './ui/PlanetPanel.js';
import { Tooltip } from './ui/Tooltip.js';
import { RaycasterManager } from './utils/raycaster.js';
import planetsData from './data/planets.json';

const app = document.querySelector('#app');
app.innerHTML = `
  <canvas id="glcanvas"></canvas>
  <div id="labels-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 10;"></div>
  <div id="sidebar-container" style="position: absolute; top: var(--space-4); right: var(--space-4); bottom: var(--space-4); width: 320px;"></div>
  <div id="panel-container" style="position: absolute; top: var(--space-4); right: calc(320px + var(--space-4) * 2); bottom: var(--space-4); width: 320px; pointer-events: none;"></div>
  <div id="tooltip-container" style="position: absolute; top: 0; left: 0; pointer-events: none;"></div>
`;

const canvas = document.getElementById('glcanvas');
const { scene, camera, renderer, controls } = setupScene(canvas);

const solarSystem = new SolarSystem(scene);
solarSystem.init();

const animator = new Animator(solarSystem, renderer, scene, camera, store, controls);

// Expose solarSystem to the Sidebar for the asteroid toggle button
window._solarSystem = solarSystem;

store.dispatch({ type: 'SET_PLANETS', payload: planetsData });
planetsData.forEach(p => solarSystem.addPlanet(p));

const sidebarContainer = document.getElementById('sidebar-container');
const sidebar = new Sidebar(sidebarContainer, store);
sidebar.render();

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
  // If only moons changed, patch them in-place to avoid the full planet rebuild freeze
  if (action._moonsOnly) {
    const state = store.getState();
    const planetData = state.planets.find(p => p.id === action.id);
    if (planetData) solarSystem.updatePlanetMoons(action.id, planetData.moons || []);
    return;
  }
  // Full planet rebuild for geometry/material changes (size, distance, color, etc.)
  const savedRotation = solarSystem.removePlanet(action.id);
  const state = store.getState();
  const planetData = state.planets.find(p => p.id === action.id);
  if (planetData) solarSystem.addPlanet(planetData, savedRotation);
});

animator.start();
