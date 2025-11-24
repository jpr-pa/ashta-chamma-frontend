// src/components/GameBoard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Warrior from './Warrior';

const GameBoard = ({ game, myPosition, diceValue, onPieceClick }) => {
  const safePositions = [
    {x: 3, y: 0}, {x: 1, y: 1}, {x: 5, y: 1}, {x: 3, y: 2},
    {x: 0, y: 3}, {x: 2, y: 3}, {x: 4, y: 3}, {x: 6, y: 3},
    {x: 3, y: 4}, {x: 1, y: 5}, {x: 5, y: 5}, {x: 3, y: 6}
  ];

  const isSafePosition = (x, y) => {
    return safePositions.some(s => s.x === x && s.y === y);
  };

  const getPiecesAtCell = (x, y) => {
    const pieces = [];
    game.players.forEach((player, playerIdx) => {
      player.pieces.forEach((pos, pieceIdx) => {
        if (pos !== null && player.path) {
          const cell = player.path[pos];
          if (cell && cell.x === x && cell.y === y) {
            pieces.push({
              playerIdx,
              pieceIdx,
              color: player.color,
              kills: player.kills[pieceIdx],
            });
          }
        }
      });
    });
    return pieces;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6"
    >
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 49 }).map((_, i) => {
          const x = i % 7;
          const y = Math.floor(i / 7);
          const isSafe = isSafePosition(x, y);
          const isCenter = x === 3 && y === 3;
          const piecesHere = getPiecesAtCell(x, y);

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`
                aspect-square rounded-lg relative flex items-center justify-center
                ${isCenter ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                  isSafe ? 'bg-amber-200' : 'bg-white'}
                border-2 border-gray-700 transition-all
                ${piecesHere.length > 0 ? 'shadow-lg' : ''}
              `}
            >
              {isSafe && !isCenter && (
                <X className="w-8 h-8 text-gray-600 absolute opacity-30 stroke-[3]" />
              )}
              
              {piecesHere.map((piece, idx) => (
                <Warrior
                  key={`${piece.playerIdx}-${piece.pieceIdx}`}
                  color={piece.color}
                  kills={piece.kills}
                  clickable={piece.playerIdx === myPosition && diceValue !== null}
                  onClick={() => onPieceClick(piece.playerIdx, piece.pieceIdx)}
                  style={{
                    position: 'absolute',
                    top: `${20 + idx * 10}%`,
                    left: `${20 + idx * 10}%`,
                    zIndex: 10 + idx,
                  }}
                />
              ))}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GameBoard;
