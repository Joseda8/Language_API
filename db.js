const MongoClient = require("mongodb").MongoClient;

const db_america = "mongodb+srv://admin:test@america.45mtz.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_asia = "mongodb+srv://admin:test@asia.5zgyr.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_europe = "mongodb+srv://admin:test@europe.hijtj.mongodb.net/DB_Languages?retryWrites=true&w=majority";

const nodes = {"AME": 0, "ASI": 1, "EUR": 2};
var db_url = [db_america, db_asia, db_europe];

const dbName = "DB_Languages";

function find(cluster, collection, dataCallback){
    var this_db_url = ["AME", "ASI", "EUR"];
    delete this_db_url[nodes[cluster]];

    MongoClient.connect(db_url[nodes[cluster]], { useUnifiedTopology: true }, function lambda(err, dbInstance) {

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


function register_user(cluster, user_info, dataCallback){
    var this_db_url = ["AME", "ASI", "EUR"];
    delete this_db_url[nodes[cluster]];

    const collection = "user";

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
            const dbCollection = dbObject.collection(collection); 

            dbCollection.insertOne(user_info, (error, result) => {
                console.log(error);
            });
        
            dbInstance.close();
        }
    });
}


function update_user(cluster, user_info, dataCallback){
    var this_db_url = ["AME", "ASI", "EUR"];
    delete this_db_url[nodes[cluster]];

    const collection = "user";

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
            const dbCollection = dbObject.collection(collection); 

            dbCollection.updateOne({ name: user_info.name }, { $set: {hobbies: user_info.hobbies, media: user_info.media} }, (error, result) => {
                console.log(error);
            });
        
            dbInstance.close();
        }
    });
}


module.exports = {
    find, register_user, update_user
};


//https://dev.to/lennythedev/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1

