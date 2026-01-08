import { useEffect, useState } from 'react'
import './styles/App.css'
import WelcomeHeader from './components/WelcomeHeader'
import Projects from './components/Projects'

function App() {
  const [ lan, setLan] = useState<string | null>(null);

  useEffect( () => {
        const localData = localStorage.getItem("lan")
            ? JSON.parse(localStorage.getItem("lan") as string)
            : null;
        if (localData == "es" || localData == "en") {
          setLan(localData)
        } else if (localData === null) {
          const lan = navigator.language.startsWith('es') ? 'es' : 'en';
          localStorage.setItem("lan", JSON.stringify(lan))
        }
  }, [])

  const handleChangueLan = () => {
    const newLan = lan == "en" ? "es" : "en";
    localStorage.setItem("lan", JSON.stringify(newLan))
    setLan(newLan);
  }

  return (
    <>
      <span className='lan' onClick={handleChangueLan}>{lan}</span>
      <WelcomeHeader lan={lan}></WelcomeHeader>
      <br />
      <Projects lan={lan}></Projects>
    </>
  )
}

export default App
