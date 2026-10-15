const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
* { box-sizing: border-box; }
.mp { font-family: 'DM Sans', sans-serif; background: #ebebeb; min-height: 100vh; }

/* Top bar */
.mp-topbar {
  background: #1e3a5f; padding: 14px 24px;
  display: flex; align-items: center; gap: 16px;
}
.mp-topbar-back {
  background: none; border: none; color: rgba(255,255,255,.7);
  font-size: .85rem; font-weight: 600; cursor: pointer; font-family: inherit;
  display: flex; align-items: center; gap: 6px; padding: 0;
}
.mp-topbar-back:hover { color: white; }
.mp-topbar-title { color: white; font-size: 1rem; font-weight: 700; margin: 0; }

/* Layout */
.mp-body { max-width: 900px; margin: 0 auto; padding: 24px 16px; }

/* Header card */
.mp-head-card {
  background: white; border-radius: 6px; padding: 20px 24px;
  margin-bottom: 16px; display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.mp-head-title { font-size: 1.3rem; font-weight: 700; color: #1e3a5f; margin: 0 0 4px; }
.mp-head-sub   { font-size: .82rem; color: #9ca3af; margin: 0; }

/* Filter tabs */
.mp-filters {
  background: white; border-radius: 6px; padding: 0 24px;
  margin-bottom: 16px; display: flex; gap: 0; overflow-x: auto;
  border-bottom: 1px solid #f3f4f6;
}
.mp-ftab {
  padding: 14px 18px; border: none; background: none; cursor: pointer;
  font-size: .85rem; font-weight: 500; color: #6b7280; white-space: nowrap;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  font-family: inherit; transition: all .15s;
}
.mp-ftab.active { color: #1e3a5f; border-bottom-color: #1e3a5f; font-weight: 700; }
.mp-ftab:hover:not(.active) { color: #1e3a5f; }

/* Section date header */
.mp-date-header {
  font-size: .82rem; font-weight: 700; color: #6b7280;
  padding: 8px 0 10px; text-transform: uppercase; letter-spacing: .5px;
}

/* Order card */
.mp-order {
  background: white; border-radius: 6px; margin-bottom: 12px;
  overflow: hidden; border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
}
.mp-order:hover { box-shadow: 0 2px 12px rgba(0,0,0,.1); }

/* Order header strip */
.mp-order-strip {
  background: #f9fafb; padding: 10px 20px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;
  cursor: pointer;
}
.mp-order-strip-left { display: flex; align-items: center; gap: 16px; }
.mp-order-strip-label { font-size: .72rem; color: #9ca3af; text-transform: uppercase; letter-spacing: .4px; }
.mp-order-strip-val   { font-size: .82rem; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; }

/* Status badge */
.mp-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 4px; font-size: .78rem; font-weight: 700;
}
.mp-badge-dot { width: 6px; height: 6px; border-radius: 50%; }

/* Item rows */
.mp-item-row {
  padding: 18px 20px; display: flex; align-items: flex-start; gap: 16px;
  border-bottom: 1px solid #f3f4f6;
}
.mp-item-row:last-of-type { border-bottom: none; }
.mp-item-img {
  width: 72px; height: 72px; border-radius: 6px; object-fit: cover;
  background: #f3f4f6; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  border: 1px solid #e5e7eb;
}
.mp-item-main { flex: 1; min-width: 0; }
.mp-item-name { font-size: .9rem; font-weight: 600; color: #111827; line-height: 1.4; margin-bottom: 4px; }
.mp-item-meta { font-size: .78rem; color: #9ca3af; }
.mp-item-right { text-align: right; flex-shrink: 0; }
.mp-item-price  { font-size: .95rem; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace; }
.mp-item-qty    { font-size: .76rem; color: #9ca3af; margin-top: 2px; }

/* Footer de la order */
.mp-order-foot {
  padding: 14px 20px; background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
.mp-foot-info { font-size: .78rem; color: #6b7280; display: flex; align-items: center; gap: 6px; }
.mp-foot-total { font-size: 1rem; font-weight: 700; color: #1e3a5f; font-family: 'JetBrains Mono', monospace; }
.mp-foot-actions { display: flex; gap: 8px; }
.mp-btn-primary {
  background: #1e3a5f; color: white; border: none;
  padding: 8px 18px; border-radius: 6px; font-size: .82rem;
  font-weight: 700; cursor: pointer; font-family: inherit;
  transition: background .15s;
}
.mp-btn-primary:hover { background: #2c5282; }
.mp-btn-secondary {
  background: white; color: #1e3a5f; border: 1.5px solid #1e3a5f;
  padding: 8px 18px; border-radius: 6px; font-size: .82rem;
  font-weight: 600; cursor: pointer; font-family: inherit;
  transition: all .15s;
}
.mp-btn-secondary:hover { background: #f0f4f8; }

/* Timeline expandido */
.mp-timeline-section { padding: 20px; background: white; border-top: 1px solid #f3f4f6; }
.mp-tl-title { font-size: .72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 16px; }
.mp-tl {
  display: flex; align-items: flex-start; position: relative;
}
.mp-tl-step { flex: 1; display: flex; flex-direction: column; align-items: center; }
.mp-tl-line {
  position: absolute; top: 12px; left: 12.5%; right: 12.5%;
  height: 2px; background: #e5e7eb;
}
.mp-tl-node {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid #e5e7eb; background: white;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; z-index: 1; position: relative;
  transition: all .25s;
}
.mp-tl-node.done    { border-color: #10b981; background: #d1fae5; color: #065f46; }
.mp-tl-node.current { border-color: #1e3a5f; background: #dbeafe; color: #1e3a5f; box-shadow: 0 0 0 4px #dbeafe; }
.mp-tl-lbl { font-size: .65rem; color: #9ca3af; margin-top: 6px; text-align: center; font-weight: 500; line-height: 1.3; max-width: 70px; }
.mp-tl-lbl.done { color: #10b981; font-weight: 700; }
.mp-tl-lbl.current { color: #1e3a5f; font-weight: 700; }

/* Detalles del pedido expandido */
.mp-detail-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 16px 20px; border-top: 1px solid #f3f4f6; background: #fafafa;
}
.mp-detail-box { background: white; border-radius: 6px; padding: 12px 14px; border: 1px solid #e5e7eb; }
.mp-detail-lbl { font-size: .68rem; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
.mp-detail-val { font-size: .85rem; color: #111827; font-weight: 600; }

/* Cancelado */
.mp-cancelled-bar {
  background: #fef2f2; border-top: 1px solid #fecaca;
  padding: 12px 20px; display: flex; align-items: center; gap: 10px;
  font-size: .82rem; color: #991b1b; font-weight: 600;
}

/* Empty / loading */
.mp-empty { background: white; border-radius: 6px; padding: 60px 20px; text-align: center; }
.mp-loading { text-align: center; padding: 80px 20px; color: #9ca3af; }
.spinning { animation: spin .9s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .mp-detail-grid { grid-template-columns: 1fr; }
  .mp-order-strip-left { gap: 10px; }
  .mp-foot-actions { width: 100%; }
  .mp-btn-primary, .mp-btn-secondary { flex: 1; text-align: center; }
}

/* Nueva dirección visual */
.mp {
  color:#0b1f33;
  background:
    radial-gradient(circle at 94% 0%,rgba(49,87,245,.09),transparent 28rem),
    #f5f7f2;
}
.mp-topbar {
  min-height:68px; padding:14px max(20px,calc((100vw - 1040px)/2));
  background:#0b1f33; border-radius:0 0 24px 24px;
}
.mp-topbar-back {
  min-height:38px; padding:0 14px;
  border:1px solid rgba(255,255,255,.15); border-radius:999px;
}
.mp-topbar-title { font-size:.82rem; letter-spacing:.12em; text-transform:uppercase; }
.mp-body { max-width:1040px; padding:42px 20px 90px; }
.mp-head-card {
  position:relative; min-height:245px; padding:46px;
  align-items:flex-end; margin-bottom:20px;
  border:0; border-radius:28px; overflow:hidden;
  background:#3157f5; color:#fff;
  box-shadow:0 22px 55px rgba(49,87,245,.18);
}
.mp-head-card::before {
  content:""; position:absolute; width:300px; height:300px;
  right:-90px; top:-190px; border:54px solid #c7f22b; border-radius:50%;
}
.mp-head-eyebrow {
  position:relative; display:block; margin-bottom:13px;
  color:rgba(255,255,255,.7); font-size:.7rem; font-weight:700;
  letter-spacing:.14em; text-transform:uppercase;
}
.mp-head-title {
  position:relative; margin:0;
  color:#fff; font-size:clamp(2.35rem,5vw,4rem);
  line-height:.96; letter-spacing:-.055em;
}
.mp-head-sub {
  position:relative; max-width:480px; margin-top:15px;
  color:rgba(255,255,255,.72); font-size:.92rem; line-height:1.6;
}
.mp-filters {
  gap:7px; padding:9px; margin-bottom:26px;
  border:1px solid rgba(11,31,51,.09); border-radius:999px;
  box-shadow:0 8px 25px rgba(11,31,51,.045);
}
.mp-ftab {
  min-height:40px; padding:0 17px;
  border:0; border-radius:999px; margin:0;
}
.mp-ftab.active { color:#fff; background:#0b1f33; border:0; }
.mp-date-header {
  padding:18px 4px 12px; color:#637083; letter-spacing:.12em;
}
.mp-order {
  margin-bottom:18px;
  border:1px solid rgba(11,31,51,.1); border-radius:22px;
  box-shadow:0 10px 30px rgba(11,31,51,.05);
}
.mp-order:hover { box-shadow:0 18px 42px rgba(11,31,51,.1); }
.mp-order-strip { padding:16px 22px; background:#fafbf8; }
.mp-order-strip-left { gap:28px; }
.mp-order-strip-label { color:#8b95a3; letter-spacing:.08em; }
.mp-order-strip-val { color:#0b1f33; }
.mp-badge { padding:6px 11px; border-radius:999px; }
.mp-item-row { padding:20px 22px; }
.mp-item-img {
  width:82px; height:82px; border:0; border-radius:16px;
  background:#f1f3ee; overflow:hidden;
}
.mp-item-name { color:#0b1f33; font-size:.96rem; }
.mp-item-price { color:#0b1f33; }
.mp-order-foot { padding:16px 22px; background:#fafbf8; }
.mp-btn-primary,.mp-btn-secondary {
  min-height:40px; padding-inline:18px; border-radius:999px;
}
.mp-btn-primary { background:#3157f5; }
.mp-btn-secondary { color:#0b1f33; border-color:rgba(11,31,51,.2); }
.mp-timeline-section { padding:26px 22px; }
.mp-tl-node { width:30px; height:30px; }
.mp-tl-line { top:14px; }
.mp-detail-grid { padding:18px 22px; background:#f6f7f3; }
.mp-detail-box { padding:15px 16px; border-radius:14px; }
.mp-empty {
  min-height:360px; display:grid; place-content:center;
  border:1px dashed rgba(11,31,51,.18); border-radius:24px;
}

/* El historial conserva la misma jerarquía visual al cambiar de tema. */
body[data-bs-theme="dark"] .mp {
  color:#edf3ff;
  background:radial-gradient(circle at 94% 0%,rgba(49,87,245,.15),transparent 28rem),#07111f;
}
body[data-bs-theme="dark"] .mp-filters,
body[data-bs-theme="dark"] .mp-order,
body[data-bs-theme="dark"] .mp-empty,
body[data-bs-theme="dark"] .mp-timeline-section,
body[data-bs-theme="dark"] .mp-detail-box { background:#111d30; border-color:#263650; }
body[data-bs-theme="dark"] .mp-order-strip,
body[data-bs-theme="dark"] .mp-order-foot,
body[data-bs-theme="dark"] .mp-detail-grid { background:#142239; border-color:#263650; }
body[data-bs-theme="dark"] .mp-item-row { border-color:#263650; }
body[data-bs-theme="dark"] .mp-order-strip-val,
body[data-bs-theme="dark"] .mp-item-name,
body[data-bs-theme="dark"] .mp-item-price,
body[data-bs-theme="dark"] .mp-foot-total,
body[data-bs-theme="dark"] .mp-detail-val { color:#f4f8ff; }
body[data-bs-theme="dark"] .mp-date-header,
body[data-bs-theme="dark"] .mp-order-strip-label,
body[data-bs-theme="dark"] .mp-item-meta,
body[data-bs-theme="dark"] .mp-item-qty,
body[data-bs-theme="dark"] .mp-foot-info,
body[data-bs-theme="dark"] .mp-detail-lbl,
body[data-bs-theme="dark"] .mp-tl-title,
body[data-bs-theme="dark"] .mp-tl-lbl { color:#aebed3; }
body[data-bs-theme="dark"] .mp-ftab { color:#aebed3; }
body[data-bs-theme="dark"] .mp-ftab.active { background:#3157f5; color:#fff; }
body[data-bs-theme="dark"] .mp-btn-secondary { background:#0b1627; color:#edf3ff; border-color:#465b7d; }
body[data-bs-theme="dark"] .mp-btn-secondary:hover { background:#1b2b44; }
body[data-bs-theme="dark"] .mp-item-img { background:#0b1627; }
body[data-bs-theme="dark"] .mp-tl-line { background:#30425e; }
body[data-bs-theme="dark"] .mp-tl-node { background:#111d30; border-color:#465b7d; }

@media(max-width:600px) {
  .mp-body { padding:24px 12px 60px; }
  .mp-head-card { min-height:220px; padding:30px 24px; border-radius:22px; }
  .mp-head-title { font-size:2.65rem; }
  .mp-filters { border-radius:17px; overflow-x:auto; }
  .mp-order { border-radius:18px; }
  .mp-order-strip { align-items:flex-start; }
  .mp-order-strip-left { display:grid; grid-template-columns:1fr 1fr; gap:12px 24px; }
  .mp-item-row { gap:12px; padding:17px 15px; }
  .mp-item-img { width:64px; height:64px; border-radius:13px; }
  .mp-item-right { max-width:100px; }
  .mp-order-foot { align-items:flex-end; }
}
`;
export default CSS;
