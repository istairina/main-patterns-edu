const { Command, Movement, Rotation, CheckFuelCommand, BurnFuelCommand } = require('./simple-commands');
const { MovableObject } = require('./objects');


class Tank {
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


class CommandException extends Error { }

class MacroCommand extends Command {
  constructor(commands) {
    super();
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

class DirectMovement extends MacroCommand {
  constructor(fuel, tank, spaceObject) {
    super();
    this.fuel = fuel;
    this.tank = tank;
    this.spaceObject = spaceObject;

    this.commands = [
      new CheckFuelCommand(this.tank, this.fuel),
      new Movement(this.spaceObject),
      new BurnFuelCommand(this.tank, this.fuel),
    ];
  }
}


// ручное тестирование
const tank = new Tank(100);
const spaceObject = new MovableObject();
spaceObject.setPosition({ x: 1, y: 1 });
spaceObject.setVelocity({ x: 10, y: 1 });

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
  CommandException,
  MacroCommand,
  Tank,
  DirectMovement
};
