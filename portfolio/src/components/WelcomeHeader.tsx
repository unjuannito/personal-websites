import { TRANSLATIONS, type Language } from "../utils/Constants";
import userIcon from "/src/assets/user-icon.jpg"

interface WelcomeHeaderProps {
    lan: Language;
}

export default function WelcomeHeader({ lan }: WelcomeHeaderProps) {
    const t = TRANSLATIONS[lan];

    return (
        <header className="flex flex-col md:flex-row items-center gap-8 py-16 animate-in">
            <div className="flex-shrink-0">
                <img
                    src={userIcon}
                    alt={t.WELCOME_IMAGE_ALT}
                    className="w-[150px] h-[150px] rounded-full object-cover border-4 border-accent shadow-[0_0_20px_var(--color-accent-glow)]"
                />
            </div>
            <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold leading-[1.2] pb-1 bg-gradient-to-r from-[#f8f9fa] to-[#3b82f6] bg-clip-text text-transparent">
                    {t.WELCOME_TITLE}
                </h1>
                <h2 className="text-xl md:text-2xl text-text-secondary font-medium whitespace-pre-line">
                    {t.WELCOME_SUBTITLE}
                </h2>
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    {/* <a
                        href="mailto:juan.canas.canete@gmail.com"
                        className="bg-accent text-white p-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all hover:bg-accent/80 hover:scale-105 shadow-[0_0_15px_var(--color-accent-glow)] font-medium"
                    >
                        {t.CONTACT_BUTTON}
                    </a> */}
                    <a
                        href={t.LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-card-bg border border-[#27272a] p-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all hover:border-accent hover:text-accent"
                    >
                        LinkedIn
                    </a>
                    <a
                        href={t.GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-card-bg border border-[#27272a] p-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all hover:border-accent hover:text-accent"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </header>
    )
}