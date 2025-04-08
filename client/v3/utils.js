// utils.js

// Fonction pour formater les dates en "Posted X minutes ago" ou "Posted X days ago"
function formatDate(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else {
      return `${Math.floor(diff / 86400)} days ago`;
    }
  }
  
  // Fonction pour calculer la médiane d'une liste de prix
  function calculateMedianPrice(prices) {
    const sortedPrices = prices.sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);
    return sortedPrices.length % 2 === 0 ? (sortedPrices[mid - 1] + sortedPrices[mid]) / 2 : sortedPrices[mid];
  }
  