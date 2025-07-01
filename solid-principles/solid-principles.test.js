const {
  MovableObject,
  UObject,
  Movement,
  Rotation,
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
    expect(() => rotation.rotate(someObject, 180)).toThrow('The object cannot rotate');
  });

  it('throw exception if angle is not set', () => {
    const spaceObject = new MovableObject();
    expect(() => rotation.rotate(spaceObject)).toThrow('Angle is not set');
  });
});
