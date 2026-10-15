import { API_BASE_URL } from "../config/api";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

const API_URL = API_BASE_URL;
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

import CSS from "./NotificacionesCliente.styles";

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
