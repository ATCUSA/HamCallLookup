const baseUrl = 'https://hamdb.org';

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(baseUrl)) {
    event.respondWith(fetch(event.request));
  }
});
