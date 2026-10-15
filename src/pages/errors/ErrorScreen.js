import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Loader2 } from "lucide-react";

import CSS from "./ErrorScreen.styles";

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
