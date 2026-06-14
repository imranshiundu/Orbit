export class Sidebar {
  constructor(container, state) {
    this.container = container;
    this.state = state;
  }

  render() {
    this.container.innerHTML = `
      <div class="sidebar" style="background: var(--panel); border-radius: var(--radius-lg); padding: var(--space-4); color: var(--text);">
        <h2 class="h2">Solar System</h2>
        <div id="planet-list"></div>
        <button id="add-planet-btn" style="background: var(--surface); color: var(--primary-lt); border: 1px solid var(--primary); padding: var(--space-2); border-radius: var(--radius-md); width: 100%; margin-top: var(--space-4);">+ Add planet</button>
      </div>
    `;
  }
}
