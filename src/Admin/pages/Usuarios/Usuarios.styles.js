const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.usu * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.usu-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; background:white; padding:6px; border-radius:12px; width:max-content; max-width:100%; box-shadow:0 1px 6px rgba(0,0,0,.06); }
.usu-tab { padding:9px 16px; border:0; border-radius:8px; background:transparent; color:#718096; font-family:inherit; font-weight:700; cursor:pointer; }
.usu-tab.active { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }

/* Stats */
.usu-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-bottom:20px; }
.usu-stat { background:white; border-radius:12px; padding:14px 16px; box-shadow:0 1px 6px rgba(0,0,0,0.06); }
.usu-stat-n { font-size:1.9rem; font-weight:700; color:var(--uc); line-height:1; }
.usu-stat-l { font-size:.75rem; color:#718096; font-weight:600; margin-top:4px; }

/* Toolbar */
.usu-bar {
  background:white; padding:14px 18px; border-radius:12px; margin-bottom:18px;
  box-shadow:0 1px 6px rgba(0,0,0,0.06); display:flex; gap:10px; flex-wrap:wrap; align-items:center;
}
.usu-srch { position:relative; flex:1; min-width:180px; max-width:320px; }
.usu-srch input {
  width:100%; padding:9px 9px 9px 36px; border:1.5px solid #e2e8f0;
  border-radius:8px; font-size:.88rem; font-family:inherit; background:#f8fafc;
}
.usu-srch input:focus { outline:none; border-color:#667eea; background:white; }
.usu-srch-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#a0aec0; }
.usu-sel {
  padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.88rem; font-family:inherit; background:#f8fafc; min-width:130px;
}
.usu-sel:focus { outline:none; border-color:#667eea; }
.usu-btn {
  padding:9px 16px; border-radius:8px; border:none; cursor:pointer;
  font-family:inherit; font-size:.88rem; font-weight:600;
  display:flex; align-items:center; gap:6px; transition:all .2s;
}
.usu-btn-primary { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }
.usu-btn-primary:hover { opacity:.9; }
.usu-btn-ghost { background:#f7fafc; color:#4a5568; border:1.5px solid #e2e8f0; }
.usu-btn-ghost:hover { background:#edf2f7; }
.usu-btn:disabled { opacity:.5; cursor:not-allowed; }

/* Table */
.usu-card { background:white; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,0.06); overflow:hidden; }
.usu-table { width:100%; border-collapse:collapse; }
.usu-table thead { background:#f8fafc; }
.usu-table th {
  padding:12px 16px; text-align:left; font-size:.75rem; font-weight:700;
  color:#4a5568; text-transform:uppercase; letter-spacing:.5px;
  border-bottom:2px solid #e2e8f0; white-space:nowrap;
}
.usu-table td { padding:12px 16px; border-bottom:1px solid #f0f4f8; vertical-align:middle; }
.usu-table tbody tr:hover { background:#f8fafc; }
.usu-table tbody tr:last-child td { border-bottom:none; }

.usu-name { font-weight:600; color:#1a202c; font-size:.9rem; }
.usu-handle { font-size:.78rem; color:#a0aec0; margin-top:2px; }
.usu-email { font-size:.84rem; color:#4a5568; }
.usu-date { font-size:.8rem; color:#718096; white-space:nowrap; }

.usu-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px; border-radius:20px; font-size:.73rem; font-weight:700;
}
.usu-badge-admin { background:#ede9fe; color:#5b21b6; }
.usu-badge-cliente { background:#dbeafe; color:#1e40af; }
.usu-badge-ok { background:#dcfce7; color:#15803d; }
.usu-badge-no { background:#fee2e2; color:#b91c1c; }
.usu-badge-lock { background:#fef3c7; color:#b45309; }

.usu-actions { display:flex; gap:6px; }
.usu-act-btn {
  padding:6px 11px; border-radius:7px; border:none; cursor:pointer;
  font-size:.78rem; font-family:inherit; font-weight:600;
  display:flex; align-items:center; gap:4px; transition:all .2s;
}
.usu-act-edit { background:#ede9fe; color:#5b21b6; }
.usu-act-edit:hover { background:#ddd6fe; }
.usu-act-unlock { background:#dcfce7; color:#15803d; }
.usu-act-unlock:hover { background:#bbf7d0; }

.usu-empty { padding:60px; text-align:center; color:#a0aec0; }
.usu-foot { padding:10px 16px; font-size:.8rem; color:#718096; border-top:1px solid #f0f4f8; }

/* Modal */
.usu-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:3000;
  display:flex; align-items:center; justify-content:center; padding:16px;
}
.usu-modal {
  background:white; border-radius:16px; width:100%; max-width:640px;
  max-height:92vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2);
}
.usu-mhead {
  padding:18px 24px; border-bottom:1px solid #f0f4f8;
  display:flex; justify-content:space-between; align-items:center;
  position:sticky; top:0; background:white; z-index:1; border-radius:16px 16px 0 0;
}
.usu-mhead h3 { margin:0; font-size:1.05rem; color:#1a202c; }
.usu-mbody { padding:20px 24px; }
.usu-mclose {
  background:#f7fafc; border:none; border-radius:8px; width:32px; height:32px;
  display:flex; align-items:center; justify-content:center; cursor:pointer; color:#718096;
}
.usu-mclose:hover { background:#edf2f7; color:#1a202c; }

.usu-avatar {
  width:60px; height:60px; border-radius:50%;
  background:linear-gradient(135deg,#667eea,#764ba2);
  display:flex; align-items:center; justify-content:center;
  color:white; font-size:1.5rem; font-weight:700; margin:0 auto 16px; flex-shrink:0;
}
.usu-profile-row { display:flex; align-items:center; gap:16px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #f0f4f8; }
.usu-profile-info h4 { margin:0 0 4px; font-size:1.1rem; color:#1a202c; }
.usu-profile-info p { margin:0; font-size:.85rem; color:#718096; }

.usu-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.usu-field { display:flex; flex-direction:column; gap:5px; }
.usu-field.full { grid-column:1/-1; }
.usu-field label { font-size:.75rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; }
.usu-field input, .usu-field select {
  padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.9rem; font-family:inherit; background:#f8fafc;
}
.usu-field input:focus, .usu-field select:focus { outline:none; border-color:#667eea; background:white; }

.usu-toggle-row { display:flex; gap:10px; }
.usu-toggle {
  flex:1; padding:9px; border:2px solid #e2e8f0; border-radius:8px; cursor:pointer;
  font-family:inherit; font-size:.82rem; font-weight:600; background:#f8fafc; transition:all .2s;
  display:flex; align-items:center; justify-content:center; gap:5px;
}
.usu-toggle.active-admin { border-color:#7c3aed; background:#ede9fe; color:#5b21b6; }
.usu-toggle.active-cliente { border-color:#1d4ed8; background:#dbeafe; color:#1e40af; }
.usu-toggle.active-verif { border-color:#15803d; background:#dcfce7; color:#15803d; }
.usu-toggle.active-noverif { border-color:#b91c1c; background:#fee2e2; color:#b91c1c; }

.usu-section-title { font-size:.8rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.5px; margin:20px 0 10px; }

.usu-orders-mini { display:flex; flex-direction:column; gap:6px; }
.usu-order-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:9px 12px; background:#f8fafc; border-radius:8px; border:1px solid #f0f4f8;
}
.usu-order-id { font-size:.82rem; font-weight:700; color:#667eea; }
.usu-order-date { font-size:.75rem; color:#a0aec0; margin-top:1px; }
.usu-order-total { font-weight:700; color:#1a202c; font-size:.88rem; }

.usu-danger { margin-top:20px; padding-top:20px; border-top:1px solid #fee2e2; }
.usu-danger-title { font-size:.78rem; font-weight:700; color:#b91c1c; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; }
.usu-danger-btns { display:flex; gap:8px; flex-wrap:wrap; }
.usu-dbtn {
  padding:8px 14px; border-radius:8px; border:none; cursor:pointer;
  font-family:inherit; font-size:.82rem; font-weight:600;
  display:flex; align-items:center; gap:5px; transition:all .2s;
}
.usu-dbtn-unlock { background:#dcfce7; color:#15803d; }
.usu-dbtn-unlock:hover { background:#bbf7d0; }
.usu-dbtn-reset { background:#fef3c7; color:#b45309; }
.usu-dbtn-reset:hover { background:#fde68a; }
.usu-dbtn-deact { background:#fee2e2; color:#b91c1c; }
.usu-dbtn-deact:hover { background:#fecaca; }
.usu-dbtn:disabled { opacity:.5; cursor:not-allowed; }

.usu-save-row { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid #f0f4f8; }
.usu-spinner { display:flex; align-items:center; justify-content:center; padding:60px; }
.spinning { animation:spin .9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.usu-toast {
  position:fixed; bottom:24px; right:24px; z-index:9999;
  background:#1a202c; color:white; padding:12px 20px; border-radius:10px;
  font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600;
  box-shadow:0 8px 24px rgba(0,0,0,0.2); animation:slideIn .3s ease;
}
.usu-toast.ok { background:#276749; }
.usu-toast.err { background:#9b2c2c; }
@keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
`;
export default CSS;
