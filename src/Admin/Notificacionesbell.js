import React, { useState, useRef, useEffect } from "react";
import { useNotificaciones } from "./useNotificaciones";

const fmtMXN = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtHora = (f) =>
  f ? new Date(f).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "";

import CSS from "./Notificacionesbell.styles";

export default function NotificacionesBell({ onVerPedido }) {
  const { notifs, count, markAllRead, markOneRead, loading } = useNotificaciones();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openPedido = (pedido) => {
    markOneRead?.(pedido);
    onVerPedido?.(pedido);
    setOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="nb-wrap" ref={ref}>
        <button
          className={`nb-btn ${open ? "open" : ""} ${count > 0 ? "has-notifs" : ""}`}
          onClick={() => setOpen((value) => !value)}
          title="Notificaciones"
          aria-label={count > 0 ? `Notificaciones, ${count} pedidos nuevos` : "Notificaciones"}
          aria-expanded={open}
        >
          {count > 0 && <span className="nb-pulse" aria-hidden="true" />}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {count > 0 && <span className="nb-badge">{count > 9 ? "9+" : count}</span>}
        </button>

        {open && (
          <div className="nb-dropdown">
            <div className="nb-head">
              <div className="nb-head-left">
                <span className="nb-head-icon" aria-hidden="true">🛍️</span>
                <div>
                  <span className="nb-head-title">Pedidos nuevos</span>
                  <span className="nb-head-sub">
                    {count > 0 ? `${count} pendiente${count !== 1 ? "s" : ""} de revisar` : "Todo al día"}
                  </span>
                </div>
              </div>

              {count > 0 && (
                <button className="nb-mark-read" onClick={markAllRead}>
                  ✓ Leídos
                </button>
              )}
            </div>

            <div className="nb-list">
              {loading && notifs.length === 0 ? (
                <div className="nb-loading">
                  <div>
                    <div className="nb-spinner" />
                    <div className="nb-loading-text">Buscando pedidos recientes...</div>
                  </div>
                </div>
              ) : notifs.length === 0 ? (
                <div className="nb-empty">
                  <div>
                    <div className="nb-empty-icon">🔔</div>
                    <div className="nb-empty-title">Sin pedidos nuevos</div>
                    <div className="nb-empty-text">Cuando llegue una compra reciente aparecerá aquí.</div>
                  </div>
                </div>
              ) : (
                notifs.map((n) => (
                  <button
                    key={n.id}
                    className="nb-item"
                    onClick={() => openPedido(n)}
                    disabled={!onVerPedido}
                    style={{ cursor: onVerPedido ? "pointer" : "default" }}
                  >
                    <div className="nb-dot-wrap" aria-hidden="true">🛒</div>

                    <div className="nb-item-info">
                      <div className="nb-item-title">
                        {n.cliente_nombre || "Cliente"} {n.cliente_apellido || ""}
                      </div>
                      <div className="nb-item-sub">
                        {n.num_items || 0} artículo{n.num_items !== 1 ? "s" : ""} · {n.sucursal_nombre || `Suc. ${n.sucursal || ""}`}
                      </div>
                    </div>

                    <div className="nb-item-right">
                      <div className="nb-item-monto">{fmtMXN(n.total)}</div>
                      <div className="nb-item-hora">{fmtHora(n.fecha)}</div>
                    </div>
                  </button>
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
