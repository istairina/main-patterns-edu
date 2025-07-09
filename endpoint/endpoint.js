const { IoC, ListQueue, ExceptionHandler } = require('../common');
const { Move } = require('../commands');
const { games } = require('../start');
const express = require('express');

const operationDict = require('./operation-dict.json');

const router = express.Router();


// формат входящих сообщений
// gameId: number
// objectId: number
// operationId: number;
// args: object;

// endpoint
// /{gameId}
// в теле остальная информация


const ioc = new IoC();
const exceptionHandler = new ExceptionHandler();

const gameIds = Array.from(games.keys());

console.log("gameIds", gameIds)

// все очереди игр
const gamesQ = {};

gameIds.forEach((id) => {
  gamesQ[id] = new ListQueue();
})


class InterpretCommand {
  constructor(gameId, objectId, operationId, args) {
    this.gameId = gameId;
    this.objectId = objectId;
    this.operationId = operationId;
    this.args = args;
  }

  execute() {
    const operation = operationDict.find((elem) => elem.operatoinId === this.operationId);

    if (!operation) {
      throw new Error(`Unknown operation ID: ${this.operationId}`);
    }

    const game = games.get(+this.gameId);

    const obj = game.getObj(this.objectId);

    return ioc.resolve(operation.command, obj, this.args);
  }
}


ioc.resolve("IoC.Register", "SET_INITIAL_VELOCITY", (obj, velocity) => {
  return () => obj.setVelocity = velocity;
});

ioc.resolve("IoC.Register", "MOVE", (obj, steps) => {
  const move = new Move(obj, steps);
  return () => move.execute();
});


router.post(`/:gameId`, (req, res) => {
  const { gameId } = req.params;

  if (!gamesQ[gameId]) {
    res.status(404).send(`Game with id ${gameId} not found`);
    return;
  }

  const { objectId, operationId, args } = req.body;

  const command = new InterpretCommand(gameId, objectId, operationId, args).execute();

  gamesQ[gameId].put(command, args);

  try {
    res.status(200).send("Command added to queue");

  } catch (error) {
    res.status(500).send("oops");
    exceptionHandler.handle(command, error);
  }
});


// исполнение команд в очереди
setInterval(() => {
  gameIds.forEach((gameId) => {
    const gameQueue = gamesQ[gameId];

    while (!gameQueue.isEmpty()) {
      const command = gameQueue.get();
      command.execute();
    }

    console.log("game1", games.get(1).getObj(1))
    console.log("game2", games.get(2).getObj(1))

  });
}, 1000);


module.exports = { InterpretCommand, router }