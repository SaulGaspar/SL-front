const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --navy:   #0a1a2f;
  --navy2:  #1e3a5f;
  --accent: #c8f03c;
  --white:  #ffffff;
  --muted:  rgba(255,255,255,.5);
  --border: rgba(255,255,255,.1);
}

.nb { font-family:'Outfit',sans-serif; background:var(--navy); position:sticky; top:0; z-index:1000; border-bottom:1px solid var(--border); box-shadow:0 2px 24px rgba(0,0,0,.35); }

/* Strip */
.nb-strip { background:rgba(255,255,255,.04); border-bottom:1px solid var(--border); padding:5px 40px; display:flex; justify-content:flex-end; align-items:center; gap:20px; }
.nb-strip-link { font-size:.72rem; color:var(--muted); text-decoration:none; letter-spacing:.5px; text-transform:uppercase; transition:color .15s; display:flex; align-items:center; gap:5px; }
.nb-strip-link:hover { color:var(--accent); }
.nb-strip-sep { color:var(--border); }

/* Main row */
.nb-main { display:flex; align-items:center; padding:0 40px; height:64px; gap:28px; }

/* Logo */
.nb-logo { font-family:'Bebas Neue',sans-serif; font-size:1.7rem; letter-spacing:4px; color:var(--white); text-decoration:none; flex-shrink:0; position:relative; transition:color .2s; }
.nb-logo::after { content:''; position:absolute; bottom:-2px; left:0; width:100%; height:2px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
.nb-logo:hover { color:var(--accent); }
.nb-logo:hover::after { transform:scaleX(1); }

/* Nav links */
.nb-links { display:flex; align-items:center; gap:4px; list-style:none; margin:0; padding:0; }
.nb-link { font-size:.88rem; font-weight:600; color:var(--muted); text-decoration:none; letter-spacing:.5px; padding:8px 14px; border-radius:6px; transition:color .15s,background .15s; position:relative; }
.nb-link:hover { color:var(--white); background:rgba(255,255,255,.07); }
.nb-link.active { color:var(--white); }
.nb-link.active::after { content:''; position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--accent); }
.nb-link-admin { font-size:.82rem; font-weight:700; color:var(--accent); text-decoration:none; letter-spacing:1px; padding:7px 14px; border:1.5px solid rgba(200,240,60,.3); border-radius:6px; display:flex; align-items:center; gap:6px; transition:all .2s; }
.nb-link-admin:hover { background:rgba(200,240,60,.1); border-color:var(--accent); }

/* Search */
.nb-search { flex:1; max-width:260px; margin-left:auto; position:relative; }
.nb-search input { width:100%; padding:8px 14px 8px 36px; background:rgba(255,255,255,.07); border:1.5px solid var(--border); border-radius:8px; color:white; font-family:'Outfit',sans-serif; font-size:.85rem; transition:background .2s,border-color .2s; }
.nb-search input::placeholder { color:var(--muted); }
.nb-search input:focus { outline:none; background:rgba(255,255,255,.11); border-color:var(--accent); }
.nb-search-ico { position:absolute; left:7px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:.9rem; border:0; background:transparent; width:28px; height:28px; padding:0; cursor:pointer; display:grid; place-items:center; z-index:1; }
.nb-search-ico:hover { color:var(--accent); }

/* Icon buttons */
.nb-icons { display:flex; align-items:center; gap:4px; flex-shrink:0; }
.nb-icon-btn { width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:8px; color:var(--muted); text-decoration:none; border:none; background:transparent; cursor:pointer; transition:color .15s,background .15s; font-size:1.2rem; position:relative; }
.nb-icon-btn:hover { color:white; background:rgba(255,255,255,.09); }
.nb-icon-btn.accent-active { color:var(--accent); background:rgba(200,240,60,.1); }
.nb-cart-dot { position:absolute; top:5px; right:5px; width:8px; height:8px; background:var(--accent); border-radius:50%; border:2px solid var(--navy); }
.nb-divider { width:1px; height:22px; background:var(--border); margin:0 2px; }

/* SETTINGS DROPDOWN */
.nb-cfg-wrap { position:relative; }
.nb-cfg-dropdown { position:absolute; top:calc(100% + 10px); right:0; width:300px; background:#0d2240; border:1px solid rgba(255,255,255,.12); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,.5); z-index:3000; overflow:hidden; animation:cfgDrop .2s cubic-bezier(.16,1,.3,1); transform-origin:top right; }
@keyframes cfgDrop { from{opacity:0;transform:scale(.95) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
.nb-cfg-head { padding:16px 18px 12px; border-bottom:1px solid rgba(255,255,255,.08); display:flex; align-items:center; gap:10px; }
.nb-cfg-head-icon { width:34px; height:34px; background:rgba(200,240,60,.12); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:1rem; }
.nb-cfg-head-text { font-size:.88rem; font-weight:700; color:white; letter-spacing:.3px; }
.nb-cfg-head-sub  { font-size:.72rem; color:rgba(255,255,255,.4); margin-top:1px; }
.nb-cfg-body { padding:10px 0 6px; }
.nb-cfg-section { padding:6px 18px 4px; font-size:.63rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.28); }
.nb-cfg-row { display:flex; align-items:center; justify-content:space-between; padding:10px 18px; transition:background .15s; }
.nb-cfg-row:hover { background:rgba(255,255,255,.04); }
.nb-cfg-row-left { display:flex; align-items:center; gap:10px; }
.nb-cfg-row-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:.9rem; flex-shrink:0; }
.nb-cfg-row-label { font-size:.85rem; font-weight:600; color:rgba(255,255,255,.85); }
.nb-cfg-row-desc  { font-size:.72rem; color:rgba(255,255,255,.38); margin-top:1px; }
.nb-sw { position:relative; width:40px; height:22px; flex-shrink:0; }
.nb-sw input { opacity:0; width:0; height:0; }
.nb-sw-track { position:absolute; inset:0; background:rgba(255,255,255,.14); border-radius:22px; cursor:pointer; transition:background .2s; }
.nb-sw-track::before { content:''; position:absolute; width:16px; height:16px; left:3px; top:3px; background:rgba(255,255,255,.5); border-radius:50%; transition:transform .2s,background .2s; }
.nb-sw input:checked + .nb-sw-track { background:rgba(200,240,60,.35); }
.nb-sw input:checked + .nb-sw-track::before { transform:translateX(18px); background:var(--accent); }
.nb-cfg-select { padding:5px 10px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); border-radius:7px; color:rgba(255,255,255,.8); font-family:'Outfit',sans-serif; font-size:.8rem; cursor:pointer; }
.nb-cfg-select:focus { outline:none; border-color:var(--accent); }
.nb-cfg-select option { background:#0d2240; }
.nb-cfg-foot { padding:10px 14px 14px; border-top:1px solid rgba(255,255,255,.07); margin-top:4px; }
.nb-cfg-save { width:100%; padding:10px; background:linear-gradient(135deg,rgba(200,240,60,.2),rgba(200,240,60,.1)); border:1px solid rgba(200,240,60,.3); border-radius:10px; color:var(--accent); font-family:'Outfit',sans-serif; font-size:.85rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; letter-spacing:.3px; }
.nb-cfg-save:hover { background:rgba(200,240,60,.18); transform:translateY(-1px); }
.nb-cfg-logout { width:100%; padding:9px 10px; background:rgba(255,80,80,.06); border:1px solid rgba(255,80,80,.18); border-radius:10px; color:rgba(255,110,110,.85); font-family:'Outfit',sans-serif; font-size:.83rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; margin-top:8px; }
.nb-cfg-logout:hover { background:rgba(255,80,80,.12); border-color:rgba(255,80,80,.35); color:#fc8181; }
.nb-cfg-advanced { width:100%; padding:9px 10px; background:rgba(96,165,250,.10); border:1px solid rgba(96,165,250,.24); border-radius:10px; color:#93c5fd; font-family:'Outfit',sans-serif; font-size:.83rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; margin-top:8px; }
.nb-cfg-advanced:hover { background:rgba(96,165,250,.18); border-color:rgba(96,165,250,.45); color:#dbeafe; }
.nb-logout-btn { color:rgba(255,110,110,.6) !important; }
.nb-logout-btn:hover { color:#fc8181 !important; background:rgba(255,80,80,.09) !important; }
@media (max-width:900px) { .nb-logout-btn { display:none; } }

/* HAMBURGER */
.nb-ham { display:none; flex-direction:column; gap:5px; width:38px; height:38px; justify-content:center; align-items:center; border-radius:8px; cursor:pointer; border:none; background:transparent; transition:background .15s; }
.nb-ham:hover { background:rgba(255,255,255,.09); }
.nb-ham span { display:block; width:20px; height:2px; background:rgba(255,255,255,.75); border-radius:2px; transition:all .25s ease; }
.nb-ham.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.nb-ham.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.nb-ham.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* DRAWER */
.nb-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:2000; backdrop-filter:blur(3px); }
.nb-drawer { position:fixed; top:0; right:0; width:min(380px,90vw); height:100vh; background:var(--navy2); z-index:2001; display:flex; flex-direction:column; animation:nbIn .3s cubic-bezier(.22,.68,0,1.2); box-shadow:-8px 0 40px rgba(0,0,0,.4); }
@keyframes nbIn { from{transform:translateX(100%);opacity:.5} to{transform:translateX(0);opacity:1} }
.nb-dhead { display:flex; justify-content:space-between; align-items:center; padding:22px 28px 18px; border-bottom:1px solid var(--border); }
.nb-dhead-logo { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:4px; color:white; }
.nb-dclose { width:36px; height:36px; background:rgba(255,255,255,.08); border:none; border-radius:8px; color:white; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.nb-dclose:hover { background:rgba(255,255,255,.16); }
.nb-dbody { flex:1; overflow-y:auto; padding:12px 0; }
.nb-dsection { padding:10px 28px 4px; font-size:.68rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); }
.nb-dlink { display:flex; align-items:center; gap:14px; padding:12px 28px; font-size:.93rem; font-weight:500; color:rgba(255,255,255,.78); text-decoration:none; transition:all .15s; border-left:3px solid transparent; }
.nb-dlink:hover { color:white; background:rgba(255,255,255,.06); border-left-color:var(--accent); padding-left:32px; }
.nb-dlink i { font-size:1.05rem; color:rgba(255,255,255,.4); width:20px; text-align:center; transition:color .15s; }
.nb-dlink:hover i { color:var(--accent); }
.nb-dlink.danger { color:rgba(255,110,110,.75); }
.nb-dlink.danger:hover { color:#fc8181; border-left-color:#fc8181; background:rgba(255,80,80,.07); }
.nb-dlink.danger i { color:rgba(255,110,110,.5); }
.nb-dlink.danger:hover i { color:#fc8181; }
.nb-dfoot { padding:16px 28px 28px; border-top:1px solid var(--border); }
.nb-duser { display:flex; align-items:center; gap:12px; }
.nb-davatar { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,var(--accent),#8fc83a); display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:1.1rem; color:var(--navy); flex-shrink:0; }
.nb-duname { font-size:.9rem; font-weight:700; color:white; }
.nb-durole { font-size:.7rem; color:var(--muted); letter-spacing:.5px; text-transform:uppercase; margin-top:1px; }

@media (max-width:900px) {
  .nb-strip,.nb-search,.nb-links { display:none; }
  .nb-ham { display:flex; }
  .nb-main { padding:0 20px; gap:12px; }
  .nb-cfg-dropdown { right:-40px; width:280px; }
}
@media (min-width:901px) { .nb-ham { display:none; } }
@media (max-width:600px) {
  .nb-main { padding:0 12px; gap:8px; justify-content:space-between; }
  .nb-logo { font-size:1.2rem; letter-spacing:2px; }
  .nb-icons { gap:0; }
  .nb-divider { display:none; }
  .nb-icons > .sl-pwa-nav-install { display:none; }
}
`;
export default CSS;
