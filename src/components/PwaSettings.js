import React from "react";
import { usePwa } from "../context/PwaContext";

export default function PwaSettings() {
  const { installed, canInstall, installing, install, installError, updateAvailable, offlineReady } = usePwa();
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return (
    <section className="sl-pwa-panel" aria-labelledby="sl-pwa-title">
      <div className="sl-pwa-mark" aria-hidden="true">SL</div>
      <div className="sl-pwa-copy">
        <h2 id="sl-pwa-title">SportLike en tu dispositivo</h2>
        <p>{installed ? "Estás usando la app de SportLike." : "Abre SportLike desde tu pantalla de inicio, en su propia ventana."}</p>
        {!installed && !canInstall && <p className="sl-pwa-help">{ios
          ? "En Safari, abre Compartir y selecciona Agregar a pantalla de inicio."
          : "Si tu navegador lo permite, abre su menú y elige Instalar SportLike o Agregar a pantalla de inicio."}</p>}
        <p className="sl-pwa-help">{offlineReady ? "Lista para abrir sin conexión. El catálogo y las fotos que consultes se guardan en este dispositivo." : "Abre SportLike con conexión para preparar su contenido sin conexión."}</p>
        <p className="sl-pwa-help">Sin internet puedes explorar productos guardados y preparar el carrito. Iniciar sesión, confirmar disponibilidad y pagar requieren conexión.</p>
        {updateAvailable && <p role="status">Hay una versión nueva. Cierra todas las ventanas de SportLike y vuelve a abrir la app para actualizarla.</p>}
        {installError && <p role="alert">{installError}</p>}
      </div>
      {installed ? <span className="sl-pwa-installed">App instalada</span> :
        <button className="sl-pwa-install" type="button" onClick={install} disabled={installing}>
          {installing ? "Abriendo instalación…" : "Instalar SportLike"}
        </button>}
    </section>
  );
}

