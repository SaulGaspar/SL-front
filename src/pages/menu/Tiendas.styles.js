const CSS = `
  .st-page {
    --st-ink:#0a1a2f; --st-muted:#687587; --st-paper:#f5f7f4;
    --st-card:#fff; --st-line:rgba(10,26,47,.11);
    --st-blue:#244fdb; --st-acid:#bde632;
    min-height:100vh; background:var(--st-paper); color:var(--st-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }
  body[data-bs-theme="dark"] .st-page {
    --st-ink:#f3f6fa; --st-muted:#a6b1c0; --st-paper:#09131f;
    --st-card:#101d2b; --st-line:rgba(255,255,255,.11); --st-blue:#82a2ff;
  }
  .st-page *,.st-page *::before,.st-page *::after { box-sizing:border-box; }
  .st-shell { width:min(1100px,calc(100% - 40px)); margin-inline:auto; }
  .st-hero {
    position:relative; padding:48px 0 106px; overflow:hidden;
    color:#fff; background:#0a1a2f;
  }
  .st-hero::after {
    content:""; position:absolute; width:340px; height:340px;
    right:7%; top:-230px; border:54px solid var(--st-acid); border-radius:50%;
  }
  .st-back {
    min-height:42px; display:inline-flex; align-items:center; gap:8px;
    padding:0 15px; border:1px solid rgba(255,255,255,.16);
    border-radius:999px; color:rgba(255,255,255,.8);
    background:rgba(255,255,255,.05); text-decoration:none;
    font-size:.82rem; font-weight:600;
  }
  .st-hero-copy { position:relative; z-index:1; max-width:760px; margin-top:62px; }
  .st-eyebrow {
    display:block; margin-bottom:14px; color:var(--st-acid);
    font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
  }
  .st-title {
    margin:0; color:#fff; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:.96; letter-spacing:-.06em;
  }
  .st-lead {
    max-width:620px; margin:20px 0 0; color:rgba(255,255,255,.64);
    font-size:1rem; line-height:1.7;
  }
  .st-content {
    position:relative; z-index:2; margin-top:-48px; padding-bottom:90px;
  }
  .st-panel {
    padding:clamp(26px,5vw,48px); border:1px solid var(--st-line);
    border-radius:26px; background:var(--st-card);
    box-shadow:0 20px 55px rgba(10,26,47,.08);
  }
  .st-panel-head {
    display:flex; align-items:end; justify-content:space-between;
    gap:26px; margin-bottom:28px;
  }
  .st-panel-head h2 {
    margin:0; color:var(--st-ink); font-size:clamp(1.7rem,3vw,2.35rem);
    font-weight:750; letter-spacing:-.045em;
  }
  .st-panel-head p {
    max-width:390px; margin:0; color:var(--st-muted);
    font-size:.87rem; line-height:1.6;
  }
  .st-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .st-location { margin-bottom:24px; padding:20px; border:1px solid var(--st-line); border-radius:18px; background:var(--st-paper); }
  .st-location h3 { margin:0 0 8px; color:var(--st-ink); font-size:1.1rem; }
  .st-location p { margin:8px 0; color:var(--st-muted); font-size:.85rem; line-height:1.6; }
  .st-location button { padding:12px 18px; border:0; border-radius:12px; background:#244fdb; color:white; font:inherit; font-weight:700; cursor:pointer; }
  .st-location button:disabled { opacity:.6; cursor:wait; }
  .st-location button:focus-visible { outline:3px solid var(--st-acid); outline-offset:3px; }
  .st-location .st-location-error { color:var(--st-ink); font-weight:600; }
  .st-card {
    position:relative; min-height:220px; display:flex;
    flex-direction:column; justify-content:space-between; padding:24px;
    border:1px solid var(--st-line); border-radius:18px;
    background:var(--st-paper); color:var(--st-ink); text-decoration:none;
    transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
  }
  .st-card:hover {
    transform:translateY(-4px); border-color:rgba(36,79,219,.3);
    box-shadow:0 16px 34px rgba(10,26,47,.09);
  }
  .st-card-top { display:flex; align-items:center; justify-content:space-between; }
  .st-index {
    color:var(--st-blue); font-size:.7rem; font-weight:750;
    letter-spacing:.12em;
  }
  .st-pin {
    width:44px; height:44px; display:grid; place-items:center;
    border-radius:13px; background:rgba(36,79,219,.09);
    color:var(--st-blue); font-size:1.1rem;
  }
  .st-zone {
    margin:0 0 7px; color:var(--st-ink);
    font-size:1.15rem; font-weight:750; letter-spacing:-.025em;
  }
  .st-address { margin:0; color:var(--st-muted); font-size:.82rem; line-height:1.55; }
  .st-open {
    display:inline-flex; align-items:center; gap:8px; margin-top:15px;
    color:var(--st-blue); font-size:.76rem; font-weight:700;
  }
  .st-note {
    display:flex; align-items:center; justify-content:space-between;
    gap:20px; margin-top:18px; padding:20px 22px;
    border-radius:16px; background:#0a1a2f; color:rgba(255,255,255,.66);
    font-size:.82rem; line-height:1.55;
  }
  .st-note strong { color:#fff; }
  .st-note a {
    flex:0 0 auto; padding:9px 13px; border-radius:10px;
    background:var(--st-acid); color:#0a1a2f; text-decoration:none;
    font-size:.74rem; font-weight:750;
  }
  .st-back:focus-visible,.st-card:focus-visible,.st-note a:focus-visible {
    outline:3px solid var(--st-acid); outline-offset:3px;
  }
  @media(max-width:700px) {
    .st-shell { width:min(100% - 24px,1100px); }
    .st-hero { padding:28px 0 76px; }
    .st-hero-copy { margin-top:48px; }
    .st-content { margin-top:-34px; padding-bottom:60px; }
    .st-panel { border-radius:20px; }
    .st-panel-head { display:block; }
    .st-panel-head p { margin-top:12px; }
    .st-grid { grid-template-columns:1fr; }
    .st-card { min-height:190px; }
    .st-note { align-items:flex-start; flex-direction:column; }
  }
`;
export default CSS;
