const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .admin-layout, .admin-layout button, .admin-layout input, .admin-layout select, .admin-layout textarea { font-family:'DM Sans',sans-serif; }
  .admin-layout { display:flex; min-height:100vh; background:#f5f7fa; }
  .admin-sidebar { width:260px; background:linear-gradient(180deg,#1e3a5f 0%,#2c5282 100%); color:white; display:flex; flex-direction:column; position:fixed; height:100vh; left:0; top:0; transition:transform 0.3s ease; z-index:1000; box-shadow:4px 0 12px rgba(0,0,0,0.1); }
  .admin-sidebar.closed { transform:translateX(-260px); }
  .sidebar-header { padding:24px 20px; background:rgba(0,0,0,0.1); border-bottom:1px solid rgba(255,255,255,0.1); }
  .sidebar-header h3 { margin:0; font-size:1.4rem; font-weight:700; display:flex; align-items:center; gap:10px; }
  .sidebar-header p { margin:8px 0 0; font-size:0.85rem; opacity:0.8; }
  .sidebar-menu { flex:1; padding:20px 0; overflow-y:auto; }
  .sidebar-menu::-webkit-scrollbar { width:6px; }
  .sidebar-menu::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2); border-radius:3px; }
  .menu-section { margin-bottom:24px; }
  .menu-section-title { padding:8px 20px; font-size:0.75rem; text-transform:uppercase; font-weight:600; letter-spacing:1px; opacity:0.6; margin-bottom:8px; }
  .menu-item { display:flex; align-items:center; gap:12px; padding:12px 20px; color:white; text-decoration:none; font-size:0.95rem; font-weight:500; transition:all 0.2s ease; position:relative; }
  .menu-item::before { content:""; position:absolute; left:0; top:0; bottom:0; width:4px; background:#fff700; transform:scaleY(0); transition:transform 0.2s ease; }
  .menu-item:hover { background:rgba(255,255,255,0.1); padding-left:24px; }
  .menu-item.active { background:rgba(255,247,0,0.15); color:#fff700; font-weight:600; }
  .menu-item.active::before { transform:scaleY(1); }
  .menu-item svg { font-size:1.3rem; }
  .menu-item.monitor-item { border-top:1px solid rgba(255,255,255,0.08); margin-top:4px; }
  .menu-item.monitor-item .monitor-dot { width:7px; height:7px; border-radius:50%; background:#39d353; box-shadow:0 0 6px #39d353; animation:monPulse 2s ease-in-out infinite; flex-shrink:0; }
  @keyframes monPulse { 0%,100%{opacity:1;box-shadow:0 0 6px #39d353} 50%{opacity:.5;box-shadow:0 0 12px #39d353} }
  .admin-main { flex:1; min-width:0; margin-left:260px; transition:margin-left 0.3s ease; }
  .admin-main.expanded { margin-left:0; }
  .admin-topbar { background:white; padding:16px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 2px 8px rgba(0,0,0,0.05); position:sticky; top:0; z-index:100; }
  .topbar-left { display:flex; align-items:center; gap:16px; }
  .topbar-right { display:flex; align-items:center; gap:12px; }
  .toggle-sidebar-btn { background:none; border:none; font-size:1.5rem; color:#2c5282; cursor:pointer; padding:8px; border-radius:8px; transition:all 0.2s ease; }
  .toggle-sidebar-btn:hover { background:#f5f7fa; }
  .topbar-title { font-size:1.4rem; font-weight:700; color:#1e3a5f; margin:0; }
  .admin-profile-wrapper { position:relative; }
  .admin-user-info { display:flex; align-items:center; gap:12px; padding:8px 16px; background:#f5f7fa; border-radius:8px; cursor:pointer; border:2px solid transparent; transition:border-color 0.2s ease,box-shadow 0.2s ease; user-select:none; }
  .admin-user-info:hover,.admin-user-info.open { border-color:#2c5282; box-shadow:0 0 0 3px rgba(44,82,130,0.1); }
  .admin-user-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:0.9rem; flex-shrink:0; }
  .admin-user-details h5 { margin:0; font-size:0.9rem; font-weight:600; color:#2c5282; }
  .admin-user-details p { margin:0; font-size:0.75rem; color:#718096; }
  .admin-profile-dropdown { position:absolute; top:calc(100% + 10px); right:0; width:280px; background:white; border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,0.15); border:1px solid #e2e8f0; overflow:hidden; animation:dropIn 0.2s ease; z-index:200; }
  @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .dropdown-header { background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%); padding:20px; display:flex; align-items:center; gap:14px; }
  .dropdown-avatar-lg { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.3rem; flex-shrink:0; border:3px solid rgba(255,255,255,0.3); }
  .dropdown-header-info h4 { margin:0 0 4px; color:white; font-size:1rem; font-weight:700; }
  .dropdown-header-info span { font-size:0.78rem; background:rgba(255,247,0,0.2); color:#fff700; padding:2px 10px; border-radius:20px; font-weight:600; border:1px solid rgba(255,247,0,0.3); }
  .dropdown-body { padding:16px 20px; display:flex; flex-direction:column; gap:12px; }
  .dropdown-info-row { display:flex; align-items:center; gap:12px; padding:10px 14px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0; }
  .dropdown-info-row svg { font-size:1.1rem; color:#2c5282; flex-shrink:0; }
  .dropdown-info-row .info-label { font-size:0.72rem; color:#718096; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; line-height:1; margin-bottom:3px; }
  .dropdown-info-row .info-value { font-size:0.9rem; color:#1e3a5f; font-weight:600; word-break:break-all; }
  .dropdown-footer { padding:12px 20px 16px; border-top:1px solid #e2e8f0; }
  .btn-logout { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:10px; background:#fff5f5; color:#c53030; border:1px solid #feb2b2; border-radius:10px; font-size:0.92rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; }
  .btn-logout:hover { background:#c53030; color:white; border-color:#c53030; box-shadow:0 4px 12px rgba(197,48,48,0.3); }
  .btn-logout svg { font-size:1.1rem; }
  .admin-content { padding:24px; }
  .admin-content.is-monitor { padding:24px; }
  .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:999; }
  .sidebar-overlay.active { display:none; }
  .page-header { background:white; padding:24px; border-radius:12px; margin-bottom:24px; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
  .page-header h2 { margin:0 0 8px; color:#1e3a5f; font-size:1.8rem; font-weight:700; }
  .page-header p { margin:0; color:#718096; font-size:0.95rem; }
  @media(max-width:768px){
    .admin-sidebar{transform:translateX(-260px);}
    .admin-sidebar.open{transform:translateX(0);}
    .admin-main{margin-left:0;}
    .sidebar-overlay{display:none;}
    .sidebar-overlay.active{display:block;}
    .admin-topbar{padding:12px;gap:8px;}
    .topbar-left{gap:6px;min-width:0;}
    .topbar-title{font-size:1rem;overflow-wrap:anywhere;}
    .admin-user-details{display:none;}
    .admin-user-info{padding:6px;}
    .admin-content,.admin-content.is-monitor{padding:16px;}
    .admin-profile-dropdown{right:-10px;width:260px;}
  }
  .admin-layout button:focus-visible,.admin-layout a:focus-visible{outline:3px solid #86a5ff;outline-offset:3px;}
  body[data-bs-theme="dark"] .admin-layout{background:var(--bg-main);color:var(--text-main);}
  body[data-bs-theme="dark"] .admin-topbar,body[data-bs-theme="dark"] .admin-profile-dropdown,body[data-bs-theme="dark"] .admin-layout .page-header{background:var(--bg-card);color:var(--text-main);}
  body[data-bs-theme="dark"] .topbar-title,body[data-bs-theme="dark"] .admin-user-details h5,body[data-bs-theme="dark"] .toggle-sidebar-btn{color:var(--text-main);}
  body[data-bs-theme="dark"] .admin-user-info,body[data-bs-theme="dark"] .dropdown-info-row{background:var(--bg-main);border-color:var(--border-soft);}
  body[data-bs-theme="dark"] .dropdown-info-row .info-value{color:var(--text-main);}
`;
export default ADMIN_CSS;
