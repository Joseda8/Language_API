const MongoClient = require("mongodb").MongoClient;

const db_america = "mongodb+srv://admin:test@america.45mtz.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_asia = "mongodb+srv://admin:test@asia.5zgyr.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_europe = "mongodb+srv://admin:test@europe.hijtj.mongodb.net/DB_Languages?retryWrites=true&w=majority";

const nodes = {"AME": 0, "ASI": 1, "EUR": 2};
var db_url = [db_america, db_asia, db_europe];

const dbName = "DB_Languages";

function initialize(successCallback, failureCallback) {
    var this_db_url = [db_america, db_asia, db_europe];
    MongoClient.connect(this_db_url.shift(), function lambda(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            if(this_db_url.length == 0){
                failureCallback(err);
            }else{
                MongoClient.connect(this_db_url.shift(), lambda);
            }
        } else {
            console.log("[MongoDB connection] SUCCESS");
            successCallback(dbInstance);
        }
    });
}

function find(database, collection, dataCallback){
    var this_db_url = ["AME", "ASI", "EUR"];
    delete this_db_url[nodes[database]];

    MongoClient.connect(db_url[nodes[database]], function lambda(err, dbInstance) {

        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            
            if(this_db_url.length == 0){
                dataCallback(err);
            }else{
                MongoClient.connect(db_url[nodes[this_db_url.shift()]], lambda);
            }

        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(collection); 

            dbCollection.find({}, { projection: {_id:0}} ).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                }
                dataCallback(result);
            });

            dbInstance.close();
        }
    });
}

module.exports = {
    initialize, find
};


//https://dev.to/lennythedev/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1