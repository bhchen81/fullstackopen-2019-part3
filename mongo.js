const mongoose = require("mongoose");

const argvLength = process.argv.length;
if (argvLength !== 5 && argvLength !== 3) {
  console.log("Usage:");
  console.log(
    "  Adding an entry: node mongo.js <password> <name_to_add> <number_to_add>"
  );
  console.log("  Listing all entries: node mongo.js <password>");
  process.exit(1);
}

const dbLog = (...args) => console.log("[mongoDB]", ...args);

const password = process.argv[2];
const nameToAdd = process.argv[3];
const numberToAdd = process.argv[4];

const url = `mongodb+srv://dbcat:${password}@cluster0-e7kmz.gcp.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

const newPerson = new Person({
  name: nameToAdd,
  number: numberToAdd
});

const addEntry = () => {
  dbLog("Adding an entry");
  newPerson.save().then(response => {
    dbLog(`added "${nameToAdd}" number "${numberToAdd}" to phonebook`);
    dbLog("response:\n", response);
    mongoose.connection.close();
  });
};

const listEntries = () => {
  dbLog("List all entries");
  Person.find({}).then(result => {
    dbLog("phonebook:");
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
};

if (argvLength === 5) addEntry();
else listEntries();
