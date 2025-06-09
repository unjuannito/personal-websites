import { use, useEffect, useState } from "react"
import "./results.css"
import usePeople from "../hooks/usePeople"

export default function Results() {
    const { people, getPerson } = usePeople()
    const [rules, setRules] = useState({ endDate: '2000-01', selectedPerson: 'all' })
    const [results, setResults] = useState({ quantity: null })

    useEffect(() => {
        let latestDate = null;
        people.forEach(person => {
            person.stages.forEach(stage => {
                if (!stage.endDate) return; // Skip if endDate is not defined
                if (!latestDate) latestDate = stage.endDate; // Skip if endDate is not defined
                const [stageYear, stageMonth] = stage.endDate.split('-');
                const [latestDateYear, latestDateMonth] = latestDate.split('-');
                if (stageYear > latestDateYear || (stageYear === latestDateYear && stageMonth > latestDateMonth)) {
                    latestDate = stage.endDate;
                }
            });
        });
        if (!latestDate) latestDate = rules.endDate; // Default to '2000-01' if no stages found
        setRules({ endDate: latestDate, selectedPerson: rules.selectedPerson });
    }, [people])

    useEffect(() => {
        calculate();
    }, [people, rules]);

    const calculate = () => {
        if (rules.selectedPerson === 'all') {
            // Calcular el ahorro de todos los usuarios
            let totalSavings = 0;
            people.forEach((person) => {
                totalSavings += calculatePersonSavings(person);
            });
            setResults({ quantity: totalSavings.toFixed(2) }); // Guardar el total de ahorros redondeado a 2 decimales
        } else {
            const selectedPerson = getPerson(rules.selectedPerson);
            if (selectedPerson) {
                // Realizar cálculos para la persona seleccionada
                setResults({ quantity: calculatePersonSavings(selectedPerson).toFixed(2) });
            }
        }
    }

    const calculatePersonSavings = (person) => {
        let quantity = 0;
        person.stages.forEach((stage) => {
            //duration in months get from stage.startDate and stage.endDate BOTH LIKE '2020-01'
            const [startYear, startMonth] = stage.startDate.split('-');
            const [endYear, endMonth] = stage.endDate.split('-');
            // Calculate the duration in months;
            const { years, months } = {
                years: parseInt(endYear) - parseInt(startYear),
                months: parseInt(endMonth) - parseInt(startMonth)
            };

            const monthExpensesTotal = stage.monthlyExpenses * (12 * years + months);
            const anualExpensesTotal = stage.annualExpenses * (years + months / 12);
            const totalExpense = monthExpensesTotal + anualExpensesTotal;
            const annualNetIncomeTotal = stage.annualNetIncome * (years + months / 12);
            const totalSavings = annualNetIncomeTotal - totalExpense;
            quantity += parseInt(person.initialSavings ? person.initialSavings : 0) + totalSavings;
        });
        return quantity; // Return the total savings rounded to 2 decimal places
    }

    return (
        <>
            <div className="results">
                <section className="rules">
                    <label>
                        <h3>Ahorros de:</h3>
                        <select value={rules.selectedPerson} onChange={(e) => setRules({ ...rules, selectedPerson: e.target.value })}>
                            <option value="all">Todos</option>
                            {people.map((person, index) => (
                                <option key={index} value={person.identifier}>{person.name}</option>
                            ))}
                        </select>
                    </label>

                </section>
                <main>
                    <h2>Ahorros</h2>
                    <h3>{results.quantity ? (isNaN(results.quantity) ? 'Rellene correctamente todos los campos' : results.quantity + '€') : '0€'}</h3>
                </main>
            </div>

        </>

    )

}