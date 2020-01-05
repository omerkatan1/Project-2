var express = require("express");
var session = require("express-session");
var exphbs = require("express-handlebars");
var path = require("path");

var userPassport = require("./config/user-passport");

require('dotenv').config();


var app = express();

var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(userPassport.initialize());
app.use(userPassport.session());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/user-html-routes")(app);
require("./routes/users-route")(app);
require("./routes/orgs-route")(app);
require("./routes/projects-route")(app);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
