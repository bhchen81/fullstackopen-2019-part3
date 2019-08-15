const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Detects if the program is running under Heroku environment
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const Person = require("./models/person");

app.use(express.static("build"));
app.use(bodyParser.json());

morgan.token("body", req => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then(result => {
      response.json(result);
    })
    .catch(error => next(error));
});

app.get("/info", (request, response, next) => {
  const time = new Date().toString();
  Person.countDocuments()
    .then(number =>
      response.send(`<p>Phonebook has info for ${number} people<br>${time}</p>`)
    )
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) response.json(person);
      else response.status(404).end(); // Handle querying non-existed document
    })
    // Possible errors: CastError(the query ID doesn't fit in mongoDB format)
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error)); // Possible errors: ValidationError
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  // Receive a regular JavaScript object as its parameter
  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).json({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
