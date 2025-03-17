const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://vvdvrt:rootvdvrt@lego.nxeqm.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'lego';

async function testConnection() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connexion réussie à MongoDB');

        const db = client.db(MONGODB_DB_NAME);
        console.log(`📂 Base de données sélectionnée : ${db.databaseName}`);

        await client.close();
        console.log('🔌 Connexion fermée');
    } catch (error) {
        console.error('❌ Erreur de connexion :', error);
    }
}

testConnection();