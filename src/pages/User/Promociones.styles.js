const CSS = `
  .customer-promotions { max-width:1200px; margin:0 auto; padding:28px 10px 60px; }
  .customer-promotions-hero {
    border-radius:22px; padding:48px 28px; text-align:center; color:white;
    background:linear-gradient(135deg,#071a31,#1e3a5f);
    box-shadow:0 18px 45px rgba(7,26,49,.18); margin-bottom:28px;
  }
  .customer-promotions-hero>span {
    display:inline-flex; align-items:center; gap:7px; color:#c6f62d; font-weight:800;
    text-transform:uppercase; letter-spacing:1px; font-size:.82rem;
  }
  .customer-promotions-hero h1 { font-size:clamp(2rem,5vw,3.4rem); margin:12px 0 8px; font-weight:900; }
  .customer-promotions-hero p { margin:0; color:#d7e0ec; font-size:1.05rem; }
  .evergreen-promotions {
    border-radius:20px; padding:30px; margin-bottom:30px;
    background:linear-gradient(135deg,#f8fafc,#edf4fb); border:1px solid #dbe5f0;
  }
  .evergreen-heading { text-align:center; max-width:700px; margin:0 auto 24px; }
  .evergreen-heading>span,.seasonal-heading>div>span {
    color:#2c5282; text-transform:uppercase; letter-spacing:1px; font-size:.76rem; font-weight:900;
  }
  .evergreen-heading h2,.seasonal-heading h2 { color:#071a31; margin:7px 0; font-weight:900; }
  .evergreen-heading p { color:#64748b; margin:0; }
  .evergreen-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
  .evergreen-card {
    position:relative; overflow:hidden; display:flex; align-items:center; gap:20px;
    min-height:210px; padding:26px; border-radius:18px; color:white;
    box-shadow:0 16px 34px rgba(7,26,49,.15);
  }
  .evergreen-card::after {
    content:""; position:absolute; width:180px; height:180px; border-radius:50%;
    right:-70px; top:-80px; background:rgba(255,255,255,.09);
  }
  .evergreen-card.duo { background:linear-gradient(135deg,#071a31,#1e3a5f); }
  .evergreen-card.wholesale { background:linear-gradient(135deg,#1e3a5f,#2c5282); }
  .evergreen-number {
    width:92px; height:92px; border-radius:22px; display:grid; place-items:center;
    flex-shrink:0; background:#c6f62d; color:#071a31; font-size:2.45rem; font-weight:950;
    box-shadow:0 10px 25px rgba(0,0,0,.18);
  }
  .evergreen-card-content { position:relative; z-index:1; }
  .evergreen-card-content>span { color:#c6f62d; font-size:.76rem; font-weight:900; text-transform:uppercase; letter-spacing:.8px; }
  .evergreen-card-content h3 { margin:6px 0; font-size:1.35rem; font-weight:900; }
  .evergreen-card-content p { color:#d7e0ec; margin:0; line-height:1.48; }
  .evergreen-card-content a {
    display:inline-block; margin-top:15px; padding:9px 14px; border-radius:9px;
    background:white; color:#071a31; font-weight:900; text-decoration:none;
  }
  .seasonal-promotions { margin-top:4px; }
  .seasonal-heading {
    display:flex; justify-content:space-between; align-items:flex-end; gap:18px; margin-bottom:17px;
  }
  .seasonal-heading h2 { margin-bottom:0; }
  .seasonal-heading>a { color:#1e3a5f; font-weight:900; text-decoration:none; }
  .customer-promotions-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }
  .customer-promotion-card {
    position:relative; background:white; border-radius:18px; overflow:hidden;
    border:1px solid #e2e8f0; box-shadow:0 9px 28px rgba(15,23,42,.08);
  }
  .customer-promotion-badge {
    background:#c6f62d; color:#071a31; text-align:center; font-size:2.2rem;
    font-weight:900; padding:19px;
  }
  .customer-promotion-body { padding:22px; }
  .customer-promotion-scope {
    color:#2c5282; text-transform:uppercase; font-size:.76rem; font-weight:800; letter-spacing:.7px;
  }
  .customer-promotion-body h2 { color:#071a31; margin:8px 0; font-size:1.35rem; }
  .customer-promotion-body p { color:#64748b; line-height:1.55; min-height:72px; }
  .customer-promotion-date { display:flex; align-items:center; gap:7px; color:#64748b; font-size:.84rem; border-top:1px solid #edf2f7; padding-top:14px; }
  .customer-promotion-body a,.customer-promotions-state a {
    display:inline-block; margin-top:17px; background:#071a31; color:white; text-decoration:none;
    border-radius:10px; padding:10px 16px; font-weight:800;
  }
  .customer-promotions-state {
    background:white; border-radius:18px; padding:58px 28px; text-align:center; color:#64748b;
    border:1px solid #e2e8f0;
  }
  .customer-promotions-state.compact { padding:38px 28px; }
  .customer-promotions-state svg { color:#2c5282; }
  .customer-promotions-state h2 { color:#071a31; margin:12px 0 7px; }
  .customer-promotions-state.error { color:#c53030; background:#fff5f5; border-color:#feb2b2; }
  body[data-bs-theme="dark"] .evergreen-promotions { background:linear-gradient(135deg,#111c2c,#0d1725); border-color:#2b3b50; }
  body[data-bs-theme="dark"] .evergreen-heading>span,body[data-bs-theme="dark"] .seasonal-heading>div>span { color:#bde632; }
  body[data-bs-theme="dark"] .evergreen-heading h2,body[data-bs-theme="dark"] .seasonal-heading h2,body[data-bs-theme="dark"] .customer-promotion-body h2,body[data-bs-theme="dark"] .customer-promotions-state h2 { color:#f4f7fb; }
  body[data-bs-theme="dark"] .evergreen-heading p,body[data-bs-theme="dark"] .customer-promotion-body p,body[data-bs-theme="dark"] .customer-promotion-date,body[data-bs-theme="dark"] .customer-promotions-state { color:#b8c3d1; }
  body[data-bs-theme="dark"] .seasonal-heading>a { color:#9bbcff; }
  body[data-bs-theme="dark"] .customer-promotion-card,body[data-bs-theme="dark"] .customer-promotions-state { background:#162235; border-color:#2b3b50; }
  body[data-bs-theme="dark"] .customer-promotion-scope { color:#9bbcff; }
  body[data-bs-theme="dark"] .customer-promotion-date { border-color:#2b3b50; }
  body[data-bs-theme="dark"] .customer-promotions-state.error { background:#31191c; color:#ffb4b4; border-color:#743337; }
  @media(max-width:800px) {
    .evergreen-grid { grid-template-columns:1fr; }
    .evergreen-card { min-height:auto; }
  }
  @media(max-width:520px) {
    .evergreen-promotions { padding:20px 14px; }
    .evergreen-card { align-items:flex-start; flex-direction:column; }
    .evergreen-number { width:72px; height:72px; border-radius:18px; font-size:2rem; }
    .seasonal-heading { align-items:flex-start; flex-direction:column; }
  }
`;
export default CSS;
