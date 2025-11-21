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
      await axios.post(
        (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/forgot-password',
        { correo }
      );

      setMsg('Si el correo existe, te enviamos un enlace para recuperar tu contraseña.');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error al procesar la solicitud.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>

      <style>{`
        .recover-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 14px;
          padding: 35px 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .recover-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0a1a2f;
          text-align: center;
        }
        .form-label {
          font-weight: 600;
          color: #0a1a2f;
        }
        .recover-input {
          border-radius: 10px !important;
          padding: 10px 12px !important;
          border: 1px solid #d2d2d2;
          font-size: 1rem;
        }
        .recover-btn {
          background-color: #0a1a2f;
          color: white;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 10px;
          font-size: 1.05rem;
          margin-top: 10px;
        }
        .recover-btn:hover {
          background-color: #07121b;
        }
        .error-text {
          color: #cc0000;
          font-size: 0.9rem;
          margin-top: 3px;
        }
      `}</style>

      <div className="recover-card">

        <h2 className="recover-title mb-4">Recuperar contraseña</h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={submit}>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-control recover-input"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
            />
            {errors.correo && <div className="error-text">{errors.correo}</div>}
          </div>

          <button className="recover-btn">Enviar instrucciones</button>
        </form>

      </div>
    </div>
  );
}
