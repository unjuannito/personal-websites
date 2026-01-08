import { useState, useEffect } from 'react'
// import './ExpenseCalculatorDialog.css'
import usePeople from '../hooks/usePeople'

const expenseTypes = [
    'Inversión',
    'Ocio',
    'Viajes',
    'Hipoteca',
    'Alquiler',
    'Hogar',
    'Comida/Alimentación',
    'Ropa',
    'Transporte',
    'Salud',
    'Educación',
    'Otros'
]

export default function ExpenseCalculatorDialog({ hidden, onClose, onSave, type, identifier}) {
    const [rows, setRows] = useState([])
    const {getStage, modifyStage} = usePeople()

    useEffect(() => {
        if (!identifier) return
        const stage = getStage(identifier)
        if (stage) {
            setRows(stage[`${type}Expenses`]?.items || [])
        }
    }, [identifier, type]) // Re-run effect if identifier or type changes

    const addRow = () => {
        const newRows = [...rows, {
            id: Date.now(),
            amount: 0,
            type: 'Otros', // Default type for new rows
            description: ''
        }]
        setRows(newRows)
    }

    const removeRow = (id) => {
        const newRows = rows.filter(row => row.id !== id)
        setRows(newRows)
    }

    const handleRowChange = (id, field, value) => {
        const newRows = rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        )
        setRows(newRows)
    }

    const calculateTotal = () => {
        return rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
    }

    const handleSave = () => {
        // Pass the current array of rows back to the parent
        console.log(identifier)
        modifyStage(identifier, `${type}Expenses`, rows)
        onClose()
    }

    // Prevent dialog from rendering when hidden is true
    return (
        <dialog open={!hidden} className="dialog-overlay">
            <h3>Calculadora de {type === 'monthly' ? 'Gastos Mensuales' : 'Gastos Anuales'}</h3>

            <div className="rows-container">
                {rows.map((row) => (
                    <div key={row.id} className="expense-row">
                        <label>
                            Cantidad:
                            <input
                                type="number"
                                value={row.amount}
                                onChange={(e) => handleRowChange(row.id, 'amount', e.target.value)}
                                placeholder="€"
                            />

                        </label>
                        <label>
                            Tipo:
                            {/* Use select or datalist for type */}
                            <select
                                value={row.type}
                                onChange={(e) => handleRowChange(row.id, 'type', e.target.value)}
                            >
                                {expenseTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Descripción:
                            <input
                                type="text"
                                value={row.description}
                                onChange={(e) => handleRowChange(row.id, 'description', e.target.value)}
                            />
                        </label>

                        {rows.length > 0 && ( // Allow removing even the first row if needed
                            <button className="remove-row-btn" onClick={() => removeRow(row.id)}>
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="dialog-actions">
                <span>Total: {calculateTotal().toFixed(2)}€</span>
                <button className="add-row-btn" onClick={addRow}>Añadir Fila</button>
                <button className="cancel-btn" onClick={onClose}>Cancelar</button>
                <button className="save-btn" onClick={handleSave}>Guardar</button>
            </div>
        </dialog>
    )
}