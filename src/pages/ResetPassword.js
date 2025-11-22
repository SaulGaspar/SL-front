import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token'); // si viene del correo
  const from = params.get('from') || ''; // puede ser 'profile' o 'forgot'
  const navigate = useNavigate();

  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://sl-back.vercel.app';
  const tokenAuth = localStorage.getItem('token');

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');

    if (pass !== confirmPass) {
      setMsg('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      if (token) {
        // desde link de correo
        await axios.post(`${API_URL}/api/reset-password`, { token, password: pass });
      } else {
        // desde perfil logueado
        await axios.post(`${API_URL}/api/update-password`, { actual: '', nueva: pass }, {
          headers: { Authorization: 'Bearer ' + tokenAuth }
        });
      }

      setMsg('Contraseña actualizada correctamente...');
      setTimeout(() => {
        if (token) {
          navigate('/login'); // link desde correo → login
        } else {
          navigate('/profile'); // desde perfil → profile
        }
      }, 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error actualizando contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="card-pass" style={{ width: '100%', maxWidth: '480px', padding: '35px', borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', background: '#fff' }}>
        <h2 className="card-title mb-4">{token ? 'Restablecer contraseña' : 'Actualizar contraseña'}</h2>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control form-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control form-input"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn-pass" disabled={loading}>
            {loading ? 'Procesando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
