const express = require("express");
const server = express();
const body_parser = require("body-parser");
const db = require("./db");
const cors = require('cors');

server.use(body_parser.json());
server.use(cors());

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log("App is running on port " + port);
});

server.get("/", (req, res) => {
    res.end("Hello World!");
});


server.get("/test", (req, res) => {
    const {continent, collection} = req.query;

    db.do_query_to_cluster(continent, "FIND", collection, (data) => {
        res.json(data);
    });
});


/*
CONSULTAS A LA APLICACIÓN DE LOS USUARIOS
*/
server.get("/get", (req, res) => {
    const {continent, collection} = req.query;

    db.do_query(continent, "FIND", collection, (data) => {
        res.json(data);
    });
});

server.post("/get_user", (req, res) => {
    const username = req.body;
    const {continent} = req.query;

    db.do_query(continent, "FIND_USER", username, (data) => {
        if(data.length == 1){
            res.json(data);
        }else{
            res.sendStatus(404);
        }
        
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


server.post("/people_learn", (req, res) => {
    const info = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN", info, (data) => {
        res.json(data);
    });
});

server.post("/people_learn_teach", (req, res) => {
    const info = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN_TEACH", info, (data) => {
        res.json(data);
    });
});

server.post("/people_learn_teach_country", (req, res) => {
    const info = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN_TEACH_COUNTRY", info, (data) => {
        res.json(data);
    });
});


server.post("/people_learn_teach_country_age", (req, res) => {
    const info = req.body;
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_LEARN_TEACH_COUNTRY_AGE", info, (data) => {
        res.json(data);
    });
});


/*
CONSULTAS A LA APLICACIÓN DE LOS ADMINISTRADORES
*/

server.get("/people_by_country", (req, res) => {
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_BY_COUNTRY", null, (data) => {
        res.json(data);
    });
});

server.get("/people_by_learn", (req, res) => {
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_BY_LEARN", null, (data) => {
        res.json(data);
    });
});

server.get("/people_by_teach", (req, res) => {
    const {continent} = req.query;

    db.do_query(continent, "PEOPLE_BY_TEACH", null, (data) => {
        res.json(data);
    });
});

//db.user.aggregate( [ { $group : { _id : "$teach.language", count: { $sum: 1 } } } ] )
//db.user.aggregate( [ {$unwind: "$learn" } ] )

//db.user.aggregate( [ {$unwind: "$learn" }, { $group : { _id : "$learn.language", count: { $sum: 1 } } } ] )

/*
if (!localStorage.getItem('user_info')){
    localStorage.setItem('user_info', '');
}

    var info = { "username": "Joseda8", 
                "learn":[
                {"language":"English", "level":"Intermedio"},
                {"language":"Spanish", "lastName":"Avanzado"}
                ],
                "teach":[
                {"language":"German", "level":"Principiante"},
                ],
            };

    localStorage.setItem('user_info', info);
*/