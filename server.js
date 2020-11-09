const express = require("express");
const server = express();

const body_parser = require("body-parser");

server.use(body_parser.json());

const port = 3000;

const db = require("./db");
const collectionName = "hobbie";

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
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

/*
db.initialize(function(dbInstance) { 

    const dbObject = dbInstance.db(dbName);
    const dbCollection = dbObject.collection(collectionName); 
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
            console.log(result);
    });

    db.find("EUR", dbName, "level");

    server.post("/items", (request, response) => {
        console.log("POST");
        const item = request.body;
        console.log(item);
        dbCollection.insertOne(item, (error, result) => {
            if (error) throw error;
            dbCollection.find().toArray((_error, _result) => { 
                if (_error) throw _error;
                response.json(_result);
            });
        });
    });

}, function(err) { 
    throw (err);
});
*/