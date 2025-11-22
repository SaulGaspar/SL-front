import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; // <-- solo la variable de entorno

  const validar = () => {
    const e = {};
    if (!usuario.trim() || usuario.length < 4)
      e.usuario = "El usuario debe tener al menos 4 caracteres.";
    if (password.length < 8)
      e.password = "La contraseña debe tener mínimo 8 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    if (!validar()) return;

    try {
      const res = await axios.post(`${API_URL}/api/login`, { usuario, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin && onLogin(res.data.user);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.error || 'Error de conexión con el servidor.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <style>{`
        .login-card { width: 100%; max-width: 420px; background: #ffffff; border-radius: 14px; padding: 35px 30px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .login-title { font-size: 1.9rem; font-weight: 700; color: #0a1a2f; text-align: center; }
        .form-label { font-weight: 600; color: #0a1a2f; }
        .login-input { border-radius: 10px !important; padding: 10px 12px !important; border: 1px solid #d2d2d2; font-size: 1rem; }
        .login-btn { background-color: #0a1a2f; color: white; border: none; padding: 12px; width: 100%; border-radius: 10px; font-size: 1.1rem; margin-top: 10px; }
        .login-btn:hover { background-color: #07121b; }
        .error-text { color: #cc0000; font-size: 0.9rem; margin-top: 3px; }
        .google-btn { border-radius: 10px; width: 100%; padding: 10px; font-size: 1rem; }
        .separator { text-align: center; margin: 20px 0; color: #777; }
        .separator::before, .separator::after { content: ""; display: inline-block; width: 30%; height: 1px; background: #ccc; margin: 0 10px; }
      `}</style>

      <div className="login-card">
        <h2 className="login-title mb-4">Iniciar sesión</h2>
        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input 
              className="form-control login-input"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Tu usuario"
            />
            {errors.usuario && <div className="error-text">{errors.usuario}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type={showPassword ? "text" : "password"}
              className="form-control login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              id="verContra"
            />
            <label className="form-check-label" htmlFor="verContra">
              Mostrar contraseña
            </label>
          </div>

          <button className="login-btn">Entrar</button>
        </form>

        <div className="mt-3 d-flex justify-content-between">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>

        <div className="separator">o continúa con</div>

        <a
          className="btn btn-outline-dark google-btn"
          href={`${API_URL}/auth/google`}
        >
          <i className="bi bi-google me-2"></i> Iniciar con Google
        </a>
      </div>
    </div>
  );
}
