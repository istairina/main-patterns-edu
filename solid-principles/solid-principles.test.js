const {
  UObject,
  MovableObject,
  Movement,
  Rotation,
  CheckFuelCommand,
  BurnFuelCommand,
  CommandException,
  MacroCommand,
  Fuel,
  Command,
  DirectMovement
} = require('./solid-principles');

describe('SpaceObjects used SOLID principles', () => {
  const movement = new Movement();
  const rotation = new Rotation();

  it('should move movable object', () => {
    const spaceObject = new MovableObject();

    spaceObject.setPosition({ x: 12, y: 5 });
    spaceObject.setVelocity({ x: -7, y: 3 });
    movement.move(spaceObject);
    expect(spaceObject.getPosition()).toEqual({ x: 5, y: 8 });
  });

  it('throw exception if position is not set', () => {
    const spaceObject = new MovableObject();
    spaceObject.setVelocity({ x: -7, y: 3 });
    expect(() => movement.move(spaceObject)).toThrow('Position is not set');
  });

  it('throw exception if velocity is not set', () => {
    const spaceObject = new MovableObject();
    spaceObject.setPosition({ x: 12, y: 5 });
    expect(() => movement.move(spaceObject)).toThrow('Velocity is not set');
  });

  it('throw exception if object is not moveble', () => {
    const someObject = new UObject();
    expect(() => movement.move(someObject)).toThrow('The object cannot move');
  });

  it('should rotate movable object', () => {
    const spaceObject = new MovableObject();

    spaceObject.setPosition({ x: 12, y: 5 });

    rotation.rotate(spaceObject, 180);
    expect(spaceObject.getAngle()).toBe(180);

    rotation.rotate(spaceObject, 180);
    expect(spaceObject.getAngle()).toBe(0);
  });

  it('throw exception if object is not rotatable', () => {
    const someObject = new UObject();
    expect(() => rotation.rotate(someObject, 180)).toThrow(
      'The object cannot rotate'
    );
  });

  it('throw exception if angle is not set', () => {
    const spaceObject = new MovableObject();
    expect(() => rotation.rotate(spaceObject)).toThrow('Angle is not set');
  });
});

describe('Use Fuel commands', () => {
  let tank;

  beforeEach(() => {
    tank = new Fuel(100);
  });

  it('should burn fuel', () => {
    const burnFuelCommand = new BurnFuelCommand(tank);
    burnFuelCommand.burn(50);
    expect(tank.getFuel()).toBe(50);
  });

  it('should throw exception if not enough fuel', () => {
    const checkFuelCommand = new CheckFuelCommand(tank);
    expect(() => checkFuelCommand.check(150)).toThrow('Not enough fuel');
  });

  it("shouldn't throw exception if enough fuel", () => {
    const tank = new Fuel(100);
    const checkFuelCommand = new CheckFuelCommand(tank);
    checkFuelCommand.check(50);
    expect(() => checkFuelCommand.check(50)).not.toThrow();
  });

  it("should move directly and consume fuel", () => {
    const movableObject = new MovableObject();
    movableObject.setPosition({ x: 0, y: 0 });
    movableObject.setVelocity({ x: 1, y: 1 });

    const tank = new Fuel(100);
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

    const tank = new Fuel(100);
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
