// src/components/Warrior.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Warrior = ({ color, kills = 0, clickable = false, onClick, style }) => {
  const colorClasses = {
    red: 'bg-red-500 border-red-700 hover:bg-red-600',
    blue: 'bg-blue-500 border-blue-700 hover:bg-blue-600',
    green: 'bg-green-500 border-green-700 hover:bg-green-600',
    yellow: 'bg-yellow-500 border-yellow-700 hover:bg-yellow-600',
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={clickable ? { scale: 1.2, rotate: 5 } : {}}
      whileTap={clickable ? { scale: 0.9 } : {}}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        border-4 shadow-lg text-xl font-bold
        ${colorClasses[color]}
        ${clickable ? 'cursor-pointer ring-4 ring-yellow-400 ring-opacity-50' : 'cursor-default'}
        transition-all
      `}
      style={style}
    >
      <span className="text-white filter drop-shadow-lg">⚔️</span>
      
      {kills > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-lg"
        >
          {kills}
        </motion.div>
      )}
    </motion.button>
  );
};

export default Warrior;
