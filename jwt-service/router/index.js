const express = require('express');
const jwt = require('jsonwebtoken');
const gameDb = require('../db/game-db.json');

const router = express.Router();


const SECRET_KEY = 'secret';

router.post('/register', (req, res) => {
  const lastId = gameDb[gameDb.length - 1].gameId;
  const newGameId = lastId + 1;

  const players = req.body;

  if (players.length < 2) {
    res.status(400).json({ message: "Not enough players" });
    return;
  }

  gameDb.push({ gameId: newGameId, usernames: players });
  return res.status(201).json({ gameId: newGameId });
})

router.post('/join', (req, res) => {
  const credentials = req.body;

  if (!credentials) {
    res.status(400).json({ message: "Missing credentials" });
    return;
  }

  const { username, gameId } = credentials;

  const game = gameDb.find((game) => game.gameId === +gameId);

  if (!game) {
    res.status(404).json({ message: "Invalid gameId" });
    return;
  }

  if (game.usernames.some((name) => name === username)) {
    const token = jwt.sign({username, gameId}, SECRET_KEY, { expiresIn: 100000 }); 
    res.status(200).json({ token });
  } else {
    res.status(403).json({ message: "User forbidden for this game" });
  }

});


module.exports = { router }