import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Loader2 } from "lucide-react";

const CSS = `
  .error-page {
    --error-ink: #0a1a2f;
    --error-muted: #667386;
    --error-paper: #f5f7f4;
    --error-card: #ffffff;
    --error-line: rgba(10,26,47,.11);
    --error-accent: #244fdb;
    --error-soft: rgba(36,79,219,.09);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 34px 20px;
    overflow: hidden;
    color: var(--error-ink);
    background:
      linear-gradient(rgba(10,26,47,.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,26,47,.028) 1px, transparent 1px),
      radial-gradient(circle at 88% 8%, var(--error-soft), transparent 28rem),
      var(--error-paper);
    background-size: 64px 64px, 64px 64px, auto, auto;
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  .error-page[data-variant="warning"] {
    --error-accent: #d97706;
    --error-soft: rgba(217,119,6,.11);
  }

  .error-page[data-variant="danger"] {
    --error-accent: #cf3f46;
    --error-soft: rgba(207,63,70,.1);
  }

  body[data-bs-theme="dark"] .error-page {
    --error-ink: #f4f7fb;
    --error-muted: #a6b1c0;
    --error-paper: #09131f;
    --error-card: #101d2b;
    --error-line: rgba(255,255,255,.11);
  }

  .error-page *,
  .error-page *::before,
  .error-page *::after { box-sizing: border-box; }

  .error-card {
    position: relative;
    width: min(100%, 940px);
    min-height: 550px;
    display: grid;
    grid-template-columns: minmax(260px,.82fr) minmax(0,1.18fr);
    border: 1px solid var(--error-line);
    border-radius: 30px;
    background: var(--error-card);
    overflow: hidden;
    box-shadow: 0 28px 80px rgba(10,26,47,.13);
  }

  .error-visual {
    position: relative;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 34px;
    overflow: hidden;
    color: #fff;
    background: #0a1a2f;
  }

  .error-visual::before {
    content: "";
    position: absolute;
    width: 260px;
    height: 260px;
    right: -145px;
    top: -145px;
    border: 44px solid var(--error-accent);
    border-radius: 50%;
  }

  .error-visual::after {
    content: "";
    position: absolute;
    width: 190px;
    height: 190px;
    left: -120px;
    bottom: -120px;
    border: 32px solid rgba(255,255,255,.08);
    border-radius: 50%;
  }

  .error-brand {
    position: relative;
    z-index: 1;
    color: rgba(255,255,255,.68);
    font-size: .72rem;
    font-weight: 750;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .error-code-wrap {
    position: relative;
    z-index: 1;
  }

  .error-icon {
    width: 58px;
    height: 58px;
    display: grid;
    place-items: center;
    margin-bottom: 20px;
    border-radius: 17px;
    background: var(--error-accent);
    color: #fff;
  }

  .error-code {
    margin: 0;
    color: #fff;
    font-size: clamp(5.2rem, 11vw, 8.2rem);
    font-weight: 850;
    line-height: .78;
    letter-spacing: -.08em;
  }

  .error-visual-label {
    position: relative;
    z-index: 1;
    color: rgba(255,255,255,.42);
    font-size: .7rem;
    font-weight: 650;
    line-height: 1.6;
  }

  .error-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(36px, 7vw, 70px);
  }

  .error-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 18px;
    color: var(--error-accent);
    font-size: .7rem;
    font-weight: 750;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .error-eyebrow::before {
    content: "";
    width: 26px;
    height: 2px;
    border-radius: 99px;
    background: currentColor;
  }

  .error-title {
    max-width: 520px;
    margin: 0;
    color: var(--error-ink);
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: .98;
    letter-spacing: -.06em;
  }

  .error-message {
    max-width: 490px;
    margin: 20px 0 0;
    color: var(--error-muted);
    font-size: .94rem;
    line-height: 1.75;
  }

  .error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 32px;
  }

  .error-action {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 20px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: var(--error-accent);
    color: #fff;
    font-size: .8rem;
    font-weight: 750;
    text-decoration: none;
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .error-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px var(--error-soft);
  }

  .error-action.secondary {
    border-color: var(--error-line);
    background: transparent;
    color: var(--error-ink);
  }

  .error-action svg { width: 18px; height: 18px; }

  .error-action .animate-spin {
    animation: error-spin .8s linear infinite;
  }

  @keyframes error-spin {
    to { transform: rotate(360deg); }
  }

  .error-help {
    margin-top: 30px;
    padding-top: 22px;
    border-top: 1px solid var(--error-line);
    color: var(--error-muted);
    font-size: .72rem;
    line-height: 1.6;
  }

  .error-action:focus-visible {
    outline: 3px solid #bde632;
    outline-offset: 3px;
  }

  @media (max-width: 760px) {
    .error-page { padding: 16px 12px; }
    .error-card {
      grid-template-columns: 1fr;
      min-height: auto;
      border-radius: 23px;
    }
    .error-visual {
      min-height: 245px;
      padding: 26px;
    }
    .error-code-wrap {
      display: flex;
      align-items: end;
      gap: 18px;
    }
    .error-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 0;
    }
    .error-code { font-size: 5.6rem; }
    .error-visual-label { display: none; }
    .error-content { padding: 36px 25px 40px; }
  }

  @media (max-width: 460px) {
    .error-actions { flex-direction: column; }
    .error-action { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .error-action { transition: none; }
    .error-action .animate-spin { animation-duration: 1.8s; }
  }
`;

export default function ErrorScreen({
  code,
  title,
  message,
  eyebrow,
  variant = "primary",
  icon: Icon,
  secondaryHref,
  secondaryLabel,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const audio = new Audio("/click.mp3");
    audio.play().catch(() => {});
    setLoading(true);
  };

  return (
    <main className="error-page" data-variant={variant}>
      <style>{CSS}</style>

      <section className="error-card" aria-labelledby={`error-title-${code}`}>
        <div className="error-visual">
          <span className="error-brand">SportLike</span>
          <div className="error-code-wrap">
            <span className="error-icon" aria-hidden="true">
              <Icon size={29} strokeWidth={1.8} />
            </span>
            <p className="error-code">{code}</p>
          </div>
          <span className="error-visual-label">
            No te preocupes.<br />Te ayudamos a continuar.
          </span>
        </div>

        <div className="error-content">
          <span className="error-eyebrow">{eyebrow}</span>
          <h1 className="error-title" id={`error-title-${code}`}>{title}</h1>
          <p className="error-message">{message}</p>

          <div className="error-actions">
            <Link to="/" className="error-action" onClick={handleClick}>
              {loading ? <Loader2 className="animate-spin" /> : <Home />}
              Volver al inicio
            </Link>
            <Link to={secondaryHref} className="error-action secondary">
              {secondaryLabel} <ArrowRight />
            </Link>
          </div>

          <p className="error-help">
            Si el problema continúa, nuestro equipo de soporte puede ayudarte.
          </p>
        </div>
      </section>
    </main>
  );
}
