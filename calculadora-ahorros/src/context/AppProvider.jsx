// src/context/AppProvider.js
import React, { use, useState } from 'react';
import AppContext from './AppContext';
import useUtils from '../hooks/useUtils';

const AppProvider = ({ children }) => {
    const { generateIdentifier } = useUtils();

    const [people, setPeople] = useState(() => {
        try {
            const savedData = localStorage.getItem('savingsData')
            if (savedData) {
                const parsedData = JSON.parse(savedData)

                if (!Array.isArray(parsedData) && parsedData.people && Array.isArray(parsedData.people)) {
                    return parsedData.people;
                }


                return validatedPeople;

            }
        } catch (error) {
            console.error('Error parsing savingsData from localStorage:', error);
        } return [{
            identifier: 'PYozC6BG',
            name: 'Persona 1',
            initialSavings: 0,
            birthDate: '2000-01',
            savingDate: '2020-01',
            stages: [{
                identifier: 'PYozC6BG-Si6tvVEt',
                monthlyExpenses: 0,
                annualExpenses: 0,
                annualNetIncome: 0,
                startDate: '2020-01',
                endDate: '2021-01',
            }]
        }]
    })
    const [identifiers, setIdentifiers] = useState(() => {
        const savedData = localStorage.getItem('savingsData')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (!Array.isArray(parsedData)) return parsedData;
            else return [];

        } else return [];
    })

    return (
        <AppContext.Provider value={{ people, setPeople }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
