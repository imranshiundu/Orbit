class Store {
  constructor() {
    this.state = {
      planets: [],
      speed: 1.0,
      paused: false,
      selectedId: null,
      hoveredId: null
    };
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload));
    }
  }

  dispatch(action) {
    switch (action.type) {
      case 'SET_PLANETS':
        this.state.planets = action.payload;
        break;
      case 'ADD_PLANET':
        this.state.planets.push(action.payload);
        break;
      case 'UPDATE_PLANET':
        const index = this.state.planets.findIndex(p => p.id === action.id);
        if (index > -1) {
          this.state.planets[index] = { ...this.state.planets[index], ...action.payload };
        }
        break;
      case 'DELETE_PLANET':
        this.state.planets = this.state.planets.filter(p => p.id !== action.id);
        if (this.state.selectedId === action.id) this.state.selectedId = null;
        if (this.state.hoveredId === action.id) this.state.hoveredId = null;
        break;
      case 'SET_SPEED':
        this.state.speed = action.payload;
        break;
      case 'SET_PAUSED':
        this.state.paused = action.payload;
        break;
      case 'SET_SELECTED':
        this.state.selectedId = action.id;
        break;
      case 'SET_HOVERED':
        this.state.hoveredId = action.id;
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
        return;
    }
    
    this.emit('change', this.state);
    this.emit(action.type, action);
  }

  getState() {
    return this.state;
  }
}

export const store = new Store();
