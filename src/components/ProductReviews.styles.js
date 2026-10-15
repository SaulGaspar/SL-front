const CSS = `
  .pr { margin-top:34px; padding-top:28px; border-top:1px solid rgba(10,26,47,.12); }
  .pr-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:20px; }
  .pr-title { margin:0; color:var(--text,#0a1a2f); font-size:1.35rem; font-weight:850; }
  .pr-summary { display:flex; align-items:center; gap:8px; color:#687587; font-size:.9rem; }
  .pr-average { color:#0a1a2f; font-size:1.15rem; font-weight:850; }
  .pr-stars { color:#f2ae22; letter-spacing:1px; white-space:nowrap; }
  .pr-form { display:grid; gap:12px; padding:18px; border:1px solid rgba(10,26,47,.1); border-radius:16px; background:#f8fafc; margin-bottom:20px; }
  .pr-form-label { color:#53657a; font-size:.82rem; font-weight:700; }
  .pr-star-buttons { display:flex; gap:6px; }
  .pr-star-button { border:0; background:transparent; padding:0; font-size:1.65rem; color:#cbd5e1; cursor:pointer; }
  .pr-star-button.active { color:#f2ae22; }
  .pr-textarea { min-height:92px; resize:vertical; padding:11px 12px; border:1px solid #d8e0e9; border-radius:11px; font:inherit; color:#0a1a2f; background:#fff; }
  .pr-textarea:focus { outline:3px solid rgba(36,79,219,.16); border-color:#244fdb; }
  .pr-submit { justify-self:start; border:0; border-radius:11px; padding:10px 15px; color:#fff; background:#244fdb; font-weight:750; cursor:pointer; }
  .pr-submit:disabled { opacity:.55; cursor:not-allowed; }
  .pr-note,.pr-message { margin:0; color:#687587; font-size:.82rem; line-height:1.5; }
  .pr-message.error { color:#b42318; }
  .pr-list { display:grid; gap:13px; }
  .pr-review { padding:16px; border:1px solid rgba(10,26,47,.1); border-radius:15px; background:#fff; }
  .pr-review-top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .pr-author { color:#0a1a2f; font-weight:800; font-size:.9rem; }
  .pr-date { color:#8a98aa; font-size:.78rem; }
  .pr-comment { margin:10px 0 0; color:#53657a; white-space:pre-wrap; line-height:1.55; font-size:.9rem; }
  .pr-empty { margin:0; color:#687587; font-size:.9rem; }
  @media(max-width:560px) { .pr-head { display:grid; } .pr-submit { width:100%; } }
`;
export default CSS;
