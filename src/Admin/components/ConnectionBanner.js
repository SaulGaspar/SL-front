import { useEffect, useState } from "react";

export default function ConnectionBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const goOffline = () => { setOnline(false); setShowBack(false); };
    const goOnline = () => {
      setOnline(true);
      setShowBack(true);
      setTimeout(() => setShowBack(false), 3000);
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (online && !showBack) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        padding: "10px 18px", borderRadius: 12, zIndex: 9999, fontWeight: 600,
        background: online ? "#c7f22b" : "#b42318",
        color: online ? "#0b1f33" : "#fff",
      }}
    >
      {online ? "Conexión restablecida" : "Sin conexión: mostrando datos guardados"}
    </div>
  );
}