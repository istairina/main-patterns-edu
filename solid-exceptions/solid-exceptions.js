const jsonConfig = require('./exception-dict.json');

// Нода для создания очереди, value - команда, next - следующий элемент очереди
class Node {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Класс для создания очереди вызова команд. Методы получения элемента, добавления, проверки на пустоту и получения размера.
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
      this.head = new Node(new Command(cmd, args));
      this.tail = this.head;
    } else {
      this.tail.next = new Node(new Command(cmd, args));
      this.tail = this.tail.next;
    }

    this.sizeQ += 1;
  }

  get size() {
    return this.sizeQ;
  }
}

// Класс отдельной команды, включает отдельно функцию и отдельно аргументы, при вызове execute вызывается функция
// c аргументами. Отдельно выделено получение имени функции для удобства работы с командами.
class Command {
  constructor(cmd, args) {
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

// Класс для хранения конфигурации для обработки исключений. Содержит метод для получения хэндлера по команде и исключению.
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

// Класс для управления исключениями
class ExceptionHandler {
  store = new Store(jsonConfig);
  maxAttempts = 2;

  handle(cmd, e) {
    const funcName = cmd.funcName;
    const eName = e.name;

    const handler = this.store.getValueOrDefault(funcName, eName);

    if (handler === 'writeToLog') {
      let currAttempt = cmd.args[1].attempt;

      if (currAttempt < this.maxAttempts) {
        cmd.args[1].attempt++;
        queue.put(repeatCommand, cmd, cmd.args[1]); 
      } else {
        queue.put(writeToLog, funcName, eName);
      }
    } else {
      if (handler === 'retryCommand') {
        queue.put(repeatCommand, cmd, { attempt: 1 });
      }
    }
  }
}

// Функция записи в лог
const writeToLog = (cmdName, eName) =>
  console.log(`ОШИБКА ${eName} ПРИ ЗАПУСКЕ ФУНКЦИИ ${cmdName}`);

// Функция повтора команды
const repeatCommand = (cmd) => cmd.execute();

const queue = new ListQueue();
const exceptionHandler = new ExceptionHandler();

queue.put(console.log, 'test');

// функция для проверки выброса исключений
const toString = function () {
  return a.toString();
};

queue.put(toString);

while (queue.size) {
  const cmd = queue.get();

  try {
    cmd.execute();
  } catch (e) {
    exceptionHandler.handle(cmd, e);
  }
}

module.export = { ListQueue };
