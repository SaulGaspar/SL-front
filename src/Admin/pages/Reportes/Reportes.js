import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import {
  MdRefresh, MdStore, MdBarChart, MdWarning, MdTrendingDown,
  MdCategory, MdInfoOutline, MdTimeline, MdCalendarToday, MdSearch,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth    = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt     = n  => Number(n || 0).toLocaleString("es-MX");
const fmtMXN  = n  => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(n || 0);

const ALERTA_ORDER  = { agotado:0, critico:1, bajo:2, moderado:3, sin_movimiento:4, ok:5 };
const ALERTA_LABEL  = { critico:"Crítico", bajo:"Bajo", moderado:"Moderado", ok:"OK", agotado:"Agotado", sin_movimiento:"Sin movimiento" };
const ALERTA_COLORS = { critico:"#dc2626", bajo:"#d97706", moderado:"#2563eb", ok:"#16a34a", agotado:"#991b1b", sin_movimiento:"#94a3b8" };
const ALERTA_BG     = { critico:"#fee2e2", bajo:"#fef3c7", moderado:"#dbeafe", ok:"#dcfce7", agotado:"#fecaca", sin_movimiento:"#f1f5f9" };

const PALETTE = ["#2563eb","#16a34a","#d97706","#9333ea","#0891b2","#dc2626","#65a30d","#c026d3","#0284c7","#b45309"];

// ── HELPERS DE FECHA/SEMANA ───────────────────────────────────────────────────
function dateToISO(d) {
  return d.toISOString().slice(0, 10);
}

function formatShortDate(d) {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function getWeeksBetween(fromDate, toDate) {
  const weeks = [];
  const cur = new Date(fromDate);
  cur.setDate(cur.getDate() - ((cur.getDay() + 6) % 7));

  while (cur <= toDate) {
    const weekStart = new Date(cur);
    const weekEnd = new Date(cur);
    weekEnd.setDate(cur.getDate() + 6);

    const jan1 = new Date(weekStart.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((weekStart - jan1) / 86400000 + jan1.getDay() + 1) / 7);

    weeks.push({
      key: `${weekStart.getFullYear()}-W${String(weekNum).padStart(2,"00")}`,
      label: `Sem ${weekNum} (${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)})`,
      shortLabel: `S${weekNum}`,
      from: dateToISO(weekStart),
      to: dateToISO(weekEnd > toDate ? toDate : weekEnd),
      weekNum,
      year: weekStart.getFullYear(),
    });

    cur.setDate(cur.getDate() + 7);
  }
  return weeks;
}

// ── ESTILOS ───────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.rep * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

.page-header { margin-bottom:24px; }
.page-header h2 { font-size:1.5rem; font-weight:700; color:#0f172a; margin:0 0 4px; }
.page-header p  { font-size:.875rem; color:#64748b; margin:0; }

.rep-tabs-nav {
  display:flex; gap:0; background:white; border-radius:12px;
  box-shadow:0 1px 4px rgba(0,0,0,.06); margin-bottom:22px;
  overflow:hidden; border:1px solid #e2e8f0;
}
.rep-tab-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
  padding:14px 20px; border:none; background:transparent;
  font-family:'DM Sans',sans-serif; font-size:.875rem; font-weight:600;
  color:#64748b; cursor:pointer; border-bottom:3px solid transparent; transition:all .18s;
}
.rep-tab-btn:not(:last-child) { border-right:1px solid #f1f5f9; }
.rep-tab-btn:hover  { background:#f8fafc; color:#1e3a5f; }
.rep-tab-btn.active { color:#1e3a5f; background:#f0f5ff; border-bottom-color:#2563eb; }
.rep-tab-badge {
  display:inline-flex; align-items:center; justify-content:center;
  min-width:20px; height:20px; padding:0 6px; border-radius:10px;
  font-size:.65rem; font-weight:700; background:#fee2e2; color:#991b1b;
}

.rep-filters {
  background:white; border-radius:12px; padding:16px 20px;
  box-shadow:0 1px 4px rgba(0,0,0,.06); display:flex; gap:12px;
  flex-wrap:wrap; align-items:flex-end; margin-bottom:20px; border:1px solid #f1f5f9;
}
.rep-fg { display:flex; flex-direction:column; gap:4px; }
.rep-fg label { font-size:.7rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.5px; }
.rep-fg input, .rep-fg select {
  padding:8px 12px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.85rem; font-family:inherit; min-width:140px; color:#1e293b; background:white;
}
.rep-fg input:focus, .rep-fg select:focus { outline:none; border-color:#2563eb; }
.rep-apply {
  display:flex; align-items:center; gap:6px; background:#1e3a5f; color:white;
  border:none; padding:8px 18px; border-radius:8px; font-weight:600;
  cursor:pointer; font-family:inherit; font-size:.85rem; transition:background .2s; align-self:flex-end;
}
.rep-apply:hover { background:#2c5282; }
.rep-apply:disabled { opacity:.5; cursor:not-allowed; }

.rep-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.rep-kpi  { background:white; border-radius:12px; padding:18px 20px; box-shadow:0 1px 4px rgba(0,0,0,.06); border-left:4px solid transparent; }
.rep-kpi.red    { border-left-color:#dc2626; }
.rep-kpi.orange { border-left-color:#d97706; }
.rep-kpi.blue   { border-left-color:#2563eb; }
.rep-kpi.green  { border-left-color:#16a34a; }
.rep-kpi-lbl { font-size:.68rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
.rep-kpi-val { font-family:'JetBrains Mono',monospace; font-size:1.55rem; font-weight:700; color:#0f172a; line-height:1.1; }
.rep-kpi-sub { font-size:.7rem; color:#94a3b8; margin-top:3px; }

.rep-grid2  { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.rep-panel  { background:white; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,.06); overflow:hidden; margin-bottom:16px; border:1px solid #f1f5f9; }
.rep-panel-head {
  padding:13px 18px; border-bottom:1px solid #f1f5f9;
  display:flex; align-items:center; justify-content:space-between; gap:8px;
}
.rep-panel-title { font-size:.85rem; font-weight:700; color:#0f172a; display:flex; align-items:center; gap:7px; }
.rep-panel-title svg { color:#2563eb; }
.rep-panel-body { padding:18px; }
.rep-badge { font-size:.68rem; font-weight:700; padding:2px 9px; border-radius:20px; background:#eff6ff; color:#2563eb; font-family:'JetBrains Mono',monospace; }

.hbar { display:flex; flex-direction:column; gap:9px; }
.hbar-row  { display:flex; align-items:center; gap:9px; }
.hbar-lbl  { font-size:.76rem; color:#475569; width:140px; text-align:right; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hbar-track { flex:1; height:22px; background:#f1f5f9; border-radius:4px; overflow:hidden; }
.hbar-fill  { height:100%; border-radius:4px; display:flex; align-items:center; padding-left:8px; font-size:.7rem; font-weight:700; color:white; transition:width .5s ease; }
.hbar-val   { font-size:.76rem; font-weight:700; color:#0f172a; width:85px; flex-shrink:0; font-family:'JetBrains Mono',monospace; text-align:right; }

/* ── CHART.JS CANVAS WRAPPER ─────────────────────── */
.canvas-wrapper { position:relative; width:100%; height:260px; }

/* ── TABLA SEMANAL ─────────────────────────────── */
.weekly-table-wrap { overflow-x:auto; }
.weekly-table { width:100%; border-collapse:collapse; font-size:.82rem; }
.weekly-table th {
  padding:10px 14px; text-align:left; font-size:.68rem; font-weight:700;
  color:#64748b; text-transform:uppercase; letter-spacing:.4px;
  border-bottom:2px solid #e2e8f0; background:#fafbfc;
}
.weekly-table td { padding:10px 14px; border-bottom:1px solid #f8fafc; color:#334155; vertical-align:middle; }
.weekly-table tbody tr:hover { background:#f8fafc; }
.weekly-table tbody tr:last-child td { border-bottom:none; }
.weekly-table tbody tr.is-pred td { background:#fff8f0; }
.weekly-table tbody tr.is-sel td { background:#f0f5ff; }
.weekly-table .pred-tag {
  display:inline-flex; align-items:center; gap:3px;
  background:#fef3c7; color:#92400e; padding:1px 7px;
  border-radius:4px; font-size:.65rem; font-weight:700;
}
.weekly-table .real-tag {
  display:inline-flex; align-items:center; gap:3px;
  background:#dcfce7; color:#166534; padding:1px 7px;
  border-radius:4px; font-size:.65rem; font-weight:700;
}
.weekly-table .sel-tag {
  display:inline-flex; align-items:center; gap:3px;
  background:#dbeafe; color:#1e40af; padding:1px 7px;
  border-radius:4px; font-size:.65rem; font-weight:700;
}

/* ── BÚSQUEDA ────────────────────────────────────── */
.search-bar-wrapper {
  display:flex; align-items:center; gap:8px;
  padding:10px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0;
}
.search-bar {
  flex:1; display:flex; align-items:center; gap:8px;
  background:white; border:1.5px solid #e2e8f0; border-radius:8px;
  padding:7px 12px;
}
.search-bar:focus-within { border-color:#2563eb; }
.search-bar svg { color:#94a3b8; flex-shrink:0; }
.search-bar input {
  border:none; outline:none; background:transparent;
  font-family:'DM Sans',sans-serif; font-size:.85rem; color:#1e293b;
  width:100%;
}
.search-bar input::placeholder { color:#94a3b8; }
.search-count {
  font-size:.72rem; font-weight:700; color:#64748b; white-space:nowrap;
  font-family:'JetBrains Mono',monospace;
}

/* TABLA PREDICCIÓN */
.pred-table-wrap { overflow-x:auto; }
.pred-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.pred-table th {
  padding:10px 12px; text-align:left; font-size:.67rem; font-weight:700;
  color:#64748b; text-transform:uppercase; letter-spacing:.4px;
  border-bottom:2px solid #e2e8f0; white-space:nowrap; background:#fafbfc;
  position:sticky; top:0; z-index:1;
}
.pred-table th.sortable { cursor:pointer; user-select:none; }
.pred-table th.sortable:hover { color:#1e3a5f; background:#f0f5ff; }
.pred-table td { padding:10px 12px; border-bottom:1px solid #f8fafc; color:#334155; vertical-align:middle; }
.pred-table tbody tr:hover { background:#f8fafc; }
.pred-table tbody tr:last-child td { border-bottom:none; }

.alerta-badge {
  display:inline-flex; align-items:center; gap:4px; padding:3px 9px;
  border-radius:5px; font-size:.68rem; font-weight:700; white-space:nowrap;
}

.stock-bar { margin-top:4px; height:3px; background:#e2e8f0; border-radius:2px; overflow:hidden; }
.stock-bar-fill { height:100%; border-radius:2px; transition:width .3s; }

.dias-val { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:.82rem; }
.dias-val.danger  { color:#dc2626; }
.dias-val.warning { color:#d97706; }
.dias-val.ok      { color:#16a34a; }

.suc-tabs { display:flex; gap:6px; flex-wrap:wrap; padding:12px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0; }
.suc-tab {
  padding:5px 14px; border-radius:20px; border:1.5px solid #e2e8f0;
  background:white; font-size:.78rem; font-weight:600; color:#64748b;
  cursor:pointer; transition:all .15s; font-family:inherit;
}
.suc-tab:hover  { border-color:#2563eb; color:#1e3a5f; }
.suc-tab.active { background:#1e3a5f; color:white; border-color:#1e3a5f; }
.suc-tab .suc-badge {
  display:inline-flex; align-items:center; justify-content:center;
  width:16px; height:16px; border-radius:50%; font-size:.6rem; font-weight:700;
  background:rgba(255,255,255,.25); margin-left:5px;
}
.suc-tab:not(.active) .suc-badge { background:#fee2e2; color:#991b1b; }

.pred-filters {
  display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;
  padding:12px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0;
}
.pred-filter-group { display:flex; flex-direction:column; gap:3px; }
.pred-filter-group label { font-size:.67rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.4px; }
.pred-filter-group select, .pred-filter-group input[type="date"] {
  padding:6px 10px; border:1.5px solid #e2e8f0; border-radius:7px;
  font-size:.8rem; font-family:inherit; color:#1e293b; background:white; min-width:130px;
}
.pred-filter-group select:focus, .pred-filter-group input[type="date"]:focus { outline:none; border-color:#2563eb; }

.agot-wrap { position:relative; display:inline-block; }
.agot-btn {
  display:flex; align-items:center; gap:5px; background:none; border:none;
  cursor:pointer; padding:0; font-family:'DM Sans',sans-serif; text-align:left;
}
.agot-btn:hover .agot-icon { color:#2563eb; }
.agot-icon { color:#cbd5e1; transition:color .15s; flex-shrink:0; }
.agot-popover {
  position:fixed; background:#0f172a; color:white; border-radius:10px; padding:12px 14px;
  width:240px; font-size:.78rem; line-height:1.5; z-index:99999;
  box-shadow:0 8px 32px rgba(0,0,0,.35); animation: fadeIn .15s ease; pointer-events:none;
}
.agot-popover-title { font-weight:700; font-size:.8rem; margin-bottom:6px; color:#e2e8f0; }
.agot-popover-row   { display:flex; justify-content:space-between; gap:8px; margin-bottom:3px; }
.agot-popover-label { color:#94a3b8; }
.agot-popover-val   { font-family:'JetBrains Mono',monospace; font-weight:600; color:white; }
.agot-divider { margin:8px 0; border:none; border-top:1px solid #1e293b; }

/* ── GRÁFICA PREDICCIÓN INVENTARIO ─────────────── */
.inv-chart-panel { background:white; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,.06); overflow:hidden; margin-bottom:20px; border:1px solid #f1f5f9; }
.inv-chart-head {
  padding:14px 18px; border-bottom:1px solid #f1f5f9;
  display:flex; align-items:center; justify-content:space-between; gap:8px;
}
.inv-chart-title { font-size:.88rem; font-weight:700; color:#0f172a; display:flex; align-items:center; gap:7px; }
.inv-chart-title svg { color:#d97706; }
.inv-chart-filters {
  display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap;
  padding:12px 18px; border-bottom:1px solid #f1f5f9; background:#fafbfc;
}
.inv-chart-filter { display:flex; flex-direction:column; gap:3px; }
.inv-chart-filter label { font-size:.67rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.4px; }
.inv-chart-filter input[type="date"], .inv-chart-filter input[type="text"] {
  padding:6px 10px; border:1.5px solid #e2e8f0; border-radius:7px;
  font-size:.8rem; font-family:inherit; color:#1e293b; background:white; min-width:140px;
}
.inv-chart-filter input:focus { outline:none; border-color:#2563eb; }
.inv-search-box {
  display:flex; align-items:center; gap:7px; background:white;
  border:1.5px solid #e2e8f0; border-radius:7px; padding:5px 10px;
  min-width:200px;
}
.inv-search-box:focus-within { border-color:#2563eb; }
.inv-search-box svg { color:#94a3b8; flex-shrink:0; }
.inv-search-box input {
  border:none; outline:none; background:transparent;
  font-family:'DM Sans',sans-serif; font-size:.8rem; color:#1e293b; width:100%;
}
.inv-search-box input::placeholder { color:#94a3b8; }
.inv-chart-body { padding:16px 18px; }
.inv-chart-legend { display:flex; gap:14px; align-items:center; flex-wrap:wrap; margin-bottom:10px; }
.inv-chart-legend-item { display:flex; align-items:center; gap:5px; font-size:.72rem; color:#64748b; }
.inv-chart-legend-dot { width:10px; height:10px; border-radius:2px; }
.inv-chart-canvas-wrap { position:relative; width:100%; height:300px; }
.inv-chart-empty { display:flex; align-items:center; justify-content:center; height:200px; color:#94a3b8; font-size:.85rem; }

@keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
.spinning { animation:spin .8s linear infinite; }
@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
.rep-empty { text-align:center; color:#94a3b8; padding:40px; font-size:.84rem; }
.mono { font-family:'JetBrains Mono',monospace; font-size:.78rem; }

@media(max-width:1024px){ .rep-kpis{grid-template-columns:1fr 1fr;} .rep-grid2{grid-template-columns:1fr;} }
@media(max-width:640px){  .rep-kpis{grid-template-columns:1fr;} }
`;

// ── HELPERS UI ────────────────────────────────────────────────────────────────
function HBarChart({ data, labelKey, valueKey, isMXN=true, maxItems=8 }) {
  if (!data?.length) return <div className="rep-empty">Sin datos</div>;
  const max = Math.max(...data.map(d => Number(d[valueKey]||0)), 1);
  return (
    <div className="hbar">
      {data.slice(0, maxItems).map((d, i) => {
        const val = Number(d[valueKey]||0);
        const pct = (val/max)*100;
        const lbl = String(d[labelKey]||"—");
        return (
          <div key={i} className="hbar-row">
            <div className="hbar-lbl" title={lbl}>{lbl}</div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width:`${pct}%`, background:PALETTE[i%PALETTE.length] }}>
                {pct > 15 ? (isMXN ? fmtMXN(val) : fmt(val)) : ""}
              </div>
            </div>
            <div className="hbar-val">{isMXN ? fmtMXN(val) : fmt(val)}</div>
          </div>
        );
      })}
    </div>
  );
}

function AlertaBadge({ alerta }) {
  return (
    <span className="alerta-badge" style={{ background:ALERTA_BG[alerta], color:ALERTA_COLORS[alerta] }}>
      {ALERTA_LABEL[alerta] || alerta}
    </span>
  );
}

function semanasATexto(sem) {
  if (sem === null || sem === undefined) return null;
  if (sem < 0.5)  return { corto:"< 3 días",    largo:"menos de 3 días" };
  if (sem < 1)    return { corto:"< 1 semana",  largo:"menos de 1 semana" };
  const dias = Math.round(sem * 7);
  if (sem < 2)    return { corto:`~${dias} días`,    largo:`aproximadamente ${dias} días` };
  if (sem < 5)    return { corto:`~${sem.toFixed(1)} sem`, largo:`aprox. ${sem.toFixed(1)} semanas (~${dias} días)` };
  if (sem < 20)   return { corto:`~${(sem/4.33).toFixed(1)} mes`,  largo:`aprox. ${(sem/4.33).toFixed(1)} meses (~${dias} días)` };
  return { corto:`~${(sem/4.33/12).toFixed(1)} años`, largo:`aprox. ${(sem/4.33/12).toFixed(1)} años` };
}

function StockBar({ stock, minStock, alerta }) {
  const pct = minStock > 0
    ? Math.min(100, Math.round((stock / Math.max(stock * 1.5, minStock * 1.5)) * 100))
    : 50;
  return (
    <div>
      <span className="mono" style={{ color:ALERTA_COLORS[alerta], fontWeight:700 }}>{stock}</span>
      <div className="stock-bar">
        <div className="stock-bar-fill" style={{ width:`${pct}%`, background:ALERTA_COLORS[alerta] }} />
      </div>
    </div>
  );
}

// ── POPOVER AGOTAMIENTO ───────────────────────────────────────────────────────
function AgotamientoCell({ d }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top:0, left:0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = e => { if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = () => setOpen(false);
    window.addEventListener("scroll", h, true);
    return () => window.removeEventListener("scroll", h, true);
  }, [open]);

  const handleClick = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 10, left: r.left + r.width / 2 });
    }
    setOpen(o => !o);
  };

  const agot = semanasATexto(d.semanas_agotamiento);
  const crit = semanasATexto(d.semanas_a_critico);
  const yaC  = d.stock_actual <= (d.min_stock || 0);
  const diasAgot = d.semanas_agotamiento ? d.semanas_agotamiento * 7 : null;
  const agotClass = !diasAgot ? "ok" : diasAgot <= 30 ? "danger" : diasAgot <= 90 ? "warning" : "ok";

  if (!agot) return <span style={{ color:"#94a3b8", fontSize:".75rem" }}>—</span>;

  return (
    <div className="agot-wrap" ref={btnRef}>
      <button className="agot-btn" onClick={handleClick}>
        <div>
          <span className={`dias-val ${agotClass}`}>{agot.corto}</span>
          {d.semanas_agotamiento && (
            <div style={{ fontSize:".67rem", color:"#94a3b8", marginTop:1 }}>
              ~{Math.round(d.semanas_agotamiento * 7)} días totales
            </div>
          )}
        </div>
        <MdInfoOutline size={14} className="agot-icon" />
      </button>
      {open && (
        <div className="agot-popover" style={{ top:pos.top, left:pos.left, transform:"translateX(-50%)" }}>
          <div className="agot-popover-title">📦 {d.producto?.trim() || "Producto"}</div>
          <div className="agot-popover-row"><span className="agot-popover-label">Sucursal:</span><span className="agot-popover-val">{d.sucursal}</span></div>
          <div className="agot-popover-row"><span className="agot-popover-label">Stock actual:</span><span className="agot-popover-val">{d.stock_actual} uds.</span></div>
          <div className="agot-popover-row"><span className="agot-popover-label">Mínimo req.:</span><span className="agot-popover-val">{d.min_stock || "—"} uds.</span></div>
          <div className="agot-popover-row"><span className="agot-popover-label">Ventas/día:</span><span className="agot-popover-val">{d.tasa_diaria} uds.</span></div>
          <hr className="agot-divider" />
          <div className="agot-popover-row">
            <span className="agot-popover-label">Llega a mínimo en:</span>
            <span className="agot-popover-val" style={{ color: yaC ? "#f87171" : "#fbbf24" }}>
              {yaC ? "⚠ Ya alcanzado" : (crit ? crit.corto : "—")}
            </span>
          </div>
          <div className="agot-popover-row">
            <span className="agot-popover-label">Se agota en:</span>
            <span className="agot-popover-val" style={{ color: agotClass==="danger"?"#f87171":agotClass==="warning"?"#fbbf24":"#4ade80" }}>
              {agot.largo}
            </span>
          </div>
          {d.semanas_agotamiento && (
            <div className="agot-popover-row">
              <span className="agot-popover-label">Fecha aprox.:</span>
              <span className="agot-popover-val" style={{ fontSize:".72rem" }}>
                {new Date(Date.now() + d.semanas_agotamiento * 7 * 86400000)
                  .toLocaleDateString("es-MX", { day:"numeric", month:"short", year:"numeric" })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── GRÁFICA DE PREDICCIÓN DE AGOTAMIENTO (Chart.js) ──────────────────────────
function GraficaPrediccionInventario({ data, loading }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const today     = new Date();

  // Estado local: filtros de fecha y búsqueda de producto
  const ago30 = new Date(Date.now() - 30 * 86400000);
  const [grafFrom,    setGrafFrom]    = useState(dateToISO(today));
  const [grafTo,      setGrafTo]      = useState(dateToISO(new Date(Date.now() + 90 * 86400000)));
  const [busquedaProd, setBusquedaProd] = useState("");

  // Filtrar productos con movimiento para graficar stock proyectado
  const productosFiltrados = useMemo(() => {
    let items = data.filter(d =>
      d.tasa_diaria > 0 &&
      d.semanas_agotamiento !== null &&
      d.alerta !== "sin_movimiento" &&
      d.alerta !== "ok"
    );
    if (busquedaProd.trim()) {
      const q = busquedaProd.trim().toLowerCase();
      items = items.filter(d =>
        (d.producto || "").toLowerCase().includes(q) ||
        (d.marca     || "").toLowerCase().includes(q)
      );
    }
    // Ordenar por alerta (más críticos primero) y limitar a 8
    return items
      .sort((a, b) => (ALERTA_ORDER[a.alerta] ?? 9) - (ALERTA_ORDER[b.alerta] ?? 9))
      .slice(0, 8);
  }, [data, busquedaProd]);

  // Proyectar stock en el tiempo para el rango seleccionado
  const { labels, datasets } = useMemo(() => {
    const fromD = new Date(grafFrom);
    const toD   = new Date(grafTo);
    const diffDays = Math.ceil((toD - fromD) / 86400000);
    if (diffDays <= 0 || !productosFiltrados.length) return { labels:[], datasets:[] };

    // Generar etiquetas de fechas (máx 15 puntos para legibilidad)
    const step = Math.max(1, Math.ceil(diffDays / 14));
    const pts  = [];
    for (let d = 0; d <= diffDays; d += step) pts.push(d);
    if (pts[pts.length - 1] !== diffDays) pts.push(diffDays);

    const lbls = pts.map(d => {
      const dt = new Date(fromD.getTime() + d * 86400000);
      return dt.toLocaleDateString("es-MX", { day:"numeric", month:"short" });
    });

    const dsets = productosFiltrados.map((prod, idx) => {
      const color = ALERTA_COLORS[prod.alerta] || PALETTE[idx % PALETTE.length];
      // Stock proyectado = stock_actual - tasa_diaria * (días desde HOY hasta punto)
      const daysFromToday = Math.ceil((fromD - today) / 86400000);
      const projData = pts.map(d => {
        const totalDays = daysFromToday + d;
        const proj = prod.stock_actual - prod.tasa_diaria * totalDays;
        return Math.max(0, Math.round(proj));
      });
      return {
        label: `${prod.producto?.trim() || "Producto"} · ${prod.sucursal}`,
        data:  projData,
        borderColor: color,
        backgroundColor: color + "22",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.3,
      };
    });

    return { labels: lbls, datasets: dsets };
  }, [productosFiltrados, grafFrom, grafTo]);

  useEffect(() => {
    if (!canvasRef.current || !labels.length) {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      return;
    }
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              font: { size: 10, family: "'DM Sans',sans-serif" },
              color: "#64748b",
              boxWidth: 12,
              padding: 12,
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)} uds.`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 10, family: "'DM Sans',sans-serif" },
              maxRotation: 35,
            },
          },
          y: {
            grid: { color: "rgba(148,163,184,0.15)" },
            ticks: {
              color: "#94a3b8",
              font: { size: 10, family: "'JetBrains Mono',monospace" },
            },
            beginAtZero: true,
            title: {
              display: true,
              text: "Unidades proyectadas",
              color: "#94a3b8",
              font: { size: 10 },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [labels, datasets]);

  return (
    <div className="inv-chart-panel">
      <div className="inv-chart-head">
        <div className="inv-chart-title">
          <MdTimeline />
          Proyección de stock por producto (críticos y bajos)
        </div>
        <span className="rep-badge">{productosFiltrados.length} productos</span>
      </div>

      {/* Filtros internos de la gráfica */}
      <div className="inv-chart-filters">
        <div className="inv-chart-filter">
          <label>Proyección desde</label>
          <input
            type="date"
            value={grafFrom}
            onChange={e => setGrafFrom(e.target.value)}
          />
        </div>
        <div className="inv-chart-filter">
          <label>Proyección hasta</label>
          <input
            type="date"
            value={grafTo}
            onChange={e => setGrafTo(e.target.value)}
          />
        </div>
        <div className="inv-chart-filter" style={{ flex:1 }}>
          <label>Buscar producto</label>
          <div className="inv-search-box">
            <MdSearch size={15} />
            <input
              type="text"
              placeholder="Nombre o marca del producto…"
              value={busquedaProd}
              onChange={e => setBusquedaProd(e.target.value)}
            />
            {busquedaProd && (
              <button
                onClick={() => setBusquedaProd("")}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:0, lineHeight:1, fontSize:16 }}
              >×</button>
            )}
          </div>
        </div>
        <div style={{ fontSize:".7rem", color:"#94a3b8", alignSelf:"flex-end", paddingBottom:6, maxWidth:200 }}>
          Muestra hasta 8 productos críticos o bajos. El stock proyectado usa la tasa de venta diaria actual.
        </div>
      </div>

      <div className="inv-chart-body">
        {loading ? (
          <div className="inv-chart-empty">
            <MdRefresh size={18} className="spinning" style={{ marginRight:8 }} />
            Calculando proyecciones…
          </div>
        ) : !labels.length ? (
          <div className="inv-chart-empty">
            {busquedaProd
              ? `Sin productos que coincidan con "${busquedaProd}" en estado crítico o bajo`
              : "Sin productos críticos o bajos con tasa de venta registrada"}
          </div>
        ) : (
          <div className="inv-chart-canvas-wrap">
            <canvas ref={canvasRef} role="img" aria-label="Proyección de stock por producto" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── TAB: VENTAS (sin gráfica de predicción de inventario) ─────────────────────
function TabReportes({ branches }) {
  const today  = new Date();
  const ago90  = new Date(Date.now() - 90 * 86400000);

  const [rangeFrom, setRangeFrom] = useState(dateToISO(ago90));
  const [rangeTo,   setRangeTo]   = useState(dateToISO(today));
  const [branch,    setBranch]    = useState("all");
  const [loading,   setLoading]   = useState(false);
  const [summary,   setSummary]   = useState(null);
  const [topProds,  setTopProds]  = useState([]);
  const [topCats,   setTopCats]   = useState([]);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ from: rangeFrom, to: rangeTo });
    if (branch !== "all") p.append("branch", branch);
    try {
      const [s, tp, tc] = await Promise.all([
        fetch(`${API_URL}/api/admin/reports/summary?${p}`,      { headers:auth() }).then(r => r.ok ? r.json() : null),
        fetch(`${API_URL}/api/admin/reports/top-products?${p}`, { headers:auth() }).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/api/admin/reports/by-category?${p}`,  { headers:auth() }).then(r => r.ok ? r.json() : []),
      ]);
      setSummary(s);
      setTopProds(Array.isArray(tp) ? tp : []);
      setTopCats(Array.isArray(tc) ? tc : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [rangeFrom, rangeTo, branch]);

  useEffect(() => { loadSummary(); }, []);

  const kpis = summary ? [
    { label:"Ingresos",        val:fmtMXN(summary.current?.ingresos),       color:"blue",   sub:"período seleccionado" },
    { label:"Pedidos",         val:fmt(summary.current?.total_pedidos),      color:"green",  sub:`entregados: ${fmt(summary.current?.entregados)}` },
    { label:"Ticket prom.",    val:fmtMXN(summary.current?.ticket_promedio), color:"orange", sub:"promedio por pedido" },
    { label:"Clientes únicos", val:fmt(summary.current?.clientes_unicos),    color:"blue",   sub:"en el período" },
  ] : [];

  return (
    <>
      {/* Filtros generales */}
      <div className="rep-filters">
        <div className="rep-fg"><label>Rango desde</label><input type="date" value={rangeFrom} onChange={e=>setRangeFrom(e.target.value)}/></div>
        <div className="rep-fg"><label>Rango hasta</label><input type="date" value={rangeTo}   onChange={e=>setRangeTo(e.target.value)}/></div>
        <div className="rep-fg">
          <label>Sucursal</label>
          <select value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="all">Todas</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
        </div>
        <button className="rep-apply" onClick={loadSummary} disabled={loading}>
          <MdRefresh size={15} className={loading?"spinning":""}/> {loading ? "Cargando…" : "Aplicar"}
        </button>
      </div>

      {/* KPIs período */}
      {summary && (
        <div className="rep-kpis">
          {kpis.map(k => (
            <div key={k.label} className={`rep-kpi ${k.color}`}>
              <div className="rep-kpi-lbl">{k.label}</div>
              <div className="rep-kpi-val">{k.val}</div>
              <div className="rep-kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Top products / categorías */}
      <div className="rep-grid2">
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdBarChart/>Top 10 productos más vendidos</div>
            <span className="rep-badge">{topProds.length}</span>
          </div>
          <div className="rep-panel-body">
            {topProds.length
              ? <HBarChart data={topProds} labelKey="nombre" valueKey="vendidos" isMXN={false} maxItems={10}/>
              : <div className="rep-empty">Sin datos</div>}
          </div>
        </div>
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdCategory/>Ventas por categoría</div>
            <span className="rep-badge">{topCats.length}</span>
          </div>
          <div className="rep-panel-body">
            {topCats.length
              ? <HBarChart data={topCats} labelKey="categoria" valueKey="ingresos" isMXN={true} maxItems={8}/>
              : <div className="rep-empty">Sin datos</div>}
          </div>
        </div>
      </div>
    </>
  );
}

// ── TAB: PREDICCIÓN DE AGOTAMIENTO ───────────────────────────────────────────
function TabAgotamiento({ branches }) {
  const [data,         setData]         = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [sucursal,     setSucursal]     = useState("all");
  const [filtAlerta,   setFiltAlerta]   = useState("");
  const [filtCat,      setFiltCat]      = useState("");
  const [filtBusqueda, setFiltBusqueda] = useState("");
  const [sortCol,      setSortCol]      = useState("alerta");
  const [sortDir,      setSortDir]      = useState("asc");

  const today  = new Date();
  const ago30  = new Date(Date.now() - 30 * 86400000);
  const [predFrom, setPredFrom] = useState(dateToISO(ago30));
  const [predTo,   setPredTo]   = useState(dateToISO(today));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (sucursal !== "all") p.set("branch",    sucursal);
      if (filtAlerta)         p.set("alerta",     filtAlerta);
      if (filtCat)            p.set("categoria",  filtCat);
      if (predFrom)           p.set("from",       predFrom);
      if (predTo)             p.set("to",         predTo);
      const res = await fetch(`${API_URL}/api/admin/reports/prediccion-agotamiento?${p}`, { headers:auth() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      setData(Array.isArray(raw) ? raw : []);
    } catch(e) { console.error(e); setData([]); }
    finally { setLoading(false); }
  }, [sucursal, filtAlerta, filtCat, predFrom, predTo]);

  useEffect(() => { load(); }, [load]);

  const [totales, setTotales] = useState({ critico:0, agotado:0, bajo:0, sin_movimiento:0 });
  useEffect(() => {
    fetch(`${API_URL}/api/admin/reports/prediccion-agotamiento`, { headers:auth() })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        if (!Array.isArray(raw)) return;
        setTotales({
          critico:        raw.filter(d => d.alerta === "critico").length,
          agotado:        raw.filter(d => d.alerta === "agotado").length,
          bajo:           raw.filter(d => d.alerta === "bajo").length,
          sin_movimiento: raw.filter(d => d.alerta === "sin_movimiento").length,
        });
      }).catch(() => {});
  }, []);

  const categorias = useMemo(
    () => [...new Set(data.map(d => d.categoria).filter(Boolean))].sort(),
    [data]
  );

  const alertasPorSuc = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.branch_id]) map[d.branch_id] = 0;
      if (d.alerta === "critico" || d.alerta === "agotado") map[d.branch_id]++;
    });
    return map;
  }, [data]);

  const filteredBySearch = useMemo(() => {
    if (!filtBusqueda.trim()) return data;
    const q = filtBusqueda.trim().toLowerCase();
    return data.filter(d =>
      (d.producto  || "").toLowerCase().includes(q) ||
      (d.marca     || "").toLowerCase().includes(q) ||
      (d.categoria || "").toLowerCase().includes(q) ||
      (d.sucursal  || "").toLowerCase().includes(q)
    );
  }, [data, filtBusqueda]);

  const sorted = useMemo(() => {
    return [...filteredBySearch].sort((a, b) => {
      let va, vb;
      switch(sortCol) {
        case "alerta":   va = ALERTA_ORDER[a.alerta]??9;  vb = ALERTA_ORDER[b.alerta]??9; break;
        case "stock":    va = a.stock_actual;              vb = b.stock_actual;            break;
        case "semanas":  va = a.semanas_a_critico??9999;  vb = b.semanas_a_critico??9999; break;
        case "ventas":   va = a.ventas_30d;               vb = b.ventas_30d;              break;
        case "producto": va = a.producto||"";             vb = b.producto||"";            break;
        case "sucursal": va = a.sucursal||"";             vb = b.sucursal||"";            break;
        default:         va = 0; vb = 0;
      }
      if (typeof va === "string") return sortDir==="asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }, [filteredBySearch, sortCol, sortDir]);

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortCol(col); setSortDir("asc"); }
  };
  const sortIcon = col => sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <>
      {/* KPIs */}
      <div className="rep-kpis">
        {[
          { label:"Críticos",       sub:"Stock en o bajo mínimo",  val:totales.critico,        color:"red"    },
          { label:"Agotados",       sub:"Stock = 0 unidades",       val:totales.agotado,        color:"red"    },
          { label:"Bajo stock",     sub:"Crítico en ≤ 4 semanas",   val:totales.bajo,           color:"orange" },
          { label:"Sin movimiento", sub:"0 ventas en 30 días",      val:totales.sin_movimiento, color:"blue"   },
        ].map((k, i) => (
          <div key={i} className={`rep-kpi ${k.color}`}>
            <div className="rep-kpi-lbl">{k.label}</div>
            <div className="rep-kpi-val">{k.val}</div>
            <div className="rep-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── GRÁFICA DE PROYECCIÓN DE STOCK ── */}
      <GraficaPrediccionInventario data={data} loading={loading} />

      {/* ── TABLA DE PREDICCIÓN ── */}
      <div className="rep-panel">
        <div className="rep-panel-head">
          <div className="rep-panel-title"><MdTrendingDown/>Predicción de agotamiento por producto · sucursal</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span className="rep-badge">{sorted.length} / {data.length}</span>
            <button className="rep-apply" onClick={load} disabled={loading} style={{ padding:"6px 14px", fontSize:".78rem" }}>
              <MdRefresh size={14} className={loading ? "spinning" : ""}/>
              {loading ? "Cargando…" : "Actualizar"}
            </button>
          </div>
        </div>

        {/* Filtros de período de ventas */}
        <div className="rep-filters" style={{ borderRadius:0, boxShadow:"none", borderLeft:"none", borderRight:"none", borderTop:"none", marginBottom:0 }}>
          <div className="rep-fg">
            <label>Período de ventas desde</label>
            <input type="date" value={predFrom} onChange={e => setPredFrom(e.target.value)} />
          </div>
          <div className="rep-fg">
            <label>Período de ventas hasta</label>
            <input type="date" value={predTo} onChange={e => setPredTo(e.target.value)} />
          </div>
          <div style={{ fontSize:".72rem", color:"#64748b", alignSelf:"flex-end", paddingBottom:10, maxWidth:220 }}>
            El período define las ventas usadas para calcular la tasa de decrecimiento
          </div>
          <button className="rep-apply" onClick={load} disabled={loading} style={{ alignSelf:"flex-end" }}>
            <MdRefresh size={14} className={loading?"spinning":""}/> Recalcular
          </button>
        </div>

        {/* Tabs por sucursal */}
        <div className="suc-tabs">
          <button className={`suc-tab${sucursal==="all"?" active":""}`} onClick={() => setSucursal("all")}>
            Todas las sucursales
            {(totales.critico + totales.agotado) > 0 && (
              <span className="suc-badge">{totales.critico + totales.agotado}</span>
            )}
          </button>
          {branches.map(b => {
            const cnt = alertasPorSuc[b.id] || 0;
            return (
              <button key={b.id} className={`suc-tab${sucursal===String(b.id)?" active":""}`}
                onClick={() => setSucursal(String(b.id))}>
                {b.nombre || b.id}
                {cnt > 0 && <span className="suc-badge">{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* Filtros de alerta, categoría */}
        <div className="pred-filters">
          <div className="pred-filter-group">
            <label>Estado de alerta</label>
            <select value={filtAlerta} onChange={e => setFiltAlerta(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="agotado">⚫ Agotado</option>
              <option value="critico">🔴 Crítico</option>
              <option value="bajo">🟡 Bajo</option>
              <option value="moderado">🔵 Moderado</option>
              <option value="sin_movimiento">⬜ Sin movimiento</option>
              <option value="ok">🟢 OK</option>
            </select>
          </div>
          <div className="pred-filter-group">
            <label>Categoría</label>
            <select value={filtCat} onChange={e => setFiltCat(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Buscador */}
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <MdSearch size={16} />
            <input
              type="text"
              placeholder="Buscar por producto, marca, categoría o sucursal…"
              value={filtBusqueda}
              onChange={e => setFiltBusqueda(e.target.value)}
            />
            {filtBusqueda && (
              <button
                onClick={() => setFiltBusqueda("")}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:0, lineHeight:1, fontSize:16 }}
              >
                ×
              </button>
            )}
          </div>
          <span className="search-count">
            {sorted.length} de {data.length}
          </span>
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:52, color:"#94a3b8" }}>
            <MdRefresh size={22} className="spinning"/>
            Calculando predicciones por sucursal…
          </div>
        ) : (
          <div className="pred-table-wrap">
            <table className="pred-table">
              <thead>
                <tr>
                  <th style={{ width:28 }}>#</th>
                  <th className="sortable" onClick={() => toggleSort("producto")}>Producto{sortIcon("producto")}</th>
                  <th className="sortable" onClick={() => toggleSort("sucursal")}>Sucursal{sortIcon("sucursal")}</th>
                  <th>Categoría</th>
                  <th className="sortable" onClick={() => toggleSort("stock")}>Stock actual{sortIcon("stock")}</th>
                  <th>Mín. req.</th>
                  <th className="sortable" onClick={() => toggleSort("ventas")}>Ventas/30d{sortIcon("ventas")}</th>
                  <th>Tasa diaria</th>
                  <th className="sortable" onClick={() => toggleSort("semanas")}>Sems. a crítico{sortIcon("semanas")}</th>
                  <th>Agotamiento total ⓘ</th>
                  <th className="sortable" onClick={() => toggleSort("alerta")}>Estado{sortIcon("alerta")}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="rep-empty">
                      {filtBusqueda
                        ? `Sin resultados para "${filtBusqueda}"`
                        : "Sin productos con los filtros seleccionados"}
                    </td>
                  </tr>
                ) : sorted.map((d, i) => {
                  const rowBg = d.alerta==="agotado" ? "#fff1f2" : d.alerta==="critico" ? "#fff8f8" : d.alerta==="bajo" ? "#fffbf0" : "transparent";
                  const nombreProducto = d.producto?.trim() || `Producto ${d.product_id}`;
                  const semC = d.semanas_a_critico;
                  const diasC = semC !== null ? Math.round(semC * 7) : null;
                  const criticoTexto = semanasATexto(semC);
                  const critClass = !diasC ? "ok" : diasC <= 7 ? "danger" : diasC <= 30 ? "warning" : "ok";

                  const highlight = (text) => {
                    if (!filtBusqueda.trim()) return text;
                    const q = filtBusqueda.trim();
                    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, "gi");
                    const parts = String(text).split(regex);
                    return parts.map((part, j) =>
                      regex.test(part)
                        ? <mark key={j} style={{ background:"#fef08a", borderRadius:2, padding:"0 1px" }}>{part}</mark>
                        : part
                    );
                  };

                  return (
                    <tr key={`${d.product_id}_${d.branch_id}`} style={{ background:rowBg }}>
                      <td style={{ color:"#94a3b8", fontSize:".72rem", fontWeight:700 }}>{i+1}</td>
                      <td>
                        <div style={{ fontWeight:700, color:"#0f172a", fontSize:".82rem" }}>{highlight(nombreProducto)}</div>
                        {d.marca && <div style={{ fontSize:".7rem", color:"#94a3b8" }}>{highlight(d.marca)}</div>}
                      </td>
                      <td>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#f0f5ff", color:"#1e3a5f", padding:"2px 8px", borderRadius:5, fontSize:".75rem", fontWeight:700 }}>
                          <MdStore size={11}/> {highlight(d.sucursal)}
                        </span>
                      </td>
                      <td><span style={{ background:"#f1f5f9", padding:"2px 7px", borderRadius:4, fontSize:".7rem" }}>{highlight(d.categoria || "—")}</span></td>
                      <td><StockBar stock={d.stock_actual} minStock={d.min_stock} alerta={d.alerta}/></td>
                      <td className="mono" style={{ color:"#64748b" }}>{d.min_stock || "—"}</td>
                      <td className="mono">{fmt(d.ventas_30d)}</td>
                      <td className="mono">{d.tasa_diaria} uds/día</td>
                      <td>
                        {d.stock_actual <= (d.min_stock || 0) ? (
                          <span style={{ color:"#dc2626", fontWeight:700, fontSize:".78rem" }}>⚠ Ya alcanzado</span>
                        ) : criticoTexto ? (
                          <div>
                            <span className={`dias-val ${critClass}`}>{criticoTexto.corto}</span>
                            {diasC && <div style={{ fontSize:".67rem", color:"#94a3b8", marginTop:1 }}>~{diasC} días</div>}
                          </div>
                        ) : (
                          <span style={{ color:"#94a3b8" }}>Sin movimiento</span>
                        )}
                      </td>
                      <td><AgotamientoCell d={d}/></td>
                      <td><AlertaBadge alerta={d.alerta}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ── PRINCIPAL ─────────────────────────────────────────────────────────────────
export default function Reportes() {
  const [tab,      setTab]      = useState("ventas");
  const [branches, setBranches] = useState([]);
  const [alertas,  setAlertas]  = useState({ critico:0, agotado:0 });

  useEffect(() => {
    fetch(`${API_URL}/api/admin/branches`, { headers:auth() })
      .then(r => r.ok ? r.json() : []).then(setBranches).catch(() => {});
    fetch(`${API_URL}/api/admin/reports/prediccion-agotamiento`, { headers:auth() })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        if (!Array.isArray(raw)) return;
        setAlertas({
          critico: raw.filter(d => d.alerta === "critico").length,
          agotado: raw.filter(d => d.alerta === "agotado").length,
        });
      }).catch(() => {});
  }, []);

  const totalAlerta = alertas.critico + alertas.agotado;

  return (
    <div className="rep">
      <style>{S}</style>
      <div className="page-header">
        <h2>Reportes</h2>
        <p>Análisis de ventas, inventario y predicción de agotamiento por sucursal</p>
      </div>

      <div className="rep-tabs-nav">
        <button className={`rep-tab-btn${tab==="ventas"?" active":""}`} onClick={() => setTab("ventas")}>
          <MdBarChart/> Ventas y reportes
        </button>
        <button className={`rep-tab-btn${tab==="inventario"?" active":""}`} onClick={() => setTab("inventario")}>
          <MdWarning/>
          Predicción de agotamiento
          {totalAlerta > 0 && <span className="rep-tab-badge">{totalAlerta}</span>}
        </button>
      </div>

      {tab === "ventas"     && <TabReportes    branches={branches}/>}
      {tab === "inventario" && <TabAgotamiento branches={branches}/>}
    </div>
  );
}