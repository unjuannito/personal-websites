import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [initialInvestment, setInitialInvestment] = useState(0)
  const [birthYear, setBirthYear] = useState(0)
  const [investingAge, setInvestingAge] = useState(0)
  const [stages, setStages] = useState([
    { extraDeposit: 0, monthlyDeposit: 0, interestRate: 0, duration: 0 }
  ])
  const [results, setResults] = useState([])

  // Cargar datos guardados en localStorage al iniciar la app
  useEffect(() => {
    const savedData = localStorage.getItem('investmentData')
    if (savedData) {
      const { initialInvestment, birthYear, investingAge, stages } = JSON.parse(savedData)
      setInitialInvestment(initialInvestment)
      setBirthYear(birthYear)
      setInvestingAge(investingAge)
      setStages(stages)
    }
  }, [])

  // Guardar datos en localStorage después de calcular
  const saveToLocalStorage = () => {
    const dataToSave = { initialInvestment, birthYear, investingAge, stages }
    localStorage.setItem('investmentData', JSON.stringify(dataToSave))
  }

  const addStage = () => {
    setStages([...stages, { extraDeposit: 0, monthlyDeposit: 0, interestRate: 0, duration: 0 }])
  }

  const removeStage = (index) => {
    if (index === 0) return
    setStages(stages.filter((_, idx) => idx !== index))
  }

  const handleStageChange = (index, field, value) => {
    const newStages = [...stages]
    newStages[index][field] = parseFloat(value) || 0
    setStages(newStages)
  }

  const calculate = () => {
    saveToLocalStorage()

    const startYear = birthYear && investingAge ? parseFloat(birthYear) + parseFloat(investingAge) : 0
    const startAge = investingAge ? parseFloat(investingAge) : 0
    let currentAmount = parseFloat(initialInvestment) || 0
    let computedYear = startYear
    let computedAge = startAge
    const stageResults = []

    stages.forEach((stage, index) => {
      const stageStartYear = computedYear
      const stageEndYear = computedYear + stage.duration
      const stageStartAge = computedAge
      const stageEndAge = computedAge + stage.duration

      currentAmount += stage.extraDeposit
      const monthlyRate = Math.pow(1 + stage.interestRate / 100, 1 / 12) - 1

      for (let year = 0; year < stage.duration; year++) {
        for (let month = 0; month < 12; month++) {
          currentAmount += stage.monthlyDeposit
          currentAmount *= 1 + monthlyRate
        }
      }

      const label =
        index === 0
          ? `Etapa inicial ${stageStartYear}-${stageEndYear} (Edad ${stageStartAge}-${stageEndAge})`
          : `Etapa ${stageStartYear}-${stageEndYear} (Edad ${stageStartAge}-${stageEndAge})`

      computedYear = stageEndYear
      computedAge = stageEndAge

      stageResults.push({ label, finalAmount: currentAmount })
    })

    setResults(stageResults)
  }

  let tempYear = birthYear && investingAge ? parseFloat(birthYear) + parseFloat(investingAge) : 0
  let tempAge = investingAge ? parseFloat(investingAge) : 0

  return (
    <div className="App">
      <h1>Calculadora de Interés Compuesto</h1>

      <div className="investment-info">
        <div className="input-group">
          <label>Año de nacimiento:</label>
          <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Edad de inicio de inversión:</label>
          <input type="number" value={investingAge} onChange={(e) => setInvestingAge(e.target.value)} />
        </div>
      </div>

      <div className="stage-container">
        {stages.map((stage, index) => {
          const stageStartYear = tempYear
          const stageEndYear = tempYear + stage.duration
          const stageStartAge = tempAge
          const stageEndAge = tempAge + stage.duration
          const label =
            index === 0
              ? `Etapa inicial ${stageStartYear}-${stageEndYear} (Edad ${stageStartAge}-${stageEndAge})`
              : `Etapa ${stageStartYear}-${stageEndYear} (Edad ${stageStartAge}-${stageEndAge})`

          tempYear = stageEndYear
          tempAge = stageEndAge

          return (
            <div key={index} className={`stage ${index === 0 ? 'stage-first' : ''}`}>
              <h2>{label}</h2>
              <div className="input-group">
                <label>{index === 0 ? 'Inversión Inicial:' : 'Depósito extra al inicio de la etapa:'}</label>
                <input
                  type="number"
                  value={index === 0 ? initialInvestment : stage.extraDeposit}
                  onChange={(e) =>
                    index === 0
                      ? setInitialInvestment(e.target.value)
                      : handleStageChange(index, 'extraDeposit', e.target.value)
                  }
                />
              </div>
              <div className="input-group">
                <label>Depósito mensual (al inicio de mes):</label>
                <input
                  type="number"
                  value={stage.monthlyDeposit}
                  onChange={(e) => handleStageChange(index, 'monthlyDeposit', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Tasa de interés anual (%):</label>
                <input
                  type="number"
                  value={stage.interestRate}
                  onChange={(e) => handleStageChange(index, 'interestRate', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Duración (años):</label>
                <input
                  type="number"
                  value={stage.duration}
                  onChange={(e) => handleStageChange(index, 'duration', e.target.value)}
                />
              </div>
              {index !== 0 && <button className="remove-btn" onClick={() => removeStage(index)}>Eliminar Etapa</button>}
            </div>
          )
        })}
      </div>

      <div className="button-group">
        <button className="add-stage-btn" onClick={addStage}>Agregar Etapa</button>
        <button className="calculate-btn" onClick={calculate}>Calcular</button>
      </div>

      {results.length > 0 && (
        <div className="results">
          <h2>Resultados</h2>
          <ul>
            {results.map((result, idx) => (
              <li key={idx}>
                {result.label}: <strong>{result.finalAmount.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
