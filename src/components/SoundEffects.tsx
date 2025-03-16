import { useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { useGameStore } from '../store/gameStore';

// We'll use placeholder URLs for now - in a real game, you'd have actual sound files
const clickSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const purchaseSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2058/2058-preview.mp3';
const gambleSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';
const rareFindSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3';

const SoundEffects: React.FC = () => {
  const [playClick] = useSound(clickSoundUrl, { volume: 0.5 });
  const [playPurchase] = useSound(purchaseSoundUrl, { volume: 0.5 });
  const [playGamble] = useSound(gambleSoundUrl, { volume: 0.5 });
  const [playRareFind] = useSound(rareFindSoundUrl, { volume: 0.5 });
  
  const prevPoints = useRef(0);
  const prevPointsPerSecond = useRef(0);
  
  const { points, pointsPerSecond } = useGameStore();
  
  // Add a custom event listener for button clicks
  useEffect(() => {
    const handleButtonClick = () => {
      playClick();
    };
    
    // Create a custom event for button clicks
    window.addEventListener('button-click', handleButtonClick);
    
    return () => {
      window.removeEventListener('button-click', handleButtonClick);
    };
  }, [playClick]);
  
  // Add a custom event listener for gambling
  useEffect(() => {
    const handleGamble = () => {
      playGamble();
    };
    
    // Create a custom event for gambling
    window.addEventListener('gamble-attempt', handleGamble);
    
    return () => {
      window.removeEventListener('gamble-attempt', handleGamble);
    };
  }, [playGamble]);
  
  // Keep track of points for other potential uses
  useEffect(() => {
    prevPoints.current = points;
  }, [points]);
  
  useEffect(() => {
    // Check if a rune was purchased
    if (pointsPerSecond > prevPointsPerSecond.current) {
      // If it's a significant increase, it might be a rare rune
      if (pointsPerSecond - prevPointsPerSecond.current > 10) {
        playRareFind();
      } else {
        playPurchase();
      }
    }
    prevPointsPerSecond.current = pointsPerSecond;
  }, [pointsPerSecond, playPurchase, playRareFind]);
  
  return null; // This component doesn't render anything
};

export default SoundEffects; 
