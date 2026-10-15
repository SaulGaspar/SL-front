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

.model-hero {
  background:linear-gradient(135deg,#0f172a,#1e3a5f);
  color:white; border-radius:16px; padding:22px 24px; margin-bottom:18px;
  display:grid; grid-template-columns:1.4fr repeat(3,minmax(130px,1fr)); gap:16px;
  align-items:center; box-shadow:0 18px 44px rgba(15,23,42,.16);
}
.model-eyebrow { font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:#c8f03c; margin-bottom:6px; }
.model-title { font-size:1.35rem; font-weight:800; line-height:1.15; margin-bottom:5px; }
.model-copy { font-size:.8rem; color:#cbd5e1; max-width:540px; line-height:1.55; }
.model-chip { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); border-radius:12px; padding:12px 14px; }
.model-chip-label { font-size:.62rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; margin-bottom:4px; }
.model-chip-value { font-size:.9rem; font-weight:800; color:white; }

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
.risk-meter { min-width:92px; display:flex; flex-direction:column; gap:4px; }
.risk-meter-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.risk-meter-value { font-family:'JetBrains Mono',monospace; font-weight:800; font-size:.76rem; color:#0f172a; }
.risk-meter-label { font-size:.62rem; font-weight:800; text-transform:uppercase; letter-spacing:.35px; color:#64748b; }
.risk-meter-track { height:5px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
.risk-meter-fill { height:100%; border-radius:999px; transition:width .25s ease; }

.stock-bar { margin-top:4px; height:3px; background:#e2e8f0; border-radius:2px; overflow:hidden; }
.stock-bar-fill { height:100%; border-radius:2px; transition:width .3s; }

.agot-ai-hero {
  display:grid; grid-template-columns:1.35fr repeat(3,minmax(150px,1fr));
  gap:14px; align-items:stretch; margin-bottom:16px;
}
.agot-ai-intro {
  background:linear-gradient(135deg,#0f172a,#1e3a5f); color:white;
  border:1px solid rgba(255,255,255,.08); border-radius:12px;
  padding:22px 24px; box-shadow:0 14px 36px rgba(15,23,42,.14);
}
.agot-ai-eyebrow {
  font-size:.68rem; font-weight:800; color:#baf24a; text-transform:uppercase;
  letter-spacing:.1em; margin-bottom:7px;
}
.agot-ai-title { margin:0 0 7px; color:white; font-size:1.55rem; font-weight:800; }
.agot-ai-copy { margin:0; color:#dbeafe; font-size:.88rem; line-height:1.6; max-width:660px; }
.agot-ai-card {
  background:white; border:1px solid #e2e8f0; border-radius:12px; padding:18px;
  box-shadow:0 1px 4px rgba(15,23,42,.06);
}
.agot-ai-card.red { border-left:4px solid #dc2626; }
.agot-ai-card.green { border-left:4px solid #16a34a; }
.agot-ai-card.blue { border-left:4px solid #2563eb; }
.agot-ai-card-label {
  font-size:.66rem; font-weight:800; color:#94a3b8; text-transform:uppercase;
  letter-spacing:.08em; margin-bottom:8px;
}
.agot-ai-card-value { font-family:'JetBrains Mono',monospace; color:#0f172a; font-weight:800; font-size:1.75rem; line-height:1; }
.agot-ai-card-sub { color:#64748b; font-size:.74rem; margin-top:8px; }
.agot-ai-panel {
  background:white; border:1px solid #e2e8f0; border-radius:12px;
  box-shadow:0 1px 4px rgba(15,23,42,.06); overflow:hidden;
}
.agot-ai-panel-head {
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:16px 18px; border-bottom:1px solid #e2e8f0;
}
.agot-ai-panel-title { display:flex; align-items:center; gap:8px; color:#0f172a; font-size:.95rem; font-weight:800; }
.agot-ai-panel-title svg { color:#2563eb; }
.agot-ai-controls {
  display:flex; flex-wrap:wrap; align-items:flex-end; gap:10px;
  padding:14px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0;
}
.agot-ai-control { display:flex; flex-direction:column; gap:4px; }
.agot-ai-control label {
  font-size:.66rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em;
}
.agot-ai-control select {
  min-width:150px; padding:8px 10px; border:1.5px solid #e2e8f0; border-radius:8px;
  background:white; color:#0f172a; font-family:inherit; font-size:.82rem;
}
.agot-ai-control select:focus { outline:none; border-color:#2563eb; }
.agot-ai-table-wrap { overflow-x:auto; }
.agot-ai-table { width:100%; border-collapse:collapse; font-size:.78rem; }
.agot-ai-table th {
  padding:10px 12px; text-align:left; background:#f8fafc; color:#64748b;
  border-bottom:1px solid #e2e8f0; font-size:.64rem; font-weight:800;
  text-transform:uppercase; letter-spacing:.04em; white-space:nowrap;
}
.agot-ai-table th.sortable { cursor:pointer; user-select:none; }
.agot-ai-table th.sortable:hover { color:#1e3a5f; background:#eef4ff; }
.agot-ai-table td { padding:10px 12px; border-bottom:1px solid #f1f5f9; color:#1e293b; vertical-align:middle; }
.agot-ai-table tbody tr:hover { background:#f8fafc; }
.agot-ai-table tbody tr.agot-risk { background:#fff7f7; }
.agot-ai-table tbody tr.agot-risk td:first-child { box-shadow:inset 3px 0 #dc2626; }
.agot-product-name { font-weight:800; color:#0f172a; line-height:1.25; }
.agot-product-meta { color:#94a3b8; font-size:.68rem; margin-top:2px; }
.agot-chip {
  display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; color:#334155;
  padding:3px 8px; border-radius:6px; font-size:.7rem; font-weight:700;
}
.agot-result {
  display:inline-flex; flex-direction:column; gap:2px; min-width:116px;
  border-radius:8px; padding:7px 10px; font-weight:800;
}
.agot-result.si { background:#fee2e2; color:#991b1b; }
.agot-result.no { background:#dcfce7; color:#166534; }
.agot-result-main { font-size:.78rem; }
.agot-result-sub { font-size:.63rem; font-weight:700; opacity:.78; }
.agot-prob { min-width:92px; }
.agot-prob-top { display:flex; justify-content:space-between; gap:8px; margin-bottom:4px; }
.agot-prob-val { font-family:'JetBrains Mono',monospace; font-weight:800; color:#0f172a; font-size:.75rem; }
.agot-prob-track { height:5px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
.agot-prob-fill { height:100%; border-radius:999px; }

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

@media(max-width:1024px){ .rep-kpis{grid-template-columns:1fr 1fr;} .rep-grid2{grid-template-columns:1fr;} .model-hero{grid-template-columns:1fr 1fr;} .agot-ai-hero{grid-template-columns:1fr 1fr;} }
@media(max-width:640px){  .rep-kpis{grid-template-columns:1fr;} .model-hero{grid-template-columns:1fr;} .agot-ai-hero{grid-template-columns:1fr;} .agot-ai-panel-head{align-items:flex-start; flex-direction:column;} }
`;
export default S;
