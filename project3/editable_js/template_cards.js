function showCards(data) {
  const safe = (v) =>
    v == null || v === "" || v === "------" ? "N/A" : v;

  const shortDate = (iso) => {
    if (!iso) return "";
    return typeof iso === "string" && iso.length >= 10
      ? iso.slice(0, 10)
      : String(iso);
  };

  const getBadge = (result) => {
    const raw = (result || "").toLowerCase().trim();
    if (!raw || raw === "------") return "To be inspected";
    const ok = ["outstanding", "excellent", "superior", "completed", "no health risk"];
    const warn = ["non-compliant", "violations", "reopen", "re-open"];
    if (ok.some((k) => raw.includes(k))) return "✅ Compliant";
    if (warn.some((k) => raw.includes(k))) return "⚠️ Non-Compliant";
    return "—";
  };

  // ==========================================
  // DEDUPE restaurants
  // ==========================================
  const byKey = {};
  data.forEach((r) => {
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

  let unique = Object.values(byKey);

  // ==========================================
  // SORT newest 
  // ==========================================
  unique.sort((a, b) => {
    const d1 = a.inspectionDate ? new Date(a.inspectionDate) : 0;
    const d2 = b.inspectionDate ? new Date(b.inspectionDate) : 0;
    return d2 - d1;
  });

  const totalCount = unique.length;
  const MAX_CARDS = 60;
  unique = unique.slice(0, MAX_CARDS);

  // ==========================================
  // CLEAN CITY OPTIONS 
  // ==========================================
  const cityOptions = Array.from(
    new Map(
      data
        .map((r) => r.city)
        .filter((c) => c && c !== "N/A")
        .map((c) => {
          const normalized = String(c).trim();
          const key = normalized.toLowerCase();
          const label = normalized
            .toLowerCase()
            .replace(/\b\w/g, (ch) => ch.toUpperCase()); // title case
          return [key, label];
        })
    ).values()
  ).sort();

  // ==========================================
  // BUILD CARD HTML
  // ==========================================
  const cardHTML = unique
    .map((restaurant) => {
      const name = safe(restaurant.name);
      const category = safe(restaurant.category);
      const city = safe(restaurant.city);
      const last = shortDate(restaurant.inspectionDate);
      const badge = getBadge(restaurant.inspectionResults);
      const owner = safe(restaurant.owner);
      const address = safe(restaurant.address1);

      return `
        <article 
          class="restaurant-card"
          data-name="${name}"
          data-city="${city}"
        >
          <h3>${name}</h3>

          <p class="card-brief">
            ${city !== "N/A" ? city : ""}
            ${city !== "N/A" && category !== "N/A" ? " • " : ""}
            ${category !== "N/A" ? category : ""}
          </p>

          ${last ? `<p class="card-brief">${last}</p>` : ""}
          ${badge && badge !== "—" ? `<p class="card-brief">${badge}</p>` : ""}

          <button class="card-toggle" type="button" aria-expanded="false">
            Details
          </button>

          <div class="card-extra" aria-hidden="true">
            ${
              address !== "N/A"
                ? `<p><strong>Address:</strong> ${address}</p>`
                : ""
            }
            ${
              owner !== "N/A"
                ? `<p><strong>Owner:</strong> ${owner}</p>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  // ==========================================
  // RETURN FINAL HTML
  // ==========================================
  return `
    <h2 class="view-title">Discover</h2>

    <div class="filters">
      <input
        id="card-search"
        type="text"
        placeholder="Search by name or city..."
        class="filter-input"
      />

      <select id="city-filter" class="filter-select">
        <option value="">All Cities</option>
        ${cityOptions
          .map((city) => `<option value="${city}">${city}</option>`)
          .join("")}
      </select>
    </div>

    <p id="card-summary" class="view-description">
      Showing <strong>${unique.length}</strong> of <strong>${totalCount}</strong> restaurants
      (sorted by latest inspection date)
    </p>

    <div id="card-container" class="card-grid">
      ${cardHTML}
    </div>
  `;
}

export default showCards;
