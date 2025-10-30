
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality
  /*html*/ 
    const clean = (v) => (!v || v === "------" ? "N/A" : v);
    const DateFormat = (iso) => {
        if (!iso) return "N/A";
        const d = new Date(iso);
        return Number.isNaN(d.getTime()) ? "N/A" : d.toISOString().slice(0, 10);  
    };

    const getBadge = (result) => {
        const r = (result || "").toLowerCase().trim();

        const rules = [
            {
                keywords: ["outstanding", "excellent", "superior", "completed", "no health risk"],
                badge: "✅ Compliant",
            },
            {
                keywords: ["non-compliant", "violations", "reopen", "re-open"],
                badge: "⚠️ Non-Compliant",
            },
        ];

        let chosenBadge = null;

        rules.forEach(rule => {
            rule.keywords.forEach(keyword => {
                if (r.includes(keyword)) {
                    chosenBadge = rule.badge;
                }
            });
        });
        return chosenBadge || "❓ To be inspected";
    };

const rows = data.map((r) => `
    <tr>
        <td>${clean(r.name)}</td>
        <td>${clean(r.category)}</td>
        <td>${clean(r.city)}</td>
        <td>${clean(r.zip)}</td>
        <td>${getBadge(r.inspectionResults)}</td>
        <td>${DateFormat(r.inspectionDate)}</td>
    <tr>
`).join("");

  return `
                <h2 class="view-title">📊 Table View</h2>
                <table class = "restaurant-table" aria-label="Establishments and inspection results">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th scope="col">Category</th>
                            <th>City</th>
                            <th>ZIP</th>
                            <th>Result</th>
                            <th>Last Inspection</th>
                            </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                `;
}

export default showTable;