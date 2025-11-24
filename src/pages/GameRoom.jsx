// src/pages/GameRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameAPI } from '../services/api';
import websocketService from '../services/websocket';
import GameBoard from '../components/GameBoard';
import Dice from '../components/Dice';
import ScoreBoard from '../components/ScoreBoard';
import WaitingArea from '../components/WaitingArea';
import { Copy, Crown, Trophy } from 'lucide-react';

const GameRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState('');
  const [myPosition, setMyPosition] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadGame();
    websocketService.connect(roomCode);
    
    websocketService.on('game_update', (data) => {
      setGame(data.game_data);
    });

    return () => {
      websocketService.disconnect();
    };
  }, [roomCode]);

  const loadGame = async () => {
    try {
      const response = await gameAPI.getGame(roomCode);
      setGame(response.data);
      
      if (response.data.status === 'waiting') {
        setMessage('Waiting for players...');
      } else {
        updateMessage(response.data);
      }
    } catch (error) {
      console.error('Error loading game:', error);
      navigate('/');
    }
  };

  const updateMessage = (gameData) => {
    const currentPlayer = gameData.players[gameData.current_player];
    if (gameData.status === 'completed') {
      const winner = gameData.players[gameData.winner];
      setMessage(`${winner.player_name} WINS! 🏆`);
    } else if (gameData.current_player === myPosition) {
      setMessage("Your turn! Roll the dice!");
    } else {
      setMessage(`${currentPlayer.player_name}'s turn`);
    }
  };

  const rollDice = async () => {
    if (rolling || diceValue !== null || game.current_player !== myPosition) return;
    
    setRolling(true);
    setMessage('Rolling...');
    
    try {
      const response = await gameAPI.rollDice(roomCode);
      
      // Animate dice roll
      let rolls = 0;
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        rolls++;
        
        if (rolls > 10) {
          clearInterval(interval);
          setDiceValue(response.data.dice_value);
          setRolling(false);
          checkValidMoves(response.data.dice_value);
        }
      }, 100);
    } catch (error) {
      console.error('Error rolling dice:', error);
      setRolling(false);
    }
  };

  const checkValidMoves = (value) => {
    const player = game.players[myPosition];
    const hasUnstarted = player.pieces.some(p => p === null);
    const hasStarted = player.pieces.some(p => p !== null);
    const startedCount = player.pieces.filter(p => p !== null).length;
    
    const entryValues = [1, 5, 6];
    const canEnter = hasUnstarted && (entryValues.includes(value) || (value === 12 && startedCount > 0));
    
    if (!canEnter && !hasStarted) {
      setMessage(`Cannot move! Need 1, 5, or 6 to enter. Next turn...`);
      setTimeout(() => {
        setDiceValue(null);
        loadGame();
      }, 2000);
    } else {
      setMessage(`Select a warrior to move ${value} steps`);
    }
  };

  const makeMove = async (pieceIndex) => {
    if (!diceValue || game.current_player !== myPosition) return;
    
    try {
      await gameAPI.makeMove({
        room_code: roomCode,
        player_position: myPosition,
        dice_value: diceValue,
        piece_index: pieceIndex,
      });
      
      setDiceValue(null);
      loadGame();
    } catch (error) {
      console.error('Error making move:', error);
      setMessage('Invalid move!');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const currentPlayer = game.players[game.current_player];
  const myPlayer = game.players[myPosition];
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-400" />
                Ashta Chamma
              </h1>
              <p className="text-purple-200">Warriors Battle Arena</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl px-4 py-2">
                <p className="text-xs text-gray-600 font-semibold">ROOM CODE</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-purple-600 tracking-wider">{roomCode}</p>
                  <button
                    onClick={copyRoomCode}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <span className="text-green-600 text-sm">✓</span>
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Winner Announcement */}
        <AnimatePresence>
          {game.status === 'completed' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-6 text-center shadow-2xl"
            >
              <Trophy className="w-20 h-20 mx-auto text-white mb-4" />
              <h2 className="text-5xl font-bold text-white mb-2">
                {game.players[game.winner].player_name} WINS!
              </h2>
              <p className="text-2xl text-white/90">All 6 warriors reached home! 🎉</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting Screen */}
        {game.status === 'waiting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-purple-600 mb-4">
              Waiting for Players...
            </h2>
            <p className="text-gray-600 mb-6">
              {game.players.length}/{game.num_players} players joined
            </p>
            <div className="flex gap-4 justify-center">
              {game.players.map((player, idx) => (
                <div key={idx} className={`w-16 h-16 ${colorClasses[player.color]} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  ✓
                </div>
              ))}
              {Array.from({ length: game.num_players - game.players.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-2xl">
                  ?
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Interface */}
        {game.status === 'in_progress' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Waiting Areas */}
            <div className="space-y-4">
              {game.players.map((player, idx) => (
                <WaitingArea
                  key={idx}
                  player={player}
                  isCurrentPlayer={idx === game.current_player}
                  isMyTurn={idx === myPosition && game.current_player === myPosition}
                  diceValue={diceValue}
                  onPieceClick={(pieceIdx) => makeMove(pieceIdx)}
                />
              ))}
            </div>

            {/* Center - Game Board */}
            <div className="lg:col-span-2">
              <GameBoard
                game={game}
                myPosition={myPosition}
                diceValue={diceValue}
                onPieceClick={(playerIdx, pieceIdx) => {
                  if (playerIdx === myPosition) makeMove(pieceIdx);
                }}
              />
            </div>

            {/* Right Sidebar - Controls */}
            <div className="space-y-6">
              {/* Current Turn Indicator */}
              <motion.div
                animate={{ scale: game.current_player === myPosition ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: game.current_player === myPosition ? Infinity : 0, duration: 1 }}
                className={`${colorClasses[currentPlayer.color]} rounded-2xl p-6 text-white shadow-2xl`}
              >
                <p className="text-sm font-semibold opacity-90">CURRENT TURN</p>
                <h3 className="text-2xl font-bold">{currentPlayer.player_name}</h3>
                <p className="text-sm mt-2">Warriors Home: {currentPlayer.finished}/6</p>
              </motion.div>

              {/* Dice */}
              <Dice
                value={diceValue}
                rolling={rolling}
                onRoll={rollDice}
                disabled={game.current_player !== myPosition || rolling || diceValue !== null}
                color={colorClasses[myPlayer.color]}
              />

              {/* Message */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <p className="text-center font-semibold text-gray-700">{message}</p>
              </div>

              {/* Scoreboard */}
              <ScoreBoard players={game.players} currentPlayer={game.current_player} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
