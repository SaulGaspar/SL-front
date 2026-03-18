import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "https://sl-back.vercel.app";
const POLL_INTERVAL = 30000; // 30 segundos
const LS_KEY = "admin_last_seen"; // timestamp de la última vez que se vio

/**
 * Hook que hace polling cada 30s buscando pedidos nuevos.
 * Devuelve:
 *   - notifs: array de pedidos nuevos
 *   - count:  número de notificaciones sin leer
 *   - markAllRead(): marcar como leídas
 *   - loading: si está cargando
 */
export function useNotificaciones() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(false);
  const lastSeenRef = useRef(localStorage.getItem(LS_KEY) || new Date(Date.now() - 60000).toISOString());

  const check = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/orders/nuevos?since=${encodeURIComponent(lastSeenRef.current)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.pedidos?.length > 0) {
        setNotifs(prev => {
          // Evitar duplicados
          const ids = new Set(prev.map(n => n.id));
          const nuevos = data.pedidos.filter(p => !ids.has(p.id));
          return [...nuevos, ...prev].slice(0, 20); // max 20
        });
      }
    } catch(e) {
      // silencioso — no romper la UI
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(() => {
    const now = new Date().toISOString();
    lastSeenRef.current = now;
    localStorage.setItem(LS_KEY, now);
    setNotifs([]);
  }, []);

  useEffect(() => {
    check(); // check inmediato al montar
    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [check]);

  return { notifs, count: notifs.length, markAllRead, loading, check };
}