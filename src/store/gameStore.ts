import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Define rune types
export type RuneRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique';

export interface Rune {
  id: string;
  name: string;
  description: string;
  rarity: RuneRarity;
  pointsPerSecond: number;
  timeMultiplier: number;
  cost: number;
  image: string;
  owned: boolean;
  isRandom: boolean;
  active: boolean; // Whether the rune is currently active
}

// Define game state
interface GameState {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  timeMultiplier: number;
  runes: Rune[];
  lastUpdate: number;
  runeIdCounter: number; // Counter for generating unique IDs for random runes
  maxActiveRunes: number; // Maximum number of runes that can be active at once
  
  // Actions
  incrementPoints: () => void;
  gamblePurchase: (amount: number) => void;
  toggleRuneActive: (runeId: string) => void; // Toggle a rune's active status
  update: () => void;
  reset: () => void;
  getActiveRunes: () => Rune[]; // Get all active runes
  getActiveRunesCount: () => number; // Get count of active runes
}

// Helper function to generate random rune attributes based on rarity
const generateRandomRune = (rarity: RuneRarity, id: number): Rune => {
  // Base attributes by rarity
  const rarityAttributes = {
    common: {
      pointsPerSecondRange: [0.5, 2],
      timeMultiplierRange: [1, 1.05],
      namePrefix: ['Minor', 'Small', 'Weak', 'Faint', 'Dull'],
    },
    uncommon: {
      pointsPerSecondRange: [1, 5],
      timeMultiplierRange: [1, 1.1],
      namePrefix: ['Steady', 'Decent', 'Fair', 'Moderate', 'Stable'],
    },
    rare: {
      pointsPerSecondRange: [3, 10],
      timeMultiplierRange: [1, 1.15],
      namePrefix: ['Strong', 'Vibrant', 'Potent', 'Vigorous', 'Robust'],
    },
    epic: {
      pointsPerSecondRange: [8, 20],
      timeMultiplierRange: [1.05, 1.2],
      namePrefix: ['Powerful', 'Mighty', 'Formidable', 'Impressive', 'Dominant'],
    },
    legendary: {
      pointsPerSecondRange: [15, 40],
      timeMultiplierRange: [1.1, 1.3],
      namePrefix: ['Legendary', 'Ancient', 'Mythical', 'Fabled', 'Storied'],
    },
    unique: {
      pointsPerSecondRange: [30, 70],
      timeMultiplierRange: [1.15, 1.4],
      namePrefix: ['Divine', 'Celestial', 'Transcendent', 'Ethereal', 'Cosmic'],
    },
  };
  
  // Random attribute types
  const runeTypes = ['Power', 'Time', 'Fortune', 'Energy', 'Wisdom', 'Vitality', 'Harmony', 'Balance'];
  
  // Generate random values within the ranges for the given rarity
  const attributes = rarityAttributes[rarity];
  
  // Decide if this rune will focus on points per second or time multiplier
  const focusOnPoints = Math.random() > 0.3; // 70% chance to focus on points
  
  let pointsPerSecond = 0;
  let timeMultiplier = 1;
  
  if (focusOnPoints) {
    // Focus on points per second
    pointsPerSecond = Math.random() * (attributes.pointsPerSecondRange[1] - attributes.pointsPerSecondRange[0]) + attributes.pointsPerSecondRange[0];
    // Small or no time multiplier
    timeMultiplier = Math.random() > 0.7 ? 
      Math.random() * 0.05 + 1 : // 30% chance of small time multiplier
      1; // 70% chance of no time multiplier
  } else {
    // Focus on time multiplier
    timeMultiplier = Math.random() * (attributes.timeMultiplierRange[1] - attributes.timeMultiplierRange[0]) + attributes.timeMultiplierRange[0];
    // Small or no points per second
    pointsPerSecond = Math.random() > 0.7 ? 
      Math.random() * attributes.pointsPerSecondRange[0] : // 30% chance of small points per second
      0; // 70% chance of no points per second
  }
  
  // Round to 2 decimal places
  pointsPerSecond = Math.round(pointsPerSecond * 100) / 100;
  timeMultiplier = Math.round(timeMultiplier * 100) / 100;
  
  // Generate name and description
  const prefix = attributes.namePrefix[Math.floor(Math.random() * attributes.namePrefix.length)];
  const type = runeTypes[Math.floor(Math.random() * runeTypes.length)];
  const name = `${prefix} ${type} Rune`;
  
  let description = '';
  if (pointsPerSecond > 0 && timeMultiplier > 1) {
    description = `Generates ${pointsPerSecond} points per second and increases time flow by ${Math.round((timeMultiplier - 1) * 100)}%.`;
  } else if (pointsPerSecond > 0) {
    description = `Generates ${pointsPerSecond} points per second.`;
  } else if (timeMultiplier > 1) {
    description = `Increases time flow by ${Math.round((timeMultiplier - 1) * 100)}%.`;
  }
  
  // Calculate cost based on attributes
  const pointsCost = pointsPerSecond * 20;
  const timeCost = (timeMultiplier - 1) * 500;
  const cost = Math.max(10, Math.round(pointsCost + timeCost));
  
  // Determine image based on rarity
  const rarityImages = {
    common: 'basic-rune.png',
    uncommon: 'speed-rune.png',
    rare: 'power-rune.png',
    epic: 'fortune-rune.png',
    legendary: 'time-rune.png',
    unique: 'infinity-rune.png',
  };
  
  return {
    id: `random-rune-${id}`,
    name,
    description,
    rarity,
    pointsPerSecond,
    timeMultiplier,
    cost,
    image: rarityImages[rarity],
    owned: true, // Automatically owned when created through gambling
    isRandom: true,
    active: true, // New runes are active by default if there's room
  };
};

// Helper function to recalculate total stats based on active runes
const calculateTotalStats = (runes: Rune[]) => {
  const activeRunes = runes.filter(rune => rune.active);
  
  let totalPointsPerSecond = 0;
  let totalTimeMultiplier = 1;
  
  activeRunes.forEach(rune => {
    totalPointsPerSecond += rune.pointsPerSecond;
    totalTimeMultiplier *= rune.timeMultiplier;
  });
  
  // Round to 2 decimal places
  totalPointsPerSecond = Math.round(totalPointsPerSecond * 100) / 100;
  totalTimeMultiplier = Math.round(totalTimeMultiplier * 100) / 100;
  
  return { totalPointsPerSecond, totalTimeMultiplier };
};

// Create the store
export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    points: 0, // Start with 0 points so players need to click to earn their first gambling opportunity
    pointsPerClick: 1,
    pointsPerSecond: 0,
    timeMultiplier: 1,
    runes: [], // Start with no runes
    lastUpdate: Date.now(),
    runeIdCounter: 0,
    maxActiveRunes: 12, // Maximum number of active runes
    
    incrementPoints: () => {
      set((state) => {
        state.points += state.pointsPerClick;
      });
    },
    
    gamblePurchase: (amount: number) => {
      set((state) => {
        if (state.points >= amount) {
          state.points -= amount;
          
          // Random chance to get a rune based on amount spent
          const rarityChances = {
            common: 0.5,
            uncommon: 0.25,
            rare: 0.15,
            epic: 0.07,
            legendary: 0.025,
            unique: 0.005,
          };
          
          // Higher amount spent increases chances for better runes
          const multiplier = Math.log10(amount) / 2;
          const roll = Math.random();
          
          let selectedRarity: RuneRarity = 'common';
          let cumulativeChance = 0;
          
          for (const [rarity, chance] of Object.entries(rarityChances) as [RuneRarity, number][]) {
            const adjustedChance = chance * multiplier;
            cumulativeChance += adjustedChance;
            if (roll <= cumulativeChance) {
              selectedRarity = rarity;
              break;
            }
          }
          
          // Generate a random rune with the selected rarity
          const newRune = generateRandomRune(selectedRarity, state.runeIdCounter++);
          
          // Check if we can activate this rune
          const activeRunesCount = state.runes.filter(rune => rune.active).length;
          newRune.active = activeRunesCount < state.maxActiveRunes;
          
          // Add the new rune to the collection
          state.runes.push(newRune);
          
          // Update player stats based on active runes
          const { totalPointsPerSecond, totalTimeMultiplier } = calculateTotalStats(state.runes);
          state.pointsPerSecond = totalPointsPerSecond;
          state.timeMultiplier = totalTimeMultiplier;
          
          // Dispatch a custom event for the UI to show the new rune
          window.dispatchEvent(new CustomEvent('rune-acquired', { 
            detail: { rune: newRune }
          }));
        }
      });
    },
    
    toggleRuneActive: (runeId: string) => {
      set((state) => {
        const runeIndex = state.runes.findIndex(rune => rune.id === runeId);
        
        if (runeIndex !== -1) {
          const rune = state.runes[runeIndex];
          const activeRunesCount = state.runes.filter(rune => rune.active).length;
          
          // If trying to activate and we're at the limit, don't allow it
          if (!rune.active && activeRunesCount >= state.maxActiveRunes) {
            // Dispatch an event to notify the user
            window.dispatchEvent(new CustomEvent('max-active-runes-reached'));
            return;
          }
          
          // Toggle the active status
          state.runes[runeIndex].active = !state.runes[runeIndex].active;
          
          // Recalculate stats
          const { totalPointsPerSecond, totalTimeMultiplier } = calculateTotalStats(state.runes);
          state.pointsPerSecond = totalPointsPerSecond;
          state.timeMultiplier = totalTimeMultiplier;
        }
      });
    },
    
    getActiveRunes: () => {
      return get().runes.filter(rune => rune.active);
    },
    
    getActiveRunesCount: () => {
      return get().runes.filter(rune => rune.active).length;
    },
    
    update: () => {
      set((state) => {
        const now = Date.now();
        const deltaTime = (now - state.lastUpdate) / 1000; // Convert to seconds
        const adjustedDeltaTime = deltaTime * state.timeMultiplier;
        
        state.points += state.pointsPerSecond * adjustedDeltaTime;
        state.lastUpdate = now;
      });
    },
    
    reset: () => {
      set({
        points: 0, // Start with 0 points
        pointsPerClick: 1,
        pointsPerSecond: 0,
        timeMultiplier: 1,
        runes: [], // Reset to no runes
        lastUpdate: Date.now(),
        runeIdCounter: 0,
        maxActiveRunes: 12,
      });
    },
  }))
);

// Export a function to start the game loop
export const startGameLoop = () => {
  const updateInterval = setInterval(() => {
    useGameStore.getState().update();
  }, 100); // Update 10 times per second for smoother updates
  
  return () => clearInterval(updateInterval); // Return cleanup function
}; 
