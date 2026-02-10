// Theme Toggle Component
// Provides dark/light mode switching with system preference detection

const THEME_KEY = 'fit-track-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Initialize theme based on saved preference or system preference
 */
export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? DARK_THEME : LIGHT_THEME);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    });
}

/**
 * Set the theme
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update any theme toggle buttons
    updateToggleIcons(theme);
}

/**
 * Toggle between dark and light themes
 * @returns {string} The new theme
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
    return newTheme;
}

/**
 * Get the current theme
 * @returns {string} Current theme
 */
export function getTheme() {
    return document.documentElement.getAttribute('data-theme') || DARK_THEME;
}

/**
 * Update toggle button icons based on current theme
 * @param {string} theme 
 */
function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle');

    toggleBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            if (theme === DARK_THEME) {
                icon.className = 'fa-solid fa-sun';
                btn.setAttribute('title', 'Switch to light mode');
            } else {
                icon.className = 'fa-solid fa-moon';
                btn.setAttribute('title', 'Switch to dark mode');
            }
        }
    });
}

/**
 * Create and insert a theme toggle button
 * @param {HTMLElement} container - The container to insert the button into
 * @returns {HTMLButtonElement} The toggle button
 */
export function createThemeToggle(container) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost btn-icon theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle theme');

    const currentTheme = getTheme();
    btn.innerHTML = currentTheme === DARK_THEME
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    btn.title = currentTheme === DARK_THEME ? 'Switch to light mode' : 'Switch to dark mode';

    btn.addEventListener('click', toggleTheme);

    if (container) {
        container.appendChild(btn);
    }

    return btn;
}

// Auto-initialize theme on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
}
