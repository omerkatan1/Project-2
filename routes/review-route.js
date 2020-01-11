var db = require("../models");
var path = require("path");


module.exports = function (app) {
    var bigData;
    app.post("/user-review-page", function (req, res) {
        bigData = req.body;
        res.status(200).end();
    });

    app.get("/user-review", function (req, res) {
        res.render("review", bigData);
    });

    app.post("/api/projectReviews", function(req, res) {
        db.projectReviews.create(req.body).then(function() {
            res.status(200).end();
        })
    });

    app.post("/api/rating/:uid", function (req, res) {
        var userId = req.params.uid;
        db.reviews.findOne({
            where: {
                UserId: userId
            }
        }).then(function (currReview) {
            if (currReview) {
                var updateNum = currReview.ratingNum++;
                var updateRating = currReview.rating + req.body.rating;
                db.reviews.update({
                    rating: updateRating,
                    ratingNum: updateNum
                }, {
                    where: {
                        UserId: userId
                    }
                }).then(function () {
                    res.status(200).end();
                })
            }else{
                db.reviews.create({
                    rating: req.body.rating,
                    ratingNum: 1,
                    UserId: userId,
                }).then(function(){
                    res.status(200).end();
                })
            }
        })

    });

    app.get("/api/rating", function (req, res) {
        console.log("works");
    })
}