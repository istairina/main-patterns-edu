// у любого объекта есть положение в пространстве, значит мы можем узнать эту позицию
// и установаить её.
class UObject {
  constructor() {
    this.x;
    this.y;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  setPosition({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

// объекты, которые могут перемещаться, имеют те же свойства, что и универсальные объекты,
// следовательно наследуемся от класса UObject, но также обладает собственным свойствами
// и методами - скорость и установка скорости.

class MovableObject extends UObject {
  constructor() {
    super();
    this.velocity;
  }

  setVelocity({ x, y }) {
    this.velocity = { x, y };
  }
}

class RotatableObject extends UObject {
  constructor() {
    super();
    this.angle = 0;
  }

  setAngle(angle) {
    this.angle = angle;
  }

  getAngle() {
    return this.angle;
  }
}


module.exports = { UObject, MovableObject, RotatableObject }