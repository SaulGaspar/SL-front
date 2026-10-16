const getCSS = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

.sl-cat {
  --navy:   #0a1a2f;
  --navy2:  #1e3a5f;
  --cream:  ${dark ? "#0f172a" : "#f7f5f0"};
  --white:  ${dark ? "#1e293b" : "#ffffff"};
  --muted:  ${dark ? "#94a3b8" : "#8a8f98"};
  --border: ${dark ? "#334155" : "#e4e2dd"};
  --accent: #c8f03c;
  --danger: #e53e3e;
  --warn:   #f59e0b;
  --ok:     #10b981;
  --text:   ${dark ? "#e2e8f0" : "#0a1a2f"};
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  color: var(--text);
}

/* ── BARRA FILTROS ── */
.sl-bar {
  background: var(--navy);
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 0;
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid rgba(255,255,255,.07);
}
.sl-bar-brand { font-family:'Bebas Neue',sans-serif; font-size:1.35rem; color:var(--accent); letter-spacing:3px; margin-right:28px; white-space:nowrap; flex-shrink:0; }
.sl-search-wrap { position:relative; flex:1; max-width:340px; margin-right:12px; }
.sl-search-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); font-size:.9rem; pointer-events:none; }
.sl-input { width:100%; padding:9px 14px 9px 38px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.12); border-radius:8px; color:white; font-family:'Outfit',sans-serif; font-size:.88rem; transition:background .2s,border-color .2s; }
.sl-input::placeholder { color:rgba(255,255,255,.35); }
.sl-input:focus { outline:none; background:rgba(255,255,255,.13); border-color:var(--accent); }
.sl-sel { padding:9px 12px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.12); border-radius:8px; color:rgba(255,255,255,.85); font-family:'Outfit',sans-serif; font-size:.85rem; cursor:pointer; margin-right:10px; }
.sl-sel option { background:var(--navy); color:white; }
.sl-sel:focus { outline:none; border-color:var(--accent); }
.sl-range-pill { display:flex; align-items:center; gap:8px; font-size:.82rem; font-weight:600; margin-right:12px; white-space:nowrap; background:rgba(255,255,255,.07); padding:5px 12px; border-radius:8px; border:1.5px solid rgba(255,255,255,.12); color:rgba(255,255,255,.9); }
.sl-range-pill span { color:var(--accent); font-weight:700; }
.sl-range-pill input[type=range] { width:90px; accent-color:var(--accent); cursor:pointer; }
.sl-clear { margin-left:auto; padding:8px 16px; background:transparent; border:1.5px solid rgba(255,255,255,.2); border-radius:8px; color:rgba(255,255,255,.7); font-family:'Outfit',sans-serif; font-size:.82rem; cursor:pointer; transition:border-color .2s,color .2s; flex-shrink:0; }
.sl-clear:hover { border-color:var(--accent); color:var(--accent); }

/* ── WRAP ── */
.sl-wrap { max-width:1440px; margin:0 auto; padding:36px 32px 72px; }

/* ── INFO BAR ── */
.sl-info-bar { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:28px; }
.sl-count { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; letter-spacing:2px; line-height:1; color:var(--text); }
.sl-count span { font-family:'Outfit',sans-serif; font-size:.85rem; font-weight:400; color:var(--muted); letter-spacing:0; margin-left:6px; }

/* ── GRID ── */
.sl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }

/* ── CARD ── */
.sl-card { background:var(--white); display:flex; flex-direction:column; cursor:pointer; position:relative; overflow:hidden; }
.sl-card:hover { z-index:2; }
.sl-card-img { position:relative; height:300px; overflow:hidden; background:${dark ? "#1e293b" : "#f8f8f8"}; }
.sl-card-img img { width:100%; height:100%; object-fit:contain; object-position:center; padding:12px; transition:transform .5s cubic-bezier(.25,.46,.45,.94); display:block; }
.sl-card:hover .sl-card-img img { transform:scale(1.08); }
.sl-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(10,26,47,.72) 0%,transparent 55%); opacity:0; transition:opacity .3s ease; display:flex; align-items:flex-end; padding:18px; }
.sl-card:hover .sl-card-overlay { opacity:1; }
.sl-card-overlay-btn { width:100%; padding:11px; background:var(--accent); color:var(--navy); border:none; border-radius:6px; font-family:'Outfit',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:.5px; cursor:pointer; transition:background .15s; }
.sl-card-overlay-btn:hover { background:#b5d930; }
.sl-card-overlay-btn:disabled { background:rgba(255,255,255,.3); color:rgba(255,255,255,.5); cursor:not-allowed; }
.sl-badge-wrap { position:absolute; top:12px; left:12px; display:flex; flex-direction:column; gap:5px; }
.sl-badge { display:inline-block; padding:3px 9px; border-radius:3px; font-size:.68rem; font-weight:700; letter-spacing:.8px; text-transform:uppercase; }
.sl-badge-out   { background:var(--danger); color:white; }
.sl-badge-marca { background:var(--navy); color:white; }
.sl-badge-hot   { background:#ff4d00; color:white; animation: sl-pulse-badge 1.8s ease-in-out infinite; }
@keyframes sl-pulse-badge { 0%,100%{opacity:1} 50%{opacity:.65} }

/* ── CARD BODY ── */
.sl-card-body { padding:14px 16px 18px; flex:1; display:flex; flex-direction:column; gap:8px; }
.sl-card-row1 { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.sl-card-name { font-weight:700; font-size:.95rem; color:var(--text); line-height:1.25; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sl-card-price { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; color:var(--text); letter-spacing:1px; white-space:nowrap; margin-left:4px; }
.sl-card-desc { font-size:.78rem; color:var(--muted); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sl-chips-section { display:flex; flex-direction:column; gap:5px; }
.sl-chip-label { font-size:.65rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.sl-chips { display:flex; flex-wrap:wrap; gap:4px; }
.sl-chip { padding:2px 9px; border:1.5px solid var(--border); border-radius:3px; font-size:.72rem; font-weight:600; color:var(--text); background:transparent; }
.sl-color-dot { width:16px; height:16px; border-radius:50%; border:2px solid ${dark ? "#334155" : "white"}; box-shadow:0 0 0 1.5px var(--border); display:inline-block; flex-shrink:0; }

/* ── STOCK INDICATOR ── */
.sl-stock-section { margin-top:2px; display:flex; flex-direction:column; gap:5px; }

.sl-stock-bar-wrap { display:flex; flex-direction:column; gap:3px; }
.sl-stock-bar-track { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
.sl-stock-bar-fill { height:100%; border-radius:2px; transition:width .6s ease; }
.sl-stock-bar-fill.critico  { background:var(--danger); }
.sl-stock-bar-fill.bajo     { background:var(--warn); }
.sl-stock-bar-fill.moderado { background:#3b82f6; }
.sl-stock-bar-fill.ok       { background:var(--ok); }

.sl-stock-msg {
  display:flex;
  align-items:center;
  gap:5px;
  font-size:.72rem;
  font-weight:700;
  letter-spacing:.3px;
  border-radius:4px;
  padding:3px 7px;
}
.sl-stock-msg.critico  { color:#fff; background:var(--danger); }
.sl-stock-msg.bajo     { color:#92400e; background:#fef3c7; }
.sl-stock-msg.moderado { color:${dark?"#bfdbfe":"#1e40af"}; background:${dark?"rgba(59,130,246,.15)":"#eff6ff"}; }
.sl-stock-msg.sin_movimiento { color:var(--muted); }
.sl-stock-msg.agotado  { color:var(--danger); }
.sl-stock-msg .sl-dot  { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.sl-stock-msg.critico .sl-dot  { background:#fff; animation:sl-blink .7s step-start infinite; }
.sl-stock-msg.bajo     .sl-dot { background:var(--warn); }
.sl-stock-msg.moderado .sl-dot { background:#3b82f6; }
@keyframes sl-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.sl-stock-details { display:flex; justify-content:space-between; align-items:center; gap:4px; }
.sl-stock-units  { font-size:.7rem; color:var(--muted); }
.sl-stock-units strong { font-weight:700; color:var(--text); }
.sl-stock-time  { font-size:.68rem; color:var(--muted); text-align:right; }
.sl-stock-time.critico { color:var(--danger); font-weight:700; }
.sl-stock-time.bajo    { color:var(--warn);   font-weight:600; }

.sl-ventas-chip {
  display:inline-flex; align-items:center; gap:4px;
  font-size:.68rem; font-weight:700; color:var(--muted);
  background:var(--cream); border:1px solid var(--border);
  border-radius:3px; padding:2px 7px;
  white-space:nowrap;
}
.sl-ventas-chip.hot { color:#ff4d00; border-color:#ff4d0033; background:${dark?"rgba(255,77,0,.08)":"#fff5f0"}; }

/* ── SKELETON ── */
.sl-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }
.sl-skeleton { background:var(--white); }
.sl-skel-img { height:300px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
.sl-skel-body { padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
.sl-skel-line { height:13px; border-radius:3px; background:linear-gradient(90deg,${dark?"#1e293b":"#eeece8"} 25%,${dark?"#334155":"#e4e2dd"} 50%,${dark?"#1e293b":"#eeece8"} 75%); background-size:200% 100%; animation:sl-shimmer 1.5s infinite; }
@keyframes sl-shimmer { to{background-position:-200% 0} }

/* ── EMPTY / ERROR ── */
.sl-empty { grid-column:1/-1; text-align:center; padding:80px 24px; }
.sl-empty-icon { font-size:3rem; margin-bottom:12px; opacity:.35; }
.sl-empty h3 { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:2px; color:var(--text); margin-bottom:6px; }
.sl-empty p { color:var(--muted); font-size:.9rem; }
.sl-error { margin-bottom:24px; background:${dark?"#2d1515":"#fff5f5"}; border-left:4px solid var(--danger); padding:14px 18px; color:${dark?"#fca5a5":"#9b2c2c"}; font-size:.9rem; border-radius:4px; }

/* ── RESPONSIVE ── */
@media (max-width:900px) {
  .sl-bar { flex-wrap:wrap; padding:12px 16px; gap:8px; position:static; }
  .sl-bar-brand { width:100%; margin-right:0; font-size:1.1rem; }
  .sl-search-wrap { max-width:100%; margin-right:0; flex:1 1 100%; }
  .sl-sel { flex:1; margin-right:0; font-size:.8rem; padding:8px 10px; }
  .sl-range-pill { flex:1 1 100%; justify-content:space-between; }
  .sl-range-pill input[type=range] { flex:1; }
  .sl-clear { margin-left:0; width:100%; text-align:center; padding:10px; }
  .sl-wrap { padding:20px 16px 48px; }
  .sl-grid, .sl-skeleton-grid { grid-template-columns:repeat(2,1fr); gap:1px; }
  .sl-card-img { height:200px; }
  .sl-skel-img  { height:200px; }
  .sl-card-body { padding:10px 12px 14px; gap:6px; }
  .sl-card-name { font-size:.85rem; }
  .sl-card-price { font-size:1.1rem; }
  .sl-card-desc { display:none; }
  .sl-chips-section { display:none; }
  .sl-count { font-size:1.6rem; }
}

@media (max-width:480px) {
  .sl-grid, .sl-skeleton-grid { grid-template-columns:repeat(2,1fr); gap:1px; }
  .sl-card-img { height:160px; }
  .sl-skel-img  { height:160px; }
  .sl-card-name { font-size:.78rem; -webkit-line-clamp:2; }
  .sl-card-price { font-size:1rem; }
  .sl-card-body { padding:8px 10px 12px; }
  .sl-wrap { padding:12px 8px 40px; }
  .sl-card-overlay { display:none; }
  .sl-stock-details { flex-direction:column; align-items:flex-start; gap:2px; }
}

/* ── NUEVA DIRECCIÓN VISUAL ── */
.sl-cat {
  --accent:#c7f22b;
  background:
    radial-gradient(circle at 92% 0%, ${dark ? "rgba(49,87,245,.12)" : "rgba(49,87,245,.08)"} 0, transparent 26rem),
    var(--cream);
}
.sl-bar {
  min-height:76px;
  padding:12px max(24px,calc((100vw - 1380px)/2));
  gap:10px;
  border-bottom:1px solid rgba(255,255,255,.09);
  box-shadow:0 12px 35px rgba(10,26,47,.12);
}
.sl-bar-brand {
  font-family:'Outfit',sans-serif;
  font-size:.82rem;
  font-weight:800;
  letter-spacing:.15em;
  margin-right:18px;
}
.sl-search-wrap { max-width:390px; margin-right:2px; }
.sl-input,.sl-sel,.sl-range-pill,.sl-clear {
  min-height:44px;
  border-radius:999px;
}
.sl-input { padding-left:42px; }
.sl-sel { padding-inline:16px; }
.sl-range-pill { padding-inline:16px; }
.sl-clear { padding-inline:18px; }
.sl-wrap { max-width:1380px; padding:58px 28px 90px; }
.sl-catalog-intro { max-width:690px; margin-bottom:42px; }
.sl-catalog-kicker {
  display:inline-flex; align-items:center; gap:9px;
  margin-bottom:14px; color:#3157f5;
  font-size:.72rem; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
}
.sl-catalog-kicker::before {
  content:""; width:28px; height:3px; border-radius:99px; background:#ff6938;
}
.sl-catalog-title {
  margin:0; color:var(--text);
  font-family:'Outfit',sans-serif;
  font-size:clamp(2.55rem,5vw,4.8rem);
  font-weight:700; line-height:.96; letter-spacing:-.06em;
}
.sl-catalog-sub {
  max-width:560px; margin:18px 0 0;
  color:var(--muted); font-size:1rem; line-height:1.65;
}
.sl-grid,.sl-skeleton-grid {
  grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
  gap:20px;
}
.sl-card,.sl-skeleton {
  border:1px solid var(--border);
  border-radius:22px;
  box-shadow:0 8px 28px rgba(10,26,47,.055);
  transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
}
.sl-card:hover {
  transform:translateY(-6px);
  border-color:${dark ? "#475569" : "#d3d8df"};
  box-shadow:0 20px 46px rgba(10,26,47,.13);
}
.sl-card-img {
  height:285px;
  margin:8px 8px 0;
  border-radius:16px;
}
.sl-card-img img { padding:18px; }
.sl-card-body { padding:18px 19px 20px; gap:11px; }
.sl-card-name { font-size:1rem; letter-spacing:-.015em; }
.sl-card-price {
  font-family:'Outfit',sans-serif;
  font-size:1.02rem; font-weight:700; letter-spacing:-.02em;
}
.sl-card-desc { font-size:.8rem; }
.sl-badge-wrap { top:16px; left:16px; }
.sl-badge { border-radius:999px; padding:5px 10px; font-size:.62rem; }
.sl-chip { border-radius:999px; padding:4px 10px; }
.sl-stock-bar-track { height:5px; }
.sl-stock-msg { width:fit-content; border-radius:999px; padding:5px 9px; }
.sl-card-overlay {
  inset:auto 16px 16px;
  padding:0;
  background:none;
}
.sl-card-overlay-btn {
  min-height:44px;
  border-radius:999px;
  box-shadow:0 10px 22px rgba(10,26,47,.2);
}
.sl-empty {
  min-height:380px; display:grid; place-content:center;
  border:1px dashed var(--border); border-radius:24px; background:var(--white);
}

@media(max-width:900px) {
  .sl-bar { padding:14px 16px; border-radius:0 0 20px 20px; }
  .sl-wrap { padding:38px 16px 64px; }
  .sl-catalog-intro { margin-bottom:30px; }
  .sl-grid,.sl-skeleton-grid { gap:12px; }
  .sl-card-img { height:220px; }
}
@media(max-width:560px) {
  .sl-catalog-title { font-size:2.7rem; }
  .sl-catalog-sub { font-size:.9rem; }
  .sl-grid,.sl-skeleton-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .sl-card { border-radius:16px; }
  .sl-card-img { height:155px; margin:5px 5px 0; border-radius:12px; }
  .sl-card-img img { padding:8px; }
  .sl-card-body { padding:11px 10px 14px; }
  .sl-card-price { font-size:.9rem; }
  .sl-badge-wrap { top:10px; left:10px; }
  .sl-badge { padding:4px 7px; }
}
/* Filtros laterales: estilos limitados al catálogo. */
.sl-cat .sl-catalog-layout{max-width:1560px;margin:0 auto;padding:32px 24px 72px;display:grid;grid-template-columns:240px minmax(0,1fr);align-items:start;gap:28px;}
.sl-cat .sl-sidebar{position:sticky;top:132px;z-index:10;max-height:calc(100dvh - 156px);overflow-y:auto;display:flex;flex-direction:column;align-items:stretch;gap:0;min-height:0;padding:24px;border:1px solid #ffffff14;border-radius:22px;box-shadow:0 12px 32px #0a1a2f12;}
.sl-cat .sl-filter-heading{margin-bottom:24px;}
.sl-cat .sl-bar-brand{display:block;margin:0 0 8px;width:auto;font-size:.72rem;letter-spacing:.15em;}
.sl-cat .sl-filter-heading h2{margin:0;font-size:1.55rem;color:#f4f7fb;font-weight:700;}
.sl-cat .sl-filter-label{margin:0 0 9px;color:#d7e0ec;font-size:.78rem;font-weight:600;}
.sl-cat .sl-search-wrap{width:100%;max-width:none;flex:none;margin:0 0 22px;}
.sl-cat .sl-search-ico{left:13px;font-size:1.2rem;}
.sl-cat .sl-input{min-width:0;min-height:44px;padding:11px 12px 11px 34px;border-radius:12px;font-size:.85rem;}
.sl-cat .sl-input::placeholder{color:#acb8ca;}
.sl-cat .sl-sel{width:100%;margin:0 0 22px;padding:11px 12px;border-radius:12px;font-size:.85rem;min-width:0;}
.sl-cat .sl-range-pill{width:100%;display:block;margin:0;padding:0;background:none;border:0;border-radius:0;white-space:normal;}
.sl-cat .sl-range-pill label{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;color:#d7e0ec;font-size:.78rem;}
.sl-cat .sl-range-pill strong{color:var(--accent);}
.sl-cat .sl-range-pill input{width:100%;margin:16px 0 24px;min-height:24px;}
.sl-cat .sl-clear{margin:0;min-height:44px;border-radius:12px;color:#f1f5f9;}
.sl-cat .sl-wrap{min-width:0;width:100%;max-width:none;margin:0;padding:0;scroll-margin-top:130px;}
.sl-cat .sl-catalog-intro{margin:0 0 28px;}
.sl-cat .sl-catalog-title{font-size:clamp(2rem,3.2vw,3.1rem);line-height:1.05;}
.sl-cat .sl-catalog-sub{margin-top:12px;font-size:.92rem;}
.sl-cat .sl-grid,.sl-cat .sl-skeleton-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
.sl-cat .sl-grid>.sl-feedback{grid-column:1/-1;}
.sl-cat .sl-card,.sl-cat .sl-skeleton{min-width:0;border-radius:18px;}
.sl-cat .sl-card-img{height:auto;aspect-ratio:1;min-width:0;}
.sl-cat .sl-card-img img{padding:12px;}
.sl-cat .sl-card-row1{flex-direction:column;gap:7px;}
.sl-cat .sl-card-price{margin-left:0;}
.sl-cat .sl-card-body{padding:14px;}
.sl-cat .sl-card-name{font-size:.9rem;overflow-wrap:anywhere;}
.sl-cat .sl-badge-wrap{top:8px;left:8px;max-width:calc(100% - 16px);}
.sl-cat .sl-badge{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sl-cat .sl-pagination{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;margin-top:34px;}
.sl-cat .sl-pagination button{min-width:42px;min-height:44px;padding:8px 13px;border:1px solid var(--border);border-radius:12px;background:var(--white);color:var(--text);font:inherit;font-size:.85rem;cursor:pointer;}
.sl-cat .sl-pagination button[aria-current=page]{background:#244fdb;border-color:#244fdb;color:#fff;font-weight:700;}
.sl-cat .sl-pagination button:disabled{opacity:.4;cursor:default;}
.sl-cat button:focus-visible,.sl-cat select:focus-visible{outline:3px solid #86a5ff;outline-offset:3px;}
.sl-cat .sl-mobile-filters{display:none;}
@media(max-width:1100px){
 .sl-cat .sl-catalog-layout{grid-template-columns:210px minmax(0,1fr);padding-inline:16px;gap:18px;}
 .sl-cat .sl-sidebar{padding:20px;}
 .sl-cat .sl-grid,.sl-cat .sl-skeleton-grid{gap:10px;}
 .sl-cat .sl-card-body{padding:10px;}
 .sl-cat .sl-chips-section,.sl-cat .sl-card-desc{display:none;}
}
@media(max-width:900px){
 .sl-cat .sl-catalog-layout{grid-template-columns:minmax(0,1fr);gap:18px;padding:24px 14px 50px;}
 .sl-cat .sl-mobile-filters{display:inline-flex;align-items:center;justify-content:center;gap:9px;justify-self:start;min-height:44px;padding:10px 18px;border:1px solid var(--border);border-radius:12px;background:var(--white);color:var(--text);font:inherit;cursor:pointer;}
 .sl-cat .sl-sidebar{display:none;position:static;max-height:none;}
 .sl-cat .sl-sidebar.is-open{display:flex;}
 .sl-cat .sl-wrap{scroll-margin-top:100px;}
 .sl-cat .sl-catalog-intro{margin-bottom:24px;}
}
@media(max-width:700px){
 .sl-cat .sl-catalog-layout{padding:18px 10px 45px;}
 .sl-cat .sl-grid,.sl-cat .sl-skeleton-grid{gap:6px;}
 .sl-cat .sl-catalog-title{font-size:1.85rem;}
 .sl-cat .sl-catalog-sub{font-size:.85rem;}
 .sl-cat .sl-card,.sl-cat .sl-skeleton{border-radius:10px;}
 .sl-cat .sl-card-img{margin:3px 3px 0;border-radius:7px;}
 .sl-cat .sl-card-img img{padding:3px;}
 .sl-cat .sl-card-body{padding:8px 5px;gap:6px;}
 .sl-cat .sl-card-name{font-size:.69rem;line-height:1.3;-webkit-line-clamp:3;}
 .sl-cat .sl-card-price{font-size:.68rem;letter-spacing:-.03em;white-space:normal;overflow-wrap:anywhere;}
 .sl-cat .sl-badge-marca{display:none;}
 .sl-cat .sl-badge-out{padding:3px 4px;font-size:.49rem;letter-spacing:0;}
 .sl-cat .sl-badge-wrap{top:auto;bottom:4px;left:2px;}
 .sl-cat .sl-favorite-compact{right:3px;top:3px;width:28px;height:28px;min-height:28px;border-radius:9px;font-size:.75rem;}
 .sl-cat .sl-card-overlay{display:none;}
 .sl-cat .sl-skel-img{height:auto;aspect-ratio:1;}
 .sl-cat .sl-skel-body{padding:8px 5px;gap:6px;}
 .sl-cat .sl-skel-line{height:9px;}
 .sl-cat .sl-pagination{gap:5px;}
 .sl-cat .sl-pagination button{min-width:34px;padding:8px 10px;font-size:.78rem;}
}
.sl-cat .sl-sidebar{background:var(--white);border-color:var(--border);padding:22px;box-shadow:0 12px 40px #071a3010;scrollbar-width:thin;}
.sl-cat .sl-filter-heading{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
.sl-cat .sl-filter-symbol{display:grid;place-items:center;width:40px;height:44px;flex-shrink:0;border-radius:13px;background:var(--navy);color:var(--accent);font-size:1.2rem;}
.sl-cat .sl-filter-heading .sl-bar-brand{font-family:inherit;color:${dark ? "#a9c0ff" : "#244fdb"};font-size:.59rem;font-weight:700;letter-spacing:.16em;margin-bottom:5px;}
.sl-cat .sl-filter-heading h2{color:var(--text);font-size:1.1rem;line-height:1.2;}
.sl-cat .sl-filter-label{color:var(--text);}
.sl-cat .sl-search-wrap{margin-bottom:0;}
.sl-cat .sl-input{background:var(--cream);color:var(--text);border:1px solid var(--border);font-size:.78rem;}
.sl-cat .sl-input:focus{border-color:#5278ed;box-shadow:0 0 0 3px #5278ed20;}
.sl-cat .sl-search-ico{color:var(--muted);}
.sl-cat .sl-filter-section{border-top:1px solid var(--border);padding:19px 0 0;margin-top:20px;}
.sl-cat .sl-filter-section summary{display:flex;align-items:center;justify-content:space-between;gap:8px;list-style:none;cursor:pointer;font-size:.85rem;font-weight:600;color:var(--text);}
.sl-cat .sl-filter-section summary::-webkit-details-marker{display:none;}
.sl-cat .sl-filter-section summary i{font-size:.65rem;transition:transform .15s;}
.sl-cat .sl-filter-section:not([open]) summary i{transform:rotate(-90deg);}
.sl-cat .sl-filter-options{display:grid;gap:4px;margin-top:13px;max-height:236px;overflow:auto;scrollbar-width:thin;}
.sl-cat .sl-filter-option{display:flex;align-items:center;gap:9px;min-height:38px;padding:7px 8px;border:1px solid transparent;border-radius:10px;cursor:pointer;font-size:.78rem;line-height:1.3;color:var(--text);}
.sl-cat .sl-filter-option:has(input:checked){background:${dark ? "#30426a" : "#edf2ff"};border-color:${dark ? "#536998" : "#d6e1ff"};}
.sl-cat .sl-filter-option:hover{background:var(--cream);}
.sl-cat .sl-filter-option input{width:16px;height:16px;margin:0;accent-color:#325ce0;flex-shrink:0;}
.sl-cat .sl-filter-option span{flex:1;overflow-wrap:anywhere;}
.sl-cat .sl-filter-hint{font-size:.7rem;color:${dark ? "#b1bed2" : "#5e6d82"};margin:9px 0 -4px;}
.sl-cat .sl-range-pill{margin-top:16px;}
.sl-cat .sl-range-pill label{color:var(--text);font-size:.72rem;}
.sl-cat .sl-range-pill strong{color:${dark ? "#a9c0ff" : "#244fdb"};font-size:.85rem;}
.sl-cat .sl-range-pill input{margin:12px 0 0;accent-color:#325ce0;width:100%;}
.sl-cat .sl-price-limits{display:flex;justify-content:space-between;font-size:.65rem;color:${dark ? "#b1bed2" : "#5e6d82"};}
.sl-cat .sl-clear{margin-top:22px;background:transparent;color:var(--text);border:1px solid var(--border);font-size:.77rem;}
.sl-cat .sl-clear:hover{background:var(--cream);border-color:#7895ec;}
.sl-cat .sl-results-tools{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 20px;flex-wrap:wrap;}
.sl-cat .sl-active-filters{display:flex;flex-wrap:wrap;gap:7px;flex:1;}
.sl-cat .sl-active-filters button{display:flex;align-items:center;gap:7px;padding:7px 10px;max-width:100%;overflow-wrap:anywhere;border:1px solid var(--border);border-radius:30px;background:var(--white);color:var(--text);font:inherit;font-size:.73rem;cursor:pointer;}
.sl-cat .sl-active-filters button:hover{border-color:#5278ed;}
.sl-cat .sl-sort{display:flex;align-items:center;gap:10px;margin:0 0 0 auto;font-size:.73rem;color:var(--text);}
.sl-cat .sl-sort select{min-height:40px;max-width:170px;padding:8px 10px;background:var(--white);color:var(--text);border:1px solid var(--border);border-radius:10px;font:inherit;}
.sl-cat .sl-sidebar input:focus-visible,.sl-cat summary:focus-visible{outline:3px solid #86a5ff;outline-offset:3px;}
@media(min-width:1101px){.sl-cat .sl-catalog-layout{grid-template-columns:270px minmax(0,1fr);}}
@media(max-width:900px){.sl-cat .sl-filter-options{max-height:200px;}.sl-cat .sl-sidebar{padding:24px;}}
.sl-cat .sl-filter-done,.sl-cat .sl-mobile-card-action{display:none;}
@media(max-width:700px){
 .container-fluid:has(.sl-cat){padding-left:8px!important;padding-right:8px!important;}
 .sl-cat .sl-catalog-layout{padding:16px 4px 40px;gap:16px;}
 .sl-cat .sl-grid,.sl-cat .sl-skeleton-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
 .sl-cat .sl-card{border-radius:16px;}
 .sl-cat .sl-card-img{margin:5px 5px 0;border-radius:12px;}
 .sl-cat .sl-card-img img{padding:8px;}
 .sl-cat .sl-card-body{padding:12px 10px;}
 .sl-cat .sl-card-name{font-size:.9rem;line-height:1.35;-webkit-line-clamp:2;}
 .sl-cat .sl-card-price{font-size:.95rem;letter-spacing:0;}
 .sl-cat .sl-favorite-compact{width:36px;height:36px;right:7px;top:7px;}
 .sl-cat .sl-card-overlay{display:none;}
 .sl-cat .sl-mobile-card-action{display:block;padding:10px 6px;min-height:44px;margin:0 10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--white);color:var(--text);font:inherit;font-size:.75rem;font-weight:600;cursor:pointer;}
 .sl-cat .sl-mobile-card-action:disabled{opacity:.5;cursor:default;}
 .sl-cat .sl-sidebar{padding:20px;border-radius:18px;}
 .sl-cat .sl-input{font-size:16px;}
 .sl-cat .sl-filter-option{min-height:44px;font-size:.88rem;}
 .sl-cat .sl-filter-section summary{min-height:44px;font-size:.95rem;}
 .sl-cat .sl-filter-options{max-height:224px;}
 .sl-cat .sl-filter-done{display:block;min-height:46px;margin-top:12px;border:0;border-radius:12px;background:#244fdb;color:#fff;font:inherit;font-weight:600;}
 .sl-cat .sl-sort{width:100%;justify-content:space-between;}
 .sl-cat .sl-sort select{flex:1;max-width:none;font-size:16px;}
 .sl-cat .sl-results-tools{gap:12px;}
 .sl-cat .sl-wrap{scroll-margin-top:135px;}
 .sl-cat .sl-card:hover{transform:none;}
}
@media(prefers-reduced-motion:reduce){.sl-cat .sl-filter-section summary i{transition:none;}}
`;
export default getCSS;
