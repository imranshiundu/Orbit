# Orbit 🌎 - Interactive 3D Solar System

![Orbit Application Interface](./assets/orbit-ui.png)

## The Situation 👀
Your local school runs an after-school science club. Science is cool, but sometimes kids need a little help to get curious.
To motivate kids to learn more about science, we are creating an interactive model of the solar system to bring space-related concepts to life.

## Functional Requirements 📋
The model provides a realistic experience, with planet sizes and movements scaled accurately to mimic the actual solar system.

### Simulation Speed
Enable the kids to start, stop, speed up, or slow down the simulation.

### CRUD Planets
The kids must be able to add, review, change, or delete planets. For example, to create a new planet between Earth and Mars or make Jupiter really small.

Available slider/input fields:
- Name
- Size (diameter)
- Colour
- Orbital speed (year duration)
- Distance from the centre of the solar system

### Hover for Info
Hovering the cursor over a planet or its orbital path displays:
- Name
- Size
- Distance from the centre of the solar system

## Technical Scene 🌌
- **Web technology:** Built using standard DOM manipulation and Vanilla JS for UI.
- **Scene setup:** A Three.js scene including a camera, lighting, and renderer.
- **Objects:** The Sun, planets, and orbital paths using Three.js geometries and materials.
- **Animation:** Orbital animation for each planet.
- **Scaling:** Planet sizes and distances are scaled proportionally to fit the scene while maintaining realism.
- **User interaction:** Event handling for hover and click actions in 3D space.

## Extra Requirements 📚
- **Real Textures:** Planets feature real textures and rotation (e.g., Earth with distinct landmasses and oceans).
- **Moons:** Kids can see moons orbiting their respective planets, with full CRUD support.

## Architecture

```text
orbit/
├── index.html              ← single HTML shell, mounts canvas + sidebar
├── vite.config.js
├── package.json
└── src/
    ├── main.js             ← bootstraps scene, store, UI, starts rAF
    ├── scene.js            ← Three.js scene, camera, renderer, lights
    ├── store.js            ← reactive state (EventEmitter pattern)
    ├── style.css
    ├── core/
    │   ├── SolarSystem.js  ← manages all celestial bodies, calls update()
    │   ├── Planet.js       ← Mesh, pivot group, orbit, self-rotation
    │   ├── Moon.js         ← child of Planet, same interface
    │   ├── Sun.js          ← PointLight + sphere + lens flare sprite
    │   ├── OrbitPath.js    ← RingGeometry ellipse per planet
    │   ├── Animator.js     ← requestAnimationFrame loop, delta time
    │   └── TextureLoader.js← singleton cache, loads from /assets/textures/
    ├── ui/
    │   ├── Sidebar.js      ← planet list, add button, wires to store
    │   ├── PlanetPanel.js  ← create/edit sliding drawer
    │   ├── MoonPanel.js    ← same for moons, parented to a planet
    │   ├── SpeedControl.js ← play/pause/slider → animator.speed
    │   ├── Tooltip.js      ← follows mouse, shows on hover
    │   └── ConfirmModal.js ← delete confirmation
    ├── utils/
    │   ├── scaling.js      ← logarithmic scale helpers for size + distance
    │   └── raycaster.js    ← mouse → Three.js ray, returns hit object
    ├── data/
    │   └── planets.json    ← name, radius, distance, period, color, texture, moons[]
    └── assets/
        └── textures/       ← sun.jpg, mercury.jpg, venus.jpg … pluto.jpg, moon.jpg
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` to start the development server.

## License
MIT License
