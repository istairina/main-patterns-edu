const { ListQueue, Command, writeToLog, repeatCommand, ExceptionHandler } = require('./solid-exceptions.js');

const handlerRepeatSpy = jest.fn();

describe('exception handling', () => {
  let queue;
  let exceptionHandler;

  beforeEach(() => {
    queue = new ListQueue();
    exceptionHandler = new ExceptionHandler(queue);
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
    queue.put(() => {
      throwException();
    });

    const mockExceptionHandler = {
      handle: jest.fn(),
    };

    const exceptionCommand = queue.get();

    try {
      exceptionCommand.execute();
    } catch (e) {
      mockExceptionHandler.handle(exceptionCommand, e);
    }

    expect(mockExceptionHandler.handle).toHaveBeenCalled();
  });

  test('repeat command', () => {
    const cmd = new Command(handlerRepeatSpy, []);

    repeatCommand(cmd);

    expect(handlerRepeatSpy).toHaveBeenCalled();
  });

  test('Exception handler puts retry command to queue', () => {
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
