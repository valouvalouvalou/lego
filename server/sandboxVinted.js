/* eslint-disable no-console, no-process-exit */

const vinted = require('./websites/vinted');

async function sandbox (id = 42182) {
  try {
    const website = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741851955&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
    //const website = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741851924&search_text=${id}&catalog_ids=&currency=EUR&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const sales = await vinted.scrape(website, id);

    console.log(sales);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
