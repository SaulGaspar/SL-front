import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const CSS = `
  .gc-page {
    --gc-ink:#0a1a2f;
    --gc-muted:#667386;
    --gc-paper:#f5f7f4;
    --gc-card:#ffffff;
    --gc-line:rgba(10,26,47,.11);
    --gc-blue:#244fdb;
    --gc-acid:#bde632;
    min-height:100vh;
    display:grid;
    place-items:center;
    padding:34px 20px;
    background:
      linear-gradient(rgba(10,26,47,.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,26,47,.028) 1px, transparent 1px),
      radial-gradient(circle at 88% 8%, rgba(36,79,219,.1), transparent 28rem),
      var(--gc-paper);
    background-size:64px 64px,64px 64px,auto,auto;
    color:var(--gc-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }

  body[data-bs-theme="dark"] .gc-page {
    --gc-ink:#f4f7fb;
    --gc-muted:#a6b1c0;
    --gc-paper:#09131f;
    --gc-card:#101d2b;
    --gc-line:rgba(255,255,255,.11);
    --gc-blue:#86a5ff;
  }

  .gc-page *,
  .gc-page *::before,
  .gc-page *::after { box-sizing:border-box; }

  .gc-card {
    position:relative;
    width:min(100%,560px);
    overflow:hidden;
    padding:clamp(34px,6vw,56px);
    border:1px solid var(--gc-line);
    border-radius:30px;
    background:var(--gc-card);
    text-align:center;
    box-shadow:0 28px 80px rgba(10,26,47,.13);
  }

  .gc-card::before {
    content:"";
    position:absolute;
    width:210px;
    height:210px;
    right:-135px;
    top:-135px;
    border:34px solid var(--gc-acid);
    border-radius:50%;
    opacity:.92;
  }

  .gc-brand {
    position:relative;
    display:inline-flex;
    align-items:center;
    gap:10px;
    margin-bottom:30px;
    color:var(--gc-blue);
    font-size:.72rem;
    font-weight:850;
    letter-spacing:.18em;
    text-transform:uppercase;
  }

  .gc-brand-mark {
    width:38px;
    height:38px;
    display:grid;
    place-items:center;
    border-radius:13px;
    background:#0a1a2f;
    color:var(--gc-acid);
    letter-spacing:.04em;
  }

  .gc-icon {
    position:relative;
    width:82px;
    height:82px;
    display:grid;
    place-items:center;
    margin:0 auto 26px;
    border-radius:25px;
    background:rgba(36,79,219,.09);
    color:var(--gc-blue);
    font-size:2rem;
    font-weight:900;
  }

  .gc-icon.error {
    background:#fff0f0;
    color:#c93636;
  }

  body[data-bs-theme="dark"] .gc-icon.error {
    background:rgba(201,54,54,.17);
    color:#ff8d8d;
  }

  .gc-spinner {
    width:32px;
    height:32px;
    border:3px solid currentColor;
    border-right-color:transparent;
    border-radius:50%;
    animation:gc-spin .85s linear infinite;
  }

  @keyframes gc-spin {
    to { transform:rotate(360deg); }
  }

  .gc-kicker {
    position:relative;
    display:block;
    margin-bottom:12px;
    color:var(--gc-blue);
    font-size:.7rem;
    font-weight:850;
    letter-spacing:.15em;
    text-transform:uppercase;
  }

  .gc-title {
    position:relative;
    margin:0;
    color:var(--gc-ink);
    font-size:clamp(2rem,6vw,3rem);
    line-height:1;
    font-weight:900;
    letter-spacing:-.055em;
  }

  .gc-message {
    position:relative;
    max-width:420px;
    margin:18px auto 0;
    color:var(--gc-muted);
    font-size:.94rem;
    line-height:1.7;
  }

  .gc-actions {
    position:relative;
    display:flex;
    justify-content:center;
    gap:10px;
    margin-top:28px;
  }

  .gc-button {
    min-height:48px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:0 20px;
    border:1px solid transparent;
    border-radius:14px;
    background:#244fdb;
    color:#fff;
    font-size:.84rem;
    font-weight:850;
    text-decoration:none;
    box-shadow:0 10px 22px rgba(36,79,219,.2);
  }

  .gc-button.secondary {
    border-color:var(--gc-line);
    background:transparent;
    color:var(--gc-ink);
    box-shadow:none;
  }

  @media(max-width:500px) {
    .gc-page { padding:24px 12px; }
    .gc-card { border-radius:24px; padding:34px 22px; }
    .gc-actions { flex-direction:column; }
    .gc-button { width:100%; }
  }
`;

export default function GoogleCallback({ onLogin }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ usuario: "google_user" }));
      onLogin?.(JSON.parse(localStorage.getItem("user")));
      const t = setTimeout(() => navigate("/"), 900);
      return () => clearTimeout(t);
    }

    setError(true);
  }, [navigate, onLogin, params]);

  return (
    <main className="gc-page">
      <style>{CSS}</style>

      <section className="gc-card" aria-live="polite">
        <div className="gc-brand">
          <span className="gc-brand-mark">SL</span>
          SportLike
        </div>

        <div className={`gc-icon ${error ? "error" : ""}`} aria-hidden="true">
          {error ? "!" : <span className="gc-spinner" />}
        </div>

        <span className="gc-kicker">Cuenta SportLike</span>
        <h1 className="gc-title">
          {error ? "No pudimos iniciar sesión" : "Conectando tu cuenta"}
        </h1>
        <p className="gc-message">
          {error
            ? "El acceso con Google no devolvió la información necesaria. Inténtalo nuevamente desde el inicio de sesión."
            : "Estamos preparando tu sesión de forma segura. En un momento volverás a SportLike."}
        </p>

        {error && (
          <div className="gc-actions">
            <Link className="gc-button" to="/login">Volver al login</Link>
            <Link className="gc-button secondary" to="/">Ir al inicio</Link>
          </div>
        )}
      </section>
    </main>
  );
}
