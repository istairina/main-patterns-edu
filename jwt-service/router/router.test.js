const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { router } = require('./index');

const SECRET_KEY = 'secret';

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
};

describe('JWT Service - Authentication', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /register - Create new game', () => {
    test('should create a new game with players', async () => {
      const players = ['player1', 'player2'];
      
      const response = await request(app)
        .post('/register')
        .send(players)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('gameId');
      expect(typeof response.body.gameId).toBe('number');
    });

    test('should return 400 when not enough players', async () => {
      const players = ['player1'];
      
      const response = await request(app)
        .post('/register')
        .send(players)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.message).toBe('Not enough players');
    });

  describe('POST /join - Get JWT token', () => {
    test('should return JWT token for user in existing game', async () => {

      const players = ['testuser1', 'testuser2'];
      const createResponse = await request(app)
        .post('/register')
        .send(players)
        .expect(201);

      const gameId = createResponse.body.gameId;

      const credentials = {
        username: 'testuser1',
        gameId: gameId
      };

      const response = await request(app)
        .post('/join')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');

      const decoded = jwt.verify(response.body.token, SECRET_KEY);
      expect(decoded).toHaveProperty('username');
      expect(decoded).toHaveProperty('gameId');
      expect(decoded.username).toBe('testuser1');
      expect(decoded.gameId).toBe(gameId);
    });

    test('should return 403 when user is not in game', async () => {
      const players = ['player1', 'player2'];
      const createResponse = await request(app)
        .post('/register')
        .send(players)
        .expect(201);

      const gameId = createResponse.body.gameId;

      const credentials = {
        username: 'unauthorized_user',
        gameId: gameId
      };

      const response = await request(app)
        .post('/join')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.message).toBe('User forbidden for this game');
    });

    test('should return 400 when credentials are missing', async () => {
      const response = await request(app)
        .post('/join')
        .send({})
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.message).toBe('Invalid gameId');
    });
  });
  })
})
