// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};
let nbDealsPerPage = 6;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectSort = document.querySelector('#sort-select');

// instantiate the buttons
const bestDiscount = document.querySelector('#best-discount');
const mostCommented = document.querySelector('#most-commented');
const hotDeals = document.querySelector('#hot-deals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
      );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};


const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  if(parseInt(event.target.value) * (currentPagination.currentPage-1) <= currentPagination.count){
    const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));
    nbDealsPerPage = parseInt(event.target.value);
    setCurrentDeals(deals);
    render(currentDeals, currentPagination);
  }
  else{
    event.target.value = nbDealsPerPage;
    alert("Change page to change the number of deals per page");
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Select the page to browse
 */
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), nbDealsPerPage);

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Filter by best discount
 */
bestDiscount.addEventListener("click", async() => {
  const deals = await fetchDeals(currentPagination.currentPage, nbDealsPerPage);
  deals.result = deals.result.filter(deal => {
    return deal.discount > 50;
  });
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Filter by most commented
 */
mostCommented.addEventListener("click", async() => {
  const deals = await fetchDeals(currentPagination.currentPage, nbDealsPerPage);
  deals.result = deals.result.filter(deal => {
    return deal.comments > 15;
  });
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Filter by hot deals
 */
hotDeals.addEventListener("click", async() => {
  const deals = await fetchDeals(currentPagination.currentPage, nbDealsPerPage);
  deals.result = deals.result.filter(deal => {
    return deal.temperature > 100;
  });
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Sort by price and by date
 */
selectSort.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, nbDealsPerPage);
  switch(event.target.value){
    case "price-asc":
      deals.result = deals.result.sort((deal1, deal2) => parseInt(deal1.price) - parseInt(deal2.price));
      break;
    case "price-desc":
      deals.result = deals.result.sort((deal1, deal2) => parseInt(deal2.price) - parseInt(deal1.price));
      break;
    case "date-asc":
      deals.result = deals.result.sort((deal1, deal2) => deal1.published - deal2.published);
      break;
    case "date-desc":
      deals.result = deals.result.sort((deal1, deal2) => deal2.published - deal1.published);
      break;
  }

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});




// current sales on the page
let currentSales = [];

/**
 * Set global value
 * @param {Array} result - sales to display
 */
const setCurrentSales = ({result}) => {
  currentSales = result;
};

/**
 * Fetch sales from api
 * @param  {Number}  [id=42182] - id to fetch
 * @return {Object}
 */
const fetchSales = async (id = 42182) => {
  try {
    const response = await fetch(      
      `https://lego-api-blue.vercel.app/sales?id=${id}`
      );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentSales, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} sales
 */
const renderSales = sales => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = sales
    .map(sale => {
      return `
      <div class="sale" id=${sale.uuid}>
        <a href="${sale.link}">${sale.title}</a>
        <span>${sale.price}</span>
        <span>${sale.published}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Sales</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Display vinted sales
 */
selectLegoSetIds.addEventListener('change', async (event) => {
  const sales = await fetchSales(parseInt(event.target.value));

  setCurrentSales(sales);
  renderSales(currentSales);
});
