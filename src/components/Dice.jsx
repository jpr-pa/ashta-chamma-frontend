// src/components/Dice.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const Dice = ({ value, rolling, onRoll, disabled, color }) => {
  const DiceComponents = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6,
  };

  const DiceIcon = value && value <= 6 ? DiceComponents[value] : Dice6;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-6"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={rolling ? { rotate: 360 } : { rotate: 0 }}
          transition={rolling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
          className={`w-28 h-28 ${color || 'bg-purple-600'} rounded-2xl flex items-center justify-center shadow-xl`}
        >
          {value === 12 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white font-bold text-5xl"
            >
              12
            </motion.div>
          ) : value ? (
            <DiceIcon className="w-16 h-16 text-white" strokeWidth={2.5} />
          ) : (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-white text-4xl font-bold"
            >
              ?
            </motion.div>
          )}
        </motion.div>

        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={onRoll}
          disabled={disabled}
          className={`w-full px-8 py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${
            disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : `${color || 'bg-purple-600'} hover:shadow-2xl`
          }`}
        >
          {rolling ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🎲
              </motion.span>
              Rolling...
            </span>
          ) : (
            '🎲 Roll Dice'
          )}
        </motion.button>

        {value && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 font-semibold">You rolled</p>
            <p className="text-3xl font-bold text-purple-600">{value}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dice;
