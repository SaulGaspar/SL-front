import React, { useState, useEffect, useCallback } from "react";
import {
  MdSearch, MdRefresh, MdVisibility, MdAccessTime, MdLocalShipping,
  MdCheckCircle, MdCancel, MdSync, MdClose, MdShoppingBag, MdReceipt, MdEdit,
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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.ped * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }

/* Toast */
.ped-toast {
  position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
  padding:12px 28px; border-radius:10px; font-size:.88rem; font-weight:600;
  color:white; z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,.2);
  animation:toastIn .25s ease; pointer-events:none; white-space:nowrap;
}
.ped-toast.ok  { background:#276749; }
.ped-toast.err { background:#9b2c2c; }
@keyframes toastIn {
  from { opacity:0; transform:translateX(-50%) translateY(12px); }
  to   { opacity:1; transform:translateX(-50%) translateY(0); }
}

.ped-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-bottom:20px; }
.ped-stat { background:white; border-radius:12px; padding:14px 16px; box-shadow:0 1px 6px rgba(0,0,0,.06); border:2px solid transparent; cursor:pointer; transition:all .2s; }
.ped-stat:hover { transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,.1); }
.ped-stat.active { border-color:var(--sc); }
.ped-stat-n { font-size:1.9rem; font-weight:700; color:var(--sc); line-height:1; }
.ped-stat-l { font-size:.75rem; color:#718096; font-weight:600; margin-top:4px; }

.ped-bar { background:white; padding:14px 18px; border-radius:12px; margin-bottom:18px; box-shadow:0 1px 6px rgba(0,0,0,.06); display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.ped-srch { position:relative; flex:1; min-width:180px; max-width:300px; }
.ped-srch input { width:100%; padding:9px 9px 9px 36px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; }
.ped-srch input:focus { outline:none; border-color:#667eea; background:white; }
.ped-srch-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; }
.ped-sel { padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:130px; }
.ped-datein { padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; }
.ped-btn { padding:9px 16px; border-radius:8px; border:none; cursor:pointer; font-family:inherit; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:6px; transition:all .2s; }
.ped-btn-primary { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }
.ped-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
.ped-btn-ghost { background:#f7fafc; color:#4a5568; border:1.5px solid #e2e8f0; }
.ped-btn-ghost:hover { background:#edf2f7; }

.ped-card { background:white; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.06); overflow:hidden; }
.ped-table { width:100%; border-collapse:collapse; }
.ped-table thead { background:#f8fafc; }
.ped-table th { padding:12px 16px; text-align:left; font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.ped-table td { padding:13px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.ped-table tbody tr:hover { background:#f8fafc; }
.ped-table tbody tr:last-child td { border-bottom:none; }
.ped-oid { font-weight:700; color:#667eea; }
.ped-cliente { font-weight:600; color:#1a202c; font-size:.9rem; }
.ped-sub { font-size:.75rem; color:#a0aec0; margin-top:2px; }
.ped-total { font-weight:700; color:#1a202c; font-size:.95rem; }
.ped-fecha { font-size:.82rem; color:#718096; white-space:nowrap; }
.ped-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:.75rem; font-weight:700; white-space:nowrap; }
.ped-btn-ver { background:#ede9fe; color:#5b21b6; border:none; padding:7px 12px; border-radius:7px; cursor:pointer; font-size:.82rem; font-family:inherit; font-weight:600; display:flex; align-items:center; gap:4px; transition:all .2s; }
.ped-btn-ver:hover { background:#ddd6fe; }
.ped-empty { padding:60px; text-align:center; color:#a0aec0; }
.ped-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }

.ped-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:3000; display:flex; align-items:center; justify-content:center; padding:16px; }
.ped-modal { background:white; border-radius:16px; width:100%; max-width:620px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.2); }
.ped-mhead { padding:20px 24px; border-bottom:1px solid #f0f4f8; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0; }
.ped-mhead h3 { margin:0; font-size:1.1rem; color:#1a202c; }
.ped-mbody { padding:20px 24px; }
.ped-mclose { background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem; color:#718096; }
.ped-mclose:hover { background:#edf2f7; }
.ped-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.ped-info-item { background:#f8fafc; border-radius:10px; padding:12px 14px; }
.ped-info-lbl { font-size:.72rem; color:#a0aec0; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
.ped-info-val { font-size:.92rem; font-weight:600; color:#1a202c; }
.ped-items-title { font-size:.85rem; font-weight:700; color:#4a5568; margin:0 0 10px; text-transform:uppercase; letter-spacing:.5px; }
.ped-item-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1px solid #f0f4f8; border-radius:8px; margin-bottom:8px; }
.ped-item-name { font-weight:600; color:#1a202c; font-size:.9rem; }
.ped-item-cat { font-size:.75rem; color:#a0aec0; margin-top:2px; }
.ped-item-qty { font-size:.82rem; color:#718096; }
.ped-item-sub { font-weight:700; color:#667eea; font-size:.95rem; }
.ped-status-edit { margin-top:20px; border-top:1px solid #f0f4f8; padding-top:20px; }
.ped-status-edit label { font-size:.82rem; font-weight:700; color:#4a5568; display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:.5px; }
.ped-status-row { display:flex; gap:8px; flex-wrap:wrap; }
.ped-status-opt { padding:7px 14px; border-radius:20px; border:2px solid transparent; cursor:pointer; font-size:.8rem; font-weight:700; transition:all .2s; font-family:inherit; display:flex; align-items:center; gap:5px; }
.ped-status-opt:disabled { opacity:.5; cursor:not-allowed; }
.ped-spin-sm { width:13px; height:13px; border:2px solid rgba(255,255,255,.4); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
.ped-spinner { display:flex; align-items:center; justify-content:center; padding:60px; }
.spinning { animation:spin 1s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

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
      const data = await apiFetch(`${API}/orders/stats/summary`);
      setStats(data.resumen || null);
    } catch(e) {}
  }, []);

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
        <div className="ped-stat" style={{"--sc":"#667eea"}}>
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
          <div className="ped-spinner"><MdRefresh size={32} className="spinning" style={{color:"#667eea"}}/></div>
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
                <div className="ped-spinner"><MdRefresh size={28} className="spinning" style={{color:"#667eea"}}/></div>
              ) : !detail?.order ? (
                <p style={{color:"#e53e3e"}}>No se pudo cargar el detalle</p>
              ) : (
                <>
                  <div className="ped-info-grid">
                    <div className="ped-info-item"><div className="ped-info-lbl">Cliente</div><div className="ped-info-val">{detail.order.nombre} {detail.order.apellidoP}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Correo</div><div className="ped-info-val" style={{fontSize:".82rem"}}>{detail.order.correo}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Fecha</div><div className="ped-info-val">{fmtDate(detail.order.fecha)}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Sucursal</div><div className="ped-info-val">Sucursal {detail.order.sucursal}</div></div>
                    <div className="ped-info-item"><div className="ped-info-lbl">Total</div><div className="ped-info-val" style={{color:"#667eea"}}>{fmt(detail.order.total)}</div></div>
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