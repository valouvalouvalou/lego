const { MongoClient } = require('mongodb');

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


module.exports = async (req, res) => {
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
      query.commentCount = { $gte: 20 }; // Exemple : filtrer les deals avec plus de 20 commentaires
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
};
