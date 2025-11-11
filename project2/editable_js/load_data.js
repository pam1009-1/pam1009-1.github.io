// ============================================
// DATA LOADING - Students modify this
// ============================================
/**
 * Load data from API - Students replace with their chosen endpoint
 */
async function loadData() {
  try {
    // TODO: Replace with student's chosen API
    // Examples:
    // const response = await fetch('https://data.princegeorgescountymd.gov/resource/xxxx.json');
    // const response = await fetch('https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY');
    // const data = await response.json();

    const response = await fetch("https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json?$limit=2000");
    const data = await response.json();
    console.log("data loaded", data);

    const normalized = data.map(row => ({
      name: row.name ?? "Unknown",
      category: row.category ?? "Unknown",
      city: row.city ?? "N/A",
      zip: row.zip ?? "N/A",
      inspectionDate: row.inspection_date ?? null,
      inspectionResults: row.inspection_results ?? "N/A",
      inspectionType: row.inspection_type ?? "N/A",
      owner: row.owner ?? "N/A",
      address1: row.address_line_1 ?? "N/A",
      address2: row.address_line_2 ?? "",
    }));

    return normalized;
    
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // return mockRestaurantData;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from API");
  }
}

export default loadData