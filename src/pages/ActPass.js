import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ActPass() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const [step, setStep] = useState(token ? 2 : 1); // 1 = pedir correo, 2 = restablecer contraseña
  const [loading, setLoading] = useState(false);

  // Función para enviar correo de recuperación
  const enviarCorreo = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await axios.post('https://sl-back.vercel.app/api/forgot-password', { correo });
      setMsg('Se enviaron las instrucciones a tu correo.');
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error enviando correo');
    } finally {
      setLoading(false);
    }
  };

  // Función para restablecer contraseña usando token
  const restablecerPass = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await axios.post('https://sl-back.vercel.app/api/reset-password', { token, password: pass });
      setMsg('Contraseña restablecida correctamente. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error restableciendo contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <style>{`
        .card-pass {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 14px;
          padding: 35px 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .card-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0a1a2f;
          text-align: center;
        }
        .form-label {
          font-weight: 600;
          color: #0a1a2f;
        }
        .form-input {
          border-radius: 10px !important;
          padding: 10px 12px !important;
          border: 1px solid #d2d2d2;
          font-size: 1rem;
        }
        .btn-pass {
          background-color: #0a1a2f;
          color: white;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 10px;
          font-size: 1.1rem;
          margin-top: 10px;
        }
        .btn-pass:hover {
          background-color: #07121b;
        }
        .alert-msg {
          margin-top: 10px;
        }
      `}</style>

      <div className="card-pass">
        <h2 className="card-title mb-4">
          {step === 1 ? 'Recuperar contraseña' : 'Restablecer contraseña'}
        </h2>

        {msg && <div className="alert alert-info alert-msg">{msg}</div>}

        {step === 1 && (
          <form onSubmit={enviarCorreo}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control form-input"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@gmail.com"
                required
              />
            </div>
            <button className="btn-pass" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={restablecerPass}>
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
            <button className="btn-pass" disabled={loading}>
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
