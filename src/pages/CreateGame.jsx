// src/pages/CreateGame.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '../services/api';
import { ArrowLeft, Users, Palette } from 'lucide-react';

const CreateGame = () => {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState(null);
  const [teamMode, setTeamMode] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: 'Red', value: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    { name: 'Green', value: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  ];

  const toggleColor = (color) => {
    if (selectedColors.includes(color.value)) {
      setSelectedColors(selectedColors.filter(c => c !== color.value));
    } else if (selectedColors.length < numPlayers) {
      setSelectedColors([...selectedColors, color.value]);
    }
  };

  const createGame = async () => {
    if (!playerName || selectedColors.length !== numPlayers) {
      alert('Please complete all fields!');
      return;
    }

    setLoading(true);
    try {
      const response = await gameAPI.createGame({
        num_players: numPlayers,
        team_mode: teamMode,
        player_name: playerName,
        colors: selectedColors,
      });
      navigate(`/game/${response.data.room_code}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create New Game
        </h1>

        {!numPlayers ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Select Players</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[2, 4].map(num => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNumPlayers(num)}
                  className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-3xl shadow-lg hover:shadow-xl transition-all"
                >
                  {num} Players
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            {numPlayers === 4 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setTeamMode(false)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${!teamMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Solo Mode
                </button>
                <button
                  onClick={() => setTeamMode(true)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${teamMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Team Mode (2v2)
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Choose Colors</h3>
                <span className="ml-auto text-sm text-gray-600">
                  {selectedColors.length}/{numPlayers} selected
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {colors.map(color => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleColor(color)}
                    className={`p-6 ${color.bg} ${color.hover} text-white rounded-xl font-bold text-xl shadow-lg transition-all ${
                      selectedColors.includes(color.value) ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  >
                    {color.name} {selectedColors.includes(color.value) && '✓'}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setNumPlayers(null);
                  setSelectedColors([]);
                }}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={createGame}
                disabled={loading || selectedColors.length !== numPlayers}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  selectedColors.length === numPlayers && !loading
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
