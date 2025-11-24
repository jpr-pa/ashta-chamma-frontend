// src/pages/JoinGame.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '../services/api';
import { ArrowLeft, Hash, User } from 'lucide-react';

const JoinGame = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const colors = {
    red: { name: 'Red', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
    blue: { name: 'Blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    green: { name: 'Green', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
    yellow: { name: 'Yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  };

  const checkRoom = async () => {
    if (!roomCode || !playerName) {
      alert('Please enter room code and your name!');
      return;
    }

    setLoading(true);
    try {
      const response = await gameAPI.getGame(roomCode);
      const game = response.data;
      
      if (game.status !== 'waiting') {
        alert('Game already started!');
        setLoading(false);
        return;
      }

      const takenColors = game.players.map(p => p.color);
      const available = Object.keys(colors).filter(c => !takenColors.includes(c));
      
      if (available.length === 0) {
        alert('Game is full!');
        setLoading(false);
        return;
      }

      setAvailableColors(available);
      setStep(2);
    } catch (error) {
      console.error('Error checking room:', error);
      alert('Room not found!');
    }
    setLoading(false);
  };

  const joinGame = async () => {
    if (!selectedColor) {
      alert('Please select a color!');
      return;
    }

    setLoading(true);
    try {
      const response = await gameAPI.joinGame({
        room_code: roomCode,
        player_name: playerName,
        color: selectedColor,
      });
      navigate(`/game/${roomCode}`);
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <button
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Join Game
        </h1>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-purple-600" />
                <label className="block text-sm font-semibold text-gray-700">
                  Room Code
                </label>
              </div>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl font-bold tracking-wider"
                placeholder="ABC123"
                maxLength={6}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-purple-600" />
                <label className="block text-sm font-semibold text-gray-700">
                  Your Name
                </label>
              </div>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <button
              onClick={checkRoom}
              disabled={loading}
              className={`w-full px-6 py-4 rounded-xl font-bold text-white text-xl transition-all ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg'
              }`}
            >
              {loading ? 'Checking...' : 'Next'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Select Your Color</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableColors.map(colorKey => {
                  const color = colors[colorKey];
                  return (
                    <motion.button
                      key={colorKey}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(colorKey)}
                      className={`p-6 ${color.bg} ${color.hover} text-white rounded-xl font-bold text-xl shadow-lg transition-all ${
                        selectedColor === colorKey ? 'ring-4 ring-yellow-400' : ''
                      }`}
                    >
                      {color.name} {selectedColor === colorKey && '✓'}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={joinGame}
              disabled={loading || !selectedColor}
              className={`w-full px-6 py-4 rounded-xl font-bold text-white text-xl transition-all ${
                selectedColor && !loading
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JoinGame;
