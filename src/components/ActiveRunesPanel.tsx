import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, Rune } from '../store/gameStore';

const rarityColors = {
  common: 'bg-gray-600',
  uncommon: 'bg-green-600',
  rare: 'bg-blue-600',
  epic: 'bg-purple-600',
  legendary: 'bg-yellow-600',
  unique: 'bg-red-600',
};

const rarityTextColors = {
  common: 'text-gray-300',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
  unique: 'text-red-400',
};

const ActiveRunesPanel: React.FC = () => {
  const { 
    points, 
    pointsPerClick, 
    pointsPerSecond, 
    timeMultiplier, 
    getActiveRunes, 
    maxActiveRunes,
    incrementPoints
  } = useGameStore();
  
  const activeRunes = getActiveRunes();
  const activeRunesCount = activeRunes.length;
  
  const handleButtonClick = () => {
    // Dispatch custom event for sound effect
    window.dispatchEvent(new Event('button-click'));
    
    // Increment points
    incrementPoints();
  };
  
  // Create an array of 12 slots (filled or empty)
  const runeSlots = Array(maxActiveRunes).fill(null).map((_, index) => {
    return activeRunes[index] || null;
  });
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">Active Runes ({activeRunesCount}/{maxActiveRunes})</h2>
        <motion.button
          className="btn-danger text-sm"
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
      
      {/* Stats section - vertical layout */}
      <div className="flex items-center space-x-4 mb-3 bg-gray-900 p-3 rounded-lg">
        <div className="flex-shrink-0">
          <motion.div 
            className="text-3xl font-bold text-white"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 5 }}
          >
            {Math.floor(points).toLocaleString()}
          </motion.div>
          <div className="text-xs text-gray-400">POINTS</div>
        </div>
        
        <div className="flex-grow grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-sm font-semibold text-white">{pointsPerClick.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Per Click</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-semibold text-green-400">{pointsPerSecond.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Per Second</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-400">×{timeMultiplier.toFixed(2)}</div>
            <div className="text-xs text-gray-400">Time Multi</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-semibold text-yellow-400">{(pointsPerSecond * timeMultiplier).toFixed(1)}</div>
            <div className="text-xs text-gray-400">Effective</div>
          </div>
        </div>
        
        <motion.button
          className="btn-primary py-2 px-3 text-sm flex-shrink-0"
          onClick={handleButtonClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Click
        </motion.button>
      </div>
      
      {/* Rune slots grid - 4x3 layout */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {runeSlots.map((rune, index) => (
          <div key={index} className="aspect-square">
            {rune ? (
              <ActiveRuneCard rune={rune} />
            ) : (
              <EmptyRuneSlot />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini card for active runes
const ActiveRuneCard: React.FC<{ rune: Rune }> = ({ rune }) => {
  const { toggleRuneActive } = useGameStore();
  
  return (
    <div className={`active-rune-mini h-full flex flex-col ${rarityColors[rune.rarity].replace('bg-', 'border-')}`}>
      <div className="flex justify-between items-start">
        <div className={`text-xs font-bold ${rarityTextColors[rune.rarity]} truncate flex-1`}>
          {rune.name.split(' ')[0]}
        </div>
        <button 
          onClick={() => toggleRuneActive(rune.id)}
          className="ml-1 text-xs text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="flex flex-col mt-auto text-xs">
        {rune.pointsPerSecond > 0 && (
          <div className="text-green-400">+{rune.pointsPerSecond}</div>
        )}
        {rune.timeMultiplier > 1 && (
          <div className="text-blue-400">×{rune.timeMultiplier.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
};

// Empty slot component
const EmptyRuneSlot: React.FC = () => {
  return (
    <div className="h-full border border-dashed border-gray-700 rounded bg-gray-900 bg-opacity-30 flex items-center justify-center">
      <div className="text-gray-700 text-xs">Empty</div>
    </div>
  );
};

export default ActiveRunesPanel; 
