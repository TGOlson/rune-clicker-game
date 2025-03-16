import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, Rune } from '../store/gameStore';

const GambleSection: React.FC = () => {
  const { points, gamblePurchase } = useGameStore();
  const [gambleAmount, setGambleAmount] = useState<number>(10);
  const [isGambling, setIsGambling] = useState<boolean>(false);
  const [acquiredRune, setAcquiredRune] = useState<Rune | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  // Listen for the rune-acquired event
  useEffect(() => {
    const handleRuneAcquired = (event: CustomEvent<{ rune: Rune }>) => {
      setAcquiredRune(event.detail.rune);
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };
    
    window.addEventListener('rune-acquired', handleRuneAcquired as EventListener);
    
    return () => {
      window.removeEventListener('rune-acquired', handleRuneAcquired as EventListener);
    };
  }, []);
  
  const handleGamble = () => {
    if (points >= gambleAmount) {
      setIsGambling(true);
      
      // Dispatch custom event for sound effect
      window.dispatchEvent(new Event('gamble-attempt'));
      
      // Simulate gambling animation
      setTimeout(() => {
        gamblePurchase(gambleAmount);
        setIsGambling(false);
      }, 1000);
    }
  };
  
  const presetAmounts = [10, 50, 100, 500, 1000];
  
  // Helper function to get color class based on rarity
  const getRarityColorClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      case 'unique': return 'text-red-400';
      default: return 'text-white';
    }
  };
  
  // Check if player has enough points for minimum gamble
  const canGamble = points >= gambleAmount;
  const notEnoughPoints = points < 10; // Not enough for even the minimum gamble
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg relative border-2 border-indigo-500">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">Gamble for Runes</h2>
      <p className="text-sm text-gray-300 mb-4">
        <span className="font-bold text-indigo-300">This is the only way to acquire runes!</span> Spend points to gamble for random runes with unique attributes. Higher amounts increase your chances of rare runes with better attributes!
      </p>
      
      {notEnoughPoints && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg text-gray-300 text-sm border border-gray-600">
          <p className="font-bold mb-1">Keep clicking!</p>
          <p>You need at least 10 points to gamble for your first rune. Click the button in the Dashboard to earn more points.</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            className={`px-3 py-1 rounded-md text-sm ${
              gambleAmount === amount 
                ? 'bg-indigo-600 text-white' 
                : points < amount 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => points >= amount && setGambleAmount(amount)}
            disabled={points < amount}
          >
            {amount}
          </button>
        ))}
      </div>
      
      <div className="mb-4">
        <label htmlFor="custom-amount" className="block text-sm text-gray-300 mb-1">
          Custom amount:
        </label>
        <input
          id="custom-amount"
          type="number"
          min="1"
          value={gambleAmount}
          onChange={(e) => setGambleAmount(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <motion.button
        className={`btn-primary w-full py-3 text-lg font-bold ${!canGamble ? 'opacity-50 cursor-not-allowed' : ''} ${
          isGambling ? 'animate-pulse' : ''
        }`}
        onClick={handleGamble}
        disabled={!canGamble || isGambling}
        whileHover={{ scale: canGamble && !isGambling ? 1.05 : 1 }}
        whileTap={{ scale: canGamble && !isGambling ? 0.95 : 1 }}
      >
        {isGambling 
          ? 'Gambling...' 
          : !canGamble 
            ? `Need ${gambleAmount - points} more points` 
            : `Gamble ${gambleAmount} points`
        }
      </motion.button>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>Rarity chances (increase with amount spent):</p>
        <ul className="list-disc list-inside mt-1 grid grid-cols-2">
          <li className="text-gray-300">Common: Very likely</li>
          <li className="text-green-400">Uncommon: Likely</li>
          <li className="text-blue-400">Rare: Moderate</li>
          <li className="text-purple-400">Epic: Uncommon</li>
          <li className="text-yellow-400">Legendary: Rare</li>
          <li className="text-red-400">Unique: Very rare</li>
        </ul>
      </div>
      
      {/* Notification for acquired rune */}
      <AnimatePresence>
        {showNotification && acquiredRune && (
          <motion.div
            className="absolute top-0 left-0 right-0 p-4 bg-gray-900 rounded-t-lg border-b border-indigo-500"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="mr-3">
                <div className={`w-3 h-3 rounded-full ${rarityColors[acquiredRune.rarity]} mr-2`}></div>
              </div>
              <div>
                <h3 className={`font-bold ${getRarityColorClass(acquiredRune.rarity)}`}>
                  New Rune Acquired: {acquiredRune.name}
                </h3>
                <p className="text-sm text-gray-300">{acquiredRune.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Define rarity colors for the notification
const rarityColors = {
  common: 'bg-gray-600',
  uncommon: 'bg-green-600',
  rare: 'bg-blue-600',
  epic: 'bg-purple-600',
  legendary: 'bg-yellow-600',
  unique: 'bg-red-600',
};

export default GambleSection; 
