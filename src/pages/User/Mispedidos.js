import { API_BASE_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Feedback from "../../components/Feedback";

const API_URL = API_BASE_URL;

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

import CSS from "./Mispedidos.styles";

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
  const [error,     setError]     = useState("");
  const [filtro,    setFiltro]    = useState("todos");
  const [expandido, setExpandido] = useState(null);

  const cargarPedidos = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    setError("");
    fetch(`${API_URL}/api/orders/mis-pedidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error("No se pudieron cargar tus compras.");
        return r.json();
      })
      .then(data => { setPedidos(data); setLoading(false); })
      .catch((requestError) => { setError(requestError.message); setLoading(false); });
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const filtrados = filtro === "todos"
    ? pedidos
    : pedidos.filter(p => p.status === filtro);

  const grupos = agruparPorMes(filtrados);

  const TABS = [
    { key: "todos",     label: "Todas" },
    { key: "pendiente", label: "Pendientes" },
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

        <div className="mp-head-card">
          <div>
            <span className="mp-head-eyebrow">Historial y seguimiento</span>
            <h1 className="mp-head-title">Sigue cada pedido.</h1>
            <p className="mp-head-sub">
              Revisa tus compras, consulta su avance y encuentra todos los detalles en un solo lugar.
            </p>
          </div>
        </div>

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
          <Feedback kind="loading" title="Cargando tus compras…"/>
        ) : error ? (
          <Feedback kind="error" title="No pudimos cargar tus compras" onRetry={cargarPedidos}>{error}</Feedback>
        ) : filtrados.length === 0 ? (
          <Feedback title={filtro === "todos" ? "Aún no tienes compras" : "No hay pedidos en esta categoría"}>
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
          </Feedback>
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
                          {(item.talla || item.color) && <div className="mp-item-meta">{[item.talla && `Talla: ${item.talla}`,item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</div>}
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
