// Imports
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Consts
const dbPath = path.resolve(__dirname, "sqlite_default.db");
const init_command =
  "CREATE TABLE `Articles` (`ID`	INTEGER,`Title`	TEXT,`Subtitle`	TEXT,`Body`	TEXT,`Date`	TEXT);";

// Opens DB
var db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error(err.message);
    process.exit(); // finish the exit process
  } else console.log("Connected to the database succesfully.");
});

// Checks DB file format
db.get("SELECT * FROM Articles", [], (err, row) => {
  if (err) {
    console.log("Initializing Database tables...");
    db.run(init_command);
  }
});

// Export
module.exports = db;
