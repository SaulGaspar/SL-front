import { API_BASE_URL } from "../config/api";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import "../styles/pwa.css";
import PwaInstallNotice from "../components/PwaInstallNotice";

const PwaContext = createContext(null);
export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() =>
    window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true
  );
  const [online, setOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installError, setInstallError] = useState("");
  const [offlineReady, setOfflineReady] = useState(false);
  const [installHelp, setInstallHelp] = useState(false);
  const helpDialog = useRef(null);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => {
    if (installHelp && !helpDialog.current?.open) helpDialog.current?.showModal();
  }, [installHelp]);

  useEffect(() => {
    let disposed = false;
    let registration;
    let installingWorker;
    let catalogPrepared = false;
    const prepareCatalog = () => {
      if (catalogPrepared || !navigator.onLine || !navigator.serviceWorker?.controller) return;
      catalogPrepared = true;
      // La primera instalación también guarda el listado, aunque se haga desde Inicio.
      fetch(`${API_BASE_URL}/api/products`, {credentials:"omit"})
        .then(response => { if (!response.ok) catalogPrepared = false; })
        .catch(() => { catalogPrepared = false; });
    };
    const onPrompt = event => { event.preventDefault(); setInstallPrompt(event); };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    const onOnline = () => { setOnline(true); prepareCatalog(); };
    const onOffline = () => setOnline(false);
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const onDisplayMode = () => setInstalled(displayMode.matches || navigator.standalone === true);
    const onWorkerState = () => {
      if (!disposed && installingWorker?.state === "installed" && navigator.serviceWorker.controller) {
        setUpdateAvailable(true);
      }
      if (!disposed && installingWorker?.state === "activated") setOfflineReady(true);
    };
    const onUpdateFound = () => {
      installingWorker?.removeEventListener("statechange", onWorkerState);
      installingWorker = registration.installing;
      installingWorker?.addEventListener("statechange", onWorkerState);
    };
    const checkForUpdate = () => {
      if (document.visibilityState === "visible" && navigator.onLine) registration?.update().catch(() => {});
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    displayMode.addEventListener("change", onDisplayMode);
    document.addEventListener("visibilitychange", checkForUpdate);
    navigator.serviceWorker?.addEventListener("controllerchange", prepareCatalog);

    // El trabajador se genera solo en producción. Nunca intercepta Parcel/HMR.
    if (process.env.NODE_ENV === "production" && window.isSecureContext && "serviceWorker" in navigator) {
      const workerUrl = new URL("/sw.js", window.location.origin);
      navigator.serviceWorker.register(workerUrl, { scope: "/", updateViaCache: "none" })
        .then(result => {
          if (disposed) return;
          registration = result;
          setOfflineReady(Boolean(result.active));
          setUpdateAvailable(Boolean(result.waiting));
          result.addEventListener("updatefound", onUpdateFound);
          if (result.installing) onUpdateFound();
          prepareCatalog();
        }).catch(error => console.warn("No se pudo activar el soporte PWA de SportLike:", error));
    }
    return () => {
      disposed = true;
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      displayMode.removeEventListener("change", onDisplayMode);
      document.removeEventListener("visibilitychange", checkForUpdate);
      navigator.serviceWorker?.removeEventListener("controllerchange", prepareCatalog);
      registration?.removeEventListener("updatefound", onUpdateFound);
      installingWorker?.removeEventListener("statechange", onWorkerState);
    };
  }, []);

  async function install() {
    if (installing || installed) return;
    if (!installPrompt) { setInstallHelp(true); return; }
    setInstalling(true);
    setInstallError("");
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      // Cada invitación nativa solo puede utilizarse una vez.
      setInstallPrompt(null);
    } catch {
      setInstallPrompt(null);
      setInstallError("No se pudo abrir la instalación. Puedes intentarlo desde el menú del navegador.");
    } finally { setInstalling(false); }
  }

  return (
    <PwaContext.Provider value={{ canInstall: Boolean(installPrompt), installed, online, offlineReady, updateAvailable, installing, installError, install }}>
      {!online && <div className="sl-pwa-offline" role="status">Modo sin conexión: puedes explorar los productos guardados y preparar tu carrito. Precios y existencias se confirmarán al volver a conectarte.</div>}
      {children}
      <PwaInstallNotice />
      {installHelp && <dialog ref={helpDialog} className="sl-pwa-dialog" aria-labelledby="sl-pwa-install-title" onClose={() => setInstallHelp(false)}>
        <h2 id="sl-pwa-install-title">Instalar SportLike</h2>
        {ios ? <p>En Safari, toca Compartir y después Agregar a pantalla de inicio.</p> : <p>Abre el menú de Chrome o Edge y elige Instalar SportLike o Instalar esta página como aplicación. También puedes usar el icono de instalación junto a la barra de direcciones cuando el navegador lo muestre.</p>}
        <p>Si estás dentro de otra app, abre SportLike en tu navegador. La instalación requiere HTTPS, un navegador compatible y una primera visita con conexión.</p>
        <button className="sl-pwa-install" type="button" onClick={() => helpDialog.current?.close()}>Entendido</button>
      </dialog>}
    </PwaContext.Provider>
  );
}
