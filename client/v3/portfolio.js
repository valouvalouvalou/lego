'use strict';

// current deals on the page
let currentDeals = [];
let legoSetIds = [];

// instantiate the selectors
const selectFilter = document.querySelector('#filter-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals-container');

// Fonction pour afficher les offres rentables
const renderProfitableDeals = (deals) => {
    sectionDeals.innerHTML = '';  // Réinitialiser l'affichage
  
    if (deals.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Aucun deal rentable trouvé pour ce set Lego.';
        sectionDeals.appendChild(message);
        return;
      }

    deals.forEach(deal => {
        const dealElement = document.createElement('div');
        dealElement.classList.add('deal');
        const posted = formatDate(deal.publishedDate);
        dealElement.innerHTML = `
            <h3>
                <a href="${deal.link}" target="_blank" style="color: black; text-decoration: none; font-weight: bold;">
                ${deal.title}
                </a>
            </h3>
            <p><strong>Price:</strong> ${deal.price}€</p>
            <p><strong>Temperature:</strong> ${deal.temperature}</p>
            <p><strong>Comments count:</strong> ${deal.commentCount}</p>
            <p>Published ${posted}.</p>
        `;
        sectionDeals.appendChild(dealElement);
      });
  };

const fetchDeals = async (idLego) => {
    // Construire l'URL pour récupérer les deals
    const urlDeals = new URL(`https://server-best-lego-deals.vercel.app/deals/search?idLego=${idLego}`);
    // Construire l'URL pour récupérer les sales
    const urlSales = new URL(`https://server-best-lego-deals.vercel.app/sales/search?idLego=${idLego}`);
  
    try {
      // Récupérer les deals
      const responseDeals = await fetch(urlDeals);
      const dataDeals = await responseDeals.json();
      
      // Récupérer les sales
      const responseSales = await fetch(urlSales);
      const dataSales = await responseSales.json();
  
      // Vérifier si des deals et des sales sont retournés
      if (Array.isArray(dataDeals) && dataDeals.length > 0 && Array.isArray(dataSales) && dataSales.length > 0) {
        const deals = dataDeals;
        const sales = dataSales;
  
        // Calculer la médiane des sales
        const medianPrice = calculateMedian(sales.map(sale => parseFloat(sale.price)));
  
        // Filtrer les deals rentables (prix < médiane des ventes)
        currentDeals = deals.filter(deal => deal.price < medianPrice);
  
        renderProfitableDeals(currentDeals);  // Afficher les deals rentables
      } else {
        const message = document.createElement('p');
        message.textContent = 'Aucune sales n\'a été trouvée pour ce set Lego.';
        sectionDeals.appendChild(message);
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };
  
  // Fonction pour calculer la médiane d'un tableau de nombres
  const calculateMedian = (array) => {
    array.sort((a, b) => a - b);  // Trier les prix par ordre croissant
    const middle = Math.floor(array.length / 2);
  
    if (array.length % 2 === 0) {
      // Si la longueur est paire, la médiane est la moyenne des deux valeurs centrales
      return (array[middle - 1] + array[middle]) / 2;
    } else {
      // Si la longueur est impaire, la médiane est la valeur centrale
      return array[middle];
    }
  };

  const fetchLegoSetIds = async () => {
    const url = 'https://server-best-lego-deals.vercel.app/deals/idLego';
    try {
      const response = await fetch(url);
      const data = await response.json();
      const legoSetIds = data.legoSets.filter(id => id !== null); // enlever null
  
      // Remplir le select
      const selectElement = document.getElementById('lego-set-id-select');
      legoSetIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        selectElement.appendChild(option);
      });
  
      // Appeler fetchDeals avec le premier id
      if (legoSetIds.length > 0) {
        fetchDeals(legoSetIds[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ID Lego:', error);
    }
  };
  

// Fonction d'initialisation
document.addEventListener('DOMContentLoaded', () => {
    fetchLegoSetIds();
});

selectLegoSetIds.addEventListener('change', (event) => {
    const selectedId = event.target.value;
    if (selectedId) {
      fetchDeals(selectedId);
    }
  });

selectFilter.addEventListener('change', (event) => {
    const filterValue = event.target.value;
    sortDeals(filterValue);
  });

const sortDeals = (filter) => {
    if (!currentDeals || currentDeals.length === 0) return;
  
    let sortedDeals = [...currentDeals]; // Copie des deals pour éviter de modifier l'original
  
    switch (filter) {
      case 'best-discount':
        sortedDeals.sort((a, b) => b.temperature - a.temperature);
        break;
      case 'most-commented':
        sortedDeals.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case 'cheaper':
        sortedDeals.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        sortedDeals.sort((a, b) => b.price - a.price);
        break;
      case 'recently-published':
        sortedDeals.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        break;
      case 'anciently-published':
        sortedDeals.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate));
        break;
      default:
        break;
    }
  
    renderProfitableDeals(sortedDeals);
  };
  