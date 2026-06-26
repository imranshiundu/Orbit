/**
 * MoonPanel — full CRUD editor for a moon belonging to a planet.
 *
 * Usage: mount into a container, call render(planetId, moonIndex | 'new')
 * It dispatches UPDATE_PLANET with _moonsOnly:true so the 3D scene
 * patches moons in-place without a full planet rebuild.
 */
export class MoonPanel {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this._isDragging = false;
    this._currentPlanetId = null;
    this._currentMoonIndex = null;
  }

  /** Open the panel for editing (index) or creating ('new') a moon on the given planet. */
  open(planetId, moonIndex) {
    this._currentPlanetId = planetId;
    this._currentMoonIndex = moonIndex;
    this._render();
  }

  close() {
    this._currentPlanetId = null;
    this._currentMoonIndex = null;
    this.container.innerHTML = '';
  }

  _render() {
    const planetId = this._currentPlanetId;
    const moonIndex = this._currentMoonIndex;
    if (!planetId) { this.container.innerHTML = ''; return; }

    const state = this.store.getState();
    const planet = state.planets.find(p => p.id === planetId);
    if (!planet) { this.container.innerHTML = ''; return; }

    const isNew = moonIndex === 'new';
    const moon = isNew
      ? { name: 'New Moon', diameterKm: 1500, color: '#b0b0b0', distancePlanetKm: 200000, orbitalPeriodDays: 15 }
      : (planet.moons || [])[moonIndex];

    if (!moon && !isNew) { this.container.innerHTML = ''; return; }

    this.container.innerHTML = `
      <div class="planet-panel glass-panel" style="padding: var(--space-4); color: var(--text); height: 100%; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <h2 class="h2">${isNew ? 'Add Moon' : 'Edit Moon'}</h2>
          <button id="close-moon-panel-btn" style="background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>
        <div class="caption" style="margin-bottom: var(--space-3); opacity: 0.6;">Moon of <strong>${planet.name}</strong></div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <label>
            <span class="caption">Name</span>
            <input type="text" id="moon-name" value="${moon.name}"
              class="glass-surface" style="width: 100%; color: var(--text); padding: 8px 12px; margin-top: 4px;" />
          </label>

          <label>
            <span class="caption">Size (diameter km)</span>
            <input type="range" id="moon-size" min="100" max="10000" step="100" value="${moon.diameterKm}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="moon-size-val">${moon.diameterKm} km</span>
          </label>

          <label>
            <span class="caption">Color</span>
            <input type="color" id="moon-color" value="${moon.color || '#b0b0b0'}"
              style="width: 100%; height: 32px; border: none; background: none; margin-top: 4px; cursor: pointer;" />
          </label>

          <label>
            <span class="caption">Distance from planet (km)</span>
            <input type="range" id="moon-distance" min="10000" max="1000000" step="5000" value="${moon.distancePlanetKm}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="moon-distance-val">${moon.distancePlanetKm.toLocaleString()} km</span>
          </label>

          <label>
            <span class="caption">Orbital period (days)</span>
            <input type="range" id="moon-speed" min="1" max="200" step="1" value="${moon.orbitalPeriodDays}"
              style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="moon-speed-val">${moon.orbitalPeriodDays} days</span>
          </label>

          <button id="save-moon-btn" class="btn-primary" style="margin-top: var(--space-2); width: 100%;">
            ${isNew ? 'Add Moon' : 'Save Changes'}
          </button>

          ${!isNew ? `
            <button id="delete-moon-btn" class="btn-danger" style="margin-top: var(--space-1); width: 100%;">
              Delete Moon
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // ── Slider drag guard ────────────────────────────────────────────────────
    ['moon-size', 'moon-distance', 'moon-speed'].forEach(id => {
      const el = this.container.querySelector(`#${id}`);
      if (!el) return;
      el.addEventListener('mousedown', () => { this._isDragging = true; });
      el.addEventListener('touchstart', () => { this._isDragging = true; }, { passive: true });
      el.addEventListener('mouseup',   () => { this._isDragging = false; });
      el.addEventListener('touchend',  () => { this._isDragging = false; });
      el.addEventListener('input', (e) => {
        const valEl = this.container.querySelector(`#${id}-val`);
        if (!valEl) return;
        if (id === 'moon-distance') {
          valEl.textContent = `${parseInt(e.target.value).toLocaleString()} km`;
        } else if (id === 'moon-speed') {
          valEl.textContent = `${e.target.value} days`;
        } else {
          valEl.textContent = `${e.target.value} km`;
        }
      });
    });
    window.addEventListener('mouseup', () => { this._isDragging = false; }, { once: true });

    // ── Close ────────────────────────────────────────────────────────────────
    this.container.querySelector('#close-moon-panel-btn').addEventListener('click', () => this.close());

    // ── Save ─────────────────────────────────────────────────────────────────
    this.container.querySelector('#save-moon-btn').addEventListener('click', () => {
      const moonData = {
        id: isNew ? ('moon_' + Date.now()) : moon.id,
        name: this.container.querySelector('#moon-name').value.trim() || 'Moon',
        diameterKm: parseFloat(this.container.querySelector('#moon-size').value),
        color: this.container.querySelector('#moon-color').value,
        distancePlanetKm: parseFloat(this.container.querySelector('#moon-distance').value),
        orbitalPeriodDays: parseFloat(this.container.querySelector('#moon-speed').value),
      };

      const currentPlanet = this.store.getState().planets.find(p => p.id === planetId);
      const moons = [...(currentPlanet?.moons || [])];

      if (isNew) {
        moons.push(moonData);
      } else {
        moons[moonIndex] = moonData;
      }

      this.store.dispatch({ type: 'UPDATE_PLANET', id: planetId, payload: { moons }, _moonsOnly: true });
      this.close();
    });

    // ── Delete ────────────────────────────────────────────────────────────────
    const deleteBtn = this.container.querySelector('#delete-moon-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (!confirm('Delete this moon?')) return;
        const currentPlanet = this.store.getState().planets.find(p => p.id === planetId);
        const moons = [...(currentPlanet?.moons || [])];
        moons.splice(moonIndex, 1);
        this.store.dispatch({ type: 'UPDATE_PLANET', id: planetId, payload: { moons }, _moonsOnly: true });
        this.close();
      });
    }
  }
}