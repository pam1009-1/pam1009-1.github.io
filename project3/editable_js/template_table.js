/**
 * TABLE VIEW with pagination
 * Columns: Name, Category, City, Last Inspection, Result, Address, Owner
 */
function showTable(data, page = 1, perPage = 120) {
  const safe = (v) =>
    v == null || v === "" || v === "------" ? "N/A" : v;

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

    if (ok.some((k) => r.includes(k))) return "✅ Compliant";
    if (warn.some((k) => r.includes(k))) return "⚠️ Non-Compliant";
    return result;
  };

  // Deduplicate by name + address, keep latest inspection
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

  // Sort alphabetically by name
  unique.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const totalCount = unique.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  // clamp page
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const pageItems = unique.slice(startIndex, startIndex + perPage);
  const shownCount = pageItems.length;

  const head = /*html*/ `
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Category</th>
        <th scope="col">City</th>
        <th scope="col">Last Inspection</th>
        <th scope="col">Result</th>
        <th scope="col" class="hide-col">Address</th>
        <th scope="col" class="hide-col">Owner</th>
      </tr>
    </thead>
  `;

  const rows = pageItems
    .map(
      (r) => /*html*/ `
      <tr>
        <td>${safe(r.name)}</td>
        <td>${safe(r.category)}</td>
        <td>${safe(r.city)}</td>
        <td>${formatDate(r.inspectionDate)}</td>
        <td>${getBadge(r.inspectionResults)}</td>
        <td class="hide-col">${safe(r.address1)}</td>
        <td class="hide-col">${safe(r.owner)}</td>
      </tr>
    `
    )
    .join("");

  const startLabel = totalCount === 0 ? 0 : startIndex + 1;
  const endLabel = startIndex + shownCount;

  return /*html*/ `
    <h2 class="view-title">Dataset</h2>
    <p class="view-description">
      Latest inspection record for each restaurant.
      Showing <strong>${startLabel}–${endLabel}</strong> of
      <strong>${totalCount}</strong> locations.
    </p>

    <div class="table-wrap">
      <table class="restaurant-table" aria-label="Establishments and inspection results">
        ${head}
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="table-pagination">
      <button
        type="button"
        class="page-btn"
        onclick="changeTablePage(${currentPage - 1})"
        ${currentPage === 1 ? "disabled" : ""}
      >
        ◀ Previous
      </button>

      <span class="page-info">
        Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong>
      </span>

      <button
        type="button"
        class="page-btn"
        onclick="changeTablePage(${currentPage + 1})"
        ${currentPage === totalPages ? "disabled" : ""}
      >
        Next ▶
      </button>
    </div>
  `;
}

export default showTable;
