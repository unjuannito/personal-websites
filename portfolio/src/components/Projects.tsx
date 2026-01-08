import { PROJECTS_TITLE } from "../utils/Constants";
import projectsJSON from "../data/projects.json"


export default function Projects ( {lan} : {lan: string}) {
const projects = lan === 'es' ? projectsJSON.es : projectsJSON.en

    return(
        <article>
            <h2>{PROJECTS_TITLE}:</h2>
            {
                projects.map( (project, index) => (
                    <article key={index} onClick={() => {window.location.href = project.link;}}>
                        <h2>{project.title}</h2>
                        <h3>{project.desc}</h3>
                    </article>
                ))
            }
        </article>
    )
}