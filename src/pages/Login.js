import PAGE_CSS from "./Login.styles";
import { API_BASE_URL } from "../config/api";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const API_URL = API_BASE_URL;

  const validar = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()))
      e.correo = "Escribe un correo electrónico válido.";
    if (!password)
      e.password = "Escribe tu contraseña.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
    setErr('');

    if (!validar()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/login`, { correo: correo.trim().toLowerCase(), password }, { timeout: 15000 });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin && onLogin(res.data.user);

      // ✅ Si es admin va al panel, si no va al inicio
      if (res.data.user?.rol === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/');
      }

    } catch (error) {
      if (error.response?.data?.error) setErr(error.response.data.error);
      else if (error.request) setErr('No se pudo conectar con el servidor.');
      else setErr('Ocurrió un error inesperado.');
    } finally { setSubmitting(false); }
  }

  return (
    <main className="login-shell">
<style>{PAGE_CSS}</style>

      <section className="login-showcase">
        <Link className="login-brand" to="/">SPORT<span>LIKE</span></Link>
        <span className="login-kicker">
          <i className="bi bi-lightning-charge-fill" /> TIENDA DEPORTIVA EN LÍNEA
        </span>
        <h1>Impulsa tu <span>mejor versión.</span></h1>
        <p>
          Productos deportivos de alta calidad que combinan innovación,
          rendimiento y estilo para acompañarte en cada meta.
        </p>
        <div className="login-benefits">
          <span><i className="bi bi-shield-check" /> Compra segura</span>
          <span><i className="bi bi-credit-card" /> Pago protegido</span>
          <span><i className="bi bi-arrow-return-left" /> Cambios claros</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <span className="login-eyebrow">Bienvenido de nuevo</span>
          <h2 className="login-title">Iniciar sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta SportLike.</p>

          {err && <div className="alert alert-danger" role="alert">{err}</div>}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-correo">Correo electrónico</label>
              <input
                id="login-correo"
                name="correo"
                type="email"
                required
                maxLength={254}
                className="form-control login-input"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={Boolean(errors.correo)}
                aria-describedby={errors.correo ? "login-correo-error" : undefined}
              />
              {errors.correo && <div id="login-correo-error" className="error-text">{errors.correo}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <div className="password-container">
                <input
                  id="login-password"
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  className="form-control login-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <button className="login-btn" type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? "Entrando…" : "Entrar"}</button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div className="separator">o continúa con</div>

          <a className="btn btn-outline-dark google-btn" href={`${API_URL}/auth/google?return_to=${encodeURIComponent(window.location.origin)}`}>
            <i className="bi bi-google me-2"></i> Iniciar con Google
          </a>
        </div>
      </section>
    </main>
  );
}
