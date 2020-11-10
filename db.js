const MongoClient = require("mongodb").MongoClient;

const db_america = "mongodb+srv://admin:test@america.45mtz.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_asia = "mongodb+srv://admin:test@asia.5zgyr.mongodb.net/DB_Languages?retryWrites=true&w=majority";
const db_europe = "mongodb+srv://admin:test@europe.hijtj.mongodb.net/DB_Languages?retryWrites=true&w=majority";

const nodes = {"AME": 0, "ASI": 1, "EUR": 2};
var db_url = [db_america, db_asia, db_europe];

const dbName = "DB_Languages";


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
            var dbCollection;
            const collection = "user";

            switch(query) {
                case "FIND":
                    dbCollection = dbObject.collection(info); 
                    dbCollection.find({}, { projection: {_id:0}} ).toArray(function(error, result) {
                        if(error){console.log(error);}
                        dataCallback(result);
                    });
                    break;

                case "REGISTER":
                    dbCollection = dbObject.collection(collection); 
                    dbCollection.insertOne(info, (error, result) => {
                        if(error){console.log(error);}
                    });
                  break;

                case "UPDATE":
                    dbCollection = dbObject.collection(collection); 
                    dbCollection.updateOne({ name: info.name }, { $set: {hobbies: info.hobbies, media: info.media} }, (error, result) => {
                        if(error){console.log(error);}
                    });
                    break;

                case "PEOPLE_LEARN":
                    dbCollection = dbObject.collection(collection); 
                    dbCollection.find({"learn.language": {$in: info}}, { projection: {_id:0}} ).toArray(function(error, result) {
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
    do_query
};

