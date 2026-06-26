import { SpeedControl } from './SpeedControl.js';

export class Sidebar {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this._asteroids = false;
    this._labels = false;
    this._hidden = false;

    // Create the floating hide/show toggle button outside the sidebar
    this._toggleBtn = document.createElement('button');
    this._toggleBtn.id = 'sidebar-toggle';
    this._toggleBtn.title = 'Toggle sidebar';
    this._toggleBtn.textContent = '◀';
    document.body.appendChild(this._toggleBtn);

    this._toggleBtn.addEventListener('click', () => {
      this._hidden = !this._hidden;
      if (this._hidden) {
        this.container.style.transform = 'translateX(calc(100% + 32px))';
        this._toggleBtn.textContent = '☰';
        this._toggleBtn.classList.add('sidebar-hidden');
        // Also slide the panel-container if open
        const panel = document.getElementById('panel-container');
        if (panel) panel.style.right = '16px';
      } else {
        this.container.style.transform = 'translateX(0)';
        this._toggleBtn.textContent = '◀';
        this._toggleBtn.classList.remove('sidebar-hidden');
        const panel = document.getElementById('panel-container');
        if (panel) panel.style.right = '';
      }
    });
  }

  render() {
    const state = this.store.getState();

    const planetsHtml = state.planets.map(p => `
      <div class="planet-item interactive-item glass-surface" data-id="${p.id}"
        style="padding: var(--space-2); margin-bottom: var(--space-1); display: flex;
               justify-content: space-between; align-items: center;
               border: 1px solid ${state.selectedId === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${p.color || '#fff'};
            box-shadow: 0 0 6px ${p.color || '#fff'}55;"></div>
          <span style="font-size:13px;">${p.name}</span>
        </div>
        ${p.moons && p.moons.length > 0
          ? `<span class="caption" style="opacity:0.4;font-size:11px;">${p.moons.length}🌙</span>`
          : ''}
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="sidebar glass-panel" style="padding: var(--space-3); color: var(--text);
        display: flex; flex-direction: column; height: 100%; overflow: hidden;">

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
          <h2 class="h2" style="color: var(--primary-lt); font-size:16px;">🌌 Solar System</h2>
          <span class="caption" style="opacity:0.4;">${state.planets.length} bodies</span>
        </div>

        <div id="planet-list" style="flex: 1; overflow-y: auto; padding-right: 2px; min-height: 0;">
          ${planetsHtml}
        </div>

        <button id="add-planet-btn" class="btn-secondary"
          style="width: 100%; margin-top: var(--space-3); font-size:13px; padding:8px;">
          + Add Planet
        </button>

        <!-- Bonus toggles -->
        <div style="margin-top: var(--space-2); display: flex; gap: var(--space-1);">
          <button id="toggle-asteroids-btn" class="bonus-toggle ${this._asteroids ? 'active' : ''}"
            title="Toggle Asteroid Belt">🪨</button>
          <button id="toggle-labels-btn" class="bonus-toggle ${this._labels ? 'active' : ''}"
            title="Toggle Planet Labels">🏷</button>
          <button id="btn-reset-cam" class="bonus-toggle" title="Reset camera view">🏠</button>
        </div>

        <!-- Keyboard hint -->
        <div style="margin-top:var(--space-2); padding:6px 8px; background:rgba(255,255,255,0.03);
          border-radius:var(--radius-sm); font-size:10px; color:rgba(255,255,255,0.3); line-height:1.6;">
          <strong style="color:rgba(255,255,255,0.5)">Navigation shortcuts</strong><br>
          <kbd>F</kbd> focus planet &nbsp;
          <kbd>H</kbd> home &nbsp;
          <kbd>R</kbd> reset &nbsp;<br>
          <kbd>+/-</kbd> zoom &nbsp;
          Double-click planet to focus
        </div>

        <div id="speed-control-container"></div>
      </div>
    `;

    // Speed control
    const speedContainer = this.container.querySelector('#speed-control-container');
    const speedControl = new SpeedControl(speedContainer, this.store);
    speedControl.render();

    // Planet click → select
    this.container.querySelectorAll('.planet-item').forEach(el => {
      el.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_SELECTED', id: el.dataset.id });
      });
    });

    this.container.querySelector('#add-planet-btn').addEventListener('click', () => {
      this.store.dispatch({ type: 'SET_SELECTED', id: 'new' });
    });

    // Asteroid belt toggle
    this.container.querySelector('#toggle-asteroids-btn').addEventListener('click', () => {
      const ss = window._solarSystem;
      if (ss) {
        this._asteroids = ss.toggleAsteroidBelt();
        this.render();
      }
    });

    // Labels toggle
    this.container.querySelector('#toggle-labels-btn').addEventListener('click', () => {
      this._labels = !this._labels;
      const url = new URL(window.location.href);
      if (this._labels) {
        url.searchParams.set('labels', 'true');
      } else {
        url.searchParams.delete('labels');
        const lc = document.getElementById('labels-container');
        if (lc) lc.innerHTML = '';
      }
      window.history.replaceState({}, '', url.toString());
      this.render();
    });

    // Reset camera
    this.container.querySelector('#btn-reset-cam').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('orbit:reset-camera'));
    });
  }
}
