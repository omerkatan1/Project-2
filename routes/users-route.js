var db = require("../models");
var passport = require("../config/user-passport");

module.exports = function (app) {

    app.post("/api/user-login", passport.authenticate("local"), function (req, res) {
        res.json(req.user);
    });

    app.post("/api/user-signup", function (req, res) {
        db.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            intro: req.body.intro,
        })
            .then(function () {
                res.status(200).end();
                // res.redirect(307, "/api/user-login");
                console.log(first_name);
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get("/user-logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            db.User.findOne({
                where: {
                    id: req.user.id
                }
            }).then(function (data) {
                res.json(data);
            });
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
        }
    });

    app.get("/api/users", function (req, res) {
        db.User.findAll({}).then(function (data) {
            res.json(data);
        });
    });

    app.put("/user/bidded/:pid/:uid", function (req, res) {
        var projId = req.params.pid;
        var userId = req.params.uid;
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function (data) {
            var currBidArray = data.biddedProject.split(";");
            var index = currBidArray.indexOf((projId - '0'));
            currBidArray.splice(index, 1);
            var updateBid = currBidArray.join(";");
            db.User.update({
                biddedProject: updateBid
            }, {
                where: {
                    id: userId
                }
            }).then(function () {
                res.status(200).end();
            });
        });
    });


    app.put("/user/:uid/:pid", function (req, res) {
        var userId = req.params.uid;
        var projId = req.params.pid;
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function (user) {
            var currList = user.biddedProject;
            var newList = currList;
            if (currList.length > 1) {
                var currArray = currList.split(";");
                if (!currArray.includes(projId)) {
                    currArray.push(projId);
                    newList = currArray.join(";");
                }
            } else if (currList.length === 1) {
                if (currList !== projId) newList += `;${projId}`;
            } else newList += `${projId}`;
            db.User.update({
                biddedProject: newList
            }, {
                where: {
                    id: userId
                }
            }).then(function (data2) {
                res.status(200).end();
            })
        })
    });

    app.put("/update/user/:uid/:statusNum",function(req, res){
        var updateStatus = req.params.statusNum == 0? true:false;
        var userId = req.params.uid;
        db.User.update({
            status: updateStatus
        },{
            where: {
                id: userId
            }
        }).then(function(data){
            res.status(200).end();
        });
    });


    app.put("/recovers/:pid/:uid", function (req, res) {
        var projId = req.params.pid;
        var userId = req.params.uid;
        db.Project.findOne({
            where: {
                id: projId
            }
        }).then(function (data) {
            var developerList = data.developers_list.split(";");
            console.log(developerList);
            var delIndex = developerList.indexOf(userId);
            developerList.splice(delIndex, 1);
            console.log(developerList);
            forLoop();
            async function forLoop() {
                for (var i = 0; i < developerList.length; i++) {
                    var currId = parseInt(developerList[i]);
                    var result = await updateStatus(currId);
                    console.log(result);
                }
                res.status(200).end();
            }
        });
    });

    function updateStatus(currId) {
        return new Promise(resolve => {
            setTimeout(function () {
                db.User.update({
                    status: false
                }, {
                    where: {
                        id: currId
                    }
                }).then(function () {
                    resolve("back to available!!!");
                })
            }, 2000);
        });
    }


};