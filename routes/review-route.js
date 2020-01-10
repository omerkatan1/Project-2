var db = require("../models");
var path = require("path");


module.exports = function (app) {

    app.get("/user-review", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/rating.html"));
    });

    app.post("/api/rating", function (req, res) {
        db.reviews.create({
            rating: req.body.newRating
        }).then(function() {
            console.log('test');
        })


    });
}