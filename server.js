const express = require("express");
const server = express();
const body_parser = require("body-parser");
const db = require("./db");

server.use(body_parser.json());

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("App is running on port " + port);
});

server.get("/", (req, res) => {
    res.end("HOLA");
});


server.get("/get", (req, res) => {
    const {continent, collection} = req.query;

    db.do_query(continent, "FIND", collection, (data) => {
        res.json(data);
    });

});

server.post("/register", (req, res) => {
    const new_user = req.body;
    const {continent} = req.query;

    db.do_query(continent, "REGISTER", new_user, (data) => {
        console.log(data);
    });

   res.sendStatus(200);
});


server.put("/update", (req, res) => {
    const new_info = req.body;
    const {continent} = req.query;

    db.do_query(continent, "UPDATE", new_info, (data) => {
        console.log(data);
    });

    res.sendStatus(200);
});


server.get("/people_learn", (req, res) => {
    const languages = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN", languages, (data) => {
        res.json(data);
    });
});

server.get("/people_learn_teach", (req, res) => {
    const languages = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN_TEACH", languages, (data) => {
        res.json(data);
    });

    /*
db.user.find(
    {$and: [{"learn.language": {$in: ["Slovak", "Chinese"]}}, {"teach.language": {$in: ["Spanish"]}}]},
    {_id:0}
    )
    */
});


