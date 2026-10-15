const CSS = `
  .admin-returns-header { display:flex; justify-content:space-between; gap:18px; align-items:center; }
  .admin-returns-header>button,.admin-returns-review,.admin-returns-modal-actions button {
    border:0; border-radius:9px; padding:10px 15px; background:#1e3a5f; color:white;
    font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;
  }
  .admin-returns-alert { padding:12px 16px; border-radius:10px; margin-bottom:15px; font-weight:700; }
  .admin-returns-alert.success { background:#f0fff4; color:#276749; border:1px solid #9ae6b4; }
  .admin-returns-alert.warning { background:#fffaf0; color:#975a16; border:1px solid #fbd38d; }
  .admin-returns-alert.error { background:#fff5f5; color:#c53030; border:1px solid #feb2b2; }
  .admin-returns-filter { background:white; padding:14px 18px; border-radius:12px 12px 0 0; display:flex; align-items:center; gap:10px; border-bottom:1px solid #e2e8f0; }
  .admin-returns-filter svg { color:#718096; }
  .admin-returns-filter select { border:1px solid #cbd5e0; border-radius:8px; padding:9px 12px; color:#1e3a5f; font-weight:600; }
  .admin-returns-filter span { margin-left:auto; color:#718096; font-size:.84rem; }
  .admin-returns-table-wrap { overflow:auto; background:white; border-radius:0 0 12px 12px; }
  .admin-returns-table-wrap table { width:100%; border-collapse:collapse; min-width:980px; }
  .admin-returns-table-wrap th { text-align:left; padding:12px 14px; color:#4a5568; font-size:.78rem; text-transform:uppercase; background:#f8fafc; }
  .admin-returns-table-wrap td { padding:13px 14px; border-top:1px solid #edf2f7; color:#475569; vertical-align:middle; font-size:.86rem; }
  .admin-returns-table-wrap td strong,.admin-returns-table-wrap td small { display:block; }
  .admin-returns-table-wrap td small { color:#94a3b8; max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:3px; }
  .admin-returns-money { font-weight:800; color:#276749!important; }
  .admin-returns-status { border-radius:20px; padding:4px 9px; font-size:.72rem; font-weight:800; background:#edf2f7; white-space:nowrap; }
  .admin-returns-status.requested { background:#fefcbf; color:#975a16; }
  .admin-returns-status.reviewing { background:#ebf8ff; color:#2b6cb0; }
  .admin-returns-status.approved,.admin-returns-status.refunded { background:#c6f6d5; color:#276749; }
  .admin-returns-status.rejected { background:#fed7d7; color:#9b2c2c; }
  .admin-returns-review { padding:7px 12px; }
  .admin-returns-empty { padding:42px!important; text-align:center; color:#94a3b8!important; }
  .admin-returns-backdrop { position:fixed; inset:0; z-index:2000; background:rgba(15,23,42,.58); display:grid; place-items:center; padding:20px; }
  .admin-returns-modal { background:white; border-radius:16px; width:min(590px,100%); padding:22px; box-shadow:0 24px 70px rgba(0,0,0,.25); }
  .admin-returns-modal-head { display:flex; justify-content:space-between; gap:12px; }
  .admin-returns-modal-head h3 { margin:0 0 4px; color:#1e3a5f; }
  .admin-returns-modal-head p { margin:0; color:#718096; }
  .admin-returns-modal-head>button { border:1px solid #cbd5e0; background:white; border-radius:8px; width:36px; height:36px; display:grid; place-items:center; cursor:pointer; }
  .admin-returns-summary { background:#f8fafc; border-radius:10px; padding:13px; margin:18px 0; color:#475569; }
  .admin-returns-summary p { margin:5px 0 0; }
  .admin-returns-evidence { margin:0 0 18px; color:#4a5568; font-size:.84rem; }
  .admin-returns-evidence>div { display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; }
  .admin-returns-evidence img { width:112px; height:86px; object-fit:cover; border-radius:9px; border:1px solid #cbd5e0; transition:transform .16s; }
  .admin-returns-evidence img:hover { transform:scale(1.04); }
  .admin-returns-modal label { display:flex; flex-direction:column; gap:6px; margin:13px 0; color:#4a5568; font-weight:700; font-size:.84rem; }
  .admin-returns-modal select,.admin-returns-modal textarea { border:1px solid #cbd5e0; border-radius:9px; padding:10px 12px; font:500 .92rem 'DM Sans',sans-serif; }
  .admin-returns-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:18px; }
  .admin-returns-modal-actions button.ghost { background:white; color:#1e3a5f; border:1px solid #cbd5e0; }
`;
export default CSS;
