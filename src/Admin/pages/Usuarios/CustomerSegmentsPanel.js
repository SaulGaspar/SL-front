import { API_BASE_URL } from "../../../config/api";
import { PROMOTIONS_ENABLED } from "../../../config/features";
import React, { useCallback, useEffect, useState } from "react";
import { MdRefresh, MdSearch, MdCampaign, MdPeople } from "react-icons/md";

const API = `${API_BASE_URL}/api/admin`;
const token = () => localStorage.getItem("token");
const money = value => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(value || 0);
const colors = { "Alto valor":"#7c3aed", "Frecuente":"#15803d", "Ocasional":"#2563eb", "En riesgo":"#dc2626" };

import CSS from "./CustomerSegmentsPanel.styles";

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
      <button className="seg-btn" onClick={load}><MdRefresh className={loading?"seg-spin":""}/>Actualizar</button>{PROMOTIONS_ENABLED && <button className="seg-btn" onClick={()=>{window.location.href="/admin/promociones";}}><MdCampaign/>Crear campaña</button>}
    </div>
    <div className="seg-card">{loading?<div className="seg-empty"><MdRefresh className="seg-spin" size={32}/><p>Generando vista de segmentos…</p></div>:error?<div className="seg-empty">{error}</div>:data.customers.length===0?<div className="seg-empty">No hay clientes con esos filtros.</div>:<>
      <table className="seg-table"><thead><tr><th>Cliente</th><th>Segmento</th><th>Recencia</th><th>Pedidos 180d</th><th>Gasto 180d</th><th>Perfil</th><th>Acción sugerida</th></tr></thead><tbody>{data.customers.map(item=><tr key={item.user_id}>
        <td><div className="seg-name">{item.nombre} {item.apellidoP}</div><div className="seg-user">@{item.usuario} · {item.correo}</div></td><td><span className="seg-badge" style={{background:colors[item.segment_name]}}>{item.segment_name}</span></td><td>{item.recency_days} días</td><td>{item.orders_180d}</td><td>{money(item.spend_180d)}</td><td className="seg-profile">{item.profile_summary}</td><td className="seg-action">{item.suggested_action}</td>
      </tr>)}</tbody></table><div className="seg-foot"><span>{data.customers.length} clientes mostrados</span><span>Cada cliente pertenece al centroide más cercano.</span></div>
    </>}</div>
  </div>;
}
