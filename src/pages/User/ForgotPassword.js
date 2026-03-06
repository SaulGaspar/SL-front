import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('ok');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
    setLoading(true);
    try {
      await axios.post('https://sl-back.vercel.app/api/forgot-password', { correo });
      setSent(true);
    } catch (error) {
      setMsgType('err');
      setMsg(error.response?.data?.error || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '85vh', background: '#f4f6f9' }}>
      <style>{`
        .fp-card { width: 100%; max-width: 420px; background: white; border-radius: 14px; padding: 36px 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.09); }
        .fp-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: #e8f0fe; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .fp-title { font-size: 1.5rem; font-weight: 700; color: #0a1a2f; text-align: center; margin: 0 0 6px; }
        .fp-sub { font-size: .88rem; color: #718096; text-align: center; margin: 0 0 28px; line-height: 1.5; }
        .fp-label { display: block; font-size: .75rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
        .fp-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: .95rem; background: #f8fafc; font-family: inherit; transition: border-color .2s, background .2s; box-sizing: border-box; }
        .fp-input:focus { outline: none; border-color: #0a1a2f; background: white; }
        .fp-btn { width: 100%; padding: 12px; background: #0a1a2f; color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 18px; transition: background .2s; }
        .fp-btn:hover { background: #1e3a5f; }
        .fp-btn:disabled { opacity: .6; cursor: not-allowed; }
        .fp-err { background: #fff5f5; border: 1px solid #feb2b2; color: #9b2c2c; padding: 10px 14px; border-radius: 9px; font-size: .88rem; font-weight: 600; margin-bottom: 16px; }
        .error-text { color: #cc0000; font-size: .85rem; margin-top: 4px; }
        .fp-back { display: block; text-align: center; margin-top: 20px; font-size: .88rem; color: #718096; text-decoration: none; font-weight: 500; }
        .fp-back:hover { color: #0a1a2f; }

        /* Success state */
        .fp-success { text-align: center; }
        .fp-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #f0fff4; border: 2px solid #9ae6b4; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .fp-success-title { font-size: 1.3rem; font-weight: 700; color: #0a1a2f; margin: 0 0 10px; }
        .fp-success-msg { font-size: .9rem; color: #718096; line-height: 1.6; margin: 0 0 24px; }
      `}</style>

      <div className="fp-card">
        {!sent ? (
          <>
            <div className="fp-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 20 20" fill="#1e3a5f">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>

            <h2 className="fp-title">Recuperar contraseña</h2>
            <p className="fp-sub">Escribe tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>

            {msg && <div className="fp-err">{msg}</div>}

            <form onSubmit={submit}>
              <div>
                <label className="fp-label">Correo electrónico</label>
                <input
                  className="fp-input"
                  type="email"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
                {errors.correo && <div className="error-text">{errors.correo}</div>}
              </div>

              <button className="fp-btn" disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar instrucciones'}
              </button>
            </form>

            <Link to="/login" className="fp-back">← Volver al inicio de sesión</Link>
          </>
        ) : (
          <div className="fp-success">
            <div className="fp-success-icon">
              <svg width="28" height="28" viewBox="0 0 20 20" fill="#276749">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="fp-success-title">¡Correo enviado!</h3>
            <p className="fp-success-msg">
              Si <strong>{correo}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <Link to="/login" className="fp-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: '10px' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}