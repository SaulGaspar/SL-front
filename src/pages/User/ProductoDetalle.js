import { API_BASE_URL } from "../../config/api";
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";
import ProductReviews from "../../components/ProductReviews";
import defaultProductImage from "../../assets/PLAYERA.jpg";
import { usePwa } from "../../context/PwaContext";
import CachedCatalogNotice from "../../components/CachedCatalogNotice";
import FavoriteButton from "../../components/FavoriteButton";

const API_URL = API_BASE_URL;

import getCSS from "./ProductoDetalle.styles";

const COLOR_MAP = {
  negro:"#111",blanco:"#f9f9f9",rojo:"#e53e3e",azul:"#3182ce",verde:"#38a169",
  amarillo:"#d69e2e",naranja:"#dd6b20",morado:"#805ad5",rosa:"#d53f8c",
  gris:"#718096",cafe:"#92400e",beige:"#d4a574",navy:"#1e3a5f",celeste:"#63b3ed",
  turquesa:"#319795",vino:"#702459",olivo:"#68732e",coral:"#e07060",
};
const parseLista = (v) => v ? v.split(",").map(s=>s.trim()).filter(Boolean) : [];
const parseSpecifications = (value) => {
  try {
    const data = typeof value === "string" ? JSON.parse(value) : value;
    return data && typeof data === "object" && !Array.isArray(data)
      ? Object.entries(data).filter(([label, detail]) => String(label).trim() && String(detail).trim())
      : [];
  } catch {
    return [];
  }
};

export default function ProductoDetalle() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleMiniCart } = useCart();
  const { darkMode } = useContext(ThemeContext);
  const { online } = usePwa();
  const [savedAt, setSavedAt] = useState(null);

  const [product, setProduct] = useState(null);
  const [images,  setImages]  = useState([]); // galería real
  const [related, setRelated] = useState([]);
  const [recommendationSource, setRecommendationSource] = useState("category_fallback");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeIdx, setActiveIdx] = useState(0); // índice activo en galería
  const [size,    setSize]    = useState("");
  const [color,   setColor]   = useState("");
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [toast,   setToast]   = useState(null);
  const specifications = parseSpecifications(product?.especificaciones);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null); setActiveIdx(0); setRecommendationSource("category_fallback");
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error(navigator.onLine ? "Error cargando producto" : "Este producto aún no está guardado. Consúltalo con internet para verlo después sin conexión.");
        setSavedAt(res.headers.get("X-SportLike-Offline") ? res.headers.get("X-SportLike-Saved-At") : null);
        const prod = await res.json();
        setProduct(prod);

        const gallery = Array.isArray(prod.images) ? prod.images.map((image) => image.url).filter(Boolean) : [];
        setImages(gallery.length ? gallery : (prod.imagen ? [prod.imagen] : []));

        const tallas  = parseLista(prod.talla);
        const colores = parseLista(prod.colores);
        if (tallas.length)  setSize(tallas[0]);
        if (colores.length) setColor(colores[0]);
        const relatedFallback = async () => {
          const relatedRes = await fetch(`${API_URL}/api/products?categoria=${encodeURIComponent(prod.categoria || "")}`);
          if (!relatedRes.ok) return [];
          const products = await relatedRes.json();
          return products.filter((item) => item.id !== prod.id).slice(0, 4);
        };

        try {
          if (!online || res.headers.get("X-SportLike-Offline")) {
            setRelated(await relatedFallback().catch(() => []));
            return;
          }
          const recRes = await fetch(`${API_URL}/api/products/${prod.id}/recommendations?limit=4`);
          if (recRes.ok) {
            const payload = await recRes.json();
            if (Array.isArray(payload.recommendations) && payload.recommendations.length > 0) {
              setRelated(payload.recommendations);
              setRecommendationSource("apriori");
            } else {
              setRelated(await relatedFallback());
            }
          } else {
            setRelated(await relatedFallback());
          }
        } catch {
          setRelated(await relatedFallback());
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id, online]);

  const handleAdd = () => {
    if (!product) return;
    addToCart({ id:product.id, title:product.nombre, price:product.precio, img:images[0]||product.imagen, qty, size:size||"Único", color:color||"Único" });
    setAdded(true);
    setToast(`✓  ${product.nombre} agregado al carrito`);
    toggleMiniCart();
    setTimeout(() => setAdded(false), 2500);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddRelated = (event, item) => {
    event.stopPropagation();
    const itemSizes = parseLista(item.talla);
    const itemColors = parseLista(item.colores);
    addToCart({
      id:item.id,
      title:item.nombre,
      price:item.precio,
      img:item.imagen,
      qty:1,
      size:itemSizes[0]||"Único",
      color:itemColors[0]||"Único",
    });
    setToast(`✓  ${item.nombre} agregado al carrito`);
    toggleMiniCart();
    setTimeout(() => setToast(null), 3000);
  };

  const prevImg = () => setActiveIdx(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveIdx(i => (i + 1) % images.length);

  const fallback = defaultProductImage;
  const mainSrc  = images[activeIdx] || fallback;

  if (loading) return (
    <div className="pd-root"><style>{getCSS(darkMode)}</style>
      <div className="pd-loading"><div className="pd-spinner"/><span>Cargando producto...</span></div>
    </div>
  );

  if (error || !product) return (
    <div className="pd-root"><style>{getCSS(darkMode)}</style>
      <div style={{padding:"48px",textAlign:"center"}}>
        <p style={{color:"#9b2c2c",marginBottom:20}}>{error||"Producto no encontrado"}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>navigate(-1)} style={{padding:"10px 20px",cursor:"pointer"}}>Volver</button>
          <Link to="/catalogo" style={{padding:"10px 20px",background:"#0a1a2f",color:"white",textDecoration:"none"}}>Ver catálogo</Link>
        </div>
      </div>
    </div>
  );

  const tallas  = parseLista(product.talla);
  const colores = parseLista(product.colores);
  const sinStock = product.stock_total === 0;

  return (
    <div className="pd-root">
      <style>{getCSS(darkMode)}</style>
      <CachedCatalogNotice savedAt={savedAt} />

      <div className="pd-bread">
        <Link to="/">Inicio</Link><span className="pd-bread-sep">›</span>
        <Link to="/catalogo">Catálogo</Link>
        {product.categoria&&<><span className="pd-bread-sep">›</span><span>{product.categoria}</span></>}
        <span className="pd-bread-sep">›</span>
        <span className="pd-bread-cur">{product.nombre}</span>
      </div>

      <div className="pd-wrap">
        {/* Galería */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={mainSrc} alt={product.nombre} onError={e=>{ if (e.currentTarget.src !== fallback) e.currentTarget.src=fallback; }}/>
            {sinStock&&<span className="pd-badge-out">Agotado</span>}
            {product.marca&&<span className="pd-badge-marca">{product.marca}</span>}

            {/* Flechas navegación — solo si hay más de 1 imagen */}
            {images.length > 1 && (
              <>
                <button className="pd-img-nav prev" onClick={prevImg}>‹</button>
                <button className="pd-img-nav next" onClick={nextImg}>›</button>
                <span className="pd-img-counter">{activeIdx+1} / {images.length}</span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src,i) => (
                <div key={i} className={`pd-thumb ${activeIdx===i?"active":""}`} onClick={()=>setActiveIdx(i)}>
                  <img src={src} alt={`vista-${i+1}`} onError={e=>{ if (e.currentTarget.src !== fallback) e.currentTarget.src=fallback; }}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          {product.marca&&<div className="pd-tag">{product.marca}</div>}
          <h1 className="pd-title">{product.nombre}</h1>
          <div className="pd-price-row">
            <div className="pd-price">${Number(product.precio).toLocaleString("es-MX")}</div>
            <span className={`pd-stock-badge ${sinStock?"pd-out-stock":"pd-in-stock"}`}>
              {sinStock?"Sin stock":"Disponible"}
            </span>
          </div>
          {product.descripcion&&<p className="pd-desc">{product.descripcion}</p>}

          {tallas.length > 0 && (
            <div className="pd-opt-section">
              <div className="pd-opt-label">Talla — <strong style={{color:"var(--text)"}}>{size}</strong></div>
              <div className="pd-sizes">
                {tallas.map(t=><button key={t} className={`pd-size-btn ${size===t?"active":""}`} onClick={()=>setSize(t)}>{t}</button>)}
              </div>
            </div>
          )}

          {colores.length > 0 && (
            <div className="pd-opt-section">
              <div className="pd-opt-label">Color — <strong style={{color:"var(--text)"}}>{color}</strong></div>
              <div className="pd-colors">
                {colores.map(c=>{
                  const hex=COLOR_MAP[c.toLowerCase()];
                  return hex
                    ?<button key={c} className={`pd-color-btn ${color===c?"active":""}`} style={{background:hex}} title={c} onClick={()=>setColor(c)}/>
                    :<button key={c} className={`pd-color-text-btn ${color===c?"active":""}`} onClick={()=>setColor(c)}>{c}</button>;
                })}
              </div>
            </div>
          )}

          <div className="pd-opt-label" style={{marginBottom:10}}>Cantidad</div>
          <div className="pd-qty-row">
            <button className="pd-qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <input className="pd-qty-val" type="number" value={qty} min={1} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))}/>
            <button className="pd-qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
          </div>

          <div className="pd-ctas">
            <FavoriteButton product={product}/>
            <button className={`pd-btn-add ${added?"added":""}`} disabled={sinStock} onClick={handleAdd}>
              {added?"✓ Agregado al carrito":sinStock?"Sin disponibilidad":"Agregar al carrito"}
            </button>
            <button className="pd-btn-back" onClick={()=>navigate(-1)}>← Volver</button>
          </div>

          <div className="pd-meta">
            <span><strong>Cambios:</strong> <Link to="/cambios">Consulta las condiciones</Link></span>
            {product.categoria&&<span><strong>Categoría:</strong> {product.categoria}</span>}
          </div>
        </div>
      </div>

      <div className={`pd-bottom ${specifications.length ? "" : "pd-bottom-single"}`}>
        {specifications.length > 0 && <div className="pd-card">
          <div className="pd-card-title">Características</div>
          <ul>
            {specifications.map(([label, detail])=><li key={label}><strong>{label}:</strong>&nbsp;{detail}</li>)}
          </ul>
        </div>}
        <div className="pd-card">
          <div className="pd-card-title">Especificaciones</div>
            <div className="pd-spec-grid">
            <div className="pd-spec-item"><span className="pd-spec-k">Marca</span><span className="pd-spec-v">{product.marca||"—"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Categoría</span><span className="pd-spec-v">{product.categoria||"—"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Tallas</span><span className="pd-spec-v">{tallas.join(", ")||"Talla única"}</span></div>
            <div className="pd-spec-item"><span className="pd-spec-k">Colores</span><span className="pd-spec-v">{colores.join(", ")||"—"}</span></div>
            {specifications.map(([label, detail])=><div className="pd-spec-item" key={label}><span className="pd-spec-k">{label}</span><span className="pd-spec-v">{detail}</span></div>)}
          </div>
        </div>
      </div>

        {online ? <ProductReviews productId={product.id} /> : <p className="sl-pwa-cached">Conéctate a internet para consultar o publicar reseñas.</p>}

      {related.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-title">
            {recommendationSource === "apriori" ? "También te puede interesar" : "También te puede gustar"}
          </div>
          {recommendationSource === "apriori" && (
            <div className="pd-related-subtitle">Una gran elección para llevar</div>
          )}
          <div className="pd-related-grid">
            {related.map(r=>(
              <div key={r.id} className="pd-rel-card" onClick={()=>navigate(`/producto/${r.id}`)}>
                <div className="pd-rel-img">
                  <img src={r.imagen || defaultProductImage} alt={r.nombre}
                    onError={e=>{ if (e.currentTarget.src !== defaultProductImage) e.currentTarget.src=defaultProductImage; }}/>
                </div>
                <div className="pd-rel-body">
                  <div className="pd-rel-name">{r.nombre}</div>
                  <div className="pd-rel-price">${Number(r.precio).toLocaleString("es-MX")}</div>
                  <button className="pd-rel-add" onClick={event=>handleAddRelated(event,r)}>Agregar al carrito</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast&&<div className="pd-toast">{toast}</div>}
    </div>
  );
}
