const { Command, Movement, Rotation, CheckFuelCommand, BurnFuelCommand } = require('./simple-commands');
const { UObject, MovableObject } = require('./objects');
const { Tank, MacroCommand, DirectMovement, CommandException } = require('./solid-principles')

describe('SpaceObjects used SOLID principles', () => {
  let spaceObject;
  let movement;

  beforeEach(() => {
    spaceObject = new MovableObject();
    movement = new Movement(spaceObject);
  })

  it('should move movable object', () => {
    spaceObject.setPosition({ x: 12, y: 5 });
    spaceObject.setVelocity({ x: -7, y: 3 });
    movement.execute();

    expect(spaceObject.getPosition()).toEqual({ x: 5, y: 8 });
  });

  it('throw exception if position is not set', () => {
    spaceObject.setVelocity({ x: -7, y: 3 });
    expect(() => movement.execute()).toThrow('Position is not set');
  });

  it('throw exception if velocity is not set', () => {
    spaceObject.setPosition({ x: 12, y: 5 });

    expect(() => movement.execute()).toThrow('Velocity is not set');
  });

  it('throw exception if object is not movable', () => {
    const someObject = new UObject();
    const movement2 = new Movement(someObject);

    expect(() => movement2.execute()).toThrow('The object cannot move');
  });
});

describe('Use Fuel commands', () => {
  let tank;

  beforeEach(() => {
    tank = new Tank(100);
  });

  it('should burn fuel', () => {
    const burnFuelCommand = new BurnFuelCommand(tank, 50);
    burnFuelCommand.execute();

    expect(tank.getFuel()).toBe(50);
  });

  it('should throw exception if not enough fuel', () => {
    const checkFuelCommand = new CheckFuelCommand(tank, 150);
    expect(() => checkFuelCommand.execute()).toThrow('Not enough fuel');
  });

  it("shouldn't throw exception if enough fuel", () => {
    const checkFuelCommand = new CheckFuelCommand(tank, 50);

    expect(() => checkFuelCommand.execute()).not.toThrow();
  });

  it("should move directly and consume fuel", () => {
    const movableObject = new MovableObject();
    movableObject.setPosition({ x: 0, y: 0 });
    movableObject.setVelocity({ x: 1, y: 1 });

    const directMovement = new DirectMovement(10, tank, movableObject);

    for (let i = 0; i < 5; i += 1) {
      directMovement.execute();
    }

    const currFuel = tank.getFuel();

    expect(currFuel).toEqual(50);
  })

  it("should move directly, stop and send message if it is not enough fuel", () => {
    const movableObject = new MovableObject();
    movableObject.setPosition({ x: 0, y: 0 });
    movableObject.setVelocity({ x: 1, y: 1 });

    const directMovement = new DirectMovement(50, tank, movableObject);

    let error;

    for (let i = 0; i < 5; i += 1) {
      try {
        directMovement.execute();
      } catch (e) {
        error = e.message;
      }
    }

    const currFuel = tank.getFuel();
    const currPosX = movableObject.getPosition().x

    expect(currFuel).toEqual(0);
    expect(error).toEqual('Not enough fuel');
    expect(currPosX).toEqual(2);
  })
});


describe('Macrocommand', () => {
  it('macrocommand execute all commands', () => {
    let val = 5;
    const command1 = new Command(() => val++);
    const command2 = new Command(() => val++);
    const command3 = new Command(() => val++);
    const command4 = new Command(() => val++);

    const macrocommand = new MacroCommand([command1, command2, command3, command4]);
    macrocommand.execute()

    expect(val).toEqual(9);
  })

  it('macrocommand throw CommandException and break execute', () => {
    let val = 5;
    const command1 = new Command(() => val++);
    const command2 = new Command(() => { throw new Error("Some error") });
    const command3 = new Command(() => val++);
    const command4 = new Command(() => val++);

    const macrocommand = new MacroCommand([command1, command2, command3, command4]);
    expect(() => macrocommand.execute()).toThrow(expect.any(CommandException))
    expect(val).toEqual(6);
  })
})
