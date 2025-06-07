import { useState } from 'react'
import './stageContainer.css'
import Stage from './Stage'
import usePeople from '../../hooks/usePeople'
export default function StagesContainer({ identifier }) {
    const { people, addStage, getPerson } = usePeople()
    const person = getPerson(identifier)
    const currentStages = person.stages

    //tratar datos
    const handleStageChange = (stageIndex, field, value) => {
        modifyStage(selectedPerson, stageIndex, field, value)
    }

    return (
        <>
            <div className="stages-container">
                {currentStages.map((stage, index) =>
                    <Stage key={index} identifier={stage.identifier} firstStage={index === 0} minDate={currentStages[index-1]?.endDate}></Stage>
                )}

                <button className="add-stage-btn" onClick={() => addStage(identifier)}>
                    Agregar Etapa
                </button>
            </div>

        </>
    )
}