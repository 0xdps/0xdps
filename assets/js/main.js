// Theme management
function initializeTheme() {
	const themeButton = document.getElementById("themeBtn");
	const themeIcon = document.getElementById("themeIcon");
	const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	let currentTheme = localStorage.getItem("theme") || systemPreference;

	// Apply theme
	document.body.setAttribute("data-theme", currentTheme);
	updateThemeIcon(currentTheme);

	// Theme toggle listener
	themeButton?.addEventListener("click", () => {
		currentTheme = currentTheme === "light" ? "dark" : "light";
		document.body.setAttribute("data-theme", currentTheme);
		localStorage.setItem("theme", currentTheme);
		updateThemeIcon(currentTheme);
	});

	// System preference change listener
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
		if (!localStorage.getItem("theme")) {
			currentTheme = e.matches ? "dark" : "light";
			document.body.setAttribute("data-theme", currentTheme);
			updateThemeIcon(currentTheme);
		}
	});
}

function updateThemeIcon(theme) {
	const themeIcon = document.getElementById("themeIcon");
	if (!themeIcon) return;

	if (theme === "light") {
		// Show moon icon for dark mode toggle
		themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
	} else {
		// Show sun icon for light mode toggle
		themeIcon.innerHTML =
			'<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M7 12a5 5 0 1 0 10 0a5 5 0 0 0-10 0z"/>';
	}
}

// Modal management
function setupModals() {
	const privacyModal = document.getElementById("privacy-modal");
	const openPrivacyBtn = document.querySelector('[onclick="togglePrivacy()"]');

	if (!privacyModal) return;

	// ESC key to close modal
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && privacyModal.style.display !== "none") {
			togglePrivacy();
		}
	});
}

// Privacy modal toggle (global function to match existing HTML)
function togglePrivacy() {
	const modal = document.getElementById("privacy-modal");
	if (!modal) return;

	const isOpen = modal.style.display !== "none";
	modal.style.display = isOpen ? "none" : "block";

	if (!isOpen) {
		// Close on background click
		modal.onclick = function (e) {
			if (e.target === modal) {
				togglePrivacy();
			}
		};
	}
}

// Content rendering functions
function renderPersonalInfo() {
	const { personal } = siteData;

	// Update logo
	const logo = document.querySelector(".logo");
	if (logo) logo.textContent = personal.logo;

	// Update name and title in header
	const nameEl = document.querySelector(".brand > div > div:first-child");
	const titleEl = document.querySelector(".brand > div > div:last-child");
	if (nameEl) nameEl.textContent = personal.name;
	if (titleEl) titleEl.textContent = personal.title;

	// Update hero section
	const heroTitle = document.querySelector("h1");
	const heroDescription = document.querySelector(".lead");
	const heroLocation = document.querySelector(".hero-left > div:last-child");

	if (heroTitle) heroTitle.textContent = personal.tagline;
	if (heroDescription) heroDescription.textContent = personal.description;
	if (heroLocation) heroLocation.textContent = personal.location;

	// Update contact information
	const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
	emailLinks.forEach((link) => {
		link.href = `mailto:${personal.email}`;
		if (link.textContent.includes("@") || link.id === "privacy-email-link") {
			link.textContent = personal.email;
		}
	});

	const resumeLinks = document.querySelectorAll('a[href*="resume"], a[href*="Resume"]');
	resumeLinks.forEach((link) => {
		link.href = personal.resumeUrl;
	});
}

function renderSocialLinks() {
	const { socialLinks } = siteData;

	const socialsContainer = document.querySelector(".socials");
	if (!socialsContainer) return;

	socialsContainer.innerHTML = socialLinks
		.map((link) => {
			const icon = getSocialIcon(link.icon);
			return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}" aria-label="${link.name}" style="text-decoration: none">${icon}</a>`;
		})
		.join("");
}

function getSocialIcon(iconName) {
	const icons = {
		linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
		github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
		twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
		medium: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
	};
	return icons[iconName] || "";
}

// Make togglePrivacy available globally for existing HTML
window.togglePrivacy = togglePrivacy;

// Template cloning utilities
function cloneTemplate(templateId) {
	const template = document.getElementById(templateId);
	if (!template) {
		console.error(`Template ${templateId} not found`);
		return null;
	}
	return template.cloneNode(true);
}

function populateElement(element, data, fieldName) {
	const targetElement = element.querySelector(`[data-field="${fieldName}"]`);
	if (targetElement) {
		if (fieldName === "icon") {
			targetElement.innerHTML = data;
		} else {
			targetElement.textContent = data;
		}
	}
}

function populateElementAttribute(element, data, fieldName, attribute) {
	const targetElement = element.querySelector(`[data-field="${fieldName}"]`);
	if (targetElement) {
		targetElement.setAttribute(attribute, data);
	}
}

function createChip(text) {
	return `<span class="tech-chip">${text}</span>`;
}

// Content population using template cloning
function populateSections() {
	console.log("populateSections called, siteData available:", typeof siteData !== "undefined");

	if (typeof siteData === "undefined") {
		console.error("siteData is not available!");
		return;
	}

	populateServicesSection();
	populateAboutSection();
	populateProjectsSection();
	populateSideProjectsSection();
	populateExperienceSection();
}

function populateServicesSection() {
	const servicesContainer = document.getElementById("services-container");
	if (!servicesContainer || !siteData.services) return;

	// Clone the services template
	const servicesSection = cloneTemplate("services-template");
	if (!servicesSection) return;

	// Remove the template ID and make visible
	servicesSection.removeAttribute("id");
	servicesSection.style.display = "block";

	// Populate main services data
	populateElement(servicesSection, siteData.services.title, "title");
	populateElement(servicesSection, siteData.services.subtitle, "subtitle");
	populateElementAttribute(servicesSection, siteData.services.topmateUrl, "topmateUrl", "href");

	// Populate service items
	const servicesListContainer = servicesSection.querySelector('[data-field="services-container"]');
	if (servicesListContainer && siteData.services.offerings) {
		// Clear existing content
		servicesListContainer.innerHTML = "";

		siteData.services.offerings.forEach((service, index) => {
			const serviceItem = cloneTemplate("service-item-template");
			if (!serviceItem) return;

			serviceItem.removeAttribute("id");
			serviceItem.style.display = "flex";

			// Populate service item data
			populateElement(serviceItem, service.icon, "icon");
			populateElement(serviceItem, service.title, "title");
			populateElement(serviceItem, service.description, "description");

			// Add separator border for all but last item
			if (index < siteData.services.offerings.length - 1) {
				serviceItem.style.borderBottom = "1px solid var(--border)";
				serviceItem.style.paddingBottom = "12px";
				serviceItem.style.marginBottom = "12px";
			}

			servicesListContainer.appendChild(serviceItem);
		});
	}

	// Append the populated section
	servicesContainer.appendChild(servicesSection);
}

function populateAboutSection() {
	const aboutContainer = document.getElementById("about-container");
	if (!aboutContainer || !siteData.about) return;

	// Clone the about template
	const aboutSection = cloneTemplate("about-template");
	if (!aboutSection) return;

	aboutSection.removeAttribute("id");
	aboutSection.style.display = "block";

	// Populate about data
	populateElement(aboutSection, siteData.about.title, "title");
	populateElement(aboutSection, siteData.about.subtitle, "subtitle");

	// Populate description paragraphs
	const descriptionContainer = aboutSection.querySelector('[data-field="description-container"]');
	if (descriptionContainer) {
		descriptionContainer.innerHTML = siteData.about.description
			.map((para) => `<p style="margin: 0 0 16px 0; line-height: 1.6">${para}</p>`)
			.join("");
	}

	// Populate technologies
	const technologiesContainer = aboutSection.querySelector('[data-field="technologies"]');
	if (technologiesContainer) {
		technologiesContainer.innerHTML = siteData.about.technologies.map((tech) => createChip(tech)).join("");
	}

	// Populate interests
	const interestsContainer = aboutSection.querySelector('[data-field="interests"]');
	if (interestsContainer) {
		interestsContainer.innerHTML = siteData.about.interests.map((interest) => createChip(interest)).join("");
	}

	aboutContainer.appendChild(aboutSection);
}

function populateProjectsSection() {
	const projectsContainer = document.getElementById("projects-container");
	if (!projectsContainer || !siteData.projects) return;

	// Clone the projects template
	const projectsSection = cloneTemplate("projects-template");
	if (!projectsSection) return;

	projectsSection.removeAttribute("id");
	projectsSection.style.display = "block";

	// Populate projects data
	populateElement(projectsSection, siteData.projects.title, "title");
	populateElement(projectsSection, siteData.projects.subtitle, "subtitle");

	// Populate project items
	const projectsListContainer = projectsSection.querySelector('[data-field="projects-container"]');
	if (projectsListContainer && siteData.projects.items) {
		projectsListContainer.innerHTML = "";

		siteData.projects.items.forEach((project) => {
			const projectItem = cloneTemplate("project-item-template");
			if (!projectItem) return;

			projectItem.removeAttribute("id");
			projectItem.style.display = "block";

			// Populate project data
			populateElement(projectItem, project.title, "title");
			populateElement(projectItem, project.description, "description");
			populateElement(projectItem, `Key achievements: ${project.achievements}`, "achievements");

			// Populate technologies
			const technologiesContainer = projectItem.querySelector('[data-field="technologies"]');
			if (technologiesContainer) {
				technologiesContainer.innerHTML = project.technologies.map((tech) => createChip(tech)).join("");
			}

			projectsListContainer.appendChild(projectItem);
		});
	}

	projectsContainer.appendChild(projectsSection);
}

function populateSideProjectsSection() {
	const sideProjectsContainer = document.getElementById("side-projects-container");
	if (!sideProjectsContainer || !siteData.sideProjects) return;

	// Clone the side projects template
	const sideProjectsSection = cloneTemplate("side-projects-template");
	if (!sideProjectsSection) return;

	sideProjectsSection.removeAttribute("id");
	sideProjectsSection.style.display = "block";

	// Populate side projects data
	populateElement(sideProjectsSection, siteData.sideProjects.title, "title");
	populateElement(sideProjectsSection, siteData.sideProjects.subtitle, "subtitle");

	// Populate side project items
	const sideProjectsListContainer = sideProjectsSection.querySelector('[data-field="side-projects-container"]');
	if (sideProjectsListContainer && siteData.sideProjects.items) {
		sideProjectsListContainer.innerHTML = "";

		siteData.sideProjects.items.forEach((project) => {
			const sideProjectItem = cloneTemplate("side-project-item-template");
			if (!sideProjectItem) return;

			sideProjectItem.removeAttribute("id");
			sideProjectItem.style.display = "block";

			// Populate side project data
			populateElement(sideProjectItem, project.name, "name");
			populateElement(sideProjectItem, project.year, "year");
			populateElement(sideProjectItem, project.description, "description");

			// Populate technologies
			const technologiesContainer = sideProjectItem.querySelector('[data-field="technologies"]');
			if (technologiesContainer) {
				technologiesContainer.innerHTML = project.technologies.map((tech) => createChip(tech)).join("");
			}

			sideProjectsListContainer.appendChild(sideProjectItem);
		});
	}

	sideProjectsContainer.appendChild(sideProjectsSection);
}

function populateExperienceSection() {
	const experienceContainer = document.getElementById("experience-container");
	if (!experienceContainer || !siteData.experience) return;

	// Clone the experience template
	const experienceSection = cloneTemplate("experience-template");
	if (!experienceSection) return;

	experienceSection.removeAttribute("id");
	experienceSection.style.display = "block";

	// Populate experience data
	populateElement(experienceSection, siteData.experience.title, "title");
	populateElement(experienceSection, siteData.experience.subtitle, "subtitle");

	// Populate experience items
	const experienceListContainer = experienceSection.querySelector('[data-field="experience-container"]');
	if (experienceListContainer && siteData.experience.items) {
		experienceListContainer.innerHTML = "";

		siteData.experience.items.forEach((job) => {
			const experienceItem = cloneTemplate("experience-item-template");
			if (!experienceItem) return;

			experienceItem.removeAttribute("id");
			experienceItem.style.display = "block";

			// Populate experience data
			populateElement(experienceItem, job.role, "role");
			populateElement(experienceItem, job.company, "company");
			populateElement(experienceItem, job.period, "period");

			// Populate technologies
			const technologiesContainer = experienceItem.querySelector('[data-field="technologies"]');
			if (technologiesContainer) {
				technologiesContainer.innerHTML = job.technologies.map((tech) => createChip(tech)).join("");
			}

			// Populate achievements
			const achievementsContainer = experienceItem.querySelector('[data-field="achievements"]');
			if (achievementsContainer) {
				achievementsContainer.innerHTML = job.achievements.map((achievement) => `<li>${achievement}</li>`).join("");
			}

			experienceListContainer.appendChild(experienceItem);
		});
	}

	experienceContainer.appendChild(experienceSection);
}

// Content rendering functions
function renderPersonalInfo() {
	const { personal } = siteData;

	// Update logo
	const logo = document.querySelector(".logo");
	if (logo) logo.textContent = personal.logo;

	// Update name and title in header
	const nameEl = document.querySelector(".personal-name");
	const titleEl = document.querySelector(".personal-title");
	if (nameEl) nameEl.textContent = personal.name;
	if (titleEl) titleEl.textContent = personal.title;

	// Update hero section
	const heroTitle = document.querySelector(".personal-tagline");
	const heroDescription = document.querySelector(".personal-description");
	const heroLocation = document.querySelector(".personal-location");

	if (heroTitle) heroTitle.textContent = personal.tagline;
	if (heroDescription) heroDescription.textContent = personal.description;
	if (heroLocation) heroLocation.textContent = personal.location;

	// Update contact information
	const emailBtn = document.querySelector(".contact-email");
	const resumeBtn = document.querySelector(".contact-resume");
	if (emailBtn) {
		emailBtn.href = `mailto:${personal.email}`;
		emailBtn.textContent = "Email Me";
	}
	if (resumeBtn) {
		resumeBtn.href = personal.resumeUrl;
		resumeBtn.textContent = "Download Resume";
	}

	// Update privacy modal email link
	const privacyEmailLink = document.getElementById("privacy-email-link");
	if (privacyEmailLink) {
		privacyEmailLink.href = `mailto:${personal.email}`;
		privacyEmailLink.textContent = personal.email;
	}
}

function renderSocialLinks() {
	const { socialLinks } = siteData;

	const socialsContainer = document.querySelector(".socials");
	if (!socialsContainer) return;

	socialsContainer.innerHTML = socialLinks
		.map((link) => {
			const icon = getSocialIcon(link.icon);
			return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}" aria-label="${link.name}" style="text-decoration: none">${icon}</a>`;
		})
		.join("");
}

function getSocialIcon(iconName) {
	const icons = {
		linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
		github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
		twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
		medium: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
	};
	return icons[iconName] || "";
}

// Initialize the application
async function initializeApp() {
	console.log("initializeApp called");

	// Load site data from JSON
	const data = await ensureSiteDataLoaded();
	if (!data) {
		console.error("Failed to load site data");
		return;
	}

	// Make data globally available
	window.siteData = data;
	console.log("siteData loaded and available globally");

	initializeTheme();
	setupModals();

	// Render basic info and social links
	renderPersonalInfo();
	renderSocialLinks();

	// Populate template-based sections
	populateSections();

	// Set current year in footer
	const yearEl = document.getElementById("year");
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
		console.log("Year set to:", new Date().getFullYear());
	}

	// Set privacy policy date
	const privacyDate = document.getElementById("privacy-date");
	if (privacyDate) {
		privacyDate.textContent = new Date().toLocaleDateString();
		console.log("Privacy date set to:", new Date().toLocaleDateString());
	}

	console.log("initializeApp completed");
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeApp);
} else {
	initializeApp();
}
