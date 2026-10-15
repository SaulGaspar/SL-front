import { API_BASE_URL } from "../../../config/api";
import React, { useState, useEffect, useCallback } from "react";
import {
  MdSearch, MdRefresh, MdVisibility, MdAccessTime, MdLocalShipping,
  MdCheckCircle, MdCancel, MdSync, MdClose, MdShoppingBag, MdReceipt, MdEdit,
} from "react-icons/md";

const API = `${API_BASE_URL}/api/admin`;
const token = () => localStorage.getItem("token");
const apiFetch = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", ...opts.headers },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

const fmt     = v => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(v||0);
const fmtDate = d => d ? new Date(d).toLocaleString("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";

const STATUS = {
  pendiente:  { color:"#b45309", bg:"#fef3c7", label:"Pendiente",  icon:<MdAccessTime/>   },
  preparando: { color:"#1d4ed8", bg:"#dbeafe", label:"Preparando", icon:<MdSync/>          },
  en_camino:  { color:"#0e7490", bg:"#cffafe", label:"En camino",  icon:<MdLocalShipping/> },
  entregado:  { color:"#15803d", bg:"#dcfce7", label:"Entregado",  icon:<MdCheckCircle/>  },
  cancelado:  { color:"#b91c1c", bg:"#fee2e2", label:"Cancelado",  icon:<MdCancel/>        },
};
const STATUS_KEYS = Object.keys(STATUS);

import CSS from "./Pedidos.styles";

export default function Pedidos() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [savingId,      setSavingId]      = useState(null);
  const [filters,       setFilters]       = useState({ search:"", status:"all", from:"", to:"" });
  const [stats,         setStats]         = useState(null);
  const [detail,        setDetail]        = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const setStatusFilter = s => setFilters(f => ({...f, status: f.status===s ? "all" : s}));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filters.status !== "all") p.append("status", filters.status);
      if (filters.from) p.append("from", filters.from);
      if (filters.to)   p.append("to",   filters.to);
      const data = await apiFetch(`${API}/orders?${p}`);
      setOrders(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters.status, filters.from, filters.to]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      const data = await apiFetch(`${API}/orders/stats/summary?${params}`);
      setStats(data.resumen || null);
    } catch(e) {}
  }, [filters.from, filters.to]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchStats();  }, [fetchStats]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setDetail({ order:null, items:[] });
    try {
      const data = await apiFetch(`${API}/orders/${id}`);
      setDetail(data);
    } catch(e) { setDetail(null); }
    finally { setDetailLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    setSavingId(newStatus);
    try {
      await apiFetch(`${API}/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o.id===id ? {...o, status:newStatus} : o));
      if (detail?.order?.id === id)
        setDetail(d => ({...d, order:{...d.order, status:newStatus}}));
      fetchStats();
      showToast(`Estado actualizado: ${STATUS[newStatus]?.label}`, "ok");
    } catch(e) {
      showToast("No se pudo actualizar el estado", "err");
    } finally {
      setSavingId(null);
    }
  };

  const search   = filters.search.toLowerCase();
  const filtered = orders.filter(o => {
    if (!search) return true;
    return String(o.id).includes(search) ||
      (o.nombre||"").toLowerCase().includes(search) ||
      (o.apellidoP||"").toLowerCase().includes(search) ||
      (o.correo||"").toLowerCase().includes(search);
  });

  const keyMap = { entregado:"entregadas", en_camino:"en_camino", preparando:"preparando", pendiente:"pendientes", cancelado:"canceladas" };

  return (
    <div className="ped">
      <style>{CSS}</style>

      {toast && <div className={`ped-toast ${toast.type}`}>{toast.type==="ok"?"✓ ":"✕ "}{toast.msg}</div>}

      <div className="page-header">
        <h2>Pedidos</h2>
        <p>Administra los pedidos de tus clientes</p>
      </div>

      <div className="ped-stats">
        <div className="ped-stat" style={{"--sc":"#2c5282"}}>
          <div className="ped-stat-n">{stats?.total_ordenes ?? "—"}</div>
          <div className="ped-stat-l">Total órdenes</div>
        </div>
        <div className="ped-stat" style={{"--sc":"#38a169"}}>
          <div className="ped-stat-n" style={{fontSize:"1.3rem"}}>
            {stats ? new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(stats.ingresos_totales) : "—"}
          </div>
          <div className="ped-stat-l">Ingresos totales</div>
        </div>
        {STATUS_KEYS.map(sk => {
          const cfg=STATUS[sk], count=stats?.[keyMap[sk]]??stats?.[sk]??"—", isActive=filters.status===sk;
          return (
            <div key={sk} className={`ped-stat${isActive?" active":""}`} style={{"--sc":cfg.color}} onClick={()=>setStatusFilter(sk)}>
              <div className="ped-stat-n">{count}</div>
              <div className="ped-stat-l">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      <div className="ped-bar">
        <div className="ped-srch">
          <MdSearch className="ped-srch-ico" size={18}/>
          <input placeholder="Buscar cliente, correo, #orden…" value={filters.search}
            onChange={e=>setFilters({...filters,search:e.target.value})}/>
        </div>
        <select className="ped-sel" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>
          <option value="all">Todos los estados</option>
          {STATUS_KEYS.map(s=><option key={s} value={s}>{STATUS[s].label}</option>)}
        </select>
        <input className="ped-datein" type="date" value={filters.from} onChange={e=>setFilters({...filters,from:e.target.value})}/>
        <input className="ped-datein" type="date" value={filters.to}   onChange={e=>setFilters({...filters,to:e.target.value})}/>
        <button className="ped-btn ped-btn-primary" onClick={fetchOrders}><MdRefresh size={16}/> Actualizar</button>
        {(filters.search||filters.status!=="all"||filters.from||filters.to) && (
          <button className="ped-btn ped-btn-ghost" onClick={()=>setFilters({search:"",status:"all",from:"",to:""})}>
            <MdClose size={14}/> Limpiar
          </button>
        )}
      </div>

      <div className="ped-card">
        {loading ? (
          <div className="ped-spinner"><MdRefresh size={32} className="spinning" style={{color:"#2c5282"}}/></div>
        ) : filtered.length===0 ? (
          <div className="ped-empty">
            <MdShoppingBag size={40} style={{display:"block",margin:"0 auto 12px"}}/>
            <p>No se encontraron pedidos</p>
          </div>
        ) : (
          <>
            <table className="ped-table">
              <thead><tr>
                <th>#Orden</th><th>Cliente</th><th>Sucursal</th>
                <th>Total</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
              </tr></thead>
              <tbody>
                {filtered.map(o => {
                  const sc=STATUS[o.status]||STATUS.pendiente;
                  return (
                    <tr key={o.id}>
                      <td><span className="ped-oid">#{o.id}</span></td>
                      <td>
                        <div className="ped-cliente">{o.nombre} {o.apellidoP}</div>
                        <div className="ped-sub">{o.correo}</div>
                      </td>
                      <td><span style={{fontSize:".85rem",color:"#718096"}}>Sucursal {o.sucursal}</span></td>
                      <td><span className="ped-total">{fmt(o.total)}</span></td>
                      <td><span className="ped-fecha">{fmtDate(o.fecha)}</span></td>
                      <td><span className="ped-badge" style={{background:sc.bg,color:sc.color}}>{sc.icon} {sc.label}</span></td>
                      <td><button className="ped-btn-ver" onClick={()=>openDetail(o.id)}><MdVisibility size={15}/> Ver</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="ped-foot">{filtered.length} pedido{filtered.length!==1?"s":""} encontrados</div>
          </>
        )}
      </div>

      {(detail!==null||detailLoading) && (
        <div className="ped-overlay" onClick={e=>{if(e.target.classList.contains("ped-overlay"))setDetail(null);}}>
          <div className="ped-modal">
            <div className="ped-mhead">
              <h3><MdReceipt style={{marginRight:8,verticalAlign:"middle"}}/>{detail?.order?`Orden #${detail.order.id}`:"Cargando…"}</h3>
              <button className="ped-mclose" onClick={()=>setDetail(null)}><MdClose/></button>
            </div>
            <div className="ped-mbody">
              {detailLoading ? (
                <div className="ped-spinner"><MdRefresh size={28} className="spinning" style={{color:"#2c5282"}}/></div>
              ) : !detail?.order ? (
                <p style={{color:"#e53e3e"}}>No se pudo cargar el detalle</p>
              ) : (
                <>
                  <div className="ped-info-grid">
                    <div className="ped-info-item"><div className="ped-info-lbl">Cliente</div><div className="ped-info-val">{detail.order.nombre} {detail.order.apellidoP}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Correo</div><div className="ped-info-val" style={{fontSize:".82rem"}}>{detail.order.correo}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Fecha</div><div className="ped-info-val">{fmtDate(detail.order.fecha)}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Sucursal</div><div className="ped-info-val">Sucursal {detail.order.sucursal}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Total</div><div className="ped-info-val" style={{color:"#2c5282"}}>{fmt(detail.order.total)}</div></div>
                    <div className="ped-info-item">
                      <div className="ped-info-lbl">Estado</div>
                      <span className="ped-badge" style={{background:STATUS[detail.order.status]?.bg||"#f0f4f8",color:STATUS[detail.order.status]?.color||"#718096"}}>
                        {STATUS[detail.order.status]?.icon} {STATUS[detail.order.status]?.label||detail.order.status}
                      </span>
                    </div>
                  </div>

                  {detail.items?.length>0 && (
                    <>
                      <p className="ped-items-title">Productos ({detail.items.length})</p>
                      {detail.items.map((item,i)=>(
                        <div className="ped-item-row" key={item.id||i}>
                          <div>
                            <div className="ped-item-name">{item.nombre}</div>
                            <div className="ped-item-cat">{item.categoria}</div>
                            <div className="ped-item-qty">Cantidad: {item.cantidad}</div>
                          </div>
                          <div className="ped-item-sub">{fmt(item.subtotal)}</div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="ped-status-edit">
                    <label><MdEdit style={{verticalAlign:"middle",marginRight:4}}/>Cambiar estado</label>
                    <div className="ped-status-row">
                      {STATUS_KEYS.map(sk=>{
                        const cfg=STATUS[sk], isActive=detail.order.status===sk, isSaving=savingId===sk;
                        return (
                          <button key={sk} className="ped-status-opt" disabled={!!savingId}
                            style={{background:isActive?cfg.color:cfg.bg, color:isActive?"white":cfg.color, borderColor:cfg.color, opacity:!!savingId&&!isSaving?.6:1}}
                            onClick={()=>!isActive&&!savingId&&updateStatus(detail.order.id,sk)}
                          >
                            {isSaving ? <span className="ped-spin-sm"/> : cfg.icon} {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
