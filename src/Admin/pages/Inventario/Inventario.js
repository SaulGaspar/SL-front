import React, { useState, useEffect } from "react";
import { MdSearch, MdRefresh, MdEdit, MdWarning, MdCheckCircle, MdCancel } from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .inv-wrap { font-family: 'DM Sans', sans-serif; }
  .inv-toolbar {
    background: white; padding: 20px; border-radius: 12px;
    margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: space-between;
  }
  .inv-search-box { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
  .inv-search-box input {
    width: 100%; padding: 10px 10px 10px 40px;
    border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;
  }
  .inv-search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1.2rem; }
  .inv-select {
    padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 0.9rem; font-family: inherit; min-width: 160px; background: white;
  }
  .inv-btn-refresh {
    background: #f7fafc; color: #2d3748; border: 1px solid #e2e8f0;
    padding: 10px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit;
  }
  .inv-btn-refresh:hover { background: #edf2f7; }
  .inv-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .inv-stat-card {
    background: white; border-radius: 12px; padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 4px;
  }
  .inv-stat-label { font-size: 0.8rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .inv-stat-value { font-size: 2rem; font-weight: 700; color: #1e3a5f; }
  .inv-stat-sub { font-size: 0.8rem; color: #a0aec0; }
  .inv-table-wrap { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
  .inv-table { width: 100%; border-collapse: collapse; }
  .inv-table thead { background: #f7fafc; }
  .inv-table th {
    padding: 14px 16px; text-align: left; font-size: 0.8rem;
    font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;
  }
  .inv-table td { padding: 14px 16px; border-bottom: 1px solid #f0f4f8; color: #2d3748; vertical-align: middle; }
  .inv-table tbody tr:hover { background: #f7fafc; }
  .inv-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .inv-badge.ok { background: #c6f6d5; color: #276749; }
  .inv-badge.low { background: #fef5e7; color: #975a16; }
  .inv-badge.out { background: #fed7d7; color: #9b2c2c; }
  .inv-progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 4px; overflow: hidden; }
  .inv-progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
  .inv-edit-btn {
    background: #bee3f8; color: #2c5282; border: none; padding: 7px 12px;
    border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-family: inherit;
  }
  .inv-edit-btn:hover { background: #90cdf4; }
  .inv-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;
  }
  .inv-modal {
    background: white; border-radius: 16px; width: 100%; max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif;
  }
  .inv-modal-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .inv-modal-header h3 { margin: 0; color: #1e3a5f; font-size: 1.3rem; }
  .inv-modal-close { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #718096; }
  .inv-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .inv-form-group { display: flex; flex-direction: column; gap: 6px; }
  .inv-form-group label { font-weight: 600; font-size: 0.9rem; color: #2d3748; }
  .inv-form-group input {
    padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 0.95rem; font-family: inherit;
  }
  .inv-form-group input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end; }
  .inv-btn-cancel { padding: 10px 20px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; }
  .inv-btn-save {
    padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600;
  }
  .inv-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(102,126,234,0.3); }
  .inv-empty { padding: 48px; text-align: center; color: #718096; }
`;

export default function Inventario() {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [editMin, setEditMin] = useState("");

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    let f = [...inventory];
    if (searchTerm) f = f.filter(i => i.producto?.toLowerCase().includes(searchTerm.toLowerCase()) || i.sucursal?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterBranch !== "all") f = f.filter(i => String(i.branch_id) === filterBranch);
    if (filterStatus === "out") f = f.filter(i => i.stock === 0);
    else if (filterStatus === "low") f = f.filter(i => i.stock > 0 && i.stock <= i.min_stock);
    else if (filterStatus === "ok") f = f.filter(i => i.stock > i.min_stock);
    setFiltered(f);
  }, [inventory, searchTerm, filterBranch, filterStatus]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [invRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/inventory`, { headers }),
        fetch(`${API_URL}/api/admin/inventory/stats`, { headers }),
      ]);
      if (invRes.ok) setInventory(await invRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Error cargando inventario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/inventory/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stock: Number(editStock), min_stock: Number(editMin) }),
      });
      if (res.ok) { setEditing(null); fetchAll(); }
      else alert("Error al actualizar");
    } catch (err) { console.error(err); }
  };

  const branches = [...new Set(inventory.map(i => ({ id: i.branch_id, name: i.sucursal })).map(JSON.stringify))].map(JSON.parse);

  const getStockStatus = (item) => {
    if (item.stock === 0) return { cls: "out", icon: <MdCancel />, label: "Sin stock" };
    if (item.stock <= item.min_stock) return { cls: "low", icon: <MdWarning />, label: "Stock bajo" };
    return { cls: "ok", icon: <MdCheckCircle />, label: "Disponible" };
  };

  const getBarColor = (item) => {
    if (item.stock === 0) return "#fc8181";
    if (item.stock <= item.min_stock) return "#f6ad55";
    return "#68d391";
  };

  const getBarWidth = (item) => {
    const max = Math.max(item.min_stock * 3, item.stock, 1);
    return Math.min((item.stock / max) * 100, 100);
  };

  return (
    <div className="inv-wrap">
      <style>{S}</style>

      <div className="page-header">
        <h2>Inventario</h2>
        <p>Gestiona el stock de tus productos por sucursal</p>
      </div>

      {/* Stats */}
      {stats?.general && (
        <div className="inv-stats">
          <div className="inv-stat-card">
            <span className="inv-stat-label">Total productos</span>
            <span className="inv-stat-value">{stats.general.total_productos || 0}</span>
            <span className="inv-stat-sub">en {stats.general.total_sucursales || 0} sucursales</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Stock total</span>
            <span className="inv-stat-value">{Number(stats.general.stock_total || 0).toLocaleString()}</span>
            <span className="inv-stat-sub">unidades</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Sin stock</span>
            <span className="inv-stat-value" style={{ color: "#e53e3e" }}>{stats.general.productos_sin_stock || 0}</span>
            <span className="inv-stat-sub">requieren atención</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Stock bajo</span>
            <span className="inv-stat-value" style={{ color: "#d69e2e" }}>{stats.general.productos_bajo_stock || 0}</span>
            <span className="inv-stat-sub">por reponer</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Valor inventario</span>
            <span className="inv-stat-value" style={{ fontSize: "1.4rem" }}>${Number(stats.general.valor_inventario || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 })}</span>
            <span className="inv-stat-sub">MXN estimado</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="inv-toolbar">
        <div style={{ display: "flex", gap: 12, flex: 1, flexWrap: "wrap" }}>
          <div className="inv-search-box">
            <MdSearch className="inv-search-icon" />
            <input placeholder="Buscar producto o sucursal..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="inv-select" value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
            <option value="all">Todas las sucursales</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="inv-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ok">Disponible</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
        <button className="inv-btn-refresh" onClick={fetchAll}><MdRefresh size={18} /> Actualizar</button>
      </div>

      {/* Table */}
      <div className="inv-table-wrap">
        {loading ? (
          <div className="inv-empty">Cargando inventario...</div>
        ) : (
          <table className="inv-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Sucursal</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Mín. requerido</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="inv-empty">No se encontraron registros</td></tr>
              ) : filtered.map(item => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: "#1e3a5f" }}>{item.producto}</td>
                    <td style={{ color: "#4a5568" }}>{item.sucursal}</td>
                    <td>
                      {item.categoria && (
                        <span style={{ background: "#edf2f7", padding: "3px 10px", borderRadius: 6, fontSize: "0.8rem", color: "#4a5568" }}>
                          {item.categoria}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{item.stock}</div>
                      <div className="inv-progress-bar">
                        <div className="inv-progress-fill" style={{ width: `${getBarWidth(item)}%`, background: getBarColor(item) }} />
                      </div>
                    </td>
                    <td style={{ color: "#718096" }}>{item.min_stock}</td>
                    <td>
                      <span className={`inv-badge ${status.cls}`}>{status.icon} {status.label}</span>
                    </td>
                    <td>
                      <button className="inv-edit-btn" onClick={() => { setEditing(item); setEditStock(item.stock); setEditMin(item.min_stock); }}>
                        <MdEdit size={15} /> Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal editar */}
      {editing && (
        <div className="inv-modal-overlay" onClick={() => setEditing(null)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3>Editar Stock</h3>
              <button className="inv-modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="inv-modal-body">
              <div style={{ background: "#f7fafc", borderRadius: 8, padding: 12, fontSize: "0.9rem", color: "#4a5568" }}>
                <strong>{editing.producto}</strong> — {editing.sucursal}
              </div>
              <div className="inv-form-group">
                <label>Stock actual</label>
                <input type="number" min="0" value={editStock} onChange={e => setEditStock(e.target.value)} />
              </div>
              <div className="inv-form-group">
                <label>Stock mínimo</label>
                <input type="number" min="0" value={editMin} onChange={e => setEditMin(e.target.value)} />
              </div>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn-cancel" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="inv-btn-save" onClick={handleSave}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
