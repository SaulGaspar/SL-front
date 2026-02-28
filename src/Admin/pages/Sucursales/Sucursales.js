import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdStore, MdPhone, MdLocationOn } from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .suc-wrap { font-family: 'DM Sans', sans-serif; }
  .suc-toolbar {
    background: white; padding: 20px; border-radius: 12px; margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; gap: 16px; flex-wrap: wrap;
    align-items: center; justify-content: space-between;
  }
  .suc-search-box { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
  .suc-search-box input {
    width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #e2e8f0;
    border-radius: 8px; font-size: 0.9rem; font-family: inherit;
  }
  .suc-search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .suc-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1.2rem; }
  .suc-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
    border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600;
    display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: inherit;
  }
  .suc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(102,126,234,0.3); }
  .suc-btn-refresh {
    background: #f7fafc; color: #2d3748; border: 1px solid #e2e8f0;
    padding: 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center;
  }
  .suc-btn-refresh:hover { background: #edf2f7; }
  .suc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px; }
  .suc-card {
    background: white; border-radius: 14px; padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.2s ease;
    border: 1px solid #f0f4f8; position: relative; overflow: hidden;
  }
  .suc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
  .suc-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
  .suc-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
  .suc-card-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, #ebf4ff, #dbeafe);
    display: flex; align-items: center; justify-content: center; color: #2c5282; font-size: 1.5rem;
  }
  .suc-card-actions { display: flex; gap: 8px; }
  .suc-btn-edit { background: #bee3f8; color: #2c5282; border: none; padding: 7px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; }
  .suc-btn-edit:hover { background: #90cdf4; }
  .suc-btn-del { background: #fed7d7; color: #9b2c2c; border: none; padding: 7px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; }
  .suc-btn-del:hover { background: #fc8181; }
  .suc-card-name { font-size: 1.2rem; font-weight: 700; color: #1e3a5f; margin-bottom: 12px; }
  .suc-card-info { display: flex; flex-direction: column; gap: 8px; }
  .suc-card-row { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #4a5568; }
  .suc-card-row svg { color: #667eea; flex-shrink: 0; }
  .suc-card-stats { display: flex; gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f4f8; }
  .suc-stat { display: flex; flex-direction: column; }
  .suc-stat-val { font-size: 1.3rem; font-weight: 700; color: #1e3a5f; }
  .suc-stat-lbl { font-size: 0.75rem; color: #a0aec0; }
  .suc-badge-active { background: #c6f6d5; color: #276749; padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
  .suc-badge-inactive { background: #fed7d7; color: #9b2c2c; padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
  .suc-empty { padding: 64px; text-align: center; color: #a0aec0; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .suc-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
  .suc-modal { background: white; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif; }
  .suc-modal-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .suc-modal-header h3 { margin: 0; color: #1e3a5f; font-size: 1.3rem; }
  .suc-modal-close { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #718096; }
  .suc-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .suc-form-group { display: flex; flex-direction: column; gap: 6px; }
  .suc-form-group label { font-weight: 600; font-size: 0.9rem; color: #2d3748; }
  .suc-form-group input, .suc-form-group select {
    padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; font-family: inherit;
  }
  .suc-form-group input:focus, .suc-form-group select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .suc-modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end; }
  .suc-btn-cancel { padding: 10px 20px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; }
  .suc-btn-save { padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; }
  .suc-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(102,126,234,0.3); }
`;

const emptyForm = { nombre: "", direccion: "", telefono: "", activo: 1 };

export default function Sucursales() {
  const [branches, setBranches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchBranches(); }, []);
  useEffect(() => {
    if (!searchTerm) { setFiltered(branches); return; }
    setFiltered(branches.filter(b =>
      b.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [branches, searchTerm]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/branches`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setBranches(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = editing ? `${API_URL}/api/admin/branches/${editing.id}` : `${API_URL}/api/admin/branches`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { setShowModal(false); setEditing(null); setForm(emptyForm); fetchBranches(); }
      else { const e = await res.json(); alert(e.error || "Error al guardar"); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar esta sucursal?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/branches/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchBranches();
      else { const e = await res.json(); alert(e.error || "Error al eliminar"); }
    } catch (err) { console.error(err); }
  };

  const openEdit = (b) => { setEditing(b); setForm({ nombre: b.nombre, direccion: b.direccion, telefono: b.telefono || "", activo: b.activo }); setShowModal(true); };

  return (
    <div className="suc-wrap">
      <style>{S}</style>

      <div className="page-header">
        <h2>Sucursales</h2>
        <p>Administra las ubicaciones de tu negocio</p>
      </div>

      <div className="suc-toolbar">
        <div className="suc-search-box">
          <MdSearch className="suc-search-icon" />
          <input placeholder="Buscar sucursal..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="suc-btn-refresh" onClick={fetchBranches}><MdRefresh size={20} /></button>
          <button className="suc-btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }}>
            <MdAdd /> Nueva Sucursal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="suc-empty">Cargando sucursales...</div>
      ) : filtered.length === 0 ? (
        <div className="suc-empty">
          <MdStore size={48} style={{ marginBottom: 12 }} />
          <div>No se encontraron sucursales</div>
        </div>
      ) : (
        <div className="suc-grid">
          {filtered.map(b => (
            <div className="suc-card" key={b.id}>
              <div className="suc-card-accent" />
              <div className="suc-card-header">
                <div className="suc-card-icon"><MdStore /></div>
                <div className="suc-card-actions">
                  <span className={b.activo ? "suc-badge-active" : "suc-badge-inactive"}>{b.activo ? "Activa" : "Inactiva"}</span>
                  <button className="suc-btn-edit" onClick={() => openEdit(b)}><MdEdit size={16} /></button>
                  <button className="suc-btn-del" onClick={() => handleDelete(b.id)}><MdDelete size={16} /></button>
                </div>
              </div>
              <div className="suc-card-name">{b.nombre}</div>
              <div className="suc-card-info">
                <div className="suc-card-row"><MdLocationOn size={16} /> {b.direccion}</div>
                {b.telefono && <div className="suc-card-row"><MdPhone size={16} /> {b.telefono}</div>}
              </div>
              <div className="suc-card-stats">
                <div className="suc-stat">
                  <span className="suc-stat-val">{b.productos || 0}</span>
                  <span className="suc-stat-lbl">Productos</span>
                </div>
                <div className="suc-stat">
                  <span className="suc-stat-val">{Number(b.stock_total || 0).toLocaleString()}</span>
                  <span className="suc-stat-lbl">Unidades</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="suc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="suc-modal" onClick={e => e.stopPropagation()}>
            <div className="suc-modal-header">
              <h3>{editing ? "Editar Sucursal" : "Nueva Sucursal"}</h3>
              <button className="suc-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="suc-modal-body">
              <div className="suc-form-group">
                <label>Nombre *</label>
                <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Sucursal Centro" />
              </div>
              <div className="suc-form-group">
                <label>Dirección *</label>
                <input type="text" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Calle, número, colonia" />
              </div>
              <div className="suc-form-group">
                <label>Teléfono</label>
                <input type="text" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="Ej: 33 1234 5678" />
              </div>
              {editing && (
                <div className="suc-form-group">
                  <label>Estado</label>
                  <select value={form.activo} onChange={e => setForm({ ...form, activo: Number(e.target.value) })}>
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
                  </select>
                </div>
              )}
            </div>
            <div className="suc-modal-footer">
              <button className="suc-btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="suc-btn-save" onClick={handleSubmit}>{editing ? "Actualizar" : "Crear"} Sucursal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
