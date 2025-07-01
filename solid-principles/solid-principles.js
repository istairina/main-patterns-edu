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
    this.angle = 0;
  }

  setVelocity({ x, y }) {
    this.velocity = { x, y };
  }

  getAngle() {
    return this.angle;
  }
}

// каждое движение объекта - это смещение его координат: (x, y) = (x + dx, y + dy)
// перед перемещением добавлены проверки, что объект имеет координаты, скорость
// и является перемещаемым. 
class Movement {
  move(movableObject) {
    if (!(movableObject instanceof MovableObject)) {
      throw new Error('The object cannot move');
    }

    if (movableObject.x === undefined || movableObject.y === undefined) {
      throw new Error('Position is not set');
    }

    if (!movableObject.velocity) {
      throw new Error('Velocity is not set');
    }

    movableObject.x += movableObject.velocity.x;
    movableObject.y += movableObject.velocity.y;
  }
}


// Вращение объекта - изменение его угла. Происходит по аналогии с перемещением
class Rotation {
    rotate(movableObject, angle) {
      if (!(movableObject instanceof MovableObject)) {
        throw new Error('The object cannot rotate');
      }

      if (angle === undefined) {
        throw new Error('Angle is not set');
      }
  
      if (movableObject.x === undefined || movableObject.y === undefined) {
        throw new Error('Position is not set');
      }
  
      movableObject.angle = (movableObject.angle + angle) % 360;
    }
}

module.exports = { UObject, MovableObject, Movement, Rotation };
