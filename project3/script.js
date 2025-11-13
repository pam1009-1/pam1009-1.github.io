import showCards from './editable_js/template_cards.js';
import showCategories from './editable_js/template_category.js';
import showStats from './editable_js/template_stats.js';
import showTable from './editable_js/template_table.js';

import loadData from './editable_js/load_data.js';
import initStatsCharts from './stats_charts.js';

// =====================================================
// CARD FILTERS (Search + City Filter)
// =====================================================
function initCardFilters() {
  const searchInput = document.getElementById("card-search");
  const citySelect = document.getElementById("city-filter");
  const container = document.getElementById("card-container");

  // If card view isn't active yet, exit
  if (!searchInput || !citySelect || !container) return;

  function applyFilters() {
    const text = searchInput.value.toLowerCase();
    const selectedCity = citySelect.value.toLowerCase();

    const cards = container.querySelectorAll(".restaurant-card");

    cards.forEach(card => {
      const name = (card.dataset.name || "").toLowerCase();
      const city = (card.dataset.city || "").toLowerCase();

      const matchesText =
        !text || name.includes(text) || city.includes(text);

      const matchesCity =
        !selectedCity || city === selectedCity;

      card.style.display = (matchesText && matchesCity) ? "" : "none";
    });

    // "Showing X of Y" summary
    const summary = document.getElementById("card-summary");
    if (summary) {
      const visibleCount = Array.from(cards)
        .filter(card => card.style.display !== "none").length;

      summary.innerHTML = `
        Showing <strong>${visibleCount}</strong> of <strong>${cards.length}</strong> restaurants
        (sorted by latest inspection date)
      `;
    }
  }

  searchInput.oninput = applyFilters;
  citySelect.onchange = applyFilters;

  // Run once so it syncs the summary if needed
  applyFilters();
}


// =====================================================
// TABLE Pages
// =====================================================
window.changeTablePage = function(page) {
  const data = window._tableData || [];
  if (!data.length) return;

  const html = showTable(data, page);
  document.getElementById("data-display").innerHTML = html;

  updateButtonStates("table");
};


// =====================================================
// UPDATE VIEW
// =====================================================
function updateDisplay(content) {
  document.getElementById("data-display").innerHTML = content;
}

function updateButtonStates(activeView) {
  document.querySelectorAll(".view-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(`btn-${activeView}`).classList.add("active");
}

function showLoading() {
  updateDisplay('<div class="loading">Loading data from API...</div>');
}

function showError(message) {
  updateDisplay(`
    <div class="error">
      <h3>Error Loading Data</h3>
      <p>${message}</p>
      <button onclick="location.reload()">Try Again</button>
    </div>
  `);
}


document.addEventListener("DOMContentLoaded", async () => {
  console.log("Starting application...");

  try {
    showLoading();
    const data = await loadData();
    window._tableData = data;

    // filters
    initCardFilters(data);

    console.log(`Loaded ${data.length} items from API`);

    // ==========================
    // BUTTON HANDLERS
    // ==========================
    document.getElementById("btn-cards").onclick = () => {
      updateDisplay(showCards(data));
      updateButtonStates("cards");

      initCardFilters(data);
    };

    document.getElementById("btn-table").onclick = () => {
      updateDisplay(showTable(data, 1));   
      updateButtonStates("table");
    };


    document.getElementById("btn-categories").onclick = () => {
      updateDisplay(showCategories(data));
      updateButtonStates("categories");
    };

    document.getElementById("btn-stats").onclick = () => {
      updateDisplay(showStats(data));
      updateButtonStates("stats");

      try {
        if (typeof initStatsCharts === 'function') {
          initStatsCharts(data);
        } else if (window.initStatsCharts) {
          window.initStatsCharts(data);
        }
      } catch (err) {
        console.warn('Stats charts failed to initialize:', err);
      }
    };

    // ==========================
    // DEFAULT VIEW (Cards)
    // ==========================
    updateDisplay(showCards(data));
    updateButtonStates("cards");

    initCardFilters(data);

    console.log("Application ready!");
  } catch (error) {
    console.error("Application failed to start:", error);
    showError(error.message);
  }
});

// =====================================================
// Card View
// =====================================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-toggle');
  if (!btn) return;
  const card = btn.closest('.restaurant-card');
  const extra = card.querySelector('.card-extra');
  const open = card.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', String(open));
  if (extra) extra.setAttribute('aria-hidden', String(!open));
  btn.textContent = open ? 'Hide details' : 'Details';
});
