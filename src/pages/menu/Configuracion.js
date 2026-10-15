import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

import CSS from "./Configuracion.styles";

export default function Configuracion() {
  const { themePreference, setThemePreference } = useContext(ThemeContext);
  const [notificaciones, setNotificaciones] = useState(true);
  const [sonidos, setSonidos] = useState(true);
  const [promos, setPromos] = useState(true);
  const [animaciones, setAnimaciones] = useState(true);
  const [idioma, setIdioma] = useState("es");
  const [pendingTheme, setPendingTheme] = useState(themePreference);
  const [saved, setSaved] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(() => window.Notification?.permission || "unsupported");

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("config-app") || "null");

    if (savedConfig) {
      setNotificaciones(savedConfig.notificaciones ?? true);
      setSonidos(savedConfig.sonidos ?? true);
      setPromos(savedConfig.promos ?? true);
      setAnimaciones(savedConfig.animaciones ?? true);
      setIdioma(savedConfig.idioma ?? "es");
    }

    setPendingTheme(themePreference);
  }, [themePreference]);

  function guardarConfiguracion() {
    localStorage.setItem(
      "config-app",
      JSON.stringify({
        notificaciones,
        sonidos,
        promos,
        animaciones,
        idioma,
      })
    );

    document.body.dataset.reduceMotion = animaciones ? "false" : "true";
    setThemePreference(pendingTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  async function toggleNotifications() {
    const next = !notificaciones;
    if (next && "Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission !== "granted") return;
    }
    setNotificaciones(next);
  }

  function testSound() {
    if (!sonidos) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + .18);
  }

  function restablecer() {
    setNotificaciones(false); setSonidos(true); setPromos(false); setAnimaciones(true); setIdioma("es");
    setPendingTheme("system"); setThemePreference("system");
    localStorage.removeItem("config-app");
    document.body.dataset.reduceMotion = "false";
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  }

  const settings = [
    {
      icon: "🔔",
      title: "Notificaciones",
      desc: notificationPermission === "granted" ? "Permiso concedido en este navegador." : "Te pedirá permiso al activarlo.",
      value: notificaciones,
      onChange: toggleNotifications,
    },
    {
      icon: "🔊",
      title: "Sonidos",
      desc: "Reproducir alertas del sistema.",
      value: sonidos,
      onChange: () => setSonidos(!sonidos),
    },
    {
      icon: "✨",
      title: "Animaciones",
      desc: "Efectos visuales en la interfaz.",
      value: animaciones,
      onChange: () => setAnimaciones(!animaciones),
    },
  ];

  return (
    <main className="cfg-page">
      <style>{CSS}</style>

      <div className="cfg-wrap">
        <section className="cfg-hero">
          <div className="cfg-breadcrumb">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <strong>Configuración</strong>
          </div>

          <span className="cfg-kicker">Preferencias SportLike</span>
          <h1 className="cfg-title">Ajusta tu experiencia.</h1>
          <p className="cfg-subtitle">
            Personaliza el aspecto, la accesibilidad y las alertas de tu experiencia en SportLike.
          </p>
        </section>

        <section className="sl-pwa-panel" aria-labelledby="location-settings-title">
          <div className="sl-pwa-mark" aria-hidden="true">⌖</div>
          <div className="sl-pwa-copy">
            <h2 id="location-settings-title">Ubicación del dispositivo</h2>
            <p>Usa tu ubicación en Tiendas para preparar una ruta. El navegador te pedirá permiso cuando pulses “Usar mi ubicación”.</p>
            <p className="sl-pwa-help">No se activa automáticamente ni se guarda en tu cuenta.</p>
          </div>
          <Link className="cfg-action" style={{display:"inline-flex",alignItems:"center",textDecoration:"none"}} to="/tiendas">Ir a Tiendas</Link>
        </section>
        <div className="cfg-layout">
          <section className="cfg-panel">
            <div className="cfg-section-head">
              <div>
                <h2>Preferencias</h2>
                <p>Estos cambios se guardan en este dispositivo para que tu navegación se sienta más cómoda.</p>
              </div>
              {saved && <span className="cfg-saved">✓ Cambios guardados</span>}
            </div>

            <div className="cfg-list">
              <div className="cfg-row">
                <div className="cfg-row-icon">◐</div>
                <div>
                  <div className="cfg-row-title">Apariencia</div>
                  <div className="cfg-row-desc">Elige un tema fijo o permite que SportLike siga la configuración de tu dispositivo.</div>
                </div>
                <div className="cfg-row-control cfg-theme-options">
                  {[['system','Automático'],['light','Claro'],['dark','Oscuro']].map(([value,label])=><button type="button" key={value} className={`cfg-theme-option ${pendingTheme===value?"active":""}`} onClick={()=>setPendingTheme(value)}>{label}</button>)}
                </div>
              </div>
              {settings.map((item) => (
                <SettingRow key={item.title} {...item} />
              ))}

            </div>
            <div className="cfg-actions">
              <button className="cfg-action primary" onClick={testSound} disabled={!sonidos}>Probar sonido</button>
              <button className="cfg-action danger" onClick={restablecer}>Restablecer preferencias</button>
              <button className="cfg-save" style={{marginTop:0,flex:1}} onClick={guardarConfiguracion}>Guardar cambios</button>
            </div>
          </section>

          <aside className="cfg-summary">
            <div className="cfg-summary-badge">SL</div>
            <h3>Tu cuenta, a tu ritmo.</h3>
            <p>
              Mantén activas solo las opciones que realmente quieres usar mientras compras y revisas tus pedidos.
            </p>

            <div className="cfg-summary-list">
              <div className="cfg-summary-item"><span>Tema</span><strong>{{system:"Automático",light:"Claro",dark:"Oscuro"}[pendingTheme]}</strong></div>
              <div className="cfg-summary-item"><span>Notificaciones</span><strong>{notificaciones ? "Activas" : "Pausadas"}</strong></div>
              <div className="cfg-summary-item"><span>Animaciones</span><strong>{animaciones ? "Activas" : "Reducidas"}</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SettingRow({ icon, title, desc, value, onChange }) {
  return (
    <div className="cfg-row">
      <div className="cfg-row-icon">{icon}</div>
      <div>
        <div className="cfg-row-title">{title}</div>
        <div className="cfg-row-desc">{desc}</div>
      </div>
      <div className="cfg-row-control">
        <label className="cfg-switch">
          <input type="checkbox" checked={value} onChange={onChange} />
          <span className="cfg-slider" />
        </label>
      </div>
    </div>
  );
}
