// Map Handler: Manages map creation and interaction
import { getElement } from './ui-controller.js';
import { gridToLatLong } from './utils.js';

// Map state variables
let map = null;
let marker = null;
let fullMap = null;
let fullMapMarker = null;
let mapState = {
    currentCallsign: null,
    currentGrid: null,
    currentAddress: null,
    currentLatLng: null
};

// Initialize map functionality
export function initMap() {
    // Check if Leaflet is available
    if (typeof L === 'undefined') {
        console.warn('Map Handler: Leaflet library not available. Map functionality will be limited.');
        return;
    }

    // Set Leaflet marker icon path
    try {
        L.Icon.Default.imagePath = 'lib/images/';
        console.log('Map Handler: Leaflet initialized');
    } catch (error) {
        console.error('Map Handler: Error initializing Leaflet', error);
    }
}

// Display a location on the map
export function displayMap(latLng, callsign, gridSquare, address) {
    // Update map state
    mapState.currentCallsign = callsign || 'Unknown';
    mapState.currentGrid = gridSquare || 'Unknown';
    mapState.currentAddress = address || '';
    mapState.currentLatLng = latLng;

    // Get map container element
    const mapContainer = getElement('map-container');
    const mapElement = getElement('map');
    const expandMapBtn = getElement('expand-map');

    if (!mapContainer || !mapElement) {
        console.warn('Map Handler: Map container elements not found');
        return;
    }

    // Check for valid coordinates
    if (!latLng || !latLng.lat || !latLng.lng || isNaN(latLng.lat) || isNaN(latLng.lng)) {
        console.warn('Map Handler: Invalid coordinates provided');
        return;
    }

    // Ensure we have Leaflet loaded
    if (typeof L === 'undefined') {
        console.error('Map Handler: Leaflet library not loaded');
        return;
    }

    try {
        // Show map container
        mapContainer.classList.remove('hidden');

        // Initialize or update map
        if (!map) {
            // Create new map
            map = L.map('map').setView([latLng.lat, latLng.lng], 8);

            // Add tile layer
            addTileLayer(map);
        } else {
            // Update existing map view
            map.setView([latLng.lat, latLng.lng], 8);
        }

        // Add or update marker
        if (marker) {
            marker.setLatLng([latLng.lat, latLng.lng]);
            marker.bindPopup(createPopupContent(callsign, gridSquare));
        } else {
            marker = L.marker([latLng.lat, latLng.lng]).addTo(map)
                .bindPopup(createPopupContent(callsign, gridSquare));
        }

        // Set expand map button functionality
        if (expandMapBtn) {
            expandMapBtn.onclick = expandMap;
        }

        // Ensure the map renders correctly
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);
    } catch (error) {
        console.error('Map Handler: Error displaying map', error);
        if (mapContainer) {
            mapContainer.classList.add('hidden');
        }
    }
}

// Expand map to full screen
export function expandMap() {
    // Get full map container element
    const fullMapContainer = getElement('full-map-container');
    const fullMapElement = getElement('full-map');

    if (!fullMapContainer || !fullMapElement) {
        console.warn('Map Handler: Full map container elements not found');
        return;
    }

    // Check for valid map state
    if (!mapState.currentLatLng || !mapState.currentLatLng.lat || !mapState.currentLatLng.lng) {
        console.warn('Map Handler: No valid coordinates available');
        return;
    }

    try {
        // Show full map container
        fullMapContainer.classList.remove('hidden');

        // Initialize or update full map
        if (!fullMap) {
            // Create new map
            fullMap = L.map('full-map').setView([mapState.currentLatLng.lat, mapState.currentLatLng.lng], 10);

            // Add tile layer
            addTileLayer(fullMap);

            // Add marker
            fullMapMarker = L.marker([mapState.currentLatLng.lat, mapState.currentLatLng.lng]).addTo(fullMap)
                .bindPopup(createFullMapPopupContent());

            // Open popup by default
            fullMapMarker.openPopup();
        } else {
            // Update existing map
            fullMap.setView([mapState.currentLatLng.lat, mapState.currentLatLng.lng], 10);

            // Update marker
            if (fullMapMarker) {
                fullMapMarker.setLatLng([mapState.currentLatLng.lat, mapState.currentLatLng.lng]);
                fullMapMarker.bindPopup(createFullMapPopupContent());
                fullMapMarker.openPopup();
            } else {
                fullMapMarker = L.marker([mapState.currentLatLng.lat, mapState.currentLatLng.lng]).addTo(fullMap)
                    .bindPopup(createFullMapPopupContent());
                fullMapMarker.openPopup();
            }
        }

        // Ensure the map renders correctly
        setTimeout(() => {
            if (fullMap) {
                fullMap.invalidateSize();
            }
        }, 100);
    } catch (error) {
        console.error('Map Handler: Error expanding map', error);
        if (fullMapContainer) {
            fullMapContainer.classList.add('hidden');
        }
    }
}

// Close full screen map
export function closeFullMapView() {
    const fullMapContainer = getElement('full-map-container');

    if (fullMapContainer) {
        fullMapContainer.classList.add('hidden');
    }
}

// Update map theme
export function updateMapTheme() {
    try {
        // Get current theme
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        // Remove existing maps
        if (map) {
            const mapCenter = map.getCenter();
            const mapZoom = map.getZoom();
            map.remove();

            // Recreate map with new theme
            map = L.map('map').setView([mapCenter.lat, mapCenter.lng], mapZoom);
            addTileLayer(map);

            // Add marker back if we have valid coordinates
            if (mapState.currentLatLng) {
                marker = L.marker([mapState.currentLatLng.lat, mapState.currentLatLng.lng]).addTo(map)
                    .bindPopup(createPopupContent(mapState.currentCallsign, mapState.currentGrid));
            }
        }

        // Update full map if it exists
        if (fullMap) {
            const fullMapCenter = fullMap.getCenter();
            const fullMapZoom = fullMap.getZoom();
            fullMap.remove();

            // Recreate full map with new theme
            fullMap = L.map('full-map').setView([fullMapCenter.lat, fullMapCenter.lng], fullMapZoom);
            addTileLayer(fullMap);

            // Add marker back if we have valid coordinates
            if (mapState.currentLatLng) {
                fullMapMarker = L.marker([mapState.currentLatLng.lat, mapState.currentLatLng.lng]).addTo(fullMap)
                    .bindPopup(createFullMapPopupContent());
            }
        }
    } catch (error) {
        console.error('Map Handler: Error updating map theme', error);
    }
}

// Helper function to add the appropriate tile layer based on theme
function addTileLayer(mapInstance) {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    // Choose tile layer based on theme
    const tileLayer = isDarkMode ?
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png') :
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    // Add attribution
    tileLayer.addTo(mapInstance);
}

// Create popup content for the main map
function createPopupContent(callsign, gridSquare) {
    return `<b>${callsign || 'Unknown'}</b><br>Grid: ${gridSquare || 'Unknown'}`;
}

// Create popup content for the full map with directions link
function createFullMapPopupContent() {
    const encodedAddress = encodeURIComponent(mapState.currentAddress || '');
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    return `
    <b>${mapState.currentCallsign || 'Unknown'}</b><br>
    Grid: ${mapState.currentGrid || 'Unknown'}<br>
    <a href="${directionsLink}" target="_blank">Get Directions</a>
  `;
}