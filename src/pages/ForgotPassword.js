import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {

  const [correo, setCorreo] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState({});

  const validar = () => {
    let e = {};
    if (!correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.correo = "Ingresa un correo válido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    if (!validar()) return;

    try {
      await axios.post('https://sl-back.vercel.app/api/forgot-password', { correo });
      setMsg('Si el correo existe, te enviamos un enlace para recuperar tu contraseña.');
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error al procesar la solicitud.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="recover-card" style={{
        width: '100%', maxWidth: '420px', background: '#fff',
        borderRadius: '14px', padding: '35px 30px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }}>
        <h2 className="recover-title mb-4" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0a1a2f', textAlign: 'center' }}>
          Recuperar contraseña
        </h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label style={{ fontWeight: 600, color: '#0a1a2f' }}>Correo electrónico</label>
            <input
              className="form-control recover-input"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
              style={{ borderRadius: '10px', padding: '10px 12px', border: '1px solid #d2d2d2', fontSize: '1rem' }}
            />
            {errors.correo && <div style={{ color: '#cc0000', fontSize: '0.9rem', marginTop: '3px' }}>{errors.correo}</div>}
          </div>

          <button style={{
            backgroundColor: '#0a1a2f', color: '#fff', border: 'none', padding: '12px',
            width: '100%', borderRadius: '10px', fontSize: '1.05rem', marginTop: '10px'
          }}>
            Enviar instrucciones
          </button>
        </form>
      </div>
    </div>
  );
}
