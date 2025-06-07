import usePeople from '../hooks/usePeople';
import './peopleInfo.css'
export default function PeopleInfo({ identifier }) {
    const { getPerson, modifyPerson } = usePeople()
    const person = getPerson(identifier);
    return (
        <div className="savings-info">
            <label>
                <span>Nombre:</span>
                <input
                    type="text"
                    value={person.name}
                    onChange={(e) => modifyPerson(identifier, 'name', e.target.value)}
                />
            </label>
            <label>
                <span>Nacimiento:</span>
                <input
                    type="month"
                    value={person.birthDate}
                    onChange={(e) => modifyPerson(identifier, 'birthDate', e.target.value)}
                />
            </label>
            <label>
                <span>Ahorro Inicial:</span>
                <input
                    type="number"
                    value={person.initialSavings}
                    onChange={(e) => modifyPerson(identifier, 'initialSavings', e.target.value)}
                />

            </label>
        </div>

    )
}