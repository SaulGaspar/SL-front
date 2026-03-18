import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const fmtMXN = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n||0);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --navy:  #0a1a2f;
  --navy2: #1e3a5f;
  --accent:#c8f03c;
  --white: #ffffff;
  --muted: rgba(255,255,255,.5);
}

.crt { font-family:'Outfit',sans-serif; min-height:100vh; background:#f0f2f5; }

/* Hero header */
.crt-header {
  background:linear-gradient(135deg,#0a1a2f 0%,#1e3a5f 100%);
  padding:32px 0 28px;
  margin-bottom:32px;
}
.crt-header-inner {
  max-width:1100px; margin:0 auto; padding:0 24px;
  display:flex; align-items:center; justify-content:space-between;
}
.crt-header h1 {
  font-family:'Bebas Neue',sans-serif;
  font-size:2.4rem; letter-spacing:3px; color:white; margin:0;
}
.crt-header-sub { font-size:.85rem; color:rgba(255,255,255,.5); margin-top:4px; }
.crt-count-pill {
  background:rgba(200,240,60,.15); border:1px solid rgba(200,240,60,.3);
  color:#c8f03c; font-size:.8rem; font-weight:700;
  padding:5px 14px; border-radius:20px; letter-spacing:.5px;
}

/* Layout */
.crt-body { max-width:1100px; margin:0 auto; padding:0 24px 60px; display:grid; grid-template-columns:1fr 360px; gap:28px; align-items:start; }

/* Items panel */
.crt-panel { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.07); }
.crt-panel-head {
  padding:18px 24px; border-bottom:1px solid #f0f4f8;
  display:flex; align-items:center; justify-content:space-between;
}
.crt-panel-title { font-size:.88rem; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:.8px; }

/* Item row */
.crt-item {
  display:flex; align-items:center; gap:18px;
  padding:20px 24px; border-bottom:1px solid #f5f7fa;
  transition:background .15s;
}
.crt-item:hover { background:#fafbfc; }
.crt-item:last-child { border-bottom:none; }

.crt-item-img {
  width:90px; height:90px; border-radius:12px;
  object-fit:cover; flex-shrink:0;
  background:#f0f4f8; border:1px solid #e2e8f0;
}
.crt-item-info { flex:1; min-width:0; }
.crt-item-name { font-size:.97rem; font-weight:700; color:#1e3a5f; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.crt-item-meta { font-size:.78rem; color:#a0aec0; display:flex; gap:10px; flex-wrap:wrap; }
.crt-item-meta span { display:flex; align-items:center; gap:4px; }
.crt-item-price { font-size:.9rem; font-weight:700; color:#1e3a5f; margin-top:6px; font-family:'Outfit',monospace; }

/* Qty control */
.crt-qty {
  display:flex; align-items:center; gap:0;
  background:#f0f4f8; border-radius:8px; overflow:hidden;
  border:1px solid #e2e8f0;
}
.crt-qty-btn {
  width:32px; height:32px; border:none; background:transparent;
  font-size:1rem; font-weight:700; cursor:pointer; color:#1e3a5f;
  display:flex; align-items:center; justify-content:center;
  transition:background .15s;
}
.crt-qty-btn:hover { background:#e2e8f0; }
.crt-qty-val { width:32px; text-align:center; font-size:.88rem; font-weight:700; color:#1e3a5f; }

.crt-item-right { display:flex; flex-direction:column; align-items:flex-end; gap:10px; flex-shrink:0; }
.crt-item-subtotal { font-family:'Outfit',monospace; font-size:1.05rem; font-weight:700; color:#276749; }
.crt-remove {
  background:none; border:none; cursor:pointer; color:#a0aec0;
  font-size:.76rem; font-weight:600; display:flex; align-items:center; gap:4px;
  padding:3px 8px; border-radius:6px; transition:all .15s;
}
.crt-remove:hover { color:#e53e3e; background:#fff5f5; }

/* Empty */
.crt-empty {
  padding:80px 24px; text-align:center;
}
.crt-empty-icon {
  width:80px; height:80px; background:#f0f4f8; border-radius:20px;
  display:flex; align-items:center; justify-content:center;
  font-size:2rem; margin:0 auto 20px;
}
.crt-empty h3 { color:#1e3a5f; margin:0 0 8px; font-size:1.2rem; }
.crt-empty p  { color:#a0aec0; font-size:.88rem; margin:0 0 24px; }
.crt-empty-btn {
  background:#1e3a5f; color:white; border:none;
  padding:12px 28px; border-radius:10px; font-size:.9rem;
  font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif;
}

/* Resumen lateral */
.crt-summary { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.07); position:sticky; top:20px; }
.crt-summary-head {
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  padding:20px 24px;
}
.crt-summary-head h3 { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:2px; color:white; margin:0 0 2px; }
.crt-summary-head p  { font-size:.76rem; color:rgba(255,255,255,.5); margin:0; }
.crt-summary-body { padding:20px 24px; }

.crt-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; }
.crt-row-lbl { font-size:.85rem; color:#718096; }
.crt-row-val { font-size:.88rem; font-weight:600; color:#2d3748; }
.crt-row-val.green { color:#276749; }
.crt-divider { height:1px; background:#f0f4f8; margin:10px 0; }
.crt-total-row { display:flex; justify-content:space-between; align-items:center; margin-top:6px; }
.crt-total-lbl { font-size:1rem; font-weight:700; color:#1e3a5f; }
.crt-total-val { font-family:'Outfit',monospace; font-size:1.5rem; font-weight:700; color:#1e3a5f; }

/* Promo */
.crt-promo { display:flex; gap:8px; margin:16px 0; }
.crt-promo input {
  flex:1; padding:10px 13px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.85rem; font-family:'Outfit',sans-serif;
}
.crt-promo input:focus { outline:none; border-color:#c8f03c; }
.crt-promo-btn {
  padding:10px 14px; background:#1e3a5f; color:white; border:none;
  border-radius:8px; font-size:.82rem; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif;
}
.crt-promo-btn:hover { background:#2c5282; }

/* Botón pagar */
.crt-pay-btn {
  width:100%; padding:16px; border:none; border-radius:12px;
  font-family:'Outfit',sans-serif; font-size:1rem; font-weight:700;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  color:white; letter-spacing:.5px; margin-top:6px;
  transition:all .2s;
}
.crt-pay-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(30,58,95,.3); }
.crt-pay-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

.crt-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:12px; font-size:.74rem; color:#a0aec0; }

/* Envío gratis badge */
.crt-free-ship { background:#c6f6d5; color:#276749; font-size:.74rem; font-weight:700; padding:3px 10px; border-radius:20px; }

@media(max-width:900px) {
  .crt-body { grid-template-columns:1fr; }
  .crt-summary { position:static; }
  .crt-header h1 { font-size:1.8rem; }
}
`;

export default function Carrito() {
  const { cart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const getPrice = i => Number(i.precio || i.price || 0);
  const getQty   = i => Number(i.qty || i.cantidad || 1);

  const subtotal = cart.reduce((s, i) => s + getPrice(i) * getQty(i), 0);
  const shipping = subtotal >= 1500 ? 0 : cart.length ? 75 : 0;
  const total    = subtotal + shipping;

  const handlePago = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/pago", { state: { total } });
    } else {
      navigate("/login", { state: { from: "/carrito" } });
    }
  };

  return (
    <div className="crt">
      <style>{CSS}</style>

      {/* Header */}
      <div className="crt-header">
        <div className="crt-header-inner">
          <div>
            <h1>Tu carrito</h1>
            <div className="crt-header-sub">
              {cart.length > 0
                ? `${cart.reduce((s,i)=>s+getQty(i),0)} artículo${cart.reduce((s,i)=>s+getQty(i),0)!==1?"s":""}`
                : "Carrito vacío"}
            </div>
          </div>
          {cart.length > 0 && (
            <div className="crt-count-pill">
              {cart.length} producto{cart.length!==1?"s":""}
            </div>
          )}
        </div>
      </div>

      <div className="crt-body">

        {/* Lista de productos */}
        <div className="crt-panel">
          <div className="crt-panel-head">
            <span className="crt-panel-title">Productos</span>
            {subtotal >= 1500 ? (
              <span className="crt-free-ship">🚚 Envío gratis</span>
            ) : (
              <span style={{fontSize:".76rem",color:"#a0aec0"}}>
                Agrega {fmtMXN(1500-subtotal)} más para envío gratis
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="crt-empty">
              <div className="crt-empty-icon">🛍️</div>
              <h3>Tu carrito está vacío</h3>
              <p>Explora nuestro catálogo y encuentra lo que buscas</p>
              <button className="crt-empty-btn" onClick={()=>navigate("/catalogo")}>
                Ver catálogo
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="crt-item">
                <img
                  src={item.imagen||item.img}
                  alt={item.nombre||item.title}
                  className="crt-item-img"
                  onError={e=>{e.target.src="https://via.placeholder.com/90";}}
                />
                <div className="crt-item-info">
                  <div className="crt-item-name">{item.nombre||item.title||"Producto"}</div>
                  <div className="crt-item-meta">
                    {(item.talla||item.size) && <span>📐 {item.talla||item.size}</span>}
                    {item.color && <span>🎨 {item.color}</span>}
                    {item.marca && <span>🏷️ {item.marca}</span>}
                  </div>
                  <div className="crt-item-price">{fmtMXN(getPrice(item))} c/u</div>
                </div>
                <div className="crt-item-right">
                  <div className="crt-item-subtotal">{fmtMXN(getPrice(item)*getQty(item))}</div>
                  <div className="crt-qty">
                    <button className="crt-qty-btn" onClick={()=>updateQty(item,Math.max(1,getQty(item)-1))}>−</button>
                    <span className="crt-qty-val">{getQty(item)}</span>
                    <button className="crt-qty-btn" onClick={()=>updateQty(item,getQty(item)+1)}>+</button>
                  </div>
                  <button className="crt-remove" onClick={()=>removeItem(item)}>
                    ✕ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen */}
        {cart.length > 0 && (
          <div className="crt-summary">
            <div className="crt-summary-head">
              <h3>Resumen</h3>
              <p>Detalle de tu compra</p>
            </div>
            <div className="crt-summary-body">
              <div className="crt-row">
                <span className="crt-row-lbl">Subtotal</span>
                <span className="crt-row-val">{fmtMXN(subtotal)}</span>
              </div>
              <div className="crt-row">
                <span className="crt-row-lbl">Envío</span>
                <span className={`crt-row-val ${shipping===0?"green":""}`}>
                  {shipping===0?"¡Gratis!":fmtMXN(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <div style={{fontSize:".74rem",color:"#a0aec0",marginTop:-4,marginBottom:4}}>
                  Envío gratis en compras mayores a {fmtMXN(1500)}
                </div>
              )}

              <div className="crt-divider"/>

              <div className="crt-total-row">
                <span className="crt-total-lbl">Total</span>
                <span className="crt-total-val">{fmtMXN(total)}</span>
              </div>

              <button className="crt-pay-btn" onClick={handlePago} disabled={cart.length===0}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Proceder al pago
              </button>

              <div className="crt-secure">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Pago 100% seguro · SSL cifrado
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}