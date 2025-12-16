class State {
  handle() { }
}

class MoveToState extends State {
  constructor(targetQueue) {
    super();
    this.targetQueue = targetQueue;
  }

  handle(command) {
    const commandName = command ? command.funcName : null;

    if (commandName === 'HardStop') {
      return null; 
    }

    if (commandName === 'RunCommand') {
      return new NormalState(); 
    }

    if (command && this.targetQueue) {
      if (command.cmd && command.args) {
        this.targetQueue.put(command.cmd, ...command.args);
      }
    }

    return this;
  }
}

class NormalState extends State {
  handle(command) {
    const commandName = command ? command.funcName : null;

    if (commandName === 'HardStop') {
      return null; 
    }

    if (commandName === 'MoveToCommand') {
      const targetQueue = command && command.args && command.args[0];

      if (targetQueue) {
        return new MoveToState(targetQueue); 
      }
      return this;
    }

    if (command && command.execute) {
      command.execute();
    }

    return this;
  }
}

module.exports = { State, NormalState, MoveToState };

