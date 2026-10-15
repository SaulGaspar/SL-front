const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.ped * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }

/* Toast */
.ped-toast {
  position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
  padding:12px 28px; border-radius:10px; font-size:.88rem; font-weight:600;
  color:white; z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,.2);
  animation:toastIn .25s ease; pointer-events:none; white-space:nowrap;
}
.ped-toast.ok  { background:#276749; }
.ped-toast.err { background:#9b2c2c; }
@keyframes toastIn {
  from { opacity:0; transform:translateX(-50%) translateY(12px); }
  to   { opacity:1; transform:translateX(-50%) translateY(0); }
}

.ped-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-bottom:20px; }
.ped-stat { background:white; border-radius:12px; padding:14px 16px; box-shadow:0 1px 6px rgba(0,0,0,.06); border:2px solid transparent; cursor:pointer; transition:all .2s; }
.ped-stat:hover { transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,.1); }
.ped-stat.active { border-color:var(--sc); }
.ped-stat-n { font-size:1.9rem; font-weight:700; color:var(--sc); line-height:1; }
.ped-stat-l { font-size:.75rem; color:#718096; font-weight:600; margin-top:4px; }

.ped-bar { background:white; padding:14px 18px; border-radius:12px; margin-bottom:18px; box-shadow:0 1px 6px rgba(0,0,0,.06); display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.ped-srch { position:relative; flex:1; min-width:180px; max-width:300px; }
.ped-srch input { width:100%; padding:9px 9px 9px 36px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; }
.ped-srch input:focus { outline:none; border-color:#2c5282; background:white; }
.ped-srch-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; }
.ped-sel { padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:130px; }
.ped-datein { padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc; }
.ped-btn { padding:9px 16px; border-radius:8px; border:none; cursor:pointer; font-family:inherit; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:6px; transition:all .2s; }
.ped-btn-primary { background:linear-gradient(135deg,#1e3a5f,#2c5282); color:white; }
.ped-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
.ped-btn-ghost { background:#f7fafc; color:#4a5568; border:1.5px solid #e2e8f0; }
.ped-btn-ghost:hover { background:#edf2f7; }

.ped-card { background:white; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.06); overflow:hidden; }
.ped-table { width:100%; border-collapse:collapse; }
.ped-table thead { background:#f8fafc; }
.ped-table th { padding:12px 16px; text-align:left; font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid #e2e8f0; white-space:nowrap; }
.ped-table td { padding:13px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.ped-table tbody tr:hover { background:#f8fafc; }
.ped-table tbody tr:last-child td { border-bottom:none; }
.ped-oid { font-weight:700; color:#2c5282; }
.ped-cliente { font-weight:600; color:#1a202c; font-size:.9rem; }
.ped-sub { font-size:.75rem; color:#a0aec0; margin-top:2px; }
.ped-total { font-weight:700; color:#1a202c; font-size:.95rem; }
.ped-fecha { font-size:.82rem; color:#718096; white-space:nowrap; }
.ped-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:.75rem; font-weight:700; white-space:nowrap; }
.ped-btn-ver { background:#ede9fe; color:#5b21b6; border:none; padding:7px 12px; border-radius:7px; cursor:pointer; font-size:.82rem; font-family:inherit; font-weight:600; display:flex; align-items:center; gap:4px; transition:all .2s; }
.ped-btn-ver:hover { background:#ddd6fe; }
.ped-empty { padding:60px; text-align:center; color:#a0aec0; }
.ped-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }

.ped-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:3000; display:flex; align-items:center; justify-content:center; padding:16px; }
.ped-modal { background:white; border-radius:16px; width:100%; max-width:620px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.2); }
.ped-mhead { padding:20px 24px; border-bottom:1px solid #f0f4f8; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0; }
.ped-mhead h3 { margin:0; font-size:1.1rem; color:#1a202c; }
.ped-mbody { padding:20px 24px; }
.ped-mclose { background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem; color:#718096; }
.ped-mclose:hover { background:#edf2f7; }
.ped-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.ped-info-item { background:#f8fafc; border-radius:10px; padding:12px 14px; }
.ped-info-lbl { font-size:.72rem; color:#a0aec0; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
.ped-info-val { font-size:.92rem; font-weight:600; color:#1a202c; }
.ped-items-title { font-size:.85rem; font-weight:700; color:#4a5568; margin:0 0 10px; text-transform:uppercase; letter-spacing:.5px; }
.ped-item-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1px solid #f0f4f8; border-radius:8px; margin-bottom:8px; }
.ped-item-name { font-weight:600; color:#1a202c; font-size:.9rem; }
.ped-item-cat { font-size:.75rem; color:#a0aec0; margin-top:2px; }
.ped-item-qty { font-size:.82rem; color:#718096; }
.ped-item-sub { font-weight:700; color:#2c5282; font-size:.95rem; }
.ped-status-edit { margin-top:20px; border-top:1px solid #f0f4f8; padding-top:20px; }
.ped-status-edit label { font-size:.82rem; font-weight:700; color:#4a5568; display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:.5px; }
.ped-status-row { display:flex; gap:8px; flex-wrap:wrap; }
.ped-status-opt { padding:7px 14px; border-radius:20px; border:2px solid transparent; cursor:pointer; font-size:.8rem; font-weight:700; transition:all .2s; font-family:inherit; display:flex; align-items:center; gap:5px; }
.ped-status-opt:disabled { opacity:.5; cursor:not-allowed; }
.ped-spin-sm { width:13px; height:13px; border:2px solid rgba(255,255,255,.4); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
.ped-spinner { display:flex; align-items:center; justify-content:center; padding:60px; }
.spinning { animation:spin 1s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
`;
export default CSS;
