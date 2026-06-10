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

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` to start the development server.

## License
MIT License
