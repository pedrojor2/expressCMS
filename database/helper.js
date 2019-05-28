// Database Helper Functions

// Imports
var db = require("./index.js"); // DB

// Helper Functions

// Gets posts_per_page amount of posts from DB with a starting offset.
// Orders by newest.
// Returns:
//    code 0 with array of posts requested if success.
//    code 3 with empty array if general error
const select_posts_cmd =
  "SELECT ID,Title,Subtitle,Date, (SELECT count(*) FROM Articles) AS row_count FROM Articles ORDER BY ID DESC LIMIT ? OFFSET ?";
function getPostsPage(handle, offset, posts_per_page) {
  var objToSend = [];
  db.serialize(() => {
    db.each(
      select_posts_cmd,
      [posts_per_page, offset],
      (err, row) => {
        if (err) console.log(err);
        else objToSend.push(row);
      },
      () => {
        handle({ code: 0, val: objToSend });
      }
    );
  });
}

// Gets a specific post given ID.
// Returns:
//    code 0 with post if success.
//    code 2 if no post exists w/ given ID
//    code 3 if general error.
function getPostByID(handle, ID) {
  if (typeof ID !== "number") handle({ code: 3, msg: "Provide ID of integer" });
  else
    db.get("SELECT * FROM Articles WHERE ID=?", [ID], (err, row) => {
      if (err) handle({ code: 3, msg: err.code });
      if (!row) handle({ code: 2, msg: `No post with ID of ${ID} exists` });
      else handle({ code: 0, val: row });
    });
}

// Creates a post.
// Returns:
//    code 0 if success.
//    code 3 if general error.
function createPost(handler, post) {
  db.get("SELECT ID FROM Articles ORDER BY ID DESC LIMIT 1", (err, row) => {
    if (err) handler({ code: 3, msg: err.code });
    else {
      // Defaults to 1, else 1 more than latest post.
      const newID = row ? row.ID + 1 : 1;
      db.run(
        "INSERT INTO Articles VALUES (?,?,?,?,?)",
        [newID, post.title, post.subtitle, post.body, post.date],
        err => {
          if (err) handler({ code: 3, msg: err.code });
          else
            handler({
              code: 0,
              msg: `New item inserted with ID of ${newID}`
            });
        }
      );
    }
  });
}

// Deletes a post given ID.
// Returns:
//    code 0 if post succesfully deleted.
//    code 2 if no post exists w/ given ID
//    code 3 if general error.

function deletePost(db, ID, handler) {
  db.run("DELETE FROM Articles WHERE ID=?;", [ID], function(err) {
    if (!err) {
      if (this.changes == 0)
        handler({
          code: 2,
          msg: `No item with ID of ${ID} exists`
        });
      else
        handler({
          code: 0,
          msg: `Item of ID ${ID} succesfully deleted`
        });
    } else handler({ code: 3, msg: err.code });
  });
}

// Updates a given post.
// Returns:
//    code 0 if success
//    code 2 if post w/ given ID not found.
//    code 3 if general error
const get_post_to_update_cmd = "SELECT * FROM Articles WHERE ID = ? LIMIT 1";
const update_post_cmd =
  "UPDATE Articles SET Title=?, Subtitle=?, Body=?, Date=? WHERE ID = ?";

function updatePost(handler, db, post) {
  const { ID, title, subtitle, body, date } = post;
  db.get(get_post_to_update_cmd, [ID], (err, row) => {
    if (row == undefined)
      handler({ code: 2, msg: `No item with ID of ${ID} exists` });
    else
      db.run(
        update_post_cmd,
        [
          !title ? row.Title : title,
          !subtitle ? row.Subtitle : subtitle,
          !body ? row.Body : body,
          !date ? row.Date : date,
          ID
        ],
        function(err) {
          if (err) handler({ code: 3, msg: err.code });
          else handler({ code: 0, msg: `Item updated with ID of ${ID}` });
        }
      );
  });
}

module.exports = {
  deletePost,
  updatePost,
  createPost,
  getPostsPage,
  getPostByID
};
