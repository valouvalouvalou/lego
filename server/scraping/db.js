const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
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
