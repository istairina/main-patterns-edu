const jsonConfig = require('./exception-dict.json');

class Node {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
  }
}

class Command {
  constructor(cmd, ...args) {
    this.cmd = cmd;
    this.args = args;
  }

  get funcName() {
    return this.cmd.name;
  }

  execute() {
    return this.cmd(...this.args);
  }
}

class ListQueue {
  constructor() {
    this.sizeQ = 0;
    this.head;
    this.tail;
  }

  isEmpty() {
    return this.sizeQ === 0;
  }

  get() {
    if (this.isEmpty()) return;

    const elem = this.head.value;

    this.head = this.head.next;
    this.sizeQ -= 1;

    return elem;
  }

  put(cmd, ...args) {
    if (this.isEmpty()) {
      this.head = new Node(new Command(cmd, ...args));
      this.tail = this.head;
    } else {
      this.tail.next = new Node(new Command(cmd, ...args));
      this.tail = this.tail.next;
    }

    this.sizeQ += 1;
  }

  get size() {
    return this.sizeQ;
  }
}

class Store {
  constructor(jsonConfig) {
    this.config = jsonConfig;
  }
  getValueOrDefault(cmd, exception) {
    const entry = this.config.find(
      (item) => item.command === cmd && item.exception === exception
    );

    if (entry) {
      return entry.handler;
    }

    return 'default';
  }
}

class ExceptionHandler {
  store = new Store(jsonConfig);

  handle(cmd, e, log) {
    console.log("cmd", cmd)
    const funcName = cmd.funcName;
    const eName = e.name;

    const handler = this.store.getValueOrDefault(funcName, eName);

    if (handler === 'retryCommand') {
      console.log("cmd.cmd", cmd.cmd)
      new RepeatCommand(cmd, cmd.args).execute();
    } else {
      queue.put(log.write, funcName, eName)
    }
  }
}

class Log {
  write(cmdName, eName) {
    console.log(`ОШИБКА ${eName} ПРИ ЗАПУСКЕ ФУНКЦИИ ${cmdName}`)
  }
}

class RepeatCommand {
  constructor(cmd, args) {
    this.cmd = cmd;
    this.args = args;
  }

  execute() {
    queue.put(this.cmd, this.args);
  }
}


const queue = new ListQueue();
const exceptionHandler = new ExceptionHandler();
const log = new Log();

queue.put(console.log, 'test');

const toString = function () {
  return a.toString();
};

queue.put(toString);

while (queue.size) {
  const cmd = queue.get();

  try {
    cmd.execute()
  } catch (e) {
    exceptionHandler.handle(cmd, e, log)
  }
}







module.export = { ListQueue }