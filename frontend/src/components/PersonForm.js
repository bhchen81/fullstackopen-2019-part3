import React from "react";

const PersonForm = props => (
  <form onSubmit={props.handleAddPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNewNameChange} />
    </div>
    <div>
      number:{" "}
      <input value={props.newNumber} onChange={props.handleNewNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
