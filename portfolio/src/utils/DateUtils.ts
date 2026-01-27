import type { Language } from "./Constants";

export const calculateDuration = (startDate: string, endDate: string | "present", lan: Language): string => {
    const start = new Date(startDate);
    const end = endDate === "present" ? new Date() : new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    // A LinkedIn-style duration: if months is 0 and years > 0, we just show years. 
    // Usually, they count the partial month too, so let's add 1 to months if it's not exactly the same day.
    // For simplicity, we'll follow the "1 yr 7 mos" or "4 mos" format.
    months += 1; // Include the starting month
    if (months >= 12) {
        years++;
        months -= 12;
    }

    const parts: string[] = [];

    if (lan === 'es') {
        if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
        if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    } else {
        if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
        if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
    }

    return parts.join(lan === 'es' ? ' y ' : ' ');
};

export const formatDate = (dateStr: string | "present", lan: Language, translations: any): string => {
    if (dateStr === "present") {
        return lan === 'es' ? 'actualidad' : 'Present';
    }

    const date = new Date(dateStr);
    const month = translations[lan].MONTHS[date.getMonth()];
    const year = date.getFullYear();

    // Shorten month for LinkedIn style (jul. 2024)
    const shortMonth = lan === 'es' ? month.substring(0, 3).toLowerCase() + '.' : month.substring(0, 3);
    
    return `${shortMonth} ${year}`;
};
