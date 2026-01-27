import { TRANSLATIONS, type Language } from "../utils/Constants";
import certificationsJSON from "../data/certifications.json";
import adminLogo from "../assets/platform-admin.png";
import appBuilderLogo from "../assets/platfor-app-builder.png";

const LOGO_MAP: Record<string, string> = {
    "platform-admin.png": adminLogo,
    "platfor-app-builder.png": appBuilderLogo
};

interface Certification {
    name: string;
    issuer: string;
    date: string;
    logo: string;
}

interface CertificationsProps {
    lan: Language;
}

export default function Certifications({ lan }: CertificationsProps) {
    const t = TRANSLATIONS[lan];
    const certifications: Certification[] = certificationsJSON[lan];

    return (
        <section className="mt-16" id="certifications">
            <h2 className="text-3xl mb-8 text-text-primary border-l-4 border-accent pl-4">
                {t.CERTIFICATIONS_TITLE}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                    <div key={index} className="bg-card-bg border border-[#27272a] p-4 rounded-xl flex items-center gap-4 hover:border-accent transition-all group">
                        <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                            <img 
                                src={LOGO_MAP[cert.logo]} 
                                alt={cert.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-text-primary font-bold leading-tight group-hover:text-accent transition-colors">
                                {cert.name}
                            </h3>
                            <p className="text-sm text-text-secondary">{cert.issuer} • {cert.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
