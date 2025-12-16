const request = require('supertest');
const express = require('express');

global.fetch = jest.fn();

const mockGames = new Map([
  [1, { getObj: jest.fn(() => ({})) }],
  [2, { getObj: jest.fn(() => ({})) }],
  [3, { getObj: jest.fn(() => ({})) }]
]);

jest.mock('../start', () => ({
  games: mockGames
}));

const { router } = require('./endpoint');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
};

describe('Game Service - create new game', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    fetch.mockClear();
  });

  describe('POST /newgame - authorization service', () => {
    test('should successfully create new game via authorization service', async () => {
      const players = ['player1', 'player2'];
      const mockGameId = 123;

      fetch.mockResolvedValueOnce({
        status: 201,
        json: async () => ({ gameId: mockGameId }),
        ok: true
      });

      const response = await request(app)
        .post('/newgame')
        .send({ players })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(players)
        }
      );

      expect(response.body).toHaveProperty('gameId');
      expect(response.body.gameId).toBe(mockGameId);
    });

    test('should return 400 when not enough players', async () => {
      const players = ['player1'];

      const response = await request(app)
        .post('/newgame')
        .send({ players })
        .expect(400);

      expect(response.text).toBe('Not enough players');
      
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should pass correct players array to authorization service', async () => {
      const players = ['user1', 'user2', 'user3'];
      const mockGameId = 456;

      fetch.mockResolvedValueOnce({
        status: 201,
        json: async () => ({ gameId: mockGameId }),
        ok: true
      });

      await request(app)
        .post('/newgame')
        .send({ players })
        .expect(201);

      const fetchCall = fetch.mock.calls[0];
      expect(fetchCall[1].body).toBe(JSON.stringify(players));
    });

  });
});

