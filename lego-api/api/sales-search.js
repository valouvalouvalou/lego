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

    try {
      const { limit = 12, legoSetId, price } = req.query;
      const db = await getDB();
      const collection = db.collection('Vinted');
  
      const query = {};
  
      // Requête de recherche pour le legoSetId
      if (legoSetId) {
        query.idLego = { $eq: legoSetId };
      }
  
      // On ajoute un champ "priceAsNumber" converti en number
      const deals = await collection.aggregate([
        {
          $addFields: {
            priceAsNumber: { $toDouble: "$price" }
          }
        },
        {
          $match: price ? { priceAsNumber: { $lte: parseFloat(price) } } : {}
        },
        {
          $sort: { priceAsNumber: 1 }
        },
        {
          $limit: parseInt(limit)
        }
      ]).toArray();
  
      res.json(deals);
    } catch (error) {
      console.error('Erreur lors de la recherche des sales :', error);
      res.status(500).send('Erreur lors de la recherche des sales');
    }
  };
  