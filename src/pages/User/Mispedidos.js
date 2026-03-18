import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://sl-back.vercel.app";

const fmtMXN = n =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

const fmtFecha = f => {
  if (!f) return "—";
  const d = new Date(f);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
};

const fmtFechaCorta = f => {
  if (!f) return "—";
  const d = new Date(f);
  const fecha = d.toLocaleDateString("es-MX", { day: "numeric", month: "long" });
  const hora  = d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return `${fecha} · ${hora}`;
};

const STATUS = {
  pendiente:  { label: "Pendiente",  color: "#f59e0b", bg: "#fffbeb", step: 0 },
  preparando: { label: "Preparando", color: "#3b82f6", bg: "#eff6ff", step: 1 },
  en_camino:  { label: "En camino",  color: "#8b5cf6", bg: "#f5f3ff", step: 2 },
  entregado:  { label: "Entregado",  color: "#10b981", bg: "#ecfdf5", step: 3 },
  cancelado:  { label: "Cancelado",  color: "#ef4444", bg: "#fef2f2", step: -1 },
};

const STEPS = [
  { key: "pendiente",  label: "Pedido recibido",  icon: "📋" },
  { key: "preparando", label: "En preparación",   icon: "📦" },
  { key: "en_camino",  label: "En camino",         icon: "🚚" },
  { key: "entregado",  label: "Entregado",          icon: "✓"  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
* { box-sizing: border-box; }
.mp { font-family: 'DM Sans', sans-serif; background: #ebebeb; min-height: 100vh; }

/* Top bar */
.mp-topbar {
  background: #1e3a5f; padding: 14px 24px;
  display: flex; align-items: center; gap: 16px;
}
.mp-topbar-back {
  background: none; border: none; color: rgba(255,255,255,.7);
  font-size: .85rem; font-weight: 600; cursor: pointer; font-family: inherit;
  display: flex; align-items: center; gap: 6px; padding: 0;
}
.mp-topbar-back:hover { color: white; }
.mp-topbar-title { color: white; font-size: 1rem; font-weight: 700; margin: 0; }

/* Layout */
.mp-body { max-width: 900px; margin: 0 auto; padding: 24px 16px; }

/* Header card */
.mp-head-card {
  background: white; border-radius: 6px; padding: 20px 24px;
  margin-bottom: 16px; display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.mp-head-title { font-size: 1.3rem; font-weight: 700; color: #1e3a5f; margin: 0 0 4px; }
.mp-head-sub   { font-size: .82rem; color: #9ca3af; margin: 0; }

/* Filter tabs */
.mp-filters {
  background: white; border-radius: 6px; padding: 0 24px;
  margin-bottom: 16px; display: flex; gap: 0; overflow-x: auto;
  border-bottom: 1px solid #f3f4f6;
}
.mp-ftab {
  padding: 14px 18px; border: none; background: none; cursor: pointer;
  font-size: .85rem; font-weight: 500; color: #6b7280; white-space: nowrap;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  font-family: inherit; transition: all .15s;
}
.mp-ftab.active { color: #1e3a5f; border-bottom-color: #1e3a5f; font-weight: 700; }
.mp-ftab:hover:not(.active) { color: #1e3a5f; }

/* Section date header */
.mp-date-header {
  font-size: .82rem; font-weight: 700; color: #6b7280;
  padding: 8px 0 10px; text-transform: uppercase; letter-spacing: .5px;
}

/* Order card */
.mp-order {
  background: white; border-radius: 6px; margin-bottom: 12px;
  overflow: hidden; border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
}
.mp-order:hover { box-shadow: 0 2px 12px rgba(0,0,0,.1); }

/* Order header strip */
.mp-order-strip {
  background: #f9fafb; padding: 10px 20px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;
  cursor: pointer;
}
.mp-order-strip-left { display: flex; align-items: center; gap: 16px; }
.mp-order-strip-label { font-size: .72rem; color: #9ca3af; text-transform: uppercase; letter-spacing: .4px; }
.mp-order-strip-val   { font-size: .82rem; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; }

/* Status badge */
.mp-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 4px; font-size: .78rem; font-weight: 700;
}
.mp-badge-dot { width: 6px; height: 6px; border-radius: 50%; }

/* Item rows */
.mp-item-row {
  padding: 18px 20px; display: flex; align-items: flex-start; gap: 16px;
  border-bottom: 1px solid #f3f4f6;
}
.mp-item-row:last-of-type { border-bottom: none; }
.mp-item-img {
  width: 72px; height: 72px; border-radius: 6px; object-fit: cover;
  background: #f3f4f6; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  border: 1px solid #e5e7eb;
}
.mp-item-main { flex: 1; min-width: 0; }
.mp-item-name { font-size: .9rem; font-weight: 600; color: #111827; line-height: 1.4; margin-bottom: 4px; }
.mp-item-meta { font-size: .78rem; color: #9ca3af; }
.mp-item-right { text-align: right; flex-shrink: 0; }
.mp-item-price  { font-size: .95rem; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
.mp-item-qty    { font-size: .76rem; color: #9ca3af; margin-top: 2px; }

/* Footer de la order */
.mp-order-foot {
  padding: 14px 20px; background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
.mp-foot-info { font-size: .78rem; color: #6b7280; display: flex; align-items: center; gap: 6px; }
.mp-foot-total { font-size: 1rem; font-weight: 700; color: #1e3a5f; font-family: 'JetBrains Mono', monospace; }
.mp-foot-actions { display: flex; gap: 8px; }
.mp-btn-primary {
  background: #1e3a5f; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; font-size: .82rem;
  font-weight: 700; cursor: pointer; font-family: inherit;
  transition: background .15s;
}
.mp-btn-primary:hover { background: #2c5282; }
.mp-btn-secondary {
  background: white; color: #1e3a5f; border: 1.5px solid #1e3a5f;
  padding: 8px 18px; border-radius: 6px; font-size: .82rem;
  font-weight: 600; cursor: pointer; font-family: inherit;
  transition: all .15s;
}
.mp-btn-secondary:hover { background: #f0f4f8; }

/* Timeline expandido */
.mp-timeline-section { padding: 20px; background: white; border-top: 1px solid #f3f4f6; }
.mp-tl-title { font-size: .72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 16px; }
.mp-tl {
  display: flex; align-items: flex-start; position: relative;
}
.mp-tl-step { flex: 1; display: flex; flex-direction: column; align-items: center; }
.mp-tl-line {
  position: absolute; top: 12px; left: 12.5%; right: 12.5%;
  height: 2px; background: #e5e7eb;
}
.mp-tl-node {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid #e5e7eb; background: white;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; z-index: 1; position: relative;
  transition: all .25s;
}
.mp-tl-node.done    { border-color: #10b981; background: #d1fae5; color: #065f46; }
.mp-tl-node.current { border-color: #1e3a5f; background: #dbeafe; color: #1e3a5f; box-shadow: 0 0 0 4px #dbeafe; }
.mp-tl-lbl { font-size: .65rem; color: #9ca3af; margin-top: 6px; text-align: center; font-weight: 500; line-height: 1.3; max-width: 70px; }
.mp-tl-lbl.done { color: #10b981; font-weight: 700; }
.mp-tl-lbl.current { color: #1e3a5f; font-weight: 700; }

/* Detalles del pedido expandido */
.mp-detail-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 16px 20px; border-top: 1px solid #f3f4f6; background: #fafafa;
}
.mp-detail-box { background: white; border-radius: 6px; padding: 12px 14px; border: 1px solid #e5e7eb; }
.mp-detail-lbl { font-size: .68rem; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
.mp-detail-val { font-size: .85rem; color: #111827; font-weight: 600; }

/* Cancelado */
.mp-cancelled-bar {
  background: #fef2f2; border-top: 1px solid #fecaca;
  padding: 12px 20px; display: flex; align-items: center; gap: 10px;
  font-size: .82rem; color: #991b1b; font-weight: 600;
}

/* Empty / loading */
.mp-empty { background: white; border-radius: 6px; padding: 60px 20px; text-align: center; }
.mp-loading { text-align: center; padding: 80px 20px; color: #9ca3af; }
.spinning { animation: spin .9s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .mp-detail-grid { grid-template-columns: 1fr; }
  .mp-order-strip-left { gap: 10px; }
  .mp-foot-actions { width: 100%; }
  .mp-btn-primary, .mp-btn-secondary { flex: 1; text-align: center; }
}
`;

function Timeline({ status }) {
  const curStep = STATUS[status]?.step ?? 0;
  return (
    <div className="mp-timeline-section">
      <div className="mp-tl-title">Seguimiento del pedido</div>
      {status === "cancelado" ? (
        <div className="mp-cancelled-bar">✕ Este pedido fue cancelado</div>
      ) : (
        <div className="mp-tl" style={{ position: "relative" }}>
          <div className="mp-tl-line"/>
          {STEPS.map((s, i) => {
            const done    = i < curStep;
            const current = i === curStep;
            return (
              <div key={s.key} className="mp-tl-step">
                <div className={`mp-tl-node ${current ? "current" : done ? "done" : ""}`}>
                  {done ? "✓" : s.icon}
                </div>
                <div className={`mp-tl-lbl ${current ? "current" : done ? "done" : ""}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function agruparPorMes(pedidos) {
  const grupos = {};
  for (const p of pedidos) {
    const d = new Date(p.fecha);
    const key = d.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
    const label = d.toLocaleDateString("es-MX", { day: "numeric", month: "long" });
    if (!grupos[key]) grupos[key] = { label: key, items: [] };
    grupos[key].items.push({ ...p, _fechaLabel: label });
  }
  return Object.values(grupos);
}

export default function MisPedidos() {
  const navigate   = useNavigate();
  const [pedidos,   setPedidos]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filtro,    setFiltro]    = useState("todos");
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetch(`${API_URL}/api/orders/mis-pedidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setPedidos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const conteos = pedidos.reduce((a, p) => { a[p.status] = (a[p.status]||0)+1; return a; }, {});

  const filtrados = filtro === "todos"
    ? pedidos
    : pedidos.filter(p => p.status === filtro);

  const grupos = agruparPorMes(filtrados);

  const TABS = [
    { key: "todos",     label: `Todas (${pedidos.length})` },
    { key: "pendiente", label: `Pendientes${conteos.pendiente ? ` (${conteos.pendiente})` : ""}` },
    { key: "preparando",label: "Preparando" },
    { key: "en_camino", label: "En camino" },
    { key: "entregado", label: "Entregados" },
    { key: "cancelado", label: "Cancelados" },
  ];

  return (
    <div className="mp">
      <style>{CSS}</style>

      {/* Top bar azul */}
      <div className="mp-topbar">
        <button className="mp-topbar-back" onClick={() => navigate(-1)}>← Volver</button>
        <p className="mp-topbar-title">Mis compras</p>
      </div>

      <div className="mp-body">

        {/* Tabs */}
        <div className="mp-filters">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`mp-ftab ${filtro === t.key ? "active" : ""}`}
              onClick={() => setFiltro(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mp-loading">
            <div className="spinning" style={{fontSize:"1.8rem"}}>↻</div>
            <p>Cargando tus compras...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="mp-empty">
            <div style={{fontSize:"3rem",marginBottom:12}}>📦</div>
            <div style={{fontWeight:700,color:"#374151",fontSize:"1.1rem",marginBottom:8}}>
              {filtro === "todos" ? "Aún no tienes compras" : "No hay pedidos en esta categoría"}
            </div>
            {filtro === "todos" && (
              <>
                <p style={{color:"#9ca3af",fontSize:".88rem",marginBottom:20}}>
                  Cuando realices una compra aparecerá aquí
                </p>
                <button className="mp-btn-primary" onClick={() => navigate("/catalogo")}>
                  Ir al catálogo
                </button>
              </>
            )}
          </div>
        ) : (
          grupos.map(grupo => (
            <div key={grupo.label}>
              <div className="mp-date-header">{grupo.label}</div>

              {grupo.items.map(p => {
                const cfg     = STATUS[p.status] || STATUS.pendiente;
                const abierto = expandido === p.id;

                return (
                  <div key={p.id} className="mp-order">

                    {/* Strip superior */}
                    <div className="mp-order-strip" onClick={() => setExpandido(abierto ? null : p.id)}>
                      <div className="mp-order-strip-left">
                        <div>
                          <div className="mp-order-strip-label">Fecha</div>
                          <div className="mp-order-strip-val">{fmtFechaCorta(p.fecha)}</div>
                        </div>
                        <div>
                          <div className="mp-order-strip-label">Total</div>
                          <div className="mp-order-strip-val">{fmtMXN(p.total)}</div>
                        </div>
                        <div>
                          <div className="mp-order-strip-label">Artículos</div>
                          <div className="mp-order-strip-val" style={{fontFamily:"'DM Sans',sans-serif"}}>
                            {p.items?.length || 0} producto{(p.items?.length||0)!==1?"s":""}
                          </div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="mp-badge" style={{background:cfg.bg,color:cfg.color}}>
                          <div className="mp-badge-dot" style={{background:cfg.color}}/>
                          {cfg.label}
                        </div>
                        <span style={{color:"#9ca3af",fontSize:".85rem",transform:abierto?"rotate(180deg)":"rotate(0deg)",display:"inline-block",transition:"transform .2s"}}>▾</span>
                      </div>
                    </div>

                    {/* Items del pedido */}
                    {p.items?.length > 0 ? p.items.map((item, i) => (
                      <div key={i} className="mp-item-row">
                        <div className="mp-item-img">
                          {item.imagen
                            ? <img src={item.imagen} alt={item.nombre} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:5}}/>
                            : "👟"
                          }
                        </div>
                        <div className="mp-item-main">
                          <div className="mp-item-name">{item.nombre}</div>
                          <div className="mp-item-meta">
                            {[item.marca, item.categoria].filter(Boolean).join(" · ")}
                          </div>
                          <div style={{marginTop:6,fontSize:".76rem",color:"#6b7280"}}>
                            Cantidad: {item.cantidad}
                          </div>
                        </div>
                        <div className="mp-item-right">
                          <div className="mp-item-price">{fmtMXN(item.subtotal)}</div>
                          <div className="mp-item-qty">
                            {item.cantidad > 1 && `${fmtMXN(item.subtotal/item.cantidad)} c/u`}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div style={{padding:"20px",color:"#9ca3af",fontSize:".82rem",textAlign:"center"}}>
                        Sin detalle de productos
                      </div>
                    )}

                    {/* Sección expandida */}
                    {abierto && (
                      <>
                        <Timeline status={p.status}/>
                        <div className="mp-detail-grid">
                          <div className="mp-detail-box">
                            <div className="mp-detail-lbl">Fecha del pedido</div>
                            <div className="mp-detail-val">{fmtFecha(p.fecha)}</div>
                          </div>

                          <div className="mp-detail-box">
                            <div className="mp-detail-lbl">Artículos</div>
                            <div className="mp-detail-val">{p.items?.length || 0} producto{(p.items?.length||0)!==1?"s":""}</div>
                          </div>
                          <div className="mp-detail-box">
                            <div className="mp-detail-lbl">Estado</div>
                            <div className="mp-detail-val" style={{color:cfg.color}}>{cfg.label}</div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mp-order-foot">
                      <div className="mp-foot-info">
                        {p.items?.length || 0} artículo{(p.items?.length||0)!==1?"s":""}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:16}}>
                        <span className="mp-foot-total">{fmtMXN(p.total)}</span>
                        <div className="mp-foot-actions">
                          <button
                            className="mp-btn-secondary"
                            onClick={() => setExpandido(abierto ? null : p.id)}
                          >
                            {abierto ? "Ocultar detalle" : "Ver compra"}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}