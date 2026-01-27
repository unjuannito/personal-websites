import { TRANSLATIONS, type Language } from "../utils/Constants";

interface NavbarProps {
    lan: Language;
    toggleLan: () => void;
}

export default function Navbar({ lan, toggleLan }: NavbarProps) {
    const t = TRANSLATIONS[lan];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // Compensación para el navbar fijo (64px + 16px extra de margen)
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg-color/80 border-b border-[#27272a] mb-8 -mx-6 px-6">
            <div className="max-w-[1000px] mx-auto flex justify-between items-center h-16">
                <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
                    <button 
                        onClick={() => scrollToSection('home')}
                        className="text-text-secondary hover:text-accent transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        {t.NAV_HOME}
                    </button>
                    <button 
                        onClick={() => scrollToSection('experience')}
                        className="text-text-secondary hover:text-accent transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        {t.NAV_EXPERIENCE}
                    </button>
                    {/* <button 
                        onClick={() => scrollToSection('certifications')}
                        className="text-text-secondary hover:text-accent transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        {t.NAV_CERTIFICATIONS}
                    </button> */}
                    <button 
                        onClick={() => scrollToSection('projects')}
                        className="text-text-secondary hover:text-accent transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        {t.NAV_PROJECTS}
                    </button>
                    <button 
                        onClick={() => scrollToSection('education')}
                        className="text-text-secondary hover:text-accent transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        {t.EDUCATION_TITLE}
                    </button>
                </div>
                
                <button 
                    className="bg-card-bg border border-[#333] text-text-primary px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-300 font-medium hover:border-accent hover:bg-[#252529] hover:-translate-y-0.5 flex items-center gap-2 ml-4 flex-shrink-0" 
                    onClick={toggleLan}
                >
                    {lan === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}
                </button>
            </div>
        </nav>
    );
}
