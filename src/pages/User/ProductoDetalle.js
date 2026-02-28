import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "https://sl-back.vercel.app";

const getCSS = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

.pd-root {
  --navy:   #0a1a2f;
  --navy2:  #1e3a5f;
  --cream:  ${dark ? "#0f172a"  : "#f7f5f0"};
  --white:  ${dark ? "#1e293b"  : "#ffffff"};
  --muted:  ${dark ? "#94a3b8"  : "#8a8f98"};
  --border: ${dark ? "#334155"  : "#e4e2dd"};
  --text:   ${dark ? "#e2e8f0"  : "#0a1a2f"};
  --accent: #c8f03c;
  --danger: #e53e3e;
  --green:  #38a169;
  font-family:'Outfit',sans-serif;
  background:var(--cream);
  color:var(--text);
  min-height:100vh;
}

/* Breadcrumb */
.pd-bread { background:var(--navy); padding:12px 48px; display:flex; align-items:center; gap:8px; font-size:.8rem; color:rgba(255,255,255,.45); }
.pd-bread a { color:rgba(255,255,255,.55); text-decoration:none; transition:color .15s; }
.pd-bread a:hover { color:var(--accent); }
.pd-bread-sep { color:rgba(255,255,255,.2); }
.pd-bread-cur { color:rgba(255,255,255,.8); font-weight:500; }

/* Layout */
.pd-wrap { max-width:1300px; margin:0 auto; padding:40px 48px 80px; display:grid; grid-template-columns:1fr 1fr; gap:64px; }

/* Galería */
.pd-gallery { display:flex; flex-direction:column; gap:12px; }
.pd-main-img { position:relative; background:var(--white); overflow:hidden; aspect-ratio:4/5; }
.pd-main-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
.pd-main-img:hover img { transform:scale(1.04); }
.pd-badge-out { position:absolute; top:16px; left:16px; background:var(--danger); color:white; font-size:.7rem; font-weight:700; letter-spacing:1px; padding:5px 12px; text-transform:uppercase; }
.pd-badge-marca { position:absolute; top:16px; right:16px; background:var(--navy); color:white; font-size:.7rem; font-weight:700; letter-spacing:1px; padding:5px 12px; text-transform:uppercase; }
.pd-thumbs { display:flex; gap:8px; }
.pd-thumb { flex:1; aspect-ratio:1; overflow:hidden; background:var(--white); cursor:pointer; border:2px solid transparent; transition:border-color .2s; }
.pd-thumb.active { border-color:var(--text); }
.pd-thumb img { width:100%; height:100%; object-fit:cover; }

/* Info */
.pd-info { display:flex; flex-direction:column; }
.pd-tag { font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
.pd-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.4rem,4vw,3.6rem); letter-spacing:2px; line-height:1; color:var(--text); margin-bottom:16px; }
.pd-price-row { display:flex; align-items:baseline; gap:14px; margin-bottom:6px; }
.pd-price { font-family:'Bebas Neue',sans-serif; font-size:2.4rem; letter-spacing:2px; color:var(--text); }
.pd-stock-badge { font-size:.75rem; font-weight:700; letter-spacing:.5px; padding:4px 12px; border-radius:2px; }
.pd-in-stock  { background:${dark?"#14532d":"#c6f6d5"}; color:${dark?"#86efac":"#276749"}; }
.pd-out-stock { background:${dark?"#450a0a":"#fed7d7"}; color:${dark?"#fca5a5":"#9b2c2c"}; }
.pd-desc { font-size:.9rem; color:var(--muted); line-height:1.7; margin-bottom:28px; border-top:1px solid var(--border); padding-top:20px; }

/* Opciones */
.pd-opt-label { font-size:.72rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
.pd-opt-section { margin-bottom:22px; }
.pd-sizes { display:flex; flex-wrap:wrap; gap:8px; }
.pd-size-btn { min-width:46px; padding:8px 10px; border:1.5px solid var(--border); background:transparent; color:var(--text); font-family:'Outfit',sans-serif; font-size:.85rem; font-weight:600; cursor:pointer; border-radius:4px; transition:all .15s; }
.pd-size-btn:hover { border-color:var(--text); }
.pd-size-btn.active { background:var(--text); color:var(--cream); border-color:var(--text); }
.pd-colors { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
.pd-color-btn { width:28px; height:28px; border-radius:50%; border:3px solid transparent; cursor:pointer; transition:box-shadow .15s,transform .15s; box-shadow:0 0 0 1.5px var(--border); }
.pd-color-btn:hover { transform:scale(1.15); }
.pd-color-btn.active { box-shadow:0 0 0 3px var(--text); }
.pd-color-text-btn { padding:6px 14px; border:1.5px solid var(--border); background:transparent; color:var(--text); font-family:'Outfit',sans-serif; font-size:.82rem; font-weight:600; cursor:pointer; border-radius:20px; transition:all .15s; }
.pd-color-text-btn.active { background:var(--text); color:var(--cream); border-color:var(--text); }

/* Cantidad */
.pd-qty-row { display:flex; align-items:center; margin-bottom:28px; width:fit-content; border:1.5px solid var(--border); border-radius:4px; overflow:hidden; }
.pd-qty-btn { width:40px; height:44px; background:transparent; border:none; font-size:1.3rem; color:var(--text); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.pd-qty-btn:hover { background:var(--border); }
.pd-qty-val { width:52px; height:44px; border:none; border-left:1.5px solid var(--border); border-right:1.5px solid var(--border); text-align:center; font-family:'Outfit',sans-serif; font-size:.95rem; font-weight:700; color:var(--text); background:var(--white); }
.pd-qty-val:focus { outline:none; }

/* CTAs */
.pd-ctas { display:flex; gap:10px; margin-bottom:24px; }
.pd-btn-add { flex:1; padding:16px 24px; background:var(--navy); color:white; border:none; font-family:'Outfit',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:4px; transition:background .2s,transform .15s; }
.pd-btn-add:hover:not(:disabled) { background:var(--navy2); transform:translateY(-1px); }
.pd-btn-add:disabled { background:var(--border); color:var(--muted); cursor:not-allowed; }
.pd-btn-add.added { background:var(--green); }
.pd-btn-back { padding:16px 20px; background:transparent; color:var(--text); border:1.5px solid var(--border); font-family:'Outfit',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; border-radius:4px; transition:border-color .15s,background .15s; }
.pd-btn-back:hover { border-color:var(--text); background:var(--border); }

/* Meta */
.pd-meta { display:flex; flex-direction:column; gap:6px; padding-top:20px; border-top:1px solid var(--border); font-size:.82rem; color:var(--muted); }
.pd-meta span strong { color:var(--text); font-weight:600; }

/* Specs */
.pd-bottom { max-width:1300px; margin:0 auto; padding:0 48px 80px; display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.pd-card { background:var(--white); padding:28px; }
.pd-card-title { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:2px; color:var(--text); margin-bottom:18px; padding-bottom:12px; border-bottom:2px solid var(--text); display:inline-block; }
.pd-card ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
.pd-card li { font-size:.88rem; color:var(--muted); display:flex; align-items:flex-start; gap:10px; line-height:1.4; }
.pd-card li::before { content:"—"; color:var(--accent); font-weight:700; flex-shrink:0; }
.pd-spec-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.pd-spec-item { display:flex; flex-direction:column; gap:2px; }
.pd-spec-k { font-size:.72rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.pd-spec-v { font-size:.9rem; font-weight:600; color:var(--text); }

/* Relacionados */
.pd-related { max-width:1300px; margin:0 auto; padding:0 48px 80px; }
.pd-related-title { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:3px; color:var(--text); margin-bottom:20px; }
.pd-related-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
.pd-rel-card { background:var(--white); cursor:pointer; overflow:hidden; }
.pd-rel-card:hover .pd-rel-img img { transform:scale(1.06); }
.pd-rel-img { height:200px; overflow:hidden; }
.pd-rel-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
.pd-rel-body { padding:12px; }
.pd-rel-name { font-size:.85rem; font-weight:700; color:var(--text); margin-bottom:4px; }
.pd-rel-price { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; color:var(--text); letter-spacing:1px; }

/* Toast */
.pd-toast { position:fixed; bottom:28px; right:28px; z-index:9999; background:var(--navy); color:white; padding:14px 22px; border-radius:6px; font-family:'Outfit',sans-serif; font-size:.88rem; font-weight:600; box-shadow:0 12px 32px rgba(10,26,47,.3); display:flex; align-items:center; gap:10px; animation:pd-slide-up .3s ease; border-left:4px solid var(--accent); }
@keyframes pd-slide-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

/* Loading */
.pd-loading { min-height:60vh; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:16px; color:var(--muted); }
.pd-spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--navy); border-radius:50%; animation:pd-spin .8s linear infinite; }
@keyframes pd-spin { to{transform:rotate(360deg)} }

/* Responsive */
@media (max-width:900px) {
  .pd-wrap { grid-template-columns:1fr; gap:32px; padding:24px 20px 40px; }
  .pd-bottom { grid-template-columns:1fr; padding:0 20px 40px; }
  .pd-related { padding:0 20px 40px; }
  .pd-related-grid { grid-template-columns:repeat(2,1fr); }
  .pd-bread { padding:10px 20px; }
}
`;

const COLOR_MAP = {
  negro:"#111",blanco:"#f9f9f9",rojo:"#e53e3e",azul:"#3182ce",verde:"#38a169",
  amarillo:"#d69e2e",naranja:"#dd6b20",morado:"#805ad5",rosa:"#d53f8c",
  gris:"#718096",cafe:"#92400e",beige:"#d4a574",navy:"#1e3a5f",celeste:"#63b3ed",
  turquesa:"#319795",vino:"#702459",olivo:"#68732e",coral:"#e07060",
};
const parseLista = (v) => v ? v.split(",").map(s=>s.trim()).filter(Boolean) : [];

export default function ProductoDetalle() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleMiniCart } = useCart();
  const { darkMode } = useContext(ThemeContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [size,    setSize]    = useState("");
  const [color,   setColor]   = useState("");
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [toast,   setToast]   = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("Error cargando producto");
        const all  = await res.json();
        const prod = all.find(p => p.id === Number(id));
        if (!prod) throw new Error("Producto no encontrado");
        setProduct(prod);
        setMainImg(prod.imagen || "");
        const tallas  = parseLista(prod.talla);
        const colores = parseLista(prod.colores);
        if (tallas.length)  setSize(tallas[0]);
        if (colores.length) setColor(colores[0]);
        setRelated(all.filter(p => p.id !== prod.id && p.categoria === prod.categoria && p.activo !== 0).slice(0,4));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart({ id:product.id, title:product.nombre, price:product.precio, img:product.imagen, qty, size:size||"Único", color:color||"Único" });
    setAdded(true);
    setToast(`✓  ${product.nombre} agregado al carrito`);
    toggleMiniCart();
    setTimeout(() => setAdded(false), 2500);
    setTimeout(() => setToast(null), 3000);
  };

  const imgSrc = (src) => src || `https://picsum.photos/seed/${product?.id}/600/750`;

  if (loading) return (
    <div className="pd-root"><style>{getCSS(darkMode)}</style>
      <div className="pd-loading"><div className="pd-spinner" /><span>Cargando producto...</span></div>
    </div>
  );

  if (error || !product) return (
    <div className="pd-root"><style>{getCSS(darkMode)}</style>
      <div style={{padding:"48px",textAlign:"center"}}>
        <p style={{color:"#9b2c2c",marginBottom:20}}>{error || "Producto no encontrado"}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={() => navigate(-1)} style={{padding:"10px 20px",cursor:"pointer"}}>Volver</button>
          <Link to="/catalogo" style={{padding:"10px 20px",background:"#0a1a2f",color:"white",textDecoration:"none"}}>Ver catálogo</Link>
        </div>
      </div>
    </div>
  );

  const tallas   = parseLista(product.talla);
  const colores  = parseLista(product.colores);
  const sinStock = product.stock_total === 0;
  const thumbImgs = [product.imagen, product.imagen, product.imagen].filter(Boolean).slice(0,3);

  return (
    <div className="pd-root">
      <style>{getCSS(darkMode)}</style>

      <div className="pd-bread">
        <Link to="/">Inicio</Link><span className="pd-bread-sep">›</span>
        <Link to="/catalogo">Catálogo</Link>
        {product.categoria && <><span className="pd-bread-sep">›</span><span>{product.categoria}</span></>}
        <span className="pd-bread-sep">›</span>
        <span className="pd-bread-cur">{product.nombre}</span>
      </div>

      <div className="pd-wrap">
        {/* Galería */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={imgSrc(mainImg)} alt={product.nombre} onError={e=>{e.target.src=imgSrc("");}} />
            {sinStock && <span className="pd-badge-out">Agotado</span>}
            {product.marca && <span className="pd-badge-marca">{product.marca}</span>}
          </div>
          {thumbImgs.length > 1 && (
            <div className="pd-thumbs">
              {thumbImgs.map((src,i) => (
                <div key={i} className={`pd-thumb ${mainImg===src?"active":""}`} onClick={()=>setMainImg(src)}>
                  <img src={imgSrc(src)} alt="" onError={e=>{e.target.src=`https://picsum.photos/seed/${product.id+i}/200/200`;}} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          {product.marca && <div className="pd-tag">{product.marca}</div>}
          <h1 className="pd-title">{product.nombre}</h1>
          <div className="pd-price-row">
            <div className="pd-price">${Number(product.precio).toLocaleString("es-MX")}</div>
            <span className={`pd-stock-badge ${sinStock?"pd-out-stock":"pd-in-stock"}`}>
              {sinStock ? "Sin stock" : "Disponible"}
            </span>
          </div>
          {product.descripcion && <p className="pd-desc">{product.descripcion}</p>}

          {tallas.length > 0 && (
            <div className="pd-opt-section">
              <div className="pd-opt-label">Talla — <strong style={{color:"var(--text)"}}>{size}</strong></div>
              <div className="pd-sizes">
                {tallas.map(t => <button key={t} className={`pd-size-btn ${size===t?"active":""}`} onClick={()=>setSize(t)}>{t}</button>)}
              </div>
            </div>
          )}

          {colores.length > 0 && (
            <div className="pd-opt-section">
              <div className="pd-opt-label">Color — <strong style={{color:"var(--text)"}}>{color}</strong></div>
              <div className="pd-colors">
                {colores.map(c => {
                  const hex = COLOR_MAP[c.toLowerCase()];
                  return hex
                    ? <button key={c} className={`pd-color-btn ${color===c?"active":""}`} style={{background:hex}} title={c} onClick={()=>setColor(c)} />
                    : <button key={c} className={`pd-color-text-btn ${color===c?"active":""}`} onClick={()=>setColor(c)}>{c}</button>;
                })}
              </div>
            </div>
          )}

          <div className="pd-opt-label" style={{marginBottom:10}}>Cantidad</div>
          <div className="pd-qty-row">
            <button className="pd-qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <input className="pd-qty-val" type="number" value={qty} min={1} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))} />
            <button className="pd-qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
          </div>

          <div className="pd-ctas">
            <button className={`pd-btn-add ${added?"added":""}`} disabled={sinStock} onClick={handleAdd}>
              {added ? "✓ Agregado al carrito" : sinStock ? "Sin disponibilidad" : "Agregar al carrito"}
            </button>
            <button className="pd-btn-back" onClick={()=>navigate(-1)}>← Volver</button>
          </div>

          <div className="pd-meta">
            <span><strong>Envío:</strong> Entrega en 2–5 días hábiles</span>
            <span><strong>Devoluciones:</strong> 30 días por defectos de fábrica</span>
            {product.categoria && <span><strong>Categoría:</strong> {product.categoria}</span>}
          </div>
        </div>
      </div>

      <div className="pd-bottom">
        <div className="pd-card">
          <div className="pd-card-title">Beneficios</div>
          <ul>
            <li>Material de alta calidad para máximo rendimiento deportivo</li>
            <li>Comodidad superior en cualquier actividad o entrenamiento</li>
            <li>Durabilidad probada bajo uso intenso y condiciones exigentes</li>
            <li>Diseño ergonómico que se adapta a tu movimiento</li>
          </ul>
        </div>
        <div className="pd-card">
          <div className="pd-card-title">Especificaciones</div>
          <div className="pd-spec-grid">
            <div className="pd-spec-item"><span className="pd-spec-k">Marca</span><span className="pd-spec-v">{product.marca||"—"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Categoría</span><span className="pd-spec-v">{product.categoria||"—"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Tallas</span><span className="pd-spec-v">{tallas.join(", ")||"Talla única"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Colores</span><span className="pd-spec-v">{colores.join(", ")||"—"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Material</span><span className="pd-spec-v">Mezcla sintética deportiva</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Cuidados</span><span className="pd-spec-v">Lavar a máquina ciclo suave</span></div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-title">También te puede gustar</div>
          <div className="pd-related-grid">
            {related.map(r => (
              <div key={r.id} className="pd-rel-card" onClick={()=>navigate(`/producto/${r.id}`)}>
                <div className="pd-rel-img">
                  <img src={r.imagen||`https://picsum.photos/seed/${r.id}/300/200`} alt={r.nombre}
                    onError={e=>{e.target.src=`https://picsum.photos/seed/${r.id}/300/200`;}} />
                </div>
                <div className="pd-rel-body">
                  <div className="pd-rel-name">{r.nombre}</div>
                  <div className="pd-rel-price">${Number(r.precio).toLocaleString("es-MX")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="pd-toast">{toast}</div>}
    </div>
  );
}
