import { TRANSLATIONS, type Language } from "../utils/Constants";
import skillCategories from "../data/skills.json";

interface SkillCategory {
    title: string;
    skills: string[];
}

interface SkillsProps {
    lan: Language;
}

export default function Skills({ lan }: SkillsProps) {
    const t = TRANSLATIONS[lan];
    const categories: SkillCategory[] = skillCategories;

    return (
        <section className="mt-16" id="skills">
            <h2 className="text-3xl mb-8 text-text-primary border-l-4 border-accent pl-4">
                {t.SKILLS_TITLE}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                    <div key={index} className="bg-card-bg border border-[#27272a] p-5 rounded-xl flex flex-col gap-3 hover:border-accent transition-colors">
                        <h3 className="text-lg font-bold text-text-primary">{category.title}</h3>
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, i) => (
                                <span key={i} className="bg-tag-bg text-text-secondary px-2 py-1 rounded text-[0.75rem] font-medium border border-[#27272a]">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
