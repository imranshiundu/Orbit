export class SpeedControl {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this._isDragging = false;
  }

  render() {
    const state = this.store.getState();
    const paused = state.paused;
    const speed = state.speed;

    if (this._isDragging) return;

    // Speed presets: label → value
    const presets = [
      { label: '¼×', v: 0.25 },
      { label: '1×', v: 1 },
      { label: '5×', v: 5 },
      { label: '20×', v: 20 },
    ];

    this.container.innerHTML = `
      <div class="speed-bar">
        <button id="play-pause-btn" class="speed-playpause ${paused ? 'paused' : 'playing'}"
          title="${paused ? 'Play' : 'Pause'}">
          ${paused ? '▶' : '⏸'}
        </button>

        <div class="speed-presets">
          ${presets.map(p => `
            <button class="speed-preset ${Math.abs(speed - p.v) < 0.01 && !paused ? 'active' : ''}"
              data-speed="${p.v}" title="${p.label} speed">${p.label}</button>
          `).join('')}
        </div>

        <input type="range" id="speed-slider" class="speed-slider"
          min="0" max="20" step="0.25" value="${speed}"
          title="Speed: ${speed.toFixed(2)}x" />
      </div>
    `;

    // Play / pause
    this.container.querySelector('#play-pause-btn').addEventListener('click', () => {
      this.store.dispatch({ type: 'SET_PAUSED', payload: !this.store.getState().paused });
    });

    // Presets
    this.container.querySelectorAll('.speed-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = parseFloat(btn.dataset.speed);
        this.store.dispatch({ type: 'SET_SPEED', payload: v });
        if (this.store.getState().paused) {
          this.store.dispatch({ type: 'SET_PAUSED', payload: false });
        }
      });
    });

    // Slider
    const slider = this.container.querySelector('#speed-slider');
    slider.addEventListener('mousedown', () => { this._isDragging = true; });
    slider.addEventListener('touchstart', () => { this._isDragging = true; }, { passive: true });
    
    const stopDrag = () => { this._isDragging = false; };
    slider.addEventListener('mouseup', stopDrag);
    slider.addEventListener('touchend', stopDrag);
    window.addEventListener('mouseup', stopDrag);

    slider.addEventListener('input', (e) => {
      this.store.dispatch({ type: 'SET_SPEED', payload: parseFloat(e.target.value) });
    });
  }
}