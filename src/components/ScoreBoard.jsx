// src/components/ScoreBoard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Swords } from 'lucide-react';

const ScoreBoard = ({ players, currentPlayer }) => {
  const colorClasses = {
    red: 'bg-red-100 border-red-500 text-red-700',
    blue: 'bg-blue-100 border-blue-500 text-blue-700',
    green: 'bg-green-100 border-green-500 text-green-700',
    yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  const bgColors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-800">Scoreboard</h3>
      </div>

      <div className="space-y-3">
        {players.map((player, idx) => {
          const isCurrentPlayer = idx === currentPlayer;
          const totalKills = player.kills.reduce((sum, k) => sum + k, 0);

          return (
            <motion.div
              key={idx}
              animate={isCurrentPlayer ? { scale: [1, 1.02, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isCurrentPlayer ? Infinity : 0 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${colorClasses[player.color]}
                ${isCurrentPlayer ? 'shadow-lg border-4' : ''}
                ${player.finished === 6 ? 'ring-4 ring-yellow-400' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${bgColors[player.color]} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{player.player_name}</p>
                    {player.team && (
                      <p className="text-xs opacity-75">Team {player.team}</p>
                    )}
                  </div>
                </div>
                {player.finished === 6 && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold">{player.finished}/6</span>
                  <span className="text-xs opacity-75">Home</span>
                </div>
                <div className="flex items-center gap-1">
                  <Swords className="w-4 h-4" />
                  <span className="font-semibold">{totalKills}</span>
                  <span className="text-xs opacity-75">Kills</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-white/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(player.finished / 6) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${bgColors[player.color]} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ScoreBoard;
