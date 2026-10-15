import { API_BASE_URL } from "../config/api";
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import CSS from "./ResetPassword.styles";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const destino = token ? "/login" : "/profile";

  const restablecerPass = async (e) => {
    e.preventDefault();
    setMsg("");

    if (pass !== confirmPass) {
      setMsgType("err");
      setMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/reset-password`, {
        token,
        password: pass,
      });

      setMsgType("ok");
      setMsg("Contraseña restablecida correctamente. Redirigiendo...");
      setTimeout(() => navigate(destino), 1500);
    } catch (error) {
      setMsgType("err");
      setMsg(error.response?.data?.error || "Error restableciendo contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rp-page">
      <style>{CSS}</style>

      <section className="rp-card">
        <div className="rp-top">
          <div className="rp-brand">
            <span className="rp-brand-mark">SL</span>
            SportLike
          </div>

          <Link to="/" className="rp-back">Ir al inicio</Link>
        </div>

        <span className="rp-kicker">Cuenta SportLike</span>
        <h1 className="rp-title">Crea una nueva contraseña</h1>
        <p className="rp-copy">
          Elige una contraseña segura para recuperar el acceso a tu cuenta y
          seguir comprando con tranquilidad.
        </p>

        {msg && <div className={`rp-message ${msgType}`}>{msg}</div>}

        <form className="rp-form" onSubmit={restablecerPass}>
          <div className="rp-field">
            <label htmlFor="pass">Nueva contraseña</label>
            <div className="rp-password">
              <input
                id="pass"
                type={showPass ? "text" : "password"}
                className="rp-input"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="rp-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className="rp-hint">Procura que sea distinta a tus contraseñas anteriores.</div>
          </div>

          <div className="rp-field">
            <label htmlFor="confirmPass">Confirmar contraseña</label>
            <div className="rp-password">
              <input
                id="confirmPass"
                type={showConfirm ? "text" : "password"}
                className="rp-input"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repite la nueva contraseña"
                required
              />
              <button type="button" className="rp-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="rp-actions">
            <button className="rp-submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar contraseña"}
            </button>

            <button type="button" className="rp-secondary" onClick={() => navigate(destino)}>
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
