import React, { useState, useEffect, useCallback } from "react";
import {
  MdSearch, MdRefresh, MdEdit, MdClose, MdPerson, MdLockOpen,
  MdLock, MdCheckCircle, MdCancel, MdAdminPanelSettings,
  MdPeople, MdWarning, MdKey, MdDelete, MdShoppingCart,
} from "react-icons/md";

const API = "https://sl-back.vercel.app/api/admin";

const token = () => localStorage.getItem("token");
const apiFetch = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", ...opts.headers },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmt = (v) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v || 0);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.usu * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }

/* Stats */
.usu-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-bottom:20px; }
.usu-stat { background:white; border-radius:12px; padding:14px 16px; box-shadow:0 1px 6px rgba(0,0,0,0.06); }
.usu-stat-n { font-size:1.9rem; font-weight:700; color:var(--uc); line-height:1; }
.usu-stat-l { font-size:.75rem; color:#718096; font-weight:600; margin-top:4px; }

/* Toolbar */
.usu-bar {
  background:white; padding:14px 18px; border-radius:12px; margin-bottom:18px;
  box-shadow:0 1px 6px rgba(0,0,0,0.06); display:flex; gap:10px; flex-wrap:wrap; align-items:center;
}
.usu-srch { position:relative; flex:1; min-width:180px; max-width:320px; }
.usu-srch input {
  width:100%; padding:9px 9px 9px 36px; border:1.5px solid #e2e8f0;
  border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc;
}
.usu-srch input:focus { outline:none; border-color:#667eea; background:white; }
.usu-srch-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; }
.usu-sel {
  padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:130px;
}
.usu-sel:focus { outline:none; border-color:#667eea; }
.usu-btn {
  padding:9px 16px; border-radius:8px; border:none; cursor:pointer;
  font-family:inherit; font-size:.88rem; font-weight:600;
  display:flex; align-items:center; gap:6px; transition:all .2s;
}
.usu-btn-primary { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }
.usu-btn-primary:hover { opacity:.9; }
.usu-btn-ghost { background:#f7fafc; color:#4a5568; border:1.5px solid #e2e8f0; }
.usu-btn-ghost:hover { background:#edf2f7; }
.usu-btn:disabled { opacity:.5; cursor:not-allowed; }

/* Table */
.usu-card { background:white; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,0.06); overflow:hidden; }
.usu-table { width:100%; border-collapse:collapse; }
.usu-table thead { background:#f8fafc; }
.usu-table th {
  padding:12px 16px; text-align:left; font-size:.75rem; font-weight:700;
  color:#4a5568; text-transform:uppercase; letter-spacing:.5px;
  border-bottom:2px solid #e2e8f0; white-space:nowrap;
}
.usu-table td { padding:12px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.usu-table tbody tr:hover { background:#f8fafc; }
.usu-table tbody tr:last-child td { border-bottom:none; }

.usu-name { font-weight:600; color:#1a202c; font-size:.9rem; }
.usu-handle { font-size:.78rem; color:#a0aec0; margin-top:2px; }
.usu-email { font-size:.84rem; color:#4a5568; }
.usu-date { font-size:.8rem; color:#718096; white-space:nowrap; }

.usu-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px; border-radius:20px; font-size:.73rem; font-weight:700;
}
.usu-badge-admin { background:#ede9fe; color:#5b21b6; }
.usu-badge-cliente { background:#dbeafe; color:#1e40af; }
.usu-badge-ok { background:#dcfce7; color:#15803d; }
.usu-badge-no { background:#fee2e2; color:#b91c1c; }
.usu-badge-lock { background:#fef3c7; color:#b45309; }

.usu-actions { display:flex; gap:6px; }
.usu-act-btn {
  padding:6px 11px; border-radius:7px; border:none; cursor:pointer;
  font-size:.78rem; font-family:inherit; font-weight:600;
  display:flex; align-items:center; gap:4px; transition:all .2s;
}
.usu-act-edit { background:#ede9fe; color:#5b21b6; }
.usu-act-edit:hover { background:#ddd6fe; }
.usu-act-unlock { background:#dcfce7; color:#15803d; }
.usu-act-unlock:hover { background:#bbf7d0; }

.usu-empty { padding:60px; text-align:center; color:#a0aec0; }
.usu-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }

/* Modal */
.usu-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:3000;
  display:flex; align-items:center; justify-content:center; padding:16px;
}
.usu-modal {
  background:white; border-radius:16px; width:100%; max-width:640px;
  max-height:92vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2);
}
.usu-mhead {
  padding:18px 24px; border-bottom:1px solid #f0f4f8;
  display:flex; justify-content:space-between; align-items:center;
  position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0;
}
.usu-mhead h3 { margin:0; font-size:1.05rem; color:#1a202c; }
.usu-mbody { padding:20px 24px; }
.usu-mclose {
  background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px;
  display:flex; align-items:center; justify-content:center; cursor:pointer; color:#718096;
}
.usu-mclose:hover { background:#edf2f7; color:#1a202c; }

.usu-avatar {
  width:60px; height:60px; border-radius:50%;
  background:linear-gradient(135deg,#667eea,#764ba2);
  display:flex; align-items:center; justify-content:center;
  color:white; font-size:1.5rem; font-weight:700; margin:0 auto 16px; flex-shrink:0;
}
.usu-profile-row { display:flex; align-items:center; gap:16px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #f0f4f8; }
.usu-profile-info h4 { margin:0 0 4px; font-size:1.1rem; color:#1a202c; }
.usu-profile-info p { margin:0; font-size:.85rem; color:#718096; }

.usu-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.usu-field { display:flex; flex-direction:column; gap:5px; }
.usu-field.full { grid-column:1/-1; }
.usu-field label { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; }
.usu-field input, .usu-field select {
  padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.9rem; font-family:inherit; background:#f8fafc;
}
.usu-field input:focus, .usu-field select:focus { outline:none; border-color:#667eea; background:white; }

.usu-toggle-row { display:flex; gap:10px; }
.usu-toggle {
  flex:1; padding:9px; border:2px solid #e2e8f0; border-radius:8px; cursor:pointer;
  font-family:inherit; font-size:.82rem; font-weight:600; background:#f8fafc; transition:all .2s;
  display:flex; align-items:center; justify-content:center; gap:5px;
}
.usu-toggle.active-admin { border-color:#7c3aed; background:#ede9fe; color:#5b21b6; }
.usu-toggle.active-cliente { border-color:#1d4ed8; background:#dbeafe; color:#1e40af; }
.usu-toggle.active-verif { border-color:#15803d; background:#dcfce7; color:#15803d; }
.usu-toggle.active-noverif { border-color:#b91c1c; background:#fee2e2; color:#b91c1c; }

.usu-section-title { font-size:.8rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; margin:20px 0 10px; }

.usu-orders-mini { display:flex; flex-direction:column; gap:6px; }
.usu-order-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:9px 12px; background:#f8fafc; border-radius:8px; border:1px solid #f0f4f8;
}
.usu-order-id { font-size:.82rem; font-weight:700; color:#667eea; }
.usu-order-date { font-size:.75rem; color:#a0aec0; margin-top:1px; }
.usu-order-total { font-weight:700; color:#1a202c; font-size:.88rem; }

.usu-danger { margin-top:20px; padding-top:20px; border-top:1px solid #fee2e2; }
.usu-danger-title { font-size:.78rem; font-weight:700; color:#b91c1c; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; }
.usu-danger-btns { display:flex; gap:8px; flex-wrap:wrap; }
.usu-dbtn {
  padding:8px 14px; border-radius:8px; border:none; cursor:pointer;
  font-family:inherit; font-size:.82rem; font-weight:600;
  display:flex; align-items:center; gap:5px; transition:all .2s;
}
.usu-dbtn-unlock { background:#dcfce7; color:#15803d; }
.usu-dbtn-unlock:hover { background:#bbf7d0; }
.usu-dbtn-reset { background:#fef3c7; color:#b45309; }
.usu-dbtn-reset:hover { background:#fde68a; }
.usu-dbtn-deact { background:#fee2e2; color:#b91c1c; }
.usu-dbtn-deact:hover { background:#fecaca; }
.usu-dbtn:disabled { opacity:.5; cursor:not-allowed; }

.usu-save-row { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #f0f4f8; }
.usu-spinner { display:flex; align-items:center; justify-content:center; padding:60px; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.usu-toast {
  position:fixed; bottom:24px; right:24px; z-index:9999;
  background:#1a202c; color:white; padding:12px 20px; border-radius:10px;
  font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600;
  box-shadow:0 8px 24px rgba(0,0,0,0.2); animation:slideIn .3s ease;
}
.usu-toast.ok { background:#276749; }
.usu-toast.err { background:#9b2c2c; }
@keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
`;

const INIT_FORM = { nombre: "", apellidoP: "", apellidoM: "", telefono: "", usuario: "", rol: "cliente", verificado: 1 };

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: "", rol: "all", verificado: "all" });
  const [modal, setModal] = useState(null); // { user, orders }
  const [form, setForm] = useState(INIT_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.rol !== "all") params.append("rol", filters.rol);
      if (filters.verificado !== "all") params.append("verificado", filters.verificado);
      if (filters.search) params.append("search", filters.search);
      const data = await apiFetch(`${API}/users?${params}`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters.rol, filters.verificado, filters.search]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiFetch(`${API}/users/stats/summary`);
      setStats(data.resumen || null);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const openModal = async (user) => {
    setModal({ user, orders: null });
    setForm({
      nombre: user.nombre || "",
      apellidoP: user.apellidoP || "",
      apellidoM: user.apellidoM || "",
      telefono: user.telefono || "",
      usuario: user.usuario || "",
      rol: user.rol || "cliente",
      verificado: user.verificado ?? 1,
    });
    try {
      const data = await apiFetch(`${API}/users/${user.id}`);
      setModal({ user: data.user || user, orders: data.orders || [] });
    } catch (e) { /* keep basic */ }
  };

  const saveUser = async () => {
    if (!modal?.user?.id) return;
    setSaving(true);
    try {
      await apiFetch(`${API}/users/${modal.user.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      showToast("Usuario actualizado correctamente");
      fetchUsers(); fetchStats();
      setModal((m) => ({ ...m, user: { ...m.user, ...form } }));
    } catch (e) {
      showToast("Error al actualizar usuario", "err");
    } finally { setSaving(false); }
  };

  const unlockUser = async () => {
    setSaving(true);
    try {
      await apiFetch(`${API}/users/${modal.user.id}/unlock`, { method: "PATCH" });
      showToast("Usuario desbloqueado");
      fetchUsers();
      setModal((m) => ({ ...m, user: { ...m.user, failedAttempts: 0, lockedUntil: null } }));
    } catch (e) { showToast("Error al desbloquear", "err"); }
    finally { setSaving(false); }
  };

  const resetPassword = async () => {
    if (!confirm("¿Enviar nueva contraseña temporal al correo del usuario?")) return;
    setSaving(true);
    try {
      const data = await apiFetch(`${API}/users/${modal.user.id}/reset-password`, { method: "POST" });
      showToast(`Contraseña enviada. Temporal: ${data.tempPassword}`);
    } catch (e) { showToast("Error al resetear contraseña", "err"); }
    finally { setSaving(false); }
  };

  const deactivateUser = async () => {
    if (!confirm("¿Desactivar este usuario?")) return;
    setSaving(true);
    try {
      await apiFetch(`${API}/users/${modal.user.id}`, { method: "DELETE" });
      showToast("Usuario desactivado");
      setModal(null); fetchUsers(); fetchStats();
    } catch (e) { showToast(e.message || "Error al desactivar", "err"); }
    finally { setSaving(false); }
  };

  const isLocked = (u) => u.lockedUntil && new Date(u.lockedUntil) > new Date();

  // Filter local search
  const filtered = users.filter((u) => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return (
      (u.nombre || "").toLowerCase().includes(q) ||
      (u.apellidoP || "").toLowerCase().includes(q) ||
      (u.usuario || "").toLowerCase().includes(q) ||
      (u.correo || "").toLowerCase().includes(q)
    );
  });

  const StatCard = ({ color, val, label }) => (
    <div className="usu-stat" style={{ "--uc": color }}>
      <div className="usu-stat-n">{val ?? "—"}</div>
      <div className="usu-stat-l">{label}</div>
    </div>
  );

  return (
    <div className="usu">
      <style>{CSS}</style>

      <div className="page-header">
        <h2>Usuarios</h2>
        <p>Gestiona los usuarios del sistema</p>
      </div>

      {/* Stats */}
      <div className="usu-stats">
        <StatCard color="#667eea" val={stats?.total_usuarios} label="Total usuarios" />
        <StatCard color="#15803d" val={stats?.clientes} label="Clientes" />
        <StatCard color="#5b21b6" val={stats?.admins} label="Administradores" />
        <StatCard color="#0e7490" val={stats?.verificados} label="Verificados" />
        <StatCard color="#b45309" val={stats?.sin_verificar} label="Sin verificar" />
        <StatCard color="#b91c1c" val={stats?.bloqueados} label="Bloqueados" />
      </div>

      {/* Toolbar */}
      <div className="usu-bar">
        <div className="usu-srch">
          <MdSearch className="usu-srch-ico" size={18} />
          <input
            placeholder="Buscar nombre, usuario, correo…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select className="usu-sel" value={filters.rol} onChange={(e) => setFilters({ ...filters, rol: e.target.value })}>
          <option value="all">Todos los roles</option>
          <option value="cliente">Clientes</option>
          <option value="admin">Admins</option>
        </select>
        <select className="usu-sel" value={filters.verificado} onChange={(e) => setFilters({ ...filters, verificado: e.target.value })}>
          <option value="all">Todos</option>
          <option value="1">Verificados</option>
          <option value="0">Sin verificar</option>
        </select>
        <button className="usu-btn usu-btn-primary" onClick={fetchUsers}>
          <MdRefresh size={16} /> Actualizar
        </button>
        {(filters.search || filters.rol !== "all" || filters.verificado !== "all") && (
          <button className="usu-btn usu-btn-ghost" onClick={() => setFilters({ search: "", rol: "all", verificado: "all" })}>
            <MdClose size={14} /> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="usu-card">
        {loading ? (
          <div className="usu-spinner"><MdRefresh size={32} className="spinning" style={{ color: "#667eea" }} /></div>
        ) : filtered.length === 0 ? (
          <div className="usu-empty">
            <MdPeople size={40} style={{ display: "block", margin: "0 auto 12px", color: "#cbd5e0" }} />
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <table className="usu-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const locked = isLocked(u);
                  return (
                    <tr key={u.id}>
                      <td style={{ color: "#a0aec0", fontSize: ".8rem" }}>{u.id}</td>
                      <td>
                        <div className="usu-name">{u.nombre} {u.apellidoP}</div>
                        <div className="usu-handle">@{u.usuario}</div>
                      </td>
                      <td><span className="usu-email">{u.correo}</span></td>
                      <td>
                        <span className={`usu-badge usu-badge-${u.rol}`}>
                          {u.rol === "admin" ? <MdAdminPanelSettings size={12} /> : <MdPerson size={12} />}
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        {locked ? (
                          <span className="usu-badge usu-badge-lock"><MdLock size={12} /> Bloqueado</span>
                        ) : u.verificado ? (
                          <span className="usu-badge usu-badge-ok"><MdCheckCircle size={12} /> Verificado</span>
                        ) : (
                          <span className="usu-badge usu-badge-no"><MdCancel size={12} /> Sin verificar</span>
                        )}
                      </td>
                      <td><span className="usu-date">{fmtDate(u.createdAt)}</span></td>
                      <td>
                        <div className="usu-actions">
                          <button className="usu-act-btn usu-act-edit" onClick={() => openModal(u)}>
                            <MdEdit size={14} /> Editar
                          </button>
                          {locked && (
                            <button className="usu-act-btn usu-act-unlock" onClick={async () => {
                              try {
                                await apiFetch(`${API}/users/${u.id}/unlock`, { method: "PATCH" });
                                showToast("Usuario desbloqueado");
                                fetchUsers();
                              } catch { showToast("Error al desbloquear", "err"); }
                            }}>
                              <MdLockOpen size={14} /> Desbloquear
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="usu-foot">{filtered.length} usuario{filtered.length !== 1 ? "s" : ""}</div>
          </>
        )}
      </div>

      {/* Modal edición */}
      {modal && (
        <div className="usu-overlay" onClick={(e) => { if (e.target.classList.contains("usu-overlay")) setModal(null); }}>
          <div className="usu-modal">
            <div className="usu-mhead">
              <h3><MdPerson style={{ verticalAlign: "middle", marginRight: 6 }} />Editar usuario</h3>
              <button className="usu-mclose" onClick={() => setModal(null)}><MdClose /></button>
            </div>
            <div className="usu-mbody">
              {/* Avatar + nombre */}
              <div className="usu-profile-row">
                <div className="usu-avatar">{modal.user?.nombre?.[0]?.toUpperCase() || "?"}</div>
                <div className="usu-profile-info">
                  <h4>{modal.user?.nombre} {modal.user?.apellidoP}</h4>
                  <p>@{modal.user?.usuario} · {modal.user?.correo}</p>
                  <p style={{ marginTop: 4 }}>Registro: {fmtDate(modal.user?.createdAt)}</p>
                </div>
              </div>

              {/* Formulario */}
              <div className="usu-form-grid">
                <div className="usu-field">
                  <label>Nombre</label>
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="usu-field">
                  <label>Apellido paterno</label>
                  <input value={form.apellidoP} onChange={(e) => setForm({ ...form, apellidoP: e.target.value })} />
                </div>
                <div className="usu-field">
                  <label>Apellido materno</label>
                  <input value={form.apellidoM} onChange={(e) => setForm({ ...form, apellidoM: e.target.value })} />
                </div>
                <div className="usu-field">
                  <label>Teléfono</label>
                  <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                </div>
                <div className="usu-field full">
                  <label>Usuario (@handle)</label>
                  <input value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} />
                </div>

                {/* Rol */}
                <div className="usu-field full">
                  <label>Rol</label>
                  <div className="usu-toggle-row">
                    <button
                      className={`usu-toggle ${form.rol === "cliente" ? "active-cliente" : ""}`}
                      onClick={() => setForm({ ...form, rol: "cliente" })}
                    ><MdPerson size={15} /> Cliente</button>
                    <button
                      className={`usu-toggle ${form.rol === "admin" ? "active-admin" : ""}`}
                      onClick={() => setForm({ ...form, rol: "admin" })}
                    ><MdAdminPanelSettings size={15} /> Administrador</button>
                  </div>
                </div>

                {/* Verificado */}
                <div className="usu-field full">
                  <label>Estado de cuenta</label>
                  <div className="usu-toggle-row">
                    <button
                      className={`usu-toggle ${form.verificado === 1 || form.verificado === true ? "active-verif" : ""}`}
                      onClick={() => setForm({ ...form, verificado: 1 })}
                    ><MdCheckCircle size={15} /> Verificado</button>
                    <button
                      className={`usu-toggle ${form.verificado === 0 || form.verificado === false ? "active-noverif" : ""}`}
                      onClick={() => setForm({ ...form, verificado: 0 })}
                    ><MdCancel size={15} /> Sin verificar</button>
                  </div>
                </div>
              </div>

              {/* Órdenes recientes */}
              {modal.orders && modal.orders.length > 0 && (
                <>
                  <p className="usu-section-title"><MdShoppingCart style={{ verticalAlign: "middle", marginRight: 4 }} />Últimos pedidos ({modal.orders.length})</p>
                  <div className="usu-orders-mini">
                    {modal.orders.slice(0, 5).map((o) => (
                      <div className="usu-order-row" key={o.id}>
                        <div>
                          <div className="usu-order-id">#{o.id}</div>
                          <div className="usu-order-date">{fmtDate(o.fecha)} · Sucursal {o.sucursal}</div>
                        </div>
                        <div className="usu-order-total">{fmt(o.total)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Acciones peligrosas */}
              <div className="usu-danger">
                <div className="usu-danger-title">⚠ Acciones de cuenta</div>
                <div className="usu-danger-btns">
                  {isLocked(modal.user) && (
                    <button className="usu-dbtn usu-dbtn-unlock" disabled={saving} onClick={unlockUser}>
                      <MdLockOpen size={14} /> Desbloquear
                    </button>
                  )}
                  <button className="usu-dbtn usu-dbtn-reset" disabled={saving} onClick={resetPassword}>
                    <MdKey size={14} /> Resetear contraseña
                  </button>
                  {modal.user?.id !== JSON.parse(atob((token() || ".e.").split(".")[1] || "e30=") || "{}").id && (
                    <button className="usu-dbtn usu-dbtn-deact" disabled={saving} onClick={deactivateUser}>
                      <MdDelete size={14} /> Desactivar cuenta
                    </button>
                  )}
                </div>
              </div>

              {/* Guardar */}
              <div className="usu-save-row">
                <button className="usu-btn usu-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="usu-btn usu-btn-primary" disabled={saving} onClick={saveUser}>
                  {saving ? <MdRefresh className="spinning" size={16} /> : <MdCheckCircle size={16} />}
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`usu-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}