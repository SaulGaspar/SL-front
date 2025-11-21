import React, { useState } from 'react';
import axios from 'axios';

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellidoP: '',
    apellidoM: '',
    telefono: '',
    usuario: user.usuario || ''
  });
  const [msg, setMsg] = useState('');

  // URL del backend
  const API_URL = process.env.REACT_APP_API_URL || 'https://sl-back.vercel.app';
  const token = localStorage.getItem('token');

  async function updateProfile(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/update-profile`, form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMsg('Perfil actualizado');
      const updated = { ...user, nombre: form.nombre, usuario: form.usuario };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser && setUser(updated);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error');
    }
  }

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const actual = e.target.actual.value;
      const nueva = e.target.nueva.value;
      await axios.post(
        `${API_URL}/api/update-password`,
        { actual, nueva },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setMsg('Contraseña actualizada');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error');
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Mi perfil</h4>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={updateProfile}>
          <div className="mb-2">
            <label>Nombre</label>
            <input
              className="form-control"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Apellido P</label>
            <input
              className="form-control"
              value={form.apellidoP}
              onChange={(e) => setForm({ ...form, apellidoP: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Apellido M</label>
            <input
              className="form-control"
              value={form.apellidoM}
              onChange={(e) => setForm({ ...form, apellidoM: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Teléfono</label>
            <input
              className="form-control"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Usuario</label>
            <input
              className="form-control"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
            />
          </div>
          <button className="btn btn-primary-custom">Guardar</button>
        </form>
      </div>
      <div className="col-md-6">
        <h4>Cambiar contraseña</h4>
        <form onSubmit={updatePassword}>
          <div className="mb-2">
            <label>Actual</label>
            <input name="actual" type="password" className="form-control" />
          </div>
          <div className="mb-2">
            <label>Nueva</label>
            <input name="nueva" type="password" className="form-control" />
          </div>
          <button className="btn btn-primary-custom">Cambiar</button>
        </form>
      </div>
    </div>
  );
}
