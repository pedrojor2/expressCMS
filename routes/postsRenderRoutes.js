var showdown = require("showdown");
var converter = new showdown.Converter();

// const sample_posts = [
//   { title: "Intro", subtitle: "Subby", date: "March 10th, 2019", id: 1 },
//   { title: "Post Two", subtitle: "2ub", date: "March 11th, 2019", id: 2 }
// ];

const util = require("../util.js");
const helpDB = util.helper_functions;
const { site_name, posts_per_page } = util.info;

module.exports = app => {
  // Requests latest posts with offset of 0.
  // This is the initial page of the site.
  app.get("/", (req, res) => {
    helpDB.getPostsPage(
      posts_from_db => {
        const posts = posts_from_db.val;
        const row_count = posts.length > 0 ? posts[0].row_count : 0;
        if (row_count == 0)
          res.render("error", {
            title: site_name,
            errorMsg: "(No posts found)"
          });
        else
          res.render("index", {
            title: site_name,
            posts: posts,
            page_number: 1,
            post_count: row_count,
            posts_per_page: posts_per_page
          });
      },
      0,
      posts_per_page
    );
  });

  // Retrieves post of given ID.
  app.get("/posts/:id", (req, res) => {
    const id = req.params.id;

    helpDB.getPostByID(data => {
      if (data.code == 0) {
        const { Title, Subtitle, Date, Body } = data.val;
        const html_from_md = converter.makeHtml(Body);
        res.render("post", {
          title: Title,
          Title,
          Subtitle,
          Date,
          Markdown: html_from_md
        });
      }

      if (data.code == 2)
        res.render("error", { errorMsg: "(Post does not exist found)" });
      if (data.code == 3) res.render("error");
    }, parseInt(id));
  });

  // Retrieves posts with an offset.
  app.get("/page/:pageNumber", (req, res) => {
    var { pageNumber } = req.params;
    pageNumber = parseInt(pageNumber);
    if (typeof pageNumber != "number" || pageNumber < 2) res.redirect("/");
    else {
      helpDB.getPostsPage(
        posts_from_db => {
          // if posts is empty, redirect to index.
          // else use total count to know if should show next page!
          const posts = posts_from_db.val;
          if (posts.length == 0) res.redirect("/");
          else
            res.render("index", {
              title: `Page ${pageNumber}`,
              posts: posts,
              page_number: pageNumber,
              post_count: posts[0].row_count,
              posts_per_page
            });
        },
        (pageNumber - 1) * posts_per_page,
        posts_per_page
      );
    }
    // TODO: add new util function that grabs sql with offset
  });
};
