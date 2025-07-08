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
  handle(cmd, e) {
    const funcName = cmd?.funcName || 'unknown function';
    const eName = e?.name || 'unknown error';

    console.log(`ОШИБКА ${eName} ПРИ ЗАПУСКЕ ФУНКЦИИ ${funcName}`);
  }
}



module.exports = { ExceptionHandler };
