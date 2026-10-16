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

  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width:700px)").matches);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef(null);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const search = params.get("q") || "";
  const categoria = params.get("categoria") || "";
  const selectedBrands = params.getAll("marca");
  const order = params.get("orden") || "nombre";
  const pageParam = Number(params.get("pagina"));
  const requestedPage = Number.isSafeInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageSize = mobile ? 16 : 40;

  useEffect(() => {
    const media = window.matchMedia("(max-width:700px)");
    const change = () => setMobile(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  // Carga productos
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(navigator.onLine ? "Error al cargar productos" : "Aún no tienes un catálogo guardado. Ábrelo una vez con internet para consultarlo sin conexión.");
        const data = await res.json();
        setProducts(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [online]);

  const categorias = useMemo(() => [...new Set(products.map(p=>p.categoria).filter(Boolean))].sort(), [products]);
  const marcas     = useMemo(() => [...new Set(products.map(p=>p.marca).filter(Boolean))].sort(), [products]);
  const maxReal    = useMemo(() => Math.max(...products.map(p=>p.precio), 999), [products]);
  const priceParam = params.get("precio");
  const maxPrice = priceParam !== null && Number.isFinite(Number(priceParam)) && Number(priceParam) >= 0 ? Math.min(Number(priceParam), maxReal) : maxReal;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products
      .filter(p =>
        (!search    || p.nombre.toLowerCase().includes(q) || (p.marca||"").toLowerCase().includes(q)) &&
        (!categoria || p.categoria === categoria) &&
        (!selectedBrands.length || selectedBrands.includes(p.marca)) &&
        p.precio <= maxPrice
      )
      .sort((a, b) => order === "precio-asc" ? Number(a.precio)-Number(b.precio) : order === "precio-desc" ? Number(b.precio)-Number(a.precio) : a.nombre.localeCompare(b.nombre, "es"));
  }, [products, search, categoria, location.search, order, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageNumbers = [...new Set([1, currentPage-1, currentPage, currentPage+1, totalPages].filter(page => page > 0 && page <= totalPages))].sort((a,b) => a-b);

  function changeFilters(values) {
    const next = new URLSearchParams(location.search);
    Object.entries(values).forEach(([key,value]) => {
      next.delete(key);
      if (Array.isArray(value)) value.forEach(item=>next.append(key,item));
      else if (value !== "" && value != null) next.set(key,String(value));
    });
    next.delete("pagina");
    navigate({pathname:location.pathname, search:next.toString()}, {replace:true, preventScrollReset:true});
  }
  const limpiar = () => changeFilters({q:"", categoria:"", marca:"", precio:"", disponible:"", orden:""});
  const activeFilters = [
    ...(search ? [{label:search, clear:()=>changeFilters({q:""})}] : []),
    ...(categoria ? [{label:categoria, clear:()=>changeFilters({categoria:""})}] : []),
    ...selectedBrands.map(brand=>({label:brand, clear:()=>changeFilters({marca:selectedBrands.filter(item=>item!==brand)})})),
    ...(maxPrice < maxReal ? [{label:`Hasta $${maxPrice.toLocaleString("es-MX")}`,clear:()=>changeFilters({precio:""})}] : [])
  ];
  function goToPage(page) {
    const next = new URLSearchParams(location.search);
    page === 1 ? next.delete("pagina") : next.set("pagina", String(page));
    navigate({pathname:location.pathname, search:next.toString()}, {preventScrollReset:true});
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({block:"start", behavior:"instant"}));
  }

  const handleAdd = (e, p) => {
    e.stopPropagation();
    if(parseLista(p.talla).length || parseLista(p.colores).length){navigate(`/producto/${p.id}`);return;}
    addToCart({ id:p.id, title:p.nombre, price:p.precio, img:p.imagen, qty:1,
      size:parseLista(p.talla)[0]||"Único", color:parseLista(p.colores)[0]||"Único" });
  };

  return (
    <div className="sl-cat">
      <style>{getCSS(darkMode)}</style>
      <div className="sl-catalog-layout">
      <button className="sl-mobile-filters" type="button" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={()=>setFiltersOpen(open=>!open)}><i className="bi bi-sliders" aria-hidden="true"/> {filtersOpen ? "Cerrar filtros" : "Filtros"}</button>
      <aside id="catalog-filters" className={`sl-bar sl-sidebar ${filtersOpen ? "is-open" : ""}`} aria-label="Filtros del catálogo">
        <div className="sl-filter-heading"><span className="sl-filter-symbol"><i className="bi bi-sliders2" aria-hidden="true"/></span><div><span className="sl-bar-brand">A TU MEDIDA</span><h2>Filtra tu equipo</h2></div></div>
        <label className="sl-filter-label" htmlFor="catalog-search">Buscar</label>
        <div className="sl-search-wrap">
          <span className="sl-search-ico">⌕</span>
          <input id="catalog-search" className="sl-input" type="search" placeholder="Producto o marca" value={search} onChange={e=>changeFilters({q:e.target.value})} />
        </div>
        <details className="sl-filter-section" open><summary>Categoría <i className="bi bi-chevron-down" aria-hidden="true"/></summary>
          <div className="sl-filter-options" role="radiogroup" aria-label="Categoría">
            {["",...categorias].map(c=><label className="sl-filter-option" key={c}><input type="radio" name="categoria" checked={categoria===c} onChange={()=>changeFilters({categoria:c})}/><span>{c||"Todas las categorías"}</span></label>)}
          </div>
        </details>
        <details className="sl-filter-section" open><summary>Marca <i className="bi bi-chevron-down" aria-hidden="true"/></summary>
          <p className="sl-filter-hint">Puedes elegir más de una.</p>
          <div className="sl-filter-options">
            {marcas.map(m=><label className="sl-filter-option" key={m}><input type="checkbox" checked={selectedBrands.includes(m)} onChange={()=>changeFilters({marca:selectedBrands.includes(m)?selectedBrands.filter(item=>item!==m):[...selectedBrands,m]})}/><span>{m}</span></label>)}
          </div>
        </details>
        <details className="sl-filter-section" open><summary>Presupuesto <i className="bi bi-chevron-down" aria-hidden="true"/></summary>
        <div className="sl-range-pill">
          <label htmlFor="catalog-price">Precio máximo <strong>${maxPrice.toLocaleString("es-MX")}</strong></label>
          <input id="catalog-price" type="range" min="0" max={maxReal} step="1" value={maxPrice} onChange={e=>changeFilters({precio:e.target.value})} />
        </div>
        <div className="sl-price-limits"><span>$0</span><span>${maxReal.toLocaleString("es-MX")}</span></div>
        </details>
        <button className="sl-clear" type="button" onClick={limpiar}><i className="bi bi-arrow-counterclockwise" aria-hidden="true"/> Limpiar filtros</button>
        <button className="sl-filter-done" type="button" onClick={()=>{setFiltersOpen(false);requestAnimationFrame(()=>resultsRef.current?.scrollIntoView({block:"start"}));}}>Ver productos</button>
      </aside>

      <main className="sl-wrap" ref={resultsRef}>
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

        {!loading && !error && <div className="sl-results-tools">
          <div className="sl-active-filters" aria-label="Filtros activos">{activeFilters.map((filter,index)=><button key={`${filter.label}-${index}`} type="button" onClick={filter.clear} aria-label={`Quitar filtro ${filter.label}`}>{filter.label}<i className="bi bi-x" aria-hidden="true"/></button>)}</div>
          <label className="sl-sort">Ordenar por<select aria-label="Ordenar por" value={order} onChange={e=>changeFilters({orden:e.target.value})}><option value="nombre">Nombre: A–Z</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label>
        </div>}
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
            {pageProducts.map(p => {
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
                        {sinStock ? "Sin disponibilidad" : parseLista(p.talla).length || parseLista(p.colores).length ? "Elegir opciones" : "+ Agregar al carrito"}
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
                  <button className="sl-mobile-card-action" type="button" disabled={sinStock} onClick={e=>handleAdd(e,p)}>{sinStock ? "Agotado" : tallas.length || colores.length ? "Elegir opciones" : "Agregar al carrito"}</button>
                </div>
              );
            })}
          </div>
        )}
        {!loading && !error && totalPages > 1 && <nav className="sl-pagination" aria-label="Páginas del catálogo">
          <button type="button" disabled={currentPage === 1} onClick={()=>goToPage(currentPage-1)}>Anterior</button>
          {pageNumbers.map((page,index)=><React.Fragment key={page}>
            {index > 0 && page-pageNumbers[index-1] > 1 && <span aria-hidden="true">…</span>}
            <button type="button" aria-label={`Página ${page}`} aria-current={currentPage === page ? "page" : undefined} onClick={()=>goToPage(page)}>{page}</button>
          </React.Fragment>)}
          <button type="button" disabled={currentPage === totalPages} onClick={()=>goToPage(currentPage+1)}>Siguiente</button>
        </nav>}
      </main>
      </div>
    </div>
  );
}
