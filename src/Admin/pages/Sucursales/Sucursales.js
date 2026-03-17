import React, { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdStore,
  MdPhone, MdLocationOn, MdTrendingUp, MdInventory,
  MdWarning, MdClose, MdAttachMoney, MdShoppingCart, MdPeople,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth  = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt   = n => Number(n||0).toLocaleString("es-MX");
const fmtMXN = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.suc * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

.suc-toolbar {
  background:white; padding:18px 22px; border-radius:12px; margin-bottom:22px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:14px; flex-wrap:wrap;
  align-items:center; justify-content:space-between;
}
.suc-search { position:relative; flex:1; min-width:200px; max-width:340px; }
.suc-search input {
  width:100%; padding:9px 10px 9px 38px; border:1px solid #e2e8f0;
  border-radius:8px; font-size:.88rem; font-family:inherit;
}
.suc-search input:focus { outline:none; border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.1); }
.suc-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#a0aec0; }

.suc-btn-primary {
  background:#1e3a5f; color:white; border:none; padding:9px 18px;
  border-radius:8px; font-weight:600; display:flex; align-items:center;
  gap:7px; cursor:pointer; font-family:inherit; font-size:.88rem; transition:all .2s;
}
.suc-btn-primary:hover { background:#2c5282; }
.suc-btn-icon {
  background:#f7fafc; color:#2d3748; border:1px solid #e2e8f0;
  padding:9px 11px; border-radius:8px; cursor:pointer; display:flex; align-items:center;
}
.suc-btn-icon:hover { background:#edf2f7; }

/* Grid de cards */
.suc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px; }

/* Card */
.suc-card {
  background:white; border-radius:14px; padding:22px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); border:1px solid #f0f4f8;
  position:relative; overflow:hidden; transition:all .2s; cursor:pointer;
}
.suc-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.1); border-color:#bee3f8; }
.suc-card.selected { border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.15); }
.suc-card-accent { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#2b6cb0,#553c9a); }

.suc-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
.suc-card-icon {
  width:46px; height:46px; border-radius:12px;
  background:#ebf8ff; display:flex; align-items:center; justify-content:center;
  color:#2b6cb0; font-size:1.4rem;
}
.suc-card-actions { display:flex; gap:6px; }
.suc-btn-edit { background:#bee3f8; color:#2c5282; border:none; padding:6px 9px; border-radius:6px; cursor:pointer; display:flex; align-items:center; }
.suc-btn-edit:hover { background:#90cdf4; }
.suc-btn-del  { background:#fed7d7; color:#9b2c2c; border:none; padding:6px 9px; border-radius:6px; cursor:pointer; display:flex; align-items:center; }
.suc-btn-del:hover  { background:#fc8181; }

.suc-card-name { font-size:1.15rem; font-weight:700; color:#1e3a5f; margin-bottom:10px; }
.suc-card-info { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.suc-card-row  { display:flex; align-items:center; gap:7px; font-size:.83rem; color:#4a5568; }
.suc-card-row svg { color:#2b6cb0; flex-shrink:0; }

.suc-card-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-top:1px solid #f0f4f8; padding-top:12px; }
.suc-stat { display:flex; flex-direction:column; align-items:center; padding:4px 0; }
.suc-stat + .suc-stat { border-left:1px solid #f0f4f8; }
.suc-stat-val { font-family:'JetBrains Mono',monospace; font-size:1.1rem; font-weight:700; color:#1e3a5f; }
.suc-stat-lbl { font-size:.7rem; color:#a0aec0; text-align:center; }

.suc-badge-active   { background:#c6f6d5; color:#276749; padding:2px 9px; border-radius:20px; font-size:.74rem; font-weight:700; }
.suc-badge-inactive { background:#fed7d7; color:#9b2c2c; padding:2px 9px; border-radius:20px; font-size:.74rem; font-weight:700; }

/* Panel de detalle */
.suc-detail {
  background:white; border-radius:14px; padding:0;
  box-shadow:0 2px 8px rgba(0,0,0,.05); margin-top:22px; overflow:hidden;
}
.suc-detail-head {
  background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%);
  padding:22px 26px; display:flex; align-items:center; justify-content:space-between;
}
.suc-detail-head h3 { margin:0; color:white; font-size:1.2rem; display:flex; align-items:center; gap:10px; }
.suc-detail-close { background:rgba(255,255,255,.15); border:none; color:white; padding:7px; border-radius:8px; cursor:pointer; display:flex; align-items:center; }
.suc-detail-close:hover { background:rgba(255,255,255,.25); }

.suc-detail-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border-bottom:1px solid #f0f4f8; }
.suc-dkpi { padding:20px 22px; border-right:1px solid #f0f4f8; }
.suc-dkpi:last-child { border-right:none; }
.suc-dkpi-lbl { font-size:.72rem; font-weight:700; color:#718096; text-transform:uppercase; letter-spacing:.4px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
.suc-dkpi-lbl svg { color:#2b6cb0; }
.suc-dkpi-val { font-family:'JetBrains Mono',monospace; font-size:1.5rem; font-weight:700; color:#1e3a5f; }
.suc-dkpi-sub { font-size:.74rem; color:#a0aec0; margin-top:3px; }

.suc-detail-body { display:grid; grid-template-columns:1fr 1fr; gap:0; }
.suc-detail-col { padding:22px 26px; }
.suc-detail-col + .suc-detail-col { border-left:1px solid #f0f4f8; }
.suc-detail-col h4 { margin:0 0 14px; font-size:.85rem; font-weight:700; color:#1e3a5f; display:flex; align-items:center; gap:7px; }
.suc-detail-col h4 svg { color:#2b6cb0; }

/* Listas del detalle */
.suc-det-list { display:flex; flex-direction:column; gap:8px; }
.suc-det-row  {
  display:flex; align-items:center; justify-content:space-between;
  padding:9px 12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;
}
.suc-det-name { font-size:.83rem; color:#2d3748; font-weight:500; }
.suc-det-val  { font-family:'JetBrains Mono',monospace; font-size:.82rem; color:#2b6cb0; font-weight:700; }

/* Stock bajo */
.suc-low-row  {
  display:flex; align-items:center; justify-content:space-between;
  padding:9px 12px; border-radius:8px; border:1px solid #fef5e7; background:#fffbeb;
}
.suc-low-name { font-size:.83rem; color:#744210; font-weight:500; }
.suc-low-val  { font-family:'JetBrains Mono',monospace; font-size:.82rem; color:#975a16; font-weight:700; }
.suc-stock-zero { border-color:#fed7d7 !important; background:#fff5f5 !important; }
.suc-stock-zero .suc-low-name { color:#9b2c2c !important; }
.suc-stock-zero .suc-low-val  { color:#c53030 !important; }

/* Inventario progreso */
.inv-bar { height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; margin-top:3px; }
.inv-bar-fill { height:100%; border-radius:3px; transition:width .4s; }

/* Modal */
.suc-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:2000; padding:20px; }
.suc-modal { background:white; border-radius:16px; width:100%; max-width:480px; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.suc-modal-head { padding:22px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
.suc-modal-head h3 { margin:0; color:#1e3a5f; font-size:1.2rem; }
.suc-modal-body { padding:22px 24px; display:flex; flex-direction:column; gap:14px; }
.suc-fg { display:flex; flex-direction:column; gap:5px; }
.suc-fg label { font-weight:600; font-size:.88rem; color:#2d3748; }
.suc-fg input, .suc-fg select { padding:10px 13px; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; font-family:inherit; }
.suc-fg input:focus, .suc-fg select:focus { outline:none; border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.1); }
.suc-modal-foot { padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; gap:10px; justify-content:flex-end; }
.suc-btn-cancel { padding:9px 18px; border:1px solid #e2e8f0; background:white; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:600; color:#4a5568; }
.suc-btn-save   { padding:9px 20px; background:#1e3a5f; color:white; border:none; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:600; }
.suc-btn-save:hover { background:#2c5282; }

.suc-empty { padding:60px; text-align:center; color:#a0aec0; background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

@media(max-width:900px) {
  .suc-detail-kpis { grid-template-columns:1fr 1fr; }
  .suc-detail-body  { grid-template-columns:1fr; }
  .suc-detail-col + .suc-detail-col { border-left:none; border-top:1px solid #f0f4f8; }
}
@media(max-width:640px) {
  .suc-detail-kpis { grid-template-columns:1fr 1fr; }
}
`;

const emptyForm = { nombre:"", direccion:"", telefono:"", activo:1 };

export default function Sucursales() {
  const [branches,   setBranches]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [selected,   setSelected]   = useState(null);   // sucursal seleccionada
  const [detail,     setDetail]     = useState(null);   // datos del detalle
  const [detLoading, setDetLoading] = useState(false);

  useEffect(() => { fetchBranches(); }, []);
  useEffect(() => {
    if (!search) { setFiltered(branches); return; }
    setFiltered(branches.filter(b =>
      b.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      b.direccion?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [branches, search]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/admin/branches`, {headers:auth()});
      if (r.ok) setBranches(await r.json());
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchDetail = async (b) => {
    setSelected(b); setDetail(null); setDetLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/admin/reports/branch-detail/${b.id}`, {headers:auth()});
      if (r.ok) setDetail(await r.json());
    } catch(e) { console.error(e); }
    finally { setDetLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const url    = editing ? `${API_URL}/api/admin/branches/${editing.id}` : `${API_URL}/api/admin/branches`;
      const method = editing ? "PUT" : "POST";
      const r = await fetch(url, {
        method, headers: {"Content-Type":"application/json",...auth()},
        body: JSON.stringify(form),
      });
      if (r.ok) { setShowModal(false); setEditing(null); setForm(emptyForm); fetchBranches(); }
      else { const e=await r.json(); alert(e.error||"Error al guardar"); }
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar esta sucursal?")) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/branches/${id}`, {method:"DELETE",headers:auth()});
      if (r.ok) { fetchBranches(); if (selected?.id===id) { setSelected(null); setDetail(null); } }
      else { const e=await r.json(); alert(e.error||"Error al eliminar"); }
    } catch(e) { console.error(e); }
  };

  const openEdit = (b,ev) => { ev.stopPropagation(); setEditing(b); setForm({nombre:b.nombre,direccion:b.direccion,telefono:b.telefono||"",activo:b.activo}); setShowModal(true); };

  return (
    <div className="suc">
      <style>{S}</style>

      <div className="page-header">
        <h2>Sucursales</h2>
        <p>Administra tus ubicaciones y consulta su rendimiento</p>
      </div>

      {/* Toolbar */}
      <div className="suc-toolbar">
        <div className="suc-search">
          <MdSearch className="suc-search-icon" size={18}/>
          <input placeholder="Buscar sucursal..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="suc-btn-icon" onClick={fetchBranches}><MdRefresh size={20}/></button>
          <button className="suc-btn-primary" onClick={()=>{setEditing(null);setForm(emptyForm);setShowModal(true);}}>
            <MdAdd/> Nueva Sucursal
          </button>
        </div>
      </div>

      {/* Grid de cards */}
      {loading ? (
        <div className="suc-empty">Cargando sucursales...</div>
      ) : filtered.length === 0 ? (
        <div className="suc-empty"><MdStore size={48} style={{marginBottom:12}}/><div>No se encontraron sucursales</div></div>
      ) : (
        <div className="suc-grid">
          {filtered.map(b => (
            <div
              key={b.id}
              className={`suc-card ${selected?.id===b.id?"selected":""}`}
              onClick={() => selected?.id===b.id ? (setSelected(null),setDetail(null)) : fetchDetail(b)}
            >
              <div className="suc-card-accent"/>
              <div className="suc-card-top">
                <div className="suc-card-icon"><MdStore/></div>
                <div className="suc-card-actions">
                  <span className={b.activo?"suc-badge-active":"suc-badge-inactive"}>{b.activo?"Activa":"Inactiva"}</span>
                  <button className="suc-btn-edit" onClick={e=>openEdit(b,e)}><MdEdit size={15}/></button>
                  <button className="suc-btn-del"  onClick={e=>{e.stopPropagation();handleDelete(b.id)}}><MdDelete size={15}/></button>
                </div>
              </div>
              <div className="suc-card-name">{b.nombre}</div>
              <div className="suc-card-info">
                <div className="suc-card-row"><MdLocationOn size={15}/>{b.direccion}</div>
                {b.telefono && <div className="suc-card-row"><MdPhone size={15}/>{b.telefono}</div>}
              </div>
              <div className="suc-card-stats">
                <div className="suc-stat">
                  <span className="suc-stat-val">{fmt(b.productos)}</span>
                  <span className="suc-stat-lbl">Productos</span>
                </div>
                <div className="suc-stat">
                  <span className="suc-stat-val">{fmt(b.stock_total)}</span>
                  <span className="suc-stat-lbl">Unidades</span>
                </div>
                <div className="suc-stat">
                  <span className="suc-stat-val" style={{color:"#276749",fontSize:".95rem"}}>{fmtMXN(b.valor_inventario||0)}</span>
                  <span className="suc-stat-lbl">Valor inv.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel de detalle */}
      {selected && (
        <div className="suc-detail">
          <div className="suc-detail-head">
            <h3><MdStore size={20}/>{selected.nombre} — Detalle</h3>
            <button className="suc-detail-close" onClick={()=>{setSelected(null);setDetail(null);}}>
              <MdClose size={18}/>
            </button>
          </div>

          {detLoading && (
            <div style={{padding:"40px",textAlign:"center",color:"#718096"}}>
              <MdRefresh size={22} className="spinning"/> Cargando detalle...
            </div>
          )}

          {!detLoading && detail && (
            <>
              {/* KPIs del mes */}
              <div className="suc-detail-kpis">
                {[
                  {lbl:"Ingresos (30d)", val:fmtMXN(detail.sales?.ingresos_mes), sub:"últimos 30 días", icon:<MdAttachMoney size={14}/>},
                  {lbl:"Pedidos (30d)",  val:fmt(detail.sales?.pedidos_mes),      sub:`ticket prom. ${fmtMXN(detail.sales?.ticket_promedio)}`, icon:<MdShoppingCart size={14}/>},
                  {lbl:"Clientes únicos",val:fmt(detail.sales?.clientes_unicos),  sub:"compraron en 30d", icon:<MdPeople size={14}/>},
                  {lbl:"Valor inventario",val:fmtMXN(detail.branch?.valor_inventario), sub:`${fmt(detail.branch?.productos)} productos`, icon:<MdInventory size={14}/>},
                ].map(k=>(
                  <div key={k.lbl} className="suc-dkpi">
                    <div className="suc-dkpi-lbl">{k.icon}{k.lbl}</div>
                    <div className="suc-dkpi-val">{k.val}</div>
                    <div className="suc-dkpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Barras de inventario */}
              <div style={{padding:"16px 26px",borderBottom:"1px solid #f0f4f8",display:"flex",gap:24,flexWrap:"wrap"}}>
                {[
                  {lbl:"Stock disponible", val:detail.branch?.productos - (detail.branch?.bajo_stock||0) - (detail.branch?.sin_stock||0), total:detail.branch?.productos, color:"#276749"},
                  {lbl:"Bajo stock",       val:detail.branch?.bajo_stock||0,  total:detail.branch?.productos, color:"#b7791f"},
                  {lbl:"Sin stock",        val:detail.branch?.sin_stock||0,   total:detail.branch?.productos, color:"#9b2c2c"},
                ].map(b=>(
                  <div key={b.lbl} style={{flex:1,minWidth:160}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:".76rem",color:"#718096"}}>{b.lbl}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",fontWeight:700,color:b.color}}>{fmt(b.val)}</span>
                    </div>
                    <div className="inv-bar">
                      <div className="inv-bar-fill" style={{width:`${b.total>0?(b.val/b.total)*100:0}%`,background:b.color}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top productos + bajo stock */}
              <div className="suc-detail-body">
                <div className="suc-detail-col">
                  <h4><MdTrendingUp size={16}/> Top 5 productos (30d)</h4>
                  {detail.topProds?.length > 0 ? (
                    <div className="suc-det-list">
                      {detail.topProds.map((p,i)=>(
                        <div key={i} className="suc-det-row">
                          <div>
                            <div className="suc-det-name">{p.nombre}</div>
                            <div style={{fontSize:".72rem",color:"#a0aec0"}}>{p.categoria||"—"}</div>
                          </div>
                          <span className="suc-det-val">{fmt(p.vendidos)} uds.</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{color:"#a0aec0",fontSize:".82rem",padding:"20px 0",textAlign:"center"}}>Sin ventas en los últimos 30 días</div>
                  )}
                </div>

                <div className="suc-detail-col">
                  <h4><MdWarning size={16} style={{color:"#d69e2e"}}/> Productos con stock bajo</h4>
                  {detail.lowStock?.length > 0 ? (
                    <div className="suc-det-list">
                      {detail.lowStock.map((p,i)=>(
                        <div key={i} className={`suc-low-row ${p.stock===0?"suc-stock-zero":""}`}>
                          <div>
                            <div className="suc-low-name">{p.nombre}</div>
                            <div style={{fontSize:".72rem",color:"#a0aec0"}}>{p.categoria||"—"} · mín: {p.min_stock}</div>
                          </div>
                          <span className="suc-low-val">{p.stock===0?"Sin stock":`${p.stock} uds.`}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{color:"#276749",fontSize:".82rem",padding:"20px 0",textAlign:"center",background:"#f0fff4",borderRadius:8,border:"1px solid #9ae6b4"}}>
                      ✓ Todos los productos tienen stock suficiente
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="suc-overlay" onClick={()=>setShowModal(false)}>
          <div className="suc-modal" onClick={e=>e.stopPropagation()}>
            <div className="suc-modal-head">
              <h3>{editing?"Editar":"Nueva"} Sucursal</h3>
              <button className="suc-detail-close" onClick={()=>setShowModal(false)} style={{background:"#f7fafc",color:"#4a5568"}}><MdClose size={18}/></button>
            </div>
            <div className="suc-modal-body">
              <div className="suc-fg">
                <label>Nombre *</label>
                <input type="text" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Ej: Sucursal Centro"/>
              </div>
              <div className="suc-fg">
                <label>Dirección *</label>
                <input type="text" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} placeholder="Calle, número, colonia"/>
              </div>
              <div className="suc-fg">
                <label>Teléfono</label>
                <input type="text" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} placeholder="Ej: 33 1234 5678"/>
              </div>
              {editing && (
                <div className="suc-fg">
                  <label>Estado</label>
                  <select value={form.activo} onChange={e=>setForm({...form,activo:Number(e.target.value)})}>
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
                  </select>
                </div>
              )}
            </div>
            <div className="suc-modal-foot">
              <button className="suc-btn-cancel" onClick={()=>setShowModal(false)}>Cancelar</button>
              <button className="suc-btn-save" onClick={handleSubmit}>{editing?"Actualizar":"Crear"} Sucursal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}