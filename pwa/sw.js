/* build-pwa.cjs genera la versión y el inventario de esta compilación. */
const CACHE_NAME = "sportlike-static-__CACHE_VERSION__";
const DATA_CACHE = "sportlike-data-v2";
const IMG_CACHE = "sportlike-img-v2";
const PRECACHE = __PRECACHE_URLS__;
const ALLOWED_ASSETS = new Set(PRECACHE);
const API_ORIGIN = __API_ORIGIN__;
const CATALOG_PATH = /^\/api\/products(?:\/(\d+))?\/?$/;
const MAX_IMAGES = 100;
const MAX_CATALOG_ENTRIES = 50;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const NETWORK_TIMEOUT_MS = 5000;
const PUBLIC_PAGE = /^\/(?:$|catalogo\/?$|producto\/\d+\/?$|favoritos\/?$|promociones\/?$|carrito\/?$|configuracion\/?$|ayuda\/?$|contacto\/?$|tiendas\/?$|terminos\/?$|aviso-privacidad\/?$)/;

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  // Nunca fuerza una versión nueva sobre una compra o un formulario abierto.
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keep = new Set([CACHE_NAME, DATA_CACHE, IMG_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.filter(name => /^sportlike-(static-|data-|img-)/.test(name) && !keep.has(name)).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function trim(cache, limit) {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map(key => cache.delete(key)));
}
async function fetchWithTimeout(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  try { return await fetch(request, { signal:controller.signal }); }
  finally { clearTimeout(timer); }
}
async function savePublicResponse(cache, request, response) {
  if (!response.ok || /no-store|private/i.test(response.headers.get("Cache-Control") || "")) return;
  if (!(response.headers.get("Content-Type") || "").includes("application/json")) return;
  const headers = new Headers(response.headers);
  headers.set("X-SportLike-Saved-At", new Date().toISOString());
  const stored = new Response(await response.clone().blob(), { status:response.status, statusText:response.statusText, headers });
  await cache.put(request.url, stored);
  await trim(cache, MAX_CATALOG_ENTRIES);
}
async function validStored(cache, url) {
  const stored = await cache.match(url);
  if (!stored) return null;
  const timestamp = Date.parse(stored.headers.get("X-SportLike-Saved-At") || "");
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > MAX_AGE_MS) {
    await cache.delete(url);
    return null;
  }
  return stored;
}
async function savedCatalog(cache, request) {
  let stored = await validStored(cache, request.url);
  const url = new URL(request.url);
  if (!stored) {
    // El listado guardado también permite abrir un producto aún no visitado.
    const fullCatalog = await validStored(cache, url.origin + "/api/products");
    if (fullCatalog) {
      const list = await fullCatalog.clone().json();
      const productId = CATALOG_PATH.exec(url.pathname)?.[1];
      const data = productId ? (Array.isArray(list) && list.find(item => String(item.id) === productId)) : list;
      if (data) stored = new Response(JSON.stringify(data), { headers:fullCatalog.headers });
    }
  }
  if (!stored) return new Response(JSON.stringify({ error:"No hay una copia guardada de estos productos. Conéctate a internet para cargarlos." }), { status:503, headers:{ "Content-Type":"application/json" } });
  const headers = new Headers(stored.headers);
  headers.set("X-SportLike-Offline", "1");
  return new Response(await stored.blob(), { status:stored.status, headers });
}
async function catalogStrategy(event) {
  const request = event.request;
  const cache = await caches.open(DATA_CACHE);
  try {
    const response = await fetchWithTimeout(request);
    if (response.status >= 500) return savedCatalog(cache, request);
    // Un fallo de escritura no convierte una respuesta de red válida en un error.
    event.waitUntil(savePublicResponse(cache, request, response.clone()).catch(() => {}));
    return response;
  } catch { return savedCatalog(cache, request); }
}
async function imageStrategy(event) {
  const cache = await caches.open(IMG_CACHE);
  const cached = await cache.match(event.request);
  const refresh = fetch(event.request).then(async response => {
    // Las fotos externas sin CORS son opaque. La caché está limitada a páginas públicas.
    if (response.ok || response.type === "opaque") {
      try { await cache.put(event.request, response.clone()); await trim(cache, MAX_IMAGES); } catch {}
    }
    return response;
  });
  event.waitUntil(refresh.then(() => {}, () => {}));
  if (cached) return cached;
  try { return await refresh; }
  catch {
    const staticCache = await caches.open(CACHE_NAME);
    return (await staticCache.match("/icons/icon-192.png")) || Response.error();
  }
}
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (request.method !== "GET" || request.headers.has("Authorization") || request.headers.has("Range")) return;
  if ((sameOrigin || url.origin === API_ORIGIN) && CATALOG_PATH.test(url.pathname)) {
    event.respondWith(catalogStrategy(event));
    return;
  }
  // Datos personales, pagos, callbacks y cualquier otro endpoint quedan fuera de caché.
  if (/^\/(?:api|auth)(?:\/|$)/.test(url.pathname)) return;
  if (sameOrigin && request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      if (PUBLIC_PAGE.test(url.pathname)) {
        // HTML y bundles pertenecen a la misma versión, también después de publicar.
        const shell = await cache.match("/index.html");
        if (shell) return shell;
      }
      try { return await fetchWithTimeout(request); }
      catch { return (await cache.match("/offline.html")) || new Response("Sin conexión", { status:503 }); }
    })());
    return;
  }
  if (sameOrigin && !url.search && ALLOWED_ASSETS.has(url.pathname)) {
    event.respondWith(caches.open(CACHE_NAME).then(async cache => (await cache.match(request)) || fetch(request)));
    return;
  }
  if (request.destination === "image" && /^https?:$/.test(url.protocol)) {
    event.respondWith((async () => {
      const client = event.clientId ? await self.clients.get(event.clientId) : null;
      if (!client || !PUBLIC_PAGE.test(new URL(client.url).pathname)) return fetch(request);
      return imageStrategy(event);
    })());
  }
});
