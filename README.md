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
The kids must be able to add, review, change, or delete planets.

**CRUD Flow:**
- **Create**: PlanetPanel form → `store.dispatch({ type: 'ADD_PLANET' })` → `SolarSystem.addPlanet(data)` spawns instance → Sidebar re-renders.
- **Read**: Sidebar lists `store.planets`. Clicking opens PlanetPanel pre-filled.
- **Update**: Edit in place → `store.dispatch({ type: 'UPDATE_PLANET' })` → Planet instance updates mesh and orbit live.
- **Delete**: Trash button → ConfirmModal → `store.dispatch({ type: 'DELETE_PLANET' })` → SolarSystem removes mesh → Sidebar re-renders.
*(Moons follow the same flow but dispatched with a `parentId`.)*

**Planet Editor Fields:**
| Field | Control | Notes |
|---|---|---|
| Name | Text input | Free text |
| Size (diameter km) | Range slider + number | 1,000–140,000 km |
| Color | 7-swatch picker + hex | Drives material tint if no texture |
| Orbital speed | Range slider | Year duration 10–1000 earth days |
| Distance from centre | Range slider + number | 0.3–30 AU |
| Texture (bonus) | Dropdown list | Defaults to color if none |

### Hover for Info
Hovering the cursor over a planet or its orbital path displays:
- Name
- Size
- Distance from the centre of the solar system

## Technical Scene 🌌

### Tech Stack
- **Three.js r160+**: Core 3D rendering.
- **Vite**: Dev server + bundling (fast HMR, zero config).
- **Vanilla JS**: No framework overhead, standard DOM manipulation.
- **CSS Custom Properties**: For the dark space theme.
- **planets.json**: Single source of truth for default planet data.

### State Design (`store.js`)
The store is a plain EventEmitter that holds the source of truth (`planets`, `speed`, `paused`, `selectedId`, `hoveredId`). Any UI action dispatches to the store, mutating it and emitting a `change` event. Both `SolarSystem.js` and all UI components re-render from the same state to avoid prop-drilling.

### Three.js Scene Setup (`scene.js`)
- **AmbientLight**: 0.1 intensity for deep space ambience.
- **Sun Mesh**: SphereGeometry + emissive material + PointLight.
- **Planets**: Each planet has a Pivot Group (for orbit rotation) containing the Planet mesh (axial tilt + self-rotation) and an OrbitPath ring. Moon Pivot Groups are nested within the Planet mesh.
- **Camera**: PerspectiveCamera, initial position `(0, 400, 800)`. OrbitControls used for mouse drag + zoom.

### Scaling Strategy (`scaling.js`)
Logarithmic scaling is used for distances and square-root scaling for sizes to ensure small planets remain visible while preserving the vastness of the solar system:
```javascript
export const scaleDistance = (auValue) => Math.log(auValue + 1) * 120
export const scaleSize     = (kmDiameter) => Math.sqrt(kmDiameter / 12742) * 5 + 1
```

### Animation Loop (`Animator.js`)
Calculates delta time in seconds. `SolarSystem.update(dt)` loops every planet, advancing `pivot.rotation.y` for the orbit and `mesh.rotation.y` for axial spin, scaled by the simulation multiplier.

### Hover Tooltip (`raycaster.js` + `Tooltip.js`)
On `mousemove`, a ray fires from the camera through the mouse position to test intersection against all planet and orbit ring meshes. Hits dispatch `SET_HOVERED`, causing `Tooltip.js` to render planet info at the mouse coordinates.

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

## Implementation Details

### Design System
- **Canvas Theme**: Deep space `#0a0a14` background. No UI chrome on the canvas itself—just stars (particle system), orbits, and planets.
- **Sidebar**: `#0f1025` panel, `#1a1c38` list item backgrounds, `#534AB7` for active/selected states and interactive elements.
- **Primary Accent**: `#534AB7` (purple)—selected planet highlight, active buttons, orbit ring glow on hover, tooltip border.
- **Sun Accent**: `#F5A623`—used only for the Sun and speed control "fast" end.
- **Text**: `#ffffff` at 90% for headings, 65% for body, 40% for captions and labels. Monospace for numeric values.

### Planet Data Schema (`planets.json`)
```json
{
  "id": "earth",
  "name": "Earth",
  "diameterKm": 12742,
  "distanceAU": 1.0,
  "orbitalPeriodDays": 365.25,
  "axialTiltDeg": 23.4,
  "rotationPeriodHours": 24,
  "color": "#6faad4",
  "texture": "earth.jpg",
  "moons": [
    {
      "id": "moon",
      "name": "Moon",
      "diameterKm": 3474,
      "distancePlanetKm": 384400,
      "orbitalPeriodDays": 27.3,
      "color": "#b0aeae",
      "texture": "moon.jpg"
    }
  ]
}
```

## Build Phases
- **Phase 1** — Scene skeleton: Vite setup, Three.js scene, static Sun + one planet orbiting, OrbitControls.
- **Phase 2** — All default planets with real textures, correct scaled sizes and distances, axial tilt, self-rotation.
- **Phase 3** — Moons (Earth's Moon, Jupiter's Galilean moons, Saturn's Titan as defaults).
- **Phase 4** — Sidebar + SpeedControl wired to Animator, play/pause/speed slider.
- **Phase 5** — Planet CRUD via PlanetPanel + store, live 3D update.
- **Phase 6** — Hover raycasting, tooltip component.
- **Phase 7** — Moon CRUD, MoonPanel.
- **Phase 8** — Polish: star particle background, Sun glow sprite, Saturn's rings (TorusGeometry), responsive layout.

## Bonus Ideas (Flag-gated)
- Asteroid belt between Mars and Jupiter (instanced particles, `?asteroids=true` query param).
- Real-time clock mode where simulation time matches actual planetary positions (`?realtime=true`).
- Mission trajectory — draw a line from one planet to another and animate a spacecraft along it.
- Labels always visible — 2D CSS labels anchored to 3D positions via `camera.project()`, toggle on/off.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` to start the development server.

## License
MIT License
