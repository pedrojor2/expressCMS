// Imports
const postsRenderRoutes = require("./postsRenderRoutes.js");
const dashboardRenderRoutes = require("./dashboardRenderRoutes.js");
const dashboardPostingRoutes = require("./dashboardPostingRoutes.js");

// Export
module.exports = (app, db) => {
  postsRenderRoutes(app);
  dashboardRenderRoutes(app);
  dashboardPostingRoutes(app, db);
};
