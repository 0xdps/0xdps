// Resume-specific JavaScript to populate content from JSON data

function createResumeChip(text) {
	return `<span class="tech-chip">${text}</span>`;
}

async function populateResumeContent() {
	console.log("Populating resume content...");

	// Load site data from JSON
	const siteData = await ensureSiteDataLoaded();
	if (!siteData) {
		console.error("siteData is not available!");
		return;
	}

	// Populate personal information
	const { personal } = siteData;
	const nameEl = document.querySelector(".personal-name");
	const titleEl = document.querySelector(".personal-title");
	const descriptionEl = document.querySelector(".personal-description");
	const locationEl = document.querySelector(".personal-location");
	const emailEl = document.querySelector(".contact-email");
	const phoneEl = document.querySelector(".contact-phone");

	if (nameEl) nameEl.textContent = personal.name;
	if (titleEl) titleEl.textContent = personal.title;
	if (descriptionEl) descriptionEl.textContent = personal.description;
	if (locationEl)
		locationEl.textContent = personal.location.replace(
			" • Vegetarian • Loves clear diagrams & concise explanations",
			""
		);
	if (emailEl) {
		emailEl.textContent = personal.email;
		emailEl.href = `mailto:${personal.email}`;
	}
	if (phoneEl) {
		phoneEl.textContent = personal.phone;
		phoneEl.href = `tel:${personal.phone}`;
	}

	// Populate about section (Professional Summary)
	const aboutContainer = document.getElementById("about-summary");
	if (aboutContainer && siteData.about) {
		aboutContainer.innerHTML = `
			<div>
				${siteData.about.description
					.slice(0, 2)
					.map((para) => `<p class="description">${para}</p>`)
					.join("")}
			</div>
		`;
	}

	// Populate experience section
	const experienceContainer = document.getElementById("experience-resume");
	if (experienceContainer && siteData.experience) {
		experienceContainer.innerHTML = siteData.experience.items
			.map(
				(job) => `
			<div class="resume-item">
				<h3>${job.role}</h3>
				<div class="meta">
					<strong>${job.company}</strong> | ${job.period}
				</div>
				<div class="resume-tech">
					${job.technologies.map((tech) => createResumeChip(tech)).join("")}
				</div>
				<ul>
					${job.achievements
						.slice(0, 3)
						.map((achievement) => `<li>${achievement}</li>`)
						.join("")}
				</ul>
			</div>
		`
			)
			.join("");
	}

	// Populate projects section
	const projectsContainer = document.getElementById("projects-resume");
	if (projectsContainer && siteData.projects) {
		projectsContainer.innerHTML = siteData.projects.items
			.map(
				(project) => `
			<div class="resume-item">
				<h3>${project.title}</h3>
				<div class="resume-tech">
					${project.technologies.map((tech) => createResumeChip(tech)).join("")}
				</div>
				<p class="description">${project.description}</p>
				<p class="description"><strong>Key Results:</strong> ${project.achievements}</p>
			</div>
		`
			)
			.join("");
	}

	// Populate skills
	const techSkillsContainer = document.getElementById("tech-skills");
	const interestSkillsContainer = document.getElementById("interest-skills");

	if (techSkillsContainer && siteData.about) {
		techSkillsContainer.innerHTML = siteData.about.technologies.map((tech) => createResumeChip(tech)).join("");
	}

	if (interestSkillsContainer && siteData.about) {
		interestSkillsContainer.innerHTML = siteData.about.interests.map((interest) => createResumeChip(interest)).join("");
	}

	// Populate education
	const educationContainer = document.getElementById("education-resume");
	if (educationContainer && siteData.education) {
		educationContainer.innerHTML = `
			<div>
				<strong>${siteData.education.degree}</strong><br>
				${siteData.education.institution} | ${siteData.education.period}<br>
				CGPA: ${siteData.education.grade}
			</div>
		`;
	}

	console.log("Resume content populated successfully");
}

// Initialize when DOM is ready
async function initializeResume() {
	await populateResumeContent();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeResume);
} else {
	initializeResume();
}

// Add print functionality
function generatePDF() {
	window.print();
}

// Add a print button (optional)
function addPrintButton() {
	const printButton = document.createElement("button");
	printButton.textContent = "Generate PDF";
	printButton.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1000;
		padding: 10px 20px;
		background: #14b8a6;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: 500;
	`;
	printButton.className = "hide-in-print";
	printButton.onclick = generatePDF;

	document.body.appendChild(printButton);
}

// Add print button when page loads
document.addEventListener("DOMContentLoaded", addPrintButton);
