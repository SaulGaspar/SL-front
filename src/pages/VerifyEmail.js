import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

import CSS from "./VerifyEmail.styles";

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
      .get(`${API_BASE_URL}/api/verify-email?token=${encodeURIComponent(token)}`)
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
