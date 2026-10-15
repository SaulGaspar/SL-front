import { API_BASE_URL } from "../../config/api";
// ============================================================
// Catalogo.js  —  con predicción de agotamiento de inventario
// ============================================================
import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";
import defaultProductImage from "../../assets/PLAYERA.jpg";
import { usePwa } from "../../context/PwaContext";
import CachedCatalogNotice from "../../components/CachedCatalogNotice";
import FavoriteButton from "../../components/FavoriteButton";
import Feedback from "../../components/Feedback";

const API_URL = API_BASE_URL;

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

import getCSS from "./Catalogo.styles";

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
  const { online } = usePwa();
  const [savedAt, setSavedAt] = useState(null);

  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [categoria,    setCategoria]    = useState("");
  const [marca,        setMarca]        = useState("");
  const [maxPrice,     setMaxPrice]     = useState(9999);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("q") || "");
    setCategoria(params.get("categoria") || "");
  }, [location.search]);

  // Carga productos
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(navigator.onLine ? "Error al cargar productos" : "Aún no tienes un catálogo guardado. Ábrelo una vez con internet para consultarlo sin conexión.");
        setSavedAt(res.headers.get("X-SportLike-Offline") ? res.headers.get("X-SportLike-Saved-At") : null);
        const data = await res.json();
        setProducts(data);
        setMaxPrice(Math.max(...data.map(p=>p.precio), 999));
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [online]);

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
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [products, search, categoria, marca, maxPrice]);

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
      <CachedCatalogNotice savedAt={savedAt} />

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
        {error && <Feedback kind="error" title={error}/>}
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
              <Feedback title="No encontramos productos">Ajusta los filtros para encontrar lo que buscas.</Feedback>
            )}
            {filtered.map(p => {
              const tallas   = parseLista(p.talla);
              const colores  = parseLista(p.colores);
              const sinStock = p.stock_total === 0;
              return (
                <div className="sl-card" key={p.id}>
                  <FavoriteButton product={p} compact/>
                  <div className="sl-card-img" onClick={()=>navigate(`/producto/${p.id}`)}>
                    <img src={p.imagen || defaultProductImage} alt={p.nombre}
                      onError={e=>{ if (e.currentTarget.src !== defaultProductImage) e.currentTarget.src=defaultProductImage; }} />
                    <div className="sl-badge-wrap">
                      {sinStock && <span className="sl-badge sl-badge-out">Agotado</span>}
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
