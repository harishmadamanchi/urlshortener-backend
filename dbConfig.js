const mongoDB = require("mongodb");
const mongoClient = mongoDB.MongoClient;
const MONGOURL =
  "mongodb+srv://Harish:12345@cluster0.rcaaw.mongodb.net/test?authSource=admin&replicaSet=atlas-3n8ao4-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
module.exports = { mongoDB, mongoClient, MONGOURL };
