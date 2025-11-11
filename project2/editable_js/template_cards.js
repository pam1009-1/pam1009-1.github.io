/**
 * CARD VIEW
 * Col: name, category, address, city, inspectionDate, inspectionResults, owner
 */
function showCards(data) {
  const safe = (v) => (v == null || v === "" || v === "------" ? "N/A" : v);

  // Convert to comparable string safely (ISO-like dates compare lexicographically)
  const shortDate = (iso) => {
    if (!iso) return "";
    return typeof iso === "string" && iso.length >= 10 ? iso.slice(0, 10) : String(iso);
  };

  // Badge from inspectionResults
  const getBadge = (result) => {
    const raw = (result || "").toLowerCase().trim();
    if (!raw || raw === "------") return "To be inspected";
    const ok = ["outstanding", "excellent", "superior", "completed", "no health risk"];
    const warn = ["non-compliant", "violations", "reopen", "re-open"];
    if (ok.some(k => raw.includes(k))) return "✅ Compliant";
    if (warn.some(k => raw.includes(k))) return "⚠️ Non-Compliant";
    return "—";
  };


  const byKey = {};
  data.forEach(r => {
    const name = r?.name || "";
    const addr = r?.address1 || "";
    if (!name) return;
    const key = `${name}__${addr}`; // safer than name alone
    const curr = byKey[key];
    if (!curr) {
      byKey[key] = r;
    } else {
      const d1 = curr.inspectionDate ? String(curr.inspectionDate) : "";
      const d2 = r.inspectionDate ? String(r.inspectionDate) : "";
      if (d2 > d1) byKey[key] = r; // ISO-like string compare
    }
  });
  const unique = Object.values(byKey);

  const cardHTML = unique
    .map((restaurant) => {
      const name = safe(restaurant.name);
      const category = safe(restaurant.category);
      const city = safe(restaurant.city);
      const last = shortDate(restaurant.inspectionDate);
      const badge = getBadge(restaurant.inspectionResults);
      const owner = safe(restaurant.owner);
      const address = safe(restaurant.address1);

      // Summary line is concise; details behind a toggle
      const parts = [];
      if (city !== "N/A") parts.push(city);
      if (category !== "N/A") parts.push(category);
      if (last) parts.push(last);
      if (badge !== "—") parts.push(badge);
      const summary = parts.join(" • ");

      return /*html*/ `
        <article class="restaurant-card">
          <h3>${name}</h3>
  
          <p class="card-brief">
          ${city !== "N/A" ? city : ""}
          ${city !== "N/A" && category !== "N/A" ? " • " : ""}
          ${category !== "N/A" ? category : ""}
          </p>

          ${last ? `<p class="card-brief">${last}</p>` : ""}

          ${badge && badge !== "—" ? `<p class="card-brief">${badge}</p>` : ""}

          <button class="card-toggle" type="button" aria-expanded="false">Details</button>

          <div class="card-extra" aria-hidden="true">
          ${address !== "N/A" ? `<p><strong>Address:</strong> ${address}</p>` : ""}
          ${owner !== "N/A" ? `<p><strong>Owner:</strong> ${owner}</p>` : ""}
          </div>
        </article>

      `;
    })
    .join("");

  return /*html*/ `
    <h2 class="view-title">Discover</h2>
    <p class="view-description">Browse restaurants and more details</p>
    <div class="card-grid">
      ${cardHTML}
    </div>
  `;
}

export default showCards;
