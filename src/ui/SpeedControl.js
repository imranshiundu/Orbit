export class SpeedControl {
  constructor(container, store) {
    this.container = container;
    this.store = store;
  }

  render() {
    const state = this.store.getState();
    this.container.innerHTML = `
      <div style="background: var(--panel); border-radius: var(--radius-md); padding: var(--space-3); margin-top: var(--space-3); display: flex; align-items: center; gap: var(--space-3);">
        <button id="play-pause-btn" style="background: var(--surface); color: var(--text); border: none; padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer;">
          ${state.paused ? '▶ Play' : '⏸ Pause'}
        </button>
        <div style="flex: 1; display: flex; align-items: center; gap: var(--space-2);">
          <span class="caption">Speed</span>
          <input type="range" id="speed-slider" min="0" max="5" step="0.1" value="${state.speed}" style="flex: 1;" />
          <span class="mono" style="min-width: 30px;">${state.speed.toFixed(1)}x</span>
        </div>
      </div>
    `;

    this.container.querySelector('#play-pause-btn').addEventListener('click', () => {
      this.store.dispatch({ type: 'SET_PAUSED', payload: !this.store.getState().paused });
    });

    this.container.querySelector('#speed-slider').addEventListener('input', (e) => {
      this.store.dispatch({ type: 'SET_SPEED', payload: parseFloat(e.target.value) });
    });
  }
}