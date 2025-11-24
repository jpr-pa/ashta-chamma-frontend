// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Users, PlayCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <Swords className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
          <h1 className="text-7xl font-bold text-white mb-4">
            Ashta Chamma
          </h1>
          <p className="text-2xl text-purple-200">
            The Ancient Game of Warriors ⚔️
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all"
          >
            <PlayCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Create Game</h2>
            <p className="text-green-100">Start a new battle</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/join')}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all"
          >
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Join Game</h2>
            <p className="text-blue-100">Enter room code</p>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">How to Play</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-3xl mb-2">🎲</div>
                <p>Roll 1, 5, or 6 to enter warriors</p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚔️</div>
                <p>Capture enemies and earn bonus rolls</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🏆</div>
                <p>First to get all 6 warriors home wins!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
