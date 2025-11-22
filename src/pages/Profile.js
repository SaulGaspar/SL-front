import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://sl-back.vercel.app';
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellidoP: user.apellidoP || '',
    apellidoM: user.apellidoM || '',
    telefono: user.telefono || '',
    usuario: user.usuario || ''
  });
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(false);

  // Guardar cambios de perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/update-profile`, form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMsg('Perfil actualizado correctamente');
      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser && setUser(updated);
      setEditing(false);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error actualizando perfil');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card-profile" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '30px',
        borderRadius: '14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        background: '#fff'
      }}>
        <h2 className="card-title mb-4" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0a1a2f', textAlign: 'center' }}>
          Mi perfil
        </h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        {!editing ? (
          <>
            <div className="mb-3">
              <strong>Usuario:</strong> {user.usuario}<br/>
              <strong>Correo:</strong> {user.correo}<br/>
              <strong>Rol:</strong> {user.rol}
            </div>

            <div className="d-flex flex-column gap-2 mt-3">
              <button
                className="btn-pass"
                onClick={() => setEditing(true)}
              >
                Actualizar información
              </button>
              <button
                className="btn-pass"
                onClick={() => navigate('/reset-password?from=profile')}
              >
                Cambiar contraseña
              </button>
              <button
                className="btn-pass"
                onClick={() => navigate('/orders')}
              >
                Ver pedidos
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-2">
              <label>Nombre</label>
              <input
                className="form-control form-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Apellido P</label>
              <input
                className="form-control form-input"
                value={form.apellidoP}
                onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Apellido M</label>
              <input
                className="form-control form-input"
                value={form.apellidoM}
                onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Teléfono</label>
              <input
                className="form-control form-input"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Usuario</label>
              <input
                className="form-control form-input"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              />
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-pass" type="submit">Guardar</button>
              <button className="btn-pass btn-secondary" type="button" onClick={() => setEditing(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <style>{`
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
          }
          .btn-pass:hover {
            background-color: #07121b;
          }
          .btn-secondary {
            background-color: #6c757d;
          }
          .btn-secondary:hover {
            background-color: #565e64;
          }
        `}</style>
      </div>
    </div>
  );
}
