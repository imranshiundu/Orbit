export class Planet {
  constructor(data) {
    this.name = data.name;
    this.diameter = data.diameter;
    this.color = data.color;
    this.orbitalSpeed = data.orbitalSpeed;
    this.distance = data.distance;
    this.moons = [];
    
    // Three.js mesh to be initialized
    this.mesh = null;
    this.orbitPath = null;
  }

  update(deltaTime, speedMultiplier) {
    // Rotation and orbit logic
  }

  addMoon(moonData) {
    // Logic to add moon
  }
}
