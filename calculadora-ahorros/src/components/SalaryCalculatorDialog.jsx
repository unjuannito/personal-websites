// src/SalaryCalculatorDialog.jsx
import { useEffect, useState } from 'react';
import SalaryIcon from '../assets/SalaryIcon.svg';
// import { calculateNetSalary } from '../services/salaryCalculatorService';
import '../styles/stageContainer.css';

export default function SalaryCalculatorDialog({ isOpen, onClose }) {

    // Estado de formulario
    const [form, setForm] = useState({
        year: 2024,
        grossAnnual: 35000,
        contractType: 'indefinido',
        group: 1,
        pays: 12,
        extraHours: 0,
        maritalStatus: 'soltero',
        children: [],
        parents: [],
        disability: 0,
        autonomicFlags: {}
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCalculate = () => {
        const output = calculateNetSalary(form);
        console.log('Resultado del cálculo:', output);
        setResult(output);
    };

    function checkScrollButtonSupport() {
        const userAgent = navigator.userAgent;

        // Comprobamos los navegadores que soportan ::scroll-button
        if (/Chrome|Edge|Opera/.test(userAgent)) {
            return 'hideScroll';
        }
        // Si el navegador no soporta ::scroll-button, devolvemos la clase para ocultar el scroll
        return ''; // Soporta ::scroll-button, no ocultamos el scroll

    }

    return (
        <dialog open={isOpen} onClose={onClose}>
            <h2>Calculadora de Salario Neto</h2>
            <main className={`slider ${checkScrollButtonSupport()}`}>
                <section>
                    <h3>Datos salariales</h3>
                    <label>
                        Salario Bruto Anual:
                        <input
                            type="number"
                            name="grossAnnual"
                            value={form.grossAnnual}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Número de Pagas Anuales:
                        <select name="pays" value={form.pays} onChange={handleChange}>
                            <option value={12}>12</option>
                            <option value={14}>14</option>
                        </select>
                    </label>
                    <label>
                        Pluses exentos:
                        <select name="pays" value={form.pays} onChange={handleChange}>
                            <option value={12}>12</option>
                            <option value={14}>14</option>
                        </select>
                    </label>
                </section>
                <section>
                    <h3>
                        Datos laborales adicionales
                    </h3>
                    <label>
                        Tipo de Contrato:
                        <select name="contractType" value={form.contractType} onChange={handleChange}>
                            <option value="indefinido">Indefinido</option>
                            <option value="temporal">Duración Determinada</option>
                        </select>

                    </label>

                    <label>
                        Grupo de Cotización:
                        <select name="group" value={form.group} onChange={handleChange}>
                            <option value={1}>1 - Ingenieros/Licenciados</option>
                            <option value={2}>2 - Técnicos/Peritos</option>
                        </select>
                    </label>

                </section>
                <section>
                    <h3>Datos personales</h3>

                </section>
            </main>
            <footer className="modal-actions">
                <button onClick={onClose} className="btn-cancel">Cancelar</button>
                <button onClick={handleCalculate} className="btn-calculate">Calcular</button>
            </footer>
        </dialog>
    );
}

// services/salaryCalculatorService.js
export function calculateNetSalary({ year, grossAnnual, contractType, group, pays, extraHours }) {
    // Paso 1: Salario Bruto Mensual
    const grossMonthly = grossAnnual / pays;
    // Paso 2: Cotizaciones SS (simplificado)
    const base = Math.max(getMinBase(year, group), Math.min(grossMonthly, getMaxBase(year, group)));
    const cuotaCC = base * 0.047;
    const cuotaDesempleo = base * (contractType === 'indefinido' ? 0.0155 : 0.016);
    const cuotaFP = base * 0.001;
    const cuotaMEI = base * (year === 2025 ? 0.0013 : 0.0012);
    const cuotaHoraExt = extraHours * 0.047;
    const totalSS = cuotaCC + cuotaDesempleo + cuotaFP + cuotaMEI + cuotaHoraExt;

    // Paso IRPF (muy simplificado, asumiendo tipo fijo 15%)
    const annualSS = totalSS * pays;
    const netAnnualBase = grossAnnual - annualSS;
    const irpfAnnual = netAnnualBase * 0.15;
    const irpfMonthly = irpfAnnual / pays;

    const netMonthly = grossMonthly - totalSS - irpfMonthly;

    return {
        año_fiscal: year,
        salario_bruto_anual: grossAnnual,
        salario_bruto_mensual: parseFloat(grossMonthly.toFixed(2)),
        cotizaciones_seguridad_social: {
            base_cotizacion_cc_mensual: parseFloat(base.toFixed(2)),
            cuota_cc_mensual: parseFloat(cuotaCC.toFixed(2)),
            cuota_desempleo_mensual: parseFloat(cuotaDesempleo.toFixed(2)),
            cuota_formacion_profesional_mensual: parseFloat(cuotaFP.toFixed(2)),
            cuota_mei_mensual: parseFloat(cuotaMEI.toFixed(2)),
            cuota_horas_extraordinarias_mensual: parseFloat(cuotaHoraExt.toFixed(2)),
            total_cotizacion_mensual: parseFloat(totalSS.toFixed(2))
        },
        irpf: {
            irpf_a_retener_anual: parseFloat(irpfAnnual.toFixed(2)),
            irpf_a_retener_mensual: parseFloat(irpfMonthly.toFixed(2))
        },
        salario_neto_mensual: parseFloat(netMonthly.toFixed(2))
    };
}

function getMinBase(year, group) {
    const table = {
        2024: { 1: 1847.4, 2: 1532.1 },
        2025: { 1: 1929.0, 2: 1599.6 }
    };
    return table[year][group];
}
function getMaxBase(year, _group) {
    const table = { 2024: 4720.5, 2025: 4909.5 };
    return table[year];
}

// assets/SalaryIcon.svg
/*
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 2v2h10V6H7zm0 4v6h10v-6H7z"/>
  <path d="M9 10h6v2H9z"/>
</svg>
*/
