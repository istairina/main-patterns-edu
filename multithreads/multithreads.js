const { IoC, ListQueue, ExceptionHandler } = require('../common');

const ioc = new IoC();
const exceptionHandler = new ExceptionHandler();

class Thread {
  constructor() {
    this.queue = new ListQueue();
    this._running = false;
  }

  put(cmd, ...args) {
    this.queue.put(cmd, ...args);
  }

  start() {
    if (!this._running) {
      this._running = true;
      this.process();
    }
  }

  process() {
    if (this.queue.isEmpty() || !this._running) return;

    const cmd = this.queue.get();

    setImmediate(() => {
      try {
        cmd.execute();
      } catch (error) {
        exceptionHandler.handle(cmd, error);
      } finally {
        this.process();
      }
    });
  }

  stop() {
    this._running = false;
    console.log('stop');
  }

  get queueSize() {
    return this.queue.size;
  }
}

const thread = new Thread();

thread.put(console.log, 'start');
thread.put(() => console.log('next command'));
thread.put(() => {
  throw new Error('Error');
});
thread.put(console.log, 'next command 2');
thread.put(console.log, 'next command 3');

thread.start();

thread.put(console.log, 'new command');

setTimeout(() => {
  thread.stop();
  console.log(`Queue size after stop: ${thread.queueSize}`);
}, 1);

setTimeout(() => {
  console.log(`Final queue size: ${thread.queueSize}`);
}, 100);
