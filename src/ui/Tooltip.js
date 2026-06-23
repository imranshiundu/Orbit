export class Tooltip {
  constructor(container, store) {
    this.container = container;
    this.store = store;

    this.store.on('MOUSE_MOVE', (pos) => {
      this.container.style.transform = `translate(${pos.x + 15}px, ${pos.y + 15}px)`;
    });
  }

  render() {
    const state = this.store.getState();
    const hoveredId = state.hoveredId;

    if (!hoveredId) {
      this.container.innerHTML = '';
      return;
    }

    // It could be a planet or a moon
    let entity = state.planets.find(p => p.id === hoveredId);
    if (!entity) {
      for (const p of state.planets) {
        if (p.moons) {
          const m = p.moons.find(m => m.id === hoveredId);
          if (m) {
            entity = m;
            break;
          }
        }
      }
    }

    if (!entity) return;

    this.container.innerHTML = `
      <div class="glass-panel tooltip-anim" style="padding: var(--space-2) var(--space-3); color: var(--text); pointer-events: none; white-space: nowrap;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--primary-lt);">${entity.name}</div>
        <div class="caption">Size: ${entity.diameterKm} km</div>
        <div class="caption">Distance: ${entity.distanceAU !== undefined ? entity.distanceAU + ' AU' : entity.distancePlanetKm + ' km'}</div>
      </div>
    `;
  }
}