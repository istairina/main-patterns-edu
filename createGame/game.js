// class Move {
//   constructor(initPos, velocity,) {
//     this.velocity = velocity;
//     this.pos = initPos;
//   }

//   move() {
//     this.pos.x += this.velocity.x;
//     this.pos.y += this.velocity.y;
//   }
// }

class MovableObject {
  constructor(pos, vel = { x: 0, y: 0 }) {
    this.pos = pos;
    this.vel = vel;
  }

  get position() {
    return this.pos;
  }

  setVelocity(newVel) {
    this.vel = newVel;
  }

}

class Game {
  constructor(id) {
    this.id = id;
    this.objects = new Map();
    this.currId = 0;
  }

  addMovableObject() {
    this.currId++;
    this.objects.set(this.currId, new MovableObject({ x: 0, y: 0 }));
  }

  getObj(id) {
    return this.objects.get(id)
  }
}


module.exports = { Game }

