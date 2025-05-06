// Background service worker for Ham Call Lookup extension
// Define allowed domains for fetching
const allowedDomains = [
  'https://hamdb.org',
  'https://www.qrz.com',
  'https://api.hamdb.org',
  'https://tile.openstreetmap.org',
  'https://a.tile.openstreetmap.org',
  'https://b.tile.openstreetmap.org',
  'https://c.tile.openstreetmap.org',
  'https://basemaps.cartocdn.com'
];

// Initialize extension data on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Ham Call Lookup extension installed');

    // Set default preferences - dark mode enabled by default
    chrome.storage.local.set({
      'darkMode': true,
      'searchHistory': []
    });
  } else if (details.reason === 'update') {
    console.log('Ham Call Lookup extension updated');

    // Check if we need to migrate data
    chrome.storage.local.get(['darkMode', 'searchHistory'], function (data) {
      if (data.darkMode === undefined) {
        chrome.storage.local.set({ 'darkMode': false });
      }

      if (!data.searchHistory) {
        chrome.storage.local.set({ 'searchHistory': [] });
      }
    });
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openTab') {
    chrome.tabs.create({ url: message.url });
  }

  // Always return true for async response
  return true;
});

// Listen for web requests
self.addEventListener('fetch', (event) => {
  // Check if the request URL starts with any of our allowed domains
  const isAllowed = allowedDomains.some(domain =>
    event.request.url.startsWith(domain)
  );

  if (isAllowed) {
    event.respondWith(fetch(event.request));
  }
});