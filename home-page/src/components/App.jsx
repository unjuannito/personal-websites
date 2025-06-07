import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './search-bar-components/SearchBar'
import ShortcutsManager from './shortcuts-components/ShortcutsManager'
import backgroundIcon from '../assets/background-icon.svg'
import ChangueBackgroundDialog from './ChangueBackgroundDialog'

function App() {
  const [changueBackgroundDialogIsOpen, setChangueBackgroundDialogIsOpen] = useState(false)
  const handleChangueBackground = () => {
    setChangueBackgroundDialogIsOpen(true);
  }

  const closeDialog = () => {
    setChangueBackgroundDialogIsOpen(false);
  }

  return (
    <>
      <SearchBar/>
      <ShortcutsManager/>
      <img className='backgroundIcon' src={backgroundIcon} alt="Cambiar fondo" onClick={handleChangueBackground} />
      <ChangueBackgroundDialog open={changueBackgroundDialogIsOpen} closeDialog={closeDialog} />  
    </>
  )
}

export default App