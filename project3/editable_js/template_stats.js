/**
 * STATS VIEW
 */
function showStats(data) {
  const total = data.length;
  const unique = (arr) => Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const rawCities = data.map(r => r.city ? r.city.trim().toLowerCase() : "unspecified");

  const cities = Array.from(new Set(rawCities)).sort();

  const titleCase = (s) => s.replace(/\b\w/g, c => c.toUpperCase());

  const cuisines = unique(data.map(r => r.category || "Unspecified"));

  const chartMissing = typeof window.Chart === "undefined";

  const cityOptions = [`<option value="__ALL__" selected>All cities</option>`]
    .concat(cities.map(c => `<option value="${c}">${titleCase(c)}</option>`))
    .join("");

  const summary = `
    <div class="stats-grid">
      <div class="stat-card"><h3>Total Restaurants</h3><p>${total}</p></div>
      <div class="stat-card"><h3>Cities</h3><p>${cities.length}</p></div>
      <div class="stat-card"><h3>Categories</h3><p>${cuisines.length}</p></div>
    </div>
  `;

  const controls = `
    <div class="section mt-2">
      <div class="form-row">
        <label>
          <span class="m-0" style="display:block;margin-bottom:6px">Filter by city</span>
          <select id="stats-city-filter">${cityOptions}</select>
        </label>
      </div>
    </div>
  `;

const charts = `
  <div class="section mt-2">
    <h3 class="m-0">Restaurants by Category</h3>
    <div class="chart-wrap"><canvas id="chart-categories"></canvas></div>
  </div>

  <div class="section mt-2">
    <h3 class="m-0">Inspections per Month</h3>
    <div class="chart-wrap"><canvas id="chart-months"></canvas></div>
  </div>
`;


  const fallback = `
    <div class="error mt-2">
      Chart library didn’t load. Showing summary only.
    </div>
  `;

  return /*html*/`
    <h2 class="view-title">Trends</h2>
    <p class="view-description">Explore patterns with interactive charts. Filter by city to focus the view.</p>
    ${summary}
    ${controls}
    ${chartMissing ? fallback : charts}
  `;
}

export default showStats;
