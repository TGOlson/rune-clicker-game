import React from 'react';
import { motion } from 'framer-motion';
import { Rune } from '../store/gameStore';

interface RuneCardProps {
  rune: Rune;
}

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

const RuneCard: React.FC<RuneCardProps> = ({ rune }) => {
  // Format the rarity text with proper capitalization
  const formatRarity = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };
  
  return (
    <motion.div
      className="rune-card bg-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-bold ${rarityTextColors[rune.rarity]}`}>
          {rune.name}
        </h3>
        <div className={`w-3 h-3 rounded-full ${rarityColors[rune.rarity]}`} />
      </div>
      
      <div className={`text-xs mb-3 ${rarityTextColors[rune.rarity]}`}>
        {formatRarity(rune.rarity)} Rune
      </div>
      
      <p className="text-sm text-gray-300 mb-2">{rune.description}</p>
      
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between text-sm">
          <span>Points/sec:</span>
          <span className="text-green-400">+{rune.pointsPerSecond}</span>
        </div>
        
        {rune.timeMultiplier > 1 && (
          <div className="flex justify-between text-sm">
            <span>Time multiplier:</span>
            <span className="text-blue-400">×{rune.timeMultiplier.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center py-2 bg-gray-700 rounded-md text-yellow-400 font-medium">
        Active
      </div>
    </motion.div>
  );
};

export default RuneCard; 
