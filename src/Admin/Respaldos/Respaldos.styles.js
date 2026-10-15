const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
.bk * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

/* ── Layout ── */
.bk-page-header { margin-bottom: 28px; }
.bk-page-header h2 { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #0f1f3d; letter-spacing: -.5px; }
.bk-page-header p  { margin: 0; color: #64748b; font-size: .88rem; }

/* ── Stats row ── */
.bk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 28px; }
.bk-stat { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.07); border: 1px solid #f1f5f9; position: relative; overflow: hidden; }
.bk-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: var(--accent, #1e3a8a); }
.bk-stat-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--icon-bg, #eff6ff); color: var(--icon-color, #1e40af); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.bk-stat-label { font-size: .72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.bk-stat-val { font-size: 1.8rem; font-weight: 800; color: #0f1f3d; line-height: 1; }
.bk-stat-sub { font-size: .76rem; color: #94a3b8; margin-top: 5px; }

/* ── Section headers ── */
.bk-section { margin-bottom: 28px; }
.bk-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.bk-section-header-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bk-section-title-block h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #0f1f3d; }
.bk-section-title-block p  { margin: 0; font-size: .78rem; color: #94a3b8; }

/* ── Schedule config card ── */
.bk-sched-config { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.bk-sched-config-top { background: linear-gradient(135deg, #0f2460 0%, #1e3a8a 100%); padding: 22px 24px; }
.bk-sched-config-top h3 { margin: 0 0 4px; color: #fff; font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 9px; }
.bk-sched-config-top p  { margin: 0; color: rgba(255,255,255,.65); font-size: .82rem; }
.bk-sched-config-body { padding: 24px; }

.bk-freq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
.bk-freq-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all .18s; background: #fafafa; text-align: center; }
.bk-freq-card:hover { border-color: #1e3a8a; background: #f0f4ff; }
.bk-freq-card.active { border-color: #1e3a8a; background: #eff6ff; }
.bk-freq-card.active .bk-freq-card-icon { background: #1e3a8a; color: #fff; }
.bk-freq-card-icon { width: 36px; height: 36px; border-radius: 9px; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; transition: all .18s; }
.bk-freq-card-label { font-size: .8rem; font-weight: 700; color: #0f1f3d; }
.bk-freq-card-desc  { font-size: .69rem; color: #94a3b8; margin-top: 2px; }

.bk-config-row { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.bk-config-field { flex: 1; min-width: 160px; }
.bk-config-field label { display: block; font-size: .76rem; font-weight: 700; color: #374151; margin-bottom: 7px; }
.bk-time-input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: .88rem; color: #0f1f3d; background: #fff; font-family: 'Sora', sans-serif; width: 100%; transition: border-color .15s; }
.bk-time-input:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,.1); }
.bk-day-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.bk-day-btn { padding: 7px 13px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; }
.bk-day-btn:hover { border-color: #1e3a8a; color: #1e3a8a; background: #eff6ff; }
.bk-day-btn.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
.bk-hours-btns { display: flex; gap: 6px; }
.bk-hours-btn { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .8rem; font-weight: 700; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; color: #64748b; }
.bk-hours-btn.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }

/* ── Schedules table ── */
.bk-sched-table-wrap { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.bk-sched-table-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
.bk-sched-table-header h3 { margin: 0; font-size: .95rem; font-weight: 700; color: #0f1f3d; }
.bk-sched-table { width: 100%; border-collapse: collapse; }
.bk-sched-table thead { background: #0f2460; }
.bk-sched-table th { padding: 11px 16px; color: rgba(255,255,255,.85); font-size: .68rem; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; text-align: left; white-space: nowrap; }
.bk-sched-table td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; font-size: .82rem; color: #374151; }
.bk-sched-table tbody tr:last-child td { border-bottom: none; }
.bk-sched-table tbody tr:hover td { background: #fafcff; }
.bk-badge-active   { background: #dcfce7; color: #15803d; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; }
.bk-badge-inactive { background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; }
.bk-cron-code { font-family: 'JetBrains Mono', monospace; font-size: .76rem; background: #1e293b; color: #7dd3fc; padding: 3px 8px; border-radius: 5px; }

/* ── Buttons ── */
.bk-btn { padding: 10px 18px; border-radius: 9px; border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: .86rem; font-weight: 700; display: inline-flex; align-items: center; gap: 7px; transition: all .2s; }
.bk-btn-primary { background: #1e3a8a; color: white; box-shadow: 0 4px 12px rgba(30,58,138,.25); }
.bk-btn-primary:hover { background: #1e40af; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(30,58,138,.35); }
.bk-btn-ghost { background: #f8fafc; color: #374151; border: 1.5px solid #e2e8f0; }
.bk-btn-ghost:hover { background: #f1f5f9; }
.bk-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.bk-btn-save { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #fff; box-shadow: 0 4px 14px rgba(30,58,138,.3); }
.bk-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,58,138,.4); }

.bk-icon-btn { padding: 7px 11px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-family: 'Sora', sans-serif; font-weight: 600; transition: all .15s; border: 1.5px solid; }
.bk-icon-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Toolbar ── */
.bk-toolbar { background: white; padding: 14px 18px; border-radius: 14px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.06); border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.bk-filter-chips { display: flex; gap: 6px; }
.bk-chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white; font-size: .76rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; }
.bk-chip:hover { border-color: #1e3a8a; color: #1e3a8a; }
.bk-chip.active { background: #1e3a8a; color: white; border-color: #1e3a8a; }

/* ── Backups table ── */
.bk-table-wrap { background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.06); border: 1px solid #f1f5f9; overflow: hidden; }
.bk-table { width: 100%; border-collapse: collapse; }
.bk-table thead { background: #f8fafc; }
.bk-table th { padding: 12px 16px; text-align: left; font-size: .68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .6px; border-bottom: 2px solid #f1f5f9; white-space: nowrap; }
.bk-table td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.bk-table tbody tr:hover { background: #fafcff; }
.bk-table tbody tr:last-child td { border-bottom: none; }
.bk-empty { padding: 56px; text-align: center; color: #94a3b8; }
.bk-foot { padding: 10px 16px; font-size: .77rem; color: #94a3b8; border-top: 1px solid #f1f5f9; }

.bk-filename { font-weight: 700; color: #0f1f3d; font-size: .82rem; font-family: 'JetBrains Mono', monospace; }
.bk-size-chip { background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-size: .76rem; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }

.bk-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: .74rem; font-weight: 700; }
.bk-badge-auto   { background: #ede9fe; color: #5b21b6; }
.bk-badge-manual { background: #dcfce7; color: #14532d; }
.bk-badge-sub    { background: #fef3c7; color: #78350f; font-size: .68rem; padding: 2px 8px; margin-left: 4px; }

.bk-row-actions { display: flex; gap: 6px; }
.bk-act { padding: 7px 13px; border: none; border-radius: 8px; cursor: pointer; font-size: .78rem; font-family: 'Sora', sans-serif; font-weight: 700; display: flex; align-items: center; gap: 5px; transition: all .15s; }
.bk-act-dl  { background: #dcfce7; color: #166534; }
.bk-act-dl:hover  { background: #bbf7d0; }
.bk-act-del { background: #fee2e2; color: #991b1b; }
.bk-act-del:hover { background: #fca5a5; }
.bk-act:disabled { opacity: .4; cursor: not-allowed; }

/* ── Modals & overlays ── */
.bk-overlay { position: fixed; inset: 0; background: rgba(15,31,61,.55); backdrop-filter: blur(4px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.bk-modal { background: white; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 28px 64px rgba(0,0,0,.25); animation: bkIn .22s ease; padding: 30px; text-align: center; }
@keyframes bkIn { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
.bk-modal-icon { font-size: 3rem; margin-bottom: 12px; }
.bk-modal h3 { margin: 0 0 8px; color: #0f1f3d; font-size: 1.1rem; font-weight: 800; }
.bk-modal p  { margin: 0 0 24px; color: #64748b; font-size: .88rem; line-height: 1.55; }
.bk-modal-actions { display: flex; gap: 10px; justify-content: center; }

.bk-generating { position: fixed; inset: 0; background: rgba(15,31,61,.7); backdrop-filter: blur(6px); z-index: 5000; display: flex; align-items: center; justify-content: center; }
.bk-generating-box { background: white; border-radius: 20px; padding: 40px 52px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.3); }
.bk-generating-box h3 { margin: 18px 0 8px; color: #0f1f3d; font-size: 1.15rem; font-weight: 800; }
.bk-generating-box p  { margin: 0; color: #64748b; font-size: .88rem; }
.bk-spinner { width: 56px; height: 56px; border: 5px solid #e2e8f0; border-top-color: #1e3a8a; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.bk-toast { position: fixed; bottom: 28px; right: 28px; z-index: 9999; padding: 13px 22px; border-radius: 12px; color: white; font-family: 'Sora', sans-serif; font-size: .86rem; font-weight: 700; box-shadow: 0 8px 28px rgba(0,0,0,.22); animation: bkIn .3s ease; display: flex; align-items: center; gap: 9px; }
.bk-toast.ok  { background: linear-gradient(135deg, #166534, #15803d); }
.bk-toast.err { background: linear-gradient(135deg, #991b1b, #b91c1c); }

.spinning { animation: spin .8s linear infinite; }

/* ── Divider ── */
.bk-divider { display: flex; align-items: center; gap: 16px; margin: 32px 0; }
.bk-divider::before, .bk-divider::after { content:''; flex:1; height:1px; background: #e2e8f0; }
.bk-divider span { font-size: .72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; }
`;
export default CSS;
