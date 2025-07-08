const { IoC, ListQueue, ICommand } = require('../common');

const ioc = new IoC();


class Thread {
  constructor() {
    this.queue = new ListQueue();
    this._start = false;
  }

  put(cmd, ...args) {
    this.queue.put(cmd, ...args);
  }

  start() {
    this._start = true;

    while (this.start) {
      if (this.queue.isEmpty()) {
        this.pause();
        break;
      }

      const cmd = this.queue.get();

      try {
        cmd.execute();
      } catch (e) {
        console.log(e);
        break;
      }
    }
  }

  pause() {
    this._start = false;
    console.log("pause");
  }
  continue() {
    this._start = true;
    console.log("continue");
  }

  stop() {
    this._start = false;
    console.log("stop");
  }
}

const thread = new Thread();
thread.put(console.log, "start");

thread.start();

// thread.stop();
