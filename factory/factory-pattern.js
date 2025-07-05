class Move {
  constructor(pos, velocity) {
    this.pos = pos;
    this.velocity = velocity;
  }
  execute() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    console.log('Object has been moved, current position: ', this.pos.x, this.pos.y);
  }
}

class IoC {
  constructor() {
    this.registrations = new Map();
    this.scopes = new Map();
    this.currentScope = null;
  }

  resolve(key, ...args) {
    if (key === 'IoC.Register') {
      const [registerKey, factory] = args;
      this.registrations.set(registerKey, factory);

      return;
    }

    if (key === 'Scopes.New') {
      const [scopeId] = args;
      this.scopes.set(scopeId, new Map());

      return;
    }

    if (key === 'Scopes.Current') {
      const [scopeId] = args;

      if (this.scopes.has(scopeId)) {
        this.currentScope = this.scopes.get(scopeId);
      }

      return;
    }

    if (this.currentScope && this.currentScope.has(key)) {
      return this.currentScope.get(key)(...args);
    }

    if (this.registrations.has(key)) {
      const instance = this.registrations.get(key)(...args);
      if (this.currentScope) {
        this.currentScope.set(key, () => instance);
      }
      return instance;
    }
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class MovableAdapter {
  constructor(obj) {
    this.obj = obj;
  }

  getPosition() {
    const pos = this.obj.pos;
    return new Vector(pos.x, pos.y);
  }

  getVelocity() {
    const vel = this.obj.velocity;
    return new Vector(vel.x, vel.y);
  }

  setPosition(newValue) {
    this.obj.pos.x = newValue.x;
    this.obj.pos.y = newValue.y;
  }
}

const ioc = new IoC();

ioc.resolve(
  'IoC.Register',
  'Move',
  () => new Move(new Vector(0, 0), new Vector(1, 0))
);

ioc.resolve('Scopes.New', 'scope1');
ioc.resolve('Scopes.Current', 'scope1');

const moveInstance = ioc.resolve('Move');

// ioc.resolve('Scopes.New', 'scope2');
// ioc.resolve('Scopes.Current', 'scope2');

// moveInstance.execute();
// moveInstance.execute();
// moveInstance.execute();

// const moveInstance2 = ioc.resolve('Move');

// moveInstance2.execute();

ioc.resolve(
  'IoC.Register',
  'Spaceship.Operations.IMovable:position.get',
  (obj) => new Vector(obj.pos.x, obj.pos.y)
);

ioc.resolve(
  'IoC.Register',
  'Spaceship.Operations.IMovable:velocity.get',
  (obj) => new Vector(obj.velocity.x, obj.velocity.y)
);

ioc.resolve(
  'IoC.Register',
  'Spaceship.Operations.IMovable:position.set',
  (obj, newValue) => ({
    execute: () => {
      obj.pos.x = newValue.x;
      obj.pos.y = newValue.y;
    },
  })
);

ioc.resolve(
  'IoC.Register',
  'Adapter',
  (obj) => new MovableAdapter(obj)
);

const adapter = ioc.resolve('Adapter', moveInstance);

adapter.setPosition(new Vector(10, 20)); 

console.log("new position", adapter.getPosition()); 

module.exports = { Move, IoC, Vector, MovableAdapter };
