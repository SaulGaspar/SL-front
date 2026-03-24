import React, { useState, useEffect, useCallback } from "react";
import {
  MdRefresh, MdStorage, MdSpeed, MdCheckCircle, MdWarning,
  MdError, MdInfo, MdTableChart, MdMemory, MdQueryStats,
  MdSignalCellularAlt, MdTimer, MdTune, MdDataUsage,
  MdLock, MdBolt, MdCircle, MdSearch,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

/* ─── CSS — tema blanco limpio ─────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

.mdb * { box-sizing: border-box; }
.mdb, .mdb * { font-family: 'Inter', sans-serif; }

.mdb-body  { display:flex; flex-direction:column; gap:20px; }
.mdb-grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.mdb-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.mdb-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

/* ── KPI card ── */
.mdb-stat {
  background:#fff; border:1px solid #e5e7eb; border-radius:12px;
  padding:18px 20px; display:flex; align-items:flex-start; gap:14px;
  box-shadow:0 1px 3px rgba(0,0,0,.06); transition:box-shadow .2s, transform .15s;
}
.mdb-stat:hover { box-shadow:0 4px 12px rgba(0,0,0,.10); transform:translateY(-2px); }
.mdb-stat-ico {
  width:44px; height:44px; border-radius:10px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.3rem;
}
.mdb-stat-ico.blue   { background:#eff6ff; color:#2563eb; }
.mdb-stat-ico.green  { background:#f0fdf4; color:#16a34a; }
.mdb-stat-ico.yellow { background:#fffbeb; color:#d97706; }
.mdb-stat-ico.red    { background:#fef2f2; color:#dc2626; }
.mdb-stat-ico.purple { background:#f5f3ff; color:#7c3aed; }
.mdb-stat-ico.teal   { background:#f0fdfa; color:#0d9488; }
.mdb-stat-ico.coral  { background:#fff7ed; color:#ea580c; }
.mdb-stat-info { display:flex; flex-direction:column; gap:3px; min-width:0; }
.mdb-stat-label { font-size:.72rem; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:.6px; }
.mdb-stat-val   { font-family:'JetBrains Mono',monospace; font-size:1.75rem; font-weight:700; color:#111827; line-height:1.1; }
.mdb-stat-val.sm { font-size:1.2rem; }
.mdb-stat-sub   { font-size:.73rem; color:#9ca3af; margin-top:1px; }

/* ── Panel / card ── */
.mdb-panel {
  background:#fff; border:1px solid #e5e7eb; border-radius:12px;
  overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.06);
}
.mdb-panel-head {
  padding:14px 18px; border-bottom:1px solid #f3f4f6;
  display:flex; align-items:center; justify-content:space-between;
}
.mdb-panel-title { font-size:.8rem; font-weight:700; color:#374151; display:flex; align-items:center; gap:8px; }
.mdb-panel-title svg { color:#2563eb; }
.mdb-panel-body { padding:16px 18px; }
.mdb-badge {
  font-family:'JetBrains Mono',monospace; font-size:.68rem; font-weight:600;
  padding:3px 10px; border-radius:20px; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;
}

/* ── KV rows ── */
.mdb-kv { display:flex; flex-direction:column; gap:6px; }
.mdb-kv-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:8px 12px; background:#f9fafb; border-radius:8px; border:1px solid #f3f4f6;
}
.mdb-kv-key { font-size:.78rem; color:#6b7280; }
.mdb-kv-val { font-family:'JetBrains Mono',monospace; font-size:.8rem; color:#111827; font-weight:600; }

/* ── Table ── */
.mdb-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.mdb-table th {
  padding:10px 14px; text-align:left; font-size:.68rem; font-weight:700;
  color:#6b7280; text-transform:uppercase; letter-spacing:.5px;
  border-bottom:2px solid #f3f4f6; white-space:nowrap; background:#f9fafb;
}
.mdb-table td { padding:10px 14px; border-bottom:1px solid #f9fafb; color:#374151; vertical-align:middle; }
.mdb-table tbody tr:hover td { background:#f9fafb; }
.mdb-table tbody tr:last-child td { border-bottom:none; }
.mdb-mono { font-family:'JetBrains Mono',monospace; }

/* ── Inline bar ── */
.mdb-bw { display:flex; align-items:center; gap:8px; }
.mdb-bt { flex:1; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; min-width:50px; }
.mdb-bf { height:100%; border-radius:3px; transition:width .4s; }
.mdb-bp { font-family:'JetBrains Mono',monospace; font-size:.68rem; color:#9ca3af; min-width:32px; text-align:right; }

/* ── Mini bar chart ── */
.mdb-bchart { display:flex; align-items:flex-end; gap:4px; }
.mdb-bcol   { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; justify-content:flex-end; }
.mdb-bbar   { width:100%; border-radius:3px 3px 0 0; min-height:2px; }
.mdb-blbl   { font-size:.55rem; color:#9ca3af; white-space:nowrap; }

/* ── Checks ── */
.mdb-checks { display:flex; flex-direction:column; gap:6px; }
.mdb-check {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px; border-radius:8px; border:1px solid #f3f4f6; background:#f9fafb;
  transition:border-color .15s;
}
.mdb-check:hover { border-color:#bfdbfe; background:#fff; }
.mdb-check-left { display:flex; align-items:center; gap:10px; }
.mdb-check-name { font-size:.83rem; color:#374151; }
.mdb-cbadge {
  font-family:'JetBrains Mono',monospace; font-size:.72rem; font-weight:700;
  padding:3px 12px; border-radius:20px;
}
.mdb-cbadge.ok    { background:#dcfce7; color:#15803d; }
.mdb-cbadge.warn  { background:#fef9c3; color:#a16207; }
.mdb-cbadge.error { background:#fee2e2; color:#b91c1c; }
.mdb-cbadge.info  { background:#dbeafe; color:#1d4ed8; }

/* ── Ring ── */
.mdb-ring { position:relative; display:inline-flex; align-items:center; justify-content:center; }
.mdb-ring svg { transform:rotate(-90deg); }
.mdb-ring-lbl { position:absolute; text-align:center; line-height:1.2; }

/* ── Tabs ── */
.mdb-tabs { display:flex; gap:0; border-bottom:2px solid #f3f4f6; overflow-x:auto; }
.mdb-tab {
  padding:11px 20px; border:none; background:none; cursor:pointer;
  font-family:'Inter',sans-serif; font-size:.85rem; font-weight:600;
  color:#9ca3af; border-bottom:2px solid transparent; margin-bottom:-2px;
  transition:all .15s; white-space:nowrap;
}
.mdb-tab:hover { color:#374151; }
.mdb-tab.active { color:#2563eb; border-bottom-color:#2563eb; }
.mdb-tab.new-tab { color:#d97706; }
.mdb-tab.new-tab.active { color:#d97706; border-bottom-color:#d97706; }

/* ── Alerts ── */
.mdb-alert-ok   { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-size:.82rem; color:#15803d; }
.mdb-alert-warn { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:10px 14px; font-size:.82rem; color:#92400e; }
.mdb-alert-err  { background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px 14px; font-size:.82rem; color:#b91c1c; }
.mdb-alert-info { background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 14px; font-size:.82rem; color:#1d4ed8; }

/* ── Tags ── */
.tag { display:inline-block; padding:2px 8px; border-radius:12px; font-size:.69rem; font-weight:700; font-family:'JetBrains Mono',monospace; }
.tag-engine { background:#f3f4f6; color:#374151; }
.tag-ok     { background:#dcfce7; color:#15803d; }
.tag-warn   { background:#fef9c3; color:#a16207; }
.tag-err    { background:#fee2e2; color:#b91c1c; }
.tag-info   { background:#dbeafe; color:#1d4ed8; }
.tag-unique { background:#dcfce7; color:#15803d; }
.tag-lock   { background:#fce7f3; color:#be185d; }
.tag-run    { background:#dcfce7; color:#15803d; }
.tag-sleep  { background:#f3f4f6; color:#6b7280; }
.tag-wait   { background:#fef9c3; color:#a16207; }

/* ── Loading ── */
.mdb-loading { display:flex; align-items:center; justify-content:center; min-height:240px; gap:12px; color:#9ca3af; font-size:.9rem; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Donut chart ── */
.mdb-donut { position:relative; display:inline-flex; align-items:center; justify-content:center; }
.mdb-donut svg { transform:rotate(-90deg); }
.mdb-donut-lbl { position:absolute; text-align:center; }

/* ── Section title ── */
.mdb-section-title { font-size:.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.6px; margin-bottom:10px; }

@media(max-width:1024px){ .mdb-grid4{grid-template-columns:1fr 1fr;} .mdb-grid3{grid-template-columns:1fr 1fr;} }
@media(max-width:640px) { .mdb-grid4,.mdb-grid3,.mdb-grid2{grid-template-columns:1fr;} }
`;

/* ─── Helpers — defensivos contra NaN/null/undefined ──────────────── */
const safeNum  = v => (isFinite(Number(v)) ? Number(v) : 0);
const fmtNum   = n => safeNum(n).toLocaleString("es-MX");
const fmtKB    = kb => {
  const v = safeNum(kb);
  if (v === 0) return "0 KB";
  if (v >= 1024 * 1024) return `${(v/1024/1024).toFixed(2)} GB`;
  if (v >= 1024)        return `${(v/1024).toFixed(2)} MB`;
  return `${v.toFixed(1)} KB`;
};
const fmtSec  = s => {
  const v = safeNum(s);
  if (v === 0) return "0ms";
  if (v >= 3600) return `${(v/3600).toFixed(1)}h`;
  if (v >= 60)   return `${(v/60).toFixed(1)}m`;
  if (v >= 1)    return `${v.toFixed(2)}s`;
  return `${(v*1000).toFixed(1)}ms`;
};
const fmtUptime = s => {
  const v = safeNum(s);
  if (!v) return "—";
  const d=Math.floor(v/86400), h=Math.floor((v%86400)/3600), m=Math.floor((v%3600)/60);
  return d>0?`${d}d ${h}h ${m}m`:h>0?`${h}h ${m}m`:`${m}m`;
};
const fmtDate  = v => v ? new Date(v).toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"}) : "—";
const safePct  = (a, b) => { const r = safeNum(b) > 0 ? (safeNum(a)/safeNum(b))*100 : 0; return isFinite(r) ? r : 0; };

function statusIcon(s) {
  if (s==="ok")    return <MdCheckCircle size={16} style={{color:"#16a34a"}} />;
  if (s==="warn")  return <MdWarning     size={16} style={{color:"#d97706"}} />;
  if (s==="error") return <MdError       size={16} style={{color:"#dc2626"}} />;
  return                  <MdInfo        size={16} style={{color:"#2563eb"}} />;
}

/* ── Donut chart ── */
function Donut({ segments=[], size=120, stroke=14, centerLabel, centerSub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + safeNum(s.value), 0) || 1;
  let offset = 0;
  return (
    <div className="mdb-donut" style={{ width:size, height:size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke}/>
        {segments.map((seg, i) => {
          const pct = safeNum(seg.value) / total;
          const dash = pct * circ;
          const gap  = circ - dash;
          const el = (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"/>
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="mdb-donut-lbl">
        {centerLabel && <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:".9rem",color:"#111827"}}>{centerLabel}</div>}
        {centerSub   && <div style={{fontSize:".62rem",color:"#9ca3af",marginTop:1}}>{centerSub}</div>}
      </div>
    </div>
  );
}

/* ── Ring gauge ── */
function Ring({ pct=0, color="#2563eb", size=90, stroke=10, label }) {
  const safe = isFinite(pct) ? pct : 0;
  const r = (size-stroke)/2, circ = 2*Math.PI*r;
  const offset = circ - (safe/100)*circ;
  return (
    <div className="mdb-ring" style={{width:size,height:size}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset .5s ease"}}/>
      </svg>
      <div className="mdb-ring-lbl">
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:".8rem",color}}>{Math.round(safe)}%</div>
        {label&&<div style={{fontSize:".58rem",color:"#9ca3af",marginTop:1}}>{label}</div>}
      </div>
    </div>
  );
}

/* ── Inline bar ── */
function Bar({ pct, color="#2563eb" }) {
  const safe = isFinite(pct) ? Math.min(pct,100) : 0;
  return (
    <div className="mdb-bw">
      <div className="mdb-bt"><div className="mdb-bf" style={{width:`${safe}%`,background:color}}/></div>
      <div className="mdb-bp">{Math.round(safe)}%</div>
    </div>
  );
}

/* ── Legend row ── */
function Legend({ items=[] }) {
  return (
    <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:8}}>
      {items.map(it=>(
        <div key={it.label} style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:10,height:10,borderRadius:2,background:it.color,display:"inline-block",flexShrink:0}}/>
          <span style={{fontSize:".75rem",color:"#6b7280"}}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── KPI stat card ── */
function Stat({ label, value, sub, color="blue", icon }) {
  return (
    <div className="mdb-stat">
      <div className={`mdb-stat-ico ${color}`}>{icon}</div>
      <div className="mdb-stat-info">
        <div className="mdb-stat-label">{label}</div>
        <div className={`mdb-stat-val${String(value).length>9?" sm":""}`}>{value}</div>
        {sub && <div className="mdb-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TAB OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TabOverview({ overview }) {
  const connPct = safePct(overview.server.connections, overview.server.max_connections);
  const tables  = overview.tables || [];
  const maxSize = Math.max(...tables.map(t=>safeNum(t.size_kb)), 1);

  const connColor = connPct>80?"#dc2626":connPct>50?"#d97706":"#2563eb";

  return (
    <>
      <div className="mdb-grid4">
        <Stat label="Tamaño total BD"   value={`${overview.database.size_mb} MB`} sub={`${overview.database.data_mb} datos + ${overview.database.index_mb} índices MB`} color="blue"   icon={<MdStorage/>}/>
        <Stat label="Tablas"            value={overview.database.tables}           sub="en la base de datos"                color="green"  icon={<MdTableChart/>}/>
        <Stat label="Uptime servidor"   value={fmtUptime(overview.server.uptime_seconds)} sub="desde último reinicio"      color="teal"   icon={<MdTimer/>}/>
        <Stat label="Queries totales"   value={fmtNum(overview.server.total_queries)} sub={`${overview.server.slow_queries} lentas`} color="yellow" icon={<MdSpeed/>}/>
      </div>

      <div className="mdb-grid2">
        {/* Info servidor */}
        <div className="mdb-panel">
          <div className="mdb-panel-head">
            <div className="mdb-panel-title"><MdStorage size={16}/> Info del servidor MySQL</div>
            <span className="mdb-badge">v{overview.database.version}</span>
          </div>
          <div className="mdb-panel-body">
            <div className="mdb-kv">
              {[
                {k:"Base de datos",  v:overview.database.name},
                {k:"Versión MySQL",  v:overview.database.version},
                {k:"Charset",        v:overview.database.charset},
                {k:"Uptime",         v:fmtUptime(overview.server.uptime_seconds)},
                {k:"Queries lentas", v:overview.server.slow_queries,
                  badge: overview.server.slow_queries>0
                    ?{t:"⚠ revisar",bg:"#fef9c3",c:"#92400e"}
                    :{t:"✓ ok",     bg:"#dcfce7",c:"#15803d"}},
                {k:"Datos en disco",   v:`${overview.database.data_mb} MB`},
                {k:"Índices en disco", v:`${overview.database.index_mb} MB`},
              ].map(({k,v,badge})=>(
                <div key={k} className="mdb-kv-row">
                  <span className="mdb-kv-key">{k}</span>
                  <span className="mdb-kv-val" style={{display:"flex",alignItems:"center",gap:7}}>
                    {v}
                    {badge&&<span style={{background:badge.bg,color:badge.c,fontSize:".65rem",padding:"2px 8px",borderRadius:12,fontWeight:700}}>{badge.t}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conexiones — card con donut */}
        <div className="mdb-panel">
          <div className="mdb-panel-head">
            <div className="mdb-panel-title"><MdSignalCellularAlt size={16}/> Conexiones activas</div>
            <span className="mdb-badge" style={{background:connPct>80?"#fee2e2":connPct>50?"#fef9c3":"#eff6ff",color:connPct>80?"#b91c1c":connPct>50?"#92400e":"#1d4ed8",borderColor:connPct>80?"#fecaca":connPct>50?"#fde68a":"#bfdbfe"}}>
              {Math.round(connPct)}% uso
            </span>
          </div>
          <div className="mdb-panel-body">
            <div style={{display:"flex",alignItems:"center",gap:24,marginBottom:16,flexWrap:"wrap"}}>
              <Donut
                segments={[
                  {value:overview.server.connections,              color:connColor},
                  {value:overview.server.max_connections - overview.server.connections, color:"#f3f4f6"},
                ]}
                size={110} stroke={16}
                centerLabel={`${overview.server.connections}`}
                centerSub="activas"
              />
              <div className="mdb-kv" style={{flex:1,minWidth:130}}>
                <div className="mdb-kv-row"><span className="mdb-kv-key">Conexiones activas</span><span className="mdb-kv-val" style={{color:connColor}}>{overview.server.connections}</span></div>
                <div className="mdb-kv-row"><span className="mdb-kv-key">Máximo permitido</span><span className="mdb-kv-val">{overview.server.max_connections}</span></div>
                <div className="mdb-kv-row"><span className="mdb-kv-key">Disponibles</span><span className="mdb-kv-val" style={{color:"#16a34a"}}>{safeNum(overview.server.max_connections)-safeNum(overview.server.connections)}</span></div>
              </div>
            </div>
            <Legend items={[{label:"Activas",color:connColor},{label:"Disponibles",color:"#e5e7eb"}]}/>
            {connPct>70
              ?<div className="mdb-alert-warn" style={{marginTop:12}}>⚠ Conexiones elevadas ({Math.round(connPct)}%). Posible cuello de botella.</div>
              :<div className="mdb-alert-ok"   style={{marginTop:12}}>✓ Pool de conexiones saludable.</div>}
          </div>
        </div>
      </div>

      {/* Top tablas */}
      {/* ── Gráfica de barras: tamaño total por tabla (datos + índices apilados) ── */}
      <div className="mdb-panel">
        <div className="mdb-panel-head">
          <div className="mdb-panel-title"><MdDataUsage size={16}/> Tamaño por tabla — datos vs índices (KB)</div>
          <div style={{display:"flex",gap:14}}>
            <span style={{display:"flex",alignItems:"center",gap:5,fontSize:".72rem",color:"#6b7280"}}><span style={{width:10,height:10,borderRadius:2,background:"#2563eb",display:"inline-block"}}/>Datos</span>
            <span style={{display:"flex",alignItems:"center",gap:5,fontSize:".72rem",color:"#6b7280"}}><span style={{width:10,height:10,borderRadius:2,background:"#a78bfa",display:"inline-block"}}/>Índices</span>
          </div>
        </div>
        <div className="mdb-panel-body">
          {(() => {
            const sorted = [...tables].filter(t=>safeNum(t.size_kb)>0).sort((a,b)=>safeNum(b.size_kb)-safeNum(a.size_kb));
            const maxKB  = Math.max(...sorted.map(t=>safeNum(t.size_kb)),1);
            const BAR_H  = 22;
            const GAP    = 10;
            const LABEL_W = 110;
            const VAL_W   = 56;
            return (
              <div style={{overflowX:"auto"}}>
                <div style={{minWidth:360}}>
                  {sorted.map((t,i)=>{
                    const dataPx  = safePct(safeNum(t.data_kb),  maxKB);
                    const idxPx   = safePct(safeNum(t.index_kb), maxKB);
                    return (
                      <div key={t.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:GAP}}>
                        <div style={{width:LABEL_W,flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",color:"#374151",textAlign:"right",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                        <div style={{flex:1,height:BAR_H,display:"flex",borderRadius:4,overflow:"hidden",background:"#f3f4f6"}}>
                          <div style={{width:`${dataPx}%`,background:"#2563eb",transition:"width .4s"}}/>
                          <div style={{width:`${idxPx}%`,background:"#a78bfa",transition:"width .4s"}}/>
                        </div>
                        <div style={{width:VAL_W,flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",color:"#6b7280",textAlign:"right"}}>{fmtKB(t.size_kb)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Gráfica de barras: filas por tabla ── */}
      <div className="mdb-panel">
        <div className="mdb-panel-head">
          <div className="mdb-panel-title"><MdTableChart size={16}/> Filas por tabla (estimado)</div>
          <span className="mdb-badge">information_schema</span>
        </div>
        <div className="mdb-panel-body">
          {(() => {
            const sorted  = [...tables].filter(t=>safeNum(t.rows)>0).sort((a,b)=>safeNum(b.rows)-safeNum(a.rows));
            const maxRows = Math.max(...sorted.map(t=>safeNum(t.rows)),1);
            const BAR_H   = 22;
            const GAP     = 10;
            const LABEL_W = 110;
            const VAL_W   = 70;
            const COLORS  = ["#f59e0b","#f97316","#8b5cf6","#06b6d4","#10b981","#ec4899","#64748b","#0ea5e9","#84cc16","#ef4444"];
            return (
              <div style={{overflowX:"auto"}}>
                <div style={{minWidth:360}}>
                  {sorted.map((t,i)=>{
                    const pct = safePct(safeNum(t.rows), maxRows);
                    const c   = COLORS[i % COLORS.length];
                    return (
                      <div key={t.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:GAP}}>
                        <div style={{width:LABEL_W,flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",color:"#374151",textAlign:"right",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                        <div style={{flex:1,height:BAR_H,borderRadius:4,overflow:"hidden",background:"#f3f4f6"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:4,transition:"width .4s"}}/>
                        </div>
                        <div style={{width:VAL_W,flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",color:"#6b7280",textAlign:"right"}}>{fmtNum(t.rows)} filas</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Distribución datos vs índices + overhead por tabla */}
      {(() => {
        const total_size  = tables.reduce((a,t)=>a+safeNum(t.size_kb),0);
        const total_data  = tables.reduce((a,t)=>a+safeNum(t.data_kb),0);
        const total_index = tables.reduce((a,t)=>a+safeNum(t.index_kb),0);
        const dataPct     = safePct(total_data,  total_size);
        const indexPct    = safePct(total_index, total_size);
        const withRatio   = tables.map(t=>({...t, idx_ratio: safeNum(t.data_kb)>0 ? safePct(safeNum(t.index_kb),safeNum(t.data_kb)) : 0}));
        const avgRatio    = withRatio.length>0 ? withRatio.reduce((a,t)=>a+t.idx_ratio,0)/withRatio.length : 0;
        return (
          <div className="mdb-grid2">
            {/* Donut distribución */}
            <div className="mdb-panel">
              <div className="mdb-panel-head"><div className="mdb-panel-title"><MdDataUsage size={16}/> Distribución: datos vs índices</div></div>
              <div className="mdb-panel-body">
                <div style={{display:"flex",alignItems:"center",gap:28}}>
                  <Donut
                    segments={[{value:total_data,color:"#2563eb"},{value:total_index,color:"#7c3aed"}]}
                    size={110} stroke={16}
                    centerLabel={`${Math.round(dataPct)}%`}
                    centerSub="datos"
                  />
                  <div style={{flex:1}}>
                    {[
                      {label:"Datos reales",  val:total_data,  color:"#2563eb", pct:dataPct},
                      {label:"Índices",        val:total_index, color:"#7c3aed", pct:indexPct},
                    ].map(x=>(
                      <div key={x.label} style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".78rem"}}>
                          <span style={{color:x.color,fontWeight:600}}>● {x.label}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#374151"}}>{fmtKB(x.val)}</span>
                        </div>
                        <div style={{height:7,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${x.pct}%`,background:x.color,borderRadius:4}}/>
                        </div>
                      </div>
                    ))}
                    <div className="mdb-kv-row" style={{marginTop:4}}>
                      <span className="mdb-kv-key">Ratio índice/dato promedio</span>
                      <span className="mdb-kv-val" style={{color:avgRatio>60?"#d97706":"#16a34a"}}>{avgRatio.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                {avgRatio>100
                  ?<div className="mdb-alert-info" style={{marginTop:12}}>ℹ Índices {">"} datos: normal en BDs pequeñas. MySQL reserva espacio mínimo por índice aunque haya pocos registros.</div>
                  :avgRatio>60
                  ?<div className="mdb-alert-warn" style={{marginTop:12}}>⚠ Ratio elevado. Posibles índices redundantes.</div>
                  :<div className="mdb-alert-ok"   style={{marginTop:12}}>✓ Distribución saludable entre datos e índices.</div>
                }
              </div>
            </div>

            {/* Overhead índices por tabla */}
            <div className="mdb-panel">
              <div className="mdb-panel-head"><div className="mdb-panel-title"><MdTune size={16}/> Overhead de índices por tabla</div><span className="mdb-badge">ratio idx/dato</span></div>
              <div className="mdb-panel-body">
                {withRatio.filter(t=>safeNum(t.size_kb)>0).sort((a,b)=>b.idx_ratio-a.idx_ratio).slice(0,8).map(t=>{
                  const c=t.idx_ratio>80?"#dc2626":t.idx_ratio>40?"#d97706":"#16a34a";
                  const barW=Math.min(t.idx_ratio,500)/5; // cap visual at 100% width even if ratio is 500%
                  return (
                    <div key={t.name} style={{marginBottom:9}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".76rem"}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#374151"}}>{t.name}</span>
                        <span style={{color:c,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{t.idx_ratio.toFixed(0)}%</span>
                      </div>
                      <div style={{height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.min(barW,100)}%`,background:c,borderRadius:3}}/>
                      </div>
                    </div>
                  );
                })}
                <div style={{fontSize:".7rem",color:"#9ca3af",marginTop:8}}>En BDs pequeñas el ratio alto es normal — MySQL reserva espacio mínimo por índice.</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tabla completa */}
      <div className="mdb-panel">
        <div className="mdb-panel-head"><div className="mdb-panel-title"><MdTableChart size={16}/> Todas las tablas</div><span className="mdb-badge">{overview.database.size_mb} MB total</span></div>
        <div style={{overflowX:"auto"}}>
          <table className="mdb-table">
            <thead><tr><th>#</th><th>Tabla</th><th>Motor</th><th>Filas est.</th><th>Tamaño</th><th style={{minWidth:120}}>% total</th><th>Datos</th><th>Índices</th><th>Modificada</th></tr></thead>
            <tbody>
              {tables.map((t,i)=>{
                const pct=safePct(safeNum(t.size_kb),maxSize);
                const barC=pct>60?"#2563eb":pct>30?"#7c3aed":"#059669";
                return (
                  <tr key={t.name}>
                    <td style={{color:"#9ca3af",fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem"}}>{i+1}</td>
                    <td><strong style={{color:"#111827",fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem"}}>{t.name}</strong></td>
                    <td><span className="tag tag-engine">{t.engine}</span></td>
                    <td className="mdb-mono">{fmtNum(t.rows)}</td>
                    <td className="mdb-mono" style={{color:"#111827",fontWeight:600}}>{fmtKB(t.size_kb)}</td>
                    <td><Bar pct={pct} color={barC}/></td>
                    <td className="mdb-mono" style={{color:"#6b7280"}}>{fmtKB(t.data_kb)}</td>
                    <td className="mdb-mono" style={{color:"#6b7280"}}>{fmtKB(t.index_kb)}</td>
                    <td style={{fontSize:".72rem",color:"#9ca3af"}}>{fmtDate(t.updated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TAB PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TabPerformance({ perf }) {
  if (!perf) return <div className="mdb-alert-info">Cargando datos de performance…</div>;
  const hitRate  = perf.buffer?.hit_rate_pct ?? null;
  const hitC     = hitRate===null?"#6b7280":hitRate>=95?"#16a34a":hitRate>=80?"#d97706":"#dc2626";
  const maxOps   = Math.max(...(perf.table_io||[]).map(t=>safeNum(t.total_ops)),1);
  const fullScan = safeNum(perf.efficiency?.full_scan_ratio_pct);
  const tmpDisk  = safeNum(perf.efficiency?.tmp_disk_ratio_pct);

  /* operaciones para gráfica de barras */
  const ops = [
    {label:"Leídas",      val:safeNum(perf.operations?.rows_read),      color:"#2563eb"},
    {label:"Insertadas",  val:safeNum(perf.operations?.rows_inserted),   color:"#16a34a"},
    {label:"Actualizadas",val:safeNum(perf.operations?.rows_updated),    color:"#d97706"},
    {label:"Eliminadas",  val:safeNum(perf.operations?.rows_deleted),    color:"#dc2626"},
  ];
  const maxOp = Math.max(...ops.map(o=>o.val), 1);

  /* eficiencia para gráfica de barras */
  const effItems = [
    {label:"Full table scans",   val:safeNum(perf.efficiency?.select_scan),        max:Math.max(safeNum(perf.efficiency?.select_scan),1),      color:"#d97706", warn:v=>v>500},
    {label:"Joins sin índice",   val:safeNum(perf.efficiency?.select_full_join),   max:Math.max(safeNum(perf.efficiency?.select_full_join),1),  color:"#dc2626", warn:v=>v>0},
    {label:"Sort merge passes",  val:safeNum(perf.efficiency?.sort_merge_passes),  max:Math.max(safeNum(perf.efficiency?.sort_merge_passes),1), color:"#7c3aed", warn:v=>v>100},
    {label:"Table locks wait",   val:safeNum(perf.locks?.lock_waited),             max:Math.max(safeNum(perf.locks?.lock_waited),1),            color:"#f97316", warn:v=>v>0},
  ];

  return (
    <>
      {/* KPIs */}
      <div className="mdb-grid4">
        <Stat label="Buffer pool hit rate" value={hitRate!==null?`${hitRate}%`:"N/D"} sub={hitRate>=95?"✓ Excelente":hitRate>=80?"⚠ Aceptable":"❌ Miss frecuente → disco"} color={hitRate===null?"teal":hitRate>=95?"green":hitRate>=80?"yellow":"red"} icon={<MdMemory/>}/>
        <Stat label="Row lock waits"       value={fmtNum(perf.locks?.waits)}          sub={`promedio ${fmtNum(perf.locks?.avg_wait_ms)} ms`}    color={safeNum(perf.locks?.waits)>0?"yellow":"green"} icon={<MdBolt/>}/>
        <Stat label="Full scan ratio"      value={`${fullScan}%`}                     sub={fullScan>30?"⚠ Muchos scans sin índice":"✓ Buen uso de índices"} color={fullScan>30?"yellow":"green"} icon={<MdSearch/>}/>
        <Stat label="Tmp tables en disco"  value={`${tmpDisk}%`}                      sub={tmpDisk>20?"⚠ Aumentar tmp_table_size":"✓ Dentro de memoria"} color={tmpDisk>20?"yellow":"green"} icon={<MdStorage/>}/>
      </div>

      {/* Fila 1: Buffer pool + Operaciones de filas */}
      <div className="mdb-grid2">
        {/* Buffer pool InnoDB */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdMemory size={16}/> Buffer pool InnoDB</div><span className="mdb-badge">cache en RAM</span></div>
          <div className="mdb-panel-body">
            <div style={{display:"flex",alignItems:"center",gap:22,marginBottom:16}}>
              <Donut
                segments={hitRate!==null
                  ?[{value:hitRate,color:hitC},{value:100-hitRate,color:"#f3f4f6"}]
                  :[{value:1,color:"#e5e7eb"}]}
                size={110} stroke={16}
                centerLabel={hitRate!==null?`${hitRate}%`:"N/D"}
                centerSub="hit rate"
              />
              <div style={{flex:1}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"2rem",fontWeight:700,color:hitC}}>{hitRate!==null?`${hitRate}%`:"N/D"}</div>
                <div style={{fontSize:".8rem",color:"#6b7280",marginTop:4,lineHeight:1.4}}>
                  {hitRate>=95?"✓ Todo se lee desde RAM — mínimas lecturas a disco":
                   hitRate>=80?"⚠ Mayoría en RAM — algunos miss al disco":
                   hitRate!==null?"❌ Muchas lecturas al disco — la BD es lenta":"Sin datos de performance_schema"}
                </div>
              </div>
            </div>
            <Legend items={[{label:"Hit (RAM)",color:hitC},{label:"Miss (disco)",color:"#e5e7eb"}]}/>
            <div className="mdb-kv" style={{marginTop:12}}>
              <div className="mdb-kv-row"><span className="mdb-kv-key">Lecturas que fueron al disco</span><span className="mdb-kv-val" style={{color:safeNum(perf.buffer?.reads_from_disk)>0?"#d97706":"#16a34a"}}>{fmtNum(perf.buffer?.reads_from_disk)}</span></div>
              <div className="mdb-kv-row"><span className="mdb-kv-key">Total de requests de lectura</span><span className="mdb-kv-val">{fmtNum(perf.buffer?.total_requests)}</span></div>
              <div className="mdb-kv-row"><span className="mdb-kv-key">Páginas activas en buffer</span><span className="mdb-kv-val">{fmtNum(perf.buffer?.pages_data)}</span></div>
              <div className="mdb-kv-row"><span className="mdb-kv-key">Capacidad total del buffer</span><span className="mdb-kv-val">{fmtNum(perf.buffer?.pages_total)} páginas</span></div>
            </div>
            <div style={{marginTop:10,padding:"8px 12px",background:"#f9fafb",borderRadius:7,border:"1px solid #f3f4f6",fontSize:".72rem",color:"#6b7280"}}>
              💡 Si el hit rate baja de 95%, aumentar <code style={{fontFamily:"'JetBrains Mono',monospace",color:"#2563eb"}}>innodb_buffer_pool_size</code> en la config de MySQL.
            </div>
          </div>
        </div>

        {/* Operaciones de filas InnoDB */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdQueryStats size={16}/> Operaciones de filas InnoDB</div><span className="mdb-badge">acumulado desde reinicio</span></div>
          <div className="mdb-panel-body">
            <div style={{marginBottom:16}}>
              {ops.map(o=>(
                <div key={o.label} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".78rem"}}>
                    <span style={{color:o.color,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:8,height:8,borderRadius:2,background:o.color,display:"inline-block"}}/>
                      Filas {o.label.toLowerCase()}
                    </span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#111827",fontWeight:700}}>{fmtNum(o.val)}</span>
                  </div>
                  <div style={{height:10,background:"#f3f4f6",borderRadius:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${safePct(o.val,maxOp)}%`,background:o.color,borderRadius:5,transition:"width .4s"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 12px",background:"#f9fafb",borderRadius:8,border:"1px solid #f3f4f6"}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".5px",marginBottom:6}}>Total acumulado</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {ops.map(o=>(
                  <div key={o.label} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".85rem",fontWeight:700,color:o.color}}>{fmtNum(o.val)}</div>
                    <div style={{fontSize:".65rem",color:"#9ca3af"}}>{o.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 2: Eficiencia de queries + Top I/O tablas */}
      <div className="mdb-grid2">
        {/* Eficiencia de queries */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdSpeed size={16}/> Eficiencia de consultas</div><span className="mdb-badge">SHOW STATUS</span></div>
          <div className="mdb-panel-body">
            {effItems.map(e=>{
              const isWarn = e.warn(e.val);
              return (
                <div key={e.label} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:".78rem",color:isWarn?e.color:"#374151",fontWeight:isWarn?600:400}}>{e.label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",fontWeight:700,color:isWarn?e.color:"#111827"}}>{fmtNum(e.val)}</span>
                      {isWarn
                        ?<span style={{background:"#fef9c3",color:"#92400e",fontSize:".65rem",fontWeight:700,padding:"1px 7px",borderRadius:12}}>⚠</span>
                        :<span style={{background:"#dcfce7",color:"#15803d",fontSize:".65rem",fontWeight:700,padding:"1px 7px",borderRadius:12}}>✓</span>}
                    </div>
                  </div>
                  <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:e.val===0?"4px":`${Math.min(safePct(e.val,e.max),100)}%`,background:isWarn?e.color:"#d1fae5",borderRadius:4,transition:"width .4s"}}/>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:4,padding:"8px 12px",background:"#f9fafb",borderRadius:7,border:"1px solid #f3f4f6"}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>Qué significa cada métrica</div>
              <div style={{fontSize:".71rem",color:"#9ca3af",lineHeight:1.6}}>
                <b style={{color:"#374151"}}>Full scans</b> — queries sin índice, escanean toda la tabla.<br/>
                <b style={{color:"#374151"}}>Joins sin índice</b> — JOINs que no usan índice en la columna de unión.<br/>
                <b style={{color:"#374151"}}>Sort merge passes</b> — ordenamientos que se fueron al disco por falta de RAM.<br/>
                <b style={{color:"#374151"}}>Table locks wait</b> — consultas que esperaron por un lock de tabla.
              </div>
            </div>
          </div>
        </div>

        {/* Top tablas por I/O */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdBolt size={16}/> Tablas más accedidas (I/O real)</div><span className="mdb-badge">performance_schema</span></div>
          <div className="mdb-panel-body">
            {!perf.table_io?.length?(
              <div className="mdb-alert-info">performance_schema sin datos de I/O. Normal en Aiven tier gratuito.</div>
            ):(
              <>
                {perf.table_io.slice(0,8).map((t,i)=>{
                  const wratio = safeNum(t.total_ops)>0?safePct(safeNum(t.writes),safeNum(t.total_ops)):0;
                  const pct    = safePct(safeNum(t.total_ops), maxOps);
                  const COLORS = ["#2563eb","#7c3aed","#059669","#d97706","#dc2626","#0d9488","#f97316","#8b5cf6"];
                  return (
                    <div key={t.table_name} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".75rem"}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",color:COLORS[i%COLORS.length],fontWeight:600}}>{i+1}. {t.table_name}</span>
                        <span style={{color:"#6b7280"}}>{fmtNum(t.total_ops)} ops</span>
                      </div>
                      {/* barra apilada lecturas/escrituras */}
                      <div style={{height:12,borderRadius:6,overflow:"hidden",display:"flex",background:"#f3f4f6"}}>
                        <div style={{width:`${(100-wratio)*pct/100}%`,background:"#2563eb",opacity:.8}}/>
                        <div style={{width:`${wratio*pct/100}%`,background:"#d97706",opacity:.8}}/>
                      </div>
                      <div style={{display:"flex",gap:12,marginTop:3,fontSize:".63rem",color:"#9ca3af"}}>
                        <span style={{color:"#2563eb"}}>R: {fmtNum(t.reads)}</span>
                        <span style={{color:"#d97706"}}>W: {fmtNum(t.writes)}</span>
                        <span>lectura: {fmtSec(t.read_sec)}</span>
                        <span>escritura: {fmtSec(t.write_sec)}</span>
                      </div>
                    </div>
                  );
                })}
                <Legend items={[{label:"Lecturas",color:"#2563eb"},{label:"Escrituras",color:"#d97706"}]}/>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TAB PROCESOS — conexiones, locks, transacciones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TabProcesses({ proc }) {
  if (!proc) return <div className="mdb-alert-info">Cargando procesos activos…</div>;
  const { processes=[], transactions=[], locks=[], summary={} } = proc;
  const sleepCount  = processes.filter(p=>p.command==="Sleep").length;
  const activeCount = processes.filter(p=>p.command!=="Sleep").length;
  const longQuery   = processes.filter(p=>safeNum(p.time_sec)>10 && p.command==="Query");
  const execCount   = processes.filter(p=>p.command==="Execute"||p.command==="Query").length;
  const otherCount  = processes.filter(p=>p.command!=="Sleep"&&p.command!=="Execute"&&p.command!=="Query").length;

  const connGroups = [
    {label:"Sleep (esperando)", count:sleepCount,  color:"#94a3b8", desc:"Conexiones Vercel en espera — normal"},
    {label:"Execute / Query",   count:execCount,   color:"#2563eb", desc:"Consultas ejecutándose ahora mismo"},
    {label:"Otras",             count:otherCount,  color:"#d97706", desc:"Comandos administrativos"},
  ].filter(g=>g.count>0);
  const maxConn = Math.max(...connGroups.map(g=>g.count), 1);

  const lockByMode  = {};
  locks.forEach(l=>{ lockByMode[l.lock_mode]=(lockByMode[l.lock_mode]||0)+1; });
  const lockColors  = {ExclusiveLock:"#dc2626",AccessShareLock:"#2563eb",ShareLock:"#16a34a",RowExclusiveLock:"#d97706"};
  const maxLock     = Math.max(...Object.values(lockByMode),1);

  const totalRowsLocked    = transactions.reduce((a,t)=>a+safeNum(t.rows_locked),0);
  const totalRowsModified  = transactions.reduce((a,t)=>a+safeNum(t.rows_modified),0);
  const byState = {};
  transactions.forEach(t=>{ byState[t.state]=(byState[t.state]||0)+1; });
  const trxColors = {RUNNING:"#16a34a",LOCK_WAIT:"#dc2626",ROLLING_BACK:"#d97706"};
  const maxT = Math.max(...Object.values(byState),1);

  /* tiempo promedio de conexiones sleep */
  const sleepTimes = processes.filter(p=>p.command==="Sleep").map(p=>safeNum(p.time_sec));
  const avgSleep   = sleepTimes.length ? Math.round(sleepTimes.reduce((a,b)=>a+b,0)/sleepTimes.length) : 0;
  const maxSleep   = sleepTimes.length ? Math.max(...sleepTimes) : 0;

  return (
    <>
      {/* KPIs */}
      <div className="mdb-grid4">
        <Stat label="Total conexiones" value={summary.total_processes||0}    sub={`${sleepCount} sleep · ${activeCount} activas`}           color="blue"   icon={<MdCircle/>}/>
        <Stat label="Locks activos"    value={summary.total_locks||0}        sub={locks.length>0?"⚠ revisar bloqueos":"✓ sin bloqueos"}      color={locks.length>0?"red":"green"} icon={<MdLock/>}/>
        <Stat label="Transacciones"    value={summary.total_transactions||0} sub={`${fmtNum(totalRowsLocked)} filas bloqueadas`}             color={totalRowsLocked>0?"yellow":"green"} icon={<MdBolt/>}/>
        <Stat label="Queries activas"  value={longQuery.length}              sub={longQuery.length>0?"⚠ llevan +10s":"✓ sin queries lentas"} color={longQuery.length>0?"red":"green"} icon={<MdTimer/>}/>
      </div>

      {longQuery.length>0&&(
        <div className="mdb-alert-err">
          <strong>⚠ {longQuery.length} query(ies) reales llevan más de 10 segundos ejecutándose.</strong>
          {longQuery.map(p=>(
            <div key={p.id} style={{marginTop:5,padding:"4px 10px",background:"rgba(0,0,0,.05)",borderRadius:5,fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem"}}>
              ID:{p.id} · {p.db_user} · {fmtSec(p.time_sec)} · {p.state||p.command}
            </div>
          ))}
        </div>
      )}

      <div className="mdb-grid3">

        {/* ── SECCIÓN 1: Conexiones ── */}
        <div className="mdb-panel">
          <div className="mdb-panel-head">
            <div className="mdb-panel-title"><MdSignalCellularAlt size={16}/> Conexiones activas</div>
            <span className="mdb-badge">{summary.total_processes||0} total</span>
          </div>
          <div className="mdb-panel-body">
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:16}}>
              <Donut segments={connGroups.map(g=>({value:g.count,color:g.color}))} size={100} stroke={14} centerLabel={`${summary.total_processes||0}`} centerSub="conexiones"/>
              <div style={{flex:1}}>
                {connGroups.map(g=>(
                  <div key={g.label} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:".75rem"}}>
                      <span style={{color:g.color,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                        <span style={{width:8,height:8,borderRadius:2,background:g.color,display:"inline-block"}}/>
                        {g.label}
                      </span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#111827"}}>{g.count}</span>
                    </div>
                    <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${safePct(g.count,maxConn)}%`,background:g.color,borderRadius:4,transition:"width .4s"}}/>
                    </div>
                    <div style={{fontSize:".63rem",color:"#9ca3af",marginTop:2}}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* métricas de sleep */}
            {sleepCount>0&&(
              <div className="mdb-kv" style={{marginBottom:10}}>
                <div className="mdb-kv-row"><span className="mdb-kv-key">Tiempo promedio en Sleep</span><span className="mdb-kv-val">{fmtSec(avgSleep)}</span></div>
                <div className="mdb-kv-row"><span className="mdb-kv-key">Conexión más antigua</span><span className="mdb-kv-val" style={{color:maxSleep>600?"#d97706":"#374151"}}>{fmtSec(maxSleep)}</span></div>
                <div className="mdb-kv-row"><span className="mdb-kv-key">IPs distintas conectadas</span><span className="mdb-kv-val">{new Set(processes.map(p=>(p.host||"").split(":")[0])).size}</span></div>
              </div>
            )}
            {sleepCount>0&&longQuery.length===0
              ?<div className="mdb-alert-ok" style={{fontSize:".74rem"}}>✓ Sleep es normal — Vercel mantiene conexiones abiertas entre requests para evitar latencia de reconexión.</div>
              :sleepCount===0&&<div className="mdb-alert-ok" style={{fontSize:".74rem"}}>✓ Sin conexiones en espera.</div>
            }
          </div>
        </div>

        {/* ── SECCIÓN 2: Locks ── */}
        <div className="mdb-panel">
          <div className="mdb-panel-head">
            <div className="mdb-panel-title"><MdLock size={16} style={{color:locks.length>0?"#dc2626":"#2563eb"}}/> Bloqueos (Locks)</div>
            <span className="mdb-badge" style={{background:locks.length>0?"#fee2e2":"#f0fdf4",color:locks.length>0?"#b91c1c":"#15803d",borderColor:locks.length>0?"#fecaca":"#bbf7d0"}}>{locks.length} activos</span>
          </div>
          <div className="mdb-panel-body">
            {locks.length===0?(
              <>
                <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                  <Donut segments={[{value:1,color:"#dcfce7"}]} size={90} stroke={14} centerLabel="0" centerSub="locks"/>
                </div>
                <div className="mdb-kv" style={{marginBottom:10}}>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Row lock waits totales</span><span className="mdb-kv-val">{fmtNum(summary.lock_waits||0)}</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Table locks inmediatos</span><span className="mdb-kv-val">{fmtNum(summary.lock_immediate||0)}</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Table locks esperados</span><span className="mdb-kv-val" style={{color:safeNum(summary.lock_waited)>0?"#dc2626":"#16a34a"}}>{fmtNum(summary.lock_waited||0)}</span></div>
                </div>
                <div className="mdb-alert-ok" style={{fontSize:".74rem"}}>✓ Sin bloqueos activos — no hay cuellos de botella entre transacciones.</div>
              </>
            ):(
              <>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                  <Donut segments={Object.entries(lockByMode).map(([m,c])=>({value:c,color:lockColors[m]||"#6b7280"}))} size={90} stroke={14} centerLabel={`${locks.length}`} centerSub="locks"/>
                  <div style={{flex:1}}>
                    {Object.entries(lockByMode).map(([mode,count])=>(
                      <div key={mode} style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:".73rem"}}>
                          <span style={{color:lockColors[mode]||"#6b7280",fontWeight:600}}>{mode}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{count}</span>
                        </div>
                        <div style={{height:7,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${safePct(count,maxLock)}%`,background:lockColors[mode]||"#6b7280",borderRadius:3}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:"8px 12px",background:"#f9fafb",borderRadius:7,border:"1px solid #f3f4f6",fontSize:".71rem",color:"#6b7280",marginBottom:10}}>
                  <b style={{color:"#374151"}}>ExclusiveLock</b> = escritura, bloquea todo.<br/>
                  <b style={{color:"#374151"}}>AccessShareLock</b> = lectura normal, no bloquea otras lecturas.<br/>
                  <b style={{color:"#374151"}}>ShareLock</b> = lectura con bloqueo de escritura.
                </div>
                <div className="mdb-alert-warn" style={{fontSize:".74rem"}}>⚠ Hay bloqueos — pueden causar esperas entre transacciones.</div>
              </>
            )}
          </div>
        </div>

        {/* ── SECCIÓN 3: Transacciones ── */}
        <div className="mdb-panel">
          <div className="mdb-panel-head">
            <div className="mdb-panel-title"><MdBolt size={16}/> Transacciones InnoDB</div>
            <span className="mdb-badge">{transactions.length} en curso</span>
          </div>
          <div className="mdb-panel-body">
            {transactions.length===0?(
              <>
                <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                  <Donut segments={[{value:1,color:"#dcfce7"}]} size={90} stroke={14} centerLabel="0" centerSub="trx"/>
                </div>
                <div className="mdb-kv" style={{marginBottom:10}}>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Filas bloqueadas ahora</span><span className="mdb-kv-val" style={{color:"#16a34a"}}>0</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Filas modificadas</span><span className="mdb-kv-val">0</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Tablas en uso</span><span className="mdb-kv-val">0</span></div>
                </div>
                <div className="mdb-alert-ok" style={{fontSize:".74rem"}}>✓ Sin transacciones abiertas — no hay operaciones pendientes de commit.</div>
              </>
            ):(
              <>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                  <Donut segments={Object.entries(byState).map(([s,c])=>({value:c,color:trxColors[s]||"#6b7280"}))} size={90} stroke={14} centerLabel={`${transactions.length}`} centerSub="trx"/>
                  <div style={{flex:1}}>
                    {Object.entries(byState).map(([state,count])=>(
                      <div key={state} style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:".73rem"}}>
                          <span style={{color:trxColors[state]||"#6b7280",fontWeight:600}}>{state}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{count}</span>
                        </div>
                        <div style={{height:7,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${safePct(count,maxT)}%`,background:trxColors[state]||"#6b7280",borderRadius:3}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mdb-kv" style={{marginBottom:10}}>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Total filas bloqueadas</span><span className="mdb-kv-val" style={{color:totalRowsLocked>0?"#dc2626":"#16a34a"}}>{fmtNum(totalRowsLocked)}</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Total filas modificadas</span><span className="mdb-kv-val">{fmtNum(totalRowsModified)}</span></div>
                  <div className="mdb-kv-row"><span className="mdb-kv-key">Tablas en uso</span><span className="mdb-kv-val">{fmtNum(transactions.reduce((a,t)=>a+safeNum(t.tables_in_use),0))}</span></div>
                </div>
                {totalRowsLocked>0&&<div className="mdb-alert-warn" style={{fontSize:".74rem"}}>⚠ Hay filas bloqueadas — otras queries que necesiten esas filas tendrán que esperar.</div>}
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TAB INTEGRIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TabIntegrity({ integrity }) {
  const checks    = integrity.checks || [];
  const int_ok    = checks.filter(c=>c.status==="ok").length;
  const int_info  = checks.filter(c=>c.status==="info").length;
  const int_warn  = checks.filter(c=>c.status==="warn").length;
  const int_error = checks.filter(c=>c.status==="error").length;
  const health    = Math.round(safePct(int_ok, checks.length));
  const totalIssues = int_warn + int_error;

  /* agrupar checks por categoría para la gráfica de barras */
  const checksByStatus = [
    {label:"OK",          count:int_ok,    color:"#16a34a"},
    {label:"Informativo", count:int_info,  color:"#2563eb"},
    {label:"Advertencia", count:int_warn,  color:"#d97706"},
    {label:"Error",       count:int_error, color:"#dc2626"},
  ].filter(g=>g.count>0);
  const maxCheck = Math.max(...checksByStatus.map(g=>g.count), 1);

  /* checks con valor > 0 para gráfica de barras de afectados */
  const checksWithValue = checks.filter(c=>safeNum(c.value)>0);
  const maxVal = Math.max(...checksWithValue.map(c=>safeNum(c.value)), 1);

  return (
    <>
      {/* KPIs */}
      <div className="mdb-grid4">
        <Stat label="Health score"     value={`${health}%`}  sub={health>=80?"BD en buen estado":health>=50?"Requiere atención":"Problemas detectados"} color={health>=80?"green":health>=50?"yellow":"red"} icon={<MdCheckCircle/>}/>
        <Stat label="Checks OK"        value={int_ok}        sub={`de ${checks.length} verificaciones`} color="green"  icon={<MdCheckCircle/>}/>
        <Stat label="Advertencias"     value={int_warn}      sub="revisar pronto"                       color={int_warn>0?"yellow":"green"}  icon={<MdWarning/>}/>
        <Stat label="Errores críticos" value={int_error}     sub="atención inmediata"                   color={int_error>0?"red":"green"}    icon={<MdError/>}/>
      </div>

      {/* Fila 1: health score + distribución de checks */}
      <div className="mdb-grid2">

        {/* Health score */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdTimer size={16}/> Health score de la BD</div></div>
          <div className="mdb-panel-body">
            <div style={{display:"flex",alignItems:"center",gap:22,marginBottom:16}}>
              <Donut
                segments={[
                  {value:int_ok,    color:"#16a34a"},
                  {value:int_info,  color:"#2563eb"},
                  {value:int_warn,  color:"#d97706"},
                  {value:int_error, color:"#dc2626"},
                  {value:Math.max(checks.length-int_ok-int_info-int_warn-int_error,0), color:"#f3f4f6"},
                ]}
                size={120} stroke={18}
                centerLabel={`${health}%`}
                centerSub="salud"
              />
              <div style={{flex:1}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"2.4rem",fontWeight:700,color:health>=80?"#16a34a":health>=50?"#d97706":"#dc2626",lineHeight:1}}>
                  {health}<span style={{fontSize:"1rem",color:"#9ca3af"}}>/100</span>
                </div>
                <div style={{fontSize:".85rem",color:health>=80?"#16a34a":health>=50?"#d97706":"#dc2626",marginTop:6,fontWeight:600}}>
                  {health>=80?"✓ Base de datos saludable":health>=50?"⚠ Requiere atención":"❌ Problemas detectados"}
                </div>
                <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden",marginTop:12}}>
                  <div style={{height:"100%",width:`${health}%`,background:health>=80?"#16a34a":health>=50?"#d97706":"#dc2626",borderRadius:4,transition:"width .5s"}}/>
                </div>
                <div style={{fontSize:".72rem",color:"#9ca3af",marginTop:6}}>
                  {int_ok} ok · {int_info} info · {int_warn} warn · {int_error} error
                </div>
              </div>
            </div>
            {/* Barra de distribución por estado */}
            <div style={{marginBottom:4,fontSize:".7rem",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".5px"}}>Distribución de checks</div>
            {checksByStatus.map(g=>(
              <div key={g.label} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:".75rem"}}>
                  <span style={{color:g.color,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:2,background:g.color,display:"inline-block"}}/>
                    {g.label}
                  </span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#111827"}}>{g.count}</span>
                </div>
                <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${safePct(g.count,maxCheck)}%`,background:g.color,borderRadius:4,transition:"width .4s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista completa de checks */}
        <div className="mdb-panel">
          <div className="mdb-panel-head"><div className="mdb-panel-title"><MdQueryStats size={16}/> Verificaciones de integridad</div><span className="mdb-badge">{checks.length} checks</span></div>
          <div className="mdb-panel-body">
            <div className="mdb-checks">
              {checks.map(c=>(
                <div key={c.name} className="mdb-check">
                  <div className="mdb-check-left">{statusIcon(c.status)}<span className="mdb-check-name">{c.name}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {safeNum(c.value)>0&&(
                      <div style={{width:60,height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${safePct(safeNum(c.value),maxVal||1)}%`,background:c.status==="ok"?"#16a34a":c.status==="warn"?"#d97706":c.status==="error"?"#dc2626":"#2563eb",borderRadius:3}}/>
                      </div>
                    )}
                    <span className={`mdb-cbadge ${c.status}`}>{c.value===0&&c.status==="ok"?"✓ 0":fmtNum(c.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fila 2: gráfica de afectados + leyenda + problemas */}
      {checksWithValue.length>0&&(
        <div className="mdb-grid2">
          {/* Gráfica de barras: cuántos registros afectados por check */}
          <div className="mdb-panel">
            <div className="mdb-panel-head"><div className="mdb-panel-title"><MdInfo size={16}/> Registros afectados por verificación</div></div>
            <div className="mdb-panel-body">
              {checksWithValue.sort((a,b)=>safeNum(b.value)-safeNum(a.value)).map(c=>{
                const statusC = c.status==="ok"?"#16a34a":c.status==="warn"?"#d97706":c.status==="error"?"#dc2626":"#2563eb";
                return (
                  <div key={c.name} style={{marginBottom:11}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:".76rem"}}>
                      <span style={{color:statusC,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                        {statusIcon(c.status)} {c.name}
                      </span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#111827",fontWeight:700}}>{fmtNum(c.value)}</span>
                    </div>
                    <div style={{height:10,background:"#f3f4f6",borderRadius:5,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${safePct(safeNum(c.value),maxVal)}%`,background:statusC,borderRadius:5,transition:"width .4s"}}/>
                    </div>
                  </div>
                );
              })}
              <div style={{marginTop:8,fontSize:".71rem",color:"#9ca3af"}}>Cada barra muestra cuántos registros tienen ese problema. Lo ideal es que todas estén en 0.</div>
            </div>
          </div>

          {/* Leyenda + problemas detectados */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="mdb-panel">
              <div className="mdb-panel-head"><div className="mdb-panel-title"><MdInfo size={16}/> Qué significa cada estado</div></div>
              <div className="mdb-panel-body">
                {[
                  {s:"ok",    label:"Sin problema",   desc:"El check pasó — dato íntegro"},
                  {s:"info",  label:"Informativo",     desc:"Dato a tener en cuenta, no crítico"},
                  {s:"warn",  label:"Advertencia",     desc:"Hay datos inconsistentes, corregir pronto"},
                  {s:"error", label:"Error crítico",   desc:"Integridad referencial comprometida"},
                ].map(({s,label,desc})=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"#f9fafb",borderRadius:7,border:"1px solid #f3f4f6",marginBottom:6}}>
                    {statusIcon(s)}
                    <div>
                      <div style={{fontSize:".8rem",fontWeight:600,color:"#374151"}}>{label}</div>
                      <div style={{fontSize:".68rem",color:"#9ca3af"}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {totalIssues>0&&(
              <div className="mdb-panel">
                <div className="mdb-panel-head">
                  <div className="mdb-panel-title"><MdWarning size={16} style={{color:"#d97706"}}/> Acciones requeridas</div>
                  <span className="mdb-badge" style={{background:"#fef9c3",color:"#92400e",borderColor:"#fde68a"}}>{totalIssues} problema{totalIssues!==1?"s":""}</span>
                </div>
                <div className="mdb-panel-body">
                  {checks.filter(c=>c.status==="warn"||c.status==="error").map(c=>(
                    <div key={`p-${c.name}`} className="mdb-check" style={{marginBottom:6,borderColor:c.status==="error"?"#fecaca":"#fde68a",background:c.status==="error"?"#fef2f2":"#fffbeb"}}>
                      <div className="mdb-check-left">
                        {statusIcon(c.status)}
                        <div>
                          <div className="mdb-check-name" style={{fontWeight:600}}>{c.name}</div>
                          <div style={{fontSize:".68rem",color:"#9ca3af",marginTop:1}}>
                            {c.status==="error"?"⚡ Corregir inmediatamente — afecta integridad":"⏰ Revisar pronto — datos huérfanos o inconsistentes"}
                          </div>
                        </div>
                      </div>
                      <span className={`mdb-cbadge ${c.status}`}>{fmtNum(c.value)} afectados</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {int_warn===0&&int_error===0&&(
        <div className="mdb-alert-ok">✓ Todas las verificaciones pasaron. La integridad referencial de la base de datos está en perfecto estado.</div>
      )}
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMPONENTE PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MonitorBD() {
  const [overview,  setOverview]  = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [perf,      setPerf]      = useState(null);
  const [proc,      setProc]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [lastUpdate,setLastUpdate]= useState(null);
  const [tab,       setTab]       = useState("overview");

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ovR,inR,pfR,prR] = await Promise.all([
        fetch(`${API_URL}/api/admin/monitor/overview`,    {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/integrity`,   {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/performance`, {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/processes`,   {headers:auth()}),
      ]);
      if (ovR.ok) setOverview(await ovR.json());
      if (inR.ok) setIntegrity(await inR.json());
      if (pfR.ok) setPerf(await pfR.json());
      if (prR.ok) setProc(await prR.json());
      setLastUpdate(new Date());
    } catch { setError("No se pudo conectar con el servidor de monitoreo."); }
    finally  { setLoading(false); }
  }, []);

  const fetchProcesses = useCallback(async () => {
    try { const r=await fetch(`${API_URL}/api/admin/monitor/processes`,{headers:auth()}); if(r.ok) setProc(await r.json()); } catch {}
  }, []);

  useEffect(()=>{ fetchAll(); },[]);
  useEffect(()=>{ const t=setInterval(fetchAll,60000);       return ()=>clearInterval(t); },[]);
  useEffect(()=>{ const t=setInterval(fetchProcesses,30000); return ()=>clearInterval(t); },[]);

  const tabs=[
    {id:"overview",  label:"📊 Overview",    cls:""},
    {id:"perf",      label:"⚡ Performance",  cls:"new-tab"},
    {id:"processes", label:"🔄 Procesos",     cls:"new-tab"},
    {id:"integrity", label:"🔍 Integridad",   cls:""},
  ];

  return (
    <div className="mdb" style={{background:"#f9fafb",minHeight:"100vh",padding:"24px",color:"#111827"}}>
      <style>{S}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <div>
          <h2 style={{margin:0,display:"flex",alignItems:"center",gap:10,color:"#111827",fontSize:"1.3rem",fontWeight:700}}>
            <MdStorage style={{color:"#2563eb"}}/>
            Monitor de Base de Datos
          </h2>
          <p style={{margin:"4px 0 0",color:"#9ca3af",fontSize:".8rem"}}>
            MySQL · métricas técnicas reales · performance_schema + information_schema
            {lastUpdate&&<span style={{marginLeft:12}}>· actualizado: {lastUpdate.toLocaleTimeString("es-MX")}</span>}
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {!loading&&!error&&(
            <div style={{display:"flex",alignItems:"center",gap:7,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"5px 14px",fontSize:".75rem",color:"#15803d",fontWeight:600}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#16a34a",display:"inline-block",animation:"pulse2 2s ease-in-out infinite"}}/>
              Conectado
            </div>
          )}
          <button onClick={fetchAll} disabled={loading} style={{display:"flex",alignItems:"center",gap:7,background:"#2563eb",color:"#fff",border:"none",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:".84rem",fontWeight:600,opacity:loading?.6:1,boxShadow:"0 1px 3px rgba(37,99,235,.3)"}}>
            <MdRefresh size={16} className={loading?"spinning":""}/>
            {loading?"Cargando…":"Actualizar"}
          </button>
        </div>
      </div>

      {error&&<div className="mdb-alert-err" style={{marginBottom:18}}>⚠ {error}</div>}

      {loading&&!overview?(
        <div className="mdb-loading"><MdRefresh size={20} className="spinning" style={{color:"#2563eb"}}/> Consultando base de datos…</div>
      ):(
        <div className="mdb-body">
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",boxShadow:"0 1px 3px rgba(0,0,0,.06)",overflow:"hidden",marginBottom:4}}>
            <div className="mdb-tabs" style={{padding:"0 8px"}}>
              {tabs.map(t=>(
                <button key={t.id} className={`mdb-tab ${t.cls} ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>

          {tab==="overview"  && overview   && <TabOverview   overview={overview}/>}
          {tab==="perf"                    && <TabPerformance perf={perf}/>}
          {tab==="processes"               && <TabProcesses  proc={proc}/>}
          {tab==="integrity" && integrity  && <TabIntegrity  integrity={integrity}/>}

          {tab==="overview"  && !overview  && <div className="mdb-alert-info">Cargando overview…</div>}
          {tab==="integrity" && !integrity && <div className="mdb-alert-info">Cargando verificaciones…</div>}
        </div>
      )}
    </div>
  );
}