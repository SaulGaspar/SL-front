import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL  = "https://sl-back.vercel.app";
const LS_KEY   = "cliente_notif_seen"; // ids vistos
const POLL_MS  = 45000; // 45 segundos

const STATUS_LABEL = {
  pendiente:  { label:"Recibido",   color:"#d69e2e", icon:"📋" },
  preparando: { label:"Preparando", color:"#3182ce", icon:"📦" },
  en_camino:  { label:"En camino",  color:"#805ad5", icon:"🚚" },
  entregado:  { label:"Entregado",  color:"#38a169", icon:"✅" },
  cancelado:  { label:"Cancelado",  color:"#e53e3e", icon:"✕"  },
};

const fmtMXN  = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const fmtHora = f => f ? new Date(f).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) : "";
const fmtFecha= f => f ? new Date(f).toLocaleDateString("es-MX",{day:"2-digit",month:"short"}) : "";

const CSS = `
.ncl-wrap { position:relative; display:inline-flex; }

.ncl-btn {
  position:relative; background:none; border:none; cursor:pointer;
  padding:6px; border-radius:8px; color:var(--muted,rgba(255,255,255,.5));
  display:flex; align-items:center; justify-content:center;
  font-size:1.2rem; transition:color .15s,background .15s; width:38px; height:38px;
}
.ncl-btn:hover { color:white; background:rgba(255,255,255,.09); }
.ncl-btn.active { color:#c8f03c; background:rgba(200,240,60,.1); }

.ncl-dot {
  position:absolute; top:5px; right:5px;
  width:9px; height:9px; border-radius:50%;
  background:#e53e3e; border:2px solid #0a1a2f;
  animation:ncl-pulse 2s ease-in-out infinite;
}
@keyframes ncl-pulse {
  0%,100% { box-shadow:0 0 0 0 rgba(229,62,62,.4); }
  50%      { box-shadow:0 0 0 4px rgba(229,62,62,0); }
}

.ncl-count {
  position:absolute; top:3px; right:3px;
  min-width:17px; height:17px; border-radius:999px;
  background:#e53e3e; color:white; border:2px solid #0a1a2f;
  font-size:.6rem; font-weight:800; line-height:1;
  display:flex; align-items:center; justify-content:center; padding:0 3px;
}

.ncl-dropdown {
  position:absolute; top:calc(100% + 10px); right:0;
  width:320px; background:#0d2240;
  border:1px solid rgba(255,255,255,.12); border-radius:14px;
  box-shadow:0 12px 40px rgba(0,0,0,.5); z-index:9999;
  overflow:hidden; animation:ncl-in .2s ease;
}
@keyframes ncl-in {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:translateY(0); }
}

.ncl-head {
  padding:14px 18px; border-bottom:1px solid rgba(255,255,255,.08);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(255,255,255,.04);
}
.ncl-head-left { display:flex; align-items:center; gap:8px; }
.ncl-head-title { font-size:.88rem; font-weight:700; color:white; }
.ncl-head-badge {
  background:rgba(229,62,62,.2); color:#fc8181;
  font-size:.68rem; font-weight:700; padding:2px 8px; border-radius:20px;
  border:1px solid rgba(229,62,62,.3);
}
.ncl-mark-read {
  background:none; border:none; color:rgba(255,255,255,.4);
  font-size:.72rem; cursor:pointer; padding:4px 8px; border-radius:6px;
  font-family:inherit; transition:all .15s;
}
.ncl-mark-read:hover { background:rgba(255,255,255,.08); color:rgba(255,255,255,.7); }

.ncl-list { max-height:320px; overflow-y:auto; }
.ncl-list::-webkit-scrollbar { width:4px; }
.ncl-list::-webkit-scrollbar-thumb { background:rgba(255,255,255,.15); border-radius:2px; }

.ncl-item {
  padding:13px 18px; border-bottom:1px solid rgba(255,255,255,.06);
  display:flex; gap:12px; align-items:flex-start; cursor:pointer;
  transition:background .1s;
}
.ncl-item:hover { background:rgba(255,255,255,.04); }
.ncl-item:last-child { border-bottom:none; }
.ncl-item.unread { background:rgba(200,240,60,.04); }

.ncl-item-icon {
  width:34px; height:34px; border-radius:9px; flex-shrink:0;
  background:rgba(255,255,255,.07);
  display:flex; align-items:center; justify-content:center;
  font-size:1rem;
}
.ncl-item-body { flex:1; min-width:0; }
.ncl-item-title { font-size:.82rem; font-weight:600; color:rgba(255,255,255,.9); margin-bottom:2px; }
.ncl-item-sub   { font-size:.74rem; color:rgba(255,255,255,.4); }
.ncl-item-right { text-align:right; flex-shrink:0; }
.ncl-item-status { font-size:.74rem; font-weight:700; margin-bottom:2px; }
.ncl-item-time  { font-size:.68rem; color:rgba(255,255,255,.3); }

.ncl-empty { padding:36px; text-align:center; color:rgba(255,255,255,.3); }
.ncl-empty-icon { font-size:2rem; margin-bottom:8px; }
.ncl-empty-text { font-size:.8rem; }

.ncl-foot { padding:10px 18px; border-top:1px solid rgba(255,255,255,.08); text-align:center; }
.ncl-foot-btn {
  background:none; border:none; color:rgba(200,240,60,.7);
  font-size:.78rem; font-weight:600; cursor:pointer; font-family:inherit;
}
.ncl-foot-btn:hover { color:#c8f03c; }
`;

export default function NotificacionesCliente({ user, onVerPedidos }) {
  const [notifs,  setNotifs]  = useState([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const ref  = useRef(null);
  const seen = useRef(new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]")));

  const unread = notifs.filter(n => !seen.current.has(n.id)).length;

  const check = useCallback(async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/notificaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.pedidos?.length) setNotifs(data.pedidos);
    } catch(e) {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    check();
    const t = setInterval(check, POLL_MS);
    return () => clearInterval(t);
  }, [check]);

  // Cerrar al click fuera
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const markAllRead = () => {
    const ids = notifs.map(n => n.id);
    seen.current = new Set(ids);
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
    setNotifs(ns => [...ns]); // re-render
  };

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) {
      // Marcar como leídas al abrir
      setTimeout(markAllRead, 1500);
    }
  };

  if (!user) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="ncl-wrap" ref={ref}>
        <button
          className={`ncl-btn ${open?"active":""}`}
          onClick={handleOpen}
          title="Mis notificaciones"
        >
          <i className="bi bi-bell"/>
          {unread > 0 && (
            unread <= 9
              ? <span className="ncl-count">{unread}</span>
              : <span className="ncl-dot"/>
          )}
        </button>

        {open && (
          <div className="ncl-dropdown">
            <div className="ncl-head">
              <div className="ncl-head-left">
                <span style={{fontSize:"1rem"}}>🔔</span>
                <span className="ncl-head-title">Mis pedidos</span>
                {unread > 0 && <span className="ncl-head-badge">{unread} nuevo{unread!==1?"s":""}</span>}
              </div>
              {unread > 0 && (
                <button className="ncl-mark-read" onClick={markAllRead}>✓ Leídas</button>
              )}
            </div>

            <div className="ncl-list">
              {notifs.length === 0 ? (
                <div className="ncl-empty">
                  <div className="ncl-empty-icon">📭</div>
                  <div className="ncl-empty-text">Sin actualizaciones recientes</div>
                </div>
              ) : (
                notifs.map(n => {
                  const cfg     = STATUS_LABEL[n.status] || STATUS_LABEL.pendiente;
                  const isUnread= !seen.current.has(n.id);
                  return (
                    <div
                      key={n.id}
                      className={`ncl-item ${isUnread?"unread":""}`}
                      onClick={() => { setOpen(false); onVerPedidos?.(); }}
                    >
                      <div className="ncl-item-icon">{cfg.icon}</div>
                      <div className="ncl-item-body">
                        <div className="ncl-item-title">
                          Pedido del {fmtFecha(n.fecha)}
                        </div>
                        <div className="ncl-item-sub">{fmtMXN(n.total)}</div>
                      </div>
                      <div className="ncl-item-right">
                        <div className="ncl-item-status" style={{color:cfg.color}}>
                          {cfg.label}
                        </div>
                        <div className="ncl-item-time">{fmtHora(n.fecha)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="ncl-foot">
              <button className="ncl-foot-btn" onClick={()=>{ setOpen(false); onVerPedidos?.(); }}>
                Ver todos mis pedidos →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}