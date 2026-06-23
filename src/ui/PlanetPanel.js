export class PlanetPanel {
  constructor(container, store) {
    this.container = container;
    this.store = store;
  }

  render() {
    const state = this.store.getState();
    const selectedId = state.selectedId;
    
    if (!selectedId) {
      this.container.innerHTML = '';
      return;
    }

    const isNew = selectedId === 'new';
    const planet = isNew ? {
      name: 'New Planet',
      diameterKm: 10000,
      color: '#ffffff',
      orbitalPeriodDays: 365,
      distanceAU: 1,
    } : state.planets.find(p => p.id === selectedId);

    if (!planet) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <div class="planet-panel glass-panel" style="padding: var(--space-4); color: var(--text); height: 100%; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <h2 class="h2">${isNew ? 'Create Planet' : 'Edit Planet'}</h2>
          <button id="close-panel-btn" style="background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <label>
            <span class="caption">Name</span>
            <input type="text" id="planet-name" value="${planet.name}" class="glass-surface" style="width: 100%; color: var(--text); padding: 8px 12px; margin-top: 4px;" />
          </label>
          
          <label>
            <span class="caption">Size (diameter km)</span>
            <input type="range" id="planet-size" min="1000" max="150000" step="1000" value="${planet.diameterKm}" style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-size-val">${planet.diameterKm} km</span>
          </label>
          
          <label>
            <span class="caption">Color</span>
            <input type="color" id="planet-color" value="${planet.color}" style="width: 100%; height: 32px; border: none; background: none; margin-top: 4px; cursor: pointer;" />
          </label>
          
          <label>
            <span class="caption">Orbital Speed (year in days)</span>
            <input type="range" id="planet-speed" min="10" max="1000" value="${planet.orbitalPeriodDays}" style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-speed-val">${planet.orbitalPeriodDays} days</span>
          </label>
          
          <label>
            <span class="caption">Distance (AU)</span>
            <input type="range" id="planet-distance" min="0.1" max="40" step="0.1" value="${planet.distanceAU}" style="width: 100%; margin-top: 4px;" />
            <span class="mono" id="planet-distance-val">${planet.distanceAU} AU</span>
          </label>

          <button id="save-planet-btn" class="btn-primary" style="margin-top: var(--space-2); width: 100%;">
            ${isNew ? 'Create' : 'Save Changes'}
          </button>
          
          ${!isNew ? `
            <button id="delete-planet-btn" class="btn-danger" style="margin-top: var(--space-2); width: 100%;">
              Delete Planet
            </button>

            <hr style="border: 1px solid var(--surface); margin: var(--space-3) 0;" />
            <h3 class="h3">Moons</h3>
            <div id="moon-list" style="margin-top: var(--space-2);">
              ${(planet.moons || []).map((m, i) => `
                <div class="glass-surface" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; font-size: 13px;">
                  <span>${m.name} <span class="caption">(${m.diameterKm}km)</span></span>
                  <button class="delete-moon-btn btn-danger" data-index="${i}" style="padding: 2px 8px; font-size: 16px;">&times;</button>
                </div>
              `).join('')}
              ${(!planet.moons || planet.moons.length === 0) ? '<div class="caption">No moons</div>' : ''}
            </div>
            <button id="add-moon-btn" class="btn-secondary" style="margin-top: var(--space-2); width: 100%;">+ Add Random Moon</button>
          ` : ''}
        </div>
      </div>
    `;

    // Real-time update labels
    this.container.querySelector('#planet-size').addEventListener('input', (e) => {
      this.container.querySelector('#planet-size-val').textContent = `${e.target.value} km`;
    });
    this.container.querySelector('#planet-speed').addEventListener('input', (e) => {
      this.container.querySelector('#planet-speed-val').textContent = `${e.target.value} days`;
    });
    this.container.querySelector('#planet-distance').addEventListener('input', (e) => {
      this.container.querySelector('#planet-distance-val').textContent = `${e.target.value} AU`;
    });

    this.container.querySelector('#close-panel-btn').addEventListener('click', () => {
      this.store.dispatch({ type: 'SET_SELECTED', id: null });
    });

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
        this.store.dispatch({ type: 'ADD_PLANET', payload: data });
        this.store.dispatch({ type: 'SET_SELECTED', id: null });
      } else {
        this.store.dispatch({ type: 'UPDATE_PLANET', id: selectedId, payload: data });
      }
    });

    const deleteBtn = this.container.querySelector('#delete-planet-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this planet?')) {
          this.store.dispatch({ type: 'DELETE_PLANET', id: selectedId });
        }
      });
    }

    const addMoonBtn = this.container.querySelector('#add-moon-btn');
    if (addMoonBtn) {
      addMoonBtn.addEventListener('click', () => {
        const moons = planet.moons ? [...planet.moons] : [];
        moons.push({
          id: 'moon_' + Date.now(),
          name: 'Moon ' + (moons.length + 1),
          diameterKm: Math.floor(Math.random() * 3000 + 1000),
          distancePlanetKm: Math.floor(Math.random() * 200000 + 100000),
          orbitalPeriodDays: Math.random() * 30 + 10,
          color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
        });
        
        this.store.dispatch({
          type: 'UPDATE_PLANET',
          id: selectedId,
          payload: { moons }
        });
      });
    }

    this.container.querySelectorAll('.delete-moon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const moons = [...planet.moons];
        moons.splice(index, 1);
        this.store.dispatch({
          type: 'UPDATE_PLANET',
          id: selectedId,
          payload: { moons }
        });
      });
    });
  }
}