// src/components/WaitingArea.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Warrior from './Warrior';

const WaitingArea = ({ player, isCurrentPlayer, isMyTurn, diceValue, onPieceClick }) => {
  const colorClasses = {
    red: 'bg-red-100 border-red-500',
    blue: 'bg-blue-100 border-blue-500',
    green: 'bg-green-100 border-green-500',
    yellow: 'bg-yellow-100 border-yellow-500',
  };

  const textColors = {
    red: 'text-red-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
  };

  const waitingPieces = player.pieces
    .map((pos, idx) => ({ pos, idx }))
    .filter(p => p.pos === null);

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`
        p-4 rounded-2xl border-2 transition-all shadow-lg
        ${colorClasses[player.color]}
        ${isCurrentPlayer ? 'ring-4 ring-purple-400 shadow-2xl' : ''}
      `}
    >
      <div className="mb-3">
        <p className={`font-bold text-lg ${textColors[player.color]} flex items-center justify-between`}>
          <span>{player.player_name}</span>
          {isCurrentPlayer && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full"
            >
              TURN
            </motion.span>
          )}
        </p>
        <p className="text-xs opacity-75">
          {waitingPieces.length} warriors waiting • {player.finished} home
        </p>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[60px] items-center justify-center">
        {waitingPieces.length === 0 ? (
          <p className="text-sm opacity-50 italic">All warriors deployed!</p>
        ) : (
          waitingPieces.map((piece) => (
            <Warrior
              key={piece.idx}
              color={player.color}
              kills={player.kills[piece.idx]}
              clickable={isMyTurn && diceValue !== null}
              onClick={() => onPieceClick(piece.idx)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default WaitingArea;
