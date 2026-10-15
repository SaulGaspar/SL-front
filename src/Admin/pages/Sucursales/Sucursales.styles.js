const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.suc * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

.suc-toolbar {
  background:white; padding:18px 22px; border-radius:12px; margin-bottom:18px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:14px; flex-wrap:wrap;
  align-items:center; justify-content:space-between;
}
.suc-search { position:relative; flex:1; min-width:200px; max-width:340px; }
.suc-search input {
  width:100%; padding:9px 10px 9px 38px; border:1px solid #e2e8f0;
  border-radius:8px; font-size:.88rem; font-family:inherit;
}
.suc-search input:focus { outline:none; border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.1); }
.suc-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#a0aec0; }
.suc-btn-primary {
  background:#1e3a5f; color:white; border:none; padding:9px 18px;
  border-radius:8px; font-weight:600; display:flex; align-items:center;
  gap:7px; cursor:pointer; font-family:inherit; font-size:.88rem;
}
.suc-btn-primary:hover { background:#2c5282; }
.suc-btn-icon {
  background:#f7fafc; color:#2d3748; border:1px solid #e2e8f0;
  padding:9px 11px; border-radius:8px; cursor:pointer; display:flex; align-items:center;
}
.suc-btn-icon:hover { background:#edf2f7; }

/* Grid */
.suc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px; }

/* Card */
.suc-card {
  background:white; border-radius:14px; padding:22px;
  box-shadow:0 2px 8px rgba(0,0,0,.05); border:1px solid #f0f4f8;
  position:relative; overflow:hidden; cursor:pointer;
  transition:all .2s;
}
.suc-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.1); border-color:#bee3f8; }
.suc-card.selected { border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.15); }
.suc-card-accent { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#2b6cb0,#553c9a); }
.suc-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
.suc-card-icon { width:46px; height:46px; border-radius:12px; background:#ebf8ff; display:flex; align-items:center; justify-content:center; color:#2b6cb0; font-size:1.4rem; }
.suc-card-actions { display:flex; gap:6px; }
.suc-btn-edit { background:#bee3f8; color:#2c5282; border:none; padding:6px 9px; border-radius:6px; cursor:pointer; display:flex; align-items:center; }
.suc-btn-edit:hover { background:#90cdf4; }
.suc-btn-del  { background:#fed7d7; color:#9b2c2c; border:none; padding:6px 9px; border-radius:6px; cursor:pointer; display:flex; align-items:center; }
.suc-btn-del:hover  { background:#fc8181; }
.suc-card-name { font-size:1.15rem; font-weight:700; color:#1e3a5f; margin-bottom:10px; }
.suc-card-info { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.suc-card-row  { display:flex; align-items:center; gap:7px; font-size:.83rem; color:#4a5568; }
.suc-card-row svg { color:#2b6cb0; flex-shrink:0; }
.suc-card-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-top:1px solid #f0f4f8; padding-top:12px; }
.suc-stat { display:flex; flex-direction:column; align-items:center; padding:4px 0; }
.suc-stat + .suc-stat { border-left:1px solid #f0f4f8; }
.suc-stat-val { font-family:'JetBrains Mono',monospace; font-size:1.1rem; font-weight:700; color:#1e3a5f; }
.suc-stat-lbl { font-size:.7rem; color:#a0aec0; text-align:center; }
.suc-badge-active   { background:#c6f6d5; color:#276749; padding:2px 9px; border-radius:20px; font-size:.74rem; font-weight:700; }
.suc-badge-inactive { background:#fed7d7; color:#9b2c2c; padding:2px 9px; border-radius:20px; font-size:.74rem; font-weight:700; }

/* Panel de detalle */
.suc-detail { background:white; border-radius:14px; box-shadow:0 2px 8px rgba(0,0,0,.05); margin-top:22px; overflow:hidden; }
.suc-detail-head { background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%); padding:22px 26px; display:flex; align-items:center; justify-content:space-between; }
.suc-detail-head h3 { margin:0; color:white; font-size:1.2rem; display:flex; align-items:center; gap:10px; }
.suc-detail-close { background:rgba(255,255,255,.15); border:none; color:white; padding:7px; border-radius:8px; cursor:pointer; display:flex; align-items:center; }
.suc-detail-close:hover { background:rgba(255,255,255,.25); }
.suc-detail-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border-bottom:1px solid #f0f4f8; }
.suc-dkpi { padding:20px 22px; border-right:1px solid #f0f4f8; }
.suc-dkpi:last-child { border-right:none; }
.suc-dkpi-lbl { font-size:.72rem; font-weight:700; color:#718096; text-transform:uppercase; letter-spacing:.4px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
.suc-dkpi-lbl svg { color:#2b6cb0; }
.suc-dkpi-val { font-family:'JetBrains Mono',monospace; font-size:1.5rem; font-weight:700; color:#1e3a5f; }
.suc-dkpi-sub { font-size:.74rem; color:#a0aec0; margin-top:3px; }
.suc-detail-body { display:grid; grid-template-columns:1fr 1fr; gap:0; }
.suc-detail-col { padding:22px 26px; }
.suc-detail-col + .suc-detail-col { border-left:1px solid #f0f4f8; }
.suc-detail-col h4 { margin:0 0 14px; font-size:.85rem; font-weight:700; color:#1e3a5f; display:flex; align-items:center; gap:7px; }
.suc-detail-col h4 svg { color:#2b6cb0; }
.suc-det-list { display:flex; flex-direction:column; gap:8px; }
.suc-det-row  { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; }
.suc-det-name { font-size:.83rem; color:#2d3748; font-weight:500; }
.suc-det-val  { font-family:'JetBrains Mono',monospace; font-size:.82rem; color:#2b6cb0; font-weight:700; }
.suc-low-row  { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-radius:8px; border:1px solid #fef5e7; background:#fffbeb; }
.suc-low-name { font-size:.83rem; color:#744210; font-weight:500; }
.suc-low-val  { font-family:'JetBrains Mono',monospace; font-size:.82rem; color:#975a16; font-weight:700; }
.suc-stock-zero { border-color:#fed7d7 !important; background:#fff5f5 !important; }
.suc-stock-zero .suc-low-name { color:#9b2c2c !important; }
.suc-stock-zero .suc-low-val  { color:#c53030 !important; }
.inv-bar { height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; margin-top:3px; }
.inv-bar-fill { height:100%; border-radius:3px; }

/* Modal */
.suc-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:2000; padding:20px; }
.suc-modal { background:white; border-radius:16px; width:100%; max-width:480px; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.suc-modal-head { padding:22px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
.suc-modal-head h3 { margin:0; color:#1e3a5f; font-size:1.2rem; }
.suc-modal-body { padding:22px 24px; display:flex; flex-direction:column; gap:14px; }
.suc-fg { display:flex; flex-direction:column; gap:5px; }
.suc-fg label { font-weight:600; font-size:.88rem; color:#2d3748; }
.suc-fg input, .suc-fg select { padding:10px 13px; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; font-family:inherit; }
.suc-fg input:focus, .suc-fg select:focus { outline:none; border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,.1); }
.suc-modal-foot { padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; gap:10px; justify-content:flex-end; }
.suc-btn-cancel { padding:9px 18px; border:1px solid #e2e8f0; background:white; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:600; color:#4a5568; }
.suc-btn-save   { padding:9px 20px; background:#1e3a5f; color:white; border:none; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:600; }
.suc-btn-save:hover { background:#2c5282; }

.suc-empty { padding:60px; text-align:center; color:#a0aec0; background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }

@media(max-width:900px) {
  .suc-detail-kpis { grid-template-columns:1fr 1fr; }
  .suc-detail-body  { grid-template-columns:1fr; }
  .suc-detail-col + .suc-detail-col { border-left:none; border-top:1px solid #f0f4f8; }
}
`;
export default S;
