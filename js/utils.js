// Utils: Utility functions for the extension
import { getElement } from './ui-controller.js';

// Convert Maidenhead grid square to latitude and longitude
// This is a fallback in case the API doesn't return coordinates
export function gridToLatLong(grid) {
    try {
        // Validate grid
        if (!grid || typeof grid !== 'string') {
            console.warn('Utils: Invalid grid square provided');
            return null;
        }

        // Convert to uppercase for consistency
        grid = grid.toUpperCase();

        // Need at least 4 characters for a valid grid square
        if (grid.length < 4) {
            console.warn('Utils: Grid square too short, need at least 4 characters');
            return null;
        }

        // First pair (field) encodes longitude
        const longitude = (((grid.charCodeAt(0) - 65) * 20) - 180) +
            ((grid.charCodeAt(2) - 48) * 2);

        // Second pair (field) encodes latitude
        const latitude = (((grid.charCodeAt(1) - 65) * 10) - 90) +
            (grid.charCodeAt(3) - 48);

        // Return center of the grid square
        return {
            lat: latitude + 0.5,
            lng: longitude + 1.0
        };
    } catch (error) {
        console.error('Utils: Error converting grid to lat/long', error);
        return null;
    }
}

// Set up link handlers for external links
export function setUpLinkHandlers() {
    try {
        // QRZ link
        const qrzLink = getElement('qrz-link');
        if (qrzLink) {
            qrzLink.addEventListener('click', (event) => {
                // Open in new tab
                chrome.tabs.create({ url: qrzLink.href });
                event.preventDefault();
            });
        }

        // Google Maps link
        const gmapsLink = getElement('gmaps-link');
        if (gmapsLink) {
            gmapsLink.addEventListener('click', (event) => {
                // Open in new tab
                chrome.tabs.create({ url: gmapsLink.href });
                event.preventDefault();
            });
        }

        console.log('Utils: Link handlers initialized');
    } catch (error) {
        console.error('Utils: Error setting up link handlers', error);
    }
}

// Helper function to sanitize HTML strings
export function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

// Helper function to safely parse JSON
export function safeJSONParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Utils: JSON parse error', error);
        return fallback;
    }
}

// Create a debounced function (for limiting frequent calls)
export function debounce(func, wait = 300) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add error handling to async functions
export function catchErrors(fn) {
    return function (...args) {
        try {
            const result = fn.apply(this, args);
            if (result instanceof Promise) {
                return result.catch(error => {
                    console.error(`Error in async function: ${fn.name}`, error);
                });
            }
            return result;
        } catch (error) {
            console.error(`Error in function: ${fn.name}`, error);
        }
    };
}