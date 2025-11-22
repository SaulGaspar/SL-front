import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UpdateInfoForm({ user, setUser }) {
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
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/update-profile`, form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMsg('Información actualizada correctamente');

      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser && setUser(updated);

      // Redirigir al perfil
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error actualizando información');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card-pass" style={{ maxWidth: '500px', width: '100%', padding: '30px' }}>
        <h2 className="card-title mb-4">Actualizar información</h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-2">
            <label>Nombre</label>
            <input
              className="form-control form-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <label>Apellido P</label>
            <input
              className="form-control form-input"
              value={form.apellidoP}
              onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              required
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
              required
            />
          </div>

          <button className="btn-pass" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar información'}
          </button>
        </form>

        <style>{`
          .card-pass {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }
          .card-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #0a1a2f;
            text-align: center;
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
        `}</style>
      </div>
    </div>
  );
}
