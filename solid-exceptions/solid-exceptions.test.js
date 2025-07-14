const { ListQueue, Command, writeToLog, repeatCommand, ExceptionHandler, EventLoop, Store } = require('./solid-exceptions.js');
const jsonConfig = require('./exception-dict.json');

const handlerRepeatSpy = jest.fn();

describe('exception handling', () => {
  let eventLoop;

  beforeEach(() => {
    eventLoop = new EventLoop();
  });

  test('Test that command write to log', () => {
    const logSpy = jest.spyOn(global.console, 'log');

    const commandName = 'someName';
    const eName = 'someError';

    writeToLog(commandName, eName);

    expect(logSpy).toHaveBeenCalledWith(
      `ОШИБКА ${eName} ПРИ ЗАПУСКЕ ФУНКЦИИ ${commandName}`
    );
  });

  test('Exception handler write to log', () => {
    eventLoop.add(() => {
      throwException();
    });

    const logSpy = jest.spyOn(global.console, 'log');

    eventLoop.start();

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/ОШИБКА/));
  });

  test('repeat command', () => {
    const cmd = new Command(handlerRepeatSpy, []);

    repeatCommand(cmd);

    expect(handlerRepeatSpy).toHaveBeenCalled();
  });

  test('Exception handler puts retry command to queue', () => {
    const queue = new ListQueue();
    const exceptionHandler = new ExceptionHandler(queue, new Store(jsonConfig))

    const toString = function () {
      return a.toString();
    };

    queue.put(toString);

    const initialSize = queue.size;

    const exceptionCommand = queue.get();

    try {
      exceptionCommand.execute();
    } catch (e) {
      exceptionHandler.handle(exceptionCommand, e);
    }

    expect(queue.size).toBe(initialSize);
  });

});
