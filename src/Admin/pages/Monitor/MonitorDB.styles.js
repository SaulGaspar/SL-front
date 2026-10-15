const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.mon * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
.mon { background: transparent; min-height: 0; color: #1e3a5f; }

/* ── Banner (mismo look que el topbar del AdminLayout) ── */
.mon-banner {
  background: #fff;
  padding: 16px 24px; display: flex; align-items: center;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
  border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
}
.mon-banner-left { display: flex; align-items: center; gap: 12px; }
.mon-banner-icon { width: 40px; height: 40px; background: #e8f0fe; color:#2c5282; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.mon-banner-title { color: #1e3a5f; font-size: 1.2rem; font-weight: 700; margin: 0; }
.mon-banner-sub   { color: #718096; font-size: .78rem; margin: 2px 0 0; }
.mon-banner-right { display: flex; align-items: center; gap: 10px; }
.mon-pill { background: rgba(57,211,83,.2); border: 1px solid rgba(57,211,83,.4); color: #39d353; border-radius: 20px; padding: 5px 14px; font-size: .78rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.mon-dot { width: 7px; height: 7px; border-radius: 50%; background: #39d353; animation: mPulse 2s ease-in-out infinite; }
@keyframes mPulse { 0%,100%{opacity:1;box-shadow:0 0 0 #39d353} 50%{opacity:.5;box-shadow:0 0 8px #39d353} }

/* ── Tabs (mismo estilo que las páginas del admin) ── */
.mon-tabs { background: #fff; border:1px solid #e2e8f0; border-radius:12px; margin-top:16px; padding: 0 16px; display: flex; gap: 0; overflow-x: auto; }
.mon-tab { padding: 14px 18px; border: none; background: none; cursor: pointer; font-family: inherit; font-size: .88rem; font-weight: 600; color: #718096; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all .15s; white-space: nowrap; }
.mon-tab:hover { color: #2c5282; }
.mon-tab.active { color: #2c5282; border-bottom-color: #2c5282; }

/* ── Cuerpo ── */
.mon-body { padding: 20px 0 0; display: flex; flex-direction: column; gap: 20px; }

/* ── Grids ── */
.g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── Stat cards ── */
.stat {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 18px 20px; display: flex; align-items: flex-start; gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05); transition: .2s;
  position: relative; overflow: hidden;
}
.stat::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--stripe,#2c5282); border-radius:12px 12px 0 0; }
.stat:hover { box-shadow: 0 6px 20px rgba(0,0,0,.1); transform: translateY(-2px); }
.stat-ico { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.2rem; }
.ic-blue   { background:#e8f0fe; color:#2c5282; }
.ic-green  { background:#e6f4ea; color:#1e7e34; }
.ic-yellow { background:#fff8e1; color:#c9961a; }
.ic-red    { background:#fce8e6; color:#c0392b; }
.ic-purple { background:#f3e5f5; color:#6d28d9; }
.ic-teal   { background:#e0f2f1; color:#0d7377; }
.stat-lbl { font-size: .7rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: .6px; }
.stat-val { font-size: 1.75rem; font-weight: 800; color: #1e3a5f; line-height: 1.1; }
.stat-val.sm { font-size: 1.1rem; }
.stat-sub { font-size: .75rem; color: #a0aec0; margin-top: 2px; }

/* ── Panels ── */
.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-size: .9rem; font-weight: 700; color: #1e3a5f; display: flex; align-items: center; gap: 8px; }
.panel-body { padding: 18px 20px; }
.badge { font-size: .72rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: #e8f0fe; color: #2c5282; border: 1px solid #c3d6f5; }

/* ── Tablas ── */
.tbl { width: 100%; border-collapse: collapse; font-size: .84rem; }
.tbl th { padding: 10px 14px; text-align: left; font-size: .68rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .5px; background: linear-gradient(180deg,#1e3a5f,#2c5282); white-space: nowrap; }
.tbl td { padding: 11px 14px; border-bottom: 1px solid #f0f4f8; color: #374151; vertical-align: middle; }
.tbl tbody tr:hover td { background: #f8fafc; }
.tbl tbody tr:last-child td { border-bottom: none; }
.tscroll { overflow-x: auto; }

/* ── Progress bars ── */
.bar-wrap  { display: flex; align-items: center; gap: 8px; }
.bar-track { flex: 1; height: 8px; background: #f0f4f8; border-radius: 4px; overflow: hidden; min-width: 60px; }
.bar-fill  { height: 100%; border-radius: 4px; transition: width .5s; }
.bar-pct   { font-size: .7rem; color: #a0aec0; min-width: 32px; text-align: right; }

/* ── KV rows ── */
.kv { display: flex; flex-direction: column; gap: 6px; }
.kv-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 13px; background: #f8fafc; border-radius: 8px; border: 1px solid #f0f4f8; }
.kv-k { font-size: .84rem; color: #718096; }
.kv-v { font-size: .88rem; color: #1e3a5f; font-weight: 700; }

/* ── Tags ── */
.tag { display: inline-block; padding: 2px 9px; border-radius: 12px; font-size: .72rem; font-weight: 700; }
.t-ok    { background: #e6f4ea; color: #1e7e34; }
.t-warn  { background: #fff8e1; color: #c9961a; }
.t-err   { background: #fce8e6; color: #c0392b; }
.t-info  { background: #e8f0fe; color: #2c5282; }
.t-pk    { background: #fce4ec; color: #ad1457; }

/* ── Alertas ── */
.a-ok   { background: #e6f4ea; border: 1px solid #a8d5b5; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #1e7e34; }
.a-warn { background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #c9961a; }
.a-err  { background: #fce8e6; border: 1px solid #ef9a9a; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #c0392b; }
.a-info { background: #e8f0fe; border: 1px solid #c3d6f5; border-radius: 8px; padding: 12px 16px; font-size: .84rem; color: #2c5282; }

/* ── H-Bar chart ── */
.chart-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.chart-lbl { width: 120px; flex-shrink: 0; font-size: .75rem; color: #374151; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chart-area { flex: 1; height: 24px; background: #f0f4f8; border-radius: 6px; overflow: hidden; position: relative; }
.chart-inner { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 8px; transition: width .5s; min-width: 4px; }
.chart-vl { font-size: .72rem; font-weight: 700; color: #fff; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.2); }
.chart-vl.out { color: #374151; padding-left: 4px; position: absolute; right: 0; }
.chart-rv { width: 60px; flex-shrink: 0; font-size: .72rem; color: #a0aec0; text-align: right; }

/* ── Donut ── */
.donut { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.donut svg { transform: rotate(-90deg); }
.donut-lbl { position: absolute; text-align: center; pointer-events: none; }

/* ── Botones ── */
.btn-primary {
  background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border: none; border-radius: 8px;
  padding: 10px 20px; font-family: inherit; font-weight: 700; font-size: .88rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(44,82,130,.3); transition: .18s;
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn-ghost {
  background: #f5f7fa; color: #374151; border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 9px 16px; font-family: inherit; font-weight: 600; font-size: .86rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: .15s;
}
.btn-ghost:hover { background: #edf2f7; }
.btn-green {
  background: linear-gradient(135deg,#1e7e34,#27ae60); color: #fff; border: none; border-radius: 8px;
  padding: 10px 20px; font-family: inherit; font-weight: 700; font-size: .88rem;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(30,126,52,.25); transition: .18s;
}
.btn-green:hover { transform: translateY(-1px); }
.btn-green:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.icon-btn { padding: 7px 11px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-family: inherit; font-weight: 600; transition: all .15s; border: 1.5px solid; background: none; }
.icon-btn:disabled { opacity: .4; cursor: not-allowed; }
.ib-blue  { border-color: #c3d6f5; background: #e8f0fe; color: #2c5282; }
.ib-green { border-color: #a8d5b5; background: #e6f4ea; color: #1e7e34; }
.ib-red   { border-color: #ef9a9a; background: #fce8e6; color: #c0392b; }

/* ── Misc ── */
.loading { display: flex; align-items: center; justify-content: center; min-height: 220px; gap: 12px; color: #a0aec0; font-size: .9rem; }
.spinning { animation: spin .8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
.sec-title { font-size: .7rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 10px; }
.mono { font-family: 'Consolas', 'Courier New', monospace; font-size: .76rem; background: #1e293b; color: #7dd3fc; padding: 3px 8px; border-radius: 5px; }

/* ── Toast ── */
.toast { position: fixed; bottom: 28px; right: 28px; z-index: 9999; padding: 13px 22px; border-radius: 12px; color: #fff; font-family: inherit; font-size: .86rem; font-weight: 700; box-shadow: 0 8px 28px rgba(0,0,0,.22); animation: slideIn .3s ease; display: flex; align-items: center; gap: 9px; }
.toast.ok  { background: linear-gradient(135deg,#1e7e34,#27ae60); }
.toast.err { background: linear-gradient(135deg,#c0392b,#e74c3c); }
@keyframes slideIn { from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1} }

/* ── Overlay / Modal ── */
.overlay { position: fixed; inset: 0; background: rgba(15,31,61,.55); backdrop-filter: blur(4px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal { background: #fff; border-radius: 16px; width: 100%; max-width: 420px; padding: 32px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.25); animation: slideIn .22s ease; }
.modal h3 { margin: 0 0 8px; color: #1e3a5f; font-size: 1.1rem; font-weight: 800; }
.modal p  { margin: 0 0 24px; color: #718096; font-size: .88rem; line-height: 1.55; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Sub-tabs (Respaldos) ── */
.sub-tabs { display: flex; gap: 0; background: #f5f7fa; border: 1px solid #e2e8f0; border-radius: 10px; padding: 4px; margin-bottom: 20px; width: fit-content; }
.sub-tab { padding: 8px 18px; border-radius: 8px; border: none; background: none; font-family: inherit; font-size: .84rem; font-weight: 600; color: #718096; cursor: pointer; transition: .15s; }
.sub-tab.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; box-shadow: 0 2px 8px rgba(44,82,130,.3); }

/* ── Filter chips ── */
.chips { display: flex; gap: 6px; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #fff; font-size: .76rem; font-weight: 700; color: #718096; cursor: pointer; transition: .15s; font-family: inherit; }
.chip:hover { border-color: #2c5282; color: #2c5282; }
.chip.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }

/* ── Freq cards ── */
.freq-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); gap: 10px; margin-bottom: 18px; }
.freq-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; cursor: pointer; transition: .15s; background: #fafafa; text-align: center; }
.freq-card:hover, .freq-card.active { border-color: #2c5282; background: #e8f0fe; }
.freq-card-icon { width: 34px; height: 34px; border-radius: 9px; background: #e2e8f0; color: #718096; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; transition: .15s; }
.freq-card.active .freq-card-icon { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; }
.freq-card-label { font-size: .8rem; font-weight: 700; color: #1e3a5f; }
.freq-card-desc  { font-size: .68rem; color: #a0aec0; margin-top: 2px; }

/* ── Day/Hours btns ── */
.day-btns  { display: flex; gap: 6px; flex-wrap: wrap; }
.day-btn   { padding: 7px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .76rem; font-weight: 700; color: #718096; cursor: pointer; transition: .15s; font-family: inherit; }
.day-btn.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }
.hrs-btn   { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .8rem; font-weight: 700; cursor: pointer; transition: .15s; font-family: inherit; color: #718096; }
.hrs-btn.active { background: linear-gradient(135deg,#1e3a5f,#2c5282); color: #fff; border-color: #2c5282; }

/* ── Time input ── */
.time-input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: .88rem; color: #1e3a5f; background: #fff; font-family: inherit; width: 100%; transition: .15s; }
.time-input:focus { outline: none; border-color: #2c5282; box-shadow: 0 0 0 3px rgba(44,82,130,.1); }

/* ── Backup badges ── */
.bk-auto   { background: #ede9fe; color: #5b21b6; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.bk-manual { background: #e6f4ea; color: #14532d; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.bk-sub    { background: #fff8e1; color: #78350f; font-size: .68rem; padding: 2px 8px; border-radius: 10px; margin-left: 4px; font-weight: 700; }
.bk-fn { font-weight: 700; color: #1e3a5f; font-size: .82rem; font-family: 'Consolas', monospace; }
.bk-size { background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-size: .76rem; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }

/* ── Spinner overlay ── */
.spin-overlay { position: fixed; inset: 0; background: rgba(15,31,61,.65); backdrop-filter: blur(6px); z-index: 5000; display: flex; align-items: center; justify-content: center; }
.spin-box { background: #fff; border-radius: 20px; padding: 40px 52px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.3); }
.spin-box h3 { margin: 18px 0 8px; color: #1e3a5f; font-size: 1.15rem; font-weight: 800; }
.spin-box p  { margin: 0; color: #718096; font-size: .88rem; }
.spinner { width: 52px; height: 52px; border: 5px solid #e2e8f0; border-top-color: #2c5282; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto; }

/* ── Responsive ── */
@media(max-width:1100px){ .g4{grid-template-columns:1fr 1fr;} .g3{grid-template-columns:1fr 1fr;} }
@media(max-width:640px)  { .g4,.g3,.g2{grid-template-columns:1fr;} }
`;
export default CSS;
