const { Game } = require('./createGame/game');
const express = require('express');


const PORT = 3000;
const GAME_AMOUNT = 3;
const OBJECT_AMOUNT = 3;

const games = new Map();

for (let i = 1; i <= GAME_AMOUNT; i++) {
  games.set(i, new Game());

  const game = games.get(i);
  for (let i = 0; i < OBJECT_AMOUNT; i++) {
    game.addMovableObject();
  }
}

module.exports = { games };

const app = express();

const { router } = require('./endpoint/endpoint');

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

