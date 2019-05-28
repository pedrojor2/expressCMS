// Imports
var showdown = require("showdown"),
  converter = new showdown.Converter();
const util = require("../util.js");
const helpDB = util.helper_functions;

// Helper Function
function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) return i + "st";
  if (j == 2 && k != 12) return i + "nd";
  if (j == 3 && k != 13) return i + "rd";
  return i + "th";
}
// Export

module.exports = app => {
  // Access dashboard page to modify and create new posts.
  app.get("/dashboard", (req, res) => {
    helpDB.getPostsPage(
      posts_from_db => {
        const posts = posts_from_db.val;
        res.render("dashboard", { title: "Manage Posts", posts });
      },
      0,
      10000
    );
  });

  // Route for creating a new post.
  app.get("/dashboard_create_post", (req, res) => {
    var currentdate = new Date();
    const month = currentdate.toLocaleString("en-us", {
      month: "long"
    });
    const day = ordinal_suffix_of(currentdate.getDate());
    const year = currentdate.getFullYear();
    res.render("create_post", {
      title: "New Post",
      dateText: `${month} ${day}, ${year}`
    });
  });

  // Route for updating or deleting a post.
  app.get("/admin_manage_post/:postToEdit", (req, res) => {
    const { postToEdit } = req.params;
    helpDB.getPostByID(data => {
      if (data.code == 0) {
        const { Title, Subtitle, Date, Body } = data.val;
        res.render("manage_post", {
          title: `Update or Delete Post #${postToEdit}`,
          postID: postToEdit,
          Title,
          Subtitle,
          Date,
          Body
        });
      } else if (data.code == 2) res.render("error");
      // no psot exists^
      else if (data.code == 3) res.render("error"); // generic db error
    }, parseInt(postToEdit));

    //  res.send(postToDelete);
  });
};
