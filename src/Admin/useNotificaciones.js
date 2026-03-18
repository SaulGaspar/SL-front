import { useState, useEffect, useRef, useCallback } from "react";

const API_URL     = "https://sl-back.vercel.app";
const POLL_MS     = 30_000;
const LS_SEEN_KEY = "admin_seen_ids";

function loadSeenIds() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_SEEN_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveSeenIds(set) {
  localStorage.setItem(LS_SEEN_KEY, JSON.stringify([...set].slice(-200)));
}

export function useNotificaciones() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(false);
  const seenRef      = useRef(loadSeenIds());
  const sessionStart = useRef(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const check = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/orders/nuevos?since=${encodeURIComponent(sessionStart.current)}&_t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      if (!res.ok) return;
      const { pedidos } = await res.json();
      if (pedidos?.length > 0) {
        setNotifs(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const nuevos = pedidos.filter(p => !seenRef.current.has(p.id) && !existingIds.has(p.id));
          if (nuevos.length === 0) return prev;
          return [...nuevos, ...prev].slice(0, 20);
        });
      }
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs(prev => {
      prev.forEach(n => seenRef.current.add(n.id));
      saveSeenIds(seenRef.current);
      return [];
    });
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, POLL_MS);
    return () => clearInterval(id);
  }, [check]);

  return { notifs, count: notifs.length, markAllRead, loading, check };
}