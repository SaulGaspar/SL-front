import React, { useState, useEffect, useCallback } from "react";

const API_URL = "https://sl-back.vercel.app";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const hdrs = () => ({ ...auth(), "Content-Type": "application/json" });

/* ── Formatters ── */
const safeNum = v => (isFinite(Number(v)) ? Number(v) : 0);
const fmtNum  = n => safeNum(n).toLocaleString("es-MX");
const fmtKB   = kb => { const v = safeNum(kb); if (!v) return "0 KB"; if (v >= 1024*1024) return `${(v/1024/1024).toFixed(2)} GB`; if (v >= 1024) return `${(v/1024).toFixed(2)} MB`; return `${v.toFixed(1)} KB`; };
const fmtMB   = mb => { const v = safeNum(mb); return v >= 1024 ? `${(v/1024).toFixed(2)} GB` : `${v} MB`; };
const fmtSec  = s  => { const v = safeNum(s); if (!v) return "0ms"; if (v >= 3600) return `${(v/3600).toFixed(1)}h`; if (v >= 60) return `${(v/60).toFixed(1)}m`; if (v >= 1) return `${v.toFixed(2)}s`; return `${(v*1000).toFixed(0)}ms`; };
const fmtUp   = s  => { const v = safeNum(s); if (!v) return "—"; const d = Math.floor(v/86400), h = Math.floor((v%86400)/3600), m = Math.floor((v%3600)/60); return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`; };
const fmtDate = v  => v ? new Date(v).toLocaleString("es-MX", {dateStyle:"short",timeStyle:"short"}) : "—";
const fmtBytes= b  => { const v = safeNum(b); if (!v) return "—"; if (v < 1024) return `${v} B`; if (v < 1048576) return `${(v/1024).toFixed(1)} KB`; return `${(v/1048576).toFixed(2)} MB`; };
const safePct = (a,b) => { const r = safeNum(b) > 0 ? (safeNum(a)/safeNum(b))*100 : 0; return isFinite(r) ? Math.min(r,100) : 0; };

/* ══════════════════════════════════════════════
   ESTILOS — idénticos al AdminLayout
   ══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.mon * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.mon { background: #f5f7fa; min-height: 100vh; color: #1e3a5f; }

/* ── Banner (mismo look que el topbar del AdminLayout) ── */
.mon-banner {
  background: linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%);
  padding: 16px 24px; display: flex; align-items: center;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}
.mon-banner-left { display: flex; align-items: center; gap: 12px; }
.mon-banner-icon { width: 40px; height: 40px; background: rgba(255,255,255,.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.mon-banner-title { color: #fff; font-size: 1.2rem; font-weight: 700; margin: 0; }
.mon-banner-sub   { color: rgba(255,255,255,.65); font-size: .78rem; margin: 2px 0 0; }
.mon-banner-right { display: flex; align-items: center; gap: 10px; }
.mon-pill { background: rgba(57,211,83,.2); border: 1px solid rgba(57,211,83,.4); color: #39d353; border-radius: 20px; padding: 5px 14px; font-size: .78rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.mon-dot { width: 7px; height: 7px; border-radius: 50%; background: #39d353; animation: mPulse 2s ease-in-out infinite; }
@keyframes mPulse { 0%,100%{opacity:1;box-shadow:0 0 0 #39d353} 50%{opacity:.5;box-shadow:0 0 8px #39d353} }

/* ── Tabs (mismo estilo que las páginas del admin) ── */
.mon-tabs { background: #fff; border-bottom: 2px solid #e2e8f0; padding: 0 24px; display: flex; gap: 0; overflow-x: auto; }
.mon-tab { padding: 14px 18px; border: none; background: none; cursor: pointer; font-family: inherit; font-size: .88rem; font-weight: 600; color: #718096; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all .15s; white-space: nowrap; }
.mon-tab:hover { color: #2c5282; }
.mon-tab.active { color: #2c5282; border-bottom-color: #2c5282; }

/* ── Cuerpo ── */
.mon-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* ── Grids ── */
.g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── Stat cards ── */
.stat {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 18px 20px; display: flex; align-items: flex-start; gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05); transition: .2s;
  position: relative; overflow: hidden;
}
.stat::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--stripe,#2c5282); border-radius:12px 12px 0 0; }
.stat:hover { box-shadow: 0 6px 20px rgba(0,0,0,.1); transform: translateY(-2px); }
.stat-ico { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.2rem; }
.ic-blue   { background:#e8f0fe; color:#2c5282; }
.ic-green  { background:#e6f4ea; color:#1e7e34; }
.ic-yellow { background:#fff8e1; color:#c9961a; }
.ic-red    { background:#fce8e6; color:#c0392b; }
.ic-purple { background:#f3e5f5; color:#6d28d9; }
.ic-teal   { background:#e0f2f1; color:#0d7377; }
.stat-lbl { font-size: .7rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: .6px; }
.stat-val { font-size: 1.75rem; font-weight: 800; color: #1e3a5f; line-height: 1.1; }
.stat-val.sm { font-size: 1.1rem; }
.stat-sub { font-size: .75rem; color: #a0aec0; margin-top: 2px; }

/* ── Panels ── */
.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-size: .9rem; font-weight: 700; color: #1e3a5f; display: flex; align-items: center; gap: 8px; }
.panel-body { padding: 18px 20px; }
.badge { font-size: .72rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: #e8f0fe; color: #2c5282; border: 1px solid #c3d6f5; }

/* ── Tablas ── */
.tbl { width: 100%; border-collapse: collapse; font-size: .84rem; }
.tbl th { padding: 10px 14px; text-align: left; font-size: .68rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .5px; background: linear-gradient(180deg,#1e3a5f,#2c5282); white-space: nowrap; }
.tbl td { padding: 11px 14px; border-bottom: 1px solid #f0f4f8; color: #374151; vertical-align: middle; }
.tbl tbody tr:hover td { background: #f8fafc; }
.tbl tbody tr:last-child td { border-bottom: none; }
.tscroll { overflow-x: auto; }

/* ── Progress bars ── */
.bar-wrap  { display: flex; align-items: center; gap: 8px; }
.bar-track { flex: 1; height: 8px; background: #f0f4f8; border-radius: 4px; overflow: hidden; min-width: 60px; }
.bar-fill  { height: 100%; border-radius: 4px; transition: width .5s; }
.bar-pct   { font-size: .7rem; color: #a0aec0; min-width: 32px; text-align: right; }

/* ── KV rows ── */
.kv { display: flex; flex-direction: column; gap: 6px; }
.kv-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 13px; background: #f8fafc; border-radius: 8px; border: 1px solid #f0f4f8; }
.kv-k { font-size: .84rem; color: #718096; }
.kv-v { font-size: .88rem; color: #1e3a5f; font-weight: 700; }

/* ── Tags ── */
.tag { display: inline-block; padding: 2px 9px; border-radius: 12px; font-size: .72rem; font-weight: 700; }
.t-ok    { background: #e6f4ea; color: #1e7e34; }
.t-warn  { background: #fff8e1; color: #c9961a; }
.t-err   { background: #fce8e6; color: #c0392b; }
.t-info  { background: #e8f0fe; color: #2c5282; }
.t-pk    { background: #fce4ec; color: #ad1457; }

/* ── Alertas ── */
.a-ok   { background: #e6f4ea; border: 1px solid #a8d5b5; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #1e7e34; }
.a-warn { background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #c9961a; }
.a-err  { background: #fce8e6; border: 1px solid #ef9a9a; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #c0392b; }
.a-info { background: #e8f0fe; border: 1px solid #c3d6f5; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #2c5282; }

/* ── H-Bar chart ── */
.chart-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.chart-lbl { width: 120px; flex-shrink: 0; font-size: .75rem; color: #374151; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chart-area { flex: 1; height: 24px; background: #f0f4f8; border-radius: 6px; overflow: hidden; position: relative; }
.chart-inner { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 8px; transition: width .5s; min-width: 4px; }
.chart-vl { font-size: .72rem; font-weight: 700; color: #fff; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.2); }
.chart-vl.out { color: #374151; padding-left: 4px; position: absolute; right: 0; }
.chart-rv { width: 60px; flex-shrink: 0; font-size: .72rem; color: #a0aec0; text-align: right; }

/* ── Donut ── */
.donut { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.donut svg { transform: rotate(-90deg); }
.donut-lbl { position: absolute; text-align: center; pointer-events: none; }

/* ── Botones ── */
.btn-primary {
  background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border: none; border-radius: 8px;
  padding: 10px 20px; font-family: inherit; font-weight: 700; font-size: .88rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(44,82,130,.3); transition: .18s;
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn-ghost {
  background: #f5f7fa; color: #374151; border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 9px 16px; font-family: inherit; font-weight: 600; font-size: .86rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: .15s;
}
.btn-ghost:hover { background: #edf2f7; }
.btn-green {
  background: linear-gradient(135deg,#1e7e34,#27ae60); color: #fff; border: none; border-radius: 8px;
  padding: 10px 20px; font-family: inherit; font-weight: 700; font-size: .88rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(30,126,52,.25); transition: .18s;
}
.btn-green:hover { transform: translateY(-1px); }
.btn-green:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.icon-btn { padding: 7px 11px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-family: inherit; font-weight: 600; transition: all .15s; border: 1.5px solid; background: none; }
.icon-btn:disabled { opacity: .4; cursor: not-allowed; }
.ib-blue  { border-color: #c3d6f5; background: #e8f0fe; color: #2c5282; }
.ib-green { border-color: #a8d5b5; background: #e6f4ea; color: #1e7e34; }
.ib-red   { border-color: #ef9a9a; background: #fce8e6; color: #c0392b; }

/* ── Misc ── */
.loading { display: flex; align-items: center; justify-content: center; min-height: 220px; gap: 12px; color: #a0aec0; font-size: .9rem; }
.spinning { animation: spin .8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
.sec-title { font-size: .7rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 10px; }
.mono { font-family: 'Consolas', 'Courier New', monospace; font-size: .76rem; background: #1e293b; color: #7dd3fc; padding: 3px 8px; border-radius: 5px; }

/* ── Toast ── */
.toast { position: fixed; bottom: 28px; right: 28px; z-index: 9999; padding: 13px 22px; border-radius: 12px; color: #fff; font-family: inherit; font-size: .86rem; font-weight: 700; box-shadow: 0 8px 28px rgba(0,0,0,.22); animation: slideIn .3s ease; display: flex; align-items: center; gap: 9px; }
.toast.ok  { background: linear-gradient(135deg,#1e7e34,#27ae60); }
.toast.err { background: linear-gradient(135deg,#c0392b,#e74c3c); }
@keyframes slideIn { from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1} }

/* ── Overlay / Modal ── */
.overlay { position: fixed; inset: 0; background: rgba(15,31,61,.55); backdrop-filter: blur(4px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal { background: #fff; border-radius: 16px; width: 100%; max-width: 420px; padding: 32px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.25); animation: slideIn .22s ease; }
.modal h3 { margin: 0 0 8px; color: #1e3a5f; font-size: 1.1rem; font-weight: 800; }
.modal p  { margin: 0 0 24px; color: #718096; font-size: .88rem; line-height: 1.55; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Sub-tabs (Respaldos) ── */
.sub-tabs { display: flex; gap: 0; background: #f5f7fa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 4px; margin-bottom: 20px; width: fit-content; }
.sub-tab { padding: 8px 18px; border-radius: 8px; border: none; background: none; font-family: inherit; font-size: .84rem; font-weight: 600; color: #718096; cursor: pointer; transition: .15s; }
.sub-tab.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; box-shadow: 0 2px 8px rgba(44,82,130,.3); }

/* ── Filter chips ── */
.chips { display: flex; gap: 6px; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #fff; font-size: .76rem; font-weight: 700; color: #718096; cursor: pointer; transition: .15s; font-family: inherit; }
.chip:hover { border-color: #2c5282; color: #2c5282; }
.chip.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }

/* ── Freq cards ── */
.freq-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); gap: 10px; margin-bottom: 18px; }
.freq-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; cursor: pointer; transition: .15s; background: #fafafa; text-align: center; }
.freq-card:hover, .freq-card.active { border-color: #2c5282; background: #e8f0fe; }
.freq-card-icon { width: 34px; height: 34px; border-radius: 9px; background: #e2e8f0; color: #718096; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; transition: .15s; }
.freq-card.active .freq-card-icon { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; }
.freq-card-label { font-size: .8rem; font-weight: 700; color: #1e3a5f; }
.freq-card-desc  { font-size: .68rem; color: #a0aec0; margin-top: 2px; }

/* ── Day/Hours btns ── */
.day-btns  { display: flex; gap: 6px; flex-wrap: wrap; }
.day-btn   { padding: 7px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .76rem; font-weight: 700; color: #718096; cursor: pointer; transition: .15s; font-family: inherit; }
.day-btn.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }
.hrs-btn   { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .8rem; font-weight: 700; cursor: pointer; transition: .15s; font-family: inherit; color: #718096; }
.hrs-btn.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }

/* ── Time input ── */
.time-input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: .88rem; color: #1e3a5f; background: #fff; font-family: inherit; width: 100%; transition: .15s; }
.time-input:focus { outline: none; border-color: #2c5282; box-shadow: 0 0 0 3px rgba(44,82,130,.1); }

/* ── Backup badges ── */
.bk-auto   { background: #ede9fe; color: #5b21b6; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.bk-manual { background: #e6f4ea; color: #14532d; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.bk-sub    { background: #fff8e1; color: #78350f; font-size: .68rem; padding: 2px 8px; border-radius: 10px; margin-left: 4px; font-weight: 700; }
.bk-fn { font-weight: 700; color: #1e3a5f; font-size: .82rem; font-family: 'Consolas', monospace; }
.bk-size { background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-size: .76rem; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }

/* ── Spinner overlay ── */
.spin-overlay { position: fixed; inset: 0; background: rgba(15,31,61,.65); backdrop-filter: blur(6px); z-index: 5000; display: flex; align-items: center; justify-content: center; }
.spin-box { background: #fff; border-radius: 20px; padding: 40px 52px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.3); }
.spin-box h3 { margin: 18px 0 8px; color: #1e3a5f; font-size: 1.15rem; font-weight: 800; }
.spin-box p  { margin: 0; color: #718096; font-size: .88rem; }
.spinner { width: 52px; height: 52px; border: 5px solid #e2e8f0; border-top-color: #2c5282; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto; }

/* ── Responsive ── */
@media(max-width:1100px){ .g4{grid-template-columns:1fr 1fr;} .g3{grid-template-columns:1fr 1fr;} }
@media(max-width:640px)  { .g4,.g3,.g2{grid-template-columns:1fr;} }
`;

const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

/* ── Micro-components ── */
function Stat({ label, value, sub, color = "blue", icon }) {
  const STRIPE = { blue:"#2c5282", green:"#1e7e34", yellow:"#c9961a", red:"#c0392b", purple:"#6d28d9", teal:"#0d7377" };
  return (
    <div className="stat" style={{"--stripe": STRIPE[color] || STRIPE.blue}}>
      <div className={`stat-ico ic-${color}`}>{icon}</div>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <div className="stat-lbl">{label}</div>
        <div className={`stat-val${String(value).length > 9 ? " sm" : ""}`}>{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function HBar({ data = [], colorFn, maxVal, lw = 120 }) {
  const max = maxVal || Math.max(...data.map(d => safeNum(d.value)), 1);
  return (
    <div>
      {data.map((d, i) => {
        const pct = safePct(d.value, max);
        const color = colorFn ? colorFn(d, i) : d.color || "#2c5282";
        const inside = pct > 25;
        return (
          <div key={`${d.label}-${i}`} className="chart-row">
            <div className="chart-lbl" style={{width:lw}} title={d.label}>{d.label}</div>
            <div className="chart-area">
              <div className="chart-inner" style={{width:`${pct}%`,background:color}}>
                {inside && <span className="chart-vl">{d.displayVal || fmtNum(d.value)}</span>}
              </div>
              {!inside && <span className="chart-vl out">{d.displayVal || fmtNum(d.value)}</span>}
            </div>
            {d.sub && <div className="chart-rv">{d.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Donut({ segments = [], size = 110, stroke = 14, centerLabel, centerSub }) {
  const r = size/2 - stroke/2, circ = 2*Math.PI*r;
  const total = segments.reduce((a,s) => a + safeNum(s.value), 0) || 1;
  let offset = 0;
  return (
    <div className="donut" style={{width:size,height:size}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f4f8" strokeWidth={stroke}/>
        {segments.map((seg, i) => {
          const pct = safeNum(seg.value)/total, dash = pct*circ, gap = circ-dash;
          const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={seg.color} strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}/>;
          offset += dash; return el;
        })}
      </svg>
      <div className="donut-lbl">
        {centerLabel && <div style={{fontWeight:800,fontSize:".9rem",color:"#1e3a5f"}}>{centerLabel}</div>}
        {centerSub   && <div style={{fontSize:".65rem",color:"#a0aec0",marginTop:1}}>{centerSub}</div>}
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`toast ${toast.type}`}>{toast.type === "ok" ? "✓" : "⚠"} {toast.msg}</div>;
}

/* ════════════════════════════════════════════
   TAB: OVERVIEW
   ════════════════════════════════════════════ */
function TabOverview({ overview }) {
  const tables  = overview.tables || [];
  const connPct = safePct(overview.server.connections, overview.server.max_connections);
  const PAL     = ["#2c5282","#6d28d9","#0d7377","#c9961a","#c0392b","#1e7e34","#f97316","#8b5cf6","#0ea5e9","#ec4899"];
  const topSize = [...tables].sort((a,b) => safeNum(b.size_kb)-safeNum(a.size_kb)).slice(0,10);
  const topRows = [...tables].sort((a,b) => safeNum(b.rows)-safeNum(a.rows)).slice(0,10);
  return (
    <>
      <div className="g4">
        <Stat label="Tablas en BD"      value={overview.database.tables}    sub={`MySQL ${overview.database.version}`}                          color="blue"   icon="🗄️"/>
        <Stat label="Conexiones activas" value={overview.server.connections} sub={`de ${overview.server.max_connections} máx — ${Math.round(connPct)}% uso`} color={connPct>70?"yellow":"green"} icon="🔗"/>
        <Stat label="Queries lentas"    value={overview.server.slow_queries} sub="umbral configurado en servidor"                               color={overview.server.slow_queries>0?"yellow":"green"} icon="⏱️"/>
        <Stat label="Uptime servidor"   value={fmtUp(overview.server.uptime_seconds)} sub="desde último reinicio"                              color="teal"   icon="⏰"/>
      </div>
      <div className="g3">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">🗄️ Base de Datos</div><span className="badge">{overview.database.name}</span></div>
          <div className="panel-body">
            <div className="kv">
              {[
                {k:"Tablas totales",v:overview.database.tables},
                {k:"Tamaño total",  v:fmtMB(overview.database.size_mb)},
                {k:"Datos",        v:`${overview.database.data_mb} MB`},
                {k:"Índices",      v:`${overview.database.index_mb} MB`},
                {k:"Charset",      v:overview.database.charset},
                {k:"Versión MySQL",v:overview.database.version},
              ].map(({k,v}) => (
                <div key={k} className="kv-row"><span className="kv-k">{k}</span><span className="kv-v">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">🔗 Conexiones MySQL</div>
            <span className="badge" style={{background:connPct>70?"#fff8e1":"#e6f4ea",color:connPct>70?"#c9961a":"#1e7e34",borderColor:connPct>70?"#ffe082":"#a8d5b5"}}>{Math.round(connPct)}% uso</span>
          </div>
          <div className="panel-body">
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:14}}>
              <Donut segments={[{value:overview.server.connections,color:connPct>70?"#c9961a":"#2c5282"},{value:Math.max(0,overview.server.max_connections-overview.server.connections),color:"#f0f4f8"}]} size={90} stroke={12} centerLabel={`${overview.server.connections}`} centerSub="activas"/>
              <div className="kv" style={{flex:1}}>
                <div className="kv-row"><span className="kv-k">Conectadas</span><span className="kv-v" style={{color:"#2c5282"}}>{overview.server.connections}</span></div>
                <div className="kv-row"><span className="kv-k">Máximo</span><span className="kv-v">{overview.server.max_connections}</span></div>
                <div className="kv-row"><span className="kv-k">Disponibles</span><span className="kv-v" style={{color:"#1e7e34"}}>{safeNum(overview.server.max_connections)-safeNum(overview.server.connections)}</span></div>
              </div>
            </div>
            {connPct > 70
              ? <div className="a-warn">⚠ Conexiones elevadas. Posible cuello de botella.</div>
              : <div className="a-ok">✓ Pool de conexiones saludable.</div>
            }
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">⚡ Performance Global</div><span className="badge">desde reinicio</span></div>
          <div className="panel-body">
            <div className="kv">
              {[
                {k:"Uptime",         v:fmtUp(overview.server.uptime_seconds)},
                {k:"Queries totales",v:fmtNum(overview.server.total_queries)},
                {k:"Queries lentas", v:overview.server.slow_queries, warn:overview.server.slow_queries>0},
              ].map(({k,v,warn}) => (
                <div key={k} className="kv-row"><span className="kv-k">{k}</span><span className="kv-v" style={warn?{color:"#c9961a"}:{}}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="g2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">📊 Top 10 — Tablas más pesadas</div><span className="badge">{fmtMB(overview.database.size_mb)}</span></div>
          <div className="panel-body"><HBar data={topSize.map((t,i) => ({label:t.name,value:safeNum(t.size_kb),displayVal:fmtKB(t.size_kb),color:PAL[i%PAL.length]}))} lw={110}/></div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">📈 Top 10 — Más registros</div><span className="badge">estimado</span></div>
          <div className="panel-body"><HBar data={topRows.map((t,i) => ({label:t.name,value:safeNum(t.rows),displayVal:fmtNum(t.rows),color:PAL[i%PAL.length]}))} lw={110}/></div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">🗃️ Detalle de todas las tablas</div><span className="badge">{tables.length} tablas</span></div>
        <div className="tscroll">
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>Tabla</th><th>Filas est.</th><th>Tamaño total</th><th style={{minWidth:120}}>% del total</th><th>Datos</th><th>Índices</th><th>Última mod.</th></tr>
            </thead>
            <tbody>
              {[...tables].sort((a,b) => safeNum(b.size_kb)-safeNum(a.size_kb)).map((t,i) => {
                const max = Math.max(...tables.map(x => safeNum(x.size_kb)), 1);
                const pct = safePct(t.size_kb, max);
                return (
                  <tr key={`${t.name}-${i}`}>
                    <td style={{color:"#a0aec0",fontSize:".78rem"}}>{i+1}</td>
                    <td><strong style={{color:"#1e3a5f"}}>{t.name}</strong></td>
                    <td>{fmtNum(t.rows)}</td>
                    <td style={{color:"#1e3a5f",fontWeight:700}}>{fmtKB(t.size_kb)}</td>
                    <td><div className="bar-wrap"><div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`,background:"#2c5282"}}/></div><div className="bar-pct">{Math.round(pct)}%</div></div></td>
                    <td style={{color:"#718096"}}>{fmtKB(t.data_kb)}</td>
                    <td style={{color:"#718096"}}>{fmtKB(t.index_kb)}</td>
                    <td style={{fontSize:".78rem",color:"#a0aec0"}}>{fmtDate(t.updated)}</td>
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

/* ════════════════════════════════════════════
   TAB: BASE DE DATOS
   ════════════════════════════════════════════ */
function TabBaseDatos({ maint, onOptimize, optimizing, lastOptimize }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("size");
  if (!maint) return <div className="loading"><span className="spinning">↻</span> Cargando…</div>;

  const { summary, table_health = [], index_health = [] } = maint;
  const sinPK  = table_health.filter(t => !index_health.some(i => i.table_name === t.name && i.is_primary));
  const maxT   = table_health.reduce((a,b) => safeNum(b.total_kb) > safeNum(a.total_kb) ? b : a, {total_kb:0});
  const fragC  = pct => pct > 30 ? "#c0392b" : pct > 10 ? "#c9961a" : "#1e7e34";

  const filtradas = table_health
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="frag" ? b.frag_pct-a.frag_pct : sortBy==="size" ? b.total_kb-a.total_kb : b.free_kb-a.free_kb);

  return (
    <>
      <div className="g4">
        <Stat label="Tablas totales"      value={summary.total_tables}        sub="en la base de datos"      color="blue"   icon="🗃️"/>
        <Stat label="Mayor tabla"         value={fmtKB(safeNum(maxT.total_kb))} sub={maxT.name||"—"}          color="purple" icon="📦"/>
        <Stat label="Tablas fragmentadas" value={summary.high_frag_tables}    sub="> 30% fragmentación"      color={summary.high_frag_tables>0?"yellow":"green"} icon="⚠️"/>
        <Stat label="Tablas sin PK"       value={sinPK.length}                sub="sin Primary Key"          color={sinPK.length>0?"yellow":"green"}            icon="🔑"/>
      </div>

      {/* Optimize */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">🔧 ANALYZE + OPTIMIZE TABLE</div>
          {lastOptimize && <span style={{fontSize:".78rem",color:"#a0aec0"}}>Última: {lastOptimize}</span>}
        </div>
        <div className="panel-body">
          <div className="a-info" style={{marginBottom:14}}>ℹ En entornos serverless (Vercel), InnoDB puede tener fragmentación lógica aunque <code>data_free = 0</code>. Se reconstruyen estadísticas del optimizador y se compactan índices en <strong>todas las tablas InnoDB</strong>.</div>
          {summary.high_frag_tables > 0 && <div className="a-warn" style={{marginBottom:14}}>⚠ {summary.high_frag_tables} tabla(s) con alta fragmentación detectadas.</div>}
          <div style={{marginBottom:16}}>
            <div className="sec-title">Tablas que se optimizarán ({table_health.filter(t => (t.engine||"").toLowerCase()==="innodb").length} InnoDB)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
              {table_health.filter(t => (t.engine||"").toLowerCase()==="innodb").slice(0,24).map((t,i) => (
                <span key={`opt-${t.name}-${i}`} style={{background:t.frag_pct>20?"#e8f0fe":"#f1f5f9",color:t.frag_pct>20?"#2c5282":"#475569",border:`1px solid ${t.frag_pct>20?"#c3d6f5":"#e2e8f0"}`,borderRadius:6,padding:"3px 10px",fontSize:".74rem",fontWeight:700}}>
                  {t.name}{t.frag_pct>20?` (${t.frag_pct.toFixed(0)}%)`:""}
                </span>
              ))}
            </div>
          </div>
          <button className="btn-green" onClick={onOptimize} disabled={optimizing}>
            {optimizing ? <><span className="spinning">↻</span>Optimizando…</> : <>🔧 Ejecutar OPTIMIZE ahora</>}
          </button>
        </div>
      </div>

      <div className="g2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">📊 Fragmentación por tabla</div><span className="badge">data_free</span></div>
          <div className="panel-body">
            {table_health.every(t => safeNum(t.free_kb) === 0)
              ? <div className="a-ok">✓ data_free = 0 en todas las tablas. InnoDB gestiona espacio eficientemente.</div>
              : <HBar data={[...table_health].filter(t => safeNum(t.free_kb)>0).sort((a,b) => b.frag_pct-a.frag_pct).slice(0,10).map(t => ({label:t.name,value:t.frag_pct,displayVal:`${t.frag_pct.toFixed(1)}%`,sub:fmtKB(t.free_kb),color:fragC(t.frag_pct)}))} lw={110}/>
            }
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">🔑 Índices por tabla</div><span className="badge">{index_health.length} total</span></div>
          <div className="panel-body">
            {Object.entries(
              index_health.reduce((acc, idx) => {
                if (!acc[idx.table_name]) acc[idx.table_name] = {pk:0,uq:0,reg:0};
                if (idx.is_primary) acc[idx.table_name].pk++;
                else if (idx.is_unique) acc[idx.table_name].uq++;
                else acc[idx.table_name].reg++;
                return acc;
              }, {})
            ).sort(([,a],[,b]) => (b.pk+b.uq+b.reg)-(a.pk+a.uq+a.reg)).slice(0,10).map(([table,counts]) => {
              const total = counts.pk+counts.uq+counts.reg;
              return (
                <div key={`idx-${table}`} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:".84rem"}}>
                    <span style={{color:"#374151",fontWeight:600}}>{table}</span>
                    <div style={{display:"flex",gap:4}}>
                      {counts.pk>0 && <span className="tag t-pk" style={{fontSize:".62rem"}}>PK</span>}
                      {counts.uq>0 && <span className="tag t-ok" style={{fontSize:".62rem"}}>UQ:{counts.uq}</span>}
                      {counts.reg>0 && <span className="tag t-info" style={{fontSize:".62rem"}}>IDX:{counts.reg}</span>}
                      <span style={{fontWeight:800,color:"#1e3a5f"}}>{total}</span>
                    </div>
                  </div>
                  <div style={{height:8,background:"#f0f4f8",borderRadius:4,overflow:"hidden",display:"flex"}}>
                    <div style={{width:`${safePct(counts.pk,total)}%`,background:"#1e7e34"}}/>
                    <div style={{width:`${safePct(counts.uq,total)}%`,background:"#2c5282"}}/>
                    <div style={{width:`${safePct(counts.reg,total)}%`,background:"#a78bfa"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">🗃️ Detalle de tablas</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrar tabla…" style={{padding:"5px 10px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:".84rem",color:"#374151",fontFamily:"inherit",width:150}}/>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{padding:"5px 10px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:".84rem",color:"#374151",fontFamily:"inherit"}}>
              <option value="size">↓ Tamaño</option>
              <option value="frag">↓ Fragmentación</option>
              <option value="free">↓ data_free</option>
            </select>
          </div>
        </div>
        <div className="tscroll">
          <table className="tbl">
            <thead>
              <tr><th>Tabla</th><th>Filas est.</th><th>Total</th><th style={{minWidth:130}}>% relativo</th><th>data_free</th><th>Fragmentación</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {filtradas.map((t, i) => {
                const maxKB = Math.max(...table_health.map(x => safeNum(x.total_kb)), 1);
                return (
                  <tr key={`td-${t.name}-${i}`}>
                    <td><strong style={{color:"#1e3a5f"}}>{t.name}</strong></td>
                    <td>{fmtNum(t.est_rows)}</td>
                    <td style={{color:"#1e3a5f",fontWeight:700}}>{fmtKB(t.total_kb)}</td>
                    <td><div className="bar-wrap"><div className="bar-track"><div className="bar-fill" style={{width:`${safePct(t.total_kb,maxKB)}%`,background:"#2c5282"}}/></div><div className="bar-pct">{Math.round(safePct(t.total_kb,maxKB))}%</div></div></td>
                    <td style={{color:safeNum(t.free_kb)>0?"#c9961a":"#a0aec0"}}>{fmtKB(t.free_kb)}</td>
                    <td><span style={{fontSize:".84rem",color:fragC(t.frag_pct),fontWeight:700}}>{t.frag_pct.toFixed(1)}%</span></td>
                    <td><span className={`tag ${t.status==="critical"?"t-err":t.status==="warn"?"t-warn":"t-ok"}`}>{t.status==="critical"?"Crítica":t.status==="warn"?"Moderada":"Óptima"}</span></td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",padding:"32px",color:"#a0aec0"}}>Sin resultados</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   TAB: CONEXIONES
   ════════════════════════════════════════════ */
function TabConexiones({ procData }) {
  if (!procData) return <div className="loading"><span className="spinning">↻</span> Cargando…</div>;
  const { processes = [], transactions = [], locks = [], summary = {} } = procData;
  const PAL = ["#2c5282","#6d28d9","#0d7377","#c9961a","#c0392b"];
  const stateEntries = Object.entries(summary.state_summary || {}).sort((a,b) => b[1]-a[1]);
  return (
    <>
      <div className="g4">
        <Stat label="Procesos activos"  value={summary.total_processes}    sub="en information_schema"  color="blue"   icon="⚙️"/>
        <Stat label="Transacciones"     value={summary.total_transactions} sub="InnoDB activas"          color="purple" icon="🔄"/>
        <Stat label="Locks activos"     value={summary.total_locks}        sub="data_locks"              color={summary.total_locks>0?"yellow":"green"} icon="🔒"/>
        <Stat label="Larga duración"    value={summary.long_running}       sub="> 10 segundos"           color={summary.long_running>0?"red":"green"}   icon="⏳"/>
      </div>
      <div className="g2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">⚙️ Procesos activos</div><span className="badge">{processes.length}</span></div>
          <div className="tscroll">
            <table className="tbl">
              <thead>
                <tr><th>ID</th><th>Usuario</th><th>DB</th><th>Comando</th><th>Tiempo</th><th>Estado</th><th>Query</th></tr>
              </thead>
              <tbody>
                {processes.length === 0
                  ? <tr><td colSpan={7} style={{textAlign:"center",padding:"24px",color:"#a0aec0"}}>Sin procesos activos</td></tr>
                  : processes.map((p,i) => (
                    <tr key={`pr-${p.id}-${i}`}>
                      <td style={{fontSize:".76rem",color:"#a0aec0"}}>{p.id}</td>
                      <td style={{fontWeight:600,color:"#2c5282"}}>{p.db_user}</td>
                      <td style={{fontSize:".8rem"}}>{p.db_name}</td>
                      <td><span className="tag t-info" style={{fontSize:".7rem"}}>{p.command}</span></td>
                      <td style={{color:p.time_sec>10?"#c0392b":p.time_sec>5?"#c9961a":"#374151",fontWeight:600}}>{p.time_sec}s</td>
                      <td style={{fontSize:".78rem",color:"#718096"}}>{p.state||"—"}</td>
                      <td style={{fontSize:".76rem",color:"#374151",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={p.query_preview}>{p.query_preview||"—"}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">🔄 Transacciones InnoDB</div><span className="badge">{transactions.length}</span></div>
          <div className="panel-body">
            {transactions.length === 0
              ? <div className="a-ok">✓ Sin transacciones activas en este momento.</div>
              : <div className="kv">
                {transactions.map((t,i) => (
                  <div key={`trx-${t.trx_id}-${i}`} className="kv-row" style={{flexDirection:"column",alignItems:"flex-start",gap:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                      <span style={{fontWeight:700,fontSize:".84rem",color:"#1e3a5f"}}>TRX {t.trx_id}</span>
                      <span className={`tag ${t.state==="RUNNING"?"t-ok":"t-warn"}`} style={{fontSize:".7rem"}}>{t.state}</span>
                    </div>
                    <div style={{fontSize:".78rem",color:"#718096"}}>Duración: {t.duration_sec}s · Filas locked: {t.rows_locked} · Modificadas: {t.rows_modified}</div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
      {stateEntries.length > 0 && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">📊 Distribución de estados</div></div>
          <div className="panel-body"><HBar data={stateEntries.map(([state,count],i) => ({label:state,value:count,displayVal:String(count),color:PAL[i%PAL.length]}))} lw={140}/></div>
        </div>
      )}
      {locks.length > 0 && (
        <div className="panel">
          <div className="panel-head"><div className="panel-title">🔒 Locks activos</div><span className="badge" style={{background:"#fff8e1",color:"#c9961a",borderColor:"#ffe082"}}>{locks.length}</span></div>
          <div className="tscroll">
            <table className="tbl">
              <thead>
                <tr><th>TRX ID</th><th>Tabla</th><th>Tipo</th><th>Modo</th><th>Estado</th><th>Data</th></tr>
              </thead>
              <tbody>
                {locks.map((l,i) => (
                  <tr key={`lk-${l.lock_id}-${i}`}>
                    <td style={{fontSize:".76rem"}}>{l.trx_id}</td>
                    <td style={{fontWeight:600}}>{l.table_name}</td>
                    <td><span className="tag t-info" style={{fontSize:".7rem"}}>{l.lock_type}</span></td>
                    <td style={{fontSize:".78rem"}}>{l.lock_mode}</td>
                    <td><span className={`tag ${l.lock_status==="GRANTED"?"t-ok":"t-warn"}`} style={{fontSize:".7rem"}}>{l.lock_status}</span></td>
                    <td style={{fontSize:".76rem",color:"#a0aec0"}}>{l.lock_data||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   TAB: OPTIMIZACIÓN
   ════════════════════════════════════════════ */
function TabOptimizacion({ maint, onOptimize, optimizing, lastOptimize, optimLogs }) {
  if (!maint) return <div className="loading"><span className="spinning">↻</span> Cargando…</div>;
  const { summary, table_health = [] } = maint;
  const innodbTables = table_health.filter(t => (t.engine || "").toLowerCase() === "innodb");
  return (
    <>
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#2c5282)",borderRadius:12,padding:"20px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>🛠️</div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:"1.15rem",marginBottom:3}}>Optimización de Rendimiento</div>
            <div style={{color:"rgba(255,255,255,.75)",fontSize:".84rem"}}>
              {lastOptimize ? `✓ El sistema está en buen estado. ${lastOptimize}` : "Sin optimizaciones registradas en esta sesión."}
            </div>
          </div>
        </div>
      </div>
      <div className="g4">
        <Stat label="Tablas analizadas"  value={summary.total_tables}        sub="en la base de datos"  color="blue"   icon="🗃️"/>
        <Stat label="Alta fragmentación" value={summary.high_frag_tables}    sub="data_free > 20%"      color={summary.high_frag_tables>0?"yellow":"green"} icon="⚠️"/>
        <Stat label="Espacio frag."      value={fmtKB(summary.total_free_kb)} sub={`${summary.global_frag_pct}% global`} color={summary.global_frag_pct>20?"yellow":"green"} icon="💾"/>
        <Stat label="Índices débiles"    value={summary.low_selectivity_idx} sub="selectividad < 10%"   color={summary.low_selectivity_idx>0?"yellow":"green"} icon="🔑"/>
      </div>
      <div className="panel">
        <div className="panel-head" style={{background:"linear-gradient(135deg,#1e3a5f,#2c5282)",borderRadius:"12px 12px 0 0"}}>
          <div className="panel-title" style={{color:"#fff"}}>🔧 Optimización de Base de Datos</div>
        </div>
        <div className="panel-body">
          <div className="g2" style={{marginBottom:16}}>
            <div>
              <div style={{fontWeight:700,fontSize:".9rem",color:"#1e3a5f",marginBottom:6}}>⚡ Ejecutar optimización ahora</div>
              <div style={{fontSize:".84rem",color:"#718096",lineHeight:1.55,marginBottom:14}}>Actualiza las estadísticas internas y reorganiza los índices de las tablas principales para mejorar la velocidad de consultas.</div>
              <button className="btn-primary" onClick={onOptimize} disabled={optimizing}>
                {optimizing ? <><span className="spinning">↻</span>Optimizando…</> : <>🛠️ Ejecutar optimización</>}
              </button>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:".9rem",color:"#1e3a5f",marginBottom:10}}>🗃️ Tablas incluidas en el proceso</div>
              <div style={{fontSize:".82rem",color:"#718096",marginBottom:10}}>Se optimizan todas las tablas InnoDB del sistema.</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {innodbTables.slice(0,24).map(t => (
                  <span key={t.name} style={{background:t.frag_pct>20?"#e8f0fe":"#f1f5f9",color:t.frag_pct>20?"#2c5282":"#475569",border:`1px solid ${t.frag_pct>20?"#c3d6f5":"#e2e8f0"}`,borderRadius:6,padding:"3px 10px",fontSize:".74rem",fontWeight:700}}>
                    {t.name}{t.frag_pct>20?` (${t.frag_pct.toFixed(0)}%)`:""}
                  </span>
                ))}
                {innodbTables.length > 24 && <span style={{background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 10px",fontSize:".74rem",fontWeight:700}}>+{innodbTables.length-24} más</span>}
              </div>
            </div>
          </div>
          <div style={{background:"#f8fafc",borderRadius:10,padding:"16px",border:"1px solid #f0f4f8"}}>
            <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              {[
                {n:1,title:"Actualización de estadísticas",desc:"Recalcula la distribución de datos para que el sistema elija el camino más rápido."},
                {n:2,title:"Reorganización de índices",    desc:"Compacta y reconstruye los índices internos eliminando fragmentación."},
                {n:3,title:"Registro de resultados",       desc:"Genera un log con fecha, duración y resultado tabla por tabla."},
              ].map(step => (
                <div key={step.n} style={{display:"flex",alignItems:"flex-start",gap:10,flex:1,minWidth:200,padding:"0 16px"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1e3a5f,#2c5282)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:".88rem",flexShrink:0}}>{step.n}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:".84rem",color:"#1e3a5f"}}>{step.title}</div>
                    <div style={{fontSize:".78rem",color:"#718096",marginTop:2,lineHeight:1.45}}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">🕐 Historial de optimizaciones</div></div>
        <div className="tscroll">
          <table className="tbl">
            <thead>
              <tr><th>FECHA</th><th>ORIGEN</th><th>TABLAS</th><th>DURACIÓN</th><th>RESULTADO</th></tr>
            </thead>
            <tbody>
              {optimLogs.length === 0
                ? <tr><td colSpan={5} style={{textAlign:"center",padding:"32px",color:"#a0aec0"}}>
                    <div style={{fontSize:"1.8rem",marginBottom:8}}>🕐</div>
                    <div style={{fontWeight:700}}>Sin historial de optimizaciones aún</div>
                    <div style={{fontSize:".82rem",marginTop:4}}>Ejecuta la primera optimización con el botón de arriba</div>
                  </td></tr>
                : optimLogs.map((log, i) => (
                  <tr key={`ol-${i}`}>
                    <td style={{fontSize:".82rem"}}>{fmtDate(log.fecha||log.created_at)}</td>
                    <td><span className={log.origen==="auto"?"bk-auto":"bk-manual"}>{log.origen==="auto"?"⚡ AUTO":"👤 MANUAL"}</span></td>
                    <td style={{fontWeight:700}}>{log.ok||log.tablas_ok||"—"} / {log.total||log.tablas_total||"—"}</td>
                    <td style={{color:"#374151"}}>{log.total_ms?(log.total_ms/1000).toFixed(2)+"s":log.duracion||"—"}</td>
                    <td><span className={`tag ${(log.errors||0)===0?"t-ok":"t-warn"}`}>{(log.errors||0)===0?"EXITOSO":"PARCIAL"}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   TAB: RESPALDOS
   ════════════════════════════════════════════ */
function TabRespaldos({ showToast }) {
  const [subTab,       setSubTab]       = useState("historial");
  const [backups,      setBackups]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [generating,   setGenerating]   = useState(false);
  const [downloading,  setDownloading]  = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [filtro,       setFiltro]       = useState("todos");
  const [schedules,    setSchedules]    = useState([]);
  const [schedLoading, setSchedLoading] = useState(false);
  const [newFreq,      setNewFreq]      = useState("diario");
  const [newHora,      setNewHora]      = useState("02:00");
  const [newDiaSem,    setNewDiaSem]    = useState(0);
  const [newCadaHoras, setNewCadaHoras] = useState(6);
  const [savingSched,  setSavingSched]  = useState(false);
  const [runningId,    setRunningId]    = useState(null);
  const [deletingSchId,setDeletingSchId]= useState(null);

  useEffect(() => { fetchBackups(); fetchSchedules(); }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try { const r = await fetch(`${API_URL}/api/admin/backups`, {headers:hdrs()}); if (r.ok) setBackups(await r.json()); }
    catch {} finally { setLoading(false); }
  };
  const fetchSchedules = async () => {
    setSchedLoading(true);
    try { const r = await fetch(`${API_URL}/api/admin/backups/schedules`, {headers:hdrs()}); if (r.ok) setSchedules(await r.json()); }
    catch {} finally { setSchedLoading(false); }
  };

  const getTipo    = b => (b.creado_por==="sistema"||b.nombre?.includes("_auto_"))?"auto":"manual";
  const getSubtipo = (n="") => n.includes("_diario_")?"diario":n.includes("_semanal_")?"semanal":n.includes("_mensual_")?"mensual":null;
  const fmtFreq    = s => {
    if (s.frecuencia==="diario")  return `Diario a las ${s.hora}`;
    if (s.frecuencia==="semanal") return `${DIAS[s.dia_semana??0]} a las ${s.hora}`;
    if (s.frecuencia==="mensual") return `Día 1 de cada mes a las ${s.hora}`;
    if (s.frecuencia==="horas")   return `Cada ${s.cada_horas}h`;
    return s.cron_expr||"—";
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/generate`, {method:"POST",headers:hdrs()});
      const d = await r.json();
      if (r.ok) { showToast(`✅ Backup generado: ${d.nombre}`); fetchBackups(); }
      else showToast(d.error||"Error generando backup","err");
    } catch { showToast("Error de conexión","err"); } finally { setGenerating(false); }
  };

  const handleDownload = async (backup) => {
    setDownloading(backup.id);
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/${backup.id}/download`, {headers:hdrs()});
      const d = await r.json();
      if (r.ok) {
        const fr = await fetch(d.url);
        const blob = await fr.blob();
        const url = URL.createObjectURL(new Blob([blob],{type:"application/octet-stream"}));
        const a = document.createElement("a"); a.href=url; a.download=d.nombre;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        showToast(`📥 Descargando ${d.nombre}`);
      } else showToast(d.error||"Error al descargar","err");
    } catch { showToast("Error de conexión","err"); } finally { setDownloading(null); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/${confirmDel.id}`, {method:"DELETE",headers:hdrs()});
      if (r.ok) { showToast("Backup eliminado correctamente"); fetchBackups(); }
      else { const d = await r.json(); showToast(d.error||"Error al eliminar","err"); }
    } catch { showToast("Error de conexión","err"); } finally { setDeleting(false); setConfirmDel(null); }
  };

  const handleSaveSchedule = async () => {
    setSavingSched(true);
    try {
      const body = {frecuencia:newFreq,hora:newHora,dia_semana:newFreq==="semanal"?parseInt(newDiaSem):null,cada_horas:newFreq==="horas"?parseInt(newCadaHoras):null};
      const r = await fetch(`${API_URL}/api/admin/backups/schedules`, {method:"POST",headers:hdrs(),body:JSON.stringify(body)});
      const d = await r.json();
      if (r.ok) { showToast(`✅ Programación guardada (${d.cron_expr})`); await fetchSchedules(); }
      else showToast(d.error||"Error guardando programación","err");
    } catch { showToast("Error de conexión","err"); } finally { setSavingSched(false); }
  };

  const handleToggle = async id => {
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/schedules/${id}/toggle`, {method:"PATCH",headers:hdrs()});
      const d = await r.json();
      if (r.ok) { showToast(d.activo?"▶️ Activada":"⏸️ Pausada"); await fetchSchedules(); }
      else showToast(d.error||"Error","err");
    } catch { showToast("Error","err"); }
  };

  const handleRunSchedule = async id => {
    setRunningId(id);
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/schedules/${id}/run`, {method:"POST",headers:hdrs()});
      const d = await r.json();
      if (r.ok) { showToast(`✅ Backup ejecutado: ${d.nombre}`); await fetchBackups(); }
      else showToast(d.error||"Error","err");
    } catch { showToast("Error","err"); } finally { setRunningId(null); }
  };

  const handleDeleteSchedule = async id => {
    setDeletingSchId(id);
    try {
      const r = await fetch(`${API_URL}/api/admin/backups/schedules/${id}`, {method:"DELETE",headers:hdrs()});
      const d = await r.json();
      if (r.ok) { showToast("Programación eliminada"); await fetchSchedules(); }
      else showToast(d.error||"Error","err");
    } catch { showToast("Error","err"); } finally { setDeletingSchId(null); }
  };

  const totalBytes   = backups.reduce((s,b) => s+(b.tamanio_bytes||0), 0);
  const activeScheds = schedules.filter(s => s.activo).length;
  const bkFiltrados  = backups.filter(b => filtro==="todos" ? true : getTipo(b)===filtro);
  const FREQ_OPTIONS = [
    {val:"diario", icon:"☀️", label:"Una vez al día",      desc:"Ideal para producción"},
    {val:"horas",  icon:"⏰", label:"Cada varias horas",   desc:"Alta disponibilidad"},
    {val:"semanal",icon:"📅", label:"Una vez a la semana", desc:"Moderado"},
    {val:"mensual",icon:"📆", label:"Una vez al mes",      desc:"Archivado"},
  ];

  return (
    <>
      <div className="sub-tabs">
        <button className={`sub-tab${subTab==="historial"?" active":""}`} onClick={() => setSubTab("historial")}>💾 Respaldos</button>
        <button className={`sub-tab${subTab==="programar"?" active":""}`} onClick={() => setSubTab("programar")}>📅 Programar Respaldo</button>
      </div>

      {subTab === "historial" && (
        <>
          <div className="g4">
            <Stat label="Total backups"          value={backups.length}               sub={`${backups.filter(b=>getTipo(b)==="manual").length} manuales · ${backups.filter(b=>getTipo(b)==="auto").length} automáticos`} color="blue"   icon="💾"/>
            <Stat label="Espacio en Supabase"    value={fmtBytes(totalBytes)}         sub="almacenamiento total"                           color="purple" icon="☁️"/>
            <Stat label="Último backup"          value={backups[0]?fmtDate(backups[0].creado_at):"—"} sub={backups[0]?(getTipo(backups[0])==="auto"?"🤖 automático":"👤 manual"):"ninguno"} color="teal" icon="🕐"/>
            <Stat label="Programaciones activas" value={activeScheds}                 sub={`de ${schedules.length} configuradas`}           color="green"  icon="⚙️"/>
          </div>
          <div style={{background:"#fff",padding:"14px 18px",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,.05)",border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <button className="btn-ghost" onClick={fetchBackups} disabled={loading}><span className={loading?"spinning":""}>↻</span> Actualizar</button>
              <div className="chips">
                {["todos","manual","auto"].map(f => (
                  <button key={f} className={`chip${filtro===f?" active":""}`} onClick={() => setFiltro(f)}>
                    {f==="todos"?"Todos":f==="manual"?"👤 Manuales":"🤖 Automáticos"}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? <><span className="spinning">↻</span>Generando…</> : <>💾 Generar backup ahora</>}
            </button>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title">📋 Historial de respaldos</div><span className="badge">{bkFiltrados.length}</span></div>
            <div className="tscroll">
              {loading
                ? <div className="loading" style={{minHeight:120}}>Cargando respaldos…</div>
                : bkFiltrados.length === 0
                  ? <div style={{padding:"48px",textAlign:"center",color:"#a0aec0"}}><div style={{fontSize:"2.5rem",marginBottom:12}}>💾</div><div style={{fontWeight:700,color:"#374151"}}>No hay backups{filtro!=="todos"?" con ese filtro":""}</div></div>
                  : <table className="tbl">
                    <thead>
                      <tr><th>Archivo</th><th>Tipo</th><th>Tamaño</th><th>Generado por</th><th>Fecha</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {bkFiltrados.map((b,i) => {
                        const tipo = getTipo(b); const sub = getSubtipo(b.nombre);
                        return (
                          <tr key={`bk-${b.id||i}`}>
                            <td><div className="bk-fn">{b.nombre}</div></td>
                            <td><span className={tipo==="auto"?"bk-auto":"bk-manual"}>{tipo==="auto"?"🤖 Auto":"👤 Manual"}</span>{sub&&<span className="bk-sub">{sub}</span>}</td>
                            <td><span className="bk-size">💾 {fmtBytes(b.tamanio_bytes)}</span></td>
                            <td style={{fontSize:".84rem",color:"#475569"}}>{b.creado_por==="sistema"?"🤖 sistema":b.creado_por||"—"}</td>
                            <td style={{fontSize:".82rem",color:"#718096"}}>{fmtDate(b.creado_at)}</td>
                            <td>
                              <div style={{display:"flex",gap:6}}>
                                <button className="icon-btn ib-green" onClick={() => handleDownload(b)} disabled={downloading===b.id} title="Descargar">{downloading===b.id?<span className="spinning">↻</span>:"⬇️"}</button>
                                <button className="icon-btn ib-red" onClick={() => setConfirmDel(b)} title="Eliminar">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
              }
            </div>
          </div>
        </>
      )}

      {subTab === "programar" && (
        <>
          <div className="panel">
            <div className="panel-head" style={{background:"linear-gradient(135deg,#1e3a5f,#2c5282)",borderRadius:"12px 12px 0 0"}}>
              <div className="panel-title" style={{color:"#fff"}}>📅 Nueva programación de respaldo automático</div>
              <span style={{color:"rgba(255,255,255,.65)",fontSize:".78rem"}}>node-cron · zona horaria: Ciudad de México</span>
            </div>
            <div className="panel-body">
              <div style={{marginBottom:18}}>
                <div className="sec-title">¿Con qué frecuencia se ejecuta?</div>
                <div className="freq-grid">
                  {FREQ_OPTIONS.map(f => (
                    <div key={f.val} className={`freq-card${newFreq===f.val?" active":""}`} onClick={() => setNewFreq(f.val)}>
                      <div className="freq-card-icon">{f.icon}</div>
                      <div className="freq-card-label">{f.label}</div>
                      <div className="freq-card-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:16,marginBottom:18,flexWrap:"wrap"}}>
                {newFreq !== "horas" && (
                  <div style={{flex:1,minWidth:160}}>
                    <div className="sec-title">¿A qué hora?</div>
                    <input type="time" value={newHora} onChange={e => setNewHora(e.target.value)} className="time-input"/>
                  </div>
                )}
                {newFreq === "horas" && (
                  <div style={{flex:1}}>
                    <div className="sec-title">¿Cada cuántas horas?</div>
                    <div style={{display:"flex",gap:6}}>{[2,4,6,8,12].map(h => <button key={h} className={`hrs-btn${newCadaHoras===h?" active":""}`} onClick={() => setNewCadaHoras(h)}>{h}h</button>)}</div>
                  </div>
                )}
                {newFreq === "semanal" && (
                  <div style={{flex:2}}>
                    <div className="sec-title">¿Qué día de la semana?</div>
                    <div className="day-btns">{DIAS.map((d,i) => <button key={i} className={`day-btn${newDiaSem===i?" active":""}`} onClick={() => setNewDiaSem(i)}>{d.slice(0,3)}</button>)}</div>
                  </div>
                )}
              </div>
              <button className="btn-primary" onClick={handleSaveSchedule} disabled={savingSched}>
                {savingSched ? <><span className="spinning">↻</span>Guardando…</> : <>📅 Guardar programación</>}
              </button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">⚙️ Programaciones activas</div>
              <button className="btn-ghost" onClick={fetchSchedules} disabled={schedLoading} style={{fontSize:".82rem",padding:"7px 13px"}}><span className={schedLoading?"spinning":""}>↻</span> Actualizar</button>
            </div>
            {schedLoading
              ? <div className="loading" style={{minHeight:100}}>Cargando…</div>
              : schedules.length === 0
                ? <div style={{padding:"48px",textAlign:"center",color:"#a0aec0"}}><div style={{fontSize:"2rem",marginBottom:8}}>📅</div><div style={{fontWeight:700,color:"#374151"}}>Sin programaciones configuradas</div></div>
                : <div className="tscroll">
                  <table className="tbl">
                    <thead>
                      <tr><th>Nombre</th><th>Frecuencia</th><th>Expresión Cron</th><th>Última ejecución</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {schedules.map(s => (
                        <tr key={s.id}>
                          <td style={{fontWeight:700,color:"#1e3a5f"}}>{s.nombre}</td>
                          <td style={{color:"#475569"}}>{fmtFreq(s)}</td>
                          <td><span className="mono">{s.cron_expr}</span></td>
                          <td style={{fontSize:".8rem",color:"#a0aec0"}}>{s.ultima_ejecucion?new Date(s.ultima_ejecucion).toLocaleString("es-MX"):"—"}</td>
                          <td><span style={{padding:"3px 12px",borderRadius:20,fontSize:".74rem",fontWeight:700,background:s.activo?"#e6f4ea":"#f1f5f9",color:s.activo?"#1e7e34":"#718096"}}>{s.activo?"● Activa":"○ Inactiva"}</span></td>
                          <td>
                            <div style={{display:"flex",gap:6}}>
                              <button className="icon-btn ib-green" onClick={() => handleRunSchedule(s.id)} disabled={runningId===s.id} title="Ejecutar ahora">{runningId===s.id?<span className="spinning">↻</span>:"▶"}</button>
                              <button className="icon-btn" onClick={() => handleToggle(s.id)} title={s.activo?"Pausar":"Activar"} style={{borderColor:s.activo?"#ffe082":"#a8d5b5",background:s.activo?"#fff8e1":"#e6f4ea",color:s.activo?"#c9961a":"#1e7e34"}}>{s.activo?"⏸":"▶"}</button>
                              <button className="icon-btn ib-red" onClick={() => handleDeleteSchedule(s.id)} disabled={deletingSchId===s.id} title="Eliminar">{deletingSchId===s.id?<span className="spinning">↻</span>:"🗑"}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </>
      )}

      {confirmDel && (
        <div className="overlay" onClick={() => !deleting && setConfirmDel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{fontSize:"3rem",marginBottom:12}}>🗑️</div>
            <h3>¿Eliminar este backup?</h3>
            <p>Se eliminará <strong>{confirmDel.nombre}</strong> de Supabase Storage y del registro.<br/><br/><span style={{color:"#c0392b",fontWeight:700}}>Esta acción no se puede deshacer.</span></p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDel(null)} disabled={deleting}>Cancelar</button>
              <button style={{padding:"10px 20px",borderRadius:8,border:"none",background:"#c0392b",color:"#fff",fontFamily:"inherit",fontWeight:700,fontSize:".88rem",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}} onClick={handleDelete} disabled={deleting}>
                {deleting ? <><span className="spinning">↻</span>Eliminando…</> : <>🗑️ Sí, eliminar</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {generating && (
        <div className="spin-overlay">
          <div className="spin-box">
            <div className="spinner"/>
            <h3>Generando backup…</h3>
            <p>Exportando todas las tablas y subiendo a Supabase Storage</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════ */
export default function MonitorDB() {
  const [overview,    setOverview]    = useState(null);
  const [perf,        setPerf]        = useState(null);
  const [maint,       setMaint]       = useState(null);
  const [procData,    setProcData]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdate,  setLastUpdate]  = useState(null);
  const [tab,         setTab]         = useState("overview");
  const [optimizing,  setOptimizing]  = useState(false);
  const [lastOptimize,setLastOptimize]= useState(null);
  const [optimLogs,   setOptimLogs]   = useState([]);
  const [toast,       setToast]       = useState(null);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({msg,type}); setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ovR, pfR, mnR, prR] = await Promise.all([
        fetch(`${API_URL}/api/admin/monitor/overview`,    {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/performance`, {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/maintenance`, {headers:auth()}),
        fetch(`${API_URL}/api/admin/monitor/processes`,   {headers:auth()}),
      ]);
      if (ovR.ok) setOverview(await ovR.json());
      if (pfR.ok) setPerf(await pfR.json());
      if (mnR.ok) setMaint(await mnR.json());
      if (prR.ok) setProcData(await prR.json());
      setLastUpdate(new Date());
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  }, []);

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res  = await fetch(`${API_URL}/api/admin/monitor/optimize`, {method:"POST",headers:{...auth(),"Content-Type":"application/json"},body:JSON.stringify({optimizeAll:true})});
      const data = await res.json();
      if (res.ok) {
        const logEntry = {fecha:new Date(),origen:"manual",ok:data.ok,total:data.total,total_ms:data.total_ms,errors:data.results?.filter(r => r.status==="error").length||0};
        setOptimLogs(prev => [logEntry,...prev]);
        setLastOptimize(`${new Date().toLocaleString("es-MX")} — ${data.ok}/${data.total} tablas en ${(data.total_ms/1000).toFixed(1)}s`);
        showToast(`✓ Optimización completada: ${data.ok}/${data.total} tablas en ${(data.total_ms/1000).toFixed(1)}s`);
        const mnR = await fetch(`${API_URL}/api/admin/monitor/maintenance`, {headers:auth()});
        if (mnR.ok) setMaint(await mnR.json());
      }
    } catch { showToast("Error ejecutando optimización","err"); }
    finally { setOptimizing(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { const t = setInterval(fetchAll, 60000); return () => clearInterval(t); }, []);

  const TABS = [
    {id:"overview",    label:"📊 Overview"},
    {id:"basedatos",   label:"🗄️ Base de Datos"},
    {id:"conexiones",  label:"🔗 Conexiones"},
    {id:"respaldos",   label:"💾 Respaldos"},
    {id:"optimizacion",label:"🛠️ Optimización"},
  ];

  return (
    <div className="mon">
      <style>{CSS}</style>

      {/* Banner */}
      <div className="mon-banner">
        <div className="mon-banner-left">
          <div className="mon-banner-icon">📊</div>
          <div>
            <div className="mon-banner-title">Monitoreo</div>
            <div className="mon-banner-sub">
              MySQL · performance_schema + information_schema
              {lastUpdate && <span style={{marginLeft:10}}>· actualizado: {lastUpdate.toLocaleTimeString("es-MX")}</span>}
            </div>
          </div>
        </div>
        <div className="mon-banner-right">
          {!loading && !error && <div className="mon-pill"><div className="mon-dot"/>Sistema OK</div>}
          <button onClick={fetchAll} disabled={loading} className="btn-ghost" style={{borderColor:"rgba(255,255,255,.3)",background:"rgba(255,255,255,.12)",color:"#fff"}}>
            <span className={loading?"spinning":""}>↻</span>{loading?"Cargando…":"Actualizar"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mon-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`mon-tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Body */}
      <div className="mon-body">
        {error && <div className="a-err">⚠ {error}</div>}
        {loading && !overview
          ? <div className="loading"><span className="spinning" style={{color:"#2c5282",fontSize:"1.2rem"}}>↻</span>Consultando base de datos…</div>
          : <>
            {tab==="overview"    && overview  && <TabOverview    overview={overview}/>}
            {tab==="basedatos"                && <TabBaseDatos   maint={maint} onOptimize={handleOptimize} optimizing={optimizing} lastOptimize={lastOptimize}/>}
            {tab==="conexiones"               && <TabConexiones  procData={procData}/>}
            {tab==="respaldos"                && <TabRespaldos   showToast={showToast}/>}
            {tab==="optimizacion"             && <TabOptimizacion maint={maint} onOptimize={handleOptimize} optimizing={optimizing} lastOptimize={lastOptimize} optimLogs={optimLogs}/>}
            {tab==="overview"   && !overview  && <div className="a-info">Cargando overview…</div>}
          </>
        }
      </div>

      <Toast toast={toast}/>
      {optimizing && (
        <div className="spin-overlay">
          <div className="spin-box">
            <div className="spinner"/>
            <h3>Optimizando base de datos…</h3>
            <p>Ejecutando ANALYZE + OPTIMIZE TABLE en todas las tablas InnoDB</p>
            <p style={{ marginTop: 8, fontSize: ".78rem", color: "#a0aec0" }}>
              Esto puede tardar varios segundos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}