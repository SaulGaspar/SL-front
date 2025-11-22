import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfileForm({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'https://sl-back.vercel.app';

  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellidoP: user.apellidoP || '',
    apellidoM: user.apellidoM || '',
    telefono: user.telefono || '',
    usuario: user.usuario || ''
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/update-profile`, form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMsg('Perfil actualizado correctamente. Redirigiendo...');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', background: '#f5f7fa' }}>
      <style>{`
        .card-update {
          width: 100%;
          max-width: 500px;
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
        .btn-update {
          background: #ff6b6b;
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
        .btn-update:hover {
          background: #ff4757;
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

      <div className="card-update">
        <nav className="breadcrumb">
          <a href="/profile">Perfil</a> &gt; Actualizar información
        </nav>

        <h2 className="card-title mb-4">Actualizar información</h2>

        {msg && <div className="alert alert-info alert-msg">{msg}</div>}

        <form onSubmit={updateProfile}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              className="form-control form-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido P</label>
            <input
              className="form-control form-input"
              value={form.apellidoP}
              onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido M</label>
            <input
              className="form-control form-input"
              value={form.apellidoM}
              onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control form-input"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              className="form-control form-input"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              required
            />
          </div>

          <button className="btn-update" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar información'}
          </button>
        </form>
      </div>
    </div>
  );
}
