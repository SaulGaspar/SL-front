import React, { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh,
  MdClose, MdCheckCircle, MdInventory,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const token   = () => localStorage.getItem("token");
const hdrs    = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });
const fmt     = (v) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v || 0);
const EMPTY   = { nombre: "", marca: "", descripcion: "", precio: "", categoria: "", imagen: "", activo: 1 };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.pro * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.pro-toolbar {
  background:white; padding:16px 20px; border-radius:12px; margin-bottom:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:12px; flex-wrap:wrap;
  align-items:center; justify-content:space-between;
}
.pro-left { display:flex; gap:10px; flex:1; flex-wrap:wrap; }
.pro-search { position:relative; flex:1; min-width:200px; max-width:320px; }
.pro-search input {
  width:100%; padding:10px 10px 10px 36px; border:1.5px solid #e2e8f0;
  border-radius:8px; font-size:.9rem; font-family:inherit; background:#f8fafc;
}
.pro-search input:focus { outline:none; border-color:#667eea; background:white; }
.pro-search-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; pointer-events:none; }
.pro-sel { padding:10px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:140px; }
.pro-sel:focus { outline:none; border-color:#667eea; }
.pro-btn { padding:10px 16px; border-radius:8px; border:none; cursor:pointer; font-family:inherit; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:6px; transition:all .2s; }
.pro-btn-primary { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }
.pro-btn-primary:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 6px 16px rgba(102,126,234,.3); }
.pro-btn-ghost { background:#f7fafc; color:#2d3748; border:1.5px solid #e2e8f0; }
.pro-btn-ghost:hover { background:#edf2f7; }
.pro-btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }
.pro-table-wrap { background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); overflow:hidden; }
.pro-table { width:100%; border-collapse:collapse; }
.pro-table thead { background:#f7fafc; }
.pro-table th { padding:13px 16px; text-align:left; font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.pro-table td { padding:13px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.pro-table tbody tr:hover { background:#f8fafc; }
.pro-table tbody tr:last-child td { border-bottom:none; }
.pro-img { width:46px; height:46px; border-radius:8px; object-fit:cover; background:#edf2f7; border:1px solid #e2e8f0; }
.pro-name { font-weight:700; color:#1e3a5f; font-size:.9rem; }
.pro-brand { font-size:.76rem; color:#667eea; font-weight:600; margin-top:2px; }
.pro-desc { font-size:.76rem; color:#a0aec0; margin-top:2px; max-width:220px; }
.pro-tag { background:#edf2f7; padding:3px 9px; border-radius:6px; font-size:.75rem; color:#4a5568; display:inline-block; }
.pro-price { font-weight:700; color:#38a169; font-size:.95rem; }
.pro-status { padding:4px 10px; border-radius:20px; font-size:.75rem; font-weight:700; display:inline-block; }
.pro-status-on  { background:#c6f6d5; color:#276749; }
.pro-status-off { background:#fed7d7; color:#9b2c2c; }
.pro-actions { display:flex; gap:7px; }
.pro-act { padding:7px 11px; border:none; border-radius:7px; cursor:pointer; font-size:.8rem; font-family:inherit; font-weight:600; display:flex; align-items:center; gap:4px; transition:all .15s; }
.pro-act-edit   { background:#bee3f8; color:#2c5282; }
.pro-act-edit:hover   { background:#90cdf4; }
.pro-act-delete { background:#fed7d7; color:#9b2c2c; }
.pro-act-delete:hover { background:#fc8181; color:white; }
.pro-empty { padding:56px; text-align:center; color:#a0aec0; }
.pro-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }
.pro-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:4000; display:flex; align-items:center; justify-content:center; padding:16px; }
.pro-modal { background:white; border-radius:16px; width:100%; max-width:560px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.28); animation:proIn .22s ease; }
@keyframes proIn { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
.pro-mhead { padding:18px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0; }
.pro-mhead h3 { margin:0; color:#1e3a5f; font-size:1.1rem; font-weight:700; }
.pro-mclose { background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#718096; }
.pro-mclose:hover { background:#fed7d7; color:#9b2c2c; }
.pro-mbody { padding:22px 24px; display:flex; flex-direction:column; gap:16px; }
.pro-field { display:flex; flex-direction:column; gap:5px; }
.pro-field label { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; }
.pro-field input, .pro-field textarea, .pro-field select { padding:10px 13px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.92rem; font-family:inherit; background:#f8fafc; transition:border-color .15s; }
.pro-field input:focus, .pro-field textarea:focus { outline:none; border-color:#667eea; background:white; box-shadow:0 0 0 3px rgba(102,126,234,.1); }
.pro-field textarea { resize:vertical; min-height:80px; }
.pro-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.pro-img-preview { width:100%; height:120px; border-radius:10px; border:1.5px dashed #e2e8f0; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#a0aec0; overflow:hidden; }
.pro-img-preview img { width:100%; height:100%; object-fit:cover; }
.pro-toggle-row { display:flex; gap:8px; }
.pro-toggle { flex:1; padding:10px; border:2px solid #e2e8f0; border-radius:8px; cursor:pointer; font-family:inherit; font-size:.86rem; font-weight:600; display:flex; align-items:center; justify-content:center; gap:5px; background:#f8fafc; transition:all .2s; }
.pro-toggle.on  { border-color:#38a169; background:#c6f6d5; color:#276749; }
.pro-toggle.off { border-color:#e53e3e; background:#fed7d7; color:#9b2c2c; }
.pro-mfoot { padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; gap:10px; justify-content:flex-end; position:sticky; bottom:0; background:white; border-radius:0 0 16px 16px; }
.pro-err { background:#fff5f5; border:1px solid #fc8181; color:#9b2c2c; padding:10px 14px; border-radius:8px; font-size:.86rem; }
.pro-toast { position:fixed; bottom:24px; right:24px; z-index:9999; padding:12px 20px; border-radius:10px; color:white; font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,.2); animation:proIn .3s ease; }
.pro-toast.ok  { background:#276749; }
.pro-toast.err { background:#9b2c2c; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

export default function Productos() {
  const [products, setProducts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading,  setLoading]        = useState(true);
  const [saving,   setSaving]         = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [editing,  setEditing]        = useState(null);
  const [form,     setForm]           = useState(EMPTY);
  const [formErr,  setFormErr]        = useState("");
  const [search,   setSearch]         = useState("");
  const [catFilter,   setCat]         = useState("all");
  const [brandFilter, setBrand]       = useState("all");
  const [statusFilter, setStatus]     = useState("all");
  const [toast,    setToast]          = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let f = [...products];
    if (search)                f = f.filter(p => `${p.nombre} ${p.marca} ${p.descripcion}`.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== "all")   f = f.filter(p => p.categoria === catFilter);
    if (brandFilter !== "all") f = f.filter(p => p.marca === brandFilter);
    if (statusFilter === "active")   f = f.filter(p => p.activo === 1);
    if (statusFilter === "inactive") f = f.filter(p => p.activo === 0);
    setFiltered(f);
  }, [products, search, catFilter, brandFilter, statusFilter]);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, { headers: hdrs() });
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormErr(""); setShowModal(true); };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ nombre: p.nombre||"", marca: p.marca||"", descripcion: p.descripcion||"", precio: p.precio||"", categoria: p.categoria||"", imagen: p.imagen||"", activo: p.activo??1 });
    setFormErr(""); setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setFormErr(""); };
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.nombre.trim()) { setFormErr("El nombre es obligatorio"); return; }
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) < 0) { setFormErr("Ingresa un precio válido"); return; }
    setFormErr(""); setSaving(true);
    try {
      const url    = editing ? `${API_URL}/api/admin/products/${editing.id}` : `${API_URL}/api/admin/products`;
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: hdrs(), body: JSON.stringify({ ...form, precio: Number(form.precio) }) });
      const data   = await res.json();
      if (res.ok) { showToast(editing ? "Producto actualizado" : "Producto creado"); closeModal(); fetchProducts(); }
      else { setFormErr(data.error || "Error al guardar el producto"); }
    } catch { setFormErr("Error de conexión. Intenta de nuevo."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Desactivar "${nombre}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, { method: "DELETE", headers: hdrs() });
      if (res.ok) { showToast("Producto desactivado"); fetchProducts(); }
      else { const d = await res.json(); showToast(d.error || "Error", "err"); }
    } catch { showToast("Error de conexión", "err"); }
  };

  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];
  const brands     = [...new Set(products.map(p => p.marca).filter(Boolean))];

  return (
    <div className="pro">
      <style>{CSS}</style>

      <div className="page-header">
        <h2>Productos</h2>
        <p>Gestiona tu catálogo de productos</p>
      </div>

      <div className="pro-toolbar">
        <div className="pro-left">
          <div className="pro-search">
            <MdSearch className="pro-search-ico" size={18} />
            <input placeholder="Buscar nombre, marca…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="pro-sel" value={catFilter} onChange={e => setCat(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="pro-sel" value={brandFilter} onChange={e => setBrand(e.target.value)}>
            <option value="all">Todas las marcas</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="pro-sel" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="pro-btn pro-btn-ghost" onClick={fetchProducts}>
            <MdRefresh size={18} className={loading ? "spinning" : ""} />
          </button>
          <button className="pro-btn pro-btn-primary" onClick={openCreate}>
            <MdAdd size={18} /> Nuevo producto
          </button>
        </div>
      </div>

      <div className="pro-table-wrap">
        {loading ? (
          <div className="pro-empty">Cargando productos…</div>
        ) : filtered.length === 0 ? (
          <div className="pro-empty">
            <MdInventory size={40} style={{ display:"block", margin:"0 auto 12px", color:"#cbd5e0" }} />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <>
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre / Marca</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.imagen || "https://placehold.co/46x46/edf2f7/a0aec0?text=📦"}
                        alt={p.nombre} className="pro-img"
                        onError={e => { e.target.src = "https://placehold.co/46x46/edf2f7/a0aec0?text=📦"; }}
                      />
                    </td>
                    <td>
                      <div className="pro-name">{p.nombre}</div>
                      {p.marca && <div className="pro-brand">{p.marca}</div>}
                      {p.descripcion && <div className="pro-desc">{p.descripcion.substring(0,55)}{p.descripcion.length > 55 ? "…" : ""}</div>}
                    </td>
                    <td><span className="pro-tag">{p.categoria || "—"}</span></td>
                    <td><span className="pro-price">{fmt(p.precio)}</span></td>
                    <td>
                      <span className={`pro-status ${p.activo ? "pro-status-on" : "pro-status-off"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="pro-actions">
                        <button className="pro-act pro-act-edit" onClick={() => openEdit(p)}>
                          <MdEdit size={14} /> Editar
                        </button>
                        <button className="pro-act pro-act-delete" onClick={() => handleDelete(p.id, p.nombre)}>
                          <MdDelete size={14} /> {p.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pro-foot">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</div>
          </>
        )}
      </div>

      {showModal && (
        <div className="pro-overlay" onClick={e => { if (e.target.classList.contains("pro-overlay")) closeModal(); }}>
          <div className="pro-modal">
            <div className="pro-mhead">
              <h3>{editing ? `Editar: ${editing.nombre}` : "Nuevo producto"}</h3>
              <button className="pro-mclose" onClick={closeModal}><MdClose /></button>
            </div>

            <div className="pro-mbody">
              {formErr && <div className="pro-err">⚠ {formErr}</div>}

              <div className="pro-img-preview">
                {form.imagen
                  ? <img src={form.imagen} alt="preview" onError={e => { e.target.style.display="none"; }} />
                  : <span style={{ fontSize:"2rem" }}>🖼</span>}
              </div>

              <div className="pro-row">
                <div className="pro-field">
                  <label>Nombre *</label>
                  <input placeholder="Ej. Air Max 270" value={form.nombre} onChange={set("nombre")} />
                </div>
                <div className="pro-field">
                  <label>Marca</label>
                  <input placeholder="Ej. Nike" value={form.marca} onChange={set("marca")} list="brand-list" />
                  <datalist id="brand-list">{brands.map(b => <option key={b} value={b} />)}</datalist>
                </div>
              </div>

              <div className="pro-field">
                <label>Descripción</label>
                <textarea placeholder="Descripción del producto…" value={form.descripcion} onChange={set("descripcion")} />
              </div>

              <div className="pro-row">
                <div className="pro-field">
                  <label>Precio (MXN) *</label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={form.precio} onChange={set("precio")} />
                </div>
                <div className="pro-field">
                  <label>Categoría</label>
                  <input placeholder="Ej. Calzado" value={form.categoria} onChange={set("categoria")} list="cat-list" />
                  <datalist id="cat-list">{categories.map(c => <option key={c} value={c} />)}</datalist>
                </div>
              </div>

              <div className="pro-field">
                <label>URL de imagen</label>
                <input placeholder="https://…" value={form.imagen} onChange={set("imagen")} />
              </div>

              <div className="pro-field">
                <label>Estado</label>
                <div className="pro-toggle-row">
                  <button className={`pro-toggle ${form.activo === 1 ? "on" : ""}`} onClick={() => setForm(f => ({ ...f, activo: 1 }))}>
                    <MdCheckCircle size={16} /> Activo
                  </button>
                  <button className={`pro-toggle ${form.activo === 0 ? "off" : ""}`} onClick={() => setForm(f => ({ ...f, activo: 0 }))}>
                    <MdClose size={16} /> Inactivo
                  </button>
                </div>
              </div>
            </div>

            <div className="pro-mfoot">
              <button className="pro-btn pro-btn-ghost" onClick={closeModal} disabled={saving}>Cancelar</button>
              <button className="pro-btn pro-btn-primary" onClick={handleSave} disabled={saving}>
                {saving
                  ? <><MdRefresh size={16} className="spinning" /> Guardando…</>
                  : <><MdCheckCircle size={16} /> {editing ? "Guardar cambios" : "Crear producto"}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`pro-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}