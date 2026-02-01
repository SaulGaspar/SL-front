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
      <style>{`
        .recover-card {
          background: var(--bg-card);
          border-radius: 14px;
          padding: 35px 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          color: var(--text-main);
        }

        .recover-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          text-align: center;
        }

        .recover-input {
          border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          background: var(--bg-input);
          color: var(--text-main);
          font-size: 1rem;
        }

        .recover-input::placeholder {
          color: var(--text-muted);
        }

        .alert-info {
          background-color: var(--bg-accent);
          color: var(--text-main);
          border: none;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        button {
          background-color: var(--btn-primary);
          color: var(--btn-text);
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 10px;
          font-size: 1.05rem;
          margin-top: 10px;
          cursor: pointer;
        }

        button:hover {
          opacity: 0.9;
        }

        .error-msg {
          color: var(--accent-danger);
          font-size: 0.9rem;
          margin-top: 3px;
        }
      `}</style>

      <div className="recover-card">
        <h2 className="recover-title mb-4">
          Recuperar contraseña
        </h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label style={{ fontWeight: 600, color: 'var(--text-main)' }}>Correo electrónico</label>
            <input
              className="form-control recover-input"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
            />
            {errors.correo && <div className="error-msg">{errors.correo}</div>}
          </div>

          <button>
            Enviar instrucciones
          </button>
        </form>
      </div>
    </div>
  );
}
