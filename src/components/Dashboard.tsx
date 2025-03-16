import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const Dashboard: React.FC = () => {
  const { points, pointsPerClick, pointsPerSecond, timeMultiplier, incrementPoints } = useGameStore();
  
  const handleButtonClick = () => {
    // Dispatch custom event for sound effect
    window.dispatchEvent(new Event('button-click'));
    
    // Increment points
    incrementPoints();
  };
  
  // Determine if the player is just starting (no points and no passive generation)
  const isNewPlayer = points < 10 && pointsPerSecond === 0;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <motion.button
          className="btn-danger"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your progress?')) {
              useGameStore.getState().reset();
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset Game
        </motion.button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-2">Points</h3>
        <motion.div 
          className="text-4xl font-bold text-white"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 5 }}
        >
          {Math.floor(points).toLocaleString()}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Points per Click</div>
          <div className="text-xl font-semibold text-white">{pointsPerClick.toFixed(1)}</div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Points per Second</div>
          <div className="text-xl font-semibold text-green-400">{pointsPerSecond.toFixed(1)}</div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Time Multiplier</div>
          <div className="text-xl font-semibold text-blue-400">×{timeMultiplier.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Effective PPS</div>
          <div className="text-xl font-semibold text-yellow-400">
            {(pointsPerSecond * timeMultiplier).toFixed(1)}
          </div>
        </div>
      </div>
      
      {isNewPlayer && (
        <div className="mb-4 p-3 bg-indigo-900 rounded-lg text-indigo-200 text-sm">
          <p className="font-bold mb-1">Getting Started:</p>
          <p>Click the button below to earn points. Once you have enough points, you can gamble for runes that will generate points automatically!</p>
        </div>
      )}
      
      <motion.button
        className={`btn-primary w-full py-4 text-lg font-bold ${isNewPlayer ? 'animate-pulse bg-indigo-500 hover:bg-indigo-600' : ''}`}
        onClick={handleButtonClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Click to Earn Points
      </motion.button>
    </div>
  );
};

export default Dashboard; 
