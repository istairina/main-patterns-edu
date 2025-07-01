class UObject {}

class MovableObject {
  constructor() {
    this.x;
    this.y;
    this.velocity;
  }

  setPosition({ x, y }) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  setVelocity({ x, y }) {
    this.velocity = { x, y };
  }

  move() {
    if (!this.x || !this.y) {
      throw new Error('Position is not set');
    }

    if (!this.velocity) {
      throw new Error('Velocity is not set');
    }
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Move {}

class Rotate {}


module.exports = { UObject, MovableObject, Move, Rotate }