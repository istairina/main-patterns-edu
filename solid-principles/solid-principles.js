class UObject {}

class MovableObject {
  constructor() {
    this.x;
    this.y;
  }
  setPosition({ x, y }) {
    this.x = x;
    this.y = y;
  }
  getPosition() {
    return { x: this.x, y: this.y };
  }

  setVelocity({ x, y }) {
    this.x += x;
    this.y += y;
  }
}

class Move {}

class Rotate {}


module.exports = { UObject, MovableObject, Move, Rotate }