import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (pass.length < 6) {
      setMsg('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await axios.post('https://sl-back.vercel.app/api/reset-password', {
        token: params.get('token'),
        password: pass
      });
      setMsg('Contraseña restablecida correctamente');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error al restablecer contraseña');
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Restablecer contraseña</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100">Restablecer</button>
      </form>
    </div>
  );
}
