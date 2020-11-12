const MongoClient = require("mongodb").MongoClient;

const db_america = "mongodb+srv://admin:test@america.45mtz.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_asia = "mongodb+srv://admin:test@asia.5zgyr.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_europe = "mongodb+srv://admin:test@europe.hijtj.mongodb.net/DB_Languages?retryWrites=true&w=majority";

const nodes = {"AME": 0, "ASI": 1, "EUR": 2};
var db_url = [db_america, db_asia, db_europe];

const dbName = "DB_Languages";


function do_query_to_cluster(cluster, query, info, dataCallback){

    MongoClient.connect(db_url[nodes[cluster]], function lambda(err, dbInstance) {

        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            dataCallback(err);

        } else {
            const dbObject = dbInstance.db(dbName);
            const collection = "user";
            var dbCollection = dbObject.collection(collection);

            switch(query) {

                case "REGISTER": 
                    dbCollection.insertOne(info, (error, result) => {
                        if(error){console.log(error);}
                    });
                  break;

                case "UPDATE":
                    dbCollection.updateOne({ name: info.name }, { $set: {hobbies: info.hobbies, media: info.media} }, (error, result) => {
                        if(error){console.log(error);}
                    });
                    break;

                default:
                    dataCallback("Incorrect query");
              }
        
            dbInstance.close();
        }
    });
}

function do_query(cluster, query, info, dataCallback){
    var this_db_url = ["AME", "ASI", "EUR"];
    delete this_db_url[nodes[cluster]];

    MongoClient.connect(db_url[nodes[cluster]], function lambda(err, dbInstance) {

        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            
            if(this_db_url.length == 0){
                dataCallback(err);
            }else{
                MongoClient.connect(db_url[nodes[this_db_url.shift()]], lambda);
            }

        } else {
            const dbObject = dbInstance.db(dbName);
            const collection = "user";
            var dbCollection = dbObject.collection(collection);

            switch(query) {
                case "FIND":
                    dbCollection = dbObject.collection(info); 
                    dbCollection.find({}, { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "REGISTER": 
                    dbCollection.insertOne(info, (error, result) => {
                        if(error){console.log(error);}
                    });
                  break;

                case "UPDATE":
                    dbCollection.updateOne({ name: info.name }, { $set: {hobbies: info.hobbies, media: info.media} }, (error, result) => {
                        if(error){console.log(error);}
                    });
                    break;

                case "PEOPLE_LEARN":
                    dbCollection.find({"learn.language": {$in: info.learn}}, { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;
                
                case "PEOPLE_LEARN_TEACH":
                    dbCollection.find({$and: [{"learn.language": {$in: info.learn}}, {"teach.language": {$in: info.teach}}]}, 
                    { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "PEOPLE_LEARN_TEACH_COUNTRY":
                    dbCollection.find({$and: [{"learn.language": {$in: info.learn}}, {"teach.language": {$in: info.teach}}, {"country": info.country}]}, 
                    { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "PEOPLE_LEARN_TEACH_COUNTRY_AGE":
                    dbCollection.find({$and: [{"learn.language": {$in: info.learn}}, {"teach.language": {$in: info.teach}}, 
                    {"country": info.country}, {"age": {$gte: info.min, $lte: info.max}}]}, 
                    { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "PEOPLE_BY_COUNTRY":
                    dbCollection = dbObject.collection(collection);
                    dbCollection.aggregate([ { $group : { _id : "$country", count: { $sum: 1 } } } ]).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;
                
                case "PEOPLE_BY_LEARN":
                    dbCollection = dbObject.collection(collection);
                    dbCollection.aggregate([{$unwind: "$learn" }, { $group : { _id : "$learn.language", count: { $sum: 1 } } } ]).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "PEOPLE_BY_TEACH":
                    dbCollection = dbObject.collection(collection);
                    dbCollection.aggregate([{$unwind: "$teach" }, { $group : { _id : "$teach.language", count: { $sum: 1 } } } ]).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                default:
                    dataCallback("Incorrect query");
              }
        
            dbInstance.close();
        }
    });
}

module.exports = {
    do_query, do_query_to_cluster
};
