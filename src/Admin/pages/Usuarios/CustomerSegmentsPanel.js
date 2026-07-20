import React, { useCallback, useEffect, useState } from "react";
import { MdRefresh, MdSearch, MdCampaign, MdPeople } from "react-icons/md";

const API = "https://sl-back.vercel.app/api/admin";
const token = () => localStorage.getItem("token");
const money = value => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(value || 0);
const colors = { "Alto valor":"#7c3aed", "Frecuente":"#15803d", "Ocasional":"#2563eb", "En riesgo":"#dc2626" };

const CSS = `
.seg-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:18px}.seg-stat{background:#fff;border-radius:12px;padding:15px 16px;box-shadow:0 1px 6px rgba(0,0,0,.06);border-top:4px solid var(--sc)}.seg-stat strong{font-size:1.7rem;color:#1a202c;display:block;line-height:1.1}.seg-stat span{font-size:.75rem;color:#718096;font-weight:600}
.seg-info{background:linear-gradient(135deg,#ecfeff,#eff6ff);border:1px solid #bae6fd;border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}.seg-info strong{color:#164e63}.seg-info span{font-size:.8rem;color:#5b6474}
.seg-bar{background:#fff;padding:14px 18px;border-radius:12px;margin-bottom:18px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;gap:10px;align-items:center;flex-wrap:wrap}.seg-search{position:relative;flex:1;min-width:220px}.seg-search input{width:100%;padding:9px 10px 9px 36px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;font:inherit}.seg-search svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#a0aec0}.seg-select{padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;font:inherit}.seg-btn{padding:9px 14px;border:0;border-radius:8px;background:linear-gradient(135deg,#0891b2,#2563eb);color:#fff;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px}
.seg-card{background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.06);overflow:auto}.seg-table{width:100%;border-collapse:collapse;min-width:980px}.seg-table th{padding:12px 14px;background:#f8fafc;text-align:left;font-size:.73rem;color:#4a5568;text-transform:uppercase;border-bottom:2px solid #e2e8f0}.seg-table td{padding:12px 14px;border-bottom:1px solid #edf2f7;font-size:.83rem;color:#4a5568}.seg-table tr:hover td{background:#f8fbff}.seg-name{font-weight:700;color:#1a202c}.seg-user{font-size:.74rem;color:#a0aec0}.seg-badge{display:inline-flex;padding:4px 10px;border-radius:20px;color:#fff;font-size:.71rem;font-weight:800;white-space:nowrap}.seg-profile{max-width:250px}.seg-action{max-width:270px;color:#4a5568}.seg-empty{padding:55px;text-align:center;color:#718096}.seg-foot{padding:11px 15px;color:#718096;font-size:.78rem;border-top:1px solid #edf2f7;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.seg-spin{animation:segSpin .9s linear infinite}@keyframes segSpin{to{transform:rotate(360deg)}}
`;

export default function CustomerSegmentsPanel() {
  const [data,setData] = useState({customers:[],summary:null,model:null});
  const [filters,setFilters] = useState({search:"",segment:"all"});
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const load = useCallback(async()=>{
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({limit:"500"});
      if(filters.search.trim()) params.set("search",filters.search.trim());
      if(filters.segment!=="all") params.set("segment",filters.segment);
      const response=await fetch(`${API}/ml/customer-segments?${params}`,{headers:{Authorization:`Bearer ${token()}`}});
      if(!response.ok) throw new Error(`Error ${response.status}`);
      setData(await response.json());
    } catch { setError("No se pudieron cargar los segmentos. Verifica que el modelo esté generado y el backend desplegado."); }
    finally { setLoading(false); }
  },[filters.search,filters.segment]);
  useEffect(()=>{load();},[load]);
  const summary=data.summary||{segments:{}};
  return <div className="seg"><style>{CSS}</style>
    <div className="seg-stats">
      <div className="seg-stat" style={{"--sc":"#0f172a"}}><strong>{summary.total??"—"}</strong><span>Clientes segmentados</span></div>
      {Object.keys(colors).map(name=><div className="seg-stat" style={{"--sc":colors[name]}} key={name}><strong>{summary.segments?.[name]??"—"}</strong><span>{name}</span></div>)}
    </div>
    <div className="seg-info"><div><strong><MdPeople style={{verticalAlign:"middle",marginRight:6}}/>K-Means · segmentación conductual</strong><br/><span>Agrupa clientes similares usando su actividad de los últimos 180 días.</span></div><div><span>Dataset: {data.model?.datasetRows?.toLocaleString("es-MX")||"—"} clientes · Silhouette: {data.model?.metrics?.silhouette!==undefined?Number(data.model.metrics.silhouette).toFixed(3):"—"}</span></div></div>
    <div className="seg-bar"><div className="seg-search"><MdSearch size={18}/><input placeholder="Buscar cliente, usuario o correo…" value={filters.search} onChange={event=>setFilters({...filters,search:event.target.value})}/></div>
      <select className="seg-select" value={filters.segment} onChange={event=>setFilters({...filters,segment:event.target.value})}><option value="all">Todos los segmentos</option>{Object.keys(colors).map(name=><option key={name} value={name}>{name}</option>)}</select>
      <button className="seg-btn" onClick={load}><MdRefresh className={loading?"seg-spin":""}/>Actualizar</button><button className="seg-btn" onClick={()=>{window.location.href="/admin/promociones";}}><MdCampaign/>Crear campaña</button>
    </div>
    <div className="seg-card">{loading?<div className="seg-empty"><MdRefresh className="seg-spin" size={32}/><p>Generando vista de segmentos…</p></div>:error?<div className="seg-empty">{error}</div>:data.customers.length===0?<div className="seg-empty">No hay clientes con esos filtros.</div>:<>
      <table className="seg-table"><thead><tr><th>Cliente</th><th>Segmento</th><th>Recencia</th><th>Pedidos 180d</th><th>Gasto 180d</th><th>Perfil</th><th>Acción sugerida</th></tr></thead><tbody>{data.customers.map(item=><tr key={item.user_id}>
        <td><div className="seg-name">{item.nombre} {item.apellidoP}</div><div className="seg-user">@{item.usuario} · {item.correo}</div></td><td><span className="seg-badge" style={{background:colors[item.segment_name]}}>{item.segment_name}</span></td><td>{item.recency_days} días</td><td>{item.orders_180d}</td><td>{money(item.spend_180d)}</td><td className="seg-profile">{item.profile_summary}</td><td className="seg-action">{item.suggested_action}</td>
      </tr>)}</tbody></table><div className="seg-foot"><span>{data.customers.length} clientes mostrados</span><span>Cada cliente pertenece al centroide más cercano.</span></div>
    </>}</div>
  </div>;
}
