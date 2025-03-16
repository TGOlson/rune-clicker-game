import { useEffect } from 'react'
import { startGameLoop } from './store/gameStore'
import RuneCollection from './components/RuneCollection'
import GambleSection from './components/GambleSection'
import SoundEffects from './components/SoundEffects'
import ActiveRunesPanel from './components/ActiveRunesPanel'

function App() {
  // Start the game loop when the app loads
  useEffect(() => {
    const stopGameLoop = startGameLoop()
    
    // Clean up the interval when the component unmounts
    return () => stopGameLoop()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <SoundEffects />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 mb-2">Rune Clicker</h1>
        <p className="text-gray-400">Collect runes, increase your points, and gamble for rare finds!</p>
      </header>
      
      <div className="max-w-7xl mx-auto">
        {/* Active Runes Panel - replaces Dashboard */}
        <ActiveRunesPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GambleSection />
          </div>
          
          <div className="lg:col-span-2">
            <RuneCollection />
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Rune Clicker Game &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
