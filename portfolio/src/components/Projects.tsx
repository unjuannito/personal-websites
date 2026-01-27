import { TRANSLATIONS, type Language } from "../utils/Constants";
import projectsJSON from "../data/projects.json"

interface Project {
    title: string;
    desc: string;
    technologies: string[];
    github?: string;
    web?: string;
}

interface ProjectsProps {
    lan: Language;
}

export default function Projects({ lan }: ProjectsProps) {
    const projects: Project[] = projectsJSON[lan];
    const t = TRANSLATIONS[lan];

    return (
        <section className="mt-16">
            <h2 className="text-3xl mb-8 text-text-primary border-l-4 border-accent pl-4">
                {t.PROJECTS_TITLE}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className="bg-card-bg border border-[#27272a] p-6 rounded-xl transition-all duration-300 flex flex-col gap-4 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_15px_-5px_var(--color-accent-glow)] group" 
                    >
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xl text-text-primary font-bold group-hover:text-accent transition-colors">{project.title}</h3>
                            <div className="flex gap-2">
                                {project.github && (
                                    <a 
                                        href={project.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-tag-bg border border-[#27272a] text-text-secondary hover:text-accent hover:border-accent px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        {t.PROJECT_VIEW_CODE}
                                    </a>
                                )}
                                {project.web && (
                                    <a 
                                        href={project.web} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                        {t.PROJECT_VIEW_WEB}
                                    </a>
                                )}
                            </div>
                        </div>
                        <p className="text-[0.95rem] text-text-secondary flex-1 leading-relaxed">{project.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                                <span key={i} className="bg-tag-bg text-accent px-2 py-1 rounded text-[0.75rem] font-bold uppercase tracking-wider">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}