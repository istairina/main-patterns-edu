const { IoC, Move, Vector, MovableAdapter } = require('./factory-pattern');

describe('IoC Container', () => {
  let ioc;

  beforeEach(() => {
    ioc = new IoC();
    ioc.resolve("IoC.Register", "Move", () => new Move(new Vector(0, 0), new Vector(1, 0)));
  });

  test('should register and resolve method', () => {
    const moveInstance = ioc.resolve("Move");

    expect(moveInstance).toBeInstanceOf(Move);
  });

  test('should work with one instance and execute its methods', () => {
    const moveInstance = ioc.resolve("Move");
    moveInstance.execute();
    moveInstance.execute();

    expect(moveInstance.pos.x).toBe(2);
  });

  test('should have separate instances in different scopes', () => {
    ioc.resolve("Scopes.New", "scope1");
    ioc.resolve("Scopes.Current", "scope1");

    const moveInstance1 = ioc.resolve("Move");
    moveInstance1.execute();

    ioc.resolve("Scopes.New", "scope2");
    ioc.resolve("Scopes.Current", "scope2");

    const moveInstance2 = ioc.resolve("Move");

    expect(moveInstance1).not.toBe(moveInstance2);
    expect(moveInstance1.pos.x).toBe(1);
    expect(moveInstance2.pos.x).toBe(0);
  });
});

describe('Adapter', () => {
  let moveInstance;
  let adapter;

  beforeEach(() => {
    moveInstance = new Move(new Vector(0, 0), new Vector(1, 1));
    adapter = new MovableAdapter(moveInstance);
  });

  test('should return initial position', () => {
    const position = adapter.getPosition();

    expect(position).toEqual(new Vector(0, 0));
  });

  test('should return velocity', () => {
    const velocity = adapter.getVelocity();
    expect(velocity).toEqual(new Vector(1, 1));
  });

  test('should change position on set position', () => {
    adapter.setPosition(new Vector(10, 20));
    const position = adapter.getPosition();

    expect(position).toEqual(new Vector(10, 20));
  });
});
