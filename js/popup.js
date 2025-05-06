// Main entry point for the extension
import { initUI, setupEventListeners } from './ui-controller.js';
import { initMap } from './map-handler.js';
import { initTheme } from './theme-manager.js';
import { loadHistory } from './storage-manager.js';
import { setUpLinkHandlers } from './utils.js';

// Initialize the extension when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log('Ham Call Lookup: Initializing extension');

    // Initialize UI components
    initUI();

    // Set up event listeners
    setupEventListeners();

    // Initialize map if Leaflet is available
    initMap();

    // Initialize theme
    initTheme();

    // Load search history
    loadHistory();

    // Set up external link handlers
    setUpLinkHandlers();

    console.log('Ham Call Lookup: Initialization complete');
  } catch (error) {
    console.error('Ham Call Lookup: Initialization failed', error);
  }
});