
/**
 * CARD VIEW - PROVIDED AS EXAMPLE
 * Display data as browsable cards - good for comparing individual items
 */
function showCards(data) {
  const getBadge = (result) => {
    if (!result || result === "------"){
      return `To be inspected`;
    }

    const r = result.toLowerCase();

    if (r.includes("outstanding") || r.includes("Completed") || r.includes("no health risk")|| r.includes("Outstanding")) {
      return `✅ Compliant`;
    }

    if (r.includes("non-compliant") || r.includes("violations") ||r.includes("reopen")) {
      return `⚠️ Non-Compliant`;
    }


  };

  const cardHTML = data
    .map(
       /*html*/ 
      (restaurant) => `
                <div class="restaurant-card">
                    <h3>${restaurant.name}</h3>
                    <p><strong>Category:</strong> ${restaurant.category}</p>
                    <p><strong>Address:</strong> ${restaurant.address1}</p>
                    <p><strong>City:</strong> ${restaurant.city}</p>
                    <p><strong>Last Inspection:</strong> ${restaurant.inspectionDate ? restaurant.inspectionDate.slice(0,10) : "N/A"}</p>
                    <p><strong>Result:</strong> ${getBadge(restaurant.inspectionResults)}</p>

                    <p><strong>Owner:</strong> ${restaurant.owner}</p>
                </div>
            `
    )
    .join("");
     /*html*/ 
  return `
                <h2 class="view-title">🃏 Card View</h2>
                <p class="view-description">Browse restaurants as individual cards - perfect for comparing options</p>
                <div class="card-grid">
                    ${cardHTML}
                </div>
            `;
}

export default showCards;