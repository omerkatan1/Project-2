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

    app.get("/api/project", function (req, res) {
        db.Project.findAll({}).then(function (data) {
            res.json(data);
        })
    });

    app.get("/api/project/developList/:id", function (req, res) {
        db.Project.findOne({
            attributes: ['developers_list']
        }, {
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            res.json(data);
        });
    });

    app.get("/pick/:id", function (req, res) {
        var projId = req.params.id;
        db.Project.findOne({
            where: {
                id: projId
            }
        }).then(function (data) {
            return res.json(data);
        })
    });

    app.put("/proccess/:pid/:uid", function (req, res) {
        var projId = req.params.pid;
        var userId = req.params.uid;
        db.Project.update({
            status: "Proccessing",
            final_developer: parseInt(userId)
        }, {
            where: {
                id: projId
            }
        }).then(function () {
            res.status(200).end();
        })
    });

    app.put("/finishedproject/:pid", function (req, res) {
        var projId = req.params.pid;
        db.Project.update({
            status: "Finished",
        }, {
            where: {
                id: projId
            }
        }).then(function () {
            res.status(200).end();
        })
    });

    app.get("/project/:pid/:uid", function (req, res) {
        var projId = req.params.pid;
        var userId = req.params.uid;
        db.Project.findOne({
            where: {
                id: projId
            }
        }).then(function (data) {
            var currList = data.developers_list;
            var newList= currList;
            if (currList.length>1){
                var currArray = currList.split(";");
                if (!currArray.includes(userId)) {currArray.push(userId);
                newList = currArray.join(";");}
            }else if (currList.length===1){
                if (currList!==userId) newList+=`;${userId}`;
            }else newList+=`${userId}`;
            db.Project.update({
                developers_list: newList
            }, {
                where: {
                    id: projId
                }
            }).then(function () {
                res.status(200).end();
            })
        });
    });


    app.put("/removeCandidate/project/:pid/:uid", function (req, res) {
        var projId = req.params.pid;
        var userId = req.params.uid;
        db.Project.findOne({
            where: {
                id: projId
            }
        }).then(function (data) {
            var currList = data.developers_list;
            var newList= currList;
            if (currList.length>1){
                var currArray = currList.split(";");
                var index = currArray.indexOf(userId);
                currArray.splice(index,1);
                newList = currArray.join(";");
            }else{
                newList = "";
            }
            console.log(newList);
            db.Project.update({
                developers_list: newList
            }, {
                where: {
                    id: projId
                }
            }).then(function () {
                res.status(200).end();
            })
        });
    });


    app.post("/bid/application", function(req,res){
        db.UserBid.create(req.body)
        .then(function(){
            res.status(200).end();
        })
    })


};