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

const CSS = `
  .nb-wrap {
    position: relative;
    display: inline-flex;
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  .nb-btn {
    position: relative;
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    transition: transform .18s ease, color .18s ease, background .18s ease, border-color .18s ease;
  }

  .nb-btn:hover,
  .nb-btn.open,
  .nb-btn.has-notifs {
    color: #0a1a2f;
    background: #eef4ff;
    border-color: rgba(36,79,219,.12);
  }

  .nb-btn:active {
    transform: scale(.95);
  }

  .nb-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 21px;
    height: 21px;
    display: grid;
    place-items: center;
    padding: 0 6px;
    border: 2px solid #fff;
    border-radius: 999px;
    background: #ff2020;
    color: #fff;
    font-size: .63rem;
    font-weight: 900;
    line-height: 1;
    box-shadow: 0 8px 18px rgba(255,32,32,.28);
    animation: nb-pop .26s ease both;
  }

  @keyframes nb-pop {
    from { transform: scale(.45); opacity: .5; }
    to { transform: scale(1); opacity: 1; }
  }

  .nb-pulse {
    position: absolute;
    inset: -5px;
    border: 1px solid rgba(255,32,32,.28);
    border-radius: 18px;
    animation: nb-pulse 1.9s ease-out infinite;
    pointer-events: none;
  }

  @keyframes nb-pulse {
    0% { transform: scale(.92); opacity: .7; }
    80%, 100% { transform: scale(1.22); opacity: 0; }
  }

  .nb-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: min(390px, calc(100vw - 24px));
    border: 1px solid rgba(10,26,47,.1);
    border-radius: 22px;
    background: #fff;
    color: #0a1a2f;
    overflow: hidden;
    box-shadow: 0 24px 70px rgba(10,26,47,.18);
    z-index: 9999;
    animation: nb-slide .2s ease both;
  }

  @keyframes nb-slide {
    from { opacity: 0; transform: translateY(-8px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .nb-head {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding: 18px;
    background:
      radial-gradient(circle at 98% -15%, rgba(189,230,50,.45), transparent 9rem),
      linear-gradient(145deg, #08182b, #102b4d);
    color: #fff;
  }

  .nb-head-left {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nb-head-icon {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 15px;
    background: rgba(255,255,255,.1);
    color: #c8f03c;
  }

  .nb-head-title {
    display: block;
    color: #fff;
    font-size: .96rem;
    font-weight: 900;
    line-height: 1.1;
  }

  .nb-head-sub {
    display: block;
    margin-top: 3px;
    color: rgba(255,255,255,.58);
    font-size: .72rem;
    font-weight: 650;
  }

  .nb-mark-read {
    flex: 0 0 auto;
    min-height: 34px;
    padding: 0 10px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    color: rgba(255,255,255,.78);
    font: inherit;
    font-size: .72rem;
    font-weight: 850;
    cursor: pointer;
  }

  .nb-mark-read:hover {
    background: rgba(189,230,50,.14);
    color: #c8f03c;
  }

  .nb-list {
    max-height: 370px;
    overflow-y: auto;
    background: #f5f7fb;
  }

  .nb-list::-webkit-scrollbar { width: 5px; }
  .nb-list::-webkit-scrollbar-thumb {
    background: rgba(10,26,47,.18);
    border-radius: 999px;
  }

  .nb-loading,
  .nb-empty {
    min-height: 200px;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 30px;
  }

  .nb-spinner {
    width: 30px;
    height: 30px;
    margin: 0 auto 12px;
    border: 3px solid rgba(36,79,219,.15);
    border-right-color: #244fdb;
    border-radius: 50%;
    animation: nb-spin .8s linear infinite;
  }

  @keyframes nb-spin {
    to { transform: rotate(360deg); }
  }

  .nb-empty-icon {
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    margin: 0 auto 12px;
    border-radius: 22px;
    background: #fff;
    color: #244fdb;
    font-size: 1.8rem;
    box-shadow: 0 14px 32px rgba(10,26,47,.07);
  }

  .nb-empty-title {
    color: #0a1a2f;
    font-size: .96rem;
    font-weight: 900;
  }

  .nb-empty-text,
  .nb-loading-text {
    margin-top: 6px;
    color: #718096;
    font-size: .78rem;
    line-height: 1.5;
  }

  .nb-item {
    width: 100%;
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
    border: 0;
    border-bottom: 1px solid rgba(10,26,47,.06);
    background: transparent;
    color: inherit;
    text-align: left;
    font: inherit;
    cursor: pointer;
    transition: background .15s ease;
  }

  .nb-item:hover {
    background: #fff;
  }

  .nb-dot-wrap {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    background:
      radial-gradient(circle at 22% 15%, rgba(189,230,50,.5), transparent 3rem),
      #eaf1ff;
    font-size: 1.2rem;
  }

  .nb-item-info {
    min-width: 0;
  }

  .nb-item-title {
    color: #0a1a2f;
    font-size: .86rem;
    font-weight: 900;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nb-item-sub {
    margin-top: 4px;
    color: #718096;
    font-size: .74rem;
    font-weight: 650;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nb-item-right {
    text-align: right;
    flex-shrink: 0;
  }

  .nb-item-monto {
    color: #1f7a45;
    font-size: .88rem;
    font-weight: 950;
    white-space: nowrap;
  }

  .nb-item-hora {
    margin-top: 4px;
    color: #94a3b8;
    font-size: .69rem;
    font-weight: 700;
  }

  .nb-foot {
    padding: 13px 16px 15px;
    border-top: 1px solid rgba(10,26,47,.08);
    background: #fff;
  }

  .nb-foot-btn {
    width: 100%;
    min-height: 42px;
    border: 1px solid rgba(36,79,219,.13);
    border-radius: 14px;
    background: rgba(36,79,219,.08);
    color: #244fdb;
    font: inherit;
    font-size: .82rem;
    font-weight: 900;
    cursor: pointer;
  }

  .nb-foot-btn:hover {
    background: rgba(36,79,219,.12);
  }

  .nb-btn:focus-visible,
  .nb-mark-read:focus-visible,
  .nb-item:focus-visible,
  .nb-foot-btn:focus-visible {
    outline: 3px solid #bde632;
    outline-offset: 3px;
  }

  @media (max-width: 520px) {
    .nb-dropdown {
      position: fixed;
      top: 72px;
      left: 12px;
      right: 12px;
      width: auto;
      max-height: calc(100dvh - 96px);
      display: flex;
      flex-direction: column;
    }

    .nb-list {
      max-height: none;
      flex: 1;
    }

    .nb-head {
      align-items: flex-start;
    }

    .nb-item {
      grid-template-columns: 42px minmax(0, 1fr);
    }

    .nb-item-right {
      grid-column: 2;
      display: flex;
      gap: 10px;
      align-items: center;
      text-align: left;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-pulse,
    .nb-dropdown,
    .nb-spinner,
    .nb-badge {
      animation: none;
    }
  }
`;

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
