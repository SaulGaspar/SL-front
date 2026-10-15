const CSS = `
  .mp-page * { box-sizing:border-box; }
  .mp-page { min-height:calc(100vh - 150px); background:#f3f6fa; padding:38px 20px 70px; color:#0b2545; }
  .mp-wrap { width:min(1080px,100%); margin:0 auto; }
  .mp-breadcrumb { display:flex; gap:8px; align-items:center; margin-bottom:20px; font-size:.82rem; color:#8795a8; }
  .mp-breadcrumb button { border:0; padding:0; background:transparent; color:#2468a2; cursor:pointer; font-weight:700; }
  .mp-grid { display:grid; grid-template-columns:minmax(0,1fr) 390px; gap:24px; align-items:start; }
  .mp-card { background:white; border:1px solid #e0e7ef; border-radius:18px; box-shadow:0 12px 36px rgba(13,39,68,.08); }
  .mp-checkout { padding:32px; overflow:hidden; position:relative; }
  .mp-checkout::after { content:""; position:absolute; width:240px; height:240px; border-radius:50%; right:-110px; top:-105px; background:rgba(0,158,227,.07); pointer-events:none; }
  .mp-kicker { display:inline-flex; align-items:center; gap:8px; color:#087db6; background:#eaf8ff; border-radius:999px; padding:6px 11px; font-size:.72rem; font-weight:800; letter-spacing:.6px; }
  .mp-title { margin:17px 0 8px; font-size:1.65rem; font-weight:850; color:#0b2545; }
  .mp-subtitle { margin:0 0 28px; color:#65758a; line-height:1.65; max-width:610px; }
  .mp-pay { width:100%; border:0; border-radius:11px; padding:14px 18px; background:#009ee3; color:white; font-size:1rem; font-weight:850; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; transition:transform .16s,background .16s; }
  .mp-pay:hover { background:#087db6; transform:translateY(-1px); }
  .mp-pay:disabled { opacity:.55; cursor:not-allowed; transform:none; }
  .mp-back { width:100%; border:1px solid #ccd7e4; border-radius:11px; padding:12px; margin-top:10px; background:white; color:#38516d; font-weight:750; cursor:pointer; }
  .mp-note { display:flex; gap:9px; margin-top:18px; color:#7b8a9d; font-size:.77rem; line-height:1.5; }
  .mp-note i { color:#2f855a; margin-top:1px; }
  .mp-summary { padding:25px; position:sticky; top:22px; }
  .mp-summary h2 { margin:0 0 18px; font-size:1rem; text-transform:uppercase; letter-spacing:.5px; }
  .mp-items { display:flex; flex-direction:column; gap:12px; max-height:330px; overflow:auto; padding-right:3px; }
  .mp-item { display:grid; grid-template-columns:50px minmax(0,1fr) auto; gap:10px; align-items:center; padding-bottom:12px; border-bottom:1px solid #edf1f5; }
  .mp-item img,.mp-item-placeholder { width:50px; height:50px; object-fit:cover; border-radius:9px; background:#eef2f6; }
  .mp-item-placeholder { display:grid; place-items:center; color:#8aa0b7; }
  .mp-item-name { font-size:.84rem; font-weight:750; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mp-item-detail { color:#8a98aa; font-size:.74rem; margin-top:3px; }
  .mp-item-price { color:#1f6b49; font-size:.82rem; font-weight:800; white-space:nowrap; }
  .mp-row { display:flex; justify-content:space-between; gap:15px; margin-top:14px; color:#6b7b8e; font-size:.86rem; }
  .mp-total { border-top:2px solid #e4eaf1; padding-top:15px; margin-top:15px; color:#0b2545; font-weight:800; }
  .mp-total strong { font-size:1.3rem; }
  .mp-alert { border-radius:11px; padding:12px 14px; margin:0 0 18px; font-size:.86rem; font-weight:700; }
  .mp-alert.error { background:#fff4f4; border:1px solid #f4a6a6; color:#a62b2b; }
  .mp-state { width:min(560px,100%); margin:25px auto; padding:42px; text-align:center; }
  .mp-state-icon { width:74px; height:74px; margin:0 auto 18px; border-radius:50%; display:grid; place-items:center; font-size:2rem; }
  .mp-state-icon.success { background:#d9f7e7; color:#24744e; }
  .mp-state-icon.pending { background:#fff4cc; color:#976500; }
  .mp-state-icon.failure { background:#ffe0e0; color:#ad2f2f; }
  .mp-state h1 { font-size:1.55rem; margin:0 0 9px; }
  .mp-state p { color:#6e7d90; line-height:1.65; margin:0 0 22px; }
  .mp-reference { display:inline-block; border-radius:999px; background:#edf5ff; color:#235987; padding:7px 14px; font-size:.8rem; font-weight:750; margin-bottom:20px; }
  .mp-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.45); border-top-color:white; border-radius:50%; animation:mp-spin .75s linear infinite; }
@keyframes mp-spin { to { transform:rotate(360deg); } }
@media(max-width:860px){ .mp-grid{grid-template-columns:1fr;} .mp-summary{position:static;} }
@media(max-width:560px){ .mp-page{padding:22px 12px 50px;} .mp-checkout,.mp-summary,.mp-state{padding:23px 18px;} }

/* ── Visual refresh SportLike ── */
.mp-page {
  background:
    radial-gradient(circle at 88% 4%, rgba(36,79,219,.08), transparent 25rem),
    radial-gradient(circle at 8% 92%, rgba(189,230,50,.2), transparent 22rem),
    #f5f7f4;
  color:#0a1a2f;
  font-family:"Poppins","Segoe UI",sans-serif;
}
.mp-wrap {
  width:min(1120px,100%);
}
.mp-breadcrumb {
  color:#687587;
  font-weight:700;
}
.mp-breadcrumb button {
  color:#244fdb;
}
.mp-grid {
  gap:28px;
}
.mp-card {
  border:1px solid rgba(10,26,47,.1);
  border-radius:28px;
  box-shadow:0 18px 48px rgba(10,26,47,.08);
}
.mp-checkout {
  padding:clamp(28px,4vw,46px);
}
.mp-checkout::after {
  width:260px;
  height:260px;
  border:34px solid rgba(189,230,50,.7);
  background:transparent;
  right:-155px;
  top:-155px;
  border-radius:50%;
}
.mp-kicker {
  color:#244fdb;
  background:rgba(36,79,219,.08);
  letter-spacing:.12em;
  text-transform:uppercase;
}
.mp-title {
  max-width:620px;
  color:#0a1a2f;
  font-size:clamp(2rem,4.4vw,3.8rem);
  line-height:.98;
  font-weight:950;
  letter-spacing:-.065em;
}
.mp-subtitle {
  max-width:640px;
  color:#687587;
}
.mp-pay {
  min-height:54px;
  border-radius:16px;
  background:#244fdb;
  box-shadow:0 14px 28px rgba(36,79,219,.22);
}
.mp-pay:hover {
  background:#183fc2;
}
.mp-back {
  min-height:50px;
  border-radius:16px;
  border-color:rgba(10,26,47,.12);
  color:#0a1a2f;
}
.mp-summary {
  padding:clamp(22px,3vw,30px);
}
.mp-summary h2 {
  color:#0a1a2f;
  font-weight:900;
}
.mp-item img,
.mp-item-placeholder {
  border-radius:15px;
  background:
    radial-gradient(circle at 25% 15%, rgba(189,230,50,.25), transparent 4rem),
    #eef3fb;
}
.mp-total {
  border-top-color:rgba(10,26,47,.1);
  color:#0a1a2f;
}
.mp-state {
  border-radius:30px;
}
.mp-state h1 {
  color:#0a1a2f;
  font-size:clamp(2rem,5vw,3rem);
  font-weight:950;
  letter-spacing:-.055em;
}
.mp-reference {
  background:rgba(36,79,219,.08);
  color:#244fdb;
}
body[data-bs-theme="dark"] .mp-page {
  background:#09131f;
  color:#f3f6fa;
}
body[data-bs-theme="dark"] .mp-card {
  background:#101d2b;
  border-color:rgba(255,255,255,.11);
}
body[data-bs-theme="dark"] .mp-title,
body[data-bs-theme="dark"] .mp-summary h2,
body[data-bs-theme="dark"] .mp-state h1,
body[data-bs-theme="dark"] .mp-total {
  color:#f3f6fa;
}
@media(max-width:560px) {
  .mp-title { font-size:clamp(2.2rem,12vw,3.1rem); }
}
`;
export default CSS;
