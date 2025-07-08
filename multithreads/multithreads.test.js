const { Thread } = require('./multithreads');

describe('Thread', () => {
  let thread;

  beforeEach(() => {
    thread = new Thread();
    thread.put(() => console.log('start'));
    thread.put(() => console.log('next command'));
    thread.put(() => console.log('next2 command'));
  });

  test('tasks added to queue', () => {
    expect(thread.queueSize).toBe(3);
  });

  test('hard stop immidiately stops thread', () => {
    thread.start();
    thread.stop();
    expect(thread.queueSize).toBe(2);
  });

  test('soft stop finish commands in queue', () => {
    thread.start();
    thread.softStop();
    expect(thread.queueSize).toBe(0);
  });

  test('expect finish all commands if any throws error', () => {
    thread.put(() => { throw new Error('Error'); });

    thread.put(() => jest.fn());
    thread.start();
    thread.softStop();

    expect(thread.queueSize).toBe(0);
  });

});
