const jsonConfig = require('./exception-dict.json');

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

class ExceptionHandler {
  store = new Store(jsonConfig);
  maxAttempts = 2;

  constructor(queue) {
    this.queue = queue;
  }

  handle(cmd, e) {
    const funcName = cmd.funcName;
    const eName = e.name;

    const handler = this.store.getValueOrDefault(funcName, eName);

    if (handler === 'writeToLog') {
      let currAttempt = cmd.args[1].attempt;

      if (currAttempt < this.maxAttempts) {
        cmd.args[1].attempt++;
        this.queue.put(repeatCommand, cmd, cmd.args[1]);
      } else {
        this.queue.put(writeToLog, funcName, eName);
      }
    } else {
      if (handler === 'retryCommand') {
        this.queue.put(repeatCommand, cmd, { attempt: 1 });
      }
    }
  }
}

// Функция записи в лог
const writeToLog = (cmdName, eName) =>
  console.log(`ОШИБКА ${eName} ПРИ ЗАПУСКЕ ФУНКЦИИ ${cmdName}`);

// Функция повтора команды
const repeatCommand = (cmd) => cmd.execute();

module.exports = { ExceptionHandler };
