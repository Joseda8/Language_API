const express = require("express");
const server = express();

const body_parser = require("body-parser");

server.use(body_parser.json());


var port_number = server.listen(process.env.PORT || 3000);

const db = require("./db");
const collectionName = "hobbie";

server.listen(port_number, () => {
    console.log(`Server listening at ${port_number}`);
});


server.get("/", (req, res) => {
    res.end("HOLA");
});

server.get("/get", (req, res) => {
    const nodes = ["AME", "ASI", "EUR"];
    const {continent, collection} = req.query;

    db.find(continent, collection, (data) => {
        res.json(data);
    });
});

server.post("/register", (req, res) => {
    const new_user = req.body;
    const {continent} = req.query;
    console.log(new_user);
    console.log(continent);

    db.register_user(continent, new_user, (data) => {
        console.log(data);
    });

   res.sendStatus(200);
});


server.put("/update", (req, res) => {
    const new_info = req.body;
    const {continent} = req.query;

    console.log(new_info.hobbies);
    console.log(new_info.media);
    console.log(new_info.name);
    console.log(continent);

    db.update_user(continent, new_info, (data) => {
        console.log(data);
    });

    res.sendStatus(200);
});