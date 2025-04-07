const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'DB_Lego';

let client;
let db;

const connectToDB = async () => {
  if (!client) {
    client = await MongoClient.connect(MONGODB_URI);
    db = client.db(MONGODB_DB_NAME);
    console.log('🟢 Connected to MongoDB');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Connection closed');
  }
};


module.exports = {
  connectToDB,
  closeDB
};