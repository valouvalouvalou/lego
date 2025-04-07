const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://vvdvrt:rootvdvrt@lego.nxeqm.mongodb.net/DB_Lego?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'DB_Lego';

async function connectDB() {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    console.log('🟢 Connected to MongoDB');
    return client;
}

async function closeDB(client) {
    if (client) {
        await client.close();
        console.log('Connection closed');
    }
}

module.exports = { connectDB };
