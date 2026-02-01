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
      style={{ minHeight: '90vh', background: 'var(--bg-main)' }}
    >
      <style>{`
        .pass-card {
          width: 100%;
          max-width: 500px;
          background: var(--bg-card);
          border-radius: 16px;
          padding: 40px 35px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.25);
          color: var(--text-main);
        }

        .pass-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--text-main);
          text-align: center;
        }

        .breadcrumb-custom {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 25px;
          color: var(--text-muted);
        }

        .breadcrumb-custom a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }

        .breadcrumb-custom a:hover {
          text-decoration: underline;
        }

        .form-label {
          font-weight: 600;
          color: var(--text-main);
        }

        .form-input {
          border-radius: 12px !important;
          padding: 11px 14px !important;
          border: 1px solid var(--border-light);
          font-size: 1rem;
          background: var(--bg-input);
          color: var(--text-main);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .btn-reset {
          background: var(--btn-main-bg);
          color: var(--btn-main-text);
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
          background: var(--btn-secondary-bg);
          color: var(--btn-secondary-text);
          border: none;
          padding: 13px;
          width: 100%;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all .2s ease;
        }

        .btn-secondary:hover {
          background: var(--btn-secondary-hover);
        }

        .alert-msg {
          margin-top: 12px;
          background: var(--alert-bg);
          color: var(--alert-text);
          border: 1px solid var(--border-light);
        }
      `}</style>

      <div className="pass-card">

        <div className="breadcrumb-custom">
          <Link to="/">Inicio</Link> &nbsp;/&nbsp;
          {!token && <><Link to="/profile">Perfil</Link> &nbsp;/&nbsp;</>}
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
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
