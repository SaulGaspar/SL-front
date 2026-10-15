import PAGE_CSS from "./Register.styles";
import { API_BASE_URL } from "../config/api";
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
  const API_URL = API_BASE_URL;

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
<style>{PAGE_CSS}</style>

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
          <div className="register-step"><i className="bi bi-bag-check" /> Consulta tus pedidos</div>
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
