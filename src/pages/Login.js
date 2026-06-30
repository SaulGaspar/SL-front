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
  const API_URL = "https://sl-back.vercel.app";

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
    setErr('');

    if (!validar()) return;

    try {
      const res = await axios.post(`${API_URL}/api/login`, { usuario, password });

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
      console.error("Login error:", error.response?.data?.error || error.message);
    }
  }

  return (
    <main className="login-shell">
      <style>{`
        .login-shell {
          min-height:calc(100vh - 112px); display:grid; grid-template-columns:minmax(0,1.15fr) minmax(430px,.85fr);
          background:#f3f6fa; overflow:hidden;
        }
        .login-showcase {
          position:relative; isolation:isolate; display:flex; flex-direction:column; justify-content:center;
          padding:72px clamp(42px,7vw,118px); color:white; overflow:hidden;
          background:linear-gradient(135deg,#071a31 0%,#0b2d52 58%,#173f68 100%);
        }
        .login-showcase::before,.login-showcase::after {
          content:""; position:absolute; z-index:-1; border-radius:50%; border:1px solid rgba(198,246,45,.25);
        }
        .login-showcase::before { width:520px; height:520px; right:-120px; top:-180px; box-shadow:0 0 0 70px rgba(198,246,45,.03),0 0 0 145px rgba(198,246,45,.025); }
        .login-showcase::after { width:290px; height:290px; left:-100px; bottom:-130px; background:rgba(198,246,45,.06); }
        .login-brand { color:white; text-decoration:none; font-size:1.35rem; font-weight:900; letter-spacing:6px; margin-bottom:72px; }
        .login-brand span { color:#c6f62d; }
        .login-kicker { display:inline-flex; align-items:center; gap:8px; width:max-content; border:1px solid rgba(198,246,45,.38); border-radius:999px; padding:7px 13px; color:#c6f62d; font-size:.74rem; font-weight:800; letter-spacing:1.5px; }
        .login-showcase h1 { max-width:660px; margin:22px 0 15px; font-size:clamp(2.7rem,5vw,5.25rem); line-height:.98; font-weight:900; letter-spacing:-2px; }
        .login-showcase h1 span { color:#c6f62d; }
        .login-showcase>p { max-width:610px; color:#c9d6e5; font-size:1.08rem; line-height:1.75; margin:0; }
        .login-benefits { display:flex; flex-wrap:wrap; gap:22px; margin-top:34px; color:#e7eef7; font-size:.86rem; font-weight:700; }
        .login-benefits span { display:flex; align-items:center; gap:8px; }
        .login-benefits i { color:#c6f62d; }
        .login-panel { display:flex; align-items:center; justify-content:center; padding:42px clamp(28px,5vw,78px); background:#f3f6fa; }
        .login-card { width:100%; max-width:470px; background:#fff; border:1px solid #e5ebf2; border-radius:20px; padding:40px; box-shadow:0 22px 60px rgba(7,26,49,.12); }
        .login-eyebrow { color:#6b7d93; font-size:.77rem; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; }
        .login-title { font-size:2rem; font-weight:800; color:#071a31; margin:5px 0 6px; }
        .login-subtitle { color:#718096; margin:0 0 26px; font-size:.94rem; }
        .login-card .form-label { font-weight:700; color:#132c4a; font-size:.88rem; }
        .login-input { border-radius:10px!important; padding:11px 13px!important; border:1px solid #cfd9e6!important; font-size:1rem; height:48px; }
        .login-input:focus { border-color:#224b78!important; box-shadow:0 0 0 3px rgba(34,75,120,.12)!important; }
        .login-btn { background:#071a31; color:white; border:0; padding:13px; width:100%; border-radius:10px; font-size:1rem; font-weight:800; margin-top:8px; transition:transform .16s,background .16s; }
        .login-btn:hover { background:#12375f; transform:translateY(-1px); }
        .error-text { color:#c53030; font-size:.82rem; margin-top:4px; }
        .login-links { display:flex; justify-content:space-between; gap:16px; margin-top:17px; font-size:.88rem; }
        .login-links a { color:#215b97; font-weight:650; }
        .google-btn { border-radius:10px; width:100%; padding:11px; font-size:.94rem; font-weight:650; }
        .separator { display:flex; align-items:center; gap:12px; margin:22px 0; color:#8a98aa; font-size:.82rem; }
        .separator::before,.separator::after { content:""; height:1px; background:#dce3eb; flex:1; }
        .password-container { position:relative; display:flex; align-items:center; }
        .password-toggle { position:absolute; right:9px; background:none; border:0; cursor:pointer; color:#48627f; font-size:1.15rem; display:grid; place-items:center; width:34px; height:100%; }
        @media(max-width:920px) {
          .login-shell { grid-template-columns:1fr; }
          .login-showcase { min-height:330px; padding:44px 30px; }
          .login-brand { margin-bottom:36px; }
          .login-showcase h1 { font-size:2.7rem; }
          .login-panel { padding:34px 20px 55px; }
        }
        @media(max-width:520px) {
          .login-showcase { min-height:280px; }
          .login-benefits { display:none; }
          .login-card { padding:28px 22px; }
          .login-links { flex-direction:column; gap:8px; }
        }
      `}</style>

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
          <span><i className="bi bi-truck" /> Entrega confiable</span>
          <span><i className="bi bi-arrow-return-left" /> Devoluciones claras</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <span className="login-eyebrow">Bienvenido de nuevo</span>
          <h2 className="login-title">Iniciar sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta SportLike.</p>

          {err && <div className="alert alert-danger">{err}</div>}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                className="form-control login-input"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Tu usuario"
                autoComplete="username"
              />
              {errors.usuario && <div className="error-text">{errors.usuario}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="password-container">
                <input
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

            <button className="login-btn">Entrar</button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div className="separator">o continúa con</div>

          <a className="btn btn-outline-dark google-btn" href={`${API_URL}/auth/google`}>
            <i className="bi bi-google me-2"></i> Iniciar con Google
          </a>
        </div>
      </section>
    </main>
  );
}
