const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

const uri = 'mongodb+srv://vvdvrt:rootvdvrt@lego.nxeqm.mongodb.net/DB_Lego?retryWrites=true&writeConcern=majority';
const dbName = 'DB_Lego'; // Nom de la base de données

// Fonction pour se connecter à la base de données
async function getDB() {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  return db;
}

// Endpoint GET /deals/search
app.get('/deals/search', async (req, res) => {
  try {
    const { limit = 12, price, date, filterBy } = req.query;
    const db = await getDB();
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

// Endpoint pour récupérer un deal spécifique par ID
app.get('/deals/:id', async (req, res) => {
  const dealId = req.params.id;
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
});

// Endpoint GET /sales/search
/*app.get('/sales/search', async (req, res) => {
  try {
    const { limit = 12, legoSetId, price } = req.query;
    const db = await getDB();
    const collection = db.collection('Vinted');

    const query = {};

    if (legoSetId) {
      query.idLego = legoSetId;
    }

    // Filtre par prix si fourni
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        query.price = { $lte: parsedPrice };
      } else {
        return res.status(400).send('Invalid price format');
      }
    }

    // Toujours trier par prix, même sans filtre
    const results = await collection
      .find(query)
      .sort({ price: 1 }) // tri toujours actif
      .limit(Number(limit))
      .toArray();

    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche des ventes :', error);
    res.status(500).send('Erreur lors de la recherche des ventes');
  }
});*/
app.get('/sales/search', async (req, res) => {
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
});



// Lancer le serveur sur le port défini
app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});



//app.listen(PORT);

//console.log(`📡 Running on port ${PORT}`);
