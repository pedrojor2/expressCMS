var showdown = require("showdown"),
  converter = new showdown.Converter();
const util = require("../util.js");
const helpDB = util.helper_functions;
module.exports = (app, db) => {
  // Post to create new post.
  app.post("/admin_create_post_post", (req, res) => {
    const { title, subtitle, body, date, password } = req.body;
    if (!title || !subtitle || !body || !date || !password)
      res.render("error", { errorMsg: "One or more fields was empty." });
    else {
      util.verifyPass(password).then(password_valid => {
        if (password_valid)
          helpDB.createPost(
            msg => {
              if (msg.code == 0) {
                res.redirect("/");
              } else res.render("error", { errorMsg: msg.msg });
            },
            { title, subtitle, date, password, body }
          );
        else res.render("error", { errorMsg: "Wrong password silly." });
      });
    }
  });

  // Post for updating a previous post.
  app.post("/admin_update_post", (req, res) => {
    const { ID, title, subtitle, date, password, body } = req.body;
    if (!password) res.render("error", { errorMsg: "Must send password" });
    else {
      util.verifyPass(password).then(password_valid => {
        if (password_valid) {
          helpDB.updatePost(
            reply => {
              if (reply.code == 0) res.redirect(`/posts/${ID}`);
              else res.render("error", { errorMsg: reply.msg });
            },
            db,
            req.body
          );
        } else res.render("error", { errorMsg: "Wrong password" });
      });
    }
  });

  // Post for deleting a post.
  app.post("/admin_delete_post", (req, res) => {
    const { ID, password } = req.body;
    if (!password) res.render("error", { errorMsg: "Must send password" });
    else {
      util.verifyPass(password).then(password_valid => {
        if (password_valid)
          helpDB.deletePost(db, ID, reply => {
            if (reply.code == 0) res.redirect("/dashboard");
            else res.render("error", { errorMsg: reply.msg });
          });
        else res.render("error", { errorMsg: "Wrong password" });
      });
    }
  });
};
