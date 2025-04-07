const {
    connectToDatabase,
    findBestTemperatureDeals,
    findMostCommentedDeals,
    findDealsSortedByPrice,
    findDealsSortedByDate,
    findSalesByLegoSetId
    //findRecentSales
  } = require('./dealQueries');
  
  async function main() {
    const db = await connectToDatabase();
  /*
    const bestDeals = await findBestTemperatureDeals(db);
    console.log('Best Deals:', bestDeals);
  
    const mostCommented = await findMostCommentedDeals(db);
    console.log('Most Commented Deals:', mostCommented);
  
    const sortedByPrice = await findDealsSortedByPrice(db);
    console.log('Deals Sorted by Price:', sortedByPrice);
  
    const sortedByDate = await findDealsSortedByDate(db);
    console.log('Deals Sorted by Date:', sortedByDate);*/
  
    const salesById = await findSalesByLegoSetId(db, '42156');
    console.log('Sales for Lego Set 42156:', salesById);
  
    /*const recentSales = await findRecentSales(db);
    console.log('Sales scraped in last 3 weeks:', recentSales);*/
  }
  
  main();
  