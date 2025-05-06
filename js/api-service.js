// API Service: Handles API requests and data processing
import { displayResults, displayError, displayLoading } from './ui-controller.js';

// Base URL for the HamDB API
const API_BASE_URL = 'https://api.hamdb.org/v1';
const API_CLIENT_ID = 'hamCallLookupChromeExtension';

// Look up a callsign using the HamDB API
export function lookupCallsign(callsign) {
    // Validate callsign
    if (!callsign || callsign.length < 3) {
        displayError("Invalid callsign. Please enter at least 3 characters.");
        return;
    }

    // Show loading state
    displayLoading();

    // Build API URL
    const apiUrl = `${API_BASE_URL}/${callsign}/json/${API_CLIENT_ID}`;

    // Fetch data from API
    fetch(apiUrl)
        .then(handleApiResponse)
        .then(processApiData)
        .catch(handleApiError);
}

// Handle API response
function handleApiResponse(response) {
    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
}

// Process the API data
function processApiData(data) {
    // Check if the API returned a success status
    if (data.hamdb.messages.status === "OK") {
        // Pass the data to the UI controller
        displayResults(data);
    } else {
        // Handle API error messages
        const errorMessage = data.hamdb.messages.message || "No results found. Please check the callsign and try again.";
        displayError(errorMessage);
    }
}

// Handle API errors
function handleApiError(error) {
    console.error('API Service: Error fetching callsign data:', error);
    displayError("An error occurred while looking up the call sign. Please check your connection and try again.");
}