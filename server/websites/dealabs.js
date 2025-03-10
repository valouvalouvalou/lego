const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.js-threadList article')
    .map((i, element) => {
        const title = $(element).find('.thread-title a').attr('title');
        const linkDealabs = $(element).find('.thread-title a').attr('href');
        const data = JSON.parse($(element).find('.js-vue2').attr('data-vue2'));
        const linkSeller = data.props.thread.link;
        const price = data.props.thread.price;
        const commentCount = data.props.thread.commentCount;
        const temperature = data.props.thread.temperature;
        const publishedDate = data.props.thread.publishedAt;
        
      return {
        title,
        linkDealabs,
        linkSeller,
        price,
        commentCount,
        temperature,
        publishedDate
      };
    })
    .get();

};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
    const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }
      });

    if (response.ok) {
        const body = await response.text();
        const deals = parse(body);
        
        fs.writeFileSync('lego_deals_from_dealabs.json', JSON.stringify(deals, null, 2), 'utf-8');
        console.log('✅ Deals enregistrés dans lego_deals_from_dealabs.json');

        return deals;
    }

    console.error(response);

    return null;
};