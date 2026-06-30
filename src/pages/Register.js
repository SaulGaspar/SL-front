import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    fechaNac: '',
    correo: '',
    telefono: '',
    usuario: '',
    password: '',
    password2: '',
    rol: 'cliente'
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acepta, setAcepta] = useState(false);

  const navigate = useNavigate();
  const API_URL = "https://sl-back.vercel.app";

  const validar = () => {
    let e = {};
    if (!form.nombre.trim() || form.nombre.length < 2) e.nombre = "El nombre debe contener al menos 2 letras.";
    if (!form.apellidoP.trim()) e.apellidoP = "El apellido paterno es obligatorio.";
    if (!form.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.correo = "El correo no es válido.";
    if (!/^\d{10}$/.test(form.telefono)) e.telefono = "El teléfono debe tener 10 dígitos.";
    if (!form.usuario || form.usuario.length < 4) e.usuario = "El usuario debe tener mínimo 4 caracteres.";

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(form.password)) e.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    if (form.password !== form.password2) e.password2 = "Las contraseñas no coinciden.";
    if (!acepta) e.acepta = "Debes aceptar los términos y condiciones.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (!validar()) return;

    try {
      await axios.post(`${API_URL}/api/register`, form);
      setMsg('Registrado correctamente. Revisa tu correo para verificar tu cuenta.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response) setMsg(error.response.data.error || 'Error en el servidor.');
      else if (error.request) setMsg('No se pudo conectar con el servidor.');
      else setMsg('Ocurrió un error inesperado.');
      console.error(error);
    }
  }

  return (
    <main className="register-shell">
      <style>{`
        .register-shell {
          min-height:calc(100vh - 112px); display:grid;
          grid-template-columns:minmax(350px,.82fr) minmax(620px,1.18fr);
          background:#f3f6fa;
        }
        .register-showcase {
          position:relative; isolation:isolate; overflow:hidden; color:white;
          display:flex; flex-direction:column; justify-content:center;
          padding:72px clamp(40px,6vw,96px);
          background:linear-gradient(145deg,#071a31 0%,#0b2d52 62%,#17456f 100%);
        }
        .register-showcase::before,.register-showcase::after {
          content:""; position:absolute; z-index:-1; border-radius:50%;
          border:1px solid rgba(198,246,45,.24);
        }
        .register-showcase::before {
          width:480px; height:480px; right:-220px; top:-130px;
          box-shadow:0 0 0 70px rgba(198,246,45,.035),0 0 0 145px rgba(198,246,45,.02);
        }
        .register-showcase::after {
          width:250px; height:250px; left:-100px; bottom:-100px;
          background:rgba(198,246,45,.06);
        }
        .register-brand { color:white; text-decoration:none; font-size:1.3rem; font-weight:900; letter-spacing:6px; margin-bottom:68px; }
        .register-brand span { color:#c6f62d; }
        .register-kicker { width:max-content; display:inline-flex; align-items:center; gap:8px; padding:7px 13px; border:1px solid rgba(198,246,45,.38); border-radius:999px; color:#c6f62d; font-size:.72rem; font-weight:800; letter-spacing:1.4px; }
        .register-showcase h1 { margin:21px 0 15px; max-width:540px; font-size:clamp(2.7rem,4.4vw,4.7rem); line-height:1; font-weight:900; letter-spacing:-2px; }
        .register-showcase h1 span { color:#c6f62d; }
        .register-showcase>p { max-width:520px; color:#c9d6e5; line-height:1.75; font-size:1.03rem; }
        .register-steps { display:grid; gap:15px; margin-top:30px; }
        .register-step { display:flex; align-items:center; gap:12px; color:#e8eff7; font-size:.9rem; font-weight:650; }
        .register-step i { width:34px; height:34px; display:grid; place-items:center; border-radius:50%; background:rgba(198,246,45,.12); color:#c6f62d; }
        .register-panel { padding:46px clamp(28px,5vw,78px); display:flex; align-items:center; justify-content:center; }
        .register-card { width:100%; max-width:760px; background:white; border:1px solid #e4eaf1; border-radius:20px; padding:38px 40px; box-shadow:0 22px 60px rgba(7,26,49,.1); }
        .register-eyebrow { color:#6b7d93; font-size:.76rem; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; }
        .register-title { margin:4px 0 5px; color:#071a31; font-size:2rem; font-weight:850; }
        .register-subtitle { color:#718096; margin:0 0 24px; font-size:.94rem; }
        .register-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px 18px; }
        .register-field { display:flex; flex-direction:column; gap:6px; }
        .register-field.full { grid-column:1/-1; }
        .register-card .form-label { margin:0; color:#132c4a; font-size:.84rem; font-weight:750; }
        .register-input { width:100%; height:46px; border:1px solid #cfd9e6!important; border-radius:10px!important; padding:10px 12px!important; font-size:.94rem; }
        .register-input:focus { border-color:#224b78!important; box-shadow:0 0 0 3px rgba(34,75,120,.12)!important; }
        .register-btn { width:100%; border:0; border-radius:10px; padding:13px; margin-top:20px; background:#071a31; color:white; font-weight:800; transition:transform .16s,background .16s; }
        .register-btn:hover { background:#12375f; transform:translateY(-1px); }
        .error-text { color:#c53030; font-size:.78rem; margin-top:1px; }
        .password-container { position:relative; display:flex; align-items:center; }
        .password-toggle { position:absolute; right:8px; width:34px; height:100%; display:grid; place-items:center; background:none; border:0; color:#48627f; cursor:pointer; font-size:1.1rem; }
        .register-terms { margin-top:19px; padding:13px 14px; border-radius:10px; background:#f7f9fc; border:1px solid #e2e8f0; color:#53657a; font-size:.84rem; }
        .register-terms a,.register-login a { color:#215b97; font-weight:700; }
        .register-login { text-align:center; margin-top:17px; color:#64748b; font-size:.88rem; }
        @media(max-width:1050px) {
          .register-shell { grid-template-columns:1fr; }
          .register-showcase { min-height:330px; padding:45px 34px; }
          .register-brand { margin-bottom:34px; }
          .register-steps { grid-template-columns:repeat(3,1fr); }
          .register-panel { padding:36px 20px 55px; }
        }
        @media(max-width:650px) {
          .register-showcase { min-height:285px; }
          .register-showcase h1 { font-size:2.65rem; }
          .register-steps { display:none; }
          .register-card { padding:28px 22px; }
          .register-grid { grid-template-columns:1fr; }
          .register-field.full { grid-column:auto; }
        }
      `}</style>

      <section className="register-showcase">
        <Link className="register-brand" to="/">SPORT<span>LIKE</span></Link>
        <span className="register-kicker">
          <i className="bi bi-lightning-charge-fill" /> TU EXPERIENCIA SPORTLIKE
        </span>
        <h1>Todo empieza con una <span>nueva meta.</span></h1>
        <p>
          Crea tu cuenta y encuentra productos deportivos preparados para
          acompañarte en cada entrenamiento y cada logro.
        </p>
        <div className="register-steps">
          <div className="register-step"><i className="bi bi-person-check" /> Perfil y compras en un solo lugar</div>
          <div className="register-step"><i className="bi bi-bell" /> Seguimiento de tus pedidos</div>
          <div className="register-step"><i className="bi bi-tags" /> Promociones exclusivas</div>
        </div>
      </section>

      <section className="register-panel">
        <div className="register-card">
          <span className="register-eyebrow">Únete a SportLike</span>
          <h2 className="register-title">Crear cuenta</h2>
          <p className="register-subtitle">Completa tus datos para comenzar.</p>

          {msg && <div className="alert alert-info">{msg}</div>}

          <form onSubmit={submit}>
            <div className="register-grid">
              <div className="register-field">
                <label className="form-label">Nombre</label>
                <input className="form-control register-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" autoComplete="given-name"/>
                {errors.nombre && <div className="error-text">{errors.nombre}</div>}
              </div>
              <div className="register-field">
                <label className="form-label">Apellido paterno</label>
                <input className="form-control register-input" value={form.apellidoP} onChange={e => setForm({ ...form, apellidoP: e.target.value })} placeholder="Apellido paterno" autoComplete="family-name"/>
                {errors.apellidoP && <div className="error-text">{errors.apellidoP}</div>}
              </div>
              <div className="register-field">
                <label className="form-label">Apellido materno</label>
                <input className="form-control register-input" value={form.apellidoM} onChange={e => setForm({ ...form, apellidoM: e.target.value })} placeholder="Apellido materno"/>
              </div>
              <div className="register-field">
                <label className="form-label">Fecha de nacimiento</label>
                <input type="date" className="form-control register-input" value={form.fechaNac} onChange={e => setForm({ ...form, fechaNac: e.target.value })}/>
              </div>
              <div className="register-field">
                <label className="form-label">Correo electrónico</label>
                <input type="email" className="form-control register-input" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="ejemplo@gmail.com" autoComplete="email"/>
                {errors.correo && <div className="error-text">{errors.correo}</div>}
              </div>
              <div className="register-field">
                <label className="form-label">Teléfono</label>
                <input className="form-control register-input" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10 dígitos" inputMode="numeric" autoComplete="tel"/>
                {errors.telefono && <div className="error-text">{errors.telefono}</div>}
              </div>
              <div className="register-field full">
                <label className="form-label">Usuario</label>
                <input className="form-control register-input" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} placeholder="Elige un nombre de usuario" autoComplete="username"/>
                {errors.usuario && <div className="error-text">{errors.usuario}</div>}
              </div>
              <div className="register-field">
                <label className="form-label">Contraseña</label>
                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} className="form-control register-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" autoComplete="new-password"/>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </button>
                </div>
                {errors.password && <div className="error-text">{errors.password}</div>}
              </div>
              <div className="register-field">
                <label className="form-label">Confirmar contraseña</label>
                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} className="form-control register-input" value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} placeholder="Repite tu contraseña" autoComplete="new-password"/>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </button>
                </div>
                {errors.password2 && <div className="error-text">{errors.password2}</div>}
              </div>
            </div>

            <div className="form-check register-terms">
              <input className="form-check-input" type="checkbox" checked={acepta} onChange={() => setAcepta(!acepta)} id="aceptaTC"/>
              <label className="form-check-label" htmlFor="aceptaTC">
                Acepto los <Link to="/terminos">Términos y Condiciones</Link> y el <Link to="/aviso-privacidad">Aviso de Privacidad</Link>.
              </label>
              {errors.acepta && <div className="error-text">{errors.acepta}</div>}
            </div>

            <button className="register-btn">Crear mi cuenta</button>
          </form>

          <div className="register-login">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
