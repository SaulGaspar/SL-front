import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

const API_URL = "https://sl-back.vercel.app";
const LS_KEY = "cliente_notif_seen";
const POLL_MS = 45000;

const STATUS_LABEL = {
  pendiente: { label: "Recibido", color: "#d69e2e", icon: "📋" },
  preparando: { label: "Preparando", color: "#3182ce", icon: "📦" },
  en_camino: { label: "En camino", color: "#805ad5", icon: "🚚" },
  entregado: { label: "Entregado", color: "#38a169", icon: "✅" },
  cancelado: { label: "Cancelado", color: "#e53e3e", icon: "✕" },
};

const fmtMXN = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtHora = (f) =>
  f ? new Date(f).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "";

const fmtFecha = (f) =>
  f ? new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }) : "";

const safeRead = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
};

const notifKey = (notif) => `${notif.id}-${notif.status || "pendiente"}`;

const CSS = `
  .ncl-wrap {
    position: relative;
    display: inline-flex;
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  .ncl-btn {
    position: relative;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    color: var(--muted, rgba(255,255,255,.58));
    cursor: pointer;
    font-size: 1.18rem;
    transition: color .18s ease, background .18s ease, border-color .18s ease, transform .18s ease;
  }

  .ncl-btn:hover,
  .ncl-btn.active {
    color: #c8f03c;
    background: rgba(200,240,60,.1);
    border-color: rgba(200,240,60,.18);
  }

  .ncl-btn:active {
    transform: scale(.95);
  }

  .ncl-count {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    padding: 0 6px;
    border: 2px solid #0a1a2f;
    border-radius: 999px;
    background: #ff2020;
    color: #fff;
    font-size: .63rem;
    font-weight: 900;
    line-height: 1;
    box-shadow: 0 8px 18px rgba(255,32,32,.28);
  }

  .ncl-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    border: 2px solid #0a1a2f;
    border-radius: 50%;
    background: #ff2020;
    animation: ncl-pulse 1.8s ease-out infinite;
  }

  @keyframes ncl-pulse {
    0% { box-shadow: 0 0 0 0 rgba(255,32,32,.45); }
    80%, 100% { box-shadow: 0 0 0 8px rgba(255,32,32,0); }
  }

  .ncl-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: min(380px, calc(100vw - 24px));
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 22px;
    background: #0d2240;
    color: #fff;
    overflow: hidden;
    box-shadow: 0 24px 70px rgba(0,0,0,.38);
    z-index: 9999;
    animation: ncl-in .2s ease both;
  }

  @keyframes ncl-in {
    from { opacity: 0; transform: translateY(-8px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ncl-dropdown::before {
    content: "";
    position: absolute;
    width: 160px;
    height: 160px;
    right: -95px;
    top: -95px;
    border: 26px solid rgba(200,240,60,.85);
    border-radius: 50%;
    pointer-events: none;
  }

  .ncl-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 18px 18px 15px;
    background:
      radial-gradient(circle at 100% 0%, rgba(200,240,60,.18), transparent 9rem),
      rgba(255,255,255,.045);
    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  .ncl-head-left {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .ncl-head-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 14px;
    background: rgba(255,255,255,.08);
    color: #c8f03c;
  }

  .ncl-head-title {
    display: block;
    color: #fff;
    font-size: .95rem;
    font-weight: 850;
    line-height: 1.1;
  }

  .ncl-head-sub {
    display: block;
    margin-top: 3px;
    color: rgba(255,255,255,.48);
    font-size: .72rem;
    font-weight: 600;
  }

  .ncl-mark-read {
    flex: 0 0 auto;
    min-height: 34px;
    padding: 0 10px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 999px;
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.72);
    font: inherit;
    font-size: .72rem;
    font-weight: 800;
    cursor: pointer;
    transition: background .18s ease, color .18s ease;
  }

  .ncl-mark-read:hover {
    background: rgba(200,240,60,.12);
    color: #c8f03c;
  }

  .ncl-list {
    position: relative;
    max-height: 365px;
    overflow-y: auto;
    background: rgba(255,255,255,.02);
  }

  .ncl-list::-webkit-scrollbar { width: 5px; }
  .ncl-list::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,.16);
    border-radius: 999px;
  }

  .ncl-loading,
  .ncl-empty {
    min-height: 190px;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 28px;
  }

  .ncl-spinner {
    width: 30px;
    height: 30px;
    margin: 0 auto 12px;
    border: 3px solid rgba(200,240,60,.28);
    border-right-color: #c8f03c;
    border-radius: 50%;
    animation: ncl-spin .8s linear infinite;
  }

  @keyframes ncl-spin {
    to { transform: rotate(360deg); }
  }

  .ncl-empty-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    margin: 0 auto 12px;
    border-radius: 20px;
    background: rgba(255,255,255,.07);
    font-size: 1.8rem;
  }

  .ncl-empty-title {
    color: rgba(255,255,255,.9);
    font-size: .95rem;
    font-weight: 850;
  }

  .ncl-empty-text,
  .ncl-loading-text {
    margin-top: 6px;
    color: rgba(255,255,255,.46);
    font-size: .78rem;
    line-height: 1.5;
  }

  .ncl-item {
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
    border: 0;
    border-bottom: 1px solid rgba(255,255,255,.065);
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    font: inherit;
    transition: background .15s ease;
  }

  .ncl-item:hover {
    background: rgba(255,255,255,.045);
  }

  .ncl-item.unread {
    background: linear-gradient(90deg, rgba(200,240,60,.095), rgba(200,240,60,0));
  }

  .ncl-item.unread::before {
    content: "";
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    border-radius: 999px;
    background: #c8f03c;
  }

  .ncl-item-icon {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: rgba(255,255,255,.075);
    font-size: 1.08rem;
  }

  .ncl-item-body {
    min-width: 0;
  }

  .ncl-item-title {
    color: rgba(255,255,255,.92);
    font-size: .84rem;
    font-weight: 800;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ncl-item-sub {
    margin-top: 4px;
    color: rgba(255,255,255,.43);
    font-size: .74rem;
    font-weight: 650;
  }

  .ncl-item-right {
    text-align: right;
    flex-shrink: 0;
  }

  .ncl-item-status {
    font-size: .72rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .ncl-item-time {
    margin-top: 4px;
    color: rgba(255,255,255,.36);
    font-size: .68rem;
    font-weight: 650;
  }

  .ncl-foot {
    padding: 13px 16px 15px;
    border-top: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.035);
  }

  .ncl-foot-btn {
    width: 100%;
    min-height: 42px;
    border: 1px solid rgba(200,240,60,.18);
    border-radius: 14px;
    background: rgba(200,240,60,.1);
    color: #c8f03c;
    font: inherit;
    font-size: .82rem;
    font-weight: 850;
    cursor: pointer;
  }

  .ncl-foot-btn:hover {
    background: rgba(200,240,60,.15);
  }

  .ncl-btn:focus-visible,
  .ncl-mark-read:focus-visible,
  .ncl-item:focus-visible,
  .ncl-foot-btn:focus-visible {
    outline: 3px solid #c8f03c;
    outline-offset: 3px;
  }

  @media (max-width: 520px) {
    .ncl-dropdown {
      position: fixed;
      top: 72px;
      left: 12px;
      right: 12px;
      width: auto;
      max-height: calc(100dvh - 96px);
      display: flex;
      flex-direction: column;
    }

    .ncl-list {
      max-height: none;
      flex: 1;
    }

    .ncl-head {
      align-items: flex-start;
    }

    .ncl-mark-read {
      padding: 0 9px;
    }

    .ncl-item {
      grid-template-columns: 40px minmax(0, 1fr);
    }

    .ncl-item-right {
      grid-column: 2;
      text-align: left;
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ncl-dot,
    .ncl-spinner,
    .ncl-dropdown {
      animation: none;
    }
  }
`;

export default function NotificacionesCliente({ user, onVerPedidos }) {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(null);

  const seenKey = useMemo(() => {
    const userKey = user?.id || user?.cliente_id || user?.email || "cliente";
    return `${LS_KEY}:${userKey}`;
  }, [user]);

  const [seen, setSeen] = useState(() => safeRead(seenKey));

  useEffect(() => {
    setSeen(safeRead(seenKey));
  }, [seenKey]);

  const unread = notifs.filter((n) => !seen.has(notifKey(n))).length;

  const check = useCallback(async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/notificaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifs(Array.isArray(data.pedidos) ? data.pedidos : []);
    } catch {
      // Se mantiene silencioso para no molestar al usuario.
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_MS);
    return () => clearInterval(interval);
  }, [check]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const markAllRead = useCallback(() => {
    const ids = notifs.map(notifKey);
    const next = new Set(ids);
    setSeen(next);
    localStorage.setItem(seenKey, JSON.stringify([...next]));
  }, [notifs, seenKey]);

  const handleOpen = () => {
    setOpen((current) => {
      const next = !current;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (next) timerRef.current = setTimeout(markAllRead, 1500);
      return next;
    });
  };

  const openOrders = () => {
    setOpen(false);
    onVerPedidos?.();
  };

  if (!user) return null;

  return (
    <>
      <style>{CSS}</style>

      <div className="ncl-wrap" ref={ref}>
        <button
          className={`ncl-btn ${open ? "active" : ""}`}
          onClick={handleOpen}
          title="Mis notificaciones"
          aria-label={unread > 0 ? `Mis notificaciones, ${unread} nuevas` : "Mis notificaciones"}
          aria-expanded={open}
        >
          <i className="bi bi-bell" aria-hidden="true" />
          {unread > 0 && (
            unread <= 9 ? <span className="ncl-count">{unread}</span> : <span className="ncl-dot" />
          )}
        </button>

        {open && (
          <div className="ncl-dropdown">
            <div className="ncl-head">
              <div className="ncl-head-left">
                <span className="ncl-head-icon" aria-hidden="true">🔔</span>
                <div>
                  <span className="ncl-head-title">Mis pedidos</span>
                  <span className="ncl-head-sub">
                    {unread > 0 ? `${unread} actualización${unread !== 1 ? "es" : ""} nueva${unread !== 1 ? "s" : ""}` : "Todo al día"}
                  </span>
                </div>
              </div>

              {unread > 0 && (
                <button className="ncl-mark-read" onClick={markAllRead}>
                  ✓ Leídas
                </button>
              )}
            </div>

            <div className="ncl-list">
              {loading && notifs.length === 0 ? (
                <div className="ncl-loading">
                  <div>
                    <div className="ncl-spinner" />
                    <div className="ncl-loading-text">Buscando actualizaciones...</div>
                  </div>
                </div>
              ) : notifs.length === 0 ? (
                <div className="ncl-empty">
                  <div>
                    <div className="ncl-empty-icon">📭</div>
                    <div className="ncl-empty-title">Sin actualizaciones recientes</div>
                    <div className="ncl-empty-text">Cuando cambie el estado de tus pedidos aparecerá aquí.</div>
                  </div>
                </div>
              ) : (
                notifs.map((n) => {
                  const cfg = STATUS_LABEL[n.status] || STATUS_LABEL.pendiente;
                  const isUnread = !seen.has(notifKey(n));

                  return (
                    <button
                      key={notifKey(n)}
                      className={`ncl-item ${isUnread ? "unread" : ""}`}
                      onClick={openOrders}
                    >
                      <div className="ncl-item-icon" aria-hidden="true">{cfg.icon}</div>

                      <div className="ncl-item-body">
                        <div className="ncl-item-title">Pedido del {fmtFecha(n.fecha)}</div>
                        <div className="ncl-item-sub">{fmtMXN(n.total)}</div>
                      </div>

                      <div className="ncl-item-right">
                        <div className="ncl-item-status" style={{ color: cfg.color }}>
                          {cfg.label}
                        </div>
                        <div className="ncl-item-time">{fmtHora(n.fecha)}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="ncl-foot">
              <button className="ncl-foot-btn" onClick={openOrders}>
                Ver todos mis pedidos →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
