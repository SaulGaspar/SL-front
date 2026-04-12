import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MdRefresh, MdTrendingUp, MdTrendingDown, MdStore,
  MdInventory, MdPeople, MdShoppingCart, MdAttachMoney,
  MdCategory, MdBarChart, MdWarning, MdShowChart,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const auth    = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt     = n => Number(n || 0).toLocaleString("es-MX");
const fmtMXN  = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);
const fmtPct  = (cur, prev) => {
  if (!prev || prev === 0) return null;
  const pct = ((cur - prev) / prev) * 100;
  return { val: Math.abs(pct).toFixed(1), up: pct >= 0 };
};

const PALETTE = [
  "#2563eb","#16a34a","#d97706","#9333ea","#0891b2",
  "#dc2626","#65a30d","#c026d3","#0284c7","#b45309",
];

const ALERTA_ORDER  = { agotado:0, critico:1, bajo:2, moderado:3, sin_movimiento:4, ok:5 };
const ALERTA_LABEL  = { critico:"Crítico", bajo:"Bajo", moderado:"Moderado", ok:"OK", agotado:"Agotado", sin_movimiento:"Sin movimiento" };
const ALERTA_COLORS = { critico:"#dc2626", bajo:"#d97706", moderado:"#2563eb", ok:"#16a34a", agotado:"#991b1b", sin_movimiento:"#94a3b8" };

// Función de predicción lineal: S(t) = S₀ - (r * t)
// donde S₀ = stock inicial, r = tasa de decrecimiento, t = tiempo (días)
function predictDaysToStock(stockActual, ventasDiarias, stockMinimo = 0) {
  if (ventasDiarias <= 0) return null; // Sin movimiento
  if (stockActual <= stockMinimo) return 0; // Ya está bajo mínimo
  return (stockActual - stockMinimo) / ventasDiarias; // Días hasta llegar al mínimo
}

function formatDias(dias) {
  if (dias === null || dias === undefined) return "—";
  if (dias < 0.5)  return "< 12 h";
  if (dias < 1)    return "< 1 día";
  if (dias < 2)    return "~1 día";
  if (dias < 7)    return `~${Math.round(dias)} d`;
  if (dias < 30)   return `~${Math.round(dias / 7)} sem`;
  return `~${Math.round(dias / 30)} mes`;
}

// ─────────────────────────────────────────────────────────────
// CSS OPTIMIZADO
// ─────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.rep * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

/* TABS */
.rep-tabs-nav { display:flex; gap:0; background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); margin-bottom:22px; overflow:hidden; border:1px solid #e2e8f0; }
.rep-tab-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:9px; padding:15px 20px; border:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:600; color:#64748b; cursor:pointer; border-bottom:3px solid transparent; transition:all .18s; }
.rep-tab-btn:not(:last-child) { border-right:1px solid #f1f5f9; }
.rep-tab-btn:hover { background:#f8fafc; color:#1e3a5f; }
.rep-tab-btn.active { color:#1e3a5f; background:#f0f5ff; border-bottom-color:#2563eb; }
.rep-tab-btn svg { font-size:1.1rem; }
.rep-tab-badge { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; padding:0 6px; border-radius:10px; font-size:.68rem; font-weight:700; background:#fee2e2; color:#991b1b; }

/* FILTROS */
.rep-filters { background:white; border-radius:12px; padding:18px 22px; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-bottom:22px; }
.rep-fg { display:flex; flex-direction:column; gap:5px; }
.rep-fg label { font-size:.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.5px; }
.rep-fg input,.rep-fg select { padding:9px 13px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; min-width:150px; color:#1e293b; background:white; }
.rep-fg input:focus,.rep-fg select:focus { outline:none; border-color:#2563eb; }
.rep-apply { display:flex; align-items:center; gap:7px; background:#1e3a5f; color:white; border:none; padding:9px 20px; border-radius:8px; font-weight:600; cursor:pointer; font-family:inherit; font-size:.88rem; transition:background .2s; align-self:flex-end; }
.rep-apply:hover { background:#2c5282; }
.rep-apply:disabled { opacity:.5; cursor:not-allowed; }

/* KPIs */
.rep-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
.rep-kpi { background:white; border-radius:12px; padding:20px 22px; box-shadow:0 2px 8px rgba(0,0,0,.05); border-left:4px solid transparent; }
.rep-kpi.red{border-left-color:#dc2626;} .rep-kpi.orange{border-left-color:#d97706;} .rep-kpi.blue{border-left-color:#2563eb;} .rep-kpi.green{border-left-color:#16a34a;}
.rep-kpi-lbl { font-size:.72rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
.rep-kpi-val { font-family:'JetBrains Mono',monospace; font-size:1.65rem; font-weight:700; color:#0f172a; line-height:1.1; }
.rep-kpi-sub { font-size:.72rem; color:#94a3b8; margin-top:3px; }

/* PANELES */
.rep-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px; }
.rep-panel { background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); overflow:hidden; margin-bottom:18px; }
.rep-panel-head { padding:14px 20px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; gap:8px; }
.rep-panel-title { font-size:.88rem; font-weight:700; color:#0f172a; display:flex; align-items:center; gap:8px; }
.rep-panel-title svg { color:#2563eb; }
.rep-panel-body { padding:20px; }
.rep-badge { font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:20px; background:#eff6ff; color:#2563eb; font-family:'JetBrains Mono',monospace; }

/* GRÁFICAS */
.hbar { display:flex; flex-direction:column; gap:10px; }
.hbar-row { display:flex; align-items:center; gap:10px; }
.hbar-lbl { font-size:.78rem; color:#475569; width:150px; text-align:right; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hbar-track { flex:1; height:24px; background:#f1f5f9; border-radius:5px; overflow:hidden; }
.hbar-fill { height:100%; border-radius:5px; display:flex; align-items:center; padding-left:9px; font-size:.73rem; font-weight:700; color:white; transition:width .5s ease; }
.hbar-val { font-size:.78rem; font-weight:700; color:#0f172a; width:90px; flex-shrink:0; font-family:'JetBrains Mono',monospace; text-align:right; }

/* TABLA MEJORADA */
.rep-table { width:100%; border-collapse:collapse; font-size:.82rem; }
.rep-table th { padding:12px 14px; text-align:left; font-size:.7rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #f1f5f9; white-space:nowrap; background:#fafbfc; }
.rep-table td { padding:12px 14px; border-bottom:1px solid #f8fafc; color:#334155; vertical-align:middle; }
.rep-table tbody tr:hover { background:#f8fafc; }
.rep-table tbody tr:last-child td { border-bottom:none; }

/* TARJETAS INVENTARIO */
.inv-cards { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px; }
.inv-card { background:white; border-radius:10px; border:1.5px solid #e2e8f0; padding:16px; transition:all .15s; }
.inv-card:hover { box-shadow:0 4px 12px rgba(0,0,0,.08); border-color:#2563eb; }
.inv-card.critico { border-left:4px solid #dc2626; background:rgba(220,38,38,.02); }
.inv-card.bajo { border-left:4px solid #d97706; background:rgba(217,119,6,.02); }
.inv-card.moderado { border-left:4px solid #2563eb; background:rgba(37,99,235,.02); }
.inv-card.ok { border-left:4px solid #16a34a; background:rgba(22,163,74,.02); }
.inv-card.agotado { border-left:4px solid #991b1b; background:rgba(153,27,27,.02); }
.inv-card.sin_movimiento { border-left:4px solid #94a3b8; background:rgba(148,163,184,.02); }

.inv-card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; gap:10px; }
.inv-card-title { font-size:.88rem; font-weight:700; color:#0f172a; }
.inv-card-badge { display:inline-flex; align-items:center; gap:5px; font-size:.65rem; font-weight:700; padding:3px 8px; border-radius:6px; white-space:nowrap; }
.inv-card-badge.critico { background:#fee2e2; color:#991b1b; }
.inv-card-badge.bajo { background:#fef3c7; color:#92400e; }
.inv-card-badge.moderado { background:#dbeafe; color:#1e40af; }
.inv-card-badge.ok { background:#dcfce7; color:#166534; }
.inv-card-badge.agotado { background:#fecaca; color:#7f1d1d; }
.inv-card-badge.sin_movimiento { background:#f1f5f9; color:#64748b; }

.inv-card-meta { font-size:.75rem; color:#94a3b8; margin-bottom:12px; }
.inv-card-section { margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #e2e8f0; }
.inv-card-section:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }

.inv-card-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.inv-card-label { font-size:.73rem; color:#64748b; font-weight:600; }
.inv-card-value { font-family:'JetBrains Mono',monospace; font-size:.82rem; font-weight:700; color:#0f172a; }
.inv-card-value.success { color:#16a34a; }
.inv-card-value.warning { color:#d97706; }
.inv-card-value.danger { color:#dc2626; }

.inv-progress { height:4px; background:#e2e8f0; border-radius:2px; overflow:hidden; margin-bottom:6px; }
.inv-progress-fill { height:100%; border-radius:2px; transition:width .3s ease; }

.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0)}to{transform:rotate(360deg)} }

.rep-empty { text-align:center; color:#94a3b8; padding:40px; font-size:.86rem; }

@media(max-width:1024px){
  .rep-kpis{grid-template-columns:1fr 1fr;}
  .rep-grid2{grid-template-columns:1fr;}
  .inv-cards{grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));}
}
@media(max-width:640px){
  .rep-kpis{grid-template-columns:1fr;}
  .inv-cards{grid-template-columns:1fr;}
}
`;

// ─────────────────────────────────────────────────────────────
// COMPONENTE GRÁFICA BARRAS
// ─────────────────────────────────────────────────────────────
function HBarChart({ data, labelKey, valueKey, isMXN = true, maxItems = 8 }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="rep-empty">Sin datos</div>;
  }
  
  const max = Math.max(...data.map(d => Number(d[valueKey] || 0)), 1);
  return (
    <div className="hbar">
      {data.slice(0, maxItems).map((d, i) => {
        const val = Number(d[valueKey] || 0);
        const pct = (val / max) * 100;
        const label = (d[labelKey] || "—");
        return (
          <div key={i} className="hbar-row">
            <div className="hbar-lbl" title={label}>{label}</div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }}>
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

// ─────────────────────────────────────────────────────────────
// TARJETA DE PRODUCTO - ESTRUCTURA MEJORADA
// ─────────────────────────────────────────────────────────────
function ProductoCard({ data, colorClass, index }) {
  const ventasDiarias = data.ventas_periodo / 30;
  const diasRestantes = predictDaysToStock(data.stock_actual, ventasDiarias, 0);
  
  // Porcentaje para barra de progreso (máximo 100)
  const progressPct = data.alerta === "agotado" ? 0
    : data.alerta === "sin_movimiento" ? 20
    : Math.min(100, Math.round((diasRestantes / 30) * 100));

  // Nombre del producto - usar data.producto o generar uno por defecto
  const nombreProducto = data.producto && data.producto.trim() ? data.producto : `Producto ${index + 1}`;

  return (
    <div className={`inv-card ${colorClass}`}>
      {/* ENCABEZADO */}
      <div className="inv-card-header">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="inv-card-title" title={nombreProducto}>
            {nombreProducto}
          </div>
          <div className="inv-card-meta">
            {data.categoria || "—"}
            {data.sucursal && ` · ${data.sucursal}`}
          </div>
        </div>
        <span className={`inv-card-badge ${colorClass}`}>
          {ALERTA_LABEL[data.alerta] || data.alerta}
        </span>
      </div>

      {/* STOCK */}
      <div className="inv-card-section">
        <div className="inv-progress">
          <div className="inv-progress-fill" style={{ width: `${progressPct}%`, background: ALERTA_COLORS[data.alerta] }} />
        </div>
        <div className="inv-card-row">
          <span className="inv-card-label">Stock actual:</span>
          <span className="inv-card-value">{data.stock_actual} uds.</span>
        </div>
      </div>

      {/* MOVIMIENTO */}
      <div className="inv-card-section">
        <div className="inv-card-row">
          <span className="inv-card-label">Ventas / 30 días:</span>
          <span className="inv-card-value">{fmt(data.ventas_periodo)} uds.</span>
        </div>
        <div className="inv-card-row">
          <span className="inv-card-label">Tasa diaria:</span>
          <span className="inv-card-value">{ventasDiarias.toFixed(2)} uds./día</span>
        </div>
      </div>

      {/* PREDICCIÓN */}
      <div className="inv-card-section">
        <div className="inv-card-row">
          <span className="inv-card-label">Días restantes:</span>
          <span className={`inv-card-value ${
            diasRestantes === null ? '' : diasRestantes <= 7 ? 'danger' : diasRestantes <= 15 ? 'warning' : 'success'
          }`}>
            {diasRestantes === null ? 'Sin movimiento' : formatDias(diasRestantes)}
          </span>
        </div>
        {diasRestantes !== null && diasRestantes > 0 && (
          <div className="inv-card-row">
            <span className="inv-card-label">Fecha estimada:</span>
            <span className="inv-card-value" style={{ fontSize: '.75rem' }}>
              {new Date(Date.now() + diasRestantes * 86400000).toLocaleDateString('es-MX')}
            </span>
          </div>
        )}
      </div>

      {data.sucursal && (
        <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: '10px' }}>
          📍 {data.sucursal}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: AGOTAMIENTO DE INVENTARIO
// ─────────────────────────────────────────────────────────────
function TabAgotamiento({ branches }) {
  const [data,       setData]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [view,       setView]       = useState("cards"); // cards | table
  const [filtAlerta, setFiltAlerta] = useState("");
  const [filtCat,    setFiltCat]    = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/prediccion-publica`);
      if (!res.ok) throw new Error();
      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("Respuesta inválida");
      
      const map = {};
      raw.forEach(row => {
        const pid = row.product_id;
        if (!map[pid]) { 
          map[pid] = { ...row }; 
        } else {
          map[pid].stock_actual   += row.stock_actual;
          map[pid].ventas_periodo += row.ventas_periodo;
          const prio = { critico:0, bajo:1, moderado:2, sin_movimiento:3, ok:4, agotado:5 };
          if ((prio[row.alerta] ?? 99) < (prio[map[pid].alerta] ?? 99)) {
            map[pid].alerta         = row.alerta;
          }
        }
      });
      
      setData(Object.values(map).sort((a, b) => (ALERTA_ORDER[a.alerta] ?? 9) - (ALERTA_ORDER[b.alerta] ?? 9)));
    } catch { 
      setData([]); 
    }
    finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cnt = a => data.filter(d => d.alerta === a).length;

  const categorias = useMemo(
    () => [...new Set(data.map(d => d.categoria).filter(Boolean))].sort(),
    [data]
  );

  const filtered = useMemo(() =>
    data.filter(d => (!filtAlerta || d.alerta === filtAlerta) && (!filtCat || d.categoria === filtCat)),
    [data, filtAlerta, filtCat]
  );

  const alertaDistribution = useMemo(() => {
    const labels = Object.keys(ALERTA_LABEL);
    return labels.map(k => ({ 
      label: ALERTA_LABEL[k], 
      value: cnt(k), 
      color: ALERTA_COLORS[k] 
    })).filter(d => d.value > 0);
  }, [data]);

  return (
    <>
      {/* KPIs */}
      <div className="rep-kpis" style={{ marginBottom: 22 }}>
        {[
          { label: "Críticos", sub: "Agotan < 7 días", val: cnt("critico"), color: "red" },
          { label: "Bajo stock", sub: "7 a 15 días", val: cnt("bajo"), color: "orange" },
          { label: "Agotados", sub: "Stock = 0", val: cnt("agotado"), color: "red" },
          { label: "Sin movimiento", sub: "0 ventas/30d", val: cnt("sin_movimiento"), color: "blue" },
        ].map((k, i) => (
          <div key={i} className={`rep-kpi ${k.color}`}>
            <div className="rep-kpi-lbl">{k.label}</div>
            <div className="rep-kpi-val" style={{ color: ALERTA_COLORS[Object.keys(ALERTA_COLORS).find(ak => ALERTA_LABEL[ak] === k.label)] || "#0f172a" }}>{k.val}</div>
            <div className="rep-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="rep-grid2" style={{ marginBottom: 18 }}>
        <div className="rep-panel">
          <div className="rep-panel-head">
            <div className="rep-panel-title"><MdBarChart /> Distribución por estado</div>
            <span className="rep-badge">{data.length} productos</span>
          </div>
          <div className="rep-panel-body">
            <HBarChart data={alertaDistribution} labelKey="label" valueKey="value" isMXN={false} />
          </div>
        </div>
      </div>

      {/* Filtros y vistas */}
      <div className="rep-panel">
        <div className="rep-panel-head" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Filtrar:</span>
            <select className="rep-fg" value={filtAlerta} onChange={e => setFiltAlerta(e.target.value)} 
              style={{ margin: 0, minWidth: '140px', padding: '7px 10px', fontSize: '.8rem', border: '1.5px solid #e2e8f0', borderRadius: '7px' }}>
              <option value="">Todas las alertas</option>
              <option value="critico">🔴 Crítico</option>
              <option value="bajo">🟡 Bajo</option>
              <option value="moderado">🔵 Moderado</option>
              <option value="agotado">⚫ Agotado</option>
              <option value="sin_movimiento">⬜ Sin movimiento</option>
              <option value="ok">🟢 OK</option>
            </select>
            <select className="rep-fg" value={filtCat} onChange={e => setFiltCat(e.target.value)} 
              style={{ margin: 0, minWidth: '140px', padding: '7px 10px', fontSize: '.8rem', border: '1.5px solid #e2e8f0', borderRadius: '7px' }}>
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setView('cards')} style={{ padding: '6px 12px', borderRadius: '6px', border: view === 'cards' ? '2px solid #2563eb' : '1.5px solid #e2e8f0', background: view === 'cards' ? '#f0f5ff' : 'white', color: view === 'cards' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer' }}>
              Tarjetas
            </button>
            <button onClick={() => setView('table')} style={{ padding: '6px 12px', borderRadius: '6px', border: view === 'table' ? '2px solid #2563eb' : '1.5px solid #e2e8f0', background: view === 'table' ? '#f0f5ff' : 'white', color: view === 'table' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer' }}>
              Tabla
            </button>
            <button className="rep-apply" onClick={load} disabled={loading} style={{ marginLeft: 'auto', padding: '7px 16px', fontSize: '.8rem' }}>
              <MdRefresh size={14} className={loading ? "spinning" : ""} />
              {loading ? "Cargando…" : "Actualizar"}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 48, color: "#94a3b8" }}>
            <MdRefresh size={22} className="spinning" /> Calculando predicciones…
          </div>
        ) : (
          <div className="rep-panel-body">
            {view === "cards" && (
              <div className="inv-cards">
                {filtered.length === 0 ? (
                  <div className="rep-empty" style={{ gridColumn: '1/-1' }}>Sin productos con los filtros seleccionados</div>
                ) : (
                  filtered.slice(0, 40).map((d, i) => (
                    <ProductoCard key={i} data={d} colorClass={d.alerta} index={i} />
                  ))
                )}
              </div>
            )}

            {view === "table" && (
              <div style={{ overflowX: "auto" }}>
                <table className="rep-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Ventas/30d</th>
                      <th>Tasa Diaria</th>
                      <th>Días Restantes</th>
                      <th>Fecha Est.</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9} className="rep-empty">Sin datos</td></tr>
                    ) : (
                      filtered.map((d, i) => {
                        const ventasDiarias = d.ventas_periodo / 30;
                        const diasRestantes = predictDaysToStock(d.stock_actual, ventasDiarias, 0);
                        const nombreProducto = d.producto && d.producto.trim() ? d.producto : `Producto ${i + 1}`;
                        return (
                          <tr key={i}>
                            <td style={{ color: "#94a3b8", fontSize: ".75rem", fontWeight: 700 }}>{i + 1}</td>
                            <td><strong style={{ color: "#0f172a" }}>{nombreProducto}</strong></td>
                            <td><span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: ".72rem" }}>{d.categoria || "—"}</span></td>
                            <td style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{d.stock_actual}</td>
                            <td style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(d.ventas_periodo)}</td>
                            <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".75rem" }}>{ventasDiarias.toFixed(2)}</td>
                            <td style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: diasRestantes !== null && diasRestantes <= 7 ? '#dc2626' : '#0f172a' }}>
                              {diasRestantes === null ? '∞' : formatDias(diasRestantes)}
                            </td>
                            <td style={{ fontSize: ".75rem" }}>
                              {diasRestantes !== null && diasRestantes > 0 ? new Date(Date.now() + diasRestantes * 86400000).toLocaleDateString('es-MX') : '—'}
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '.7rem', fontWeight: 700, background: ALERTA_COLORS[d.alerta] + '20', color: ALERTA_COLORS[d.alerta] }}>
                                {ALERTA_LABEL[d.alerta]}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: VENTAS Y REPORTES
// ─────────────────────────────────────────────────────────────
function TabReportes({ branches }) {
  const today = new Date().toISOString().slice(0, 10);
  const ago30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [from,     setFrom]     = useState(ago30);
  const [to,       setTo]       = useState(today);
  const [branch,   setBranch]   = useState("all");
  const [loading,  setLoading]  = useState(false);
  const [summary,  setSummary]  = useState(null);
  const [topProds, setTopProds] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ from, to });
    if (branch !== "all") p.append("branch", branch);
    try {
      const [s, tp] = await Promise.all([
        fetch(`${API_URL}/api/admin/reports/summary?${p}`,      { headers: auth() }).then(r => r.ok ? r.json() : null),
        fetch(`${API_URL}/api/admin/reports/top-products?${p}`, { headers: auth() }).then(r => r.ok ? r.json() : []),
      ]);
      setSummary(s);
      setTopProds(tp && Array.isArray(tp) ? tp : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [from, to, branch]);

  useEffect(() => { load(); }, []);

  const kpis = summary ? [
    { label: "Ingresos", val: fmtMXN(summary.current?.ingresos), color: "blue" },
    { label: "Pedidos", val: fmt(summary.current?.total_pedidos), color: "green" },
    { label: "Ticket", val: fmtMXN(summary.current?.ticket_promedio), color: "orange" },
    { label: "Clientes", val: fmt(summary.current?.clientes_unicos), color: "blue" },
  ] : [];

  return (
    <>
      <div className="rep-filters">
        <div className="rep-fg"><label>Desde</label><input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div className="rep-fg"><label>Hasta</label><input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
        <div className="rep-fg">
          <label>Sucursal</label>
          <select value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">Todas</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
        </div>
        <button className="rep-apply" onClick={load} disabled={loading}>
          <MdRefresh size={16} className={loading ? "spinning" : ""} />
          {loading ? "Cargando…" : "Aplicar"}
        </button>
      </div>

      {summary && (
        <div className="rep-kpis">
          {kpis.map(k => (
            <div key={k.label} className={`rep-kpi ${k.color}`}>
              <div className="rep-kpi-lbl">{k.label}</div>
              <div className="rep-kpi-val">{k.val}</div>
            </div>
          ))}
        </div>
      )}

      <div className="rep-panel">
        <div className="rep-panel-head">
          <div className="rep-panel-title"><MdInventory /> Top 10 productos más vendidos</div>
          <span className="rep-badge">{(topProds || []).length}</span>
        </div>
        {topProds && topProds.length > 0 ? (
          <div className="rep-panel-body">
            <HBarChart data={topProds} labelKey="nombre" valueKey="vendidos" isMXN={false} maxItems={10} />
          </div>
        ) : (
          <div className="rep-panel-body"><div className="rep-empty">Sin datos</div></div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Reportes() {
  const [tab,      setTab]      = useState("ventas");
  const [branches, setBranches] = useState([]);
  const [alertas,  setAlertas]  = useState({ critico: 0, agotado: 0 });

  useEffect(() => {
    fetch(`${API_URL}/api/admin/branches`, { headers: auth() })
      .then(r => r.ok ? r.json() : [])
      .then(setBranches)
      .catch(() => {});

    fetch(`${API_URL}/api/products/prediccion-publica`)
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        if (!Array.isArray(raw)) return;
        const map = {};
        raw.forEach(row => {
          const pid = row.product_id;
          if (!map[pid]) { map[pid] = { ...row }; }
          else {
            const prio = { critico:0, bajo:1, moderado:2, sin_movimiento:3, ok:4, agotado:5 };
            if ((prio[row.alerta] ?? 99) < (prio[map[pid].alerta] ?? 99)) {
              map[pid].alerta = row.alerta;
            }
          }
        });
        const values = Object.values(map);
        setAlertas({
          critico: values.filter(d => d.alerta === "critico").length,
          agotado: values.filter(d => d.alerta === "agotado").length,
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
        <p>Análisis de ventas, inventario y predicción de demanda</p>
      </div>

      <div className="rep-tabs-nav">
        <button className={`rep-tab-btn${tab === "ventas" ? " active" : ""}`} onClick={() => setTab("ventas")}>
          <MdBarChart /> Ventas y reportes
        </button>
        <button className={`rep-tab-btn${tab === "inventario" ? " active" : ""}`} onClick={() => setTab("inventario")}>
          <MdWarning /> Predicción de agotamiento {totalAlerta > 0 && <span className="rep-tab-badge">{totalAlerta}</span>}
        </button>
      </div>

      {tab === "ventas" && <TabReportes branches={branches} />}
      {tab === "inventario" && <TabAgotamiento branches={branches} />}
    </div>
  );
}