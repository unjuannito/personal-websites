import { useState, useEffect, useContext } from 'react'
import AppContext from '../context/AppContext';
import useUtils from './useUtils';

export default function usePeople() {
    const { people, setPeople, identifiers } = useContext(AppContext);
    const { generateIdentifier, getNextMonthFormatted } = useUtils();

    useEffect(() => {
        const savingsData = {
            identifiers,
            people
        }
        localStorage.setItem('savingsData', JSON.stringify(savingsData))
    }, [people])

    const addPerson = () => {
        const newPeople = [...people];
        const personIdentifier = generateIdentifier(8, 'P');
        const stageIdentifier = personIdentifier + '-' + generateIdentifier(8, 'S');
        newPeople.push({
            identifier: personIdentifier,
            name: 'Persona ' + (newPeople.length + 1),
            initialSavings: 0,
            birthDate: '2000-01',
            savingDate: '2020-01',
            stages: [{
                identifier: stageIdentifier,
                annualNetIncome: 0,
                monthlyExpenses: 0,
                annualExpenses: 0,
                startDate: '2020-01',
                endDate: '2021-01',
            }]
        });
        setPeople(newPeople);
    }

    const deletePerson = (identifier) => {
        if (!identifier) return
        console.log(people)
        console.log(identifier)
        const newPeople = people.filter(person => { person.identifier !== identifier });
        setPeople(newPeople);
    }

    const modifyPerson = (identifier, field, value) => {
        const newPeople = [...people];
        const person = newPeople.find(p => p.identifier === identifier);
        if (!person) return;
        person[field] = value;
        setPeople(newPeople);
    }

    const removePerson = (identifier) => {
        const filteredNewPeople = people.filter(person => person.identifier !== identifier);
        setPeople(filteredNewPeople);
    }

    const addStage = (parentId) => {
        const newPeople = [...people];
        const personIndex = newPeople.findIndex(p => p.identifier === parentId);
        if (personIndex === -1) return;

        const person = newPeople[personIndex];
        const lastStage = person.stages[person.stages.length - 1];
        const [lastYear, lastMonth] = lastStage.endDate.split('-');
        const newStageId = person.identifier + '-' + generateIdentifier(8, 'S');

        newPeople[personIndex].stages.push({
            identifier: newStageId,
            annualNetIncome: 0,
            monthlyExpenses: 0,
            annualExpenses: 0,
            startDate: lastStage.endDate,
            endDate: getNextMonthFormatted(lastYear, lastMonth),
        });
        setPeople(newPeople);
    }

    const modifyStage = (fullId, field, value) => {
        const [parentId, childId] = fullId.split('-');

        const newPeople = [...people];

        const personIndex = newPeople.findIndex(person => person.identifier === parentId);
        if (personIndex === -1) return; // padre no encontrado

        const currentPerson = newPeople[personIndex];

        const stageIndex = currentPerson.stages.findIndex(stage => stage.identifier === fullId);
        if (stageIndex === -1) return; // stage no encontrado

        const stage = currentPerson.stages[stageIndex];

        if (field === 'initialSavings') {
            currentPerson.initialSavings = parseFloat(value) || 0;
        } else if (field === 'endDate') {
            if (stage.startDate) {
                const [startYear, startMonth] = stage.startDate.split('-');
                const [endYear, endMonth] = value.split('-');
                if (endYear < startYear || (endYear === startYear && endMonth <= startMonth)) {
                    if (stage.endDate === getNextMonthFormatted(stage.startDate.split('-')[0], stage.startDate.split('-')[1])) {
                        return;
                    }
                    modifyStage(fullId, 'endDate', getNextMonthFormatted(stage.startDate.split('-')[0], stage.startDate.split('-')[1]));
                    return;
                }
            };

            stage[field] = value;
            const nextStage = currentPerson.stages[stageIndex + 1];
            if (nextStage) {
                // Si hay un siguiente stage, actualizar su fecha de inicio y al fecha de finalizacion es posterior a la fecha de inicio
                const [endYear, endMonth] = value.split('-');
                const [nextStartYear, nextStartMonth] = nextStage.startDate.split('-');
                if (endYear > nextStartYear || (endYear === nextStartYear && endMonth >= nextStartMonth)) {
                    modifyStage(nextStage.identifier, 'startDate', value);
                }
            };
        } else if (field === 'startDate') {
            if (stageIndex > 0) {
                const prevStage = currentPerson.stages[stageIndex - 1];
                const [startYear, startMonth] = value.split('-');
                const [prevEndYear, prevEndMonth] = prevStage.endDate.split('-');
                if (startYear < prevEndYear || (startYear === prevEndYear && startMonth < prevEndMonth)) {
                    if (stage.startDate === prevStage.endDate) {
                        return;
                    }
                    modifyStage(fullId, 'startDate', prevStage.endDate);
                    return;
                }
            };
            stage[field] = value;

            //  actualizar su fecha de fin si la fecha de finalizacion es anteriror a la fecha de inicio
            const [startYear, startMonth] = value.split('-');
            const [endYear, endMonth] = stage.endDate.split('-');
            if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
                modifyStage(fullId, 'endDate', value);
            }
        } else {
            stage[field] = value;
        }

        currentPerson.stages[stageIndex] = stage;
        newPeople[personIndex] = currentPerson;

        setPeople(newPeople);
    };

    const removeStage = (identifier) => {
        const [parentId, childId] = identifier.split('-');

        const newPeople = [...people];

        // Buscar índice de la persona (padre)
        const personIndex = newPeople.findIndex(person => person.identifier === parentId);
        if (personIndex === -1) return; // padre no encontrado

        const currentPerson = newPeople[personIndex];

        // Filtrar las stages para eliminar la que coincide con el identifier
        const filteredStages = currentPerson.stages.filter(stage => stage.identifier !== identifier);

        // Actualizar las stages del padre
        newPeople[personIndex] = {
            ...currentPerson,
            stages: filteredStages
        };

        setPeople(newPeople);
    };

    const getStage = (identifier) => {
        const [parentId, childId] = identifier.split('-');
        const person = people.find(p => p.identifier === parentId);
        if (!person) return null;
        return person.stages.find(stage => stage.identifier === identifier);
    }
    const getPerson = (identifier) => {
        return people.find(p => p.identifier === identifier);
    }

    return {
        people,
        modifyPerson,
        addPerson,
        removePerson,
        modifyStage,
        addStage,
        removeStage,
        getStage,
        getPerson,
        deletePerson
    }
}
