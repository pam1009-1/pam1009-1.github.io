/**
 * TABLE VIEW
 * Columns: Name, Category, City, Last Inspection, Result
 */
function showTable(data) {
  const safe = (v) => (v == null || v === "" || v === "------" ? "N/A" : v);

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "N/A" : d.toISOString().slice(0, 10);
  };

  const getBadge = (result) => {
    const r = (result || "").toLowerCase().trim();
    if (!r || r === "------") return "To be inspected";

    const ok = ["outstanding", "excellent", "superior", "completed", "no health risk"];
    const warn = ["non-compliant", "violations", "reopen", "re-open"];

    if (ok.some(k => r.includes(k))) return "✅ Compliant";
    if (warn.some(k => r.includes(k))) return "⚠️ Non-Compliant";
    return result; 
  };

  const byKey = {};
  data.forEach(r => {
    const name = r?.name || "";
    const addr = r?.address1 || "";
    if (!name) return;
    const key = `${name}__${addr}`;
    const curr = byKey[key];
    if (!curr) {
      byKey[key] = r;
    } else {
      const d1 = curr.inspectionDate ? String(curr.inspectionDate) : "";
      const d2 = r.inspectionDate ? String(r.inspectionDate) : "";
      if (d2 > d1) byKey[key] = r; 
    }
  });
  const unique = Object.values(byKey);

  
  unique.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const head = /*html*/ `
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Category</th>
        <th scope="col">City</th>
        <th scope="col">Last Inspection</th>
        <th scope="col">Result</th>
        <th scope="col" class="hide-col">ZIP</th>
        <th scope="col" class="hide-col">Address</th>
        <th scope="col" class="hide-col">Owner</th>
      </tr>
    </thead>
  `;

  const rows = unique.map(r => /*html*/ `
    <tr>
      <td>${safe(r.name)}</td>
      <td>${safe(r.category)}</td>
      <td>${safe(r.city)}</td>
      <td>${formatDate(r.inspectionDate)}</td>
      <td>${getBadge(r.inspectionResults)}</td>
      <td class="hide-col">${safe(r.zip)}</td>
      <td class="hide-col">${safe(r.address1)}</td>
      <td class="hide-col">${safe(r.owner)}</td>
    </tr>
  `).join("");

  return /*html*/ `
    <h2 class="view-title">Dataset</h2>
    <p class="view-description">The lateset inspection record for each restruant</p>
    <table class="restaurant-table" aria-label="Establishments and inspection results">
      ${head}
      <tbody>${rows}</tbody>
    </table>
  `;
}

export default showTable;
