const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const logger = (request, response, next) => {
  console.log("Time:", new Date().toString());
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log(
    "--------------------------------------------------------------------------------"
  );
  next();
};

app.use(bodyParser.json());
app.use(logger);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const time = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people<br>${time}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const requestId = Number(request.params.id);
  const person = persons.find(person => person.id === requestId);
  if (person) response.json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const requestId = Number(request.params.id);
  persons = persons.filter(person => person.id !== requestId);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
