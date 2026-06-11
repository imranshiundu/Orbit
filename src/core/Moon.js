export class Moon {
  constructor(data, parentPlanet) {
    this.name = data.name;
    this.diameter = data.diameter;
    this.color = data.color;
    this.orbitalSpeed = data.orbitalSpeed;
    this.distance = data.distance;
    this.parentPlanet = parentPlanet;
    
    // Three.js mesh to be initialized
    this.mesh = null;
  }

  update(deltaTime, speedMultiplier) {
    // Rotation and orbit logic around parent planet
  }
}
