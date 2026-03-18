import React, { useState, useRef, useEffect } from "react";
import { useNotificaciones } from "./useNotificaciones"; // mismo nivel: src/Admin/

const fmtMXN  = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const fmtHora = f => f ? new Date(f).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) : "";

const CSS = `
.nb-wrap { position:relative; display:inline-flex; }

.nb-btn {
  position:relative; background:none; border:none; cursor:pointer;
  padding:8px; border-radius:10px; color:#4a5568; transition:all .15s;
  display:flex; align-items:center; justify-content:center;
}
.nb-btn:hover { background:#f0f4f8; color:#1e3a5f; }
.nb-btn.has-notifs { color:#1e3a5f; }

.nb-badge {
  position:absolute; top:2px; right:2px;
  background:#e53e3e; color:white;
  font-size:.62rem; font-weight:800; line-height:1;
  min-width:17px; height:17px; border-radius:999px;
  display:flex; align-items:center; justify-content:center;
  padding:0 4px; border:2px solid white;
  animation: nb-pop .3s cubic-bezier(.36,.07,.19,.97);
}
@keyframes nb-pop {
  0%  { transform:scale(0); }
  70% { transform:scale(1.2); }
  100%{ transform:scale(1); }
}

.nb-dropdown {
  position:absolute; top:calc(100% + 8px); right:0;
  width:340px; background:white; border-radius:14px;
  box-shadow:0 8px 32px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08);
  border:1px solid #e2e8f0; z-index:9999; overflow:hidden;
  animation: nb-slide .2s ease;
}
@keyframes nb-slide {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:translateY(0); }
}

.nb-head {
  padding:14px 18px; border-bottom:1px solid #f0f4f8;
  display:flex; align-items:center; justify-content:space-between;
  background:#1e3a5f;
}
.nb-head-title { font-size:.88rem; font-weight:700; color:white; display:flex; align-items:center; gap:8px; }
.nb-head-badge { background:rgba(255,255,255,.2); color:white; font-size:.72rem; font-weight:700; padding:2px 8px; border-radius:20px; }
.nb-mark-read { background:none; border:none; color:rgba(255,255,255,.7); font-size:.76rem; cursor:pointer; font-family:inherit; padding:4px 8px; border-radius:6px; transition:all .15s; }
.nb-mark-read:hover { background:rgba(255,255,255,.15); color:white; }

.nb-list { max-height:360px; overflow-y:auto; }
.nb-item {
  padding:14px 18px; border-bottom:1px solid #f8fafc;
  display:flex; gap:12px; align-items:flex-start;
  transition:background .1s; cursor:default;
}
.nb-item:hover { background:#f8fafc; }
.nb-item:last-child { border-bottom:none; }

.nb-dot-wrap {
  width:36px; height:36px; border-radius:10px; flex-shrink:0;
  background:#ebf8ff; display:flex; align-items:center; justify-content:center;
  font-size:1.1rem;
}
.nb-item-info { flex:1; min-width:0; }
.nb-item-title { font-size:.83rem; font-weight:700; color:#1e3a5f; margin-bottom:2px; }
.nb-item-sub   { font-size:.76rem; color:#718096; }
.nb-item-right { text-align:right; flex-shrink:0; }
.nb-item-monto { font-size:.85rem; font-weight:700; color:#276749; }
.nb-item-hora  { font-size:.7rem; color:#a0aec0; margin-top:2px; }

.nb-empty { padding:32px; text-align:center; color:#a0aec0; }
.nb-empty-icon { font-size:2rem; margin-bottom:8px; }
.nb-empty-text { font-size:.82rem; }

.nb-foot { padding:10px 18px; border-top:1px solid #f0f4f8; text-align:center; background:#fafbfc; }
.nb-foot-btn { background:none; border:none; color:#2b6cb0; font-size:.78rem; font-weight:600; cursor:pointer; font-family:inherit; }
.nb-foot-btn:hover { text-decoration:underline; }

/* Pulse cuando hay notifs nuevas */
.nb-pulse { animation:nb-pulse 2s ease-in-out infinite; }
@keyframes nb-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(229,62,62,0); }
  50%      { box-shadow: 0 0 0 6px rgba(229,62,62,.15); }
}
`;

export default function NotificacionesBell({ onVerPedido }) {
  const { notifs, count, markAllRead, loading } = useNotificaciones();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="nb-wrap" ref={ref}>
        <button
          className={`nb-btn ${count > 0 ? "has-notifs nb-pulse" : ""}`}
          onClick={() => setOpen(o => !o)}
          title="Notificaciones"
        >
          {/* Bell icon SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {count > 0 && (
            <span className="nb-badge">{count > 9 ? "9+" : count}</span>
          )}
        </button>

        {open && (
          <div className="nb-dropdown">
            <div className="nb-head">
              <div className="nb-head-title">
                🔔 Pedidos nuevos
                {count > 0 && <span className="nb-head-badge">{count} sin leer</span>}
              </div>
              {count > 0 && (
                <button className="nb-mark-read" onClick={markAllRead}>
                  ✓ Marcar leídos
                </button>
              )}
            </div>

            <div className="nb-list">
              {notifs.length === 0 ? (
                <div className="nb-empty">
                  <div className="nb-empty-icon">🔔</div>
                  <div className="nb-empty-text">Sin pedidos nuevos</div>
                </div>
              ) : (
                notifs.map(n => (
                  <div
                    key={n.id}
                    className="nb-item"
                    onClick={() => { onVerPedido?.(n); setOpen(false); }}
                    style={{ cursor: onVerPedido ? "pointer" : "default" }}
                  >
                    <div className="nb-dot-wrap">🛍️</div>
                    <div className="nb-item-info">
                      <div className="nb-item-title">
                        {n.cliente_nombre} {n.cliente_apellido || ""}
                      </div>
                      <div className="nb-item-sub">
                        {n.num_items} artículo{n.num_items !== 1 ? "s" : ""} · {n.sucursal_nombre || `Suc. ${n.sucursal}`}
                      </div>
                    </div>
                    <div className="nb-item-right">
                      <div className="nb-item-monto">{fmtMXN(n.total)}</div>
                      <div className="nb-item-hora">{fmtHora(n.fecha)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifs.length > 0 && (
              <div className="nb-foot">
                <button className="nb-foot-btn" onClick={markAllRead}>
                  Marcar todos como leídos
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}