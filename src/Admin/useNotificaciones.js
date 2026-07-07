import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "https://sl-back.vercel.app";
const POLL_MS = 30_000;
const LS_SEEN_KEY = "admin_seen_ids";

function loadSeenIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_SEEN_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(set) {
  localStorage.setItem(LS_SEEN_KEY, JSON.stringify([...set].slice(-250)));
}

function itemKey(item) {
  return String(item?.id ?? "");
}

export function useNotificaciones() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const seenRef = useRef(loadSeenIds());
  const mountedRef = useRef(true);
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

      const data = await res.json();
      const pedidos = Array.isArray(data.pedidos) ? data.pedidos : [];

      if (!mountedRef.current) return;

      setNotifs((prev) => {
        const existingIds = new Set(prev.map(itemKey));
        const nuevos = pedidos.filter((pedido) => {
          const key = itemKey(pedido);
          return key && !seenRef.current.has(key) && !existingIds.has(key);
        });

        if (nuevos.length === 0) return prev;
        return [...nuevos, ...prev].slice(0, 25);
      });

      setLastCheck(new Date());
    } catch {
      // Se mantiene silencioso para no interrumpir el panel.
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => {
      prev.forEach((notif) => {
        const key = itemKey(notif);
        if (key) seenRef.current.add(key);
      });
      saveSeenIds(seenRef.current);
      return [];
    });
  }, []);

  const markOneRead = useCallback((notif) => {
    const key = itemKey(notif);
    if (!key) return;

    seenRef.current.add(key);
    saveSeenIds(seenRef.current);
    setNotifs((prev) => prev.filter((item) => itemKey(item) !== key));
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    check();

    const id = setInterval(check, POLL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [check]);

  return {
    notifs,
    count: notifs.length,
    markAllRead,
    markOneRead,
    loading,
    check,
    lastCheck,
  };
}
