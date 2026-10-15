const CSS = `
  .promo-wrap { font-family:'DM Sans',sans-serif; }
  .promo-header { display:flex; align-items:center; justify-content:space-between; gap:18px; }
  .promo-primary,.promo-secondary {
    border:0; border-radius:10px; padding:11px 17px; font-weight:700; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
  }
  .promo-primary { background:#1e3a5f; color:white; }
  .promo-primary:hover { background:#2c5282; }
  .promo-primary:disabled { opacity:.6; cursor:not-allowed; }
  .promo-secondary { background:white; color:#1e3a5f; border:1px solid #cbd5e0; }
  .promo-alert { padding:12px 16px; border-radius:10px; margin-bottom:16px; font-weight:600; }
  .promo-alert.success { background:#f0fff4; color:#276749; border:1px solid #9ae6b4; }
  .promo-alert.warning { background:#fffaf0; color:#975a16; border:1px solid #fbd38d; }
  .promo-alert.error { background:#fff5f5; color:#c53030; border:1px solid #feb2b2; }
  .promo-toolbar {
    background:white; border-radius:12px; padding:14px 18px; margin-bottom:18px;
    display:flex; align-items:center; justify-content:space-between; color:#718096;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  .promo-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:18px; }
  .promo-card { background:white; border-radius:14px; padding:20px; box-shadow:0 2px 9px rgba(0,0,0,.06); border-top:4px solid #c6f62d; }
  .promo-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .promo-discount { font-size:1.6rem; font-weight:800; color:#1e3a5f; }
  .promo-status { padding:4px 10px; border-radius:20px; font-size:.76rem; font-weight:700; }
  .promo-status.active { background:#c6f6d5; color:#276749; }
  .promo-status.inactive { background:#edf2f7; color:#4a5568; }
  .promo-status.draft { background:#fefcbf; color:#975a16; }
  .promo-card h3 { color:#1e3a5f; margin:14px 0 7px; }
  .promo-card>p { color:#718096; min-height:48px; }
  .promo-meta { display:flex; flex-direction:column; gap:6px; font-size:.83rem; color:#718096; padding:13px 0; border-top:1px solid #edf2f7; border-bottom:1px solid #edf2f7; }
  .promo-meta strong { color:#4a5568; }
  .promo-actions { display:flex; gap:8px; margin-top:14px; }
  .promo-actions button,.promo-close {
    width:40px; height:38px; border:1px solid #cbd5e0; border-radius:9px;
    background:white; color:#2c5282; cursor:pointer; font-size:1.25rem;
    display:flex; align-items:center; justify-content:center;
  }
  .promo-actions button:disabled { opacity:.35; cursor:not-allowed; }
  .promo-actions button.danger { color:#c53030; margin-left:auto; }
  .promo-empty {
    background:white; border-radius:16px; padding:58px 30px; text-align:center; color:#718096;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  .promo-empty svg { color:#667eea; }
  .promo-empty h3 { color:#1e3a5f; margin:12px 0 6px; }
  .promo-modal-backdrop {
    position:fixed; inset:0; background:rgba(15,23,42,.58); z-index:2000;
    display:flex; align-items:center; justify-content:center; padding:22px;
  }
  .promo-modal { background:white; border-radius:16px; width:min(760px,100%); max-height:92vh; overflow:auto; box-shadow:0 24px 70px rgba(0,0,0,.25); }
  .promo-modal-header { padding:20px 22px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; gap:16px; }
  .promo-modal-header h3 { margin:0 0 5px; color:#1e3a5f; }
  .promo-modal-header p { margin:0; color:#718096; font-size:.88rem; }
  .promo-form { padding:22px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .promo-form label { display:flex; flex-direction:column; gap:6px; color:#4a5568; font-weight:700; font-size:.84rem; }
  .promo-form .full { grid-column:1/-1; }
  .promo-form input,.promo-form textarea,.promo-form select {
    border:1px solid #cbd5e0; border-radius:9px; padding:10px 12px; color:#1a202c;
    font:500 .94rem 'DM Sans',sans-serif; background:white;
  }
  .promo-form input:focus,.promo-form textarea:focus,.promo-form select:focus {
    outline:none; border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,.14);
  }
  .promo-form input:disabled { background:#edf2f7; }
  .promo-form-actions { display:flex; justify-content:flex-end; gap:10px; padding-top:4px; }
  @media(max-width:700px) {
    .promo-header { align-items:flex-start; flex-direction:column; }
    .promo-form { grid-template-columns:1fr; }
    .promo-form .full { grid-column:auto; }
  }
`;
export default CSS;
