const { MovableObject, RotatableObject } = require('./objects');


class Command {
  constructor(func) {
    this.func = func;
  }

  execute() {
    this.func();
  }
}

// каждое движение объекта - это смещение его координат: (x, y) = (x + dx, y + dy)
// перед перемещением добавлены проверки, что объект имеет координаты, скорость
// и является перемещаемым.
class Movement extends Command {

  constructor(movableObject) {
    super();
    this.movableObject = movableObject;

    this.func = () => {
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
}

// Вращение объекта - изменение его угла. Происходит по аналогии с перемещением
class Rotation extends Command {
  constructor(rotatableObj) {
    this.rotatableObj = rotatableObj;

    this.func = (angle) => {
      if (!(this.rotatableObj instanceof RotatableObject)) {
        throw new Error('The object cannot rotate');
      }

      if (angle === undefined) {
        throw new Error('Angle is not set');
      }

      if (this.rotatableObj.x === undefined || this.rotatableObj.y === undefined) {
        throw new Error('Position is not set');
      }

      this.rotatableObj.angle = (this.rotatableObj.angle + angle) % 360;
    }
  }
}

class CheckFuelCommand extends Command {
  constructor(tank, fuelConsumption) {
    super();
    this.tank = tank;
    this.fuelConsumption = fuelConsumption;
    this.func = () => {
      if (this.tank.getFuel() - this.fuelConsumption < 0) {
        throw new Error('Not enough fuel');
      }
    }
  }
}

class BurnFuelCommand extends Command {
  constructor(tank, fuelConsumption) {
    super();
    this.tank = tank;
    this.fuelConsumption = fuelConsumption;

    this.func = () => this.tank.setFuel(this.tank.getFuel() - this.fuelConsumption)
  }
}


module.exports = { Command, Movement, Rotation, CheckFuelCommand, BurnFuelCommand }