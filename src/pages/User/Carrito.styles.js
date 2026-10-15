const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --navy:  #0a1a2f;
  --navy2: #1e3a5f;
  --accent:#c8f03c;
  --white: #ffffff;
  --muted: rgba(255,255,255,.5);
}

.crt { font-family:'Outfit',sans-serif; min-height:100vh; background:#f0f2f5; }

.crt-header {
  background:linear-gradient(135deg,#0a1a2f 0%,#1e3a5f 100%);
  padding:32px 0 28px;
  margin-bottom:32px;
}
.crt-header-inner {
  max-width:1100px; margin:0 auto; padding:0 24px;
  display:flex; align-items:center; justify-content:space-between;
}
.crt-header h1 {
  font-family:'Bebas Neue',sans-serif;
  font-size:2.4rem; letter-spacing:3px; color:white; margin:0;
}
.crt-header-sub { font-size:.85rem; color:rgba(255,255,255,.5); margin-top:4px; }
.crt-body { max-width:1100px; margin:0 auto; padding:0 24px 60px; display:grid; grid-template-columns:1fr 360px; gap:28px; align-items:start; }

.crt-panel { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.07); }
.crt-panel-head {
  padding:18px 24px; border-bottom:1px solid #f0f4f8;
  display:flex; align-items:center; justify-content:space-between;
}
.crt-panel-title { font-size:.88rem; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:.8px; }

.crt-item {
  display:flex; align-items:center; gap:18px;
  padding:20px 24px; border-bottom:1px solid #f5f7fa;
  transition:background .15s;
}
.crt-item:hover { background:#fafbfc; }
.crt-item:last-child { border-bottom:none; }

.crt-item-img {
  width:90px; height:90px; border-radius:12px;
  object-fit:cover; flex-shrink:0;
  background:#f0f4f8; border:1px solid #e2e8f0;
}
.crt-item-info { flex:1; min-width:0; }
.crt-item-name { font-size:.97rem; font-weight:700; color:#1e3a5f; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.crt-item-meta { font-size:.78rem; color:#a0aec0; display:flex; gap:10px; flex-wrap:wrap; }
.crt-item-meta span { display:flex; align-items:center; gap:4px; }
.crt-item-price { font-size:.9rem; font-weight:700; color:#1e3a5f; margin-top:6px; font-family:'Outfit',monospace; }

.crt-qty {
  display:flex; align-items:center; gap:0;
  background:#f0f4f8; border-radius:8px; overflow:hidden;
  border:1px solid #e2e8f0;
}
.crt-qty-btn {
  width:32px; height:32px; border:none; background:transparent;
  font-size:1rem; font-weight:700; cursor:pointer; color:#1e3a5f;
  display:flex; align-items:center; justify-content:center;
  transition:background .15s;
}
.crt-qty-btn:hover { background:#e2e8f0; }
.crt-qty-val { width:32px; text-align:center; font-size:.88rem; font-weight:700; color:#1e3a5f; }

.crt-item-right { display:flex; flex-direction:column; align-items:flex-end; gap:10px; flex-shrink:0; }
.crt-item-subtotal { font-family:'Outfit',monospace; font-size:1.05rem; font-weight:700; color:#276749; }
.crt-remove {
  background:none; border:none; cursor:pointer; color:#a0aec0;
  font-size:.76rem; font-weight:600; display:flex; align-items:center; gap:4px;
  padding:3px 8px; border-radius:6px; transition:all .15s;
}
.crt-remove:hover { color:#e53e3e; background:#fff5f5; }

.crt-empty { padding:80px 24px; text-align:center; }
.crt-empty-icon {
  width:80px; height:80px; background:#f0f4f8; border-radius:20px;
  display:flex; align-items:center; justify-content:center;
  font-size:2rem; margin:0 auto 20px;
}
.crt-empty h3 { color:#1e3a5f; margin:0 0 8px; font-size:1.2rem; }
.crt-empty p  { color:#a0aec0; font-size:.88rem; margin:0 0 24px; }
.crt-empty-btn {
  background:#1e3a5f; color:white; border:none;
  padding:12px 28px; border-radius:10px; font-size:.9rem;
  font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif;
}

.crt-right-col { display:flex; flex-direction:column; gap:16px; position:sticky; top:20px; }

.crt-summary { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.07); }
.crt-summary-head {
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  padding:20px 24px;
}
.crt-summary-head h3 { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:2px; color:white; margin:0 0 2px; }
.crt-summary-head p  { font-size:.76rem; color:rgba(255,255,255,.5); margin:0; }
.crt-summary-body { padding:20px 24px; }

.crt-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; }
.crt-row-lbl { font-size:.85rem; color:#718096; }
.crt-row-val { font-size:.88rem; font-weight:600; color:#2d3748; }
.crt-row-val.green { color:#276749; }
.crt-divider { height:1px; background:#f0f4f8; margin:10px 0; }
.crt-total-row { display:flex; justify-content:space-between; align-items:center; margin-top:6px; }
.crt-total-lbl { font-size:1rem; font-weight:700; color:#1e3a5f; }
.crt-total-val { font-family:'Outfit',monospace; font-size:1.5rem; font-weight:700; color:#1e3a5f; }

.crt-pay-btn {
  width:100%; padding:16px; border:none; border-radius:12px;
  font-family:'Outfit',sans-serif; font-size:1rem; font-weight:700;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  color:white; letter-spacing:.5px; margin-top:6px;
  transition:all .2s;
}
.crt-pay-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(30,58,95,.3); }
.crt-pay-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
.crt-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.45); border-top-color:#fff; border-radius:50%; animation:crt-spin .7s linear infinite; }
@keyframes crt-spin { to { transform:rotate(360deg); } }

.crt-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:12px; font-size:.74rem; color:#a0aec0; }
.crt-address-alert {
  background:#fff5f5; border:1px solid #fc8181; border-radius:10px;
  padding:10px 12px; color:#9b2c2c; font-size:.8rem; margin-bottom:12px;
}
.crt-payment-alert {
  background:#fff5f5; border:1px solid #fc8181; border-radius:10px;
  padding:10px 12px; color:#9b2c2c; font-size:.8rem; margin-top:14px;
}

@media(max-width:900px) {
  .crt-body { grid-template-columns:1fr; }
  .crt-right-col { position:static; }
  .crt-header h1 { font-size:1.8rem; }
}

/* ── NUEVA DIRECCIÓN VISUAL ── */
.crt {
  background:
    radial-gradient(circle at 92% 0%,rgba(49,87,245,.08),transparent 28rem),
    #f5f7f2;
  color:#0b1f33;
}
.crt-header {
  position:relative;
  overflow:hidden;
  margin-bottom:42px;
  padding:56px 0 52px;
  background:#0b1f33;
  border-radius:0 0 34px 34px;
}
.crt-header::after {
  content:""; position:absolute; width:280px; height:280px;
  right:7%; top:-190px; border:48px solid #c7f22b; border-radius:50%;
}
.crt-header-inner { max-width:1180px; position:relative; z-index:1; }
.crt-header h1 {
  font-family:'Outfit',sans-serif;
  font-size:clamp(2.5rem,5vw,4.4rem);
  font-weight:700; letter-spacing:-.06em; line-height:.95;
}
.crt-header-sub {
  max-width:480px; margin-top:12px;
  color:rgba(255,255,255,.62); font-size:.92rem; line-height:1.55;
}
.crt-body {
  max-width:1180px;
  grid-template-columns:minmax(0,1fr) 380px;
  gap:22px; padding-bottom:90px;
}
.crt-panel,.crt-summary {
  border:1px solid rgba(11,31,51,.1);
  border-radius:24px;
  box-shadow:0 12px 35px rgba(11,31,51,.065);
}
.crt-panel-head { min-height:67px; padding:18px 26px; }
.crt-panel-title { color:#0b1f33; font-size:.75rem; letter-spacing:.13em; }
.crt-item { gap:20px; padding:22px 26px; }
.crt-item:hover { background:#f9faf7; }
.crt-item-img {
  width:104px; height:104px; border-radius:18px;
  border:0; background:#f2f4ef;
}
.crt-item-name { color:#0b1f33; font-size:1.02rem; letter-spacing:-.015em; }
.crt-item-meta { color:#7b8795; }
.crt-item-price { color:#637083; font-weight:500; }
.crt-item-subtotal { color:#0b1f33; font-size:1.08rem; }
.crt-qty {
  border:1px solid rgba(11,31,51,.1);
  border-radius:999px; background:#f4f6f2;
}
.crt-qty-btn { width:36px; height:36px; border-radius:50%; }
.crt-remove { border-radius:999px; }
.crt-right-col { top:96px; }
.crt-summary-head {
  position:relative; padding:26px;
  background:#0b1f33;
}
.crt-summary-head h3 {
  font-family:'Outfit',sans-serif; font-size:1.18rem;
  font-weight:700; letter-spacing:-.02em;
}
.crt-summary-head p { margin-top:5px; }
.crt-summary-body { padding:24px 26px 26px; }
.crt-row { padding:10px 0; }
.crt-divider { margin:14px 0; }
.crt-total-val { font-size:1.7rem; color:#0b1f33; letter-spacing:-.04em; }
.crt-pay-btn {
  min-height:54px; border-radius:999px; margin-top:18px;
  background:#3157f5; letter-spacing:0;
}
.crt-pay-btn:hover { box-shadow:0 12px 28px rgba(49,87,245,.28); }
.crt-empty { padding:90px 24px; }
.crt-empty-icon { border-radius:50%; background:#eef1e9; }
.crt-empty-btn { min-height:48px; padding-inline:26px; border-radius:999px; background:#0b1f33; }
.crt-address-alert { margin-top:16px; border-radius:14px; }

@media(max-width:900px) {
  .crt-header { padding:42px 0 38px; margin-bottom:26px; }
  .crt-body { grid-template-columns:1fr; }
  .crt-right-col { position:static; }
}
@media(max-width:620px) {
  .crt-header-inner,.crt-body { padding-inline:14px; }
  .crt-header h1 { font-size:2.7rem; }
  .crt-panel { border-radius:20px; }
  .crt-panel-head { align-items:flex-start; flex-direction:column; gap:7px; }
  .crt-item { display:grid; grid-template-columns:78px 1fr; gap:14px; padding:18px; }
  .crt-item-img { width:78px; height:78px; border-radius:14px; }
  .crt-item-right {
    grid-column:1/-1; display:grid; grid-template-columns:1fr auto auto;
    align-items:center; gap:12px;
  }
  .crt-item-subtotal { justify-self:start; }
  .crt-summary { border-radius:20px; }
}

/* El modo oscuro usa superficies propias: no mezcla tarjetas blancas con el fondo nocturno. */
body[data-bs-theme="dark"] .crt {
  background:
    radial-gradient(circle at 92% 0%, rgba(49,87,245,.16), transparent 30rem),
    #07111f;
  color:#edf3ff;
}
body[data-bs-theme="dark"] .crt-header { background:#0c1b2e; }
body[data-bs-theme="dark"] .crt-panel,
body[data-bs-theme="dark"] .crt-summary {
  background:#111d30;
  border-color:#263650;
  box-shadow:0 14px 36px rgba(0,0,0,.24);
}
body[data-bs-theme="dark"] .crt-panel-head,
body[data-bs-theme="dark"] .crt-item { border-color:#263650; }
body[data-bs-theme="dark"] .crt-item:hover { background:#16243a; }
body[data-bs-theme="dark"] .crt-panel-title,
body[data-bs-theme="dark"] .crt-item-name,
body[data-bs-theme="dark"] .crt-item-subtotal,
body[data-bs-theme="dark"] .crt-total-lbl,
body[data-bs-theme="dark"] .crt-total-val,
body[data-bs-theme="dark"] .crt-empty h3 { color:#f4f8ff; }
body[data-bs-theme="dark"] .crt-item-meta,
body[data-bs-theme="dark"] .crt-item-price,
body[data-bs-theme="dark"] .crt-row-lbl,
body[data-bs-theme="dark"] .crt-row-val,
body[data-bs-theme="dark"] .crt-secure,
body[data-bs-theme="dark"] .crt-empty p { color:#aebed3; }
body[data-bs-theme="dark"] .crt-row-val.green { color:#86efac; }
body[data-bs-theme="dark"] .crt-item-img,
body[data-bs-theme="dark"] .crt-empty-icon,
body[data-bs-theme="dark"] .crt-qty { background:#0b1627; border-color:#30425e; }
body[data-bs-theme="dark"] .crt-qty-btn,
body[data-bs-theme="dark"] .crt-qty-val { color:#edf3ff; }
body[data-bs-theme="dark"] .crt-qty-btn:hover { background:#263650; }
body[data-bs-theme="dark"] .crt-divider { background:#263650; }
body[data-bs-theme="dark"] .crt-remove { color:#aebed3; }
body[data-bs-theme="dark"] .crt-remove:hover { color:#fecaca; background:#3a1f2a; }
body[data-bs-theme="dark"] .crt-address-alert,
body[data-bs-theme="dark"] .crt-payment-alert { background:#3a1f2a; border-color:#a84b5d; color:#fecaca; }
`;
export default CSS;
