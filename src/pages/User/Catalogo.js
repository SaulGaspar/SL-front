// ============================================================
// Catalogo.js  —  con predicción de agotamiento de inventario
// ============================================================
import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "https://sl-back.vercel.app";

// ── Mensajes dinámicos según alerta ─────────────────────────
const MENSAJES_CRITICO = [
  "¡Últimas unidades!",
  "¡Se acaba hoy!",
  "¡Casi agotado!",
  "¡Corre, quedan pocas!",
  "⚡ Stock crítico",
];
const MENSAJES_BAJO = [
  "Pocas unidades",
  "Stock limitado",
  "Quedan muy pocas",
  "Alta demanda",
];
const MENSAJES_MODERADO = [
  "Disponible por ahora",
  "Stock moderado",
  "Vendiendo rápido",
];

const getMensaje = (arr, id) => arr[id % arr.length];

const formatTiempo = (dias) => {
  if (dias === null || dias === undefined) return null;
  if (dias < 0.5) return "menos de 12 horas";
  if (dias < 1)   return "menos de 1 día";
  if (dias < 2)   return "1–2 días";
  if (dias < 7)   return `~${Math.round(dias)} días`;
  if (dias < 30)  return `~${Math.round(dias / 7)} semana${Math.round(dias / 7) > 1 ? "s" : ""}`;
  return `~${Math.round(dias / 30)} mes${Math.round(dias / 30) > 1 ? "es" : ""}`;
};

const getCSS = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

.sl-cat {
  --navy:   #0a1a2f;
  --navy2:  #1e3a5f;
  --cream:  ${dark ? "#0f172a" : "#f7f5f0"};
  --white:  ${dark ? "#1e293b" : "#ffffff"};
  --muted:  ${dark ? "#94a3b8" : "#8a8f98"};
  --border: ${dark ? "#334155" : "#e4e2dd"};
  --accent: #c8f03c;
  --danger: #e53e3e;
  --warn:   #f59e0b;
  --ok:     #10b981;
  --text:   ${dark ? "#e2e8f0" : "#0a1a2f"};
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  color: var(--text);
}

/* ── BARRA FILTROS ── */
.sl-bar {
  background: var(--navy);
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 0;
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid rgba(255,255,255,.07);
}
.sl-bar-brand { font-family:'Bebas Neue',sans-serif; font-size:1.35rem; color:var(--accent); letter-spacing:3px; margin-right:28px; white-space:nowrap; flex-shrink:0; }
.sl-search-wrap { position:relative; flex:1; max-width:340px; margin-right:12px; }
.sl-search-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); font-size:.9rem; pointer-events:none; }
.sl-input { width:100%; padding:9px 14px 9px 38px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.12); border-radius:8px; color:white; font-family:'Outfit',sans-serif; font-size:.88rem; transition:background .2s,border-color .2s; }
.sl-input::placeholder { color:rgba(255,255,255,.35); }
.sl-input:focus { outline:none; background:rgba(255,255,255,.13); border-color:var(--accent); }
.sl-sel { padding:9px 12px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.12); border-radius:8px; color:rgba(255,255,255,.85); font-family:'Outfit',sans-serif; font-size:.85rem; cursor:pointer; margin-right:10px; }
.sl-sel option { background:var(--navy); color:white; }
.sl-sel:focus { outline:none; border-color:var(--accent); }
.sl-range-pill { display:flex; align-items:center; gap:8px; font-size:.82rem; font-weight:600; margin-right:12px; white-space:nowrap; background:rgba(255,255,255,.07); padding:5px 12px; border-radius:8px; border:1.5px solid rgba(255,255,255,.12); color:rgba(255,255,255,.9); }
.sl-range-pill span { color:var(--accent); font-weight:700; }
.sl-range-pill input[type=range] { width:90px; accent-color:var(--accent); cursor:pointer; }
.sl-clear { margin-left:auto; padding:8px 16px; background:transparent; border:1.5px solid rgba(255,255,255,.2); border-radius:8px; color:rgba(255,255,255,.7); font-family:'Outfit',sans-serif; font-size:.82rem; cursor:pointer; transition:border-color .2s,color .2s; flex-shrink:0; }
.sl-clear:hover { border-color:var(--accent); color:var(--accent); }

/* ── WRAP ── */
.sl-wrap { max-width:1440px; margin:0 auto; padding:36px 32px 72px; }

/* ── INFO BAR ── */
.sl-info-bar { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:28px; }
.sl-count { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; letter-spacing:2px; line-height:1; color:var(--text); }
.sl-count span { font-family:'Outfit',sans-serif; font-size:.85rem; font-weight:400; color:var(--muted); letter-spacing:0; margin-left:6px; }

/* ── GRID ── */
.sl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }

/* ── CARD ── */
.sl-card { background:var(--white); display:flex; flex-direction:column; cursor:pointer; position:relative; overflow:hidden; }
.sl-card:hover { z-index:2; }
.sl-card-img { position:relative; height:300px; overflow:hidden; background:${dark ? "#1e293b" : "#f8f8f8"}; }
.sl-card-img img { width:100%; height:100%; object-fit:contain; object-position:center; padding:12px; transition:transform .5s cubic-bezier(.25,.46,.45,.94); display:block; }
.sl-card:hover .sl-card-img img { transform:scale(1.08); }
.sl-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(10,26,47,.72) 0%,transparent 55%); opacity:0; transition:opacity .3s ease; display:flex; align-items:flex-end; padding:18px; }
.sl-card:hover .sl-card-overlay { opacity:1; }
.sl-card-overlay-btn { width:100%; padding:11px; background:var(--accent); color:var(--navy); border:none; border-radius:6px; font-family:'Outfit',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:.5px; cursor:pointer; transition:background .15s; }
.sl-card-overlay-btn:hover { background:#b5d930; }
.sl-card-overlay-btn:disabled { background:rgba(255,255,255,.3); color:rgba(255,255,255,.5); cursor:not-allowed; }
.sl-badge-wrap { position:absolute; top:12px; left:12px; display:flex; flex-direction:column; gap:5px; }
.sl-badge { display:inline-block; padding:3px 9px; border-radius:3px; font-size:.68rem; font-weight:700; letter-spacing:.8px; text-transform:uppercase; }
.sl-badge-out   { background:var(--danger); color:white; }
.sl-badge-marca { background:var(--navy); color:white; }
.sl-badge-hot   { background:#ff4d00; color:white; animation: sl-pulse-badge 1.8s ease-in-out infinite; }
@keyframes sl-pulse-badge { 0%,100%{opacity:1} 50%{opacity:.65} }

/* ── CARD BODY ── */
.sl-card-body { padding:14px 16px 18px; flex:1; display:flex; flex-direction:column; gap:8px; }
.sl-card-row1 { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.sl-card-name { font-weight:700; font-size:.95rem; color:var(--text); line-height:1.25; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sl-card-price { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; color:var(--text); letter-spacing:1px; white-space:nowrap; margin-left:4px; }
.sl-card-desc { font-size:.78rem; color:var(--muted); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sl-chips-section { display:flex; flex-direction:column; gap:5px; }
.sl-chip-label { font-size:.65rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.sl-chips { display:flex; flex-wrap:wrap; gap:4px; }
.sl-chip { padding:2px 9px; border:1.5px solid var(--border); border-radius:3px; font-size:.72rem; font-weight:600; color:var(--text); background:transparent; }
.sl-color-dot { width:16px; height:16px; border-radius:50%; border:2px solid ${dark ? "#334155" : "white"}; box-shadow:0 0 0 1.5px var(--border); display:inline-block; flex-shrink:0; }

/* ── STOCK INDICATOR ── */
.sl-stock-section { margin-top:2px; display:flex; flex-direction:column; gap:5px; }

.sl-stock-bar-wrap { display:flex; flex-direction:column; gap:3px; }
.sl-stock-bar-track { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
.sl-stock-bar-fill { height:100%; border-radius:2px; transition:width .6s ease; }
.sl-stock-bar-fill.critico  { background:var(--danger); }
.sl-stock-bar-fill.bajo     { background:var(--warn); }
.sl-stock-bar-fill.moderado { background:#3b82f6; }
.sl-stock-bar-fill.ok       { background:var(--ok); }

.sl-stock-msg {
  display:flex;
  align-items:center;
  gap:5px;
  font-size:.72rem;
  font-weight:700;
  letter-spacing:.3px;
  border-radius:4px;
  padding:3px 7px;
}
.sl-stock-msg.critico  { color:#fff; background:var(--danger); }
.sl-stock-msg.bajo     { color:#92400e; background:#fef3c7; }
.sl-stock-msg.moderado { color:${dark?"#bfdbfe":"#1e40af"}; background:${dark?"rgba(59,130,246,.15)":"#eff6ff"}; }
.sl-stock-msg.sin_movimiento { color:var(--muted); }
.sl-stock-msg.agotado  { color:var(--danger); }
.sl-stock-msg .sl-dot  { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.sl-stock-msg.critico .sl-dot  { background:#fff; animation:sl-blink .7s step-start infinite; }
.sl-stock-msg.bajo     .sl-dot { background:var(--warn); }
.sl-stock-msg.moderado .sl-dot { background:#3b82f6; }
@keyframes sl-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.sl-stock-details { display:flex; justify-content:space-between; align-items:center; gap:4px; }
.sl-stock-units  { font-size:.7rem; color:var(--muted); }
.sl-stock-units strong { font-weight:700; color:var(--text); }
.sl-stock-time  { font-size:.68rem; color:var(--muted); text-align:right; }
.sl-stock-time.critico { color:var(--danger); font-weight:700; }
.sl-stock-time.bajo    { color:var(--warn);   font-weight:600; }

.sl-ventas-chip {
  display:inline-flex; align-items:center; gap:4px;
  font-size:.68rem; font-weight:700; color:var(--muted);
  background:var(--cream); border:1px solid var(--border);
  border-radius:3px; padding:2px 7px;
  white-space:nowrap;
}
.sl-ventas-chip.hot { color:#ff4d00; border-color:#ff4d0033; background:${dark?"rgba(255,77,0,.08)":"#fff5f0"}; }

/* ── SKELETON ── */
.sl-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }
.sl-skeleton { background:var(--white); }
.sl-skel-img { height:300px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
.sl-skel-body { padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
.sl-skel-line { height:13px; border-radius:3px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
@keyframes sl-shimmer { to{background-position:-200% 0} }

/* ── EMPTY / ERROR ── */
.sl-empty { grid-column:1/-1; text-align:center; padding:80px 24px; }
.sl-empty-icon { font-size:3rem; margin-bottom:12px; opacity:.35; }
.sl-empty h3 { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:2px; color:var(--text); margin-bottom:6px; }
.sl-empty p { color:var(--muted); font-size:.9rem; }
.sl-error { margin-bottom:24px; background:${dark?"#2d1515":"#fff5f5"}; border-left:4px solid var(--danger); padding:14px 18px; color:${dark?"#fca5a5":"#9b2c2c"}; font-size:.9rem; border-radius:4px; }

/* ── RESPONSIVE ── */
@media (max-width:900px) {
  .sl-bar { flex-wrap:wrap; padding:12px 16px; gap:8px; position:static; }
  .sl-bar-brand { width:100%; margin-right:0; font-size:1.1rem; }
  .sl-search-wrap { max-width:100%; margin-right:0; flex:1 1 100%; }
  .sl-sel { flex:1; margin-right:0; font-size:.8rem; padding:8px 10px; }
  .sl-range-pill { flex:1 1 100%; justify-content:space-between; }
  .sl-range-pill input[type=range] { flex:1; }
  .sl-clear { margin-left:0; width:100%; text-align:center; padding:10px; }
  .sl-wrap { padding:20px 16px 48px; }
  .sl-grid, .sl-skeleton-grid { grid-template-columns:repeat(2,1fr); gap:1px; }
  .sl-card-img { height:200px; }
  .sl-skel-img  { height:200px; }
  .sl-card-body { padding:10px 12px 14px; gap:6px; }
  .sl-card-name { font-size:.85rem; }
  .sl-card-price { font-size:1.1rem; }
  .sl-card-desc { display:none; }
  .sl-chips-section { display:none; }
  .sl-count { font-size:1.6rem; }
}

@media (max-width:480px) {
  .sl-grid, .sl-skeleton-grid { grid-template-columns:repeat(2,1fr); gap:1px; }
  .sl-card-img { height:160px; }
  .sl-skel-img  { height:160px; }
  .sl-card-name { font-size:.78rem; -webkit-line-clamp:2; }
  .sl-card-price { font-size:1rem; }
  .sl-card-body { padding:8px 10px 12px; }
  .sl-wrap { padding:12px 8px 40px; }
  .sl-card-overlay { display:none; }
  .sl-stock-details { flex-direction:column; align-items:flex-start; gap:2px; }
}

/* ── NUEVA DIRECCIÓN VISUAL ── */
.sl-cat {
  --accent:#c7f22b;
  background:
    radial-gradient(circle at 92% 0%, ${dark ? "rgba(49,87,245,.12)" : "rgba(49,87,245,.08)"} 0, transparent 26rem),
    var(--cream);
}
.sl-bar {
  min-height:76px;
  padding:12px max(24px,calc((100vw - 1380px)/2));
  gap:10px;
  border-bottom:1px solid rgba(255,255,255,.09);
  box-shadow:0 12px 35px rgba(10,26,47,.12);
}
.sl-bar-brand {
  font-family:'Outfit',sans-serif;
  font-size:.82rem;
  font-weight:800;
  letter-spacing:.15em;
  margin-right:18px;
}
.sl-search-wrap { max-width:390px; margin-right:2px; }
.sl-input,.sl-sel,.sl-range-pill,.sl-clear {
  min-height:44px;
  border-radius:999px;
}
.sl-input { padding-left:42px; }
.sl-sel { padding-inline:16px; }
.sl-range-pill { padding-inline:16px; }
.sl-clear { padding-inline:18px; }
.sl-wrap { max-width:1380px; padding:58px 28px 90px; }
.sl-catalog-intro { max-width:690px; margin-bottom:42px; }
.sl-catalog-kicker {
  display:inline-flex; align-items:center; gap:9px;
  margin-bottom:14px; color:#3157f5;
  font-size:.72rem; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
}
.sl-catalog-kicker::before {
  content:""; width:28px; height:3px; border-radius:99px; background:#ff6938;
}
.sl-catalog-title {
  margin:0; color:var(--text);
  font-family:'Outfit',sans-serif;
  font-size:clamp(2.55rem,5vw,4.8rem);
  font-weight:700; line-height:.96; letter-spacing:-.06em;
}
.sl-catalog-sub {
  max-width:560px; margin:18px 0 0;
  color:var(--muted); font-size:1rem; line-height:1.65;
}
.sl-grid,.sl-skeleton-grid {
  grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
  gap:20px;
}
.sl-card,.sl-skeleton {
  border:1px solid var(--border);
  border-radius:22px;
  box-shadow:0 8px 28px rgba(10,26,47,.055);
  transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
}
.sl-card:hover {
  transform:translateY(-6px);
  border-color:${dark ? "#475569" : "#d3d8df"};
  box-shadow:0 20px 46px rgba(10,26,47,.13);
}
.sl-card-img {
  height:285px;
  margin:8px 8px 0;
  border-radius:16px;
}
.sl-card-img img { padding:18px; }
.sl-card-body { padding:18px 19px 20px; gap:11px; }
.sl-card-name { font-size:1rem; letter-spacing:-.015em; }
.sl-card-price {
  font-family:'Outfit',sans-serif;
  font-size:1.02rem; font-weight:700; letter-spacing:-.02em;
}
.sl-card-desc { font-size:.8rem; }
.sl-badge-wrap { top:16px; left:16px; }
.sl-badge { border-radius:999px; padding:5px 10px; font-size:.62rem; }
.sl-chip { border-radius:999px; padding:4px 10px; }
.sl-stock-bar-track { height:5px; }
.sl-stock-msg { width:fit-content; border-radius:999px; padding:5px 9px; }
.sl-card-overlay {
  inset:auto 16px 16px;
  padding:0;
  background:none;
}
.sl-card-overlay-btn {
  min-height:44px;
  border-radius:999px;
  box-shadow:0 10px 22px rgba(10,26,47,.2);
}
.sl-empty {
  min-height:380px; display:grid; place-content:center;
  border:1px dashed var(--border); border-radius:24px; background:var(--white);
}

@media(max-width:900px) {
  .sl-bar { padding:14px 16px; border-radius:0 0 20px 20px; }
  .sl-wrap { padding:38px 16px 64px; }
  .sl-catalog-intro { margin-bottom:30px; }
  .sl-grid,.sl-skeleton-grid { gap:12px; }
  .sl-card-img { height:220px; }
}
@media(max-width:560px) {
  .sl-catalog-title { font-size:2.7rem; }
  .sl-catalog-sub { font-size:.9rem; }
  .sl-grid,.sl-skeleton-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .sl-card { border-radius:16px; }
  .sl-card-img { height:155px; margin:5px 5px 0; border-radius:12px; }
  .sl-card-img img { padding:8px; }
  .sl-card-body { padding:11px 10px 14px; }
  .sl-card-price { font-size:.9rem; }
  .sl-badge-wrap { top:10px; left:10px; }
  .sl-badge { padding:4px 7px; }
}
`;

const COLOR_MAP = {
  negro:"#111",blanco:"#f9f9f9",rojo:"#e53e3e",azul:"#3182ce",
  verde:"#38a169",amarillo:"#d69e2e",naranja:"#dd6b20",morado:"#805ad5",
  rosa:"#d53f8c",gris:"#718096",cafe:"#92400e",beige:"#d4a574",
  navy:"#1e3a5f",celeste:"#63b3ed",turquesa:"#319795",vino:"#702459",
  olivo:"#68732e",coral:"#e07060",
};
const parseLista = (v) => v ? v.split(",").map(s=>s.trim()).filter(Boolean) : [];

// ── Componente de indicador de stock ────────────────────────
function StockIndicator({ pred, productId, stockTotal, isHot }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!pred) return;
    if (pred.alerta === "critico") {
      intervalRef.current = setInterval(() => {
        setMsgIdx(i => (i + 1) % MENSAJES_CRITICO.length);
      }, 2200);
    } else if (pred.alerta === "bajo") {
      intervalRef.current = setInterval(() => {
        setMsgIdx(i => (i + 1) % MENSAJES_BAJO.length);
      }, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [pred?.alerta]);

  if (!pred) {
    if (stockTotal === 0) {
      return (
        <div className="sl-stock-section">
          <div className="sl-stock-msg agotado">
            <span className="sl-dot" style={{background:"#e53e3e"}}/>
            Sin disponibilidad
          </div>
        </div>
      );
    }
    return null; // Sin predicción y con stock: no mostrar nada
  }

  const { alerta, stock_actual, dias_restantes, ventas_periodo, tasa_diaria } = pred;
  const tiempo = formatTiempo(dias_restantes);

  const pct = alerta === "agotado" ? 0
    : alerta === "sin_movimiento" ? 85
    : Math.min(100, Math.round((dias_restantes / 60) * 100));

  const mensajes = {
    critico: MENSAJES_CRITICO,
    bajo:    MENSAJES_BAJO,
    moderado:MENSAJES_MODERADO,
  };
  const msgList = mensajes[alerta];
  const msg = msgList ? msgList[msgIdx % msgList.length] : null;

  return (
    <div className="sl-stock-section">
      {/* Barra de progreso — solo en alertas activas */}
      {alerta !== "agotado" && alerta !== "sin_movimiento" && (
        <div className="sl-stock-bar-wrap">
          <div className="sl-stock-bar-track">
            <div
              className={`sl-stock-bar-fill ${alerta}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Mensaje de urgencia dinámico */}
      {msg && (
        <div className={`sl-stock-msg ${alerta}`}>
          <span className="sl-dot" />
          {msg}
        </div>
      )}
      {alerta === "agotado" && (
        <div className="sl-stock-msg agotado">
          <span className="sl-dot" style={{background:"#e53e3e"}}/>
          Agotado
        </div>
      )}
      {alerta === "sin_movimiento" && stock_actual > 0 && (
        <div className="sl-stock-msg sin_movimiento">
          ○ {stock_actual} unidades disponibles
        </div>
      )}

      {/* ✅ Unidades + tiempo estimado — SOLO en top ventas */}
      {isHot && alerta !== "agotado" && alerta !== "sin_movimiento" && (
        <div className="sl-stock-details">
          <span className="sl-stock-units">
            <strong>{stock_actual}</strong> {stock_actual === 1 ? "unidad" : "unidades"}
          </span>
          {tiempo && (
            <span className={`sl-stock-time ${alerta}`}>
              Se agota en {tiempo}
            </span>
          )}
        </div>
      )}


    </div>
  );
}

export default function Catalogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, toggleMiniCart } = useCart();
  const { darkMode } = useContext(ThemeContext);

  const [products,     setProducts]     = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [categoria,    setCategoria]    = useState("");
  const [marca,        setMarca]        = useState("");
  const [maxPrice,     setMaxPrice]     = useState(9999);

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("q") || "");
  }, [location.search]);

  // Carga productos
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProducts(data);
        setMaxPrice(Math.max(...data.map(p=>p.precio), 999));
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  // Carga predicciones (endpoint público, sin auth)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/prediccion-publica`);
        if (!res.ok) return;
        const data = await res.json();

        const map = {};
        data.forEach(row => {
          const pid = row.product_id;
          if (!map[pid]) {
            map[pid] = { ...row };
          } else {
            map[pid].stock_actual   += row.stock_actual;
            map[pid].ventas_periodo += row.ventas_periodo;
            const prioridad = { critico:0, bajo:1, moderado:2, sin_movimiento:3, ok:4, agotado:5 };
            if ((prioridad[row.alerta] ?? 99) < (prioridad[map[pid].alerta] ?? 99)) {
              map[pid].alerta           = row.alerta;
              map[pid].dias_restantes   = row.dias_restantes;
              map[pid].fecha_agotamiento= row.fecha_agotamiento;
            }
          }
        });

        Object.values(map).forEach(p => {
          p.tasa_diaria = parseFloat((p.ventas_periodo / 30).toFixed(4));
        });

        setPredicciones(map);
      } catch (_) {}
    })();
  }, []);

  const categorias = useMemo(() => [...new Set(products.map(p=>p.categoria).filter(Boolean))].sort(), [products]);
  const marcas     = useMemo(() => [...new Set(products.map(p=>p.marca).filter(Boolean))].sort(), [products]);
  const maxReal    = useMemo(() => Math.max(...products.map(p=>p.precio), 999), [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products
      .filter(p =>
        (!search    || p.nombre.toLowerCase().includes(q) || (p.marca||"").toLowerCase().includes(q)) &&
        (!categoria || p.categoria === categoria) &&
        (!marca     || p.marca === marca) &&
        p.precio <= maxPrice
      )
      .sort((a, b) => {
        const ventasA = predicciones[a.id]?.ventas_periodo ?? -1;
        const ventasB = predicciones[b.id]?.ventas_periodo ?? -1;
        return ventasB - ventasA;
      });
  }, [products, predicciones, search, categoria, marca, maxPrice]);

  const limpiar = () => { setSearch(""); setCategoria(""); setMarca(""); setMaxPrice(maxReal); };

  const handleAdd = (e, p) => {
    e.stopPropagation();
    addToCart({ id:p.id, title:p.nombre, price:p.precio, img:p.imagen, qty:1,
      size:parseLista(p.talla)[0]||"Único", color:parseLista(p.colores)[0]||"Único" });
    toggleMiniCart();
  };

  return (
    <div className="sl-cat">
      <style>{getCSS(darkMode)}</style>

      <div className="sl-bar">
        <span className="sl-bar-brand">SPORTLIKE</span>
        <div className="sl-search-wrap">
          <span className="sl-search-ico">⌕</span>
          <input className="sl-input" placeholder="Buscar producto, marca..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="sl-sel" value={categoria} onChange={e=>setCategoria(e.target.value)}>
          <option value="">Categoría</option>
          {categorias.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select className="sl-sel" value={marca} onChange={e=>setMarca(e.target.value)}>
          <option value="">Marca</option>
          {marcas.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <div className="sl-range-pill">
          <span>Hasta ${maxPrice.toLocaleString()}</span>
          <input type="range" min="0" max={maxReal} step="50" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} />
        </div>
        <button className="sl-clear" onClick={limpiar}>Limpiar</button>
      </div>

      <div className="sl-wrap">
        {error && <div className="sl-error">⚠ {error}</div>}
        {!loading && !error && (
          <div className="sl-catalog-intro">
            <span className="sl-catalog-kicker">Colección SportLike</span>
            <h1 className="sl-catalog-title">Encuentra lo que te mueve.</h1>
            <p className="sl-catalog-sub">
              Explora equipo elegido para entrenar, competir y disfrutar cada paso.
            </p>
          </div>
        )}

        {loading && (
          <div className="sl-skeleton-grid">
            {Array.from({length:8}).map((_,i) => (
              <div className="sl-skeleton" key={i}>
                <div className="sl-skel-img" />
                <div className="sl-skel-body">
                  <div className="sl-skel-line" style={{width:"65%"}} />
                  <div className="sl-skel-line" style={{width:"40%"}} />
                  <div className="sl-skel-line" />
                  <div className="sl-skel-line" style={{width:"55%"}} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="sl-grid">
            {filtered.length===0 && (
              <div className="sl-empty">
                <div className="sl-empty-icon">◎</div>
                <h3>SIN RESULTADOS</h3>
                <p>Ajusta los filtros para encontrar lo que buscas</p>
              </div>
            )}
            {filtered.map(p => {
              const tallas   = parseLista(p.talla);
              const colores  = parseLista(p.colores);
              const sinStock = p.stock_total === 0;
              const pred     = predicciones[p.id] || null;
              const isHot    = pred && pred.ventas_periodo >= 10;

              return (
                <div className="sl-card" key={p.id}>
                  <div className="sl-card-img" onClick={()=>navigate(`/producto/${p.id}`)}>
                    <img src={p.imagen||`https://picsum.photos/seed/${p.id}/400/350`} alt={p.nombre}
                      onError={e=>{e.target.src=`https://picsum.photos/seed/${p.id}/400/350`;}} />
                    <div className="sl-badge-wrap">
                      {sinStock && <span className="sl-badge sl-badge-out">Agotado</span>}
                      {isHot    && <span className="sl-badge sl-badge-hot">🔥 Top ventas</span>}
                      {p.marca  && <span className="sl-badge sl-badge-marca">{p.marca}</span>}
                    </div>
                    <div className="sl-card-overlay">
                      <button className="sl-card-overlay-btn" disabled={sinStock} onClick={e=>handleAdd(e,p)}>
                        {sinStock ? "Sin disponibilidad" : "+ Agregar al carrito"}
                      </button>
                    </div>
                  </div>

                  <div className="sl-card-body" onClick={()=>navigate(`/producto/${p.id}`)}>
                    <div className="sl-card-row1">
                      <div className="sl-card-name">{p.nombre}</div>
                      <div className="sl-card-price">${Number(p.precio).toLocaleString("es-MX")}</div>
                    </div>
                    {p.descripcion && <p className="sl-card-desc">{p.descripcion}</p>}

                    {/* ── INDICADOR DE STOCK — isHot se pasa como prop ── */}
                    <StockIndicator
                      pred={pred}
                      productId={p.id}
                      stockTotal={p.stock_total}
                      isHot={isHot}
                    />

                    {(tallas.length>0||colores.length>0) && (
                      <div className="sl-chips-section">
                        {tallas.length>0 && (
                          <div>
                            <div className="sl-chip-label">Tallas</div>
                            <div className="sl-chips">
                              {tallas.slice(0,5).map(t=><span key={t} className="sl-chip">{t}</span>)}
                              {tallas.length>5 && <span className="sl-chip">+{tallas.length-5}</span>}
                            </div>
                          </div>
                        )}
                        {colores.length>0 && (
                          <div>
                            <div className="sl-chip-label">Colores</div>
                            <div className="sl-chips" style={{alignItems:"center"}}>
                              {colores.slice(0,7).map(c=>{
                                const hex=COLOR_MAP[c.toLowerCase()];
                                return hex
                                  ? <span key={c} className="sl-color-dot" style={{background:hex}} title={c}/>
                                  : <span key={c} className="sl-chip">{c}</span>;
                              })}
                              {colores.length>7 && <span className="sl-chip">+{colores.length-7}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
