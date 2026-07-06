import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const CSS = `
  .verify-page {
    --verify-ink: #0a1a2f;
    --verify-muted: #687587;
    --verify-paper: #f5f7f4;
    --verify-card: #ffffff;
    --verify-line: rgba(10, 26, 47, .11);
    --verify-blue: #244fdb;
    --verify-acid: #bde632;
    min-height: calc(100vh - 70px);
    display: grid;
    place-items: center;
    padding: 48px 20px;
    background:
      radial-gradient(circle at 88% 10%, rgba(36,79,219,.1), transparent 25rem),
      var(--verify-paper);
    color: var(--verify-ink);
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  body[data-bs-theme="dark"] .verify-page {
    --verify-ink: #f3f6fa;
    --verify-muted: #a6b1c0;
    --verify-paper: #09131f;
    --verify-card: #101d2b;
    --verify-line: rgba(255, 255, 255, .11);
    --verify-blue: #82a2ff;
  }

  .verify-page *,
  .verify-page *::before,
  .verify-page *::after { box-sizing: border-box; }

  .verify-card {
    position: relative;
    width: min(100%, 560px);
    padding: clamp(34px, 6vw, 56px);
    border: 1px solid var(--verify-line);
    border-radius: 26px;
    background: var(--verify-card);
    text-align: center;
    overflow: hidden;
    box-shadow: 0 24px 65px rgba(10,26,47,.12);
  }

  .verify-card::before {
    content: "";
    position: absolute;
    width: 210px;
    height: 210px;
    right: -135px;
    top: -135px;
    border: 34px solid var(--verify-acid);
    border-radius: 50%;
    opacity: .9;
  }

  .verify-icon {
    position: relative;
    width: 82px;
    height: 82px;
    display: grid;
    place-items: center;
    margin: 0 auto 26px;
    border-radius: 24px;
    font-size: 2rem;
    font-weight: 800;
  }

  .verify-icon.loading {
    background: rgba(36,79,219,.09);
    color: var(--verify-blue);
  }

  .verify-icon.success {
    background: #e7f8ec;
    color: #23864b;
  }

  .verify-icon.error {
    background: #fff0f0;
    color: #c93636;
  }

  body[data-bs-theme="dark"] .verify-icon.success {
    background: rgba(35,134,75,.17);
    color: #6dd695;
  }

  body[data-bs-theme="dark"] .verify-icon.error {
    background: rgba(201,54,54,.17);
    color: #ff8d8d;
  }

  .verify-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: verify-spin .8s linear infinite;
  }

  @keyframes verify-spin {
    to { transform: rotate(360deg); }
  }

  .verify-eyebrow {
    display: block;
    margin-bottom: 12px;
    color: var(--verify-blue);
    font-size: .69rem;
    font-weight: 750;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .verify-title {
    margin: 0;
    color: var(--verify-ink);
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -.055em;
  }

  .verify-message {
    max-width: 420px;
    min-height: 52px;
    margin: 18px auto 0;
    color: var(--verify-muted);
    font-size: .92rem;
    line-height: 1.7;
  }

  .verify-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
  }

  .verify-button {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: #244fdb;
    color: #fff;
    font-size: .82rem;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 22px rgba(36,79,219,.2);
  }

  .verify-button.secondary {
    border-color: var(--verify-line);
    background: transparent;
    color: var(--verify-ink);
    box-shadow: none;
  }

  .verify-button:focus-visible {
    outline: 3px solid var(--verify-acid);
    outline-offset: 3px;
  }

  @media (max-width: 500px) {
    .verify-page { padding: 24px 12px; }
    .verify-card { padding: 36px 22px; border-radius: 21px; }
    .verify-actions { flex-direction: column; }
    .verify-button { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .verify-spinner { animation-duration: 1.8s; }
  }
`;

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Estamos verificando tu correo.");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("El enlace de verificación está incompleto.");
      return;
    }

    axios
      .get(`https://sl-back.vercel.app/api/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        setStatus("success");
        setMessage("Tu correo fue verificado correctamente. Ya puedes iniciar sesión.");
      })
      .catch(() => {
        setStatus("error");
        setMessage("El enlace no es válido o ha expirado. Solicita uno nuevo para continuar.");
      });
  }, [token]);

  const title =
    status === "success"
      ? "Correo verificado"
      : status === "error"
        ? "No pudimos verificarlo"
        : "Verificando correo";

  return (
    <main className="verify-page">
      <style>{CSS}</style>

      <section className="verify-card" aria-live="polite">
        <div className={`verify-icon ${status}`} aria-hidden="true">
          {status === "loading" && <span className="verify-spinner" />}
          {status === "success" && "✓"}
          {status === "error" && "!"}
        </div>

        <span className="verify-eyebrow">Cuenta SportLike</span>
        <h1 className="verify-title">{title}</h1>
        <p className="verify-message">{message}</p>

        {status !== "loading" && (
          <div className="verify-actions">
            {status === "success" && (
              <Link to="/login" className="verify-button">Iniciar sesión</Link>
            )}
            {status === "error" && (
              <Link to="/register" className="verify-button">Volver al registro</Link>
            )}
            <Link to="/" className="verify-button secondary">Ir al inicio</Link>
          </div>
        )}
      </section>
    </main>
  );
}
