const express = require("express");
const router = express.Router();
const job = require("../models/jobs")

router.get('/jobs', (req, res) =>
    job.findAll()
        .then(jobs => {
            console.log(jobs);
            res.sendStatus(200);
        })
        .catch(err => console.log(err)));

router.get();

module.exports = router;