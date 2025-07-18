const CACHE_NAME = 'wraven-v1.0.0';
const STATIC_CACHE_NAME = 'wraven-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'wraven-dynamic-v1.0.0';

// Onion address for Tor support
const ONION_ADDRESS = 'http://fxyk2rjld5uqnkpqazbgt6w6yvq27vejjrg3brgtcdl3dm2bmq5c4nyd.onion';

// Files to cache immediately (static assets)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/imgs/littlelogo.png',
  '/imgs/icon-192x192.png',
  '/imgs/icon-512x512.png',
  '/imgs/widelogo.png',
  '/imgs/og-image.png'
];

// Files that should always be fresh (never cache)
const NEVER_CACHE = [
  '/index.html',
  '/script.js',
  '/styles.css'
];

// External resources that can be cached longer
const EXTERNAL_CACHE_PATTERNS = [
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /api\.ipify\.org/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        // Only cache truly static assets (not main files that change)
        const staticOnly = STATIC_ASSETS.filter(asset => 
          !NEVER_CACHE.includes(asset)
        );
        return cache.addAll(staticOnly);
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('wraven-')) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - handle requests with intelligent caching
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    handleRequest(event.request, url)
  );
});

// Add Onion-Location header to responses
function addOnionLocationHeader(response, url) {
  // Only add to HTML responses from our domain
  if (url.hostname === 'wraven.org' || url.hostname === 'www.wraven.org') {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      // Clone the response and add the header
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Onion-Location', ONION_ADDRESS + url.pathname + url.search);
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }
  }
  return response;
}

async function handleRequest(request, url) {
  try {
    let response;
    
    // Strategy 1: NEVER cache main content files (always fresh)
    if (NEVER_CACHE.some(pattern => url.pathname.includes(pattern))) {
      console.log('Fetching fresh (never cache):', url.pathname);
      response = await fetchWithFallback(request);
    }
    // Strategy 2: Cache external resources with network-first for freshness
    else if (EXTERNAL_CACHE_PATTERNS.some(pattern => pattern.test(url.hostname))) {
      response = await networkFirstStrategy(request, DYNAMIC_CACHE_NAME);
    }
    // Strategy 3: Cache static assets with cache-first
    else if (STATIC_ASSETS.includes(url.pathname) && !NEVER_CACHE.includes(url.pathname)) {
      response = await cacheFirstStrategy(request, STATIC_CACHE_NAME);
    }
    // Strategy 4: Everything else - network first with short cache
    else {
      response = await networkFirstStrategy(request, DYNAMIC_CACHE_NAME);
    }
    
    // Add Onion-Location header if appropriate
    return addOnionLocationHeader(response, url);
    
  } catch (error) {
    console.error('Service Worker fetch error:', error);
    
    // Fallback to cache if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback
    if (url.pathname === '/' || url.pathname.includes('.html')) {
      return new Response('WRAVEN - Service temporarily unavailable', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    throw error;
  }
}

// Network-first strategy (always try network first, cache as backup)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Always try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response and return it
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Clone the response before caching (responses can only be consumed once)
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If network fails, fall back to cache
    const cachedResponse = await caches.match(request);
    return cachedResponse || networkResponse;
    
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Network failed, serving from cache:', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Serve from cache, but update cache in background
    updateCacheInBackground(request, cacheName);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Update cache in background without blocking response
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Fetch with fallback and timeout
async function fetchWithFallback(request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    const response = await fetch(request, {
      signal: controller.signal,
      cache: 'no-store' // Force fresh fetch
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If fetch fails, try cache as last resort
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Fetch failed, serving stale cache:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    // Clear all caches when requested
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('wraven-')) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
});

// Send updates to clients when new version is available
self.addEventListener('updatefound', () => {
  console.log('New version available!');
  
  // Notify all clients about the update
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        message: 'A new version of WRAVEN is available. Refresh to update.'
      });
    });
  });
});
