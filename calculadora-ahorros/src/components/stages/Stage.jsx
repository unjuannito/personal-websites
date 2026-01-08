import { useEffect } from 'react';
import calculatorIcon from '../../assets/calculator-icon.svg'
import usePeople from '../../hooks/usePeople';
import useUtils from '../../hooks/useUtils';

export default function Stage({ identifier, firstStage, minDate }) {
    const { getStage, removeStage, modifyStage } = usePeople()
    const stage = getStage(identifier)
    const { getNextMonthFormatted, formatearMesAnio } = useUtils();

    return (
        <div className={`stage ${firstStage ? 'stage-first' : ''}`}>
            <h2>{`De ${formatearMesAnio(stage.startDate)} a ${formatearMesAnio(stage.endDate)}`}</h2>

            <label>
                <span>Ingreso Neto Anual:</span>
                <input
                    min={0}
                    type="number"
                    value={stage.annualNetIncome}
                    onChange={e => modifyStage(identifier, 'annualNetIncome', e.target.value)}
                />

            </label>
            <section>
                <label>
                    <span>Gastos Mensuales:</span>
                    <input
                        min={0}
                        type="number"
                        value={stage.monthlyExpenses}
                        onChange={e => modifyStage(identifier, 'monthlyExpenses', e.target.value)}
                    />

                </label>
                <label>
                    <span>Gastos Anuales:</span>
                    <input
                        min={0}
                        type="number"
                        value={stage.annualExpenses}
                        onChange={e => modifyStage(identifier, 'annualExpenses', e.target.value)}
                    />

                </label>
            </section>
            <section>
                <label>Fecha de inicio:
                    <input
                        type="month"
                        min={minDate}
                        value={stage.startDate}
                        onChange={(e) => modifyStage(identifier, 'startDate', e.target.value)}
                    />
                </label>
                <label>Fecha de fin:
                    <input
                        type="month"
                        min={getNextMonthFormatted(stage.startDate.split('-')[0], stage.startDate.split('-')[1])}
                        value={stage.endDate}
                        onChange={(e) => modifyStage(identifier, 'endDate', e.target.value)}
                    />
                </label>

            </section>

            {!firstStage && (
                <button className="remove-btn" onClick={() => removeStage(identifier)}>
                    Eliminar Etapa
                </button>
            )}
        </div>

    )
}