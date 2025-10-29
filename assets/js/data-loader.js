// Data loader for site content from JSON
let siteData = null;

// Function to load JSON data
async function loadSiteData() {
	try {
		const response = await fetch("./data/site-data.json");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		siteData = await response.json();
		console.log("Site data loaded successfully");
		return siteData;
	} catch (error) {
		console.error("Error loading site data:", error);
		// Fallback: try relative path
		try {
			const response = await fetch("../data/site-data.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			siteData = await response.json();
			console.log("Site data loaded successfully (fallback path)");
			return siteData;
		} catch (fallbackError) {
			console.error("Error loading site data (fallback):", fallbackError);
			return null;
		}
	}
}

// Function to ensure data is loaded before using it
async function ensureSiteDataLoaded() {
	if (!siteData) {
		await loadSiteData();
	}
	return siteData;
}

// Export for use in other scripts
window.loadSiteData = loadSiteData;
window.ensureSiteDataLoaded = ensureSiteDataLoaded;
