const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://vvdvrt:rootvdvrt@lego.nxeqm.mongodb.net/DB_Lego?retryWrites=true&writeConcern=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });

async function connectToDatabase() {
  await client.connect();
  console.log('🟢 Connected to MongoDB');
  return client.db('DB_Lego');
}

// Méthodes de requêtes

async function findBestTemperatureDeals(db) { // Find all best temperature deals
  const collection = db.collection('Dealabs');
  return await collection.find().sort({ temperature: -1 }).toArray();
}

async function findMostCommentedDeals(db) { // Find all most commented deals
  const collection = db.collection('Dealabs');
  return await collection.find().sort({ commentCount: -1 }).toArray();
}

async function findDealsSortedByPrice(db) { // Find all deals sorted by price
  const collection = db.collection('Dealabs');
  return await collection.find().sort({ price: 1 }).toArray();
}

async function findDealsSortedByDate(db) { // Find all deals sorted by date
  const collection = db.collection('Dealabs');
  return await collection.find().sort({ publishedDate: -1 }).toArray();
}

async function findSalesByLegoSetId(db, legoSetId) { // Find all sales for a given lego set id
  const collection = db.collection('Vinted');
  return await collection.find({ idLego: legoSetId }).toArray();
}

/*async function findRecentSales(db) { // Find all sales scraped less than 3 weeks
  const collection = db.collection('Vinted');
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

  return await collection.find({ publishedDate: { $gte: threeWeeksAgo } }).toArray();
}*/

// Export des fonctions
module.exports = {
  connectToDatabase,
  findBestTemperatureDeals,
  findMostCommentedDeals,
  findDealsSortedByPrice,
  findDealsSortedByDate,
  findSalesByLegoSetId
  //findRecentSales
};
