var http = require('http');
const express = require("express");
const server = express();
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const body_parser = require("body-parser");


server.use(body_parser.json());
server.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

const port = process.env.PORT || 8000;

const db = require("./db");
 

server.listen(port, () => {
    console.log("App is running on port " + port);
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

    db.register_user(continent, new_user, (data) => {
        console.log(data);
    });

   res.sendStatus(200);
});


server.put("/update", (req, res) => {
    const new_info = req.body;
    const {continent} = req.query;

    db.update_user(continent, new_info, (data) => {
        console.log(data);
    });

    res.sendStatus(200);
});