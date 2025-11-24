// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameAPI = {
  createGame: (data) => api.post('/games/create_game/', data),
  joinGame: (data) => api.post('/games/join_game/', data),
  getGame: (roomCode) => api.get(`/games/get_game/?room_code=${roomCode}`),
  rollDice: (roomCode) => api.post('/games/roll_dice/', { room_code: roomCode }),
  makeMove: (data) => api.post('/games/make_move/', data),
};

export default api;
