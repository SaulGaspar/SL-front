import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function Configuracion() {

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [notificaciones, setNotificaciones] = useState(true);
  const [sonidos, setSonidos] = useState(true);
  const [promos, setPromos] = useState(true);
  const [animaciones, setAnimaciones] = useState(true);
  const [idioma, setIdioma] = useState("es");

  const [pendingDark, setPendingDark] = useState(darkMode);

  /* ================== CARGAR CONFIG ================== */
  useEffect(() => {

    const saved = JSON.parse(localStorage.getItem("config-app"));

    if (saved) {
      setNotificaciones(saved.notificaciones ?? true);
      setSonidos(saved.sonidos ?? true);
      setPromos(saved.promos ?? true);
      setAnimaciones(saved.animaciones ?? true);
      setIdioma(saved.idioma ?? "es");
    }

    setPendingDark(darkMode);

  }, [darkMode]);

  /* ================== GUARDAR ================== */
  function guardarConfiguracion() {

    localStorage.setItem(
      "config-app",
      JSON.stringify({
        notificaciones,
        sonidos,
        promos,
        animaciones,
        idioma
      })
    );

    // Aplicar el tema guardado
    document.body.setAttribute(
      "data-bs-theme",
      pendingDark ? "dark" : "light"
    );

    setDarkMode(pendingDark);
  }

  return (
    <div className="container py-5">

      <div className="mb-3" style={{ color: "var(--text-muted)" }}>
        <Link to="/" className="text-decoration-none">Inicio</Link> / <b>Configuración</b>
      </div>

      <div className="card shadow-lg rounded-4 border-0 p-4">

        <h1 className="fw-bold mb-4" style={{ color: "var(--text-main)" }}>Configuración</h1>

        {/* NOTIFICACIONES */}
        <SettingRow
          title="🔔 Notificaciones"
          desc="Alertas de pedidos y estado de cuenta."
          value={notificaciones}
          onChange={() => setNotificaciones(!notificaciones)}
        />

        {/* DARK MODE */}
        <SettingRow
          title="🌙 Tema oscuro"
          desc="Reduce la luz para usar de noche."
          value={pendingDark}
          onChange={() => setPendingDark(!pendingDark)}
        />

        {/* SONIDOS */}
        <SettingRow
          title="🔊 Sonidos"
          desc="Reproducir alertas del sistema."
          value={sonidos}
          onChange={() => setSonidos(!sonidos)}
        />

        {/* PROMOS */}
        <SettingRow
          title="📧 Correos promocionales"
          desc="Recibir descuentos y ofertas."
          value={promos}
          onChange={() => setPromos(!promos)}
        />

        {/* ANIMACIONES */}
        <SettingRow
          title="✨ Animaciones"
          desc="Efectos visuales en la interfaz."
          value={animaciones}
          onChange={() => setAnimaciones(!animaciones)}
        />

        {/* IDIOMA */}
        <div 
          className="d-flex justify-content-between align-items-center rounded-4 p-3 mb-4 transition-box"
          style={{ backgroundColor: "var(--bg-main)" }}
        >
          <div>
            <div className="fw-semibold" style={{ color: "var(--text-main)" }}>🌎 Idioma</div>
            <small style={{ color: "var(--text-muted)" }}>
              Cambia el idioma de la app.
            </small>
          </div>

          <select
            className="form-select w-auto"
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              border: "1px solid var(--border-soft)"
            }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          className="btn w-100 py-3 fw-bold rounded-4"
          style={{
            backgroundColor: "var(--btn-main-bg)",
            color: "var(--btn-main-text)",
            border: "none",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0 4px 12px rgba(79, 124, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
          onClick={guardarConfiguracion}
        >
          💾 Guardar cambios
        </button>

      </div>
    </div>
  );
}

/* ================== COMPONENTE FILA ================== */

function SettingRow({ title, desc, value, onChange }) {
  return (
    <div 
      className="d-flex justify-content-between align-items-center rounded-4 p-3 mb-3 transition-box"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div>
        <div className="fw-semibold" style={{ color: "var(--text-main)" }}>{title}</div>
        <small style={{ color: "var(--text-muted)" }}>{desc}</small>
      </div>

      {/* SWITCH PERSONALIZADO ESTILO iOS */}
      <label className="ios-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
        />
        <span className="ios-slider">
          <span className="ios-label">{value ? "ON" : "OFF"}</span>
        </span>
      </label>
    </div>
  );
}
