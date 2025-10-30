/**
 * STATS VIEW - STUDENTS IMPLEMENT
 * Show aggregate statistics and insights - good for understanding the big picture
 */
function showStats(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Calculate meaningful statistics from the dataset
  // - Present insights visually
  // - Show distributions, averages, counts, etc.
  // - Help users understand patterns in the data
  /*html*/

  const total_establishments = data.length;
  const unique_categories = new Set(data.map(d => d.category)).size;
  const unique_cities = new Set(data.map(d => d.city)).size;

  const latest_date = data.reduce((latest, item) => {
    const d = new Date(item.inspectionDate);
    return !Number.isNaN(d.getTime()) && d > latest ? d : latest;
    }, new Date(0));
    const latest_inspection = latest_date.toISOString().slice(0, 10);

    const compliant = data.filter(d => {
        const r = (d.inspectionResults || "").toLowerCase();
        return (
            r.includes("compliant") ||
            r.includes("no health risk") ||
            r.includes("outstanding") ||
            r.includes("completed")
            
        );
    }).length;
    const compliance_rate = ((compliant / total_establishments) * 100).toFixed(1);

const category_counts = {};

data.forEach(item => {
  let cat = item.category || "Unknown";
  if (!cat || cat === "N/A" || cat === "Unknown" || cat === "------") return;
  if (cat.toLowerCase().includes("fast food")) cat = "Fast Food";
  category_counts[cat] = (category_counts[cat] || 0) + 1;
});

const sorted_categories = Object.entries(category_counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

const category_html = sorted_categories
  .map(([cat, count]) => `
    <tr>
      <td>${cat}</td>
      <td>${count}</td>
    </tr>
  `)
  .join("");

    
    const city_counts = {};
    data.forEach(item => {
        const city = item.city || "Unknown";
        city_counts[city] = (city_counts[city] || 0) + 1;
    });

    const top_cities = Object.entries(city_counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const city_html = top_cities
    .map(([city, count], idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${city}</td>
        <td>${count}</td>
      </tr>
    `)
    .join("");

const monthly_counts = {}; // { "YYYY-MM": { total, compliant } }

data.forEach(item => {
  if (!item.inspectionDate) return;
  const date = new Date(item.inspectionDate);
  if (Number.isNaN(date.getTime())) return;

  const month_key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const result = (item.inspectionResults || "").toLowerCase();

  if (!monthly_counts[month_key]) monthly_counts[month_key] = { total: 0, compliant: 0 };
  monthly_counts[month_key].total++;
  if (
    result.includes("compliant") ||
    result.includes("no health risk") ||
    result.includes("outstanding") ||
    result.includes("completed")
  ) {
    monthly_counts[month_key].compliant++;
  }
});

const monthly_trend = Object.entries(monthly_counts)
  .sort(([a], [b]) => new Date(b) - new Date(a))
  .slice(0, 6); 

const monthly_html = monthly_trend
  .map(([month, { total, compliant }]) => {
    const rate = ((compliant / total) * 100).toFixed(1);
    return `
      <tr>
        <td>${month}</td>
        <td>${total}</td>
        <td>${rate}%</td>
      </tr>
    `;
  })
  .join("");

const trend_section = `
  <section class="stats-section">
    <h3>Monthly Compliance Trend</h3>
    <table class="restaurant-table" aria-label="Monthly compliance trend">
      <thead>
        <tr><th scope="col">Month</th><th scope="col">Total Inspections</th><th scope="col">Compliance Rate</th></tr>
      </thead>
      <tbody>${monthly_html}</tbody>
    </table>
  </section>
`;


const summary_html = `
  <div class="card-grid stats-cards">
    <div class="stat-card">
      <h3>Total Establishments</h3>
      <p>${total_establishments.toLocaleString()}</p>
    </div>
    <div class="stat-card">
      <h3>Distinct Categories</h3>
      <p>${unique_categories}</p>
    </div>
    <div class="stat-card">
      <h3>Distinct Cities</h3>
      <p>${unique_cities}</p>
    </div>
    <div class="stat-card">
      <h3>Compliance Rate</h3>
      <p>${compliance_rate}% ✅</p>
    </div>
    <div class="stat-card">
      <h3>Latest Inspection</h3>
      <p>${latest_inspection}</p>
    </div>
  </div>
`;




  return `
    <h2 class="view-title">📈 Statistics View</h2>
    <p class="view-description">
        Summary metrics and insights from Prince George’s County restaurant inspections.
    </p>
    ${summary_html}

  <div class="stats-grid">
    <section class="stats-section">
      <h3>Top 10 Categories</h3>
      <table class="restaurant-table" aria-label="Top categories">
        <thead>
          <tr><th>Category</th><th>Count</th></tr>
        </thead>
        <tbody>${category_html}</tbody>
      </table>
    </section>

    <section class="stats-section">
      <h3>Top 5 Cities Inspected</h3>
      <table class="restaurant-table" aria-label="Top cities by inspections">
        <thead>
          <tr><th>Rank</th><th>City</th><th>Inspections</th></tr>
        </thead>
        <tbody>${city_html}</tbody>
      </table>
    </section>
  </div>

  ${trend_section}
`;
}

export default showStats