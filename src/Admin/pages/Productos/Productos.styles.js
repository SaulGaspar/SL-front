const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.pro * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.pro-toolbar { background:white; padding:16px 20px; border-radius:12px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
.pro-left { display:flex; gap:10px; flex:1; flex-wrap:wrap; }
.pro-search { position:relative; flex:1; min-width:200px; max-width:320px; }
.pro-search input { width:100%; padding:10px 10px 10px 36px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.9rem; font-family:inherit; background:#f8fafc; }
.pro-search input:focus { outline:none; border-color:#1e3a5f; background:white; }
.pro-search-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; pointer-events:none; }
.pro-sel { padding:10px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:140px; }
.pro-sel:focus { outline:none; border-color:#1e3a5f; }
.pro-date-input { padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:130px; color:#2d3748; }
.pro-date-label { font-size:.75rem; font-weight:700; color:#718096; text-transform:uppercase; letter-spacing:.4px; white-space:nowrap; }
.pro-btn { padding:10px 16px; border-radius:8px; border:none; cursor:pointer; font-family:inherit; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:6px; transition:all .2s; }
.pro-btn-primary { background:#1e3a5f; color:white; }
.pro-btn-primary:hover { background:#2c5282; transform:translateY(-1px); box-shadow:0 6px 16px rgba(30,58,95,.3); }
.pro-btn-ghost { background:#f7fafc; color:#2d3748; border:1.5px solid #e2e8f0; }
.pro-btn-ghost:hover { background:#edf2f7; }
.pro-btn-export { background:#ebf8ff; color:#2b6cb0; border:1.5px solid #bee3f8; }
.pro-btn-export:hover { background:#bee3f8; }
.pro-btn-import { background:#f0fff4; color:#276749; border:1.5px solid #c6f6d5; }
.pro-btn-import:hover { background:#c6f6d5; }
.pro-btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }
.pro-table-wrap { background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); overflow:hidden; }
.pro-table { width:100%; border-collapse:collapse; }
.pro-table thead { background:#f7fafc; }
.pro-table th { padding:13px 16px; text-align:left; font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.pro-table td { padding:13px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.pro-table tbody tr:hover { background:#f8fafc; }
.pro-table tbody tr:last-child td { border-bottom:none; }
.pro-img { width:46px; height:46px; border-radius:8px; object-fit:contain; background:#f8f8f8; border:1px solid #e2e8f0; padding:2px; }
.pro-name { font-weight:700; color:#1e3a5f; font-size:.9rem; }
.pro-brand { font-size:.76rem; color:#2c5282; font-weight:600; margin-top:2px; }
.pro-desc { font-size:.76rem; color:#a0aec0; margin-top:2px; max-width:220px; }
.pro-tag { background:#edf2f7; padding:3px 9px; border-radius:6px; font-size:.75rem; color:#4a5568; display:inline-block; }
.pro-price { font-weight:700; color:#38a169; font-size:.95rem; }
.pro-status { padding:4px 10px; border-radius:20px; font-size:.75rem; font-weight:700; display:inline-block; }
.pro-status-on  { background:#c6f6d5; color:#276749; }
.pro-status-off { background:#fed7d7; color:#9b2c2c; }
.pro-chips { display:flex; flex-wrap:wrap; gap:4px; max-width:180px; }
.pro-chip { background:#edf2f7; padding:2px 8px; border-radius:12px; font-size:.72rem; color:#4a5568; font-weight:600; }
.pro-color-dot { width:14px; height:14px; border-radius:50%; display:inline-block; border:2px solid white; box-shadow:0 0 0 1px #e2e8f0; }
.pro-actions { display:flex; gap:7px; }
.pro-act { padding:7px 11px; border:none; border-radius:7px; cursor:pointer; font-size:.8rem; font-family:inherit; font-weight:600; display:flex; align-items:center; gap:4px; transition:all .15s; }
.pro-act-edit { background:#bee3f8; color:#2c5282; }
.pro-act-edit:hover { background:#90cdf4; }
.pro-act-delete { background:#fed7d7; color:#9b2c2c; }
.pro-act-delete:hover { background:#fc8181; color:white; }
.pro-empty { padding:56px; text-align:center; color:#a0aec0; }
.pro-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }
.pro-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:4000; display:flex; align-items:center; justify-content:center; padding:16px; }
.pro-modal { background:white; border-radius:16px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.28); animation:proIn .22s ease; }
.pro-modal-sm { max-width:460px; }
.pro-modal-lg { max-width:720px; }
@keyframes proIn { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
.pro-mhead { padding:18px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0; }
.pro-mhead h3 { margin:0; color:#1e3a5f; font-size:1.1rem; font-weight:700; }
.pro-mclose { background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#718096; }
.pro-mclose:hover { background:#fed7d7; color:#9b2c2c; }
.pro-mbody { padding:22px 24px; display:flex; flex-direction:column; gap:16px; }
.pro-field { display:flex; flex-direction:column; gap:5px; }
.pro-field label { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; }
.pro-field input, .pro-field textarea { padding:10px 13px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.92rem; font-family:inherit; background:#f8fafc; transition:border-color .15s; }
.pro-field input:focus, .pro-field textarea:focus { outline:none; border-color:#1e3a5f; background:white; box-shadow:0 0 0 3px rgba(30,58,95,.08); }
.pro-field textarea { resize:vertical; min-height:80px; }
.pro-field-hint { font-size:.75rem; color:#a0aec0; margin-top:3px; }
.pro-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.pro-toggle-row { display:flex; gap:8px; }
.pro-toggle { flex:1; padding:10px; border:2px solid #e2e8f0; border-radius:8px; cursor:pointer; font-family:inherit; font-size:.86rem; font-weight:600; display:flex; align-items:center; justify-content:center; gap:5px; background:#f8fafc; transition:all .2s; }
.pro-toggle.on  { border-color:#38a169; background:#c6f6d5; color:#276749; }
.pro-toggle.off { border-color:#e53e3e; background:#fed7d7; color:#9b2c2c; }
.pro-section-divider { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; padding-bottom:6px; border-bottom:1.5px solid #e2e8f0; margin-top:4px; }
.pro-chips-preview { display:flex; flex-wrap:wrap; gap:5px; margin-top:6px; min-height:28px; }
.pro-chip-preview { background:#ebf8ff; color:#2b6cb0; padding:3px 10px; border-radius:12px; font-size:.76rem; font-weight:600; }
.pro-mfoot { padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; gap:10px; justify-content:flex-end; position:sticky; bottom:0; background:white; border-radius:0 0 16px 16px; }
.pro-err { background:#fff5f5; border:1px solid #fc8181; color:#9b2c2c; padding:10px 14px; border-radius:8px; font-size:.86rem; }
.pro-info-box { background:#ebf8ff; border:1px solid #bee3f8; color:#2c5282; padding:12px 14px; border-radius:8px; font-size:.84rem; line-height:1.5; }
.pro-warn-box { background:#fffbeb; border:1px solid #f6e05e; color:#744210; padding:12px 14px; border-radius:8px; font-size:.84rem; line-height:1.6; }
.pro-success-box { background:#f0fff4; border:1px solid #9ae6b4; color:#276749; padding:14px 16px; border-radius:10px; font-size:.88rem; line-height:1.7; }
.pro-import-preview { max-height:200px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px; }
.pro-import-preview table { width:100%; border-collapse:collapse; font-size:.78rem; }
.pro-import-preview th { background:#f7fafc; padding:7px 10px; text-align:left; color:#4a5568; font-weight:700; position:sticky; top:0; }
.pro-import-preview td { padding:6px 10px; border-top:1px solid #f0f4f8; color:#2d3748; }
.pro-import-summary { display:flex; gap:10px; flex-wrap:wrap; }
.pro-import-badge { padding:5px 12px; border-radius:20px; font-size:.8rem; font-weight:700; }
.pro-import-badge.new { background:#c6f6d5; color:#276749; }
.pro-import-badge.dup { background:#fef5e7; color:#975a16; }
.pro-export-table-wrap { max-height:340px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:10px; }
.pro-export-table { width:100%; border-collapse:collapse; font-size:.78rem; }
.pro-export-table thead { position:sticky; top:0; background:#f7fafc; z-index:1; }
.pro-export-table th { padding:9px 12px; text-align:left; color:#4a5568; font-weight:700; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.pro-export-table td { padding:8px 12px; border-bottom:1px solid #f0f4f8; vertical-align:middle; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pro-cell-empty { color:#cbd5e0; font-style:italic; font-size:.73rem; }
.pro-cell-warn { background:#fffbeb !important; }
.pro-export-stats { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:4px; }
.pro-export-stat { padding:5px 14px; border-radius:20px; font-size:.8rem; font-weight:700; }
.pro-export-stat.total { background:#ebf8ff; color:#2b6cb0; }
.pro-export-stat.warn  { background:#fffbeb; color:#975a16; }
.pro-export-stat.ok    { background:#c6f6d5; color:#276749; }
.pro-summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.pro-summary-card { border-radius:10px; padding:16px 20px; display:flex; flex-direction:column; gap:4px; }
.pro-summary-card.created { background:#f0fff4; border:1px solid #9ae6b4; }
.pro-summary-card.updated { background:#ebf8ff; border:1px solid #90cdf4; }
.pro-summary-card.skipped { background:#f7fafc; border:1px solid #e2e8f0; }
.pro-summary-card.errors  { background:#fff5f5; border:1px solid #fc8181; }
.pro-summary-num { font-size:2rem; font-weight:700; line-height:1; }
.pro-summary-num.created { color:#276749; }
.pro-summary-num.updated { color:#2b6cb0; }
.pro-summary-num.skipped { color:#718096; }
.pro-summary-num.errors  { color:#9b2c2c; }
.pro-summary-label { font-size:.8rem; font-weight:600; color:#718096; }
.pro-date-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:8px; padding:8px 12px; }
.pro-date-sep { color:#a0aec0; font-size:.85rem; }
.pro-date-clear { background:none; border:none; color:#a0aec0; cursor:pointer; font-size:.8rem; padding:2px 6px; border-radius:4px; font-family:inherit; }
.pro-date-clear:hover { color:#e53e3e; background:#fff5f5; }
.pro-toast { position:fixed; bottom:24px; right:24px; z-index:9999; padding:12px 20px; border-radius:10px; color:white; font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,.2); animation:proIn .3s ease; }
.pro-toast.ok  { background:#276749; }
.pro-toast.err { background:#9b2c2c; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

/* ── Image uploader single ── */
.img-drop-zone { border:2px dashed #bee3f8; border-radius:12px; background:#f7fbff; cursor:pointer; transition:all .2s; overflow:hidden; position:relative; min-height:140px; display:flex; align-items:center; justify-content:center; }
.img-drop-zone:hover, .img-drop-zone.drag { border-color:#3182ce; background:#ebf8ff; }
.img-drop-zone.has-img { border-style:solid; border-color:#bee3f8; }
.img-drop-zone input[type=file] { display:none; }
.img-drop-placeholder { display:flex; flex-direction:column; align-items:center; gap:8px; padding:24px; color:#718096; }
.img-drop-placeholder svg { color:#90cdf4; }
.img-drop-placeholder span { font-size:.84rem; font-weight:600; }
.img-drop-placeholder small { font-size:.74rem; color:#a0aec0; }
.img-preview-wrap { width:100%; height:160px; position:relative; }
.img-preview-wrap img { width:100%; height:100%; object-fit:contain; background:#f8f8f8; display:block; }
.img-preview-overlay { position:absolute; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; gap:10px; opacity:0; transition:opacity .2s; }
.img-preview-wrap:hover .img-preview-overlay { opacity:1; }
.img-overlay-btn { padding:7px 14px; border-radius:8px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:700; display:flex; align-items:center; gap:5px; }
.img-overlay-btn.change { background:white; color:#1e3a5f; }
.img-overlay-btn.remove { background:#fed7d7; color:#9b2c2c; }
.img-uploading { position:absolute; inset:0; background:rgba(255,255,255,.88); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }
.img-upload-bar { width:80%; height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.img-upload-bar-fill { height:100%; background:#3182ce; border-radius:3px; transition:width .2s; }
.img-url-toggle { font-size:.75rem; color:#2b6cb0; cursor:pointer; text-decoration:underline; background:none; border:none; font-family:inherit; padding:0; margin-top:4px; }

/* ── Multi gallery ── */
.mg-wrap { display:flex; flex-direction:column; gap:10px; }
.mg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.mg-item { position:relative; aspect-ratio:1; border-radius:10px; overflow:hidden; border:2px solid #e2e8f0; background:#f8f8f8; }
.mg-item.is-main { border-color:#1e3a5f; border-width:2.5px; }
.mg-item img { width:100%; height:100%; object-fit:contain; padding:4px; }
.mg-item-actions { position:absolute; inset:0; background:rgba(0,0,0,.5); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; opacity:0; transition:opacity .2s; }
.mg-item:hover .mg-item-actions { opacity:1; }
.mg-item-btn { padding:5px 10px; border-radius:6px; border:none; cursor:pointer; font-size:.74rem; font-weight:700; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:4px; }
.mg-item-btn.main { background:#c8f03c; color:#0a1a2f; }
.mg-item-btn.del  { background:#fed7d7; color:#9b2c2c; }
.mg-main-badge { position:absolute; top:5px; left:5px; background:#1e3a5f; color:white; font-size:.6rem; font-weight:700; padding:2px 6px; border-radius:4px; letter-spacing:.5px; pointer-events:none; }
.mg-add-btn { aspect-ratio:1; border-radius:10px; border:2px dashed #bee3f8; background:#f7fbff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; transition:all .2s; color:#718096; font-size:.78rem; font-weight:600; position:relative; }
.mg-add-btn:hover { border-color:#3182ce; background:#ebf8ff; color:#2b6cb0; }
.mg-add-btn input { display:none; }
.mg-info { font-size:.74rem; color:#718096; background:#f7fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; }
`;
export default CSS;
