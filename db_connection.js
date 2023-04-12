const { MongoClient } = require('mongodb');
// require("dotenv").config({ path: `.env`, })

const DB_NAME = "mo1306_megaKtask" 
const DB_PASSWORD = "CeAjy18NBH0llGuzQSJh5GOC29" 

const uri = `mongodb://${DB_NAME}:${DB_PASSWORD}@mongo48.mydevil.net:27017/${DB_NAME}`;
const client = new MongoClient(uri);

client.connect();
const db = client.db(DB_NAME);

module.exports = { db };

// mongodb://<nazwa_bazy>:<hasło>@<serwer>:27017/authSource=<nazwa_bazy>
// const uri = "mongodb+srv://NodeJSdbuser:anybtWW42aE7lWII@cluster0.nbaz8.mongodb.net/";