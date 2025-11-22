import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://sl-back.vercel.app';
  const token = localStorage.getItem('token');

  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');

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

      setMsg("Perfil actualizado con éxito");

      const updated = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);

      setEditing(false);

    } catch (error) {
      setMsg(error.response?.data?.error || "Error actualizando perfil");
    }
  };

  return (
    <div
      className="profile-container d-flex justify-content-center align-items-start py-5"
      style={{
        minHeight: "92vh",
        background: "linear-gradient(135deg, #eef3ff, #ffffff)"
      }}
    >

      <style>{`
        .profile-card {
          width: 100%;
          max-width: 650px;
          background: white;
          padding: 40px;
          border-radius: 18px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.12);
        }

        .profile-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0a2540;
          text-align: center;
          margin-bottom: 25px;
        }

        .breadcrumb-custom {
          font-size: 0.95rem;
          margin-bottom: 20px;
        }
        .breadcrumb-custom a {
          color: #1a73e8;
          text-decoration: none;
          font-weight: 600;
        }
        .breadcrumb-custom span {
          font-weight: 700;
          color: #000;
        }

        /* === TARJETAS DE INFO CENTRADAS === */
        .info-box {
          background: #f8f9fc;
          padding: 18px 22px;
          border-radius: 14px;
          margin-bottom: 15px;
          border: 1px solid #e3e8f0;
          text-align: center;
        }
        .info-label {
          font-weight: 700;
          color: #0a2540;
          text-align: center;
        }
        .info-value {
          font-size: 1.05rem;
          color: #2f3b52;
          text-align: center;
        }

        .form-input {
          border-radius: 12px !important;
          padding: 11px 14px !important;
          border: 1px solid #cfd8e3;
          font-size: 1rem;
        }

        .btn-main {
          background: linear-gradient(135deg, #0a2540, #06182a);
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 12px;
          width: 100%;
          font-size: 1.15rem;
          font-weight: 700;
          transition: all .25s ease;
        }
        .btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(10, 37, 64, 0.35);
        }

        .btn-secondary {
          background: #0a2540;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          width: 100%;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all .2s ease;
        }
        .btn-secondary:hover {
          background: #06182a;
        }

        .btn-gray {
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          width: 100%;
          font-size: 1.1rem;
        }
        .btn-gray:hover {
          background: #565e64;
        }
      `}</style>

      <div className="profile-card">

        <div className="breadcrumb-custom">
          <Link to="/">Inicio</Link> &nbsp;/&nbsp;
          <span>Mi perfil</span>
        </div>

        <h2 className="profile-title">Mi Perfil</h2>

        {msg && <div className="alert alert-info">{msg}</div>}

        {!editing ? (
          <>
            <div className="info-box">
              <div className="info-label">Usuario</div>
              <div className="info-value">{user.usuario}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Correo</div>
              <div className="info-value">{user.correo}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Rol</div>
              <div className="info-value">{user.rol}</div>
            </div>

            <hr className="my-4" />

            <div className="d-flex flex-column gap-2">
              <button className="btn-main" onClick={() => setEditing(true)}>
                Actualizar información
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate('/reset-password?from=profile')}
              >
                Cambiar contraseña
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate('/orders')}
              >
                Ver pedidos
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>

            <div className="mb-3">
              <label className="info-label">Nombre</label>
              <input
                className="form-control form-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="info-label">Apellido Paterno</label>
              <input
                className="form-control form-input"
                value={form.apellidoP}
                onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="info-label">Apellido Materno</label>
              <input
                className="form-control form-input"
                value={form.apellidoM}
                onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="info-label">Teléfono</label>
              <input
                className="form-control form-input"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="info-label">Usuario</label>
              <input
                className="form-control form-input"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              />
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn-main" type="submit">Guardar cambios</button>
              <button className="btn-gray" type="button" onClick={() => setEditing(false)}>Cancelar</button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
