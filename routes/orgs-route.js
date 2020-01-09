var db = require("../models");
var passportOrg = require("../config/user-passport");

module.exports = function (app) {
    app.post("/api/org-login", passportOrg.authenticate("local"), function (req, res) {
        res.json(req.user);
    });

    app.post("/api/org-signup", function (req, res) {
        db.Org.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            intro: req.body.intro,
        })
            .then(function () {
                res.status(200).end();
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get("/org-logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/org_data", function (req, res) {
        if (!req.user) {
            res.json({});
        } else {
            res.json(req.user);
        }
    });


    app.get("/api/userbid/:uid/:pid", function (req, res) {
        db.UserBid.findOne({
            where: {
                project_id: req.params.pid,
                UserId: req.params.uid
            }
        }).then(function (data) {
            res.json(data);
        });
    });
}