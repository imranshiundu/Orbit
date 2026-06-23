export class Sidebar {
  constructor(container, store) {
    this.container = container;
    this.store = store;
  }

  render() {
    const state = this.store.getState();
    
    let planetsHtml = state.planets.map(p => `
      <div class="planet-item interactive-item glass-surface" data-id="${p.id}" style="padding: var(--space-2); margin-bottom: var(--space-1); display: flex; justify-content: space-between; border: 1px solid ${state.selectedId === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${p.color || '#fff'}"></div>
          <span>${p.name}</span>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="sidebar glass-panel" style="padding: var(--space-4); color: var(--text); display: flex; flex-direction: column; height: 100%;">
        <h2 class="h2" style="margin-bottom: var(--space-3); color: var(--primary-lt);">Solar System</h2>
        <div id="planet-list" style="flex: 1; overflow-y: auto; padding-right: 4px;">
          ${planetsHtml}
        </div>
        <button id="add-planet-btn" class="btn-secondary" style="width: 100%; margin-top: var(--space-4);">+ Add planet</button>
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
