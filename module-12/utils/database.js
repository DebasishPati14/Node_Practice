const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db ;

const connectMongo = (callback)=> {
mongoClient.connect("mongodb+srv://Usemy_Node_Practice:ezcYWnvYv4Pdrebn@cluster0.yvpr5b1.mongodb.net/?retryWrites=true&w=majority").then(
    (clientDetails) => {
        _db = clientDetails.db();
        callback();
    }
    ).catch((error) => {
throw error    })
    }

const getDB = () =>{
    if(_db){
        return _db;
    }else{
        throw "No Database found"
    }
}

exports.connectMongo = connectMongo;
exports.getDB = getDB;