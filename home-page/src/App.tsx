import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import ShorcutsNav from './components/ShorcutsNav'
import gearIcon from './assets/gear.svg'
import SettingsDialog from './components/SettingsDialog'
import { getWallpaper } from './db'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({ backgroundColor: '#1a1a1a' })

  const updateBackground = async () => {
    const savedBg = localStorage.getItem('appBackground') || '#1a1a1a'

    if (savedBg.startsWith('custom:')) {
      const id = savedBg.split(':')[1]
      const blob = await getWallpaper(id)
      if (blob) {
        const url = URL.createObjectURL(blob)
        setBgStyle({
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        })
        // No revocamos aquí para que la imagen se mantenga visible
      }
    } else {
      setBgStyle({ backgroundColor: savedBg })
    }
  }

  useEffect(() => {
    updateBackground()
    window.addEventListener('storage-update', updateBackground)
    return () => window.removeEventListener('storage-update', updateBackground)
  }, [])

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center gap-12 text-white p-8 transition-all duration-500"
      style={bgStyle}
    >
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-7xl flex flex-col items-center gap-12">
        <SearchBar />
        <ShorcutsNav />
      </div>

      <button
        type='button'
        onClick={() => setIsSettingsOpen(true)}
        className="fixed right-[1vw] bottom-[1vw] p-2 bg-transparent"
      >
        <img
          className="h-8 w-8 invert"
          src={gearIcon}
          alt="Settings"
        />
      </button>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  )
}

export default App

