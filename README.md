# Orbit - Interactive 3D Solar System

![Orbit Application Interface](./assets/orbit-ui.png)

## Overview
Orbit is a web-based, interactive 3D solar system simulator built with Three.js. It allows users to explore celestial bodies, adjust simulation speeds, and view detailed information about planets and moons in real-time.

## Features
- **3D Solar System Simulation:** Rendered using Three.js for a smooth, immersive experience.
- **Interactive UI:** A custom-built sidebar for easy navigation between planets and adjusting simulation speed.
- **Customizable:** Add, edit, and explore custom planets and moons.
- **Responsive Design:** A premium, modern UI designed with a cohesive color palette and dynamic components.

## Tech Stack
- HTML5 / CSS3 (Vanilla)
- JavaScript (ES6+)
- Three.js (3D Rendering Engine)
- Vite (Build Tool)

## Architecture
The application is structured into modular components:
- **Core Engine:** Handles the Three.js scene, rendering loop, and solar system physics.
- **UI Layer:** Manages the DOM-based user interface, overlays, and user interactions.
- **State Management:** A centralized reactive store for syncing 3D scene state with the UI.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://gitea.kood.tech/imranshiundu/orbit.git
   ```
2. Navigate to the project directory:
   ```bash
   cd orbit
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```

### Building for Production
To create a production build:
```bash
npm run build
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.
