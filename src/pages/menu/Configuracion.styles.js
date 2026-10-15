const CSS = `
  .cfg-page {
    --cfg-ink:#0a1a2f;
    --cfg-muted:#667386;
    --cfg-paper:#f5f7f4;
    --cfg-card:#ffffff;
    --cfg-line:rgba(10,26,47,.11);
    --cfg-blue:#244fdb;
    --cfg-acid:#bde632;
    min-height:calc(100vh - 120px);
    padding:48px 20px 80px;
    background:
      radial-gradient(circle at 90% 4%, rgba(36,79,219,.10), transparent 24rem),
      radial-gradient(circle at 8% 88%, rgba(189,230,50,.28), transparent 22rem),
      var(--cfg-paper);
    color:var(--cfg-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }

  body[data-bs-theme="dark"] .cfg-page {
    --cfg-ink:#f3f6fa;
    --cfg-muted:#a6b1c0;
    --cfg-paper:#09131f;
    --cfg-card:#101d2b;
    --cfg-line:rgba(255,255,255,.11);
    --cfg-blue:#86a5ff;
  }

  .cfg-page *,
  .cfg-page *::before,
  .cfg-page *::after { box-sizing:border-box; }

  .cfg-wrap {
    width:min(1100px,100%);
    margin:0 auto;
  }

  .cfg-hero {
    position:relative;
    overflow:hidden;
    padding:clamp(34px,6vw,66px);
    border-radius:32px;
    color:#fff;
    background:
      radial-gradient(circle at 92% -15%, rgba(189,230,50,.48), transparent 14rem),
      linear-gradient(145deg,#07182d,#102b4d);
    box-shadow:0 26px 70px rgba(10,26,47,.14);
  }

  .cfg-breadcrumb {
    position:relative;
    display:flex;
    gap:8px;
    align-items:center;
    flex-wrap:wrap;
    margin-bottom:34px;
    color:rgba(255,255,255,.55);
    font-size:.86rem;
    font-weight:700;
  }

  .cfg-breadcrumb a {
    color:rgba(255,255,255,.8);
    text-decoration:none;
  }

  .cfg-kicker {
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-bottom:14px;
    color:var(--cfg-acid);
    font-size:.72rem;
    font-weight:850;
    letter-spacing:.16em;
    text-transform:uppercase;
  }

  .cfg-title {
    max-width:720px;
    margin:0;
    font-size:clamp(2.7rem,7vw,5.6rem);
    line-height:.92;
    font-weight:950;
    letter-spacing:-.075em;
  }

  .cfg-subtitle {
    max-width:620px;
    margin:22px 0 0;
    color:rgba(255,255,255,.68);
    font-size:1rem;
    line-height:1.75;
  }

  .cfg-layout {
    display:grid;
    grid-template-columns:minmax(0,1fr) 330px;
    gap:22px;
    margin-top:24px;
  }

  .cfg-panel,
  .cfg-summary {
    border:1px solid var(--cfg-line);
    border-radius:28px;
    background:var(--cfg-card);
    box-shadow:0 18px 44px rgba(10,26,47,.08);
  }

  .cfg-panel {
    padding:clamp(24px,4vw,36px);
  }

  .cfg-section-head {
    display:flex;
    justify-content:space-between;
    gap:18px;
    align-items:flex-start;
    margin-bottom:24px;
  }

  .cfg-section-head h2 {
    margin:0;
    color:var(--cfg-ink);
    font-size:clamp(1.6rem,3vw,2.2rem);
    font-weight:900;
    letter-spacing:-.045em;
  }

  .cfg-section-head p {
    max-width:420px;
    margin:7px 0 0;
    color:var(--cfg-muted);
    line-height:1.6;
    font-size:.9rem;
  }

  .cfg-saved {
    display:inline-flex;
    align-items:center;
    gap:8px;
    min-height:36px;
    padding:0 12px;
    border-radius:999px;
    background:#e9f8ef;
    color:#23864b;
    font-size:.78rem;
    font-weight:850;
    white-space:nowrap;
  }

  body[data-bs-theme="dark"] .cfg-saved {
    background:rgba(35,134,75,.16);
    color:#7be09d;
  }

  .cfg-list {
    display:grid;
    gap:12px;
  }

  .cfg-row {
    display:grid;
    grid-template-columns:48px minmax(0,1fr) auto;
    gap:14px;
    align-items:center;
    padding:17px;
    border:1px solid var(--cfg-line);
    border-radius:20px;
    background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.42));
  }

  body[data-bs-theme="dark"] .cfg-row {
    background:rgba(255,255,255,.04);
  }

  .cfg-row-icon {
    width:48px;
    height:48px;
    display:grid;
    place-items:center;
    border-radius:17px;
    background:rgba(36,79,219,.08);
    color:var(--cfg-blue);
    font-size:1.3rem;
  }

  .cfg-row-title {
    color:var(--cfg-ink);
    font-weight:900;
    letter-spacing:-.02em;
  }

  .cfg-row-desc {
    margin-top:3px;
    color:var(--cfg-muted);
    font-size:.82rem;
    line-height:1.45;
  }

  .cfg-select {
    min-width:150px;
    min-height:44px;
    border:1px solid var(--cfg-line);
    border-radius:14px;
    padding:0 12px;
    background:var(--cfg-card);
    color:var(--cfg-ink);
    font:inherit;
    font-weight:750;
  }

  .cfg-switch {
    position:relative;
    width:62px;
    height:34px;
    display:inline-block;
  }

  .cfg-switch input {
    position:absolute;
    inset:0;
    opacity:0;
  }

  .cfg-slider {
    position:absolute;
    inset:0;
    border-radius:999px;
    background:#d9e1ec;
    cursor:pointer;
    transition:.2s;
  }

  .cfg-slider::before {
    content:"";
    position:absolute;
    width:26px;
    height:26px;
    left:4px;
    top:4px;
    border-radius:50%;
    background:#fff;
    box-shadow:0 3px 10px rgba(10,26,47,.18);
    transition:.2s;
  }

  .cfg-switch input:checked + .cfg-slider {
    background:#244fdb;
  }

  .cfg-switch input:checked + .cfg-slider::before {
    transform:translateX(28px);
  }

  .cfg-theme-options { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; width:min(100%,360px); }
  .cfg-theme-option { border:1px solid var(--cfg-line); border-radius:13px; padding:10px 8px; background:var(--cfg-card); color:var(--cfg-muted); font:inherit; font-size:.76rem; font-weight:800; cursor:pointer; }
  .cfg-theme-option.active { border-color:var(--cfg-blue); background:rgba(36,79,219,.09); color:var(--cfg-blue); box-shadow:0 0 0 2px rgba(36,79,219,.10); }

  .cfg-save {
    width:100%;
    min-height:54px;
    margin-top:20px;
    border:0;
    border-radius:16px;
    background:#244fdb;
    color:#fff;
    font-size:.92rem;
    font-weight:900;
    cursor:pointer;
    box-shadow:0 14px 28px rgba(36,79,219,.22);
  }
  .cfg-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:20px; }
  .cfg-action { min-height:46px; padding:0 15px; border:1px solid var(--cfg-line); border-radius:14px; background:var(--cfg-card); color:var(--cfg-ink); font:inherit; font-size:.84rem; font-weight:800; cursor:pointer; }
  .cfg-action.primary { background:#244fdb; color:#fff; border-color:#244fdb; }
  .cfg-action.danger { color:#b42318; }

  .cfg-summary {
    position:sticky;
    top:94px;
    align-self:start;
    padding:24px;
  }

  .cfg-summary-badge {
    width:68px;
    height:68px;
    display:grid;
    place-items:center;
    margin-bottom:18px;
    border-radius:24px;
    background:#0a1a2f;
    color:var(--cfg-acid);
    font-size:1.6rem;
    font-weight:900;
  }

  .cfg-summary h3 {
    margin:0;
    color:var(--cfg-ink);
    font-size:1.35rem;
    font-weight:900;
    letter-spacing:-.035em;
  }

  .cfg-summary p {
    margin:10px 0 0;
    color:var(--cfg-muted);
    font-size:.88rem;
    line-height:1.65;
  }

  .cfg-summary-list {
    display:grid;
    gap:10px;
    margin-top:22px;
  }

  .cfg-summary-item {
    display:flex;
    justify-content:space-between;
    gap:12px;
    padding:11px 0;
    border-top:1px solid var(--cfg-line);
    color:var(--cfg-muted);
    font-size:.82rem;
    font-weight:750;
  }

  .cfg-summary-item strong {
    color:var(--cfg-ink);
  }

  @media(max-width:860px) {
    .cfg-layout { grid-template-columns:1fr; }
    .cfg-summary { position:static; }
  }

  @media(max-width:560px) {
    .cfg-page { padding:24px 12px 54px; }
    .cfg-hero { border-radius:24px; padding:30px 22px; }
    .cfg-layout { margin-top:14px; }
    .cfg-section-head { flex-direction:column; }
    .cfg-row { grid-template-columns:42px minmax(0,1fr); }
    .cfg-row-icon { width:42px; height:42px; border-radius:15px; }
    .cfg-row-control { grid-column:1/-1; justify-self:stretch; display:flex; justify-content:flex-end; }
    .cfg-select { width:100%; }
  }
`;
export default CSS;
