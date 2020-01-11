var db = require("../models");
var path = require("path");


module.exports = function (app) {
    var bigData;
    app.post("/user-review-page",function(req,res){
        bigData = req.body;
        res.status(200).end();
    });

    app.get("/user-review", function(req, res) {
        res.render("review",bigData);
    });

    app.post("/api/rating", function (req, res) {
        db.reviews.create({
            rating: req.body.newRating
        }).then(function() {
            console.log('test');
        })
    });
}