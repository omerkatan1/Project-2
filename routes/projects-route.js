var db = require("../models");


module.exports = function (app) {
    app.post("/api/project", function (req, res) {
        db.Project.create(req.body)
            .then(function () {
                res.status(200).end();
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    app.get("/api/project", function(req, res){
        db.Project.findAll({}).then(function(data){
            res.json(data);
        })
    });
};