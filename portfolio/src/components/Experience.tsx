import { TRANSLATIONS, type Language } from "../utils/Constants";
import { calculateDuration, formatDate } from "../utils/DateUtils";
import experienceJSON from "../data/experience.json";
import bbvaLogo from "../assets/bbva_technology_en_europa_logo.jpg";
import defaultLogo from "../assets/user-icon.jpg";

interface Role {
    role: string;
    subRole?: string;
    startDate: string;
    endDate: string | "present";
    location: string;
    skills: string[];
}

interface ExperienceItem {
    company: string;
    logo: string;
    type: string;
    location_type: string;
    roles: Role[];
}

interface ExperienceProps {
    lan: Language;
}

// Map of logos to avoid dynamic import issues in some environments
const LOGO_MAP: Record<string, string> = {
    "bbva_technology_en_europa_logo.jpg": bbvaLogo
};

export default function Experience({ lan }: ExperienceProps) {
    const t = TRANSLATIONS[lan];
    const experiences: ExperienceItem[] = experienceJSON[lan] as ExperienceItem[];

    // Helper to calculate total duration for a company
    const getCompanyTotalDuration = (roles: Role[]) => {
        if (roles.length === 0) return "";
        
        // Find earliest start and latest end
        const startDates = roles.map(r => new Date(r.startDate).getTime());
        const endDates = roles.map(r => r.endDate === "present" ? new Date().getTime() : new Date(r.endDate).getTime());
        
        const earliestStart = new Date(Math.min(...startDates)).toISOString().split('T')[0];
        const latestEnd = roles.some(r => r.endDate === "present") ? "present" : new Date(Math.max(...endDates)).toISOString().split('T')[0];
        
        return calculateDuration(earliestStart, latestEnd, lan);
    };

    return (
        <section className="flex flex-col gap-16">
            <div>
                <h2 className="text-3xl mb-10 text-text-primary border-l-4 border-accent pl-4">
                    {t.EXPERIENCE_TITLE}
                </h2>
                <div className="flex flex-col gap-12">
                    {experiences.map((exp, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            {/* Company Header */}
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-white rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#27272a]">
                                    <img 
                                        src={LOGO_MAP[exp.logo] || defaultLogo} 
                                        alt={exp.company} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl text-text-primary font-bold leading-tight">{exp.company}</h3>
                                    <p className="text-sm text-text-secondary">
                                        {exp.type} • {getCompanyTotalDuration(exp.roles)}
                                    </p>
                                    {/* location_type hidden by user request */}
                                    {/* <p className="text-sm text-text-secondary">{exp.location_type}</p> */}
                                </div>
                            </div>

                            {/* Roles Timeline */}
                            <div className="flex flex-col gap-0 ml-6">
                                {exp.roles.map((role, rIndex) => (
                                    <div key={rIndex} className="relative pl-8 pb-4 last:pb-0 border-l border-[#27272a]">
                                        {/* Dot */}
                                        <div className="absolute w-2.5 h-2.5 bg-[#a0a0ab] rounded-full -left-[5.5px] top-2 shadow-[0_0_8px_rgba(160,160,171,0.3)]"></div>
                                        
                                        <div className="flex flex-col gap-0.5">
                                            <h4 className="text-lg text-text-primary font-bold leading-snug">{role.role}</h4>
                                            {role.subRole && (
                                                <p className="text-sm text-text-primary/80 font-medium -mt-0.5 mb-0.5 italic">{role.subRole}</p>
                                            )}
                                            <p className="text-sm text-text-secondary">
                                                {formatDate(role.startDate, lan, TRANSLATIONS)} - {formatDate(role.endDate, lan, TRANSLATIONS)} • {calculateDuration(role.startDate, role.endDate, lan)}
                                            </p>
                                            <p className="text-sm text-text-secondary">{role.location}</p>
                                            
                                            {/* Skills hidden by user request */}
                                            {/* 
                                            <div className="flex items-start gap-2 text-text-primary text-[0.9rem] font-medium">
                                                <span className="mt-1">💎</span>
                                                <p>{role.skills.join(lan === 'es' ? " y " : " and ")}</p>
                                            </div>
                                            */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
