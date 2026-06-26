import { SpeedControl } from './SpeedControl.js';

export class Sidebar {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this._asteroids = false;
    this._labels = false;
  }

  render() {
    const state = this.store.getState();

    const planetsHtml = state.planets.map(p => `
      <div class="planet-item interactive-item glass-surface" data-id="${p.id}"
        style="padding: var(--space-2); margin-bottom: var(--space-1); display: flex;
               justify-content: space-between; align-items: center;
               border: 1px solid ${state.selectedId === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${p.color || '#fff'}"></div>
          <span>${p.name}</span>
        </div>
        ${p.moons && p.moons.length > 0
          ? `<span class="caption" style="opacity:0.5;">${p.moons.length} moon${p.moons.length > 1 ? 's' : ''}</span>`
          : ''}
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="sidebar glass-panel" style="padding: var(--space-4); color: var(--text); display: flex; flex-direction: column; height: 100%;">
        <h2 class="h2" style="margin-bottom: var(--space-3); color: var(--primary-lt);">Solar System</h2>
        <div id="planet-list" style="flex: 1; overflow-y: auto; padding-right: 4px;">
          ${planetsHtml}
        </div>
        <button id="add-planet-btn" class="btn-secondary" style="width: 100%; margin-top: var(--space-4);">+ Add Planet</button>

        <!-- ── Bonus feature toggles ── -->
        <div style="margin-top: var(--space-3); display: flex; gap: var(--space-2);">
          <button id="toggle-asteroids-btn" title="Toggle Asteroid Belt"
            style="flex:1; padding: 6px; font-size: 12px; cursor: pointer;
                   background: ${this._asteroids ? 'var(--primary)' : 'rgba(255,255,255,0.06)'};
                   border: 1px solid ${this._asteroids ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
                   border-radius: var(--radius-sm); color: var(--text);">
            🪨 Asteroids
          </button>
          <button id="toggle-labels-btn" title="Toggle Planet Labels"
            style="flex:1; padding: 6px; font-size: 12px; cursor: pointer;
                   background: ${this._labels ? 'var(--primary)' : 'rgba(255,255,255,0.06)'};
                   border: 1px solid ${this._labels ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
                   border-radius: var(--radius-sm); color: var(--text);">
            🏷 Labels
          </button>
        </div>

        <div id="speed-control-container"></div>
      </div>
    `;

    // Speed control (static import, no more dynamic import race)
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

    // ── Bonus: Asteroid Belt toggle ──────────────────────────────────────────
    this.container.querySelector('#toggle-asteroids-btn').addEventListener('click', () => {
      const ss = window._solarSystem;
      if (ss) {
        this._asteroids = ss.toggleAsteroidBelt();
        // Re-render sidebar to update button state
        this.render();
      }
    });

    // ── Bonus: Labels toggle ─────────────────────────────────────────────────
    this.container.querySelector('#toggle-labels-btn').addEventListener('click', () => {
      this._labels = !this._labels;
      // Drive the existing label system via URL param simulation
      const url = new URL(window.location.href);
      if (this._labels) {
        url.searchParams.set('labels', 'true');
      } else {
        url.searchParams.delete('labels');
        // Clear existing label elements
        const container = document.getElementById('labels-container');
        if (container) container.innerHTML = '';
      }
      window.history.replaceState({}, '', url.toString());
      this.render();
    });
  }
}
