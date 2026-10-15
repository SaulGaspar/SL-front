/* Prueba de integración en Chromium aislado. No usa la cuenta ni el perfil del usuario. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const os = require("node:os");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PWA_PLAYWRIGHT_MODULE || "playwright");
const dist = path.resolve(__dirname, "../dist");
const product = { id:1, nombre:"Tenis PWA de prueba", precio:499, marca:"SportLike", categoria:"Calzado", talla:"26,27", colores:"Negro", stock_total:8, descripcion:"Producto de prueba aislada", imagen:"https://images.example.test/product.png" };
const types = { ".html":"text/html", ".js":"application/javascript", ".css":"text/css", ".webmanifest":"application/manifest+json", ".png":"image/png", ".jpg":"image/jpeg", ".woff":"font/woff", ".woff2":"font/woff2" };
async function main() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = path.resolve(dist, "." + pathname);
    if (!file.startsWith(dist + path.sep) && file !== dist) { res.writeHead(403).end(); return; }
    if (!path.extname(pathname)) file = path.join(dist, "index.html");
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type":types[path.extname(file)] || "application/octet-stream", "Cache-Control":"no-cache" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const testProfile = fs.mkdtempSync(path.join(os.tmpdir(), "sportlike-pwa-check-"));
  try {
    const context = await chromium.launchPersistentContext(testProfile, { headless:true, viewport:{width:1365,height:900}, serviceWorkers:"allow", ...(process.env.PWA_BROWSER_CHANNEL ? {channel:process.env.PWA_BROWSER_CHANNEL} : {}) });
    browser = context;
    let offline = false;
    await context.route("https://sl-back.vercel.app/**", async route => {
      if (offline) { await route.abort("internetdisconnected"); return; }
      const url = new URL(route.request().url());
      const payload = url.pathname === "/api/products" ? [product] : url.pathname === "/api/products/1" ? product : url.pathname.includes("recommendations") ? {recommendations:[]} : {reviews:[],summary:{count:0,average:0}};
      await route.fulfill({ status:200, contentType:"application/json", headers:{"Access-Control-Allow-Origin":"*"}, body:JSON.stringify(payload) });
    });
    await context.route("https://images.example.test/**", route => offline ? route.abort("internetdisconnected") : route.fulfill({ contentType:"image/png", body:fs.readFileSync(path.join(dist,"icons/icon-192.png")) }));
    await context.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin + "/");
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const cdp = await context.newCDPSession(page);
    const manifest = await cdp.send("Page.getAppManifest");
    assert.equal(manifest.errors.length, 0, JSON.stringify(manifest.errors));
    assert.equal(JSON.parse(manifest.data).display, "standalone");
    const installability = await cdp.send("Page.getInstallabilityErrors");
    assert.equal(installability.installabilityErrors.length, 0, JSON.stringify(installability));
    // Invitación nativa simulada: no instala nada en el equipo durante la prueba.
    await page.evaluate(() => {
      const event = new Event("beforeinstallprompt", {cancelable:true});
      event.prompt = async () => { window.__installPromptOpened = true; };
      event.userChoice = Promise.resolve({outcome:"dismissed"});
      window.dispatchEvent(event);
    });
    await page.getByRole("button", {name:"Instalar SportLike",exact:true}).waitFor();
    await page.getByRole("button", {name:"Instalar SportLike",exact:true}).click();
    assert.equal(await page.evaluate(() => window.__installPromptOpened), true);
    await page.locator(".sl-install-notice").waitFor({state:"detached"});
    await page.evaluate(() => window.dispatchEvent(new Event("beforeinstallprompt", {cancelable:true})));
    await page.getByRole("button", {name:"Ahora no",exact:true}).click();
    await page.reload();
    await page.evaluate(() => window.dispatchEvent(new Event("beforeinstallprompt", {cancelable:true})));
    assert.equal(await page.evaluate(() => sessionStorage.getItem("sportlike-install-dismissed")), "1");
    assert.equal(await page.locator(".sl-install-notice").count(), 0);
    await page.goto(origin + "/configuracion");
    await page.getByRole("heading", {name:"Ajusta tu experiencia.",exact:true}).waitFor();
    assert.equal(await page.locator("#sl-pwa-title").count(), 0);
    if (process.env.PWA_CAPTURE_MANIFEST_SCREENSHOTS) {
      const captures = path.resolve(__dirname, "../pwa/screenshots");
      fs.mkdirSync(captures, {recursive:true});
      await page.screenshot({path:path.join(captures,"desktop.png")});
      await page.setViewportSize({width:390,height:844});
      await page.screenshot({path:path.join(captures,"mobile.png")});
      await page.setViewportSize({width:1365,height:900});
    }
    await page.goto(origin + "/catalogo");
    await page.getByText(product.nombre, {exact:true}).waitFor();
    await page.waitForFunction(async () => {
      const cache = await caches.open("sportlike-data-v2");
      return Boolean(await cache.match("https://sl-back.vercel.app/api/products"));
    });
    await page.waitForFunction(async () => {
      const cache = await caches.open("sportlike-img-v2");
      return Boolean(await cache.match("https://images.example.test/product.png"));
    });
    await page.goto(origin + "/configuracion");
    await page.getByRole("heading", {name:"Ajusta tu experiencia.",exact:true}).waitFor();
    assert.equal(await page.getByRole("button", {name:"Instalar SportLike",exact:true}).count(), 0);
    // Geolocalización simulada: nunca consulta la ubicación real del usuario.
    await context.grantPermissions(["geolocation"], {origin});
    await context.setGeolocation({latitude:21.14, longitude:-98.42, accuracy:25});
    await page.goto(origin + "/tiendas");
    await page.getByRole("button", {name:"Usar mi ubicación",exact:true}).click();
    await page.getByText("Ubicación obtenida.", {exact:false}).waitFor();
    const route = await page.locator(".st-card").first().getAttribute("href");
    assert.equal(new URL(route).searchParams.get("origin"), "21.14,-98.42");
    await page.getByRole("button", {name:"Dejar de usar esta ubicación",exact:true}).click();
    assert.ok(!(await page.locator(".st-card").first().getAttribute("href")).includes("origin="));
    // Abre otra ventana sin red: reproduce reabrir la app instalada usando la misma caché.
    offline = true;
    await context.setOffline(true);
    const reopened = await context.newPage();
    await reopened.goto(origin + "/catalogo");
    await reopened.locator(".sl-pwa-offline").waitFor();
    await reopened.getByText(product.nombre, {exact:true}).waitFor();
    await reopened.getByText("Estás viendo una copia guardada", {exact:false}).waitFor();
    assert.equal(await reopened.locator(".sl-card-img img").evaluate(image => image.complete && image.naturalWidth > 0), true);
    await reopened.getByText(product.nombre, {exact:true}).click();
    await reopened.getByRole("heading", {name:product.nombre}).waitFor();
    await reopened.getByRole("button", {name:"Agregar al carrito",exact:true}).first().click();
    await reopened.goto(origin + "/carrito");
    await reopened.getByText(product.nombre, {exact:true}).waitFor();
    assert.equal(await reopened.getByRole("button", {name:"Conéctate para pagar",exact:true}).isDisabled(), true);
    await reopened.evaluate(() => { localStorage.setItem("token","pwa-test-token"); localStorage.setItem("pwa-test-preference","retained"); });
    await reopened.reload();
    assert.equal(await reopened.evaluate(() => localStorage.getItem("token")), "pwa-test-token");
    assert.equal(await reopened.evaluate(() => localStorage.getItem("pwa-test-preference")), "retained");
    assert.ok(JSON.parse(await reopened.evaluate(() => localStorage.getItem("cart"))).length > 0);
    if (process.env.PWA_SCREENSHOT_DIR) await reopened.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,"pwa-carrito-offline.png"),fullPage:true});
    await reopened.goto(origin + "/pago");
    await reopened.getByRole("heading", {name:"Esta sección necesita conexión"}).waitFor();
    offline = false;
    await context.setOffline(false);
    await reopened.evaluate(() => localStorage.removeItem("token"));
    await reopened.goto(origin + "/catalogo");
    await reopened.getByText(product.nombre, {exact:true}).waitFor();
    await reopened.locator(".sl-pwa-cached").waitFor({state:"detached"});
    await reopened.locator(".sl-pwa-offline").waitFor({state:"detached"});
    await page.setViewportSize({width:390,height:844});
    await page.goto(origin + "/configuracion");
    await page.getByRole("heading", {name:"Ajusta tu experiencia.",exact:true}).waitFor();
    await page.evaluate(() => {
      sessionStorage.removeItem("sportlike-install-dismissed");
    });
    await page.reload();
    await page.evaluate(() => window.dispatchEvent(new Event("beforeinstallprompt", {cancelable:true})));
    await page.getByRole("button", {name:"Instalar SportLike",exact:true}).waitFor();
    const overflow = await page.evaluate(() => ({ width:window.innerWidth, scroll:document.documentElement.scrollWidth, elements:Array.from(document.querySelectorAll("body *")).filter(el => {const r=el.getBoundingClientRect(); return r.width > 0 && r.right > window.innerWidth+1;}).slice(0,12).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right})) }));
    assert.ok(overflow.scroll <= overflow.width, "La instalación no debe desbordar la pantalla móvil: " + JSON.stringify(overflow));
    assert.deepEqual(errors, []);
    console.log("CHROMIUM PWA OK: manifiesto reconocido sin errores de instalación, SW activo, nueva ventana sin red, catálogo/detalle/imágenes en caché, carrito persistente, pago bloqueado offline y reconexión.");
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
    if (path.dirname(testProfile) === path.resolve(os.tmpdir()) && path.basename(testProfile).startsWith("sportlike-pwa-check-")) fs.rmSync(testProfile, {recursive:true,force:true});
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
