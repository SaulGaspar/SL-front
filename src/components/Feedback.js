import React from "react";
import "../styles/feedback.css";

export default function Feedback({kind="empty", title, children, onRetry}) {
  return <div className={`sl-feedback sl-feedback-${kind}`} role={kind === "error" ? "alert" : "status"} aria-live="polite">
    {kind === "loading" && <span className="sl-feedback-spinner" aria-hidden="true" />}
    {title && <p className="sl-feedback-title">{title}</p>}
    {children && <div>{children}</div>}
    {onRetry && <button type="button" onClick={onRetry}>Volver a intentar</button>}
  </div>;
}
