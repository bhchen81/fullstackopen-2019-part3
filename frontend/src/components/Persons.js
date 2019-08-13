import React from "react";
import Person from "./Person";

const Persons = ({ persons, handleDeletion }) =>
  persons.map(person => (
    <Person key={person.name} person={person} handleDeletion={handleDeletion} />
  ));

export default Persons;
