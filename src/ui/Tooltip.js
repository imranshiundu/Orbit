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
      <div style="background: var(--surface); border: 1px solid var(--primary); padding: var(--space-2); border-radius: var(--radius-sm); color: var(--text); pointer-events: none; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
        <div style="font-weight: bold; margin-bottom: 4px;">${entity.name}</div>
        <div class="caption">Size: ${entity.diameterKm} km</div>
        <div class="caption">Distance: ${entity.distanceAU !== undefined ? entity.distanceAU + ' AU' : entity.distancePlanetKm + ' km'}</div>
      </div>
    `;
  }
}