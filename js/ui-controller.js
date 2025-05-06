// UI Controller: Manages UI elements and interactions
import { lookupCallsign } from './api-service.js';
import { addToHistory } from './storage-manager.js';
import { displayMap, expandMap, closeFullMapView } from './map-handler.js';
import { toggleTheme } from './theme-manager.js';

// Cache DOM elements to avoid repeated queries
let elements = {};

// Initialize UI components
export function initUI() {
    // Safely get DOM elements with error checking
    elements = {
        lookupButton: getElement('lookup-button'),
        aboutButton: getElement('about-button'),
        closeButton: getElement('close-button'),
        resultsDiv: getElement('results'),
        callsignInput: getElement('callsign-input'),
        themeToggleBtn: getElement('theme-toggle-btn'),
        clearHistoryBtn: getElement('clear-history'),
        historyList: getElement('history-list'),
        externalLinks: getElement('external-links'),
        qrzLink: getElement('qrz-link'),
        gmapsLink: getElement('gmaps-link'),
        mapContainer: getElement('map-container'),
        expandMapBtn: getElement('expand-map'),
        fullMapContainer: getElement('full-map-container'),
        closeFullMapBtn: getElement('close-full-map'),
        resultsContainer: getElement('results-container'),
        mainPopup: getElement('main-popup'),
        aboutPopup: getElement('about-popup')
    };

    console.log('UI Controller: UI elements initialized');
}

// Helper function to safely get DOM elements
export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`UI Controller: Element with ID '${id}' not found.`);
    }
    return element;
}

// Set up all event listeners
export function setupEventListeners() {
    // Lookup button click
    if (elements.lookupButton) {
        elements.lookupButton.addEventListener('click', handleLookupClick);
    }

    // Enter key in callsign input
    if (elements.callsignInput) {
        elements.callsignInput.addEventListener('keyup', handleCallsignKeyup);
    }

    // About button click
    if (elements.aboutButton) {
        elements.aboutButton.addEventListener('click', showAboutPopup);
    }

    // Close button click
    if (elements.closeButton) {
        elements.closeButton.addEventListener('click', hideAboutPopup);
    }

    // Clear history button click
    if (elements.clearHistoryBtn) {
        elements.clearHistoryBtn.addEventListener('click', handleClearHistory);
    }

    // Theme toggle button click
    if (elements.themeToggleBtn) {
        elements.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Map expand button is set dynamically when map is displayed

    // Close full map button click
    if (elements.closeFullMapBtn) {
        elements.closeFullMapBtn.addEventListener('click', closeFullMapView);
    }

    console.log('UI Controller: Event listeners set up');
}

// Handle lookup button click
function handleLookupClick() {
    if (!elements.callsignInput) return;

    const callsign = elements.callsignInput.value.trim().toUpperCase();
    if (callsign.length === 0) {
        displayError("Please enter a call sign.");
    } else if (callsign.length >= 3) {
        lookupCallsign(callsign);
    } else {
        displayError("Callsign must be at least 3 characters.");
    }
}

// Handle enter key in callsign input
function handleCallsignKeyup(event) {
    if (event.key === "Enter") {
        handleLookupClick();
    }
}

// Handle clear history button click
function handleClearHistory() {
    if (typeof window.clearSearchHistory === 'function') {
        window.clearSearchHistory();
    }
}

// Show about popup
function showAboutPopup() {
    if (elements.aboutPopup && elements.mainPopup) {
        elements.aboutPopup.classList.remove('hidden');
        elements.mainPopup.classList.add('hidden');
    }
}

// Hide about popup
function hideAboutPopup() {
    if (elements.aboutPopup && elements.mainPopup) {
        elements.aboutPopup.classList.add('hidden');
        elements.mainPopup.classList.remove('hidden');
    }
}

// Display loading state
export function displayLoading() {
    if (elements.resultsDiv) {
        elements.resultsDiv.innerHTML = '<p>Looking up callsign...</p>';
        elements.resultsDiv.classList.remove('hidden');
    }
}

// Display error message
export function displayError(message) {
    if (elements.resultsDiv) {
        elements.resultsDiv.innerHTML = `<p class="error">${message}</p>`;
        elements.resultsDiv.classList.remove('hidden');
    }

    if (elements.mapContainer) {
        elements.mapContainer.classList.add('hidden');
    }

    if (elements.externalLinks) {
        elements.externalLinks.classList.add('hidden');
    }
}

// Display callsign results
export function displayResults(data) {
    if (!elements.resultsDiv) return;

    try {
        const operator = data.hamdb.callsign;
        let name = `${operator.fname} ${operator.mi ? operator.mi + '. ' : ''}${operator.name}${operator.suffix ? ' ' + operator.suffix : ''}`;
        const grid = operator.grid;
        let status = operator.status.toLowerCase();
        const location = `${operator.addr1}, ${operator.addr2}, ${operator.state} ${operator.zip}, ${operator.country}`;
        const coordinates = `${operator.lat}, ${operator.lon}`;
        const expiration = operator.expires;
        let level = operator.class.toLowerCase();

        // Save current location data for map
        const currentCallsign = operator.call;
        const currentGrid = grid;
        const currentAddress = location;
        const currentLatLng = {
            lat: parseFloat(operator.lat),
            lng: parseFloat(operator.lon)
        };

        // Convert the class to a more readable format
        const readableClass = getReadableClass(level, operator.fname);

        // Convert the status to a more readable format
        const readableStatus = getReadableStatus(status);

        // Create a copy success message element
        const copySuccessMsg = document.createElement('div');
        copySuccessMsg.className = 'copy-success';
        copySuccessMsg.textContent = 'Copied!';
        document.body.appendChild(copySuccessMsg);

        // Update the results display
        elements.resultsDiv.innerHTML = generateResultsHTML(
            operator.call, readableClass, name, location,
            grid, coordinates, expiration, readableStatus
        );

        // Add event listeners to copy buttons
        setupCopyButtons(copySuccessMsg);

        // Show the results and external links
        elements.resultsDiv.classList.remove('hidden');

        if (elements.externalLinks) {
            elements.externalLinks.classList.remove('hidden');

            // Update QRZ link
            if (elements.qrzLink) {
                elements.qrzLink.href = `https://www.qrz.com/db/${operator.call}`;
            }

            // Update Google Maps directions link
            if (elements.gmapsLink) {
                const encodedAddress = encodeURIComponent(location);
                elements.gmapsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
            }
        }

        // Add to history
        addToHistory(operator.call, name.trim());

        // Display map if coordinates are available
        if (operator.lat && operator.lon) {
            // Use the direct coordinates from the API
            const coordinates = {
                lat: parseFloat(operator.lat),
                lng: parseFloat(operator.lon)
            };

            displayMap(coordinates, currentCallsign, currentGrid, currentAddress);
        }
    } catch (error) {
        console.error('UI Controller: Error displaying results', error);
        displayError("Error displaying results. Please try again.");
    }
}

// Get readable license class
function getReadableClass(level, firstName) {
    if (level === "t") return "Technician";
    if (level === "a") return "Advanced";
    if (level === "g") return "General";
    if (level === "e") return "Extra";
    if (level === "" && firstName === "") return "Club";
    return "Unknown";
}

// Get readable status
function getReadableStatus(status) {
    if (status === "a") return "Active";
    if (status === "i") return "Inactive";
    return "Unknown";
}

// Generate HTML for results
function generateResultsHTML(call, level, name, location, grid, coordinates, expiration, status) {
    // Function to create copy buttons with Lucide SVG icon
    function createCopyButton(text, id) {
        return `
      <button class="copy-button" data-text="${text}" id="${id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-copy">
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
          <path d="M16 4h2a2 2 0 0 1 2 2v4"/>
          <path d="M21 14H11"/>
          <path d="m15 10-4 4 4 4"/>
        </svg>
      </button>
    `;
    }

    return `
    <div class="result-item">
      <strong>Call Sign:</strong> ${call} (${level}) 
      ${createCopyButton(call, 'copy-callsign')}
    </div>
    <div class="result-item">
      <strong>Operator:</strong> ${name} 
      ${createCopyButton(name, 'copy-name')}
    </div>
    <div class="result-item">
      <strong>Location:</strong> ${location} 
      ${createCopyButton(location, 'copy-location')}
    </div>
    <div class="result-item">
      <strong>Grid:</strong> ${grid} 
      ${createCopyButton(grid, 'copy-grid')}
    </div>
    <div class="result-item">
      <strong>Coordinates:</strong> ${coordinates} 
      ${createCopyButton(coordinates, 'copy-coordinates')}
    </div>
    <div class="result-item">
      <strong>License Expires:</strong> ${expiration} 
      ${createCopyButton(expiration, 'copy-expiration')}
    </div>
    <div class="result-item">
      <strong>Status:</strong> ${status}
    </div>
  `;
}

// Set up copy buttons
function setupCopyButtons(copySuccessMsg) {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function (e) {
            const textToCopy = this.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success message
                const rect = button.getBoundingClientRect();
                copySuccessMsg.style.left = `${rect.left}px`;
                copySuccessMsg.style.top = `${rect.bottom + 5}px`;
                copySuccessMsg.classList.add('show');

                // Hide message after a delay
                setTimeout(() => {
                    copySuccessMsg.classList.remove('show');
                }, 1500);
            });
        });
    });
}

// Update history display
export function updateHistoryDisplay(searchHistory) {
    if (!elements.historyList) return;

    elements.historyList.innerHTML = '';

    if (!searchHistory || searchHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'No recent lookups';
        emptyItem.style.cursor = 'default';
        emptyItem.style.textAlign = 'center';
        emptyItem.style.color = 'var(--dark-gray)';
        elements.historyList.appendChild(emptyItem);
        return;
    }

    searchHistory.forEach(item => {
        const listItem = document.createElement('li');

        const callsignSpan = document.createElement('span');
        callsignSpan.textContent = item.callsign;
        callsignSpan.className = 'history-callsign';

        const timestampSpan = document.createElement('span');
        const date = new Date(item.timestamp);
        timestampSpan.textContent = formatDate(date);
        timestampSpan.className = 'history-timestamp';

        listItem.appendChild(callsignSpan);
        listItem.appendChild(timestampSpan);

        listItem.addEventListener('click', () => {
            if (elements.callsignInput) {
                elements.callsignInput.value = item.callsign;
                lookupCallsign(item.callsign);
            }
        });

        elements.historyList.appendChild(listItem);
    });
}

// Format date for history display
function formatDate(date) {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}