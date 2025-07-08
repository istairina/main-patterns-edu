const { ListQueue, ExceptionHandler } = require('../common');

class Thread {
  constructor() {
    this.queue = new ListQueue();
    this.exceptionHandler = new ExceptionHandler();
    this._running = false;
    this._stopping = false;
    this._intervalId = null;
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
    if (!this._running) return;

    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    if (this.queue.isEmpty()) this.pause();

    const cmd = this.queue.get();

    setImmediate(() => {
      try {
        cmd.execute();
      } catch (error) {
        this.exceptionHandler.handle(cmd, error);
      } finally {
        if (!this._stopping) {
          this.process();
        }
      }
    });
  }

  pause() {
    this._running = false;
    this._intervalId = setInterval(() => {
      if (this.queueSize > 0 && this._running === false) {
        this.start();
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    }, 1000);
  }


  stop() {
    this._running = false;
  }

  softStop() {
    const size = this.queueSize;
    this._stopping = true;

    for (let i = 0; i < size; i += 1) {
      this.process();
    }

    this.stop();
  }

  get queueSize() {
    return this.queue.size;
  }
}

// const thread = new Thread();

// thread.put(console.log, 'start');
// thread.put(() => console.log('next command'));
// thread.put(() => {
//   throw new Error('Error');
// });
// thread.put(console.log, 'next command 2');
// thread.put(console.log, 'next command 3');

// thread.start();



// setTimeout(() => {
//   thread.stop(); 
//   console.log(`Queue size after stop: ${thread.queueSize}`);
// }, 0);

// setTimeout(() => {
//   thread.put(console.log, 'new command 1');
//   thread.put(console.log, 'new command 2');
//   thread.put(console.log, 'new command 3');
//   thread.put(console.log, 'new command 4');
//   thread.put(console.log, 'new command 5');
// }, 1);

// setTimeout(() => {
//   console.log(`Final queue size: ${thread.queueSize}`);
// }, 100);

module.exports = { Thread };