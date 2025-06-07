import { useContext } from "react";
import AppContext from "../context/AppContext";

export default function useUtils() {
    // const { identifiers, setIdentifiers } = useContext(AppContext);
    const identifiers = [];
    const setIdentifiers = () => { };
    function generateIdentifier(numChars, firstChar, maxAttempts = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        // Validar número de caracteres
        numChars = typeof numChars === 'number' && numChars > 0 && numChars <= 16 ? numChars : 8;

        // Función para crear un ID aleatorio
        const createId = () => {
            let identifier = (typeof firstChar === 'string' && firstChar.length === 1)
                ? firstChar
                : chars[Math.floor(Math.random() * chars.length)];

            for (let i = 0; i < numChars - 1; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                identifier += chars[randomIndex];
            }
            return identifier;
        };

        let attempts = 0;
        let newId;

        do {
            if (attempts >= maxAttempts) {
                throw new Error('No se pudo generar un ID único después de varios intentos');
            }
            newId = createId();
            attempts++;
        } while (identifiers.includes(newId));

        // Añadir nuevo ID al contexto
        setIdentifiers(prev => [...prev, newId]);

        return newId;
    }

    function getNextMonthFormatted(endYear, endMonth) {
        let year = parseInt(endYear);
        let month = parseInt(endMonth) + 1;

        if (month > 12) {
            month = 1;
            year += 1;
        }

        const monthStr = String(month).padStart(2, '0');
        return `${year}-${monthStr}`;
    }

    function formatearMesAnio(yyyyMm) {
        const [year, month] = yyyyMm.split('-');
        const date = new Date(`${year}-${month}-01`);

        const formatted = new Intl.DateTimeFormat('es-ES', {
            month: 'long',
            year: 'numeric'
        }).format(date);

        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    return { generateIdentifier, getNextMonthFormatted, formatearMesAnio };
}
