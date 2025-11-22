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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', backgroundColor: '#f5f6fa' }}>
      <style>{`
        .card-update {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 14px;
          padding: 45px 40px;
          box-shadow: 0 12px 35px rgba(0,0,0,0.18);
        }
        .card-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #0a1a2f;
          text-align: center;
        }
        .form-label {
          font-weight: 600;
          color: #0a1a2f;
        }
        .form-input {
          border-radius: 12px !important;
          padding: 12px 14px !important;
          border: 1px solid #cfcfcf;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-color: #ff6b6b;
          box-shadow: 0 0 5px rgba(255,107,107,0.4);
          outline: none;
        }
        .btn-update {
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: white;
          border: none;
          padding: 14px;
          width: 100%;
          border-radius: 12px;
          font-size: 1.15rem;
          margin-top: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-update:hover {
          background: linear-gradient(135deg, #ff4757, #ff6b6b);
        }
        .breadcrumb {
          font-size: 0.9rem;
          margin-bottom: 25px;
        }
        .breadcrumb a {
          color: #1e90ff;
          text-decoration: none;
        }
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        .alert-msg {
          margin-top: 12px;
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
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido P</label>
            <input
              className="form-control form-input"
              placeholder="Apellido paterno"
              value={form.apellidoP}
              onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido M</label>
            <input
              className="form-control form-input"
              placeholder="Apellido materno"
              value={form.apellidoM}
              onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control form-input"
              placeholder="Número de teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              className="form-control form-input"
              placeholder="Usuario de la cuenta"
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
