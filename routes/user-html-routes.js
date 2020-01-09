// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

// var project1 = {
//   id: 1,
//   title: "web",
//   price: 100
// };
// var project2 = {
//   id: 1,
//   title: "web1",
//   price: 100
// };
// var project3 = {
//   id: 1,
//   title: "web2",
//   price: 100
// };
// var project4 = {
//   id: 1,
//   title: "web2",
//   price: 100
// };

// var bigdata = {
//   developer_name: "Norman",
//   developer_email: "jfjf@jjfj.com",
//   project: [project1,project2],
//   activeProject:[project3],
//   completedProject: [project4],
// };





module.exports = function(app) {

  app.get("/", function(req, res) {
    // console.log("here");
    res.render("index");
  });

  app.get("/allusers-signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });

  app.get("/developer-account", isAuthenticated, function(req, res) {
    res.render("developer");
    //res.sendFile(path.join(__dirname, "../public/user-account.html"));
  });

  app.get("/startup-account", isAuthenticated, function(req, res) {
    res.render("startup");
    //res.sendFile(path.join(__dirname, "../public/org-account.html"));
  });

  app.get("/dev-profile", isAuthenticated, function(req, res) {
    res.render("dev-profile");
  })
};
