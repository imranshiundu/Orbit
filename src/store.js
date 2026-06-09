// Simple reactive state store
const state = {
  planets: [],
  selectedPlanet: null,
  speed: 1.0,
  paused: false
};

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

export function getState() {
  return state;
}

export function updateState(newState) {
  Object.assign(state, newState);
  listeners.forEach(listener => listener(state));
}
