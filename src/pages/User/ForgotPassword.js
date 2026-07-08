import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CSS = `
  .fp-page {
    --fp-ink: #0a1a2f;
    --fp-muted: #657286;
    --fp-paper: #f5f7f4;
    --fp-card: #ffffff;
    --fp-line: rgba(10, 26, 47, .11);
    --fp-blue: #244fdb;
    --fp-acid: #bde632;
    min-height: calc(100vh - 70px);
    display: grid;
    place-items: center;
    padding: 48px 20px;
    background:
      radial-gradient(circle at 12% 16%, rgba(189,230,50,.28), transparent 20rem),
      radial-gradient(circle at 88% 10%, rgba(36,79,219,.1), transparent 26rem),
      var(--fp-paper);
    color: var(--fp-ink);
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  body[data-bs-theme="dark"] .fp-page {
    --fp-ink: #f3f6fa;
    --fp-muted: #a6b1c0;
    --fp-paper: #09131f;
    --fp-card: #101d2b;
    --fp-line: rgba(255, 255, 255, .11);
    --fp-blue: #86a5ff;
  }

  .fp-page *,
  .fp-page *::before,
  .fp-page *::after { box-sizing: border-box; }

  .fp-card {
    position: relative;
    width: min(100%, 610px);
    padding: clamp(34px, 6vw, 58px);
    border: 1px solid var(--fp-line);
    border-radius: 30px;
    background: var(--fp-card);
    overflow: hidden;
    box-shadow: 0 26px 70px rgba(10,26,47,.13);
  }

  .fp-card::before {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    right: -132px;
    top: -132px;
    border: 34px solid var(--fp-acid);
    border-radius: 50%;
    opacity: .92;
  }

  .fp-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 34px;
  }

  .fp-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--fp-blue);
    font-size: .72rem;
    font-weight: 850;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .fp-brand-mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #0a1a2f;
    color: var(--fp-acid);
    letter-spacing: .04em;
  }

  .fp-login {
    color: var(--fp-muted);
    text-decoration: none;
    font-size: .84rem;
    font-weight: 800;
  }

  .fp-icon {
    position: relative;
    width: 76px;
    height: 76px;
    display: grid;
    place-items: center;
    margin-bottom: 24px;
    border-radius: 24px;
    background: rgba(36,79,219,.09);
    color: var(--fp-blue);
  }

  .fp-icon.success {
    background: #e9f8ef;
    color: #23864b;
  }

  body[data-bs-theme="dark"] .fp-icon.success {
    background: rgba(35,134,75,.17);
    color: #7be09d;
  }

  .fp-kicker {
    position: relative;
    display: block;
    margin-bottom: 12px;
    color: var(--fp-blue);
    font-size: .7rem;
    font-weight: 850;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .fp-title {
    position: relative;
    max-width: 470px;
    margin: 0;
    color: var(--fp-ink);
    font-size: clamp(2.1rem, 6vw, 3.4rem);
    line-height: .98;
    font-weight: 900;
    letter-spacing: -.06em;
  }

  .fp-sub {
    position: relative;
    max-width: 460px;
    margin: 18px 0 0;
    color: var(--fp-muted);
    line-height: 1.7;
    font-size: .94rem;
  }

  .fp-alert {
    position: relative;
    margin: 24px 0 0;
    padding: 13px 15px;
    border-radius: 15px;
    border: 1px solid rgba(201,54,54,.18);
    background: #fff0f0;
    color: #c93636;
    font-size: .9rem;
    font-weight: 650;
  }

  body[data-bs-theme="dark"] .fp-alert {
    background: rgba(201,54,54,.15);
    color: #ff9a9a;
  }

  .fp-form {
    position: relative;
    display: grid;
    gap: 18px;
    margin-top: 30px;
  }

  .fp-field label {
    display: block;
    margin-bottom: 8px;
    color: var(--fp-ink);
    font-size: .86rem;
    font-weight: 800;
  }

  .fp-input {
    width: 100%;
    min-height: 54px;
    padding: 0 16px;
    border: 1px solid var(--fp-line);
    border-radius: 15px;
    background: rgba(255,255,255,.72);
    color: var(--fp-ink);
    font: inherit;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  body[data-bs-theme="dark"] .fp-input {
    background: rgba(255,255,255,.05);
  }

  .fp-input:focus {
    border-color: rgba(36,79,219,.55);
    box-shadow: 0 0 0 4px rgba(36,79,219,.10);
    background: var(--fp-card);
  }

  .fp-input::placeholder {
    color: color-mix(in srgb, var(--fp-muted), transparent 10%);
  }

  .fp-error {
    margin-top: 7px;
    color: #c93636;
    font-size: .78rem;
    line-height: 1.45;
    font-weight: 700;
  }

  body[data-bs-theme="dark"] .fp-error {
    color: #ff9a9a;
  }

  .fp-btn {
    min-height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 15px;
    background: #244fdb;
    color: #fff;
    font-size: .92rem;
    font-weight: 850;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(36,79,219,.22);
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  }

  .fp-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(36,79,219,.28);
  }

  .fp-btn:disabled {
    opacity: .68;
    cursor: not-allowed;
    transform: none;
  }

  .fp-back {
    position: relative;
    display: inline-flex;
    justify-content: center;
    margin-top: 18px;
    color: var(--fp-muted);
    text-decoration: none;
    font-size: .86rem;
    font-weight: 750;
  }

  .fp-success {
    position: relative;
  }

  .fp-success-mail {
    color: var(--fp-ink);
    font-weight: 850;
    word-break: break-word;
  }

  .fp-actions {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    margin-top: 30px;
  }

  .fp-secondary {
    min-height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 124px;
    border: 1px solid var(--fp-line);
    border-radius: 15px;
    background: transparent;
    color: var(--fp-ink);
    text-decoration: none;
    font-size: .9rem;
    font-weight: 850;
  }

  .fp-login:focus-visible,
  .fp-btn:focus-visible,
  .fp-back:focus-visible,
  .fp-secondary:focus-visible {
    outline: 3px solid var(--fp-acid);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    .fp-page { padding: 22px 12px; }
    .fp-card { padding: 32px 22px; border-radius: 24px; }
    .fp-top { align-items: flex-start; flex-direction: column; margin-bottom: 28px; }
    .fp-actions { grid-template-columns: 1fr; }
    .fp-secondary { width: 100%; }
  }
`;

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
      await axios.post("https://sl-back.vercel.app/api/forgot-password", { correo });
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
