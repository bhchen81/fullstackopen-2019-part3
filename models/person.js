const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Reference:
// https://mongoosejs.com/docs/deprecations.html
mongoose.set("useFindAndModify", false);

const dbLog = (...args) => console.log("[mongoDB]", ...args);
const url = process.env.MONGODB_URI;

dbLog(`Connecting to ${url}...`);
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => {
    dbLog("Connected to MongoDB");
    // mongoose.connection.close();
  })
  .catch(error => {
    dbLog("Error connecting to mongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, unique: true },
  number: { type: String, minlength: 8 }
});
personSchema.plugin(uniqueValidator);

// Reference:
// https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
