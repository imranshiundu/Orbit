import { MoonPanel } from './MoonPanel.js';

export class PlanetPanel {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this._isDragging = false;
    this._lastRenderedId = null;

    // Moon sub-panel mounted next to the planet panel
    // The moon panel container is injected into main.js's #panel-container area
    // We create a sibling div for it dynamically.
    this._moonPanelContainer = document.createElement('div');
    this._moonPanelContainer.style.cssText =
      'position: absolute; top: var(--space-4); right: calc(640px + var(--space-4) * 3); bottom: var(--space-4); width: 300px; pointer-events: none;';
    document.body.appendChild(this._moonPanelContainer);
    this._moonPanel = new MoonPanel(this._moonPanelContainer, store);
  }

  render() {
    const state = this.store.getState();
    const selectedId = state.selectedId;

    if (!selectedId) {
      this._isDragging = false;
      this._lastRenderedId = null;
      this.container.innerHTML = '';
      this.container.style.pointerEvents = 'none';
      this._moonPanel.close();
      return;
    }

    this.container.style.pointerEvents = 'auto';

    // Skip full re-render while a slider is being dragged
    if (this._isDragging && this._lastRenderedId === selectedId) {
      return;
    }

    const isNew = selectedId === 'new';
    const planet = isNew ? {
      name: 'New Planet',
      diameterKm: 10000,
      color: '#ffffff',
      orbitalPeriodDays: 365,
      distanceAU: 1,
      moons: [],
    } : state.planets.find(p => p.id === selectedId);

    if (!planet) {
      this.container.innerHTML = '';
      return;
    }

    this._lastRenderedId = selectedId;

    this.container.innerHTML = `
      <div class="planet-panel glass-panel" style="padding: var(--space-4); color: var(--text); height: 100%; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <h2 class="h2">${isNew ? 'Create Planet' : 'Edit Planet'}</h2>
          <button id="close-panel-btn" style="background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <label>
            <span class="caption">Name</span>
            <input type="text" id="planet-name" value="${planet.name}" class="glass-surface"
              style="width: 100%; color: var(--text); padding: 8px 12px; margin-top: 4px;" />
          </label>

          <label>
            <span class="caption">Size (diameter km)</span>
            <input type="range" id="planet-size" min="1000" max="150000" step="1000" value="${planet.diameterKm}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-size-val">${planet.diameterKm} km</span>
          </label>

          <label>
            <span class="caption">Color</span>
            <input type="color" id="planet-color" value="${planet.color}"
              style="width: 100%; height: 32px; border: none; background: none; margin-top: 4px; cursor: pointer;" />
          </label>

          <label>
            <span class="caption">Orbital Speed (year in days)</span>
            <input type="range" id="planet-speed" min="10" max="1000" value="${planet.orbitalPeriodDays}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-speed-val">${planet.orbitalPeriodDays} days</span>
          </label>

          <label>
            <span class="caption">Distance (AU)</span>
            <input type="range" id="planet-distance" min="0.1" max="40" step="0.1" value="${planet.distanceAU}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-distance-val">${planet.distanceAU} AU</span>
          </label>

          <button id="save-planet-btn" class="btn-primary" style="margin-top: var(--space-2); width: 100%;">
            ${isNew ? 'Create' : 'Save Changes'}
          </button>

          ${!isNew ? `
            <button id="delete-planet-btn" class="btn-danger" style="margin-top: var(--space-1); width: 100%;">
              Delete Planet
            </button>

            <hr style="border: 1px solid var(--surface); margin: var(--space-3) 0;" />
            <h3 class="h3">Moons</h3>
            <div id="moon-list" style="margin-top: var(--space-2);">
              ${(planet.moons || []).map((m, i) => `
                <div class="glass-surface moon-edit-item" data-index="${i}"
                  style="display: flex; justify-content: space-between; align-items: center;
                         padding: 8px 12px; margin-bottom: 6px; font-size: 13px; cursor: pointer;">
                  <span>
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
                      background:${m.color || '#aaa'};margin-right:6px;"></span>
                    ${m.name} <span class="caption">(${m.diameterKm} km)</span>
                  </span>
                  <div style="display:flex;gap:6px;">
                    <button class="edit-moon-btn btn-secondary" data-index="${i}"
                      style="padding: 2px 8px; font-size: 12px;">✏️</button>
                    <button class="delete-moon-btn btn-danger" data-index="${i}"
                      style="padding: 2px 8px; font-size: 16px;">&times;</button>
                  </div>
                </div>
              `).join('')}
              ${(!planet.moons || planet.moons.length === 0)
                ? '<div class="caption">No moons yet</div>'
                : ''}
            </div>
            <button id="add-moon-btn" class="btn-secondary" style="margin-top: var(--space-2); width: 100%;">
              + Add Moon
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // ── Slider drag guard ──────────────────────────────────────────────────
    ['planet-size', 'planet-speed', 'planet-distance'].forEach(id => {
      const el = this.container.querySelector(`#${id}`);
      if (!el) return;
      el.addEventListener('mousedown', () => { this._isDragging = true; });
      el.addEventListener('touchstart', () => { this._isDragging = true; }, { passive: true });
      el.addEventListener('mouseup',   () => { this._isDragging = false; });
      el.addEventListener('touchend',  () => { this._isDragging = false; });
      el.addEventListener('input', (e) => {
        const unit = id === 'planet-size' ? 'km' : id === 'planet-speed' ? 'days' : 'AU';
        const valEl = this.container.querySelector(`#${id}-val`);
        if (valEl) valEl.textContent = `${e.target.value} ${unit}`;
      });
    });
    window.addEventListener('mouseup', () => { this._isDragging = false; }, { once: true });

    // ── Close ────────────────────────────────────────────────────────────────
    this.container.querySelector('#close-panel-btn').addEventListener('click', () => {
      this._isDragging = false;
      this._moonPanel.close();
      this.store.dispatch({ type: 'SET_SELECTED', id: null });
    });

    // ── Save planet ───────────────────────────────────────────────────────────
    this.container.querySelector('#save-planet-btn').addEventListener('click', () => {
      const data = {
        name: this.container.querySelector('#planet-name').value,
        diameterKm: parseFloat(this.container.querySelector('#planet-size').value),
        color: this.container.querySelector('#planet-color').value,
        orbitalPeriodDays: parseFloat(this.container.querySelector('#planet-speed').value),
        distanceAU: parseFloat(this.container.querySelector('#planet-distance').value),
      };

      if (isNew) {
        data.id = 'planet_' + Date.now();
        data.moons = [];
        this.store.dispatch({ type: 'ADD_PLANET', payload: data });
        this.store.dispatch({ type: 'SET_SELECTED', id: null });
      } else {
        const currentPlanet = this.store.getState().planets.find(p => p.id === selectedId);
        if (currentPlanet) data.moons = currentPlanet.moons || [];
        this.store.dispatch({ type: 'UPDATE_PLANET', id: selectedId, payload: data });
      }
    });

    // ── Delete planet ─────────────────────────────────────────────────────────
    const deleteBtn = this.container.querySelector('#delete-planet-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this planet?')) {
          this._moonPanel.close();
          this.store.dispatch({ type: 'DELETE_PLANET', id: selectedId });
        }
      });
    }

    // ── Add moon → open MoonPanel in 'new' mode ───────────────────────────────
    const addMoonBtn = this.container.querySelector('#add-moon-btn');
    if (addMoonBtn) {
      addMoonBtn.addEventListener('click', () => {
        this._moonPanel.open(selectedId, 'new');
      });
    }

    // ── Edit moon ─────────────────────────────────────────────────────────────
    this.container.querySelectorAll('.edit-moon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this._moonPanel.open(selectedId, index);
      });
    });

    // ── Delete moon (inline, no MoonPanel needed) ─────────────────────────────
    this.container.querySelectorAll('.delete-moon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        if (!confirm('Delete this moon?')) return;
        const currentPlanet = this.store.getState().planets.find(p => p.id === selectedId);
        const moons = [...(currentPlanet?.moons || [])];
        moons.splice(index, 1);
        // _moonsOnly → patches in-place, no freeze
        this.store.dispatch({ type: 'UPDATE_PLANET', id: selectedId, payload: { moons }, _moonsOnly: true });
      });
    });
  }
}