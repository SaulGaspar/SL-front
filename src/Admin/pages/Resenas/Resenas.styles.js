const CSS = `
  .rv-page { font-family:'DM Sans',sans-serif; color:#172b4d; }
  .rv-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:22px; border-radius:14px; background:#fff; box-shadow:0 2px 9px rgba(0,0,0,.06); }
  .rv-head h2 { margin:0 0 5px; font-size:1.45rem; }.rv-head p { margin:0; color:#718096; }
  .rv-refresh,.rv-action { border:0; border-radius:8px; padding:9px 12px; cursor:pointer; font:inherit; font-weight:700; display:inline-flex; align-items:center; gap:6px; }
  .rv-refresh { background:#edf2f7; color:#2d3748; }.rv-refresh:disabled,.rv-action:disabled { opacity:.55; cursor:not-allowed; }
  .rv-tabs { display:flex; gap:8px; flex-wrap:wrap; margin:20px 0; }.rv-tab { border:1px solid #dbe3ec; border-radius:999px; background:#fff; padding:8px 12px; cursor:pointer; font-weight:700; color:#526176; }.rv-tab.active { background:#1e3a5f; border-color:#1e3a5f; color:#fff; }
  .rv-list { display:grid; gap:12px; }.rv-card { padding:18px; border-radius:14px; background:#fff; box-shadow:0 2px 9px rgba(0,0,0,.05); }.rv-row { display:flex; justify-content:space-between; gap:18px; }.rv-name { font-weight:800; }.rv-product { color:#2c5282; font-size:.9rem; margin-top:4px; }.rv-stars { color:#d69e2e; letter-spacing:1px; }.rv-date { color:#8a98aa; font-size:.8rem; white-space:nowrap; }.rv-comment { color:#4a5568; line-height:1.55; white-space:pre-wrap; }.rv-notes { width:100%; min-height:58px; box-sizing:border-box; border:1px solid #dbe3ec; border-radius:8px; padding:9px; font:inherit; resize:vertical; }.rv-actions { display:flex; gap:8px; margin-top:12px; }.rv-action.approve { color:#fff; background:#276749; }.rv-action.reject { color:#9b2c2c; background:#fff5f5; border:1px solid #feb2b2; }.rv-empty,.rv-error { padding:30px; text-align:center; border-radius:12px; background:#fff; color:#718096; }.rv-error { color:#9b2c2c; }
  @media(max-width:620px) { .rv-head,.rv-row { display:grid; }.rv-date { white-space:normal; } }
`;
export default CSS;
