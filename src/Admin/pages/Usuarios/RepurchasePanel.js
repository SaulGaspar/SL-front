import React, { useCallback, useEffect, useState } from "react";
import { MdRefresh, MdSearch, MdTrendingUp, MdCampaign } from "react-icons/md";

const API = "https://sl-back.vercel.app/api/admin";
const token = () => localStorage.getItem("token");
const money = value => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(value || 0);
const percent = value => `${Math.round(Number(value || 0) * 100)}%`;

const CSS = `
.rep-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px;margin-bottom:18px}
.rep-stat{background:#fff;border-radius:12px;padding:15px 16px;box-shadow:0 1px 6px rgba(0,0,0,.06);border-left:4px solid var(--rc)}
.rep-stat strong{display:block;font-size:1.7rem;color:#1a202c;line-height:1.1}.rep-stat span{font-size:.75rem;color:#718096;font-weight:600}
.rep-info{background:linear-gradient(135deg,#eef2ff,#f5f3ff);border:1px solid #ddd6fe;border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}
.rep-info strong{color:#4c1d95}.rep-info span{font-size:.8rem;color:#5b6474}
.rep-bar{background:#fff;padding:14px 18px;border-radius:12px;margin-bottom:18px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.rep-search{position:relative;flex:1;min-width:220px}.rep-search input{width:100%;padding:9px 10px 9px 36px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;font:inherit}.rep-search svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#a0aec0}
.rep-select{padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;font:inherit}
.rep-button{padding:9px 14px;border:0;border-radius:8px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px}
.rep-card{background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.06);overflow:auto}.rep-table{width:100%;border-collapse:collapse;min-width:900px}
.rep-table th{padding:12px 14px;background:#f8fafc;text-align:left;font-size:.73rem;color:#4a5568;text-transform:uppercase;border-bottom:2px solid #e2e8f0}.rep-table td{padding:12px 14px;border-bottom:1px solid #edf2f7;font-size:.84rem;color:#4a5568}.rep-table tr:hover td{background:#fafbff}
.rep-name{font-weight:700;color:#1a202c}.rep-user{font-size:.75rem;color:#a0aec0}.rep-prob{font-weight:800;color:#4c1d95}.rep-track{width:86px;height:6px;background:#edf2f7;border-radius:6px;margin-top:5px;overflow:hidden}.rep-fill{height:100%;background:linear-gradient(90deg,#667eea,#764ba2)}
.rep-level{display:inline-flex;padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:800;text-transform:capitalize}.rep-alta{background:#dcfce7;color:#15803d}.rep-media{background:#fef3c7;color:#b45309}.rep-baja{background:#fee2e2;color:#b91c1c}
.rep-factor{max-width:240px}.rep-empty{padding:55px;text-align:center;color:#718096}.rep-foot{padding:11px 15px;color:#718096;font-size:.78rem;border-top:1px solid #edf2f7;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.rep-spin{animation:repSpin .9s linear infinite}@keyframes repSpin{to{transform:rotate(360deg)}}
`;

export default function RepurchasePanel() {
  const [data, setData] = useState({ predictions:[], summary:null, model:null });
  const [filters, setFilters] = useState({ search:"", level:"all" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ limit:"500" });
      if (filters.search.trim()) params.set("search", filters.search.trim());
      if (filters.level !== "all") params.set("level", filters.level);
      const response = await fetch(`${API}/ml/repurchase-propensity?${params}`, { headers:{ Authorization:`Bearer ${token()}` } });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      setData(await response.json());
    } catch {
      setError("No se pudieron cargar las predicciones. Verifica que el modelo esté generado y el backend desplegado.");
    } finally { setLoading(false); }
  }, [filters.level, filters.search]);

  useEffect(() => { load(); }, [load]);
  const summary = data.summary || {};
  const metrics = data.model?.metrics || {};

  return (
    <div className="rep">
      <style>{CSS}</style>
      <div className="rep-stats">
        <div className="rep-stat" style={{"--rc":"#667eea"}}><strong>{summary.total ?? "—"}</strong><span>Clientes clasificados</span></div>
        <div className="rep-stat" style={{"--rc":"#16a34a"}}><strong>{summary.high ?? "—"}</strong><span>Propensión alta</span></div>
        <div className="rep-stat" style={{"--rc":"#d97706"}}><strong>{summary.medium ?? "—"}</strong><span>Propensión media</span></div>
        <div className="rep-stat" style={{"--rc":"#dc2626"}}><strong>{summary.low ?? "—"}</strong><span>Propensión baja</span></div>
        <div className="rep-stat" style={{"--rc":"#7c3aed"}}><strong>{percent(metrics.accuracy)}</strong><span>Exactitud de validación</span></div>
      </div>
      <div className="rep-info">
        <div><strong><MdTrendingUp style={{verticalAlign:"middle",marginRight:6}}/>Random Forest · recompra a 30 días</strong><br/><span>Prioriza clientes según su comportamiento de los últimos 90 días.</span></div>
        <div><span>Dataset: {data.model?.datasetRows?.toLocaleString("es-MX") || "—"} filas · Entrenado: {data.model?.trainedAt ? new Date(data.model.trainedAt).toLocaleDateString("es-MX") : "—"}</span></div>
      </div>
      <div className="rep-bar">
        <div className="rep-search"><MdSearch size={18}/><input placeholder="Buscar cliente, usuario o correo…" value={filters.search} onChange={event=>setFilters({...filters,search:event.target.value})}/></div>
        <select className="rep-select" value={filters.level} onChange={event=>setFilters({...filters,level:event.target.value})}><option value="all">Todos los niveles</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select>
        <button className="rep-button" onClick={load}><MdRefresh className={loading?"rep-spin":""}/>Actualizar</button>
        <button className="rep-button" onClick={()=>{ window.location.href="/admin/promociones"; }}><MdCampaign/>Ir a promociones</button>
      </div>
      <div className="rep-card">
        {loading ? <div className="rep-empty"><MdRefresh className="rep-spin" size={32}/><p>Calculando prioridades…</p></div> : error ? <div className="rep-empty">{error}</div> : data.predictions.length === 0 ? <div className="rep-empty">No hay clientes con esos filtros.</div> : <>
          <table className="rep-table"><thead><tr><th>Cliente</th><th>Probabilidad</th><th>Nivel</th><th>Última compra</th><th>Pedidos 90d</th><th>Gasto 90d</th><th>Factor principal</th></tr></thead><tbody>{data.predictions.map(item=><tr key={item.user_id}>
            <td><div className="rep-name">{item.nombre} {item.apellidoP}</div><div className="rep-user">@{item.usuario} · {item.correo}</div></td>
            <td><div className="rep-prob">{percent(item.probability)}</div><div className="rep-track"><div className="rep-fill" style={{width:percent(item.probability)}}/></div></td>
            <td><span className={`rep-level rep-${item.level}`}>{item.level}</span></td><td>{item.recency_days} días</td><td>{item.orders_90d}</td><td>{money(item.spend_90d)}</td><td className="rep-factor">{item.primary_factor}</td>
          </tr>)}</tbody></table>
          <div className="rep-foot"><span>{data.predictions.length} clientes mostrados</span><span>Alta ≥ 55% · Media 30–54% · Baja &lt; 30%</span></div>
        </>}
      </div>
    </div>
  );
}
