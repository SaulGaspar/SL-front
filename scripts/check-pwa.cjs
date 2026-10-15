/* Verifica la compilación y ejecuta la política de caché real en un entorno aislado. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const dist = path.resolve(__dirname, "../dist");
async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(dist, "manifest.webmanifest")));
  const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.scope, "/");
  assert.match(html, /rel="manifest" href="\/manifest.webmanifest"/);
  for (const icon of [...manifest.icons, ...(manifest.screenshots || []), ...manifest.shortcuts.flatMap(item => item.icons || [])]) {
    const data = fs.readFileSync(path.join(dist, icon.src.slice(1)));
    assert.equal(data.readUInt32BE(16), Number(icon.sizes.split("x")[0]));
    assert.equal(data.readUInt32BE(20), Number(icon.sizes.split("x")[1]));
  }
  const handlers = {}, stores = new Map(), removed = [];
  let networkFails = false, status = 200, writesFail = false;
  const product = { id:1, nombre:"Producto de prueba", precio:499 };
  const key = request => typeof request === "string" ? request : request.url;
  function getStore(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const data = stores.get(name);
    return {
      addAll:async urls => {
        for (const url of urls) {
          assert.ok(fs.existsSync(path.join(dist, url.slice(1))), url);
          assert.notEqual(url, "/sw.js", "El worker no debe cachearse a sí mismo");
          data.set(url, new Response(url === "/index.html" ? "shell" : url === "/offline.html" ? "offline" : "static"));
        }
      },
      put:async (request, response) => { if (writesFail) throw new Error("quota"); data.set(key(request), response.clone()); },
      match:async request => {
        const url = key(request);
        const found = data.get(url) || data.get(url.startsWith("https://sportlike.test") ? new URL(url).pathname : url);
        return found?.clone();
      },
      delete:async request => data.delete(key(request)),
      keys:async () => Array.from(data.keys()),
    };
  }
  vm.runInNewContext(fs.readFileSync(path.join(dist, "sw.js"), "utf8"), {
    self:{ location:{origin:"https://sportlike.test"}, clients:{ claim:async () => {}, get:async () => ({url:"https://sportlike.test/catalogo"}) }, addEventListener:(name, handler) => { handlers[name] = handler; } },
    URL, Response, Headers, Set, Date, AbortController, setTimeout, clearTimeout,
    caches:{ open:async name => getStore(name), keys:async () => ["sportlike-static-old","sportlike-data-v1","unrelated-cache"], delete:async name => removed.push(name) },
    fetch:async request => {
      if (networkFails) throw new Error("offline");
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/products")) return new Response(JSON.stringify(url.pathname === "/api/products" ? [product] : product), { status, headers:{"Content-Type":"application/json"} });
      return new Response("network", {status});
    },
  });
  let pending;
  handlers.install({waitUntil:promise => {pending = promise;}});
  await pending;
  handlers.activate({waitUntil:promise => {pending = promise;}});
  await pending;
  assert.deepEqual(removed, ["sportlike-static-old","sportlike-data-v1"]);
  async function request(url, options = {}) {
    let result;
    const tasks = [];
    handlers.fetch({
      request:{url, method:options.method || "GET", mode:options.mode || "cors", destination:options.destination || "", headers:new Headers(options.headers)},
      clientId:"test",
      respondWith:promise => { result = promise; },
      waitUntil:promise => tasks.push(promise),
    });
    const response = result ? await result : undefined;
    await Promise.all(tasks);
    return response;
  }
  for (const url of ["https://sl-back.vercel.app/api/me","https://sportlike.test/api/orders","https://www.mercadopago.com.mx/checkout","https://sportlike.test/auth/google"]) assert.equal(await request(url), undefined);
  assert.equal(await request("https://sportlike.test/api/payments/preference", {method:"POST"}), undefined);
  assert.equal(await request("https://sl-back.vercel.app/api/products", {headers:{Authorization:"Bearer test"}}), undefined);
  assert.deepEqual(await (await request("https://sl-back.vercel.app/api/products")).json(), [product]);
  networkFails = true;
  assert.equal(await (await request("https://sportlike.test/catalogo", {mode:"navigate"})).text(), "shell");
  assert.equal(await (await request("https://sportlike.test/pago", {mode:"navigate"})).text(), "offline");
  const cached = await request("https://sl-back.vercel.app/api/products");
  assert.equal(cached.headers.get("X-SportLike-Offline"), "1");
  assert.deepEqual(await cached.json(), [product]);
  assert.deepEqual(await (await request("https://sl-back.vercel.app/api/products/1")).json(), product);
  assert.equal((await request("https://sl-back.vercel.app/api/products/999")).status, 503);
  networkFails = false; status = 503;
  assert.equal((await request("https://sl-back.vercel.app/api/products")).headers.get("X-SportLike-Offline"), "1");
  status = 200; writesFail = true;
  assert.equal((await request("https://sl-back.vercel.app/api/products")).status, 200);
  writesFail = false;
  const dataCache = stores.get("sportlike-data-v2");
  dataCache.set("https://sl-back.vercel.app/api/products", new Response("[]", {headers:{"X-SportLike-Saved-At":"2020-01-01"}}));
  networkFails = true;
  assert.equal((await request("https://sl-back.vercel.app/api/products")).status, 503);
  console.log("PWA OK: manifiesto/iconos, app shell offline, catálogo y detalle guardados, caducidad, fallback ante 503, fallo de cuota sin romper red y exclusión de pagos/datos personales.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
