import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import RuneCard from './RuneCard';

const RuneCollection: React.FC = () => {
  const { runes, getActiveRunesCount, maxActiveRunes } = useGameStore();
  const [filter, setFilter] = useState<string>('all');
  
  const filteredRunes = runes.filter(rune => {
    if (filter === 'all') return true;
    if (filter === 'active') return rune.active;
    if (filter === 'inactive') return !rune.active;
    return rune.rarity === filter;
  });
  
  const activeRunesCount = getActiveRunesCount();
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Rune Collection</h2>
        <div className="text-sm text-gray-400">
          <span className="text-indigo-400 font-semibold">{activeRunesCount}</span>/{maxActiveRunes} Active
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'inactive' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'common' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('common')}
        >
          Common
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'uncommon' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('uncommon')}
        >
          Uncommon
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'rare' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('rare')}
        >
          Rare
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'epic' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('epic')}
        >
          Epic
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'legendary' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('legendary')}
        >
          Legendary
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'unique' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setFilter('unique')}
        >
          Unique
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRunes.length > 0 ? (
          filteredRunes.map(rune => (
            <RuneCard key={rune.id} rune={rune} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400">
            No runes yet! Gamble to acquire runes.
          </div>
        )}
      </div>
    </div>
  );
};

export default RuneCollection; 
