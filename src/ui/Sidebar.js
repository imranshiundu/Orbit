export class Sidebar {
  constructor(container, store) {
    this.container = container;
    this.store = store;
  }

  render() {
    const state = this.store.getState();
    
    let planetsHtml = state.planets.map(p => `
      <div class="planet-item" data-id="${p.id}" style="padding: var(--space-2); margin-bottom: var(--space-1); background: var(--surface); border-radius: var(--radius-sm); cursor: pointer; display: flex; justify-content: space-between; border: 1px solid ${state.selectedId === p.id ? 'var(--primary)' : 'transparent'};">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${p.color || '#fff'}"></div>
          <span>${p.name}</span>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="sidebar" style="background: var(--panel); border-radius: var(--radius-lg); padding: var(--space-4); color: var(--text); display: flex; flex-direction: column; max-height: 100%; overflow-y: auto;">
        <h2 class="h2" style="margin-bottom: var(--space-3);">Solar System</h2>
        <div id="planet-list" style="flex: 1; overflow-y: auto;">
          ${planetsHtml}
        </div>
        <button id="add-planet-btn" style="background: var(--surface); color: var(--primary-lt); border: 1px solid var(--primary); padding: var(--space-2); border-radius: var(--radius-md); width: 100%; margin-top: var(--space-4); cursor: pointer;">+ Add planet</button>
        <div id="speed-control-container"></div>
      </div>
    `;

    // Speed Control rendering inside Sidebar
    import('./SpeedControl.js').then(({ SpeedControl }) => {
      const speedContainer = this.container.querySelector('#speed-control-container');
      const speedControl = new SpeedControl(speedContainer, this.store);
      speedControl.render();
    });

    this.container.querySelectorAll('.planet-item').forEach(el => {
      el.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_SELECTED', id: el.dataset.id });
      });
    });

    this.container.querySelector('#add-planet-btn').addEventListener('click', () => {
      this.store.dispatch({ type: 'SET_SELECTED', id: 'new' });
    });
  }
}
