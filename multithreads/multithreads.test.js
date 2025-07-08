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

  test('hard stop immidiately stops thread', (done) => {
    thread.start();
    thread.stop();
    setImmediate(() => {
      expect(thread.queueSize).toBeGreaterThan(0);
      done();
    });
  });

  test('soft stop finish commands in queue', (done) => {
    thread.start();
    thread.softStop();

    setImmediate(() => {
      expect(thread.queueSize).toBe(0);
      done();
    });
  });

  test('expect finish all commands if any throws error', (done) => {
    thread.put(() => { throw new Error('Error'); });
    thread.put(() => jest.fn());

    thread.start();
    thread.softStop();

    setImmediate(() => {
      expect(thread.queueSize).toBe(0);
      done();
    });
  });

});
