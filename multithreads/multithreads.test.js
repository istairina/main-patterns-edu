const { Thread } = require('./multithreads');
const { HardStop, MoveToCommand, RunCommand } = require('../common/commands/thread-commands');
const { NormalState, MoveToState } = require('./thread-state');
const { ListQueue } = require('../common');

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

  test('HardStop command stops thread', (done) => {
    const executedCommands = [];
    
    thread.put(() => executedCommands.push('cmd1'));
    thread.put(HardStop);
    thread.put(() => executedCommands.push('cmd2'));
    
    thread.start();

    setTimeout(() => {
      expect(thread._running).toBe(false);
      expect(thread._stopping).toBe(true);
      expect(executedCommands).toEqual(['cmd1']);
      expect(thread.queueSize).toBeGreaterThan(0);
      done();
    }, 100);
  });

  test('MoveToCommand transitions thread to MoveToState', (done) => {
    const targetQueue = new ListQueue();
    const executedCommands = [];
    
    thread.put(() => executedCommands.push('executed before transition'));
    thread.put(MoveToCommand, targetQueue);
    thread.put(() => executedCommands.push('should be redirected'));
    
    thread.start();

    setTimeout(() => {
      expect(thread.state).toBeInstanceOf(MoveToState);
      
      expect(targetQueue.size).toBe(1);
      
      expect(executedCommands).toContain('executed before transition');
      
      expect(executedCommands).not.toContain('should be redirected');
      done();
    }, 100);
  });

  test('RunCommand transitions thread back to NormalState', (done) => {
    const targetQueue = new ListQueue();
    const executedCommands = [];
    
    thread.put(MoveToCommand, targetQueue);
    thread.put(() => executedCommands.push('redirected'));
    thread.put(RunCommand);
    thread.put(() => executedCommands.push('executed'));
    
    thread.start();

    setTimeout(() => {
      expect(thread.state).toBeInstanceOf(NormalState);
      
      expect(targetQueue.size).toBe(1);
      
      expect(executedCommands).toContain('executed');
      done();
    }, 100);
  });

});
