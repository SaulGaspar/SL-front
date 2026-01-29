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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <style>{`
        .register-card { width: 100%; max-width: 540px; background: #ffffff; border-radius: 14px; padding: 35px 30px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .register-title { font-size: 1.9rem; font-weight: 700; color: #0a1a2f; text-align: center; }
        .form-label { font-weight: 600; color: #0a1a2f; }
        .register-input { border-radius: 10px !important; padding: 10px 12px !important; border: 1px solid #d2d2d2; font-size: 1rem; height: 45px; }
        .register-btn { background-color: #0a1a2f; color: white; border: none; padding: 12px; width: 100%; border-radius: 10px; font-size: 1.1rem; margin-top: 10px; }
        .register-btn:hover { background-color: #07121b; }
        .error-text { color: #cc0000; font-size: 0.9rem; margin-top: 3px; }

        .password-container { position: relative; display: flex; align-items: center; }
        .password-toggle { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #555; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; height: 100%; }
      `}</style>

      <div className="register-card">
        <h2 className="register-title mb-4">Crear cuenta</h2>
        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={submit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Nombre</label>
              <input className="form-control register-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre"/>
              {errors.nombre && <div className="error-text">{errors.nombre}</div>}
            </div>
            <div className="col">
              <label className="form-label">Apellido paterno</label>
              <input className="form-control register-input" value={form.apellidoP} onChange={e => setForm({ ...form, apellidoP: e.target.value })} placeholder="Apellido paterno"/>
              {errors.apellidoP && <div className="error-text">{errors.apellidoP}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido materno</label>
            <input className="form-control register-input" value={form.apellidoM} onChange={e => setForm({ ...form, apellidoM: e.target.value })} placeholder="Apellido materno"/>
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input type="date" className="form-control register-input" value={form.fechaNac} onChange={e => setForm({ ...form, fechaNac: e.target.value })}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control register-input" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="ejemplo@gmail.com"/>
            {errors.correo && <div className="error-text">{errors.correo}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input className="form-control register-input" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="10 dígitos"/>
            {errors.telefono && <div className="error-text">{errors.telefono}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input className="form-control register-input" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} placeholder="Nombre de usuario"/>
            {errors.usuario && <div className="error-text">{errors.usuario}</div>}
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} className="form-control register-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"/>
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} className="form-control register-input" value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} placeholder="Repite tu contraseña"/>
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>
            {errors.password2 && <div className="error-text">{errors.password2}</div>}
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" checked={acepta} onChange={() => setAcepta(!acepta)} id="aceptaTC"/>
            <label className="form-check-label" htmlFor="aceptaTC">
              Acepto los <Link to="/terminos">Términos y Condiciones</Link> y el <Link to="/aviso-privacidad">Aviso de Privacidad</Link>.
            </label>
            {errors.acepta && <div className="error-text">{errors.acepta}</div>}
          </div>

          <button className="register-btn">Registrarme</button>
        </form>

        <div className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
