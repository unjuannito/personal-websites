import { useState } from 'react'
import usePeople from './hooks/usePeople'
import './App.css'
import StagesContainer from './components/stages/StagesContainer'
import PeopleInfo from './components/PeopleInfo'
import Results from './components/Results'

function App() {
  const {people, addPerson} = usePeople()
  const [selectedPerson, setSelectedPerson] = useState(0)

  return (
    <>
      <h1>Calculadora de Ahorros</h1>

      <div className="people-tabs">
        {people.map((person, index) => (
          <button
            key={index}
            identifier={person.identifier}
            className={`tab ${index === selectedPerson ? 'active' : ''}`}
            onClick={() => setSelectedPerson(index)}
          >
            {person.name}
          </button>
        ))}
        <button onClick={addPerson} className="add-person-btn">
          + Nueva Persona
        </button>
      </div>

      <PeopleInfo identifier={people[selectedPerson].identifier} ></PeopleInfo>
      <StagesContainer identifier={people[selectedPerson].identifier}></StagesContainer>
      <Results></Results>
    </>
  )
}

export default App