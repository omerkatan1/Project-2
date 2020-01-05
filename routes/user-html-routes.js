// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

var project1 = {
  id: 1,
  title: "web",
  price: 100
};
var project2 = {
  id: 1,
  title: "web1",
  price: 100
};
var project3 = {
  id: 1,
  title: "web2",
  price: 100
};
var project4 = {
  id: 1,
  title: "web2",
  price: 100
};

var bigdata = {
  developer_name: "Norman",
  developer_email: "jfjf@jjfj.com",
  project: [project1,project2],
  activeProject:[project3],
  completedProject: [project4],
};





module.exports = function(app) {

  app.get("/norman", function(req, res) {
    // If the user already has an account send them to the members page
    // if (req.user) {
    //   res.redirect("/user-account");
    // }
    //res.sendFile(path.join(__dirname, "../public/index.html"));
    console.log(bigdata);
    res.render("developer",bigdata);
  });


  // app.get("/user-login", function(req, res) {
  //   // If the user already has an account send them to the members page
  //   if (req.user) {
  //     res.redirect("/user-account");
  //   }
  //   res.sendFile(path.join(__dirname, "../public/user-login.html"));
  // });

  // app.get("/org-login", function(req, res) {
  //   // If the user already has an account send them to the members page
  //   if (req.user) {
  //     res.redirect("/org-account");
  //   }
  //   res.sendFile(path.join(__dirname, "../public/org-login.html"));
  // });

  app.get("/allusers-signup", function(req, res) {
    // If the user already has an account send them to the members page
    // if (req.user) {
    //   res.redirect("/user-account");
    // }
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });

  // app.get("/org-signup", function(req, res) {
  //   // If the user already has an account send them to the members page
  //   if (req.user) {
  //     res.redirect("/org-account");
  //   }
  //   res.sendFile(path.join(__dirname, "../public/org-signup.html"));
  // });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/user-account", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/user-account.html"));
  });

  app.get("/org-account", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/org-account.html"));
  });

};
