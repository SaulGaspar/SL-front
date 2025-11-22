import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const restablecerPass = async (e) => {
    e.preventDefault();
    setMsg('');
    if (pass !== confirmPass) {
      setMsg('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://sl-back.vercel.app/api/reset-password', { token, password: pass });
      setMsg('Contraseña restablecida correctamente. Redirigiendo...');
      setTimeout(() => navigate(token ? '/login' : '/profile'), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error restableciendo contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', background: '#f5f7fa' }}>
      <style>{`
        .card-pass {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 14px;
          padding: 40px 35px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
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
          background-color: #1e90ff;
          color: white;
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 10px;
          font-size: 1.1rem;
          margin-top: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-pass:hover {
          background-color: #0c75d6;
        }
        .breadcrumb {
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .breadcrumb a {
          color: #1e90ff;
          text-decoration: none;
        }
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        .alert-msg {
          margin-top: 10px;
        }
      `}</style>

      <div className="card-pass">
        <nav className="breadcrumb">
          <a href="/">Inicio</a> &gt; <a href="/profile">Perfil</a> &gt; Restablecer contraseña
        </nav>

        <h2 className="card-title mb-4">Restablecer contraseña</h2>

        {msg && <div className="alert alert-info alert-msg">{msg}</div>}

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
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
