/* Genera archivos de URL estable después de que Parcel resuelva sus bundles. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const zlib = require("node:zlib");
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const dotenvPath = path.join(root, ".env");
const fileApiUrl = fs.existsSync(dotenvPath) ? fs.readFileSync(dotenvPath,"utf8").match(/^\s*SPORTLIKE_API_URL\s*=\s*["']?([^\s"'#]+)["']?\s*$/m)?.[1] : null;
const apiOrigin = new URL(process.env.SPORTLIKE_API_URL || fileApiUrl || "https://sl-back.vercel.app").origin;
if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error("Primero compila el frontend con Parcel.");
fs.mkdirSync(path.join(dist, "icons"), { recursive: true });

// Monograma vectorial SL, con margen seguro para iconos recortables.
const letters = [
  [[.27,.32],[.47,.32],[.47,.39],[.34,.39],[.34,.46],[.47,.46],[.47,.68],[.27,.68],[.27,.61],[.40,.61],[.40,.53],[.27,.53]],
  [[.53,.32],[.60,.32],[.60,.61],[.73,.61],[.73,.68],[.53,.68]],
];
function inside(x, y, points) {
  let result = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) result = !result;
  }
  return result;
}
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
function icon(size) {
  const pixels = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const foreground = letters.some(points => inside((x + .5) / size, (y + .5) / size, points));
    const offset = y * (size * 4 + 1) + 1 + x * 4;
    const color = foreground ? [199,242,43,255] : [11,31,51,255];
    pixels.set(color, offset);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(pixels)), chunk("IEND", Buffer.alloc(0))]);
}
for (const size of [96,192,512]) fs.writeFileSync(path.join(dist, "icons", `icon-${size}.png`), icon(size));
fs.writeFileSync(path.join(dist, "icons", "apple-touch-icon.png"), icon(180));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "pwa", "manifest.webmanifest"), "utf8"));
fs.writeFileSync(path.join(dist, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
fs.copyFileSync(path.join(root, "pwa", "offline.html"), path.join(dist, "offline.html"));
if (fs.existsSync(path.join(root, "pwa", "screenshots"))) {
  fs.mkdirSync(path.join(dist, "screenshots"), {recursive:true});
  for (const file of fs.readdirSync(path.join(root, "pwa", "screenshots"))) {
    if (file.endsWith(".png")) fs.copyFileSync(path.join(root, "pwa", "screenshots", file), path.join(dist, "screenshots", file));
  }
}

// Lista exacta de assets locales con hash.
let html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
// Parcel cambia nombres de assets; estos enlaces se insertan después para conservar URLs estables.
if (!html.includes('rel="manifest"')) {
  const links = '<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" type="image/png" href="/icons/icon-192.png"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">';
  // El minificador puede omitir </head> y quitar comillas de los atributos.
  html = html.includes("</head>") ? html.replace("</head>", links + "</head>") : html.replace(/<body\b/i, links + "<body");
  if (!html.includes('rel="manifest"')) throw new Error("No se pudo insertar el manifiesto en index.html.");
  fs.writeFileSync(path.join(dist, "index.html"), html);
}
const assets = Array.from(html.matchAll(/(?:src|href)=["']?([^\s"'<>?#]+\.(?:js|css))(?=[\s"'>])/g), match => match[1])
  .filter(url => !/^(?:https?:)?\/\//.test(url)).map(url => "/" + url.replace(/^\//, ""));
// Sigue las referencias de esta compilación, incluidas imágenes del importmap y chunks.
const files = fs.readdirSync(dist).filter(file => file !== "sw.js" && /\.(?:js|css|woff2?|ttf|png|jpe?g|webp|svg)$/.test(file));
const scanned = new Set();
const sources = [html];
while (sources.length) {
  const source = sources.pop();
  for (const file of files) {
    if (!source.includes(file) || scanned.has(file)) continue;
    scanned.add(file);
    assets.push("/" + file);
    if (/\.(?:js|css)$/.test(file)) sources.push(fs.readFileSync(path.join(dist, file), "utf8"));
  }
}
if (!assets.some(url => url.endsWith(".js")) || !assets.some(url => url.endsWith(".css"))) throw new Error("No se encontraron los bundles de Parcel.");

// HTML público sin datos de usuario: arranca la app instalada sin conexión.
const manifestAssets = [...manifest.icons, ...(manifest.screenshots || []), ...manifest.shortcuts.flatMap(shortcut => shortcut.icons || [])].map(asset => asset.src);
const precache = [...new Set(["/index.html", "/offline.html", "/manifest.webmanifest", "/icons/apple-touch-icon.png", ...manifestAssets, ...assets])];
const version = crypto.createHash("sha256");
for (const url of precache) version.update(fs.readFileSync(path.join(dist, url.slice(1))));
const template = fs.readFileSync(path.join(root, "pwa", "sw.js"), "utf8");
version.update(template);
version.update(apiOrigin);
const worker = template
  .replace("__CACHE_VERSION__", version.digest("hex").slice(0, 16))
  .replace("__PRECACHE_URLS__", JSON.stringify(precache));
fs.writeFileSync(path.join(dist, "sw.js"), worker.replace("__API_ORIGIN__", JSON.stringify(apiOrigin)));
console.log(`PWA generada: manifiesto, iconos PNG, respaldo sin conexión y ${precache.length} recursos locales.`);
