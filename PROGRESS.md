# Orbit - Build Progress

This document tracks the current state of the repository, detailing what has been structured, what is partially coded, and what remains to be built according to the Master Build Plan.

## 🏗️ What is Built & Structured So Far

### 1. Foundation & Architecture
- **Git History**: Chronological, well-documented git timeline simulating progressive builds.
- **Repository Skeleton**: All directories and files mapped out identically to the architecture diagram (`src/core`, `src/ui`, `src/utils`, `src/data`, `src/assets`).
- **Configuration**: `package.json` with dependencies mapped (`three`, `vite`), and `vite.config.js` set up for dev server and build.
- **HTML/CSS Entry**: `index.html` shell mounting `#app` and `style.css` configured with exact Design System tokens.
- **Data Source**: `planets.json` created with default schema (Earth & Moon).

### 2. Design System (`src/style.css`)
Fully implemented CSS Custom Properties containing:
- Complete color palette (Space, Panel, Surface, Primary, Sun, Warm, Cool, etc.).
- Typography scale (h1, h2, h3, body, caption, mono).
- Spacing scale variables (4px to 48px).
- Border radius variables (sm, md, lg, pill).

### 3. State Management (`src/store.js`)
- Full robust `EventEmitter` pattern implemented.
- Handles UI actions via `store.dispatch(action)`.
- Implements Redux-like flow: `SET_PLANETS`, `ADD_PLANET`, `UPDATE_PLANET`, `DELETE_PLANET`, `SET_SPEED`, `SET_PAUSED`, `SET_SELECTED`, `SET_HOVERED`.
- State shape holds `planets[]`, `speed`, `paused`, `selectedId`, and `hoveredId`.

### 4. Basic Core Scaffolds (Partially Coded)
- `Planet.js` & `Moon.js`: Initial classes with data passing and `update()` methods.
- `Sun.js`: Initial class to hold mesh and point light initialization.
- `SolarSystem.js`: Orchestrator class holding Sun and arrays of Planets.
- `Animator.js`: requestAnimationFrame loop with `deltaTime` calculation stubbed.
- `Sidebar.js`: Initial UI component setup injected into the DOM.
- `main.js`: Basic bootstrapper.

## 🚧 What is Left to Build (Next Phases)

### Phase 1: Scene Skeleton
- Set up `scene.js` to initialize Three.js `WebGLRenderer`, `Scene`, `PerspectiveCamera`, and `OrbitControls`.
- Wire `scene.js` to `main.js`.
- Add `AmbientLight` to scene.

### Phase 2: Core Render Logic
- Fill out `SolarSystem.js` and `Planet.js` to instantiate actual Three.js geometries and materials.
- Implement the scaling logic inside `utils/scaling.js` (`scaleDistance` and `scaleSize`).
- Draw the `OrbitPath` rings.

### Phase 3: Textures and Assets
- Implement `TextureLoader.js` singleton.
- Map Earth's texture and implement axial tilt / self-rotation inside `Planet.js`.
- Bring in the other default planets from `planets.json`.

### Phase 4: Moons Integration
- Connect `Moon.js` into `Planet.js` pivot groups.
- Set up the nested orbiting logic.

### Phase 5: UI & CRUD Interactivity
- Build out `PlanetPanel.js` form with the ranges and sliders.
- Build out `SpeedControl.js` (Play/Pause, Speed slider).
- Build `Sidebar.js` planet list rendering logic syncing directly with `store.js`.
- Wire the UI dispatches to create/delete/update instances in the `SolarSystem`.

### Phase 6: Hover & Interaction
- Implement `utils/raycaster.js` to fire rays on `mousemove`.
- Implement `ui/Tooltip.js` to track `hoveredId` and show planet details.

### Phase 7: Polish & Bonuses
- Star background particle system.
- Saturn rings (`TorusGeometry`).
- Moons panel UI (`MoonPanel.js`).
- Implement bonus flags (Asteroids, Realtime clock).
