import { useEffect, useState } from 'react'
import usePeople from './hooks/usePeople'
import './styles/App.css'
import StagesContainer from './components/stages/StagesContainer'
import PeopleInfo from './components/PeopleInfo'
import Results from './components/Results'
import SalaryCalculatorDialog from './components/SalaryCalculatorDialog'

function App() {
  const { people, addPerson, deletePerson } = usePeople()
  const [selectedPerson, setSelectedPerson] = useState(0)

  useEffect(() => {
    if (people && people.length == 0) {
      addPerson()
    }
  }, [])

  return (
    <>
      <h1>Calculadora de Ahorros</h1>

      <div className="people-tabs">
        {people.map((person, index) => (
          <button
            key={index}
            identifier={person.identifier}
            className={`tab ${index === selectedPerson ? 'active' : ''}`}
            onClick={() => { console.log("asdsdd"); setSelectedPerson(index) }}
          >
            {person.name}
            {
              people.length > 1 ?
                <span onClick={(event) => { event.stopPropagation(); deletePerson(person.identifier); if (selectedPerson) {

                } }}>❌</span>
                : ""
            }
          </button>
        ))}
        <button onClick={addPerson} className="add-person-btn">
          + Nueva Persona
        </button>
      </div>

      <PeopleInfo identifier={people[selectedPerson]?.identifier} ></PeopleInfo>
      <StagesContainer identifier={people[selectedPerson]?.identifier}></StagesContainer>
      <Results></Results>
    </>
  )
}

export default App