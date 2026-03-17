import React, { useState, useEffect, useCallback } from "react";
import {
  MdRefresh, MdTrendingUp, MdTrendingDown, MdStore,
  MdInventory, MdPeople, MdShoppingCart, MdAttachMoney,
  MdCategory, MdCalendarToday, MdDownload,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt  = n => Number(n||0).toLocaleString("es-MX");
const fmtMXN = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const fmtPct = (cur, prev) => {
  if (!prev || prev === 0) return null;
  const pct = ((cur - prev) / prev) * 100;
  return { val: Math.abs(pct).toFixed(1), up: pct >= 0 };
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.rep * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

/* Filtros */
.rep-filters {
  background:white; border-radius:12px; padding:18px 22px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:14px;
  flex-wrap:wrap; align-items:flex-end; margin-bottom:22px;
}
.rep-fg { display:flex; flex-direction:column; gap:5px; }
.rep-fg label { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; }
.rep-fg input,.rep-fg select {
  padding:9px 13px; border:1px solid #e2e8f0; border-radius:8px;
  font-size:.88rem; font-family:inherit; min-width:150px; color:#2d3748;
}
.rep-fg input:focus,.rep-fg select:focus { outline:none; border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.1); }
.rep-apply {
  display:flex; align-items:center; gap:8px;
  background:#1e3a5f; color:white; border:none;
  padding:9px 22px; border-radius:8px; font-weight:600;
  cursor:pointer; font-family:inherit; font-size:.88rem;
  transition:all .2s; align-self:flex-end;
}
.rep-apply:hover { background:#2c5282; transform:translateY(-1px); }
.rep-apply:disabled { opacity:.5; cursor:not-allowed; }

/* KPI cards */
.rep-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
.rep-kpi {
  background:white; border-radius:12px; padding:20px 22px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); border-left:4px solid transparent;
}
.rep-kpi.blue   { border-left-color:#2b6cb0; }
.rep-kpi.green  { border-left-color:#276749; }
.rep-kpi.yellow { border-left-color:#b7791f; }
.rep-kpi.purple { border-left-color:#553c9a; }
.rep-kpi-lbl { font-size:.74rem; font-weight:700; color:#718096; text-transform:uppercase; letter-spacing:.4px; margin-bottom:6px; }
.rep-kpi-val { font-family:'JetBrains Mono',monospace; font-size:1.7rem; font-weight:700; color:#1e3a5f; line-height:1; }
.rep-kpi-trend { display:flex; align-items:center; gap:4px; margin-top:6px; font-size:.75rem; font-weight:600; }
.rep-kpi-trend.up   { color:#276749; }
.rep-kpi-trend.down { color:#9b2c2c; }
.rep-kpi-sub { font-size:.74rem; color:#a0aec0; margin-top:4px; }

/* Grid layouts */
.rep-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px; }
.rep-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:18px; }

/* Panel */
.rep-panel {
  background:white; border-radius:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); overflow:hidden; margin-bottom:18px;
}
.rep-panel-head {
  padding:14px 20px; border-bottom:1px solid #f0f4f8;
  display:flex; align-items:center; justify-content:space-between;
}
.rep-panel-title { font-size:.9rem; font-weight:700; color:#1e3a5f; display:flex; align-items:center; gap:8px; }
.rep-panel-title svg { color:#2b6cb0; }
.rep-panel-body { padding:18px 20px; }
.rep-badge { font-size:.72rem; font-weight:700; padding:3px 10px; border-radius:20px; background:#ebf8ff; color:#2b6cb0; font-family:'JetBrains Mono',monospace; }

/* Line chart */
.lc-wrap { position:relative; }
.lc-yaxis { position:absolute; left:0; top:0; bottom:24px; display:flex; flex-direction:column; justify-content:space-between; pointer-events:none; }
.lc-yaxis span { font-size:.65rem; color:#a0aec0; white-space:nowrap; font-family:'JetBrains Mono',monospace; }
.lc-svg-wrap { margin-left:52px; }
.lc-xaxis { margin-left:52px; display:flex; justify-content:space-between; margin-top:4px; }
.lc-xaxis span { font-size:.66rem; color:#a0aec0; }

/* Bar chart horizontal */
.hbar { display:flex; flex-direction:column; gap:10px; }
.hbar-row { display:flex; align-items:center; gap:10px; }
.hbar-lbl { font-size:.8rem; color:#4a5568; width:110px; text-align:right; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hbar-track { flex:1; height:26px; background:#f0f4f8; border-radius:6px; overflow:hidden; }
.hbar-fill { height:100%; border-radius:6px; display:flex; align-items:center; padding-left:10px; font-size:.76rem; font-weight:700; color:white; min-width:2px; transition:width .5s ease; }
.hbar-val { font-size:.8rem; font-weight:700; color:#1e3a5f; width:90px; flex-shrink:0; font-family:'JetBrains Mono',monospace; }

/* Donut */
.donut-wrap { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
.donut-legend { display:flex; flex-direction:column; gap:8px; flex:1; min-width:140px; }
.donut-leg-row { display:flex; align-items:center; gap:8px; font-size:.82rem; color:#2d3748; }
.donut-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

/* Top table */
.rep-table { width:100%; border-collapse:collapse; font-size:.83rem; }
.rep-table th { padding:10px 14px; text-align:left; font-size:.72rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.rep-table td { padding:11px 14px; border-bottom:1px solid #f0f4f8; color:#2d3748; vertical-align:middle; }
.rep-table tbody tr:hover td { background:#f8fafc; }
.rep-table tbody tr:last-child td { border-bottom:none; }
.rep-rank { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.78rem; }
.r1 { background:#fef5e7; color:#975a16; }
.r2 { background:#f0fff4; color:#276749; }
.r3 { background:#ebf8ff; color:#2c5282; }
.rn { background:#f7fafc; color:#718096; }

/* Status pills */
.s-pill { padding:2px 10px; border-radius:20px; font-size:.74rem; font-weight:700; }
.s-entregado { background:#c6f6d5; color:#276749; }
.s-pendiente { background:#fef5e7; color:#975a16; }
.s-cancelado { background:#fed7d7; color:#9b2c2c; }

.rep-empty { text-align:center; color:#a0aec0; padding:40px; font-size:.88rem; }
.rep-loading { text-align:center; color:#718096; padding:64px; font-size:.9rem; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

@media(max-width:1024px){ .rep-kpis{grid-template-columns:1fr 1fr;} .rep-grid2{grid-template-columns:1fr;} .rep-grid3{grid-template-columns:1fr 1fr;} }
@media(max-width:640px)  { .rep-kpis{grid-template-columns:1fr;} .rep-grid3{grid-template-columns:1fr;} }
`;

// ── Colores para gráficas ──────────────────────────────────────────────────
const COLORS = ["#2b6cb0","#276749","#b7791f","#553c9a","#2c7a7b","#9b2c2c","#744210","#1e3a5f"];

// ── LineChart SVG ──────────────────────────────────────────────────────────
function LineChart({ data, valueKey="ingresos", labelKey="dia", color="#2b6cb0" }) {
  if (!data?.length) return <div className="rep-empty">Sin datos en el período</div>;
  const values = data.map(d => Number(d[valueKey])||0);
  const max = Math.max(...values, 1);
  const W=500, H=140, PL=0, PR=10, PT=10, PB=10;
  const xs = values.map((_,i) => PL + (i/Math.max(values.length-1,1))*(W-PL-PR));
  const ys = values.map(v  => PT + (1-(v/max))*(H-PT-PB));
  const line = xs.map((x,i)=>`${x},${ys[i]}`).join(" ");
  const area = `${xs[0]},${H-PB} ${line} ${xs[xs.length-1]},${H-PB}`;
  const yLabels = [max, max/2, 0].map(v => fmtMXN(v));

  return (
    <div className="lc-wrap">
      <div className="lc-yaxis">
        {yLabels.map((l,i) => <span key={i}>{l}</span>)}
      </div>
      <div className="lc-svg-wrap">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height:150}}>
          <defs>
            <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity=".25"/>
              <stop offset="100%" stopColor={color} stopOpacity=".02"/>
            </linearGradient>
          </defs>
          <polygon points={area} fill={`url(#lg-${color.replace('#','')})`}/>
          <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
          {xs.map((x,i) => (
            <g key={i}>
              <title>{data[i][labelKey]}: {fmtMXN(values[i])}</title>
              <circle cx={x} cy={ys[i]} r="3" fill={color} stroke="white" strokeWidth="1.5"/>
            </g>
          ))}
        </svg>
      </div>
      <div className="lc-xaxis">
        {data.length > 0 && <span>{data[0][labelKey]}</span>}
        {data.length > 2 && <span>{data[Math.floor(data.length/2)][labelKey]}</span>}
        {data.length > 1 && <span>{data[data.length-1][labelKey]}</span>}
      </div>
    </div>
  );
}

// ── Donut SVG ──────────────────────────────────────────────────────────────
function DonutChart({ data, labelKey, valueKey }) {
  if (!data?.length) return <div className="rep-empty">Sin datos</div>;
  const total = data.reduce((s,d)=>s+Number(d[valueKey]||0),0) || 1;
  const R=54, CX=64, CY=64, stroke=18;
  let offset = 0;
  const slices = data.slice(0,6).map((d,i) => {
    const pct = Number(d[valueKey]||0)/total;
    const circ = 2*Math.PI*R;
    const s = { dasharray: pct*circ, dashoffset: -(offset*circ), color: COLORS[i] };
    offset += pct;
    return s;
  });
  return (
    <div className="donut-wrap">
      <svg width={128} height={128} style={{flexShrink:0}}>
        {slices.map((s,i) => (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dasharray} ${2*Math.PI*R}`}
            strokeDashoffset={s.dashoffset}
            style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dasharray .5s"}}/>
        ))}
        <circle cx={CX} cy={CY} r={R-stroke/2} fill="white"/>
        <text x={CX} y={CY-6} textAnchor="middle" fontSize="11" fill="#718096">Total</text>
        <text x={CX} y={CY+10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e3a5f">
          {fmtMXN(total)}
        </text>
      </svg>
      <div className="donut-legend">
        {data.slice(0,6).map((d,i) => (
          <div key={i} className="donut-leg-row">
            <div className="donut-dot" style={{background:COLORS[i]}}/>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d[labelKey]}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".76rem",color:"#2b6cb0",fontWeight:700}}>
              {((Number(d[valueKey]||0)/total)*100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HBarChart ──────────────────────────────────────────────────────────────
function HBarChart({ data, labelKey, valueKey, isMXN=true }) {
  if (!data?.length) return <div className="rep-empty">Sin datos</div>;
  const max = Math.max(...data.map(d=>Number(d[valueKey]||0)),1);
  return (
    <div className="hbar">
      {data.slice(0,8).map((d,i) => {
        const val = Number(d[valueKey]||0);
        const pct = (val/max)*100;
        return (
          <div key={i} className="hbar-row">
            <div className="hbar-lbl" title={d[labelKey]}>{d[labelKey]||"—"}</div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{width:`${pct}%`,background:COLORS[i%COLORS.length]}}>
                {pct>18 ? (isMXN ? fmtMXN(val) : fmt(val)) : ""}
              </div>
            </div>
            <div className="hbar-val">{isMXN ? fmtMXN(val) : fmt(val)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Reportes() {
  // Rango por defecto: últimos 30 días
  const today  = new Date().toISOString().slice(0,10);
  const ago30  = new Date(Date.now()-30*86400000).toISOString().slice(0,10);

  const [from,   setFrom]   = useState(ago30);
  const [to,     setTo]     = useState(today);
  const [branch, setBranch] = useState("all");
  const [loading, setLoading] = useState(false);

  const [summary,    setSummary]    = useState(null);
  const [timeline,   setTimeline]   = useState([]);
  const [byBranch,   setByBranch]   = useState([]);
  const [topProds,   setTopProds]   = useState([]);
  const [byCat,      setByCat]      = useState([]);
  const [branches,   setBranches]   = useState([]);

  // Cargar sucursales para el select
  useEffect(() => {
    fetch(`${API_URL}/api/admin/branches`, {headers:auth()})
      .then(r=>r.ok?r.json():[])
      .then(setBranches)
      .catch(()=>{});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ from, to });
    if (branch !== "all") p.append("branch", branch);
    try {
      const [s, t, bb, tp, bc, dash] = await Promise.all([
        fetch(`${API_URL}/api/admin/reports/summary?${p}`,      {headers:auth()}).then(r=>r.ok?r.json():null),
        fetch(`${API_URL}/api/admin/reports/timeline?${p}`,     {headers:auth()}).then(r=>r.ok?r.json():[]),
        fetch(`${API_URL}/api/admin/reports/by-branch?${p}`,    {headers:auth()}).then(r=>r.ok?r.json():[]),
        fetch(`${API_URL}/api/admin/reports/top-products?${p}`, {headers:auth()}).then(r=>r.ok?r.json():[]),
        fetch(`${API_URL}/api/admin/reports/by-category?${p}`,  {headers:auth()}).then(r=>r.ok?r.json():[]),
        fetch(`${API_URL}/api/admin/dashboard?${p}`,            {headers:auth()}).then(r=>r.ok?r.json():null),
      ]);
      setSummary(s);
      setTimeline(t.length > 0 ? t : (dash?.salesTimeline || []));
      setByBranch(bb.length > 0 ? bb : (dash?.branchRanking || []));
      // top-products: usar el nuevo endpoint si devuelve datos, sino fallback al dashboard
      setTopProds(tp.length > 0 ? tp : (dash?.topProducts || []));
      setByCat(bc);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [from, to, branch]);

  useEffect(() => { load(); }, []);

  const kpis = summary ? [
    {
      label:"Ingresos totales", val: fmtMXN(summary.current?.ingresos),
      trend: fmtPct(summary.current?.ingresos, summary.previous?.ingresos),
      sub: `${fmt(summary.current?.total_pedidos)} pedidos`, color:"blue", icon:<MdAttachMoney/>
    },
    {
      label:"Pedidos", val: fmt(summary.current?.total_pedidos),
      trend: fmtPct(summary.current?.total_pedidos, summary.previous?.total_pedidos),
      sub: `${fmt(summary.current?.entregados)} entregados`, color:"green", icon:<MdShoppingCart/>
    },
    {
      label:"Ticket promedio", val: fmtMXN(summary.current?.ticket_promedio),
      trend: null,
      sub: `${fmt(summary.current?.cancelados)} cancelados`, color:"yellow", icon:<MdTrendingUp/>
    },
    {
      label:"Clientes únicos", val: fmt(summary.current?.clientes_unicos),
      trend: fmtPct(summary.current?.clientes_unicos, summary.previous?.clientes_unicos),
      sub: "compraron en el período", color:"purple", icon:<MdPeople/>
    },
  ] : [];

  return (
    <div className="rep">
      <style>{S}</style>

      <div className="page-header">
        <h2>Reportes</h2>
        <p>Análisis de ventas, productos y sucursales por período</p>
      </div>

      {/* Filtros */}
      <div className="rep-filters">
        <div className="rep-fg">
          <label>Desde</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)}/>
        </div>
        <div className="rep-fg">
          <label>Hasta</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)}/>
        </div>
        <div className="rep-fg">
          <label>Sucursal</label>
          <select value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="all">Todas las sucursales</option>
            {branches.map(b=>(
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>
        {/* Atajos rápidos */}
        {[
          {label:"7d",  days:7},
          {label:"30d", days:30},
          {label:"90d", days:90},
        ].map(({label,days})=>(
          <button key={label} onClick={()=>{
            const t=new Date().toISOString().slice(0,10);
            const f=new Date(Date.now()-days*86400000).toISOString().slice(0,10);
            setFrom(f); setTo(t);
          }} style={{
            padding:"9px 14px",border:"1px solid #e2e8f0",borderRadius:8,
            background:"white",cursor:"pointer",fontSize:".8rem",fontWeight:600,color:"#4a5568",
            alignSelf:"flex-end",fontFamily:"'DM Sans',sans-serif"
          }}>
            {label}
          </button>
        ))}
        <button className="rep-apply" onClick={load} disabled={loading}>
          <MdRefresh size={17} className={loading?"spinning":""}/>
          {loading?"Cargando…":"Aplicar"}
        </button>
      </div>

      {/* KPIs */}
      {summary && (
        <div className="rep-kpis">
          {kpis.map(k => (
            <div key={k.label} className={`rep-kpi ${k.color}`}>
              <div className="rep-kpi-lbl">{k.label}</div>
              <div className="rep-kpi-val">{k.val}</div>
              {k.trend && (
                <div className={`rep-kpi-trend ${k.trend.up?"up":"down"}`}>
                  {k.trend.up ? <MdTrendingUp size={14}/> : <MdTrendingDown size={14}/>}
                  {k.trend.val}% vs período anterior
                </div>
              )}
              <div className="rep-kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline + por sucursal */}
      <div className="rep-grid2">
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdTrendingUp/> Ingresos por día</div>
            <span className="rep-badge">{timeline.length} días</span>
          </div>
          <div className="rep-panel-body">
            <LineChart data={timeline} valueKey="ingresos" labelKey="dia"/>
          </div>
        </div>
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdTrendingUp/> Pedidos por día</div>
          </div>
          <div className="rep-panel-body">
            <LineChart data={timeline} valueKey="pedidos" labelKey="dia" color="#276749"/>
          </div>
        </div>
      </div>

      {/* Por sucursal + por categoría */}
      <div className="rep-grid2">
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdStore/> Ingresos por sucursal</div>
          </div>
          <div className="rep-panel-body">
            <HBarChart data={byBranch} labelKey="sucursal" valueKey="ingresos"/>
          </div>
        </div>
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdCategory/> Ventas por categoría</div>
          </div>
          <div className="rep-panel-body">
            <DonutChart data={byCat} labelKey="categoria" valueKey="ingresos"/>
          </div>
        </div>
      </div>

      {/* Tabla detalle por sucursal */}
      {byBranch.length > 0 && (
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdStore/> Detalle por sucursal</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Pedidos</th>
                  <th>Ingresos</th>
                  <th>Ticket promedio</th>
                  <th>Clientes únicos</th>
                  <th>Cancelados</th>
                  <th>% del total</th>
                </tr>
              </thead>
              <tbody>
                {byBranch.map((b,i) => {
                  const totalIngresos = byBranch.reduce((s,x)=>s+Number(x.ingresos||0),0)||1;
                  const pct = ((Number(b.ingresos||0)/totalIngresos)*100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td><strong style={{color:"#1e3a5f"}}>{b.sucursal}</strong></td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmt(b.pedidos)}</td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#276749"}}>{fmtMXN(b.ingresos)}</td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmtMXN(b.ticket_promedio)}</td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmt(b.clientes_unicos)}</td>
                      <td>
                        {b.cancelados > 0
                          ? <span className="s-pill s-cancelado">{fmt(b.cancelados)}</span>
                          : <span style={{color:"#a0aec0",fontSize:".78rem"}}>—</span>
                        }
                      </td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:COLORS[i%COLORS.length],borderRadius:3}}/>
                          </div>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".76rem",color:"#2b6cb0",fontWeight:700,minWidth:38}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top productos */}
      <div className="rep-panel">
        <div className="rep-panel-head">
          <div className="rep-panel-title"><MdInventory/> Top productos más vendidos</div>
          <span className="rep-badge">{topProds.length} productos</span>
        </div>
        {topProds.length > 0 ? (
          <div style={{overflowX:"auto"}}>
            <table className="rep-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio unit.</th>
                  <th>Unidades</th>
                  <th>Ingresos</th>
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {topProds.map((p,i) => (
                  <tr key={p.id||i}>
                    <td>
                      <div className={`rep-rank ${i===0?"r1":i===1?"r2":i===2?"r3":"rn"}`}>{i+1}</div>
                    </td>
                    <td><strong style={{color:"#1e3a5f"}}>{p.nombre}</strong></td>
                    <td><span style={{background:"#edf2f7",padding:"2px 8px",borderRadius:6,fontSize:".74rem",color:"#4a5568"}}>{p.categoria||"—"}</span></td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmtMXN(p.precio)}</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{fmt(p.vendidos)} uds.</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#276749"}}>{fmtMXN(p.ingresos)}</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",color:"#718096"}}>{fmt(p.num_pedidos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rep-panel-body">
            <div className="rep-empty">Sin datos de productos en el período seleccionado</div>
          </div>
        )}
      </div>

      {/* Categorías detalle */}
      {byCat.length > 0 && (
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdCategory/> Detalle por categoría</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Unidades vendidas</th>
                  <th>Ingresos</th>
                  <th>Productos distintos</th>
                  <th>% de ingresos</th>
                </tr>
              </thead>
              <tbody>
                {byCat.map((c,i) => {
                  const total = byCat.reduce((s,x)=>s+Number(x.ingresos||0),0)||1;
                  const pct = ((Number(c.ingresos||0)/total)*100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td><strong style={{color:"#1e3a5f"}}>{c.categoria}</strong></td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmt(c.vendidos)}</td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#276749"}}>{fmtMXN(c.ingresos)}</td>
                      <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{fmt(c.productos_distintos)}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:COLORS[i%COLORS.length],borderRadius:3}}/>
                          </div>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".76rem",color:"#2b6cb0",fontWeight:700,minWidth:38}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}