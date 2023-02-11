import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import PersonService from './services/PersonService'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  useEffect(() => {
    PersonService.getPersons().then((initialContacts) => {
      setPersons(initialContacts)
    })
  }, [])

  const removeContact = (person, id) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      PersonService.removePerson(id).then(() => {
        setPersons((current) => current.filter((person) => person.id !== id))
      })

      setColor('success')
      setMessage(`Contact "${person.name}" removed succesfully`)
      setTimeout(() => {
        setMessage('')
        setColor('')
      }, 5000)
    }
  }

  const updateContact = (id) => {
    const contact = persons.find((n) => n.id === id)
    const changedContact = { ...contact, number: newNumber }
    console.log(changedContact)

    PersonService.updatePerson(id, changedContact)
      .then((returnedContact) => {
        setPersons(
          persons.map((contact) =>
            contact.id !== id ? contact : returnedContact
          )
        )
      })
      .catch((error) => {
        setColor('warning')
        setMessage(`the note '${contact.name}' was already deleted from server`)
        console.log(error)
        setPersons(persons.filter((n) => n.id !== id))
        setTimeout(() => {
          setMessage('')
          setColor('')
        }, 5000)
      })

    setColor('success')
    setMessage(`Contact "${contact.name}" updated succesfully`)
    setNewName('')
    setNewNumber('')
    setTimeout(() => {
      setMessage('')
      setColor('')
    }, 5000)
  }

  const addContact = () => {
    const contactObject = {
      name: newName,
      number: newNumber,
    }

    PersonService.addPerson(contactObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })

    setColor('success')
    setMessage(`Contact "${contactObject.name}" added succesfully`)
    setTimeout(() => {
      setMessage('')
      setColor('')
    }, 5000)
  }

  const addOrUpdate = (e) => {
    e.preventDefault()
    const toFind = persons.find((person) => person.name === newName)
    if (toFind) {
      console.log(toFind.id)
      if (
        window.confirm(
          `A number for ${newName} already exists, do you want to replace the old number with a new one?`
        )
      ) {
        updateContact(toFind.id)
      }
    } else {
      addContact()
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={color} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <ContactForm
        setPersons={setPersons}
        persons={persons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        updateContact={updateContact}
        addContact={addContact}
        addOrUpdate={addOrUpdate}
      />
      <ContactList
        newFilter={newFilter}
        persons={persons}
        removeContact={removeContact}
      />
    </div>
  )
}

const Contact = ({ person, removeContact }) => {
  return (
    <p>
      {person.name} {person.number}
      <button type="button" onClick={() => removeContact(person, person.id)}>
        delete
      </button>
    </p>
  )
}

const ContactList = ({ newFilter, persons, removeContact, updateContact }) => {
  const visiblePersons =
    newFilter && newFilter.length > 0
      ? persons.filter(({ name }) =>
          name.toLowerCase().includes(newFilter.toLowerCase())
        )
      : persons

  return (
    <div>
      <h3>Numbers</h3>
      {visiblePersons.map((person) => (
        <Contact
          key={person.name}
          person={person}
          removeContact={removeContact}
          updateContact={() => updateContact(person.id)}
        />
      ))}
    </div>
  )
}
const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      {' '}
      <h3>Filter</h3>
      Filter shown with:{' '}
      <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const ContactForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addOrUpdate,
}) => {
  return (
    <div>
      <h3>Add new</h3>
      <form onSubmit={addOrUpdate}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
          <div>
            <button type="submit">add</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default App
