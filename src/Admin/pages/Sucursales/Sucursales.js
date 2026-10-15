import { API_BASE_URL } from "../../../config/api";
import React, { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdStore,
  MdPhone, MdLocationOn, MdTrendingUp, MdInventory,
  MdWarning, MdClose, MdAttachMoney, MdShoppingCart, MdPeople,
} from "react-icons/md";
import { useNotificaciones } from "../../useNotificaciones";

const API_URL = API_BASE_URL;
const auth    = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt     = n => Number(n||0).toLocaleString("es-MX");
const fmtMXN  = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);

import S from "./Sucursales.styles";

const emptyForm = { nombre:"", direccion:"", telefono:"", activo:1 };

export default function Sucursales() {
  const { notifs, count: notifCount, markAllRead } = useNotificaciones();

  const [branches,   setBranches]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [selected,   setSelected]   = useState(null);
  const [focusBranch,setFocusBranch]= useState(null);
  const [detail,     setDetail]     = useState(null);
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

  const handleCardClick = (b) => {
    setFocusBranch(b.id);
    if (selected?.id !== b.id) fetchDetail(b);
    else { setSelected(null); setDetail(null); }
  };

  const handleBack = () => {
    setFocusBranch(null);
    setSelected(null);
    setDetail(null);
  };

  const handleSubmit = async () => {
    try {
      const url    = editing ? `${API_URL}/api/admin/branches/${editing.id}` : `${API_URL}/api/admin/branches`;
      const method = editing ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: {"Content-Type":"application/json",...auth()},
        body: JSON.stringify(form),
      });
      if (r.ok) { setShowModal(false); setEditing(null); setForm(emptyForm); fetchBranches(); }
      else { const e=await r.json(); alert(e.error||"Error al guardar"); }
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id, ev) => {
    ev.stopPropagation();
    if (!confirm("¿Desactivar esta sucursal?")) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/branches/${id}`, {method:"DELETE",headers:auth()});
      if (r.ok) {
        fetchBranches();
        if (selected?.id === id) handleBack();
      } else {
        const e = await r.json();
        alert(e.error||"Error al eliminar");
      }
    } catch(e) { console.error(e); }
  };

  const openEdit = (b, ev) => {
    ev.stopPropagation();
    setEditing(b);
    setForm({nombre:b.nombre,direccion:b.direccion,telefono:b.telefono||"",activo:b.activo});
    setShowModal(true);
  };

  const displayList = focusBranch
    ? filtered.filter(b => b.id === focusBranch)
    : filtered;

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

      {/* Banner notificaciones */}
      {notifCount > 0 && (
        <div style={{
          background:"#1e3a5f",color:"white",borderRadius:12,
          padding:"14px 20px",marginBottom:18,display:"flex",
          alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:"1.4rem"}}>🔔</span>
            <div>
              <div style={{fontWeight:700,fontSize:".9rem"}}>
                {notifCount} pedido{notifCount!==1?"s":""} nuevo{notifCount!==1?"s":""} recibido{notifCount!==1?"s":""}
              </div>
              <div style={{fontSize:".76rem",opacity:.75}}>
                {notifs.slice(0,3).map(n => n.sucursal_nombre || `Suc.${n.sucursal}`).join(" · ")}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {notifs.slice(0,3).map(n => (
              <button key={n.id}
                onClick={()=>{
                  const b = branches.find(x=>x.nombre===n.sucursal_nombre) || {id:n.sucursal,nombre:n.sucursal_nombre};
                  setFocusBranch(b.id);
                  fetchDetail(b);
                }}
                style={{
                  background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",
                  color:"white",borderRadius:8,padding:"6px 14px",fontSize:".78rem",
                  fontWeight:600,cursor:"pointer",fontFamily:"inherit"
                }}
              >
                Ver {n.sucursal_nombre||"Sucursal"}
              </button>
            ))}
            <button onClick={markAllRead} style={{
              background:"none",border:"1px solid rgba(255,255,255,.3)",
              color:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 12px",
              fontSize:".76rem",cursor:"pointer",fontFamily:"inherit"
            }}>
              ✓ Marcar leídos
            </button>
          </div>
        </div>
      )}

      {/* Botón volver cuando hay focus */}
      {focusBranch && (
        <button onClick={handleBack} style={{
          display:"flex",alignItems:"center",gap:8,background:"white",
          border:"1.5px solid #e2e8f0",borderRadius:10,padding:"9px 18px",
          fontSize:".85rem",fontWeight:600,color:"#2b6cb0",cursor:"pointer",
          marginBottom:16,fontFamily:"'DM Sans',sans-serif",
          boxShadow:"0 1px 4px rgba(0,0,0,.05)"
        }}>
          ← Volver a todas las sucursales
        </button>
      )}

      {/* Grid de cards */}
      {loading ? (
        <div className="suc-empty">Cargando sucursales...</div>
      ) : displayList.length === 0 ? (
        <div className="suc-empty">
          <MdStore size={48} style={{marginBottom:12}}/>
          <div>No se encontraron sucursales</div>
        </div>
      ) : (
        <div className="suc-grid">
          {displayList.map(b => (
            <div
              key={b.id}
              className={`suc-card ${selected?.id===b.id?"selected":""}`}
              onClick={() => handleCardClick(b)}
            >
              <div className="suc-card-accent"/>
              <div className="suc-card-top">
                <div className="suc-card-icon"><MdStore/></div>
                <div className="suc-card-actions">
                  <span className={b.activo?"suc-badge-active":"suc-badge-inactive"}>
                    {b.activo?"Activa":"Inactiva"}
                  </span>
                  <button className="suc-btn-edit" onClick={e=>openEdit(b,e)}><MdEdit size={15}/></button>
                  <button className="suc-btn-del"  onClick={e=>handleDelete(b.id,e)}><MdDelete size={15}/></button>
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
                  <span className="suc-stat-val" style={{color:"#276749",fontSize:".95rem"}}>
                    {fmtMXN(b.valor_inventario||0)}
                  </span>
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
            <button className="suc-detail-close" onClick={handleBack}>
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
                  {lbl:"Ingresos (30d)",  val:fmtMXN(detail.sales?.ingresos_mes),        sub:"últimos 30 días",                     icon:<MdAttachMoney size={14}/>},
                  {lbl:"Pedidos (30d)",   val:fmt(detail.sales?.pedidos_mes),             sub:`ticket prom. ${fmtMXN(detail.sales?.ticket_promedio)}`, icon:<MdShoppingCart size={14}/>},
                  {lbl:"Clientes únicos", val:fmt(detail.sales?.clientes_unicos),         sub:"compraron en 30d",                    icon:<MdPeople size={14}/>},
                  {lbl:"Valor inventario",val:fmtMXN(detail.branch?.valor_inventario),   sub:`${fmt(detail.branch?.productos)} productos`, icon:<MdInventory size={14}/>},
                ].map(k => (
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
                  {lbl:"Disponible", val:(detail.branch?.productos||0)-(detail.branch?.bajo_stock||0)-(detail.branch?.sin_stock||0), color:"#276749"},
                  {lbl:"Bajo stock", val:detail.branch?.bajo_stock||0, color:"#b7791f"},
                  {lbl:"Sin stock",  val:detail.branch?.sin_stock||0,  color:"#9b2c2c"},
                ].map(b => (
                  <div key={b.lbl} style={{flex:1,minWidth:160}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:".76rem",color:"#718096"}}>{b.lbl}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",fontWeight:700,color:b.color}}>{fmt(b.val)}</span>
                    </div>
                    <div className="inv-bar">
                      <div className="inv-bar-fill" style={{
                        width:`${(detail.branch?.productos||0)>0?(b.val/(detail.branch?.productos||1))*100:0}%`,
                        background:b.color
                      }}/>
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
                      {detail.topProds.map((p,i) => (
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
                    <div style={{color:"#a0aec0",fontSize:".82rem",padding:"20px 0",textAlign:"center"}}>
                      Sin ventas en los últimos 30 días
                    </div>
                  )}
                </div>

                <div className="suc-detail-col">
                  <h4><MdWarning size={16} style={{color:"#d69e2e"}}/> Productos con stock bajo</h4>
                  {detail.lowStock?.length > 0 ? (
                    <div className="suc-det-list">
                      {detail.lowStock.map((p,i) => (
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
              <button className="suc-detail-close" onClick={()=>setShowModal(false)} style={{background:"#f7fafc",color:"#4a5568"}}>
                <MdClose size={18}/>
              </button>
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
