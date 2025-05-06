// Storage Manager: Handles Chrome storage operations
import { updateHistoryDisplay } from './ui-controller.js';

// Maximum number of history items to store
const MAX_HISTORY_ITEMS = 10;

// Current search history
let searchHistory = [];

// Load history from Chrome storage
export function loadHistory() {
    try {
        chrome.storage.local.get('searchHistory', function (data) {
            if (data.searchHistory) {
                searchHistory = data.searchHistory;

                // Update UI with loaded history
                updateHistoryDisplay(searchHistory);

                console.log(`Storage Manager: Loaded ${searchHistory.length} history items`);
            } else {
                console.log('Storage Manager: No history found in storage');
                // Initialize empty history
                searchHistory = [];
                updateHistoryDisplay(searchHistory);
            }
        });
    } catch (error) {
        console.error('Storage Manager: Error loading history', error);
        // Fallback to empty history
        searchHistory = [];
        updateHistoryDisplay(searchHistory);
    }

    // Make clearSearchHistory available globally
    window.clearSearchHistory = clearSearchHistory;
}

// Save history to Chrome storage
export function saveHistory() {
    try {
        chrome.storage.local.set({ 'searchHistory': searchHistory }, function () {
            // Update UI with saved history
            updateHistoryDisplay(searchHistory);

            console.log(`Storage Manager: Saved ${searchHistory.length} history items`);
        });
    } catch (error) {
        console.error('Storage Manager: Error saving history', error);
    }
}

// Add a callsign to the history
export function addToHistory(callsign, operatorName) {
    try {
        // Don't add if callsign is empty
        if (!callsign) return;

        // Remove duplicate if exists
        searchHistory = searchHistory.filter(item => item.callsign !== callsign);

        // Add new item at the beginning
        searchHistory.unshift({
            callsign: callsign,
            operator: operatorName || '',
            timestamp: new Date().toISOString()
        });

        // Limit history to maximum items
        if (searchHistory.length > MAX_HISTORY_ITEMS) {
            searchHistory = searchHistory.slice(0, MAX_HISTORY_ITEMS);
        }

        // Save updated history
        saveHistory();

        console.log(`Storage Manager: Added ${callsign} to history`);
    } catch (error) {
        console.error('Storage Manager: Error adding to history', error);
    }
}

// Clear the search history
export function clearSearchHistory() {
    try {
        searchHistory = [];
        saveHistory();

        console.log('Storage Manager: History cleared');
    } catch (error) {
        console.error('Storage Manager: Error clearing history', error);
    }
}

// Get the current search history
export function getSearchHistory() {
    return searchHistory;
}