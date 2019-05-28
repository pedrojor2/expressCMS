// Imports
var db = require("./database"); // DB
var bcrypt = require("bcrypt");
const { site_name, site_password, posts_per_page } = require("./config.json");
const helper_functions = require("./database/helper.js");

// Verify's password.
async function verifyPass(password) {
  let promise = new Promise((resolve, reject) => {
    bcrypt.compare(site_password, password, (err, res) => {
      resolve(res);
    });
  });
  let res = await promise;
  return res;
}

// Exports
module.exports = {
  posts_per_page,
  helper_functions,
  info: { site_name, posts_per_page },
  verifyPass
};
