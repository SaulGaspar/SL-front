import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CSS = `
  .cp-page {
    --cp-ink: #0a1a2f;
    --cp-muted: #657286;
    --cp-paper: #f5f7f4;
    --cp-card: #ffffff;
    --cp-line: rgba(10, 26, 47, .11);
    --cp-blue: #244fdb;
    --cp-acid: #bde632;
    min-height: calc(100vh - 70px);
    display: grid;
    place-items: center;
    padding: 48px 20px;
    background:
      radial-gradient(circle at 12% 18%, rgba(189,230,50,.28), transparent 20rem),
      radial-gradient(circle at 88% 10%, rgba(36,79,219,.10), transparent 26rem),
      var(--cp-paper);
    color: var(--cp-ink);
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  body[data-bs-theme="dark"] .cp-page {
    --cp-ink: #f3f6fa;
    --cp-muted: #a6b1c0;
    --cp-paper: #09131f;
    --cp-card: #101d2b;
    --cp-line: rgba(255, 255, 255, .11);
    --cp-blue: #86a5ff;
  }

  .cp-page *,
  .cp-page *::before,
  .cp-page *::after { box-sizing: border-box; }

  .cp-shell {
    width: min(100%, 980px);
    display: grid;
    grid-template-columns: minmax(280px, .9fr) minmax(0, 1.1fr);
    border: 1px solid var(--cp-line);
    border-radius: 30px;
    background: var(--cp-card);
    overflow: hidden;
    box-shadow: 0 26px 70px rgba(10, 26, 47, .13);
  }

  .cp-aside {
    position: relative;
    min-height: 100%;
    padding: clamp(32px, 5vw, 56px);
    background:
      radial-gradient(circle at 0% 100%, rgba(189,230,50,.75), transparent 12rem),
      linear-gradient(145deg, #08182b, #102b4d);
    color: #fff;
    overflow: hidden;
  }

  .cp-aside::before {
    content: "";
    position: absolute;
    width: 230px;
    height: 230px;
    right: -130px;
    top: -130px;
    border: 34px solid rgba(189,230,50,.9);
    border-radius: 50%;
  }

  .cp-brand {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--cp-acid);
    font-size: .72rem;
    font-weight: 850;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .cp-brand-mark {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: rgba(255,255,255,.1);
    color: #fff;
    font-size: 1rem;
  }

  .cp-aside h1 {
    position: relative;
    max-width: 360px;
    margin: 48px 0 0;
    font-size: clamp(2.35rem, 5vw, 4rem);
    line-height: .95;
    font-weight: 900;
    letter-spacing: -.06em;
  }

  .cp-aside p {
    position: relative;
    max-width: 360px;
    margin: 22px 0 0;
    color: rgba(255,255,255,.68);
    line-height: 1.75;
    font-size: .96rem;
  }

  .cp-points {
    position: relative;
    display: grid;
    gap: 12px;
    margin-top: 38px;
  }

  .cp-point {
    display: grid;
    grid-template-columns: 34px 1fr;
    gap: 12px;
    align-items: center;
    color: rgba(255,255,255,.86);
    font-size: .88rem;
    font-weight: 650;
  }

  .cp-check {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: rgba(189,230,50,.14);
    color: var(--cp-acid);
  }

  .cp-panel {
    padding: clamp(30px, 5vw, 56px);
  }

  .cp-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
    color: var(--cp-ink);
    text-decoration: none;
    font-weight: 800;
    font-size: .86rem;
  }

  .cp-kicker {
    display: block;
    margin-bottom: 10px;
    color: var(--cp-blue);
    font-size: .7rem;
    font-weight: 850;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .cp-title {
    margin: 0;
    color: var(--cp-ink);
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1;
    font-weight: 900;
    letter-spacing: -.055em;
  }

  .cp-subtitle {
    max-width: 430px;
    margin: 14px 0 28px;
    color: var(--cp-muted);
    line-height: 1.65;
    font-size: .92rem;
  }

  .cp-alert {
    margin-bottom: 18px;
    padding: 13px 15px;
    border-radius: 15px;
    border: 1px solid var(--cp-line);
    font-size: .9rem;
    font-weight: 650;
  }

  .cp-alert.ok {
    background: #e9f8ef;
    color: #23864b;
    border-color: rgba(35,134,75,.18);
  }

  .cp-alert.err {
    background: #fff0f0;
    color: #c93636;
    border-color: rgba(201,54,54,.18);
  }

  body[data-bs-theme="dark"] .cp-alert.ok {
    background: rgba(35,134,75,.15);
    color: #7be09d;
  }

  body[data-bs-theme="dark"] .cp-alert.err {
    background: rgba(201,54,54,.15);
    color: #ff9a9a;
  }

  .cp-form {
    display: grid;
    gap: 18px;
  }

  .cp-field label {
    display: block;
    margin-bottom: 8px;
    color: var(--cp-ink);
    font-size: .86rem;
    font-weight: 800;
  }

  .cp-password {
    position: relative;
  }

  .cp-input {
    width: 100%;
    min-height: 54px;
    padding: 0 92px 0 16px;
    border: 1px solid var(--cp-line);
    border-radius: 15px;
    background: rgba(255,255,255,.72);
    color: var(--cp-ink);
    font: inherit;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  body[data-bs-theme="dark"] .cp-input {
    background: rgba(255,255,255,.05);
  }

  .cp-input:focus {
    border-color: rgba(36,79,219,.55);
    box-shadow: 0 0 0 4px rgba(36,79,219,.10);
    background: var(--cp-card);
  }

  .cp-input::placeholder {
    color: color-mix(in srgb, var(--cp-muted), transparent 10%);
  }

  .cp-toggle {
    position: absolute;
    right: 8px;
    top: 8px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--cp-line);
    border-radius: 11px;
    background: transparent;
    color: var(--cp-muted);
    font-size: .76rem;
    font-weight: 800;
    cursor: pointer;
  }

  .cp-hint,
  .cp-error {
    margin-top: 7px;
    font-size: .78rem;
    line-height: 1.45;
  }

  .cp-hint { color: var(--cp-muted); }
  .cp-error { color: #c93636; font-weight: 700; }

  body[data-bs-theme="dark"] .cp-error { color: #ff9a9a; }

  .cp-submit {
    min-height: 54px;
    margin-top: 6px;
    border: 0;
    border-radius: 15px;
    background: #244fdb;
    color: #fff;
    font-size: .92rem;
    font-weight: 850;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(36,79,219,.22);
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  }

  .cp-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(36,79,219,.28);
  }

  .cp-submit:disabled {
    opacity: .68;
    cursor: not-allowed;
    transform: none;
  }

  .cp-cancel {
    display: inline-flex;
    justify-content: center;
    margin-top: 18px;
    color: var(--cp-muted);
    text-decoration: none;
    font-size: .86rem;
    font-weight: 750;
  }

  .cp-back:focus-visible,
  .cp-toggle:focus-visible,
  .cp-submit:focus-visible,
  .cp-cancel:focus-visible {
    outline: 3px solid var(--cp-acid);
    outline-offset: 3px;
  }

  @media (max-width: 820px) {
    .cp-shell { grid-template-columns: 1fr; }
    .cp-aside { min-height: auto; }
    .cp-aside h1 { margin-top: 34px; }
    .cp-points { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .cp-point { grid-template-columns: 1fr; align-items: start; }
  }

  @media (max-width: 560px) {
    .cp-page { padding: 22px 12px; }
    .cp-shell { border-radius: 24px; }
    .cp-aside { padding: 30px 24px; }
    .cp-panel { padding: 30px 22px; }
    .cp-points { grid-template-columns: 1fr; }
    .cp-input { padding-right: 86px; }
    .cp-submit { width: 100%; }
  }
`;

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
  const API_URL = "https://sl-back.vercel.app";
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
