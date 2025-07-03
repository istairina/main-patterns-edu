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

class Fuel {
  constructor(fuelCapacity) {
    this.fuel = fuelCapacity;
  }

  getFuel() {
    return this.fuel;
  }

  setFuel(fuel) {
    this.fuel = fuel;
  }
}

class CheckFuelCommand {
  constructor(tank) {
    this.tank = tank;
  }

  check(nessaryFuel) {
    if (this.tank.getFuel() - nessaryFuel < 0) {
      throw new Error('Not enough fuel');
    }
  }
}

class BurnFuelCommand {
  constructor(tank) {
    this.tank = tank;
  }

  burn(fuel) {
    this.tank.setFuel(this.tank.getFuel() - fuel);
  }
}

class Command {
  constructor(func) {
    this.func = func;
  }

  execute() {
    this.func();
  }
}

class CommandException extends Error {}

class MacroCommand {
  constructor(commands) {
    this.commands = commands;
  }

  execute() {
    for (const command of this.commands) {
      try {
        command.execute();
      } catch (e) {
        throw new CommandException(e.message);
      }
    }
  }
}

const tank = new Fuel(100);
const spaceObject = new MovableObject();
spaceObject.setPosition({ x: 1, y: 1 });
spaceObject.setVelocity({ x: 10, y: 1 });


class DirectMovement {
  constructor(fuel, tank, spaceObject) {
    this.fuel = fuel;
    this.tank = tank;
    this.spaceObject = spaceObject;
  }

  execute() {
    const commands = new MacroCommand([
      new Command(() => new CheckFuelCommand(this.tank).check(this.fuel)),
      new Command(() => new Movement().move(this.spaceObject)),
      new Command(() => new BurnFuelCommand(this.tank).burn(this.fuel)),
    ]);
    commands.execute();
  }
}

const directMovement = new DirectMovement(10, tank, spaceObject);

for (let i = 0; i <= 10; i += 1) {
  try {
    directMovement.execute();
    console.log("fuel:", tank.getFuel());
  } catch (e) {
    console.error(e.message);
  }
}


module.exports = {
  UObject,
  MovableObject,
  Movement,
  Rotation,
  CheckFuelCommand,
  BurnFuelCommand,
  CommandException,
  MacroCommand,
  Fuel,
};
