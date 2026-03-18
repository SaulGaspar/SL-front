import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const API_URL = "https://sl-back.vercel.app";

// ── Helpers ───────────────────────────────────────────────────────────────
const fmtMXN = n =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

const fmtTarjeta = v =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const fmtExp = v => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

const tipoTarjeta = n => {
  const s = n.replace(/\s/g, "");
  if (/^4/.test(s)) return "visa";
  if (/^5[1-5]/.test(s)) return "mastercard";
  if (/^3[47]/.test(s)) return "amex";
  return null;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.pago * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

.pago-wrap {
  min-height: 100vh; padding: 40px 20px;
  background: #f5f7fa;
  display: flex; flex-direction: column; align-items: center;
}

.pago-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 28px;
  width: 100%;
  max-width: 900px;
  align-items: start;
}

/* Resumen */
.pago-resumen {
  background: white; border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  padding: 28px; position: sticky; top: 24px;
}
.pago-resumen h3 {
  margin: 0 0 20px; font-size: 1rem; font-weight: 700;
  color: #1e3a5f; text-transform: uppercase; letter-spacing: .5px;
}
.pago-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid #f0f4f8;
}
.pago-item:last-of-type { border-bottom: none; }
.pago-item-img {
  width: 52px; height: 52px; border-radius: 10px;
  object-fit: cover; background: #f0f4f8; flex-shrink: 0;
}
.pago-item-info { flex: 1; min-width: 0; }
.pago-item-name { font-size: .88rem; font-weight: 600; color: #1e3a5f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pago-item-sub  { font-size: .76rem; color: #a0aec0; margin-top: 2px; }
.pago-item-price { font-family: 'JetBrains Mono', monospace; font-size: .9rem; font-weight: 700; color: #276749; white-space: nowrap; }
.pago-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 0 0; margin-top: 12px; border-top: 2px solid #e2e8f0;
}
.pago-total-lbl { font-size: .88rem; color: #718096; font-weight: 600; }
.pago-total-val { font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #1e3a5f; }

/* Formulario */
.pago-form-card {
  background: white; border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06); padding: 28px;
}
.pago-form-card h2 {
  margin: 0 0 24px; font-size: 1.2rem; font-weight: 700; color: #1e3a5f;
  display: flex; align-items: center; gap: 10px;
}
.pago-lock { width: 20px; height: 20px; }

/* Card visual */
.pago-card-preview {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 60%, #553c9a 100%);
  border-radius: 14px; padding: 22px 24px; margin-bottom: 24px;
  color: white; position: relative; overflow: hidden; min-height: 130px;
}
.pago-card-preview::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,.06);
}
.pago-card-preview::after {
  content: ''; position: absolute; bottom: -60px; right: 20px;
  width: 200px; height: 200px; border-radius: 50%;
  background: rgba(255,255,255,.04);
}
.pago-card-num {
  font-family: 'JetBrains Mono', monospace; font-size: 1.1rem;
  letter-spacing: 3px; margin: 12px 0 16px; opacity: .9;
}
.pago-card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.pago-card-lbl { font-size: .65rem; opacity: .6; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
.pago-card-val { font-size: .88rem; font-weight: 600; opacity: .9; }
.pago-card-tipo { font-size: 1.6rem; opacity: .8; align-self: flex-start; }

/* Grupos de formulario */
.pago-fg { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.pago-fg label { font-size: .8rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: .4px; }
.pago-fg input {
  padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: .95rem; font-family: 'DM Sans', sans-serif; color: #1e3a5f;
  transition: border-color .15s, box-shadow .15s;
  outline: none; width: 100%;
}
.pago-fg input:focus { border-color: #2b6cb0; box-shadow: 0 0 0 3px rgba(43,108,176,.1); }
.pago-fg input.err { border-color: #e53e3e; box-shadow: 0 0 0 3px rgba(229,62,62,.1); }
.pago-fg input.ok  { border-color: #38a169; }
.pago-err { font-size: .76rem; color: #e53e3e; margin-top: 3px; }

.pago-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Separador */
.pago-sep {
  display: flex; align-items: center; gap: 10px; margin: 8px 0 20px;
  font-size: .76rem; color: #a0aec0;
}
.pago-sep::before, .pago-sep::after {
  content: ''; flex: 1; height: 1px; background: #e2e8f0;
}

/* Botón */
.pago-btn {
  width: 100%; padding: 15px; border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all .2s;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.pago-btn-pay {
  background: #1e3a5f; color: white;
}
.pago-btn-pay:hover:not(:disabled) { background: #2c5282; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(30,58,95,.25); }
.pago-btn-pay:disabled { opacity: .6; cursor: not-allowed; }
.pago-btn-back {
  background: #f7fafc; color: #4a5568; border: 1.5px solid #e2e8f0;
  margin-top: 10px;
}
.pago-btn-back:hover { background: #edf2f7; }

/* Success */
.pago-success {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 40px 20px; text-align: center;
}
.pago-success-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: #c6f6d5; display: flex; align-items: center;
  justify-content: center; font-size: 2rem;
}
.pago-success h3 { margin: 0; color: #276749; font-size: 1.3rem; }
.pago-success p  { margin: 0; color: #718096; font-size: .9rem; }
.pago-order-num {
  font-family: 'JetBrains Mono', monospace; font-size: 1.1rem;
  font-weight: 700; color: #1e3a5f; background: #ebf8ff;
  padding: 8px 20px; border-radius: 20px;
}

/* Alert */
.pago-alert {
  background: #fff5f5; border: 1px solid #fc8181; border-radius: 10px;
  padding: 12px 16px; color: #9b2c2c; font-size: .85rem; margin-bottom: 16px;
}

/* Badges de seguridad */
.pago-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.pago-badge {
  display: flex; align-items: center; gap: 5px;
  font-size: .72rem; color: #718096; background: #f7fafc;
  border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 20px;
}

.spinning { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 760px) {
  .pago-grid { grid-template-columns: 1fr; }
  .pago-resumen { position: static; order: 2; }
  .pago-form-card { order: 1; }
}
`;

export default function Pago() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { cart, clearCart } = useCart();

  const getPrice = i => Number(i.precio || i.price || 0) || parseFloat(i.precio || i.price || 0) || 0;
  const getQty   = i => Number(i.qty || i.cantidad || 1);
  const total    = location.state?.total || cart.reduce((s, i) => s + getPrice(i) * getQty(i), 0);

  // Redirigir si no está logueado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { state: { from: "/pago", ...location.state } });
  }, []);

  const [form, setForm]     = useState({ nombre: "", tarjeta: "", exp: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [pedidoId, setPedidoId] = useState(null);
  const [sucursalAsignada, setSucursalAsignada] = useState("");
  const [multiSucursal, setMultiSucursal] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 4)
      e.nombre = "Mínimo 4 caracteres";
    if (!/^\d{16}$/.test(form.tarjeta.replace(/\s/g, "")))
      e.tarjeta = "16 dígitos requeridos";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp))
      e.exp = "Formato MM/AA";
    else {
      const [mm, yy] = form.exp.split("/");
      const exp = new Date(2000 + +yy, +mm - 1);
      if (exp < new Date()) e.exp = "Tarjeta vencida";
    }
    if (!/^\d{3,4}$/.test(form.cvv))
      e.cvv = "CVV inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePago = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    setLoading(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");

      // 1. Crear el pedido en orders
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          total,
          items: cart.map(i => ({
            product_id: i.id,
            cantidad:   getQty(i),
            subtotal:   getPrice(i) * getQty(i),
          })),
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        const msg = err.productos?.length
          ? `Sin stock suficiente: ${err.productos.join(", ")}`
          : err.detalle || err.error || "Error al crear el pedido";
        throw new Error(msg);
      }

      const data = await orderRes.json();
      const { orderId } = data;
      setPedidoId(orderId);
      setSucursalAsignada(data.sucursal || "");
      setMultiSucursal(data.multiSucursal || false);
      setPedidos(data.pedidos || []);

      // 2. Vaciar carrito
      clearCart();

      // 3. Redirigir después de 3s
      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      setApiError(err.message || "Error procesando el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const tipo = tipoTarjeta(form.tarjeta);
  const tipoEmoji = { visa: "💳 VISA", mastercard: "💳 MC", amex: "💳 AMEX" };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (pedidoId) {
    return (
      <div className="pago">
        <style>{CSS}</style>
        <div className="pago-wrap">
          <div style={{ background: "white", borderRadius: 16, padding: 48, maxWidth: 400, width: "100%", boxShadow: "0 2px 12px rgba(0,0,0,.06)", textAlign:"center" }}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"#c6f6d5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",margin:"0 auto 20px"}}>✓</div>
            <h3 style={{margin:"0 0 8px",color:"#1e3a5f",fontSize:"1.3rem",fontWeight:700}}>¡Pedido confirmado!</h3>
            <p style={{margin:"0 0 24px",color:"#718096",fontSize:".9rem",lineHeight:1.6}}>
              Tu compra fue procesada correctamente.<br/>Puedes ver el estado en <strong>Mis pedidos</strong>.
            </p>
            <button
              onClick={() => navigate("/orders")}
              style={{background:"#1e3a5f",color:"white",border:"none",borderRadius:10,padding:"12px 28px",fontWeight:700,fontSize:".9rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:10,width:"100%"}}
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate("/")}
              style={{background:"#f7fafc",color:"#4a5568",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"12px 28px",fontWeight:600,fontSize:".9rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pago">
      <style>{CSS}</style>
      <div className="pago-wrap">

        {/* Migas */}
        <div style={{ width: "100%", maxWidth: 900, marginBottom: 20 }}>
          <nav style={{ fontSize: ".82rem", color: "#a0aec0", display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/" style={{ color: "#2b6cb0", textDecoration: "none" }}>Inicio</a>
            <span>/</span>
            <a href="/carrito" style={{ color: "#2b6cb0", textDecoration: "none" }}>Carrito</a>
            <span>/</span>
            <span style={{ color: "#4a5568", fontWeight: 600 }}>Pago</span>
          </nav>
        </div>

        <div className="pago-grid">

          {/* ── Formulario ── */}
          <div className="pago-form-card">
            <h2>
              <svg className="pago-lock" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Pago seguro
            </h2>

            {/* Card preview */}
            <div className="pago-card-preview">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 26, background: "rgba(255,255,255,.25)", borderRadius: 4 }}/>
                {tipo && <span className="pago-card-tipo">{tipoEmoji[tipo]}</span>}
              </div>
              <div className="pago-card-num">
                {form.tarjeta
                  ? form.tarjeta.padEnd(19, "·").slice(0, 19)
                  : "···· ····· ···· ····"}
              </div>
              <div className="pago-card-bottom">
                <div>
                  <div className="pago-card-lbl">Titular</div>
                  <div className="pago-card-val">{form.nombre || "NOMBRE APELLIDO"}</div>
                </div>
                <div>
                  <div className="pago-card-lbl">Vence</div>
                  <div className="pago-card-val">{form.exp || "MM/AA"}</div>
                </div>
              </div>
            </div>

            <div className="pago-sep">Datos de la tarjeta</div>

            {apiError && <div className="pago-alert">{apiError}</div>}

            <form onSubmit={handlePago} noValidate>
              {/* Nombre */}
              <div className="pago-fg">
                <label>Nombre en la tarjeta</label>
                <input
                  type="text"
                  className={errors.nombre ? "err" : form.nombre.length >= 4 ? "ok" : ""}
                  value={form.nombre}
                  onChange={e => set("nombre", e.target.value.toUpperCase())}
                  placeholder="JUAN PÉREZ"
                  autoComplete="cc-name"
                />
                {errors.nombre && <span className="pago-err">{errors.nombre}</span>}
              </div>

              {/* Número de tarjeta */}
              <div className="pago-fg">
                <label>Número de tarjeta</label>
                <input
                  type="text"
                  className={errors.tarjeta ? "err" : /^\d{16}$/.test(form.tarjeta.replace(/\s/g,"")) ? "ok" : ""}
                  value={form.tarjeta}
                  onChange={e => set("tarjeta", fmtTarjeta(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  autoComplete="cc-number"
                  inputMode="numeric"
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}
                />
                {errors.tarjeta && <span className="pago-err">{errors.tarjeta}</span>}
              </div>

              {/* Exp + CVV */}
              <div className="pago-row">
                <div className="pago-fg">
                  <label>Expiración</label>
                  <input
                    type="text"
                    className={errors.exp ? "err" : /^\d{2}\/\d{2}$/.test(form.exp) ? "ok" : ""}
                    value={form.exp}
                    onChange={e => set("exp", fmtExp(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                  {errors.exp && <span className="pago-err">{errors.exp}</span>}
                </div>
                <div className="pago-fg">
                  <label>CVV</label>
                  <input
                    type="password"
                    className={errors.cvv ? "err" : /^\d{3,4}$/.test(form.cvv) ? "ok" : ""}
                    value={form.cvv}
                    onChange={e => set("cvv", e.target.value.replace(/\D/g,"").slice(0,4))}
                    placeholder="···"
                    maxLength={4}
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                  {errors.cvv && <span className="pago-err">{errors.cvv}</span>}
                </div>
              </div>

              {/* Botón pagar */}
              <button type="submit" className="pago-btn pago-btn-pay" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" className="spinning" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Pagar {fmtMXN(total)}
                  </>
                )}
              </button>

              <button type="button" className="pago-btn pago-btn-back" onClick={() => navigate("/carrito")}>
                Volver al carrito
              </button>

              {/* Badges de seguridad */}
              <div className="pago-badges">
                {["SSL cifrado", "Pago seguro", "Datos protegidos"].map(b => (
                  <div key={b} className="pago-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {b}
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* ── Resumen del pedido ── */}
          <div className="pago-resumen">
            <h3>Resumen del pedido</h3>
            {cart.map((item, i) => (
              <div key={i} className="pago-item">
                {item.imagen
                  ? <img src={item.imagen||item.img} alt={item.nombre||item.title} className="pago-item-img"/>
                  : <div className="pago-item-img" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem" }}>👟</div>
                }
                <div className="pago-item-info">
                  <div className="pago-item-name">{item.nombre || item.title || item.name || "Producto"}</div>
                  <div className="pago-item-sub">
                    {getQty(item) > 1 && `${getQty(item)} × `}{fmtMXN(getPrice(item))}
                    {(item.talla||item.size) && ` · ${item.talla||item.size}`}
                    {item.color && ` · ${item.color}`}
                  </div>
                </div>
                <div className="pago-item-price">{fmtMXN(getPrice(item) * getQty(item))}</div>
              </div>
            ))}

            <div className="pago-total-row">
              <span className="pago-total-lbl">Total a pagar</span>
              <span className="pago-total-val">{fmtMXN(total)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}