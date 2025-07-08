const { IoC, Move } = require('./factory-pattern');

describe('IoC Container', () => {
  let ioc;

  beforeEach(() => {
    ioc = new IoC();
    ioc.resolve("IoC.Register", "Move", () => new Move());
  });

  test('should register and resolve method', () => {
    const moveInstance = ioc.resolve("Move");

    expect(moveInstance).toBeInstanceOf(Move);
  });

  test('should work with one instance and execute its methods', () => {
    const moveInstance = ioc.resolve("Move");
    moveInstance.execute();
    moveInstance.execute();

    expect(moveInstance.pos).toBe(2);
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
    expect(moveInstance1.pos).toBe(1);
    expect(moveInstance2.pos).toBe(0);
  });
});

