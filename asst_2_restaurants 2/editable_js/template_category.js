/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function showCategories(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Group data by a meaningful category (cuisine, neighborhood, price, etc.)
  // - Show items within each group
  // - Make relationships between groups clear
  // - Consider showing group statistics
  /*html*/
  const clean = (v) => (!v || v === "------" ? "N/A" : v);

    const formatDate = (iso) => {
      if (!iso) return "N/A";
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? "N/A" : d.toISOString().slice(0, 10);  
    };

    const getBadge = (result) => {
      const r = (result || "").toLowerCase().trim();

      const rules = [
        { keywords: ["outstanding", "excellent", "superior", "completed", "no health risk"], badge: "✅ Compliant" },
        { keywords: ["non-compliant", "violations", "reopen", "re-open"], badge: "⚠️ Non-Compliant" },
      ];

      let chosenBadge = null;
      rules.forEach(rule => {
        rule.keywords.forEach(keyword => {
          if (r.includes(keyword)) chosenBadge = rule.badge;
        });
      });

      return chosenBadge || "❓ To be inspected";
    };

    const ALLOWED = [
      "Fast Food", "Bakery", "Bar/Tavern/Lounge", "Carry-out", "Coffee Shop",
      "College/University", "Convenience Store", "Deli", "Diet/Nutrition Site",
      "Full Service", "Grocery Store", "Health Care Facility", "Hotel",
      "Ice Cream", "Meat/Poultry Market", "Restaurant", "Seafood"
    ];
    const ALLOWED_SET = new Set(ALLOWED.map(s => s.toLowerCase()));

    const normalized_category = (raw) => {
      const s = (raw || "")
        .replace(/^@/, "")  
        .replace(/-Do Not Use/i, "")
        .trim();

        if (s.toLowerCase().includes("fast food")) return "Fast Food";

        const lower = s.toLowerCase();
        for (const allowed of ALLOWED) {
          if (allowed.toLowerCase()===lower) return allowed;
        }
        return s || "N/A"
    };

    const filtered = data
      .map(item => ({ ...item, __cat: normalized_category(item.category) }))
      .filter(item => ALLOWED_SET.has(item.__cat.toLowerCase()));

    const key_for = (it) =>
      `${(it.__cat||"").toLowerCase()}||${(it.name||"").trim().toLowerCase()}||${(it.address1||"").trim().toLowerCase()}||${(it.zip||"").trim()}`;

    const time_of = (it) => {
      const t = new Date(it?.inspectionDate).getTime();
      return Number.isNaN(t) ? -Infinity : t;
    };

    const latest_by_key = new Map();
    filtered.forEach(it => {
      const k = key_for(it);
      const prev = latest_by_key.get(k);
      if (!prev || time_of(it) > time_of(prev)) {
        latest_by_key.set(k, it);
      }
    });

    const deduped = Array.from(latest_by_key.values());

    const groups = new Map();
    deduped.forEach(it => {
      const key = it.__cat;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    });

    
    const sorted_categories = Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
  
    const sections = sorted_categories.map(([category, items]) => {
      const sorted_items = items.slice().sort((a, b) => clean(a.name).localeCompare(clean(b.name)));
        const list = sorted_items.map(r => `
          <div class='category-item'>
            <div>
              <div><strong>${clean(r.name)}</strong></div>
              <div>${clean(r.city)}${r.zip && r.zip !== "N/A" ? `, ${r.zip}` : ""}</div>
              <div class="text-sm">Last inspection: ${formatDate(r.inspectionDate)}</div>
            </div>
            <div>${getBadge(r.inspectionResults)}</div>
          </div>
        `).join("");

        return `
          <section class="category-section">
            <h3 class="category-header">${category} (${items.length})</h3>
            <div class="category-items">
              ${list}
            </div>
          </section>
        `;
      }).join("");

 
  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">Grouped by establishment category with quick status badges.</p>
    ${sections}
  `;
}

export default showCategories;