
class Move {
  constructor(pos) {
    this.pos = 0;
  }
  execute() {
    this.pos++;
    console.log("Object has been moved, current position: ", this.pos);
  }
}

class IoC {
  constructor() {
    this.registrations = new Map();
    this.scopes = new Map();
    this.currentScope = null;
  }

  resolve(key, ...args) {
    if (key === "IoC.Register") {
      const [registerKey, factory] = args;
      this.registrations.set(registerKey, factory);

      return;
    }

    if (key === "Scopes.New") {
      const [scopeId] = args;
      this.scopes.set(scopeId, new Map());

      return;
    }

    if (key === "Scopes.Current") {
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


const ioc = new IoC();

ioc.resolve("IoC.Register", "Move", () => new Move());

ioc.resolve("Scopes.New", "scope1");
ioc.resolve("Scopes.Current", "scope1");

const moveInstance = ioc.resolve("Move");

ioc.resolve("Scopes.New", "scope2");
ioc.resolve("Scopes.Current", "scope2");

moveInstance.execute()
moveInstance.execute()
moveInstance.execute()

const moveInstance2 = ioc.resolve("Move");
moveInstance2.execute()

module.exports = { Move, IoC };