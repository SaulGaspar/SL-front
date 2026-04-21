import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MdRefresh, MdStore, MdInventory, MdPeople, MdAttachMoney,
  MdCategory, MdBarChart, MdWarning, MdFilterList, MdTableRows,
  MdTrendingDown, MdErrorOutline,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth    = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt     = n  => Number(n || 0).toLocaleString("es-MX");
const fmtMXN  = n  => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(n || 0);
const fmtPct  = (cur, prev) => {
  if (!prev || prev === 0) return null;
  const pct = ((cur - prev) / prev) * 100;
  return { val: Math.abs(pct).toFixed(1), up: pct >= 0 };
};

// ── CONSTANTES DE PREDICCIÓN ─────────────────────────────────────────────────

const ALERTA_ORDER  = { agotado:0, critico:1, bajo:2, moderado:3, sin_movimiento:4, ok:5 };
const ALERTA_LABEL  = { critico:"Crítico", bajo:"Bajo", moderado:"Moderado", ok:"OK", agotado:"Agotado", sin_movimiento:"Sin movimiento" };
const ALERTA_COLORS = { critico:"#dc2626", bajo:"#d97706", moderado:"#2563eb", ok:"#16a34a", agotado:"#991b1b", sin_movimiento:"#94a3b8" };
const ALERTA_BG     = { critico:"#fee2e2", bajo:"#fef3c7", moderado:"#dbeafe", ok:"#dcfce7", agotado:"#fecaca", sin_movimiento:"#f1f5f9" };

const PALETTE = ["#2563eb","#16a34a","#d97706","#9333ea","#0891b2","#dc2626","#65a30d","#c026d3","#0284c7","#b45309"];

// ── ESTILOS ──────────────────────────────────────────────────────────────────

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

.rep * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

/* PAGE HEADER */
.page-header { margin-bottom:24px; }
.page-header h2 { font-size:1.5rem; font-weight:700; color:#0f172a; margin:0 0 4px; }
.page-header p  { font-size:.875rem; color:#64748b; margin:0; }

/* TABS */
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

/* FILTROS */
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
.rep-apply:hover    { background:#2c5282; }
.rep-apply:disabled { opacity:.5; cursor:not-allowed; }

/* KPIs */
.rep-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.rep-kpi  { background:white; border-radius:12px; padding:18px 20px; box-shadow:0 1px 4px rgba(0,0,0,.06); border-left:4px solid transparent; }
.rep-kpi.red    { border-left-color:#dc2626; }
.rep-kpi.orange { border-left-color:#d97706; }
.rep-kpi.blue   { border-left-color:#2563eb; }
.rep-kpi.green  { border-left-color:#16a34a; }
.rep-kpi-lbl { font-size:.68rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
.rep-kpi-val { font-family:'JetBrains Mono',monospace; font-size:1.55rem; font-weight:700; color:#0f172a; line-height:1.1; }
.rep-kpi-sub { font-size:.7rem; color:#94a3b8; margin-top:3px; }

/* PANELES */
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

/* BAR CHART */
.hbar { display:flex; flex-direction:column; gap:9px; }
.hbar-row  { display:flex; align-items:center; gap:9px; }
.hbar-lbl  { font-size:.76rem; color:#475569; width:140px; text-align:right; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hbar-track { flex:1; height:22px; background:#f1f5f9; border-radius:4px; overflow:hidden; }
.hbar-fill  { height:100%; border-radius:4px; display:flex; align-items:center; padding-left:8px; font-size:.7rem; font-weight:700; color:white; transition:width .5s ease; }
.hbar-val   { font-size:.76rem; font-weight:700; color:#0f172a; width:85px; flex-shrink:0; font-family:'JetBrains Mono',monospace; text-align:right; }

/* TABLA PREDICCIÓN */
.pred-table-wrap { overflow-x:auto; }
.pred-table {
  width:100%; border-collapse:collapse; font-size:.8rem;
}
.pred-table th {
  padding:10px 12px; text-align:left; font-size:.67rem; font-weight:700;
  color:#64748b; text-transform:uppercase; letter-spacing:.4px;
  border-bottom:2px solid #e2e8f0; white-space:nowrap; background:#fafbfc;
  position:sticky; top:0; z-index:1;
}
.pred-table th.sortable { cursor:pointer; user-select:none; }
.pred-table th.sortable:hover { color:#1e3a5f; background:#f0f5ff; }
.pred-table td {
  padding:10px 12px; border-bottom:1px solid #f8fafc; color:#334155; vertical-align:middle;
}
.pred-table tbody tr:hover { background:#f8fafc; }
.pred-table tbody tr:last-child td { border-bottom:none; }

/* ALERTA BADGE */
.alerta-badge {
  display:inline-flex; align-items:center; gap:4px; padding:2px 8px;
  border-radius:5px; font-size:.68rem; font-weight:700; white-space:nowrap;
}

/* BARRA PROGRESO */
.stock-bar { margin-top:4px; height:3px; background:#e2e8f0; border-radius:2px; overflow:hidden; }
.stock-bar-fill { height:100%; border-radius:2px; transition:width .3s; }

/* DÍAS BADGE */
.dias-val { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:.82rem; }
.dias-val.danger  { color:#dc2626; }
.dias-val.warning { color:#d97706; }
.dias-val.ok      { color:#16a34a; }

/* FILTROS PREDICCIÓN */
.pred-filters {
  display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;
  padding:12px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0;
}
.pred-filter-group { display:flex; flex-direction:column; gap:3px; }
.pred-filter-group label { font-size:.67rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.4px; }
.pred-filter-group select {
  padding:6px 10px; border:1.5px solid #e2e8f0; border-radius:7px;
  font-size:.8rem; font-family:inherit; color:#1e293b; background:white; min-width:130px;
}
.pred-filter-group select:focus { outline:none; border-color:#2563eb; }

/* SUCURSAL TABS */
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

/* MISC */
.spinning { animation:spin .8s linear infinite; }
@keyframes spin { from{transform:rotate(0)}to{transform:rotate(360deg)} }
.rep-empty { text-align:center; color:#94a3b8; padding:40px; font-size:.84rem; }
.mono { font-family:'JetBrains Mono',monospace; font-size:.78rem; }

@media(max-width:1024px){
  .rep-kpis { grid-template-columns:1fr 1fr; }
  .rep-grid2 { grid-template-columns:1fr; }
}
@media(max-width:640px){
  .rep-kpis { grid-template-columns:1fr; }
}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────

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
                {pct>15 ? (isMXN ? fmtMXN(val) : fmt(val)) : ""}
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

function formatSemanas(sem) {
  if (sem === null || sem === undefined) return "—";
  if (sem < 0.5)  return "< 3 días";
  if (sem < 1)    return "< 1 sem";
  if (sem < 2)    return `~${(sem*7).toFixed(0)} días`;
  if (sem < 8)    return `~${sem.toFixed(1)} sem`;
  if (sem < 30)   return `~${(sem/4.33).toFixed(1)} mes`;
  return `~${(sem/4.33/12).toFixed(1)} años`;
}

function StockBar({ stock, minStock, alerta }) {
  const pct = minStock > 0 ? Math.min(100, Math.round((stock/Math.max(stock*2, minStock*2))*100)) : 50;
  return (
    <div>
      <span className="mono" style={{ color:ALERTA_COLORS[alerta], fontWeight:700 }}>{stock}</span>
      <div className="stock-bar">
        <div className="stock-bar-fill" style={{ width:`${pct}%`, background:ALERTA_COLORS[alerta] }} />
      </div>
    </div>
  );
}

// ── TAB: PREDICCIÓN DE AGOTAMIENTO ────────────────────────────────────────────

function TabAgotamiento({ branches }) {
  const [data,      setData]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [sucursal,  setSucursal]  = useState("all");
  const [filtAlerta, setFiltAlerta] = useState("");
  const [filtCat,   setFiltCat]   = useState("");
  const [sortCol,   setSortCol]   = useState("alerta");
  const [sortDir,   setSortDir]   = useState("asc");

  // ── Carga desde el endpoint corregido (/prediccion-agotamiento) ────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sucursal !== "all") params.set("branch", sucursal);
      if (filtAlerta)         params.set("alerta", filtAlerta);
      if (filtCat)            params.set("categoria", filtCat);

      const res = await fetch(
        `${API_URL}/api/admin/reports/prediccion-agotamiento?${params}`,
        { headers: auth() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("Respuesta inválida");

      // Los datos ya vienen por producto+sucursal desde el backend.
      // NO se agrega ni se suma nada aquí.
      setData(raw);
    } catch (e) {
      console.error("Error cargando predicción:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [sucursal, filtAlerta, filtCat]);

  useEffect(() => { load(); }, [load]);

  // ── Contadores para KPIs (todos los datos sin filtro de sucursal/alerta) ──
  const [totales, setTotales] = useState({ critico:0, agotado:0, bajo:0, sin_movimiento:0, total:0 });
  useEffect(() => {
    fetch(`${API_URL}/api/admin/reports/prediccion-agotamiento`, { headers: auth() })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        if (!Array.isArray(raw)) return;
        setTotales({
          critico:        raw.filter(d => d.alerta === "critico").length,
          agotado:        raw.filter(d => d.alerta === "agotado").length,
          bajo:           raw.filter(d => d.alerta === "bajo").length,
          sin_movimiento: raw.filter(d => d.alerta === "sin_movimiento").length,
          total:          raw.length,
        });
      })
      .catch(() => {});
  }, []);

  // ── Categorías disponibles ─────────────────────────────────────────────────
  const categorias = useMemo(
    () => [...new Set(data.map(d => d.categoria).filter(Boolean))].sort(),
    [data]
  );

  // ── Alertas por sucursal (para badges en los tabs) ─────────────────────────
  const alertasPorSuc = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.branch_id]) map[d.branch_id] = 0;
      if (d.alerta === "critico" || d.alerta === "agotado") map[d.branch_id]++;
    });
    return map;
  }, [data]);

  // ── Ordenamiento ──────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      let va, vb;
      switch(sortCol) {
        case "alerta":      va = ALERTA_ORDER[a.alerta]??9;    vb = ALERTA_ORDER[b.alerta]??9;    break;
        case "stock":       va = a.stock_actual;               vb = b.stock_actual;               break;
        case "semanas":     va = a.semanas_a_critico??9999;    vb = b.semanas_a_critico??9999;    break;
        case "ventas":      va = a.ventas_30d;                 vb = b.ventas_30d;                 break;
        case "producto":    va = a.producto||"";               vb = b.producto||"";               break;
        case "sucursal":    va = a.sucursal||"";               vb = b.sucursal||"";               break;
        default:            va = 0; vb = 0;
      }
      if (typeof va === "string") return sortDir==="asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return arr;
  }, [data, sortCol, sortDir]);

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortCol(col); setSortDir("asc"); }
  };
  const sortIcon = col => sortCol===col ? (sortDir==="asc"?" ↑":" ↓") : "";

  return (
    <>
      {/* ── KPIs ── */}
      <div className="rep-kpis">
        {[
          { label:"Críticos",       sub:"Stock en o bajo mínimo",   val:totales.critico,        color:"red"    },
          { label:"Agotados",       sub:"Stock = 0 unidades",        val:totales.agotado,        color:"red"    },
          { label:"Bajo stock",     sub:"Crítico en ≤ 4 semanas",    val:totales.bajo,           color:"orange" },
          { label:"Sin movimiento", sub:"0 ventas en 30 días",       val:totales.sin_movimiento, color:"blue"   },
        ].map((k, i) => (
          <div key={i} className={`rep-kpi ${k.color}`}>
            <div className="rep-kpi-lbl">{k.label}</div>
            <div className="rep-kpi-val">{k.val}</div>
            <div className="rep-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Panel principal ── */}
      <div className="rep-panel">
        <div className="rep-panel-head">
          <div className="rep-panel-title">
            <MdTrendingDown />
            Predicción de agotamiento por producto · sucursal
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span className="rep-badge">{sorted.length} registros</span>
            <button className="rep-apply" onClick={load} disabled={loading} style={{ padding:"6px 14px", fontSize:".78rem" }}>
              <MdRefresh size={14} className={loading?"spinning":""} />
              {loading ? "Cargando…" : "Actualizar"}
            </button>
          </div>
        </div>

        {/* TABS POR SUCURSAL */}
        <div className="suc-tabs">
          <button
            className={`suc-tab${sucursal==="all"?" active":""}`}
            onClick={() => setSucursal("all")}
          >
            Todas las sucursales
            {(totales.critico+totales.agotado) > 0 && (
              <span className="suc-badge">{totales.critico+totales.agotado}</span>
            )}
          </button>
          {branches.map(b => {
            const cnt = alertasPorSuc[b.id] || 0;
            return (
              <button
                key={b.id}
                className={`suc-tab${sucursal===String(b.id)?" active":""}`}
                onClick={() => setSucursal(String(b.id))}
              >
                {b.nombre || b.id}
                {cnt > 0 && <span className="suc-badge">{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* FILTROS ADICIONALES */}
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

        {/* TABLA */}
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:52, color:"#94a3b8" }}>
            <MdRefresh size={22} className="spinning" />
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
                  <th>k (sem⁻¹)</th>
                  <th className="sortable" onClick={() => toggleSort("semanas")}>Sems. a crítico{sortIcon("semanas")}</th>
                  <th>Agotamiento total</th>
                  <th>Modelo</th>
                  <th className="sortable" onClick={() => toggleSort("alerta")}>Estado{sortIcon("alerta")}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="rep-empty">
                      {loading ? "Cargando…" : "Sin productos con los filtros seleccionados"}
                    </td>
                  </tr>
                ) : (
                  sorted.map((d, i) => {
                    const rowBg = d.alerta==="agotado"   ? "#fff1f2"
                                : d.alerta==="critico"   ? "#fff8f8"
                                : d.alerta==="bajo"      ? "#fffbf0"
                                : "transparent";
                    const nombreProducto = d.producto?.trim() || `Producto ${d.product_id}`;
                    const semC = d.semanas_a_critico;
                    const diasC = semC !== null ? semC * 7 : null;
                    const diasClass = diasC===null ? "ok" : diasC<=7 ? "danger" : diasC<=30 ? "warning" : "ok";
                    return (
                      <tr key={`${d.product_id}_${d.branch_id}`} style={{ background:rowBg }}>
                        <td style={{ color:"#94a3b8", fontSize:".72rem", fontWeight:700 }}>{i+1}</td>

                        {/* Producto */}
                        <td>
                          <div style={{ fontWeight:700, color:"#0f172a", fontSize:".82rem" }}>{nombreProducto}</div>
                          {d.marca && <div style={{ fontSize:".7rem", color:"#94a3b8" }}>{d.marca}</div>}
                        </td>

                        {/* Sucursal */}
                        <td>
                          <span style={{
                            display:"inline-flex", alignItems:"center", gap:4,
                            background:"#f0f5ff", color:"#1e3a5f",
                            padding:"2px 8px", borderRadius:5, fontSize:".75rem", fontWeight:700
                          }}>
                            <MdStore size={11}/> {d.sucursal}
                          </span>
                        </td>

                        {/* Categoría */}
                        <td>
                          <span style={{ background:"#f1f5f9", padding:"2px 7px", borderRadius:4, fontSize:".7rem" }}>
                            {d.categoria||"—"}
                          </span>
                        </td>

                        {/* Stock actual */}
                        <td>
                          <StockBar stock={d.stock_actual} minStock={d.min_stock} alerta={d.alerta} />
                        </td>

                        {/* Mín req */}
                        <td style={{ color:"#64748b" }} className="mono">{d.min_stock||"—"}</td>

                        {/* Ventas/30d */}
                        <td className="mono">{fmt(d.ventas_30d)}</td>

                        {/* Tasa diaria */}
                        <td className="mono">{d.tasa_diaria} uds/día</td>

                        {/* k */}
                        <td>
                          <span className="mono" style={{ color:"#2563eb" }}>{d.k || "—"}</span>
                        </td>

                        {/* Semanas a crítico */}
                        <td>
                          {d.stock_actual <= d.min_stock ? (
                            <span style={{ color:"#dc2626", fontWeight:700, fontSize:".78rem" }}>⚠ Ya alcanzado</span>
                          ) : d.semanas_a_critico !== null ? (
                            <div>
                              <span className={`dias-val ${diasClass}`}>{formatSemanas(d.semanas_a_critico)}</span>
                              <div style={{ fontSize:".68rem", color:"#94a3b8", marginTop:1 }}>
                                ~{Math.round(d.semanas_a_critico*7)} días
                              </div>
                            </div>
                          ) : (
                            <span style={{ color:"#94a3b8" }}>Sin movimiento</span>
                          )}
                        </td>

                        {/* Agotamiento total */}
                        <td>
                          {d.semanas_agotamiento ? (
                            <div>
                              <span className="mono" style={{ fontSize:".78rem" }}>{formatSemanas(d.semanas_agotamiento)}</span>
                              <div style={{ fontSize:".68rem", color:"#94a3b8" }}>
                                ~{Math.round(d.semanas_agotamiento*7)} días
                              </div>
                            </div>
                          ) : "—"}
                        </td>

                        {/* Modelo */}
                        <td>
                          <span className="mono" style={{ fontSize:".7rem", color:"#334155" }}>
                            {d.stock_actual > 0 && d.k
                              ? `S(t)=${d.stock_actual}·e^(-${d.k}t)`
                              : "—"
                            }
                          </span>
                        </td>

                        {/* Estado */}
                        <td><AlertaBadge alerta={d.alerta} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ── TAB: VENTAS Y REPORTES ────────────────────────────────────────────────────

function TabReportes({ branches }) {
  const today = new Date().toISOString().slice(0,10);
  const ago30 = new Date(Date.now() - 30*86400000).toISOString().slice(0,10);

  const [from,     setFrom]    = useState(ago30);
  const [to,       setTo]      = useState(today);
  const [branch,   setBranch]  = useState("all");
  const [loading,  setLoading] = useState(false);
  const [summary,  setSummary] = useState(null);
  const [topProds, setTopProds]= useState([]);
  const [topCats,  setTopCats] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ from, to });
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
  }, [from, to, branch]);

  useEffect(() => { load(); }, []);

  const kpis = summary ? [
    { label:"Ingresos",       val:fmtMXN(summary.current?.ingresos),        color:"blue",   sub:"período seleccionado" },
    { label:"Pedidos",        val:fmt(summary.current?.total_pedidos),       color:"green",  sub:`entregados: ${fmt(summary.current?.entregados)}` },
    { label:"Ticket prom.",   val:fmtMXN(summary.current?.ticket_promedio),  color:"orange", sub:"promedio por pedido" },
    { label:"Clientes únicos",val:fmt(summary.current?.clientes_unicos),     color:"blue",   sub:"en el período" },
  ] : [];

  return (
    <>
      {/* Filtros */}
      <div className="rep-filters">
        <div className="rep-fg"><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
        <div className="rep-fg"><label>Hasta</label><input type="date" value={to}   onChange={e=>setTo(e.target.value)}/></div>
        <div className="rep-fg">
          <label>Sucursal</label>
          <select value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="all">Todas</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
        </div>
        <button className="rep-apply" onClick={load} disabled={loading}>
          <MdRefresh size={15} className={loading?"spinning":""}/>
          {loading ? "Cargando…" : "Aplicar"}
        </button>
      </div>

      {/* KPIs */}
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

      {/* Gráficas */}
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

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function Reportes() {
  const [tab,      setTab]      = useState("ventas");
  const [branches, setBranches] = useState([]);
  const [alertas,  setAlertas]  = useState({ critico:0, agotado:0 });

  useEffect(() => {
    // Cargar sucursales
    fetch(`${API_URL}/api/admin/branches`, { headers:auth() })
      .then(r => r.ok ? r.json() : [])
      .then(setBranches)
      .catch(() => {});

    // Cargar contadores de alertas para el badge del tab
    fetch(`${API_URL}/api/admin/reports/prediccion-agotamiento`, { headers:auth() })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        if (!Array.isArray(raw)) return;
        // Cada fila ya es producto·sucursal — no hay que agrupar
        setAlertas({
          critico: raw.filter(d => d.alerta === "critico").length,
          agotado: raw.filter(d => d.alerta === "agotado").length,
        });
      })
      .catch(() => {});
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
        <button
          className={`rep-tab-btn${tab==="ventas"?" active":""}`}
          onClick={() => setTab("ventas")}
        >
          <MdBarChart/> Ventas y reportes
        </button>
        <button
          className={`rep-tab-btn${tab==="inventario"?" active":""}`}
          onClick={() => setTab("inventario")}
        >
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