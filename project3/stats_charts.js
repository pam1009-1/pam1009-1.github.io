// stats_charts.js
let catChart = null;
let monthChart = null;

function monthKey(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // YYYY-MM for grouping
  return d.toISOString().slice(0, 7);
}

function initStatsCharts(data) {
  if (typeof window.Chart === "undefined") return; 

  const citySelect = document.getElementById("stats-city-filter");
  const catCanvas = document.getElementById("chart-categories");
  const monthCanvas = document.getElementById("chart-months");
  if (!citySelect || !catCanvas || !monthCanvas) return;

  const applyFilter = () => {
    const city = citySelect.value;
    const filtered = city === "__ALL__" 
    ? data 
    : data.filter(r => (r.city ? r.city.trim().toLowerCase() : "unspecified") === city);

    // Group by category
    const catCounts = new Map();
    filtered.forEach(r => {
      const k = (r.category || "Unspecified").trim() || "Unspecified";
      catCounts.set(k, (catCounts.get(k) || 0) + 1);
    });
    const catLabels = Array.from(catCounts.keys()).sort((a, b) => a.localeCompare(b));
    const catValues = catLabels.map(k => catCounts.get(k));

    // Group by month of inspection date
    const monthCounts = new Map();
    filtered.forEach(r => {
      const m = monthKey(r.inspectionDate);
      if (!m) return;
      monthCounts.set(m, (monthCounts.get(m) || 0) + 1);
    });
    const monthLabels = Array.from(monthCounts.keys()).sort();
    const monthValues = monthLabels.map(k => monthCounts.get(k));

    if (catChart) { catChart.destroy(); }
    if (monthChart) { monthChart.destroy(); }

    // Bar: Restaurants by Category
    catChart = new Chart(catCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: catLabels,
        datasets: [{
          label: "Restaurants",
          data: catValues
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false }
        },
        scales: {
          x: { ticks: { maxRotation: 0, autoSkip: true } },
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });

    // Line: Inspections per Month
    monthChart = new Chart(monthCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: monthLabels,
        datasets: [{
          label: "Inspections",
          data: monthValues,
          tension: 0.25,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false }
        },
        scales: {
          x: { ticks: { maxRotation: 0, autoSkip: true } },
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  };

  applyFilter();
  citySelect.addEventListener("change", applyFilter);
}

export default initStatsCharts;
