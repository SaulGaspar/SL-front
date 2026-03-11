import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const API_URL = 'https://sl-back.vercel.app';
  const token = localStorage.getItem('token');

  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('ok');

  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellidoP: user.apellidoP || '',
    apellidoM: user.apellidoM || '',
    telefono: user.telefono || '',
    usuario: user.usuario || ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/update-profile`, form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMsgType('ok');
      setMsg('Perfil actualizado con éxito');
      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
    } catch (error) {
      setMsgType('err');
      setMsg(error.response?.data?.error || 'Error actualizando perfil');
    }
  };

  const inicial = (user.nombre || user.usuario || '?')[0].toUpperCase();
  const nombreCompleto = [user.nombre, user.apellidoP, user.apellidoM].filter(Boolean).join(' ');

  return (
    <div style={{ minHeight: '92vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '48px 16px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .pf-wrap { width: 100%; max-width: 460px; }

        .pf-back {
          font-size: .82rem; color: #8a92a6; text-decoration: none;
          display: inline-flex; align-items: center; gap: 5px;
          margin-bottom: 28px; font-weight: 500; letter-spacing: .2px;
          transition: color .2s;
        }
        .pf-back:hover { color: #1c2b4a; }

        /* Hero */
        .pf-hero {
          text-align: center; margin-bottom: 24px;
          background: linear-gradient(145deg, #1c2b4a 0%, #243660 100%);
          border-radius: 20px; padding: 36px 24px 28px;
          box-shadow: 0 8px 32px rgba(28,43,74,0.18);
          position: relative; overflow: hidden;
        }
        .pf-hero::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 160px; height: 160px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .pf-hero::after {
          content: ''; position: absolute; bottom: -20px; left: -20px;
          width: 100px; height: 100px; border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .pf-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 2.5px solid rgba(255,255,255,0.25);
          color: white; font-size: 1.8rem; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 14px; backdrop-filter: blur(10px);
        }
        .pf-name { font-size: 1.15rem; font-weight: 700; color: white; margin: 0 0 4px; letter-spacing: .2px; }
        .pf-handle { font-size: .82rem; color: rgba(255,255,255,0.5); font-weight: 500; }

        /* Info card */
        .pf-card {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden; margin-bottom: 12px;
        }
        .pf-card-title {
          font-size: .68rem; font-weight: 700; color: #a0a8bc;
          text-transform: uppercase; letter-spacing: .8px;
          padding: 16px 20px 10px; border-bottom: 1px solid #f0f3f8;
        }
        .pf-row {
          display: flex; align-items: center;
          padding: 14px 20px; border-bottom: 1px solid #f5f7fb; gap: 14px;
        }
        .pf-row:last-child { border-bottom: none; }
        .pf-row-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f0f2f5; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; color: #1c2b4a;
        }
        .pf-row-label { font-size: .68rem; font-weight: 600; color: #b0b8cc; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
        .pf-row-value { font-size: .92rem; color: #1a2035; font-weight: 500; }

        /* Actions */
        .pf-actions { display: flex; flex-direction: column; gap: 8px; }
        .pf-btn {
          display: flex; align-items: center; gap: 14px;
          padding: 15px 18px; border-radius: 14px; border: none;
          font-size: .91rem; font-weight: 600; cursor: pointer;
          transition: all .2s ease; text-align: left; width: 100%;
          background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          color: #1c2b4a; font-family: inherit;
        }
        .pf-btn:hover { box-shadow: 0 4px 20px rgba(28,43,74,0.12); transform: translateY(-1px); }
        .pf-btn:active { transform: translateY(0); }

        .pf-btn-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: #1c2b4a; color: white;
        }
        .pf-btn-text { flex: 1; }
        .pf-btn-arrow { color: #c8cdd8; font-size: 1.1rem; line-height: 1; }

        .ico { width: 16px; height: 16px; }

        /* Messages */
        .pf-msg-ok  { background: #edfdf5; border: 1px solid #a3e6c3; color: #1a7a4a; padding: 11px 15px; border-radius: 12px; font-size: .87rem; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .pf-msg-err { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; padding: 11px 15px; border-radius: 12px; font-size: .87rem; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }

        /* Form */
        .pf-form-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 24px; }
        .pf-form-title { font-size: .98rem; font-weight: 700; color: #1c2b4a; margin: 0 0 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f3f8; }
        .pf-field { margin-bottom: 13px; }
        .pf-label { display: block; font-size: .7rem; font-weight: 700; color: #8a92a6; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px; }
        .pf-input {
          width: 100%; padding: 10px 14px; border: 1.5px solid #e8ecf4;
          border-radius: 10px; font-size: .91rem; background: #f8fafc;
          transition: all .2s; font-family: inherit; color: #1a2035; font-weight: 500;
        }
        .pf-input:focus { outline: none; border-color: #1c2b4a; background: white; box-shadow: 0 0 0 3px rgba(28,43,74,0.08); }
        .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .pf-form-actions { display: flex; gap: 10px; margin-top: 20px; }
        .pf-save {
          flex: 1; padding: 12px; background: #1c2b4a; color: white;
          border: none; border-radius: 11px; font-size: .92rem; font-weight: 700;
          cursor: pointer; transition: all .2s; font-family: inherit;
          box-shadow: 0 4px 14px rgba(28,43,74,0.2);
        }
        .pf-save:hover { background: #243660; box-shadow: 0 6px 20px rgba(28,43,74,0.3); }
        .pf-cancel {
          padding: 12px 20px; background: #f0f2f5; color: #6b7490;
          border: none; border-radius: 11px; font-size: .92rem; font-weight: 600;
          cursor: pointer; transition: all .2s; font-family: inherit;
        }
        .pf-cancel:hover { background: #e4e8f0; }
      `}</style>

      <div className="pf-wrap">

        <Link to="/" className="pf-back">
          <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          Inicio
        </Link>

        {/* Hero */}
        <div className="pf-hero">
          <div className="pf-avatar">{inicial}</div>
          <p className="pf-name">{nombreCompleto || user.usuario}</p>
          <span className="pf-handle">@{user.usuario}</span>
        </div>

        {msg && !editing && (
          <div className={msgType === 'ok' ? 'pf-msg-ok' : 'pf-msg-err'}>
            {msgType === 'ok'
              ? <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            }
            {msg}
          </div>
        )}

        {!editing ? (
          <>
            {/* Info card */}
            <div className="pf-card" style={{ marginBottom: 16 }}>
              <div className="pf-card-title">Información de cuenta</div>
              <div className="pf-row">
                <div className="pf-row-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                </div>
                <div>
                  <div className="pf-row-label">Usuario</div>
                  <div className="pf-row-value">@{user.usuario}</div>
                </div>
              </div>
              <div className="pf-row">
                <div className="pf-row-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                </div>
                <div>
                  <div className="pf-row-label">Correo</div>
                  <div className="pf-row-value">{user.correo}</div>
                </div>
              </div>
              {user.telefono && (
                <div className="pf-row">
                  <div className="pf-row-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  </div>
                  <div>
                    <div className="pf-row-label">Teléfono</div>
                    <div className="pf-row-value">{user.telefono}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pf-actions">
              <button className="pf-btn" onClick={() => { setEditing(true); setMsg(''); }}>
                <div className="pf-btn-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </div>
                <span className="pf-btn-text">Editar información</span>
                <span className="pf-btn-arrow">›</span>
              </button>

              <button className="pf-btn" onClick={() => navigate('/change-password')}>
                <div className="pf-btn-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                </div>
                <span className="pf-btn-text">Cambiar contraseña</span>
                <span className="pf-btn-arrow">›</span>
              </button>

              <button className="pf-btn" onClick={() => navigate('/orders')}>
                <div className="pf-btn-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/><path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                </div>
                <span className="pf-btn-text">Mis pedidos</span>
                <span className="pf-btn-arrow">›</span>
              </button>
            </div>
          </>
        ) : (
          <div className="pf-form-card">
            <p className="pf-form-title">Editar información</p>

            {msg && <div className={msgType === 'ok' ? 'pf-msg-ok' : 'pf-msg-err'}>{msg}</div>}

            <form onSubmit={handleUpdateProfile}>
              <div className="pf-grid">
                <div className="pf-field">
                  <label className="pf-label">Nombre</label>
                  <input className="pf-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Apellido paterno</label>
                  <input className="pf-input" value={form.apellidoP} onChange={e => setForm({ ...form, apellidoP: e.target.value })} />
                </div>
              </div>
              <div className="pf-field">
                <label className="pf-label">Apellido materno</label>
                <input className="pf-input" value={form.apellidoM} onChange={e => setForm({ ...form, apellidoM: e.target.value })} />
              </div>
              <div className="pf-field">
                <label className="pf-label">Teléfono</label>
                <input className="pf-input" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="10 dígitos" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Usuario</label>
                <input className="pf-input" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} />
              </div>
              <div className="pf-form-actions">
                <button type="button" className="pf-cancel" onClick={() => { setEditing(false); setMsg(''); }}>Cancelar</button>
                <button type="submit" className="pf-save">Guardar cambios</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}