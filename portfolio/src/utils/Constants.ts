import type Projects from "../components/Projects";

const constantsEN = {
    MONTHS: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
    WELCOME_TITLE : "Hey I´m Juan",
    WELCOME_SUBTITLE : "Higher Technician in Web Applications Development",
    WELCOME_IMAGE_ALT: "Juan´s photo",
    PROJECTS_TITLE: "My projects",

};

const constantsES = {
    MONTHS: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    WELCOME_TITLE : "Hola, soy Juan",
    WELCOME_SUBTITLE : "Técnico Superior en aplicaciones WEB",
    WELCOME_IMAGE_ALT: "Foto de Juan",
    PROJECTS_TITLE: "Mis proyectos",

};

//constnates independientes del idioma pueden ir aqui
const constantsIndependent = {
};
let lan = "en";
const localData = localStorage.getItem("lan")
    ? JSON.parse(localStorage.getItem("lan") as string)
    : null;
if (localData == "es" || localData == "en") {
    lan = localData
} else if (localData === null) {
    const lan = navigator.language.startsWith('es') ? 'es' : 'en';
    localStorage.setItem("lan", JSON.stringify(lan))
}

let constants;
if (lan === 'es') {
// if (false) {
    constants = constantsES;
} else {
    constants = constantsEN;
}
export const MONTHS = constants.MONTHS;
export const WELCOME_TITLE = constants.WELCOME_TITLE;
export const WELCOME_SUBTITLE = constants.WELCOME_SUBTITLE;
export const WELCOME_IMAGE_ALT = constants.WELCOME_IMAGE_ALT;
export const PROJECTS_TITLE = constants.PROJECTS_TITLE;