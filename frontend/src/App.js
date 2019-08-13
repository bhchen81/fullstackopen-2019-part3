import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personsService from "./services/persons";

const App = () => {
  const [filter, setNewFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    type: "hidden",
    content: ""
  });
  const [persons, setPersons] = useState([]);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const showNotificationMessage = message => {
    setNotificationMessage(message);
    setTimeout(
      () => setNotificationMessage({ type: "hidden", content: "" }),
      3000
    );
  };

  const handleFilterChange = event => setNewFilter(event.target.value);
  const handleNewNameChange = event => setNewName(event.target.value);
  const handleNewNumberChange = event => setNewNumber(event.target.value);

  const handleAddPerson = event => {
    event.preventDefault();

    const clearPersonForm = () => {
      setNewName("");
      setNewNumber("");
    };

    const newPerson = {
      name: newName,
      number: newNumber
    };
    const foundPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLocaleLowerCase()
    );
    if (!foundPerson) {
      personsService.create(newPerson).then(returnedPersons => {
        setPersons(persons.concat(returnedPersons));
        clearPersonForm();
        showNotificationMessage({
          type: "success",
          content: `Added ${newName}`
        });
      });
    } else if (
      window.confirm(
        `${newName} is already added to phonebook, replace old number with a new one?`
      )
    ) {
      personsService
        .update(foundPerson.id, newPerson)
        .then(returnedPersons => {
          setPersons(
            persons.map(person =>
              person.id !== foundPerson.id ? person : returnedPersons
            )
          );
          clearPersonForm();
          showNotificationMessage({
            type: "success",
            content: `Added ${newName}`
          });
        })
        .catch(() => {
          showNotificationMessage({
            type: "error",
            content: `Information of ${newName} has already been removed from server`
          });
          setPersons(persons.filter(person => person.id !== foundPerson.id));
        });
    }
  };

  const handleDeletion = person => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(person.id)
        .catch(() =>
          showNotificationMessage({
            type: "error",
            content: `The person ${person.name} was already deleted from server`
          })
        )
        .finally(() => setPersons(persons.filter(p => p.id !== person.id)));
    }
  };

  useEffect(() => {
    personsService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter value={filter} handler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        handleAddPerson={handleAddPerson}
        newName={newName}
        handleNewNameChange={handleNewNameChange}
        newNumber={newNumber}
        handleNewNumberChange={handleNewNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDeletion={handleDeletion} />
    </div>
  );
};

export default App;
