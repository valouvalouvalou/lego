const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { connectToDB, close } = require('./db');

const PORT = 8092;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'DB_Lego';

const app = express();

// Endpoint GET /deals/search
app.get('/deals/search', async (req, res) => {
    try {
      const { limit = 12, price, date, filterBy, idLego } = req.query;
      const db = await connectToDB();
      const collection = db.collection('Dealabs');
  
      // Construire la requête de recherche
      const query = {};
  
      if (price) {
        query.price = { $lte: parseFloat(price) };
      }
  
      if (date) {
        const timestamp = Math.floor(new Date(date).getTime() / 1000);
        query.publishedDate = { $gte: timestamp };
      }
  
      if (filterBy === 'best-discount') {
        query.temperature = { $gte: 50 }; // Exemple : trouver les deals avec une température >= 50
      } else if (filterBy === 'most-commented') {
        query.commentCount = { $gte: 20}; // Exemple : filtrer les deals avec plus de 20 commentaires
      }
  
      if (idLego) {
        query.idLego = idLego;
      }

      const deals = await collection
        .find(query)
        .limit(parseInt(limit))
        .sort({ price: 1 })
        .toArray();
  
      res.json(deals);
    } catch (error) {
      console.error('Erreur lors de la recherche des deals :', error);
      res.status(500).send('Erreur lors de la recherche des deals');
    }
  });

  app.get('/deals/idLego', async (req, res) => {
    try {
      const db = await connectToDB();
      const collection = db.collection('Dealabs');
  
      const legoSets = await collection.distinct('idLego'); // Récupérer tous les idLego uniques de la collection
  
      res.json({ legoSets });
    } catch (error) {
      console.error('Erreur lors de la récupération des LEGO sets :', error);
      res.status(500).send('Erreur lors de la récupération des LEGO sets');
    }
  });

// Endpoint GET /deals/id
app.get('/deals/:id', async (req, res) => {
    const dealId = req.params.id;
    try {
      if (!ObjectId.isValid(dealId)) {
        return res.status(400).send('Invalid ID format');
      }
  
      const db = await connectToDB();
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
  });


// Endpoint GET /sales/search
app.get('/sales/search', async (req, res) => {
    try {
      const { limit = 12, idLego, price } = req.query;
      const db = await connectToDB();
      const collection = db.collection('Vinted');
  
      const query = {};
  
      // Requête de recherche pour le legoSetId
      if (idLego) {
        query.idLego = { $eq: idLego };
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
  });

app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});

// Close conection MongoDB
process.on('SIGINT', async () => {
    console.log('\n🛑 SIGINT received. Closing MongoDB connection...');
    await close();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received. Closing MongoDB connection...');
    await close();
    process.exit(0);
  });