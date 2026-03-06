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
    <div style={{ minHeight: '92vh', background: '#f4f6f9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '48px 16px' }}>
      <style>{`
        .pf-wrap { width: 100%; max-width: 500px; }

        .pf-back { font-size: .85rem; color: #718096; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 24px; font-weight: 500; }
        .pf-back:hover { color: #0a1a2f; }

        .pf-hero { text-align: center; margin-bottom: 28px; }
        .pf-avatar {
          width: 76px; height: 76px; border-radius: 50%;
          background: #0a1a2f; color: white;
          font-size: 1.9rem; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(10,26,47,0.2); margin-bottom: 14px;
        }
        .pf-name { font-size: 1.2rem; font-weight: 700; color: #0a1a2f; margin: 0 0 6px; }
        .pf-badge { display: inline-block; background: #e8f0fe; color: #1e3a5f; padding: 3px 12px; border-radius: 20px; font-size: .73rem; font-weight: 700; letter-spacing: .3px; }

        .pf-card { background: white; border-radius: 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); overflow: hidden; margin-bottom: 12px; }

        .pf-row { display: flex; align-items: center; padding: 15px 20px; border-bottom: 1px solid #f0f4f8; gap: 14px; }
        .pf-row:last-child { border-bottom: none; }
        .pf-row-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #f4f6f9; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: #4a5568;
        }
        .pf-row-label { font-size: .7rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: .5px; }
        .pf-row-value { font-size: .93rem; color: #1a202c; font-weight: 500; margin-top: 1px; }

        .pf-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .pf-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px; border-radius: 12px; border: none;
          font-size: .92rem; font-weight: 600; cursor: pointer;
          transition: all .18s; text-align: left; width: 100%;
          background: white; box-shadow: 0 1px 8px rgba(0,0,0,0.07);
          color: #1a202c;
        }
        .pf-btn:hover { background: #f8fafc; transform: translateX(2px); }
        .pf-btn-primary { background: #0a1a2f; color: white; }
        .pf-btn-primary:hover { background: #1e3a5f; transform: translateX(2px); }
        .pf-btn-icon {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pf-btn-primary .pf-btn-icon { background: rgba(255,255,255,0.15); }
        .pf-btn-ghost .pf-btn-icon { background: #f4f6f9; }
        .pf-btn-text { flex: 1; }
        .pf-btn-arrow { color: #cbd5e0; font-size: 1rem; line-height: 1; }
        .pf-btn-primary .pf-btn-arrow { color: rgba(255,255,255,0.3); }

        /* SVG icons */
        .ico { width: 16px; height: 16px; }

        .pf-msg-ok  { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 10px 14px; border-radius: 10px; font-size: .88rem; font-weight: 600; margin-bottom: 16px; }
        .pf-msg-err { background: #fff5f5; border: 1px solid #feb2b2; color: #9b2c2c; padding: 10px 14px; border-radius: 10px; font-size: .88rem; font-weight: 600; margin-bottom: 16px; }

        /* Form */
        .pf-form-card { background: white; border-radius: 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); padding: 24px 22px; }
        .pf-form-title { font-size: 1rem; font-weight: 700; color: #0a1a2f; margin: 0 0 20px; padding-bottom: 14px; border-bottom: 1px solid #f0f4f8; }
        .pf-field { margin-bottom: 14px; }
        .pf-label { display: block; font-size: .72rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
        .pf-input { width: 100%; padding: 9px 13px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: .93rem; background: #f8fafc; transition: border-color .2s, background .2s; font-family: inherit; box-sizing: border-box; }
        .pf-input:focus { outline: none; border-color: #0a1a2f; background: white; }
        .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pf-form-actions { display: flex; gap: 10px; margin-top: 20px; }
        .pf-save { flex: 1; padding: 11px; background: #0a1a2f; color: white; border: none; border-radius: 10px; font-size: .93rem; font-weight: 700; cursor: pointer; transition: all .2s; }
        .pf-save:hover { background: #1e3a5f; }
        .pf-cancel { padding: 11px 20px; background: #f7fafc; color: #4a5568; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: .93rem; font-weight: 600; cursor: pointer; transition: all .2s; }
        .pf-cancel:hover { background: #edf2f7; }
      `}</style>

      <div className="pf-wrap">

        <Link to="/" className="pf-back">
          <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          Inicio
        </Link>

        <div className="pf-hero">
          <div className="pf-avatar">{inicial}</div>
          <p className="pf-name">{nombreCompleto || user.usuario}</p>
          <span className="pf-badge">{user.rol === 'admin' ? 'Administrador' : 'Cliente'}</span>
        </div>

        {msg && !editing && <div className={msgType === 'ok' ? 'pf-msg-ok' : 'pf-msg-err'}>{msg}</div>}

        {!editing ? (
          <>
            <div className="pf-card">
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

            <div className="pf-actions">
              <button className="pf-btn pf-btn-primary" onClick={() => { setEditing(true); setMsg(''); }}>
                <div className="pf-btn-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                </div>
                <span className="pf-btn-text">Editar información</span>
                <span className="pf-btn-arrow">›</span>
              </button>
              <button className="pf-btn pf-btn-ghost" onClick={() => navigate('/change-password')}>
                <div className="pf-btn-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ico"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                </div>
                <span className="pf-btn-text">Cambiar contraseña</span>
                <span className="pf-btn-arrow">›</span>
              </button>
              <button className="pf-btn pf-btn-ghost" onClick={() => navigate('/orders')}>
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