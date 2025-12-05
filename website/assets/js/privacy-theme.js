/**
 * Theme synchronization for privacy pages
 * Syncs with the main site's theme selection
 */

// Sync theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Watch for theme changes from other tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        document.documentElement.setAttribute('data-theme', e.newValue);
    }
});

// Periodically check for theme updates from localStorage
// (useful when navigating from main site to privacy page)
setInterval(() => {
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (savedTheme && savedTheme !== currentTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}, 500);

// Initialize theme on load
initTheme();

console.log('🎨 Privacy page theme sync enabled');

