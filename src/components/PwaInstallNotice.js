import React, { useEffect, useState } from "react";
import { usePwa } from "../context/PwaContext";

export default function PwaInstallNotice() {
  const { canInstall, installed, online, installing, install, installError } = usePwa();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("sportlike-install-dismissed") === "1"; } catch { return false; }
  });
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = ios && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  function dismiss() {
    setDismissed(true);
    try { sessionStorage.setItem("sportlike-install-dismissed", "1"); } catch { /* Cerrar también funciona sin almacenamiento. */ }
  }
  if (!ready || dismissed || installed || !online || (!canInstall && !safari && !installError)) return null;
  return <aside className="sl-install-notice" aria-labelledby="sl-install-notice-title">
    <div className="sl-install-notice-copy" role="status">
      <strong id="sl-install-notice-title">Lleva SportLike contigo</strong>
      <p>Instala la app y consulta los productos guardados incluso sin conexión.</p>
    </div>
    <button className="sl-install-close" type="button" aria-label="Cerrar aviso de instalación" onClick={dismiss}>×</button>
    {installError && <p role="alert">{installError}</p>}
    <div className="sl-install-actions">
      <button className="sl-pwa-install" type="button" disabled={installing} onClick={install}>{installing ? "Abriendo instalación…" : "Instalar SportLike"}</button>
      <button className="sl-install-later" type="button" onClick={dismiss}>Ahora no</button>
    </div>
  </aside>;
}
