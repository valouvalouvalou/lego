const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function getDB() {
    const uri = process.env.MONGODB_URI;  // Utiliser la variable d'environnement
    const dbName = 'DB_Lego';
    
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db(dbName);
      return db;
    } catch (error) {
      console.error("Erreur de connexion à MongoDB : ", error);
      throw new Error('Impossible de se connecter à la base de données');
    }
  }


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }
    
  const url = new URL(req.url, `http://${req.headers.host}`);
  const dealId = url.pathname.split('/').pop(); 
  try {
    if (!ObjectId.isValid(dealId)) {
      return res.status(400).send('Invalid ID format');
    }

    const db = await getDB();
    const collection = db.collection('Dealabs');

    const objectId = new ObjectId(dealId);

    // Recherche du deal par ID
    const deal = await collection.findOne({ _id: objectId });

    if (deal) {
      res.json(deal);
    } else {
      res.status(404).send('Deal not found');
    }
  } catch (error) {
    res.status(500).send('Error processing request');
  }
};
