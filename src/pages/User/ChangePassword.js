import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ChangePassword() {
  const [form, setForm]               = useState({ actual: '', nueva: '', confirmar: '' });
  const [errors, setErrors]           = useState({});
  const [msg, setMsg]                 = useState('');
  const [msgType, setMsgType]         = useState('');
  const [showActual, setShowActual]   = useState(false);
  const [showNueva, setShowNueva]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);

  const navigate = useNavigate();
  const API_URL  = "https://sl-back.vercel.app";
  const token    = localStorage.getItem('token');

  const validar = () => {
    const e = {};
    if (!form.actual) e.actual = "Ingresa tu contraseña actual.";
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(form.nueva))
      e.nueva = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    if (form.nueva !== form.confirmar)
      e.confirmar = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (!validar()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/update-password`,
        { actual: form.actual, nueva: form.nueva },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setMsgType('ok');
      setMsg('Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setMsgType('err');
      setMsg(error.response?.data?.error || 'Error actualizando contraseña.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <style>{`
        .cp-card { width: 100%; max-width: 420px; background: #ffffff; border-radius: 14px; padding: 35px 30px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .cp-title { font-size: 1.9rem; font-weight: 700; color: #0a1a2f; text-align: center; }
        .form-label { font-weight: 600; color: #0a1a2f; }
        .cp-input { border-radius: 10px !important; padding: 10px 12px !important; border: 1px solid #d2d2d2; font-size: 1rem; height: 45px; }
        .cp-btn { background-color: #0a1a2f; color: white; border: none; padding: 12px; width: 100%; border-radius: 10px; font-size: 1.1rem; margin-top: 10px; transition: background .2s; cursor: pointer; }
        .cp-btn:hover { background-color: #07121b; }
        .cp-btn:disabled { opacity: .6; cursor: not-allowed; }
        .error-text { color: #cc0000; font-size: 0.9rem; margin-top: 3px; }
        .password-container { position: relative; display: flex; align-items: center; }
        .password-toggle { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #555; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; height: 100%; }
        .cp-hint { font-size: .78rem; color: #888; margin-top: 4px; }
      `}</style>

      <div className="cp-card">
        <div style={{ fontSize: '.9rem', marginBottom: 16 }}>
          <Link to="/profile" style={{ color: '#0a1a2f', fontWeight: 600, textDecoration: 'none' }}>
            ← Volver al perfil
          </Link>
        </div>

        <h2 className="cp-title mb-4">Cambiar contraseña</h2>

        {msg && (
          <div className={`alert ${msgType === 'ok' ? 'alert-success' : 'alert-danger'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={submit}>

          <div className="mb-3">
            <label className="form-label">Contraseña actual</label>
            <div className="password-container">
              <input
                type={showActual ? "text" : "password"}
                className="form-control cp-input"
                value={form.actual}
                onChange={e => setForm({ ...form, actual: e.target.value })}
                placeholder="Tu contraseña actual"
              />
              <button type="button" className="password-toggle" onClick={() => setShowActual(!showActual)} tabIndex={-1}>
                {showActual ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
              </button>
            </div>
            {errors.actual && <div className="error-text">{errors.actual}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <div className="password-container">
              <input
                type={showNueva ? "text" : "password"}
                className="form-control cp-input"
                value={form.nueva}
                onChange={e => setForm({ ...form, nueva: e.target.value })}
                placeholder="••••••••"
              />
              <button type="button" className="password-toggle" onClick={() => setShowNueva(!showNueva)} tabIndex={-1}>
                {showNueva ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
              </button>
            </div>
            <div className="cp-hint">Mayúscula, minúscula, número y carácter especial (@$!%*?&)</div>
            {errors.nueva && <div className="error-text">{errors.nueva}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar nueva contraseña</label>
            <div className="password-container">
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control cp-input"
                value={form.confirmar}
                onChange={e => setForm({ ...form, confirmar: e.target.value })}
                placeholder="Repite la nueva contraseña"
              />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
              </button>
            </div>
            {errors.confirmar && <div className="error-text">{errors.confirmar}</div>}
          </div>

          <button className="cp-btn" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar contraseña'}
          </button>

        </form>

        <div className="text-center mt-3">
          <Link to="/profile">Cancelar</Link>
        </div>
      </div>
    </div>
  );
}