// src/components/GameBoard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import Warrior from './Warrior';
import { SAFE_POSITIONS, PATHS } from '../utils/gameConstants';

const GameBoard = ({ game, myPosition, diceValue, onPieceClick }) => {
  
  const isSafePosition = (x, y) => {
    return SAFE_POSITIONS.some(s => s.x === x && s.y === y);
  };

  const getPiecesAtCell = (x, y) => {
    const pieces = [];
    game.players.forEach((player, playerIdx) => {
      const playerPath = PATHS[player.color]; // Get path from constants
      
      player.pieces.forEach((pos, pieceIdx) => {
        if (pos !== null && playerPath) {
          // Convert linear position 'pos' to coordinate using the Path constant
          const coordinate = playerPath[pos]; 
          
          if (coordinate && coordinate.x === x && coordinate.y === y) {
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
      <div className="grid grid-cols-7 gap-1 aspect-square bg-amber-100 border-4 border-amber-900 p-1">
        {Array.from({ length: 49 }).map((_, i) => {
          const x = i % 7;
          const y = Math.floor(i / 7);
          const isSafe = isSafePosition(x, y);
          const isCenter = x === 3 && y === 3;
          const piecesHere = getPiecesAtCell(x, y);

          // Styling logic for specific zones
          let bgClass = 'bg-amber-50';
          if (isCenter) bgClass = 'bg-gradient-to-br from-yellow-400 to-orange-500';
          else if (isSafe) bgClass = 'bg-amber-200';
          
          // Optional: Visual distinction for Outer/Inner rings could go here

          return (
            <motion.div
              key={i}
              className={`
                relative flex items-center justify-center rounded-sm
                ${bgClass} border border-amber-200
                ${isSafe && !isCenter ? 'ring-inset ring-2 ring-amber-400' : ''}
              `}
            >
              {/* Render Safe Zone Markers */}
              {isSafe && !isCenter && (
                <X className="w-full h-full text-amber-900/20 absolute p-2 stroke-[3]" />
              )}
              
              {isCenter && (
                <Shield className="w-full h-full text-white/50 absolute p-2" />
              )}

              {/* Render Pieces Grid (if multiple occupy same spot) */}
              <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5 z-10">
                {piecesHere.map((piece, idx) => (
                  <div key={`${piece.playerIdx}-${piece.pieceIdx}`} className="flex items-center justify-center">
                    <Warrior
                      color={piece.color}
                      kills={piece.kills}
                      clickable={piece.playerIdx === myPosition && diceValue !== null}
                      onClick={() => onPieceClick(piece.playerIdx, piece.pieceIdx)}
                      style={{ width: '100%', height: '100%', fontSize: '0.8rem' }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GameBoard;
