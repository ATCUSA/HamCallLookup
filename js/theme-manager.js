// Theme Manager: Handles theme switching and preferences
import { getElement } from './ui-controller.js';
import { updateMapTheme } from './map-handler.js';

// Theme constants
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';
const STORAGE_KEY_THEME = 'darkMode';
const DEFAULT_THEME = true; // Set dark mode as default

// Initialize theme from storage
export function initTheme() {
    try {
        chrome.storage.local.get(STORAGE_KEY_THEME, function (data) {
            // Apply theme based on stored preference or default to dark mode if not set
            const isDarkMode = data.darkMode !== undefined ? data.darkMode : DEFAULT_THEME;
            applyTheme(isDarkMode);

            console.log(`Theme Manager: Initialized theme (dark mode: ${isDarkMode})`);
        });
    } catch (error) {
        console.error('Theme Manager: Error initializing theme', error);
        // Default to dark theme on error
        applyTheme(DEFAULT_THEME);
    }
}

// Toggle between light and dark themes
export function toggleTheme() {
    try {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
        const isDarkMode = currentTheme === THEME_DARK;

        // Toggle to opposite theme
        const newIsDarkMode = !isDarkMode;

        // Apply the new theme
        applyTheme(newIsDarkMode);

        // Save the new theme preference
        saveThemePreference(newIsDarkMode);

        // Update map theme if needed
        updateMapTheme();

        console.log(`Theme Manager: Toggled theme to ${newIsDarkMode ? 'dark' : 'light'} mode`);
    } catch (error) {
        console.error('Theme Manager: Error toggling theme', error);
    }
}

// Apply theme to UI
export function applyTheme(isDarkMode) {
    try {
        // Set theme attribute on document
        document.documentElement.setAttribute('data-theme', isDarkMode ? THEME_DARK : THEME_LIGHT);

        // Update theme toggle button
        const themeToggleBtn = getElement('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
            themeToggleBtn.title = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    } catch (error) {
        console.error('Theme Manager: Error applying theme', error);
    }
}

// Save theme preference to storage
function saveThemePreference(isDarkMode) {
    try {
        chrome.storage.local.set({ [STORAGE_KEY_THEME]: isDarkMode }, function () {
            console.log(`Theme Manager: Saved theme preference (dark mode: ${isDarkMode})`);
        });
    } catch (error) {
        console.error('Theme Manager: Error saving theme preference', error);
    }
}