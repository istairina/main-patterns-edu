class Move {
  constructor(obj, times) {
    this.obj = obj;
    this.times = times;
  }

  execute() {
    for (let i = 0; i < this.times; i++) {
      this.obj.pos.x += this.obj.vel.x;
      this.obj.pos.y += this.obj.vel.y;
    }

    this.obj.setVelocity = { x: 0, y: 0 };
  }
}

module.exports = { Move }