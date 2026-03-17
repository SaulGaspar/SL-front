import React, { useState, useEffect } from "react";
import {
  MdRefresh, MdStorage, MdSpeed, MdCheckCircle, MdWarning,
  MdError, MdInfo, MdTableChart, MdMemory, MdQueryStats,
  MdCircle, MdSignalCellularAlt, MdTimer, MdDataUsage,
  MdVpnKey, MdVisibility, MdPeople, MdTune,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

.mdb * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

/* Layout */
.mdb-body  { display: flex; flex-direction: column; gap: 20px; }
.mdb-grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.mdb-grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.mdb-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Stat card */
.mdb-stat {
  background: white; border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  border-left: 4px solid transparent;
  display: flex; flex-direction: column; gap: 6px;
  transition: box-shadow .2s, transform .2s;
}
.mdb-stat:hover { box-shadow: 0 6px 20px rgba(0,0,0,.09); transform: translateY(-2px); }
.mdb-stat.blue   { border-left-color: #2b6cb0; }
.mdb-stat.green  { border-left-color: #276749; }
.mdb-stat.yellow { border-left-color: #b7791f; }
.mdb-stat.red    { border-left-color: #9b2c2c; }
.mdb-stat.purple { border-left-color: #553c9a; }
.mdb-stat.teal   { border-left-color: #2c7a7b; }
.mdb-stat-icon { font-size: 1.3rem; display: flex; align-items: center; gap: 6px; }
.mdb-stat-icon.blue   { color: #2b6cb0; }
.mdb-stat-icon.green  { color: #276749; }
.mdb-stat-icon.yellow { color: #b7791f; }
.mdb-stat-icon.red    { color: #c53030; }
.mdb-stat-icon.purple { color: #553c9a; }
.mdb-stat-icon.teal   { color: #2c7a7b; }
.mdb-stat-val  { font-size: 1.9rem; font-weight: 700; color: #1e3a5f; line-height: 1; font-family: 'JetBrains Mono', monospace; }
.mdb-stat-label{ font-size: .78rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
.mdb-stat-sub  { font-size: .76rem; color: #a0aec0; }

/* Panel */
.mdb-panel {
  background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  overflow: hidden;
}
.mdb-panel-head {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f4f8;
  display: flex; align-items: center; justify-content: space-between;
}
.mdb-panel-title {
  font-size: .88rem; font-weight: 700; color: #1e3a5f;
  display: flex; align-items: center; gap: 8px;
}
.mdb-panel-title svg { color: #2b6cb0; }
.mdb-panel-body { padding: 18px 20px; }
.mdb-panel-badge {
  font-size: .72rem; font-weight: 700; padding: 3px 10px;
  border-radius: 20px; background: #ebf8ff; color: #2b6cb0;
  font-family: 'JetBrains Mono', monospace;
}

/* Bar chart */
.mdb-chart { display: flex; align-items: flex-end; gap: 5px; height: 90px; }
.mdb-bar-col {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px; height: 100%; justify-content: flex-end;
}
.mdb-bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 2px; transition: height .4s ease; }
.mdb-bar-lbl { font-size: .58rem; color: #a0aec0; white-space: nowrap; }

/* KV rows */
.mdb-kv { display: flex; flex-direction: column; gap: 7px; }
.mdb-kv-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background: #f8fafc; border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.mdb-kv-key { font-size: .8rem; color: #718096; }
.mdb-kv-val { font-family: 'JetBrains Mono', monospace; font-size: .82rem; color: #1e3a5f; font-weight: 600; }

/* Table */
.mdb-table { width: 100%; border-collapse: collapse; font-size: .82rem; }
.mdb-table th {
  padding: 10px 14px; text-align: left; font-size: .72rem;
  font-weight: 700; color: #4a5568; text-transform: uppercase;
  letter-spacing: .4px; border-bottom: 2px solid #e2e8f0; white-space: nowrap;
}
.mdb-table td { padding: 11px 14px; border-bottom: 1px solid #f0f4f8; color: #2d3748; vertical-align: middle; }
.mdb-table tbody tr:hover td { background: #f8fafc; }
.mdb-table tbody tr:last-child td { border-bottom: none; }
.mdb-mono { font-family: 'JetBrains Mono', monospace; }

/* Size bar inline */
.mdb-sz { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; min-width: 70px; }
.mdb-sz-fill { height: 100%; border-radius: 3px; transition: width .4s ease; }

/* Checks */
.mdb-checks { display: flex; flex-direction: column; gap: 8px; }
.mdb-check {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fafbfc;
  transition: border-color .15s;
}
.mdb-check:hover { border-color: #bee3f8; background: #f7fbff; }
.mdb-check-left { display: flex; align-items: center; gap: 10px; }
.mdb-check-name { font-size: .85rem; color: #2d3748; }
.mdb-check-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: .8rem; font-weight: 700;
  padding: 3px 12px; border-radius: 20px;
}
.mdb-check-badge.ok     { background: #c6f6d5; color: #276749; }
.mdb-check-badge.warn   { background: #fef5e7; color: #975a16; }
.mdb-check-badge.error  { background: #fed7d7; color: #9b2c2c; }
.mdb-check-badge.info   { background: #ebf8ff; color: #2b6cb0; }

/* Progress bar */
.mdb-prog { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.mdb-prog-fill { height: 100%; border-radius: 4px; transition: width .5s ease; }

/* Ring */
.mdb-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.mdb-ring svg { transform: rotate(-90deg); }
.mdb-ring-lbl { position: absolute; text-align: center; line-height: 1.2; }

/* Tabs */
.mdb-tabs { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; }
.mdb-tab {
  padding: 10px 20px; border: none; background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 600;
  color: #718096; border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: all .15s;
}
.mdb-tab:hover { color: #2b6cb0; }
.mdb-tab.active { color: #1e3a5f; border-bottom-color: #2b6cb0; }

/* Alert boxes */
.mdb-alert-warn  { background: #fffbeb; border: 1px solid #f6e05e; border-radius: 8px; padding: 10px 14px; font-size: .82rem; color: #744210; }
.mdb-alert-err   { background: #fff5f5; border: 1px solid #fc8181; border-radius: 8px; padding: 10px 14px; font-size: .82rem; color: #9b2c2c; }
.mdb-alert-ok    { background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 10px 14px; font-size: .82rem; color: #276749; }
.mdb-alert-info  { background: #ebf8ff; border: 1px solid #90cdf4; border-radius: 8px; padding: 10px 14px; font-size: .82rem; color: #2b6cb0; }

/* Loading */
.mdb-loading {
  display: flex; align-items: center; justify-content: center;
  min-height: 260px; gap: 12px; color: #a0aec0; font-size: .9rem;
}

.spinning { animation: spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.mdb-dot-ok    { width:9px; height:9px; border-radius:50%; background:#38a169; display:inline-block; box-shadow:0 0 0 3px #c6f6d5; }
.mdb-dot-warn  { width:9px; height:9px; border-radius:50%; background:#d69e2e; display:inline-block; box-shadow:0 0 0 3px #fef5e7; }
.mdb-dot-err   { width:9px; height:9px; border-radius:50%; background:#e53e3e; display:inline-block; box-shadow:0 0 0 3px #fed7d7; }
.mdb-dot-info  { width:9px; height:9px; border-radius:50%; background:#3182ce; display:inline-block; box-shadow:0 0 0 3px #ebf8ff; }

@media(max-width:1024px){ .mdb-grid4{grid-template-columns:1fr 1fr;} .mdb-grid3{grid-template-columns:1fr 1fr;} }
@media(max-width:640px) { .mdb-grid4{grid-template-columns:1fr;} .mdb-grid3{grid-template-columns:1fr;} .mdb-grid2{grid-template-columns:1fr;} }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtNum  = n => Number(n || 0).toLocaleString("es-MX");
const fmtMXN  = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const fmtKB   = kb => kb >= 1024 ? `${(kb/1024).toFixed(2)} MB` : `${kb} KB`;
const fmtUptime = s => {
  if (!s) return "—";
  const d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60);
  if (d>0) return `${d}d ${h}h ${m}m`;
  if (h>0) return `${h}h ${m}m`;
  return `${m}m`;
};

function statusDot(s) {
  const cls = { ok:"mdb-dot-ok", warn:"mdb-dot-warn", error:"mdb-dot-err", info:"mdb-dot-info" }[s] || "mdb-dot-info";
  return <span className={cls} />;
}
function statusIcon(s) {
  if (s==="ok")    return <MdCheckCircle size={16} style={{color:"#38a169"}} />;
  if (s==="warn")  return <MdWarning     size={16} style={{color:"#d69e2e"}} />;
  if (s==="error") return <MdError       size={16} style={{color:"#e53e3e"}} />;
  return                  <MdInfo        size={16} style={{color:"#3182ce"}} />;
}

// Mini bar chart
function BarChart({ data=[], color="#2b6cb0", valueKey="total", labelKey="dia", height=90 }) {
  const max = Math.max(...data.map(d=>d[valueKey]||0), 1);
  return (
    <div className="mdb-chart" style={{height}}>
      {data.length === 0
        ? <div style={{color:"#a0aec0",fontSize:".78rem",alignSelf:"center",width:"100%",textAlign:"center"}}>Sin datos en el período</div>
        : data.map((d,i) => {
            const pct = ((d[valueKey]||0)/max)*100;
            const lbl = (d[labelKey]||"").slice(5);
            return (
              <div key={d[labelKey]||i} className="mdb-bar-col" title={`${d[labelKey]}: ${fmtNum(d[valueKey])}`}>
                <div className="mdb-bar" style={{
                  height:`${Math.max(pct,2)}%`, background:color,
                  opacity: 0.5 + 0.5*(i/data.length)
                }}/>
                {i % Math.ceil(data.length/7) === 0 && <div className="mdb-bar-lbl">{lbl}</div>}
              </div>
            );
          })
      }
    </div>
  );
}

// Ring progress
function Ring({pct=0, color="#2b6cb0", size=88, stroke=8, label}) {
  const r = (size-stroke)/2;
  const circ = 2*Math.PI*r;
  const offset = circ - (pct/100)*circ;
  return (
    <div className="mdb-ring" style={{width:size,height:size}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{transition:"stroke-dashoffset .5s ease"}}/>
      </svg>
      <div className="mdb-ring-lbl">
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:".82rem",color}}>{Math.round(pct)}%</div>
        {label && <div style={{fontSize:".6rem",color:"#a0aec0"}}>{label}</div>}
      </div>
    </div>
  );
}


// Componente extraído para evitar warning de key en ternario
function IdxSummaryPanel({ rows }) {
  if (!rows || rows.length === 0) {
    return <div className="mdb-alert-info">No se encontraron índices personalizados.</div>;
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {rows.map((row, i) => {
        // Normalizar: information_schema puede devolver TABLE_NAME en mayúsculas
        const tname  = row.table_name  || row.TABLE_NAME  || `tabla-${i}`;
        const tcount = row.total_indexes || row.TOTAL_INDEXES || 0;
        return (
          <div key={`idx-row-${tname}-${i}`} className="mdb-kv-row">
            <span className="mdb-kv-key" style={{fontFamily:"'JetBrains Mono',monospace"}}>{tname}</span>
            <span style={{display:"flex",alignItems:"center",gap:8}}>
              {[...Array(Math.min(tcount,8))].map((_,j) => (
                <span key={`dot-${tname}-${j}`} style={{width:8,height:8,borderRadius:"50%",background:"#3182ce",display:"inline-block",opacity:0.4+0.6*(j/Math.max(tcount,1))}}/>
              ))}
              <span className="mdb-kv-val">{tcount} índice{tcount!==1?"s":""}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MonitorBD() {
  const [overview,   setOverview]   = useState(null);
  const [activity,   setActivity]   = useState(null);
  const [integrity,  setIntegrity]  = useState(null);
  const [schema,     setSchema]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [tab,        setTab]        = useState("overview");

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      const [ovR, acR, inR, scR] = await Promise.all([
        fetch(`${API_URL}/api/admin/monitor/overview`,  {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/activity`,  {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/integrity`, {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/schema`,    {headers:auth()}),
      ]);
      if (ovR.ok) setOverview(await ovR.json());
      if (acR.ok) setActivity(await acR.json());
      if (inR.ok) setIntegrity(await inR.json());
      if (scR.ok) setSchema(await scR.json());
      setLastUpdate(new Date());
    } catch { setError("No se pudo conectar con el servidor de monitoreo."); }
    finally  { setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[]);
  useEffect(()=>{ const t=setInterval(fetchAll,60000); return ()=>clearInterval(t); },[]);

  const connPct = overview
    ? Math.min((overview.server.connections / Math.max(overview.server.max_connections,1))*100, 100)
    : 0;
  const maxSize = overview ? Math.max(...overview.tables.map(t=>t.size_kb),1) : 1;
  const int_ok    = integrity?.checks?.filter(c=>c.status==="ok").length    || 0;
  const int_warn  = integrity?.checks?.filter(c=>c.status==="warn").length  || 0;
  const int_error = integrity?.checks?.filter(c=>c.status==="error").length || 0;
  const healthScore = integrity ? Math.round((int_ok/Math.max(integrity.checks.length,1))*100) : 0;

  const tabs = [
    { id:"overview",  label:"📊 Overview"   },
    { id:"activity",  label:"📈 Actividad"  },
    { id:"integrity", label:"🔍 Integridad" },
    { id:"schema",    label:"🗄️ Schema"     },
  ];

  return (
    <div>
      <style>{S}</style>

      {/* Page header — igual que los demás apartados */}
      <div className="page-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{margin:0,display:"flex",alignItems:"center",gap:10}}>
            <MdStorage style={{color:"#2b6cb0"}}/>
            Monitor de Base de Datos
          </h2>
          <p style={{margin:"6px 0 0",color:"#718096",fontSize:".9rem"}}>
            Estado en tiempo real · MySQL · Vercel
            {lastUpdate && <span style={{marginLeft:12,fontSize:".78rem",color:"#a0aec0"}}>
              Actualizado: {lastUpdate.toLocaleTimeString("es-MX")}
            </span>}
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Indicador de estado */}
          {!loading && !error && (
            <div style={{display:"flex",alignItems:"center",gap:7,background:"#f0fff4",border:"1px solid #9ae6b4",borderRadius:20,padding:"5px 14px",fontSize:".78rem",color:"#276749",fontWeight:600}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#38a169",display:"inline-block",animation:"pulse2 2s ease-in-out infinite"}}/>
              Conectado
            </div>
          )}
          <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
          <button
            onClick={fetchAll} disabled={loading}
            style={{display:"flex",alignItems:"center",gap:7,background:"#1e3a5f",color:"white",border:"none",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".88rem",fontWeight:600,opacity:loading?.6:1}}
          >
            <MdRefresh size={17} className={loading?"spinning":""} />
            {loading ? "Cargando…" : "Actualizar"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="mdb-alert-err" style={{marginBottom:20}}>⚠ {error}</div>}

      {loading && !overview ? (
        <div className="mdb-loading"><MdRefresh size={22} className="spinning"/> Consultando base de datos…</div>
      ) : (
        <div className="mdb-body">

          {/* Tabs */}
          <div className="mdb-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`mdb-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════ */}
          {/* TAB: OVERVIEW                          */}
          {/* ══════════════════════════════════════ */}
          {tab === "overview" && overview && (
            <>
              {/* KPI row */}
              <div className="mdb-grid4">
                <div className="mdb-stat blue">
                  <div className="mdb-stat-label">Tamaño BD</div>
                  <div className="mdb-stat-icon blue"><MdStorage /></div>
                  <div className="mdb-stat-val">{overview.database.size_mb}<span style={{fontSize:".9rem",color:"#a0aec0",fontWeight:400}}> MB</span></div>
                  <div className="mdb-stat-sub">Datos + índices</div>
                </div>
                <div className="mdb-stat green">
                  <div className="mdb-stat-label">Tablas</div>
                  <div className="mdb-stat-icon green"><MdTableChart /></div>
                  <div className="mdb-stat-val">{overview.database.tables}</div>
                  <div className="mdb-stat-sub">en la base de datos</div>
                </div>
                <div className="mdb-stat yellow">
                  <div className="mdb-stat-label">Queries totales</div>
                  <div className="mdb-stat-icon yellow"><MdSpeed /></div>
                  <div className="mdb-stat-val" style={{fontSize:"1.4rem"}}>{fmtNum(overview.server.total_queries)}</div>
                  <div className="mdb-stat-sub">desde último reinicio</div>
                </div>
                <div className="mdb-stat purple">
                  <div className="mdb-stat-label">Conexiones activas</div>
                  <div className="mdb-stat-icon purple"><MdMemory /></div>
                  <div className="mdb-stat-val">{overview.server.connections}</div>
                  <div className="mdb-stat-sub">de {overview.server.max_connections} máximo</div>
                </div>
              </div>

              <div className="mdb-grid2">
                {/* Servidor */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdStorage /> Servidor MySQL</div>
                    <span className="mdb-panel-badge">{fmtUptime(overview.server.uptime_seconds)} uptime</span>
                  </div>
                  <div className="mdb-panel-body">
                    <div className="mdb-kv">
                      {[
                        {k:"Versión",       v: overview.database.version},
                        {k:"Base de datos", v: overview.database.name},
                        {k:"Charset",       v: overview.database.charset},
                        {k:"Uptime",        v: fmtUptime(overview.server.uptime_seconds)},
                        {k:"Queries lentas",v: overview.server.slow_queries,
                         extra: overview.server.slow_queries > 0
                           ? <span style={{marginLeft:6,fontSize:".72rem",background:"#fef5e7",color:"#975a16",padding:"1px 7px",borderRadius:20,fontWeight:700}}>⚠ revisar</span>
                           : <span style={{marginLeft:6,fontSize:".72rem",background:"#c6f6d5",color:"#276749",padding:"1px 7px",borderRadius:20,fontWeight:700}}>✓ ok</span>
                        },
                        {k:"Datos",         v: `${overview.database.data_mb} MB`},
                        {k:"Índices",       v: `${overview.database.index_mb} MB`},
                      ].map(({k,v,extra}) => (
                        <div key={k} className="mdb-kv-row">
                          <span className="mdb-kv-key">{k}</span>
                          <span className="mdb-kv-val" style={{display:"flex",alignItems:"center"}}>{v}{extra}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conexiones */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdSignalCellularAlt /> Pool de conexiones</div>
                    <span className="mdb-panel-badge" style={{
                      background: connPct>80?"#fed7d7":connPct>50?"#fef5e7":"#ebf8ff",
                      color:      connPct>80?"#9b2c2c":connPct>50?"#975a16":"#2b6cb0",
                    }}>
                      {Math.round(connPct)}% uso
                    </span>
                  </div>
                  <div className="mdb-panel-body">
                    <div style={{display:"flex",alignItems:"center",gap:24,marginBottom:20,flexWrap:"wrap"}}>
                      <Ring
                        pct={connPct}
                        color={connPct>80?"#e53e3e":connPct>50?"#d69e2e":"#2b6cb0"}
                        size={100} stroke={9} label="uso"
                      />
                      <div className="mdb-kv" style={{flex:1,minWidth:130}}>
                        <div className="mdb-kv-row">
                          <span className="mdb-kv-key">Activas</span>
                          <span className="mdb-kv-val" style={{color:connPct>80?"#e53e3e":"#1e3a5f"}}>{overview.server.connections}</span>
                        </div>
                        <div className="mdb-kv-row">
                          <span className="mdb-kv-key">Máximo</span>
                          <span className="mdb-kv-val">{overview.server.max_connections}</span>
                        </div>
                        <div className="mdb-kv-row">
                          <span className="mdb-kv-key">Disponibles</span>
                          <span className="mdb-kv-val" style={{color:"#276749"}}>{overview.server.max_connections - overview.server.connections}</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de uso */}
                    <div style={{marginBottom:8,display:"flex",justifyContent:"space-between",fontSize:".72rem",color:"#a0aec0"}}>
                      <span>0 conexiones</span><span>{overview.server.max_connections} máx.</span>
                    </div>
                    <div className="mdb-prog">
                      <div className="mdb-prog-fill" style={{
                        width:`${connPct}%`,
                        background: connPct>80?"#e53e3e":connPct>50?"#d69e2e":"#3182ce"
                      }}/>
                    </div>

                    {connPct > 70 && (
                      <div className="mdb-alert-warn" style={{marginTop:12}}>
                        ⚠ Uso de conexiones elevado ({Math.round(connPct)}%). Evita importaciones masivas simultáneas.
                      </div>
                    )}
                    {connPct <= 50 && (
                      <div className="mdb-alert-ok" style={{marginTop:12}}>
                        ✓ Pool de conexiones saludable.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabla de tablas */}
              <div className="mdb-panel">
                <div className="mdb-panel-head">
                  <div className="mdb-panel-title"><MdTableChart /> Tablas · peso y registros</div>
                  <div style={{fontSize:".78rem",color:"#718096"}}>
                    Total: <strong style={{color:"#1e3a5f"}}>{overview.database.size_mb} MB</strong>
                  </div>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table className="mdb-table">
                    <thead>
                      <tr key="thead-tables">
                        <th>Tabla</th>
                        <th>Motor</th>
                        <th>Filas (est.)</th>
                        <th>Tamaño total</th>
                        <th style={{minWidth:110}}>% del total</th>
                        <th>Datos</th>
                        <th>Índices</th>
                        <th>Última modificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.tables.map(t => {
                        const pct = Math.min((t.size_kb/maxSize)*100, 100);
                        const barColor = t.size_kb > maxSize*.6 ? "#3182ce" : t.size_kb > maxSize*.3 ? "#48bb78" : "#a0aec0";
                        return (
                          <tr key={t.name}>
                            <td><strong style={{color:"#1e3a5f"}}>{t.name}</strong></td>
                            <td><span style={{background:"#edf2f7",padding:"2px 8px",borderRadius:6,fontSize:".75rem",color:"#4a5568"}}>{t.engine}</span></td>
                            <td className="mdb-mono">{fmtNum(t.rows)}</td>
                            <td className="mdb-mono" style={{fontWeight:600}}>{fmtKB(t.size_kb)}</td>
                            <td>
                              <div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div className="mdb-sz" style={{flex:1}}>
                                  <div className="mdb-sz-fill" style={{width:`${pct}%`,background:barColor}}/>
                                </div>
                                <span style={{fontSize:".72rem",color:"#718096",minWidth:32}}>{Math.round(pct)}%</span>
                              </div>
                            </td>
                            <td className="mdb-mono" style={{color:"#718096"}}>{fmtKB(t.data_kb)}</td>
                            <td className="mdb-mono" style={{color:"#718096"}}>{fmtKB(t.index_kb)}</td>
                            <td style={{color:"#a0aec0",fontSize:".76rem"}}>
                              {t.updated ? new Date(t.updated).toLocaleString("es-MX") : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════ */}
          {/* TAB: ACTIVITY                          */}
          {/* ══════════════════════════════════════ */}
          {tab === "activity" && activity && (
            <>
              <div className="mdb-grid4">
                {[
                  {label:"Pedidos totales",    val:fmtNum(activity.totals.orders),          sub:"en la BD",               color:"green",  icon:<MdQueryStats/>},
                  {label:"Ingresos totales",   val:fmtMXN(activity.totals.orders_revenue),  sub:"acumulado",              color:"blue",   icon:<MdDataUsage/>,  sm:true},
                  {label:"Productos activos",  val:fmtNum(activity.totals.products),         sub:"en catálogo",            color:"yellow", icon:<MdStorage/>},
                  {label:"Unidades en stock",  val:fmtNum(activity.totals.inventory_units),  sub:"total inventario",       color:"teal",   icon:<MdSignalCellularAlt/>},
                ].map(({label,val,sub,color,icon,sm}) => (
                  <div key={label} className={`mdb-stat ${color}`}>
                    <div className="mdb-stat-label">{label}</div>
                    <div className={`mdb-stat-icon ${color}`}>{icon}</div>
                    <div className="mdb-stat-val" style={sm?{fontSize:"1.3rem"}:{}}>{val}</div>
                    <div className="mdb-stat-sub">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="mdb-grid3">
                {/* Pedidos por día */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdQueryStats/> Pedidos · 14 días</div>
                    <span className="mdb-panel-badge" style={{background:"#f0fff4",color:"#276749"}}>
                      {fmtNum(activity.charts.orders_by_day.reduce((a,b)=>a+(b.total||0),0))} total
                    </span>
                  </div>
                  <div className="mdb-panel-body">
                    <BarChart data={activity.charts.orders_by_day} color="#3182ce" valueKey="total" labelKey="dia"/>
                    <div style={{marginTop:12,display:"flex",gap:10}}>
                      <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:".7rem",color:"#718096"}}>Período</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",color:"#2b6cb0",fontWeight:700,fontSize:".9rem"}}>
                          {fmtNum(activity.charts.orders_by_day.reduce((a,b)=>a+(b.total||0),0))} pedidos
                        </div>
                      </div>
                      <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:".7rem",color:"#718096"}}>Ingresos</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",color:"#276749",fontWeight:700,fontSize:".9rem"}}>
                          {fmtMXN(activity.charts.orders_by_day.reduce((a,b)=>a+(b.monto||0),0))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productos por día */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdStorage/> Productos añadidos · 14 días</div>
                    <span className="mdb-panel-badge">
                      {fmtNum(activity.charts.products_by_day.reduce((a,b)=>a+(b.total||0),0))} total
                    </span>
                  </div>
                  <div className="mdb-panel-body">
                    <BarChart data={activity.charts.products_by_day} color="#48bb78" valueKey="total" labelKey="dia"/>
                    <div style={{marginTop:12,background:"#f8fafc",borderRadius:8,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:".7rem",color:"#718096"}}>Total en catálogo</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",color:"#276749",fontWeight:700,fontSize:".9rem"}}>
                        {fmtNum(activity.totals.products)} productos activos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usuarios */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdMemory/> Usuarios · 14 días</div>
                    <span className="mdb-panel-badge" style={{background:"#f3e8ff",color:"#553c9a"}}>
                      {fmtNum(activity.totals.users)} total
                    </span>
                  </div>
                  <div className="mdb-panel-body">
                    <BarChart data={activity.charts.users_by_day} color="#805ad5" valueKey="total" labelKey="dia"/>
                    <div style={{marginTop:12,display:"flex",gap:10}}>
                      <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:".7rem",color:"#718096"}}>Total usuarios</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",color:"#553c9a",fontWeight:700,fontSize:".9rem"}}>{fmtNum(activity.totals.users)}</div>
                      </div>
                      <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:".7rem",color:"#718096"}}>Registros inv.</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",color:"#2c7a7b",fontWeight:700,fontSize:".9rem"}}>{fmtNum(activity.totals.inventory_rows)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteos reales */}
              <div className="mdb-panel">
                <div className="mdb-panel-head">
                  <div className="mdb-panel-title"><MdCircle style={{color:"#38a169"}}/> Conteos exactos por tabla</div>
                  <span style={{fontSize:".75rem",color:"#718096"}}>SELECT COUNT(*) real</span>
                </div>
                <div className="mdb-panel-body">
                  <div className="mdb-grid4">
                    {[
                      {label:"orders",    val:activity.totals.orders,          desc:"Pedidos",          color:"#3182ce"},
                      {label:"products",  val:activity.totals.products,         desc:"Productos activos",color:"#38a169"},
                      {label:"users",     val:activity.totals.users,            desc:"Usuarios",         color:"#805ad5"},
                      {label:"inventory", val:activity.totals.inventory_rows,   desc:"Registros inv.",   color:"#2c7a7b"},
                    ].map(({label,val,desc,color}) => (
                      <div key={label} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"16px 18px",borderTop:`3px solid ${color}`}}>
                        <div style={{fontSize:".72rem",color:"#718096",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{label}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"1.6rem",fontWeight:700,color}}>{fmtNum(val)}</div>
                        <div style={{fontSize:".74rem",color:"#a0aec0",marginTop:2}}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════ */}
          {/* TAB: INTEGRITY                         */}
          {/* ══════════════════════════════════════ */}
          {tab === "integrity" && integrity && (
            <>
              {/* Score + stats */}
              <div className="mdb-grid3">
                <div className="mdb-stat green">
                  <div className="mdb-stat-label">Checks OK</div>
                  <div className="mdb-stat-icon green"><MdCheckCircle/></div>
                  <div className="mdb-stat-val">{int_ok}</div>
                  <div className="mdb-stat-sub">sin problemas</div>
                </div>
                <div className="mdb-stat yellow">
                  <div className="mdb-stat-label">Advertencias</div>
                  <div className="mdb-stat-icon yellow"><MdWarning/></div>
                  <div className="mdb-stat-val">{int_warn}</div>
                  <div className="mdb-stat-sub">revisar pronto</div>
                </div>
                <div className="mdb-stat red">
                  <div className="mdb-stat-label">Errores críticos</div>
                  <div className="mdb-stat-icon red"><MdError/></div>
                  <div className="mdb-stat-val">{int_error}</div>
                  <div className="mdb-stat-sub">atención inmediata</div>
                </div>
              </div>

              <div className="mdb-grid2">
                {/* Checks list */}
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdQueryStats/> Verificaciones de integridad</div>
                    <span className="mdb-panel-badge">{integrity.checks.length} checks</span>
                  </div>
                  <div className="mdb-panel-body">
                    <div className="mdb-checks">
                      {integrity.checks.map((c) => (
                        <div key={c.name} className="mdb-check">
                          <div className="mdb-check-left">
                            {statusIcon(c.status)}
                            <span className="mdb-check-name">{c.name}</span>
                          </div>
                          <span className={`mdb-check-badge ${c.status}`}>
                            {c.value === 0 && c.status === "ok" ? "✓ OK" : fmtNum(c.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Health score + leyenda */}
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div className="mdb-panel">
                    <div className="mdb-panel-head">
                      <div className="mdb-panel-title"><MdTimer/> Health Score</div>
                    </div>
                    <div className="mdb-panel-body" style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
                      <Ring
                        pct={healthScore}
                        color={healthScore>=80?"#38a169":healthScore>=50?"#d69e2e":"#e53e3e"}
                        size={104} stroke={10} label="salud"
                      />
                      <div style={{flex:1,minWidth:120}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"2.2rem",fontWeight:700,
                          color:healthScore>=80?"#276749":healthScore>=50?"#b7791f":"#9b2c2c"}}>
                          {healthScore}<span style={{fontSize:"1rem",color:"#a0aec0",fontWeight:400}}>/100</span>
                        </div>
                        <div style={{fontSize:".85rem",color:"#718096",marginTop:4,fontWeight:600}}>
                          {healthScore>=80 ? "✓ Base de datos saludable" : healthScore>=50 ? "⚠ Requiere atención" : "❌ Problemas detectados"}
                        </div>
                        <div style={{fontSize:".76rem",color:"#a0aec0",marginTop:6}}>
                          {int_ok} OK · {int_warn} advertencias · {int_error} errores
                        </div>
                        {/* Mini barra de salud */}
                        <div className="mdb-prog" style={{marginTop:10}}>
                          <div className="mdb-prog-fill" style={{
                            width:`${healthScore}%`,
                            background:healthScore>=80?"#38a169":healthScore>=50?"#d69e2e":"#e53e3e"
                          }}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mdb-panel">
                    <div className="mdb-panel-head">
                      <div className="mdb-panel-title"><MdInfo/> Leyenda</div>
                    </div>
                    <div className="mdb-panel-body">
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {[
                          {s:"ok",    label:"Sin problema",         desc:"Verificación pasada"},
                          {s:"info",  label:"Informativo",          desc:"Dato a considerar"},
                          {s:"warn",  label:"Advertencia",          desc:"Corregir pronto"},
                          {s:"error", label:"Error crítico",        desc:"Atención inmediata"},
                        ].map(({s,label,desc}) => (
                          <div key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:"#f8fafc",borderRadius:7,border:"1px solid #e2e8f0"}}>
                            {statusDot(s)}
                            <div>
                              <div style={{fontSize:".82rem",fontWeight:600,color:"#2d3748"}}>{label}</div>
                              <div style={{fontSize:".72rem",color:"#a0aec0"}}>{desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problemas detectados */}
              {(int_warn > 0 || int_error > 0) && (
                <div className="mdb-panel">
                  <div className="mdb-panel-head">
                    <div className="mdb-panel-title"><MdWarning style={{color:"#d69e2e"}}/> Problemas detectados — acciones requeridas</div>
                    <span className="mdb-panel-badge" style={{background:"#fef5e7",color:"#975a16"}}>
                      {int_warn + int_error} problema{int_warn+int_error!==1?"s":""}
                    </span>
                  </div>
                  <div className="mdb-panel-body">
                    <div className="mdb-checks">
                      {integrity.checks
                        .filter(c => c.status==="warn" || c.status==="error")
                        .map(c => (
                          <div key={`prob-${c.name}`} className="mdb-check" style={{
                            borderColor: c.status==="error"?"#fc8181":"#f6e05e",
                            background: c.status==="error"?"#fff5f5":"#fffbeb",
                          }}>
                            <div className="mdb-check-left">
                              {statusIcon(c.status)}
                              <div>
                                <div className="mdb-check-name" style={{fontWeight:600}}>{c.name}</div>
                                <div style={{fontSize:".73rem",color:"#718096",marginTop:2}}>
                                  {c.status==="error"
                                    ? "⚡ Requiere atención inmediata — puede afectar la integridad de datos"
                                    : "⏰ Revisar y corregir en los próximos días"}
                                </div>
                              </div>
                            </div>
                            <span className={`mdb-check-badge ${c.status}`}>{fmtNum(c.value)} afectados</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {int_warn === 0 && int_error === 0 && (
                <div className="mdb-alert-ok">
                  ✓ Todas las verificaciones pasaron correctamente. La base de datos está en buen estado.
                </div>
              )}
            </>
          )}


          {/* ══════════════════════════════════════ */}
          {/* TAB: SCHEMA                            */}
          {/* ══════════════════════════════════════ */}
          {tab === "schema" && (
            <>
              {!schema ? (
                <div className="mdb-alert-info">Cargando información del schema…</div>
              ) : (
                <>
                  {/* Resumen rápido */}
                  <div className="mdb-grid3">
                    <div key="schema-stat-views" className="mdb-stat blue">
                      <div className="mdb-stat-label">Vistas</div>
                      <div className="mdb-stat-icon blue"><MdVisibility/></div>
                      <div className="mdb-stat-val">{schema.views.length}</div>
                      <div className="mdb-stat-sub">consultas guardadas</div>
                    </div>
                    <div key="schema-stat-indexes" className="mdb-stat green">
                      <div className="mdb-stat-label">Índices personalizados</div>
                      <div className="mdb-stat-icon green"><MdTune/></div>
                      <div className="mdb-stat-val">{[...new Set(schema.indexes.map(i=>i.index_name))].length}</div>
                      <div className="mdb-stat-sub">en {[...new Set(schema.indexes.map(i=>i.table_name))].length} tablas</div>
                    </div>
                    <div key="schema-stat-users" className="mdb-stat purple">
                      <div className="mdb-stat-label">Usuarios BD</div>
                      <div className="mdb-stat-icon purple"><MdPeople/></div>
                      <div className="mdb-stat-val">{schema.db_users.length || "—"}</div>
                      <div className="mdb-stat-sub">{schema.db_users.length === 0 ? "sin permisos de lectura" : "roles configurados"}</div>
                    </div>
                  </div>

                  <div className="mdb-grid2">
                    {/* Vistas */}
                    <div className="mdb-panel">
                      <div className="mdb-panel-head">
                        <div className="mdb-panel-title"><MdVisibility/> Vistas disponibles</div>
                        <span className="mdb-panel-badge">{schema.views.length} vistas</span>
                      </div>
                      <div className="mdb-panel-body">
                        {schema.views.length === 0 ? (
                          <div className="mdb-alert-info">
                            No hay vistas creadas aún. Ejecuta el SQL de vistas en DBeaver.
                          </div>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {schema.views.map(v => (
                              <div key={v.name} style={{
                                display:"flex",alignItems:"center",justifyContent:"space-between",
                                padding:"10px 14px",borderRadius:8,border:"1px solid #e2e8f0",
                                background:"#f8fafc",transition:"border-color .15s"
                              }}>
                                <div style={{display:"flex",alignItems:"center",gap:10}}>
                                  <MdVisibility size={15} style={{color:"#2b6cb0"}}/>
                                  <div>
                                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".83rem",fontWeight:600,color:"#1e3a5f"}}>{v.name}</div>
                                    <div style={{fontSize:".72rem",color:"#a0aec0",marginTop:1}}>Vista SQL</div>
                                  </div>
                                </div>
                                <span style={{
                                  fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",fontWeight:700,
                                  background:"#ebf8ff",color:"#2b6cb0",padding:"2px 10px",borderRadius:20
                                }}>
                                  {v.rows !== null ? `${fmtNum(v.rows)} filas` : "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {schema.views.length === 0 && (
                          <div style={{marginTop:12,padding:"12px 14px",background:"#f0fff4",border:"1px solid #9ae6b4",borderRadius:8,fontSize:".8rem",color:"#276749"}}>
                            💡 Las vistas recomendadas son: <strong>v_inventario_completo</strong>, <strong>v_productos_stock</strong>, <strong>v_ventas_mensuales</strong> y <strong>v_clientes_top</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Índices por tabla */}
                    <div className="mdb-panel">
                      <div className="mdb-panel-head">
                        <div className="mdb-panel-title"><MdTune/> Índices por tabla</div>
                        <span className="mdb-panel-badge">{schema.idx_summary.length} tablas</span>
                      </div>
                      <div className="mdb-panel-body">
                        <IdxSummaryPanel rows={schema.idx_summary} />
                      </div>
                    </div>
                  </div>

                  {/* Tabla detalle de índices */}
                  <div className="mdb-panel">
                    <div className="mdb-panel-head">
                      <div className="mdb-panel-title"><MdVpnKey/> Detalle de índices</div>
                      <span className="mdb-panel-badge">{schema.indexes.length} entradas</span>
                    </div>
                    <div style={{overflowX:"auto"}}>
                      <table className="mdb-table">
                        <thead>
                          <tr key="thead-idx">
                            <th>Tabla</th>
                            <th>Nombre del índice</th>
                            <th>Columna</th>
                            <th>Tipo</th>
                            <th>Cardinalidad</th>
                            <th>Único</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schema.indexes.map((idx, i) => (
                            <tr key={`${idx.table_name}-${idx.index_name}-${idx.column_name}-${i}`}>
                              <td><strong style={{color:"#1e3a5f"}}>{idx.table_name}</strong></td>
                              <td><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".8rem",color:"#2b6cb0"}}>{idx.index_name}</span></td>
                              <td><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",color:"#4a5568"}}>{idx.column_name}</span></td>
                              <td><span style={{background:"#edf2f7",padding:"2px 8px",borderRadius:6,fontSize:".72rem",color:"#4a5568"}}>{idx.index_type}</span></td>
                              <td style={{color:"#718096",fontFamily:"'JetBrains Mono',monospace"}}>{idx.cardinality !== null ? fmtNum(idx.cardinality) : "—"}</td>
                              <td>
                                <span style={{
                                  background: idx.non_unique===0?"#c6f6d5":"#edf2f7",
                                  color:      idx.non_unique===0?"#276749":"#4a5568",
                                  padding:"2px 10px",borderRadius:20,fontSize:".72rem",fontWeight:700
                                }}>
                                  {idx.non_unique===0 ? "✓ Único" : "No único"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Usuarios / Roles */}
                  <div className="mdb-panel">
                    <div className="mdb-panel-head">
                      <div className="mdb-panel-title"><MdPeople/> Usuarios y roles de la BD</div>
                    </div>
                    <div className="mdb-panel-body">
                      {schema.db_users.length === 0 ? (
                        <div key="roles-info-box" className="mdb-alert-info">
                          ℹ El usuario actual no tiene permisos para leer <code>mysql.user</code>. Esto es normal en Aiven — los roles están configurados correctamente pero no son visibles desde el backend.
                          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                            {[
                              {user:"sl_app",     host:"%",         perms:"SELECT, INSERT, UPDATE, DELETE",  desc:"Backend (Vercel)",          color:"#276749",bg:"#f0fff4",border:"#9ae6b4"},
                              {user:"sl_readonly",host:"%",         perms:"SELECT",                          desc:"Lectura / DBeaver",         color:"#2b6cb0",bg:"#ebf8ff",border:"#90cdf4"},
                              {user:"sl_backup",  host:"localhost", perms:"SELECT, LOCK TABLES",             desc:"Backups programados",       color:"#553c9a",bg:"#f3e8ff",border:"#d6bcfa"},
                            ].map(r => (
                              <div key={r.user} style={{
                                display:"flex",alignItems:"center",justifyContent:"space-between",
                                padding:"10px 14px",borderRadius:8,border:`1px solid ${r.border}`,background:r.bg,flexWrap:"wrap",gap:8
                              }}>
                                <div style={{display:"flex",alignItems:"center",gap:10}}>
                                  <MdVpnKey size={16} style={{color:r.color}}/>
                                  <div>
                                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".83rem",fontWeight:700,color:r.color}}>{r.user}@{r.host}</div>
                                    <div style={{fontSize:".72rem",color:"#718096",marginTop:1}}>{r.desc}</div>
                                  </div>
                                </div>
                                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",color:r.color,background:"white",border:`1px solid ${r.border}`,padding:"3px 10px",borderRadius:6}}>
                                  {r.perms}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {schema.db_users.map(u => (
                            <div key={`${u.username}@${u.host}`} style={{
                              display:"flex",alignItems:"center",gap:10,
                              padding:"10px 14px",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc"
                            }}>
                              <MdVpnKey size={16} style={{color:"#2b6cb0"}}/>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".83rem",fontWeight:600,color:"#1e3a5f"}}>{u.username}</span>
                              <span style={{fontSize:".76rem",color:"#a0aec0"}}>@{u.host}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}