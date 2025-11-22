import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)"
      }}
    >

      <style>{`
        .update-card {
          width: 100%;
          max-width: 550px;
          background: #ffffff;
          border-radius: 16px;
          padding: 40px 35px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }
        .update-title {
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
        .breadcrumb-custom a:hover {
          text-decoration: underline;
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
        .btn-update {
          background: linear-gradient(135deg, #ff6b6b, #ff4757);
          color: #ffffff;
          border: none;
          padding: 13px;
          width: 100%;
          border-radius: 12px;
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 18px;
          transition: all 0.25s ease;
        }
        .btn-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 71, 87, 0.35);
        }
        .alert-msg {
          margin-top: 12px;
        }
      `}</style>

      <div className="update-card">

        {/* MIGAS DE PAN */}
        <div className="breadcrumb-custom">
          <Link to="/profile">Perfil</Link> &nbsp;/&nbsp;
          <span style={{ color: "#000", fontWeight: 700 }}>Actualizar información</span>
        </div>

        <h2 className="update-title mb-4">Actualizar información</h2>

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
            <label className="form-label">Apellido Paterno</label>
            <input
              className="form-control form-input"
              value={form.apellidoP}
              onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido Materno</label>
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
            {loading ? "Actualizando..." : "Guardar cambios"}
          </button>

        </form>
      </div>
    </div>
  );
}
