import { API_BASE_URL } from "../../config/api";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import CSS from "./ChangePassword.styles";

export default function ChangePassword() {
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = API_BASE_URL;
  const token = localStorage.getItem("token");

  const validar = () => {
    const e = {};
    if (!form.actual) e.actual = "Ingresa tu contraseña actual.";
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(form.nueva)) {
      e.nueva = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
    if (form.nueva !== form.confirmar) {
      e.confirmar = "Las contraseñas no coinciden.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (!validar()) return;
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/update-password`,
        { actual: form.actual, nueva: form.nueva },
        { headers: { Authorization: "Bearer " + token } }
      );
      setMsgType("ok");
      setMsg("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setMsgType("err");
      setMsg(error.response?.data?.error || "Error actualizando contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cp-page">
      <style>{CSS}</style>

      <section className="cp-shell">
        <aside className="cp-aside">
          <div className="cp-brand">
            <span className="cp-brand-mark">SL</span>
            SportLike
          </div>

          <h1>Tu cuenta, más segura.</h1>
          <p>
            Actualiza tu contraseña cuando lo necesites y conserva el acceso a
            tus pedidos, datos y preferencias.
          </p>

          <div className="cp-points">
            <div className="cp-point"><span className="cp-check">✓</span>Protección de acceso</div>
            <div className="cp-point"><span className="cp-check">✓</span>Cambio rápido</div>
            <div className="cp-point"><span className="cp-check">✓</span>Cuenta cuidada</div>
          </div>
        </aside>

        <div className="cp-panel">
          <Link to="/profile" className="cp-back">← Volver al perfil</Link>

          <span className="cp-kicker">Seguridad de cuenta</span>
          <h2 className="cp-title">Cambiar contraseña</h2>
          <p className="cp-subtitle">
            Usa una contraseña distinta a la anterior y fácil de recordar para ti.
          </p>

          {msg && <div className={`cp-alert ${msgType}`}>{msg}</div>}

          <form className="cp-form" onSubmit={submit}>
            <div className="cp-field">
              <label htmlFor="actual">Contraseña actual</label>
              <div className="cp-password">
                <input
                  id="actual"
                  type={showActual ? "text" : "password"}
                  className="cp-input"
                  value={form.actual}
                  onChange={(e) => setForm({ ...form, actual: e.target.value })}
                  placeholder="Tu contraseña actual"
                />
                <button type="button" className="cp-toggle" onClick={() => setShowActual(!showActual)}>
                  {showActual ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.actual && <div className="cp-error">{errors.actual}</div>}
            </div>

            <div className="cp-field">
              <label htmlFor="nueva">Nueva contraseña</label>
              <div className="cp-password">
                <input
                  id="nueva"
                  type={showNueva ? "text" : "password"}
                  className="cp-input"
                  value={form.nueva}
                  onChange={(e) => setForm({ ...form, nueva: e.target.value })}
                  placeholder="••••••••"
                />
                <button type="button" className="cp-toggle" onClick={() => setShowNueva(!showNueva)}>
                  {showNueva ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="cp-hint">Mayúscula, minúscula, número y carácter especial.</div>
              {errors.nueva && <div className="cp-error">{errors.nueva}</div>}
            </div>

            <div className="cp-field">
              <label htmlFor="confirmar">Confirmar nueva contraseña</label>
              <div className="cp-password">
                <input
                  id="confirmar"
                  type={showConfirm ? "text" : "password"}
                  className="cp-input"
                  value={form.confirmar}
                  onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                  placeholder="Repite la nueva contraseña"
                />
                <button type="button" className="cp-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.confirmar && <div className="cp-error">{errors.confirmar}</div>}
            </div>

            <button className="cp-submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>

          <Link to="/profile" className="cp-cancel">Cancelar</Link>
        </div>
      </section>
    </main>
  );
}
