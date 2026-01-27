import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Skills from './components/Skills'
// import Certifications from './components/Certifications'
import WelcomeHeader from './components/WelcomeHeader'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import { TRANSLATIONS, type Language } from './utils/Constants'

function App() {
  const [lan, setLan] = useState<Language>('en');

  useEffect(() => {
    const localData = localStorage.getItem("lan");
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed === "es" || parsed === "en") {
        setLan(parsed as Language);
        return;
      }
    }

    const browserLan = navigator.language.startsWith('es') ? 'es' : 'en';
    setLan(browserLan);
    localStorage.setItem("lan", JSON.stringify(browserLan));
  }, [])

  const handleToggleLan = () => {
    const newLan = lan === "en" ? "es" : "en";
    localStorage.setItem("lan", JSON.stringify(newLan));
    setLan(newLan);
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 min-h-screen flex flex-col">
      <Navbar lan={lan} toggleLan={handleToggleLan} />
      <main className="flex-1 flex flex-col gap-8">
        <div id="home">
          <WelcomeHeader lan={lan} />
        </div>

        <div id="experience">
          <Experience lan={lan} />
        </div>

        {/* <Certifications lan={lan} /> */}

        <Skills lan={lan} />

        <div id="projects">
          <Projects lan={lan} />
        </div>

        <Education lan={lan} />
      </main>
      <footer className="text-center py-12 text-text-secondary text-sm border-t border-[#27272a] mt-24">
        <p>© {new Date().getFullYear()} {TRANSLATIONS[lan].FOOTER_TEXT}</p>
      </footer>
    </div>
  )
}

export default App
