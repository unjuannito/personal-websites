import { TRANSLATIONS, type Language } from "../utils/Constants";
import educationJSON from "../data/education.json";

interface EducationItem {
    school: string;
    degree: string;
    period: string;
}

interface EducationProps {
    lan: Language;
}

export default function Education({ lan }: EducationProps) {
    const t = TRANSLATIONS[lan];
    const education: EducationItem[] = educationJSON[lan];

    return (
        <section className="mt-16" id="education">
            <h2 className="text-3xl mb-10 text-text-primary border-l-4 border-accent pl-4">
                {t.EDUCATION_TITLE}
            </h2>
            <div className="flex flex-col gap-0 ml-6">
                {education.map((edu, index) => (
                    <div key={index} className="relative pl-8 pb-8 last:pb-0 border-l border-[#27272a]">
                        <div className="absolute w-2.5 h-2.5 bg-[#a0a0ab] rounded-full -left-[5.5px] top-2 shadow-[0_0_8px_rgba(160,160,171,0.3)]"></div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-xl text-text-primary font-bold">{edu.degree}</h3>
                            <p className="text-accent font-medium leading-tight">{edu.school}</p>
                            <p className="text-sm text-text-secondary">{edu.period}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
