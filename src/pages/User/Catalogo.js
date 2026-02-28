import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "https://sl-back.vercel.app";

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
.sl-card-img { position:relative; height:300px; overflow:hidden; background:${dark ? "#0f172a" : "#ececec"}; }
.sl-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s cubic-bezier(.25,.46,.45,.94); display:block; }
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

/* ── SKELETON ── */
.sl-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }
.sl-skeleton { background:var(--white); }
.sl-skel-img { height:300px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
.sl-skel-body { padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
.sl-skel-line { height:13px; border-radius:3px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
@keyframes sl-shimmer { to{background-position:-200% 0} }

/* ── EMPTY ── */
.sl-empty { grid-column:1/-1; text-align:center; padding:80px 24px; }
.sl-empty-icon { font-size:3rem; margin-bottom:12px; opacity:.35; }
.sl-empty h3 { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:2px; color:var(--text); margin-bottom:6px; }
.sl-empty p { color:var(--muted); font-size:.9rem; }

/* ── ERROR ── */
.sl-error { margin-bottom:24px; background:${dark?"#2d1515":"#fff5f5"}; border-left:4px solid var(--danger); padding:14px 18px; color:${dark?"#fca5a5":"#9b2c2c"}; font-size:.9rem; border-radius:4px; }

/* ── RESPONSIVE ── */
@media (max-width:768px) {
  .sl-bar { flex-wrap:wrap; padding:12px 16px; gap:8px; position:static; }
  .sl-bar-brand { width:100%; margin-right:0; }
  .sl-search-wrap { max-width:100%; margin-right:0; flex:1 1 100%; }
  .sl-sel { flex:1; margin-right:0; }
  .sl-range-pill { display:none; }
  .sl-clear { margin-left:0; }
  .sl-wrap { padding:24px 16px 48px; }
  .sl-grid, .sl-skeleton-grid { grid-template-columns:repeat(2,1fr); gap:1px; }
  .sl-card-img { height:200px; }
}
@media (max-width:420px) { .sl-grid, .sl-skeleton-grid { grid-template-columns:1fr; } }
`;

const COLOR_MAP = {
  negro:"#111",blanco:"#f9f9f9",rojo:"#e53e3e",azul:"#3182ce",
  verde:"#38a169",amarillo:"#d69e2e",naranja:"#dd6b20",morado:"#805ad5",
  rosa:"#d53f8c",gris:"#718096",cafe:"#92400e",beige:"#d4a574",
  navy:"#1e3a5f",celeste:"#63b3ed",turquesa:"#319795",vino:"#702459",
  olivo:"#68732e",coral:"#e07060",
};
const parseLista = (v) => v ? v.split(",").map(s=>s.trim()).filter(Boolean) : [];

export default function Catalogo() {
  const navigate = useNavigate();
  const { addToCart, toggleMiniCart } = useCart();
  const { darkMode } = useContext(ThemeContext);

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca,     setMarca]     = useState("");
  const [maxPrice,  setMaxPrice]  = useState(9999);

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

  const categorias = useMemo(() => [...new Set(products.map(p=>p.categoria).filter(Boolean))].sort(), [products]);
  const marcas     = useMemo(() => [...new Set(products.map(p=>p.marca).filter(Boolean))].sort(), [products]);
  const maxReal    = useMemo(() => Math.max(...products.map(p=>p.precio), 999), [products]);

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    return (
      (!search    || p.nombre.toLowerCase().includes(q) || (p.marca||"").toLowerCase().includes(q)) &&
      (!categoria || p.categoria === categoria) &&
      (!marca     || p.marca === marca) &&
      p.precio <= maxPrice
    );
  }), [products, search, categoria, marca, maxPrice]);

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

      {/* Barra filtros */}
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

      {/* Contenido */}
      <div className="sl-wrap">
        {error && <div className="sl-error">⚠ {error}</div>}
        {!loading && !error && (
          <div className="sl-info-bar">
            <div className="sl-count">{filtered.length} <span>producto{filtered.length!==1?"s":""}</span></div>
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
              const tallas  = parseLista(p.talla);
              const colores = parseLista(p.colores);
              const sinStock = p.stock_total === 0;
              return (
                <div className="sl-card" key={p.id}>
                  <div className="sl-card-img" onClick={()=>navigate(`/producto/${p.id}`)}>
                    <img src={p.imagen||`https://picsum.photos/seed/${p.id}/400/350`} alt={p.nombre}
                      onError={e=>{e.target.src=`https://picsum.photos/seed/${p.id}/400/350`;}} />
                    <div className="sl-badge-wrap">
                      {sinStock && <span className="sl-badge sl-badge-out">Agotado</span>}
                      {p.marca   && <span className="sl-badge sl-badge-marca">{p.marca}</span>}
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
