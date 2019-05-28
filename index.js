//Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database"); // DB
const config = require("./config.json");
// Initilizations
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Custom middleware to override res.render
app.use(function(req, res, next) {
  var _render = res.render;
  res.render = function(view, options) {
    options = options || {};
    options.site_name = config.site_name;
    options.btn_one_name = config.btn_one_name;
    options.btn_one_link = config.btn_one_link;
    _render.call(this, view, options);
  };
  next();
});

// Acquire Routes
require("./routes")(app, db);

// Start Server
const PORT = 80;
const server = app.listen(PORT, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
