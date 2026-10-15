import { API_BASE_URL } from "../../config/api";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import CSS from "./ForgotPassword.styles";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validar = () => {
    const e = {};
    if (!correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      e.correo = "Ingresa un correo válido.";
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
      await axios.post(`${API_BASE_URL}/api/forgot-password`, { correo });
      setSent(true);
    } catch (error) {
      setMsg(error.response?.data?.error || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fp-page">
      <style>{CSS}</style>

      <section className="fp-card">
        <div className="fp-top">
          <div className="fp-brand">
            <span className="fp-brand-mark">SL</span>
            SportLike
          </div>

          <Link to="/login" className="fp-login">Iniciar sesión</Link>
        </div>

        {!sent ? (
          <>
            <div className="fp-icon" aria-hidden="true">
              <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3.8 7.5 8.2 5.8 8.2-5.8" />
              </svg>
            </div>

            <span className="fp-kicker">Recuperación de cuenta</span>
            <h1 className="fp-title">Recuperar contraseña</h1>
            <p className="fp-sub">
              Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.
            </p>

            {msg && <div className="fp-alert">{msg}</div>}

            <form className="fp-form" onSubmit={submit}>
              <div className="fp-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  className="fp-input"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
                {errors.correo && <div className="fp-error">{errors.correo}</div>}
              </div>

              <button className="fp-btn" disabled={loading}>
                {loading ? "Enviando…" : "Enviar instrucciones"}
              </button>
            </form>

            <Link to="/login" className="fp-back">← Volver al inicio de sesión</Link>
          </>
        ) : (
          <div className="fp-success">
            <div className="fp-icon success" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <span className="fp-kicker">Correo enviado</span>
            <h1 className="fp-title">Revisa tu bandeja</h1>
            <p className="fp-sub">
              Si <span className="fp-success-mail">{correo}</span> está registrado,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>

            <div className="fp-actions">
              <Link to="/login" className="fp-btn">Volver al inicio de sesión</Link>
              <Link to="/" className="fp-secondary">Ir al inicio</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
