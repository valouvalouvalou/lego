/* eslint-disable no-console, no-process-exit */

const vinted = require('./websites/vinted');

async function sandbox (website = 'https://www.vinted.fr/catalog?search_text=LEGO') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const sales = await vinted.scrape(website);

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
