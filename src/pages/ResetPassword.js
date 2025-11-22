import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

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
      await axios.post('https://sl-back.vercel.app/api/reset-password', {
        token,
        password: pass
      });

      setMsg('Contraseña restablecida correctamente. Redirigiendo...');

      // Si viene del correo => login
      // Si viene del perfil => perfil
      setTimeout(() => navigate(token ? '/login' : '/profile'), 1500);

    } catch (error) {
      setMsg(error.response?.data?.error || 'Error restableciendo contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #eef3ff, #ffffff)'
      }}
    >
      <style>{`
        .pass-card {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 16px;
          padding: 40px 35px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }

        .pass-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0a2540;
          text-align: center;
        }

        .breadcrumb-custom {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 25px;
          color: #506580;
        }

        .breadcrumb-custom a {
          color: #1a73e8;
          text-decoration: none;
          font-weight: 600;
        }

        .form-label {
          font-weight: 600;
          color: #0a2540;
        }

        .form-input {
          border-radius: 12px !important;
          padding: 11px 14px !important;
          border: 1px solid #cfd8e3;
          font-size: 1rem;
        }

        .btn-reset {
          background: linear-gradient(135deg, #1e90ff, #0c75d6);
          color: #ffffff;
          border: none;
          padding: 13px;
          width: 100%;
          border-radius: 12px;
          font-size: 1.15rem;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .btn-reset:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 144, 255, 0.35);
        }

        .btn-secondary {
          background: #0a2540;
          color: white;
          border: none;
          padding: 13px;
          width: 100%;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all .2s ease;
        }

        .btn-secondary:hover {
          background: #06182a;
        }

        .alert-msg {
          margin-top: 12px;
        }
      `}</style>

      <div className="pass-card">

        {/* MIGAS DE PAN */}
        <div className="breadcrumb-custom">
          <Link to="/">Inicio</Link> &nbsp;/&nbsp;
          {!token && <><Link to="/profile">Perfil</Link> &nbsp;/&nbsp;</>}
          <span style={{ fontWeight: 700, color: "#000" }}>
            Restablecer contraseña
          </span>
        </div>

        <h2 className="pass-title mb-4">Restablecer contraseña</h2>

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

          <div className="d-flex gap-2 mt-4">
            <button className="btn-reset" disabled={loading}>
              {loading ? 'Restableciendo...' : 'Guardar contraseña'}
            </button>

            {/* Botón cancelar */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/profile')}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
