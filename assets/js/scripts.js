/**
 * Minimal JavaScript for interactivity only
 * No content rendering - all content is pre-rendered at build time
 */

// Theme management
(function initializeTheme() {
	const themeButton = document.getElementById('themeBtn');
	const themeIcon = document.getElementById('themeIcon');
	const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	let currentTheme = localStorage.getItem('theme') || systemPreference;

	// Apply theme
	document.body.setAttribute('data-theme', currentTheme);
	updateThemeIcon(currentTheme);

	// Theme toggle listener
	themeButton?.addEventListener('click', () => {
		currentTheme = currentTheme === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', currentTheme);
		localStorage.setItem('theme', currentTheme);
		updateThemeIcon(currentTheme);
	});

	// System preference change listener
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			currentTheme = e.matches ? 'dark' : 'light';
			document.body.setAttribute('data-theme', currentTheme);
			updateThemeIcon(currentTheme);
		}
	});

	function updateThemeIcon(theme) {
		const themeIcon = document.getElementById('themeIcon');
		if (!themeIcon) return;

		if (theme === 'light') {
			// Show moon icon for dark mode toggle
			themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
		} else {
			// Show sun icon for light mode toggle
			themeIcon.innerHTML =
				'<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M7 12a5 5 0 1 0 10 0a5 5 0 0 0-10 0z"/>';
		}
	}
})();

// Privacy modal toggle (global function to match existing HTML)
function togglePrivacy() {
	const modal = document.getElementById('privacy-modal');
	if (!modal) return;

	const isOpen = modal.style.display !== 'none';
	modal.style.display = isOpen ? 'none' : 'block';

	if (!isOpen) {
		// Close on background click
		modal.onclick = function (e) {
			if (e.target === modal) {
				togglePrivacy();
			}
		};
	}
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
	const privacyModal = document.getElementById('privacy-modal');
	if (e.key === 'Escape' && privacyModal && privacyModal.style.display !== 'none') {
		togglePrivacy();
	}
});

// Make togglePrivacy available globally for inline onclick handlers
window.togglePrivacy = togglePrivacy;

console.log('✨ Minimal JS loaded - Theme and modal interactivity enabled');

