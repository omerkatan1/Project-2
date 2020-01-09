var express = require("express");
var session = require("express-session");
var exphbs = require("express-handlebars");
var path = require("path");
var IO = require("socket.io");
var router = express.Router();

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

var server = require('http').Server(app);

var socketIO = IO(server);
var roomInfo = [];
var history = {};

socketIO.on('connection', function (socket) {
  var userId;
  var projId;
  var roomID;
  var userNameG;

  socket.on('join', function (devId, projectId, userName) {
    userId = devId;
    projId = projectId;
    roomID = projId;
    userNameG = userName;

    if (!roomInfo.includes(roomID)) {
      roomInfo.push(roomID);
      history.roomID = [];
    }
    //push out all the previous chat history belonged to this roomID
    socket.join(roomID);
    socketIO.to(roomID).emit('history', history.roomID);
    socketIO.to(roomID).emit('sys', userName + ' is online now!');
    console.log(userId + ' join ' + roomID);
  });

  socket.on('message', function (msg) {
    var msgObj = {
      id: userId,
      userName: userNameG,
      message: msg,
      time: new Date()
    };
    history.roomID.push(msgObj);
    socketIO.to(roomID).emit('msg', userNameG, msg, new Date());
  });

});

app.use('/',router);
// Requiring our routes
require("./routes/user-html-routes")(router);
require("./routes/users-route")(router);
require("./routes/orgs-route")(router);
require("./routes/projects-route")(router);

<<<<<<< HEAD
db.sequelize.sync().then(function () {
  server.listen(PORT, function () {
    //server.listen(PORT);
=======
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
>>>>>>> fb35eb01e77cb6fb16c2e34b597930e069a88338
    console.log("App listening on PORT " + PORT);
  });
});
