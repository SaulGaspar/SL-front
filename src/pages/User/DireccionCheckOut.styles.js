const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.dch * { box-sizing:border-box; font-family:'Outfit',sans-serif; }

/* ── BLOQUE DE DIRECCIÓN EN EL CHECKOUT ── */
.dch-block {
  background:white;
  border-radius:14px;
  border:1.5px solid #e2e8f0;
  overflow:hidden;
  margin-bottom:16px;
}
.dch-block-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid #f0f4f8;
  background:#fafbfc;
}
.dch-block-title {
  font-size:.82rem;
  font-weight:700;
  color:#1e3a5f;
  text-transform:uppercase;
  letter-spacing:.5px;
  display:flex;
  align-items:center;
  gap:7px;
}
.dch-block-title span { font-size:1rem; }
.dch-change-btn {
  font-size:.8rem;
  font-weight:600;
  color:#2563eb;
  background:transparent;
  border:none;
  cursor:pointer;
  padding:4px 0;
  transition:color .15s;
  display:flex;
  align-items:center;
  gap:4px;
}
.dch-change-btn:hover { color:#1e3a5f; }

/* ── DIRECCIÓN SELECCIONADA ── */
.dch-selected {
  padding:14px 18px;
  display:flex;
  align-items:flex-start;
  gap:12px;
}
.dch-sel-icon {
  width:36px; height:36px;
  border-radius:8px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  display:flex; align-items:center; justify-content:center;
  font-size:.95rem; flex-shrink:0; margin-top:2px;
}
.dch-sel-info { flex:1; min-width:0; }
.dch-sel-name {
  font-weight:700;
  font-size:.9rem;
  color:#1e3a5f;
  margin-bottom:2px;
  display:flex; align-items:center; gap:8px;
}
.dch-sel-badge {
  font-size:.62rem; font-weight:700;
  background:#ebf8ff; color:#2b6cb0;
  padding:2px 7px; border-radius:10px;
  letter-spacing:.3px; text-transform:uppercase;
}
.dch-sel-addr {
  font-size:.82rem;
  color:#4a5568;
  line-height:1.5;
}
.dch-sel-phone {
  font-size:.78rem;
  color:#718096;
  margin-top:3px;
}

/* ── SIN DIRECCIÓN ── */
.dch-empty {
  padding:18px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
  text-align:center;
}
.dch-empty-text {
  font-size:.85rem;
  color:#718096;
}
.dch-empty-add-btn {
  display:flex; align-items:center; gap:7px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  color:white; border:none;
  padding:10px 20px; border-radius:9px;
  font-family:'Outfit',sans-serif;
  font-size:.85rem; font-weight:700;
  cursor:pointer; transition:all .2s;
}
.dch-empty-add-btn:hover { opacity:.9; transform:translateY(-1px); }

/* ── OVERLAY ── */
.dch-overlay {
  position:fixed; inset:0;
  background:rgba(10,26,47,.55);
  z-index:1200;
  display:flex; align-items:center; justify-content:center;
  padding:20px;
  animation:dch-fade .18s ease;
}
@keyframes dch-fade { from{opacity:0} to{opacity:1} }

/* ── SHEET (panel tipo drawer en móvil) ── */
.dch-sheet {
  background:white;
  border-radius:18px;
  width:100%; max-width:560px;
  max-height:90vh;
  overflow-y:auto;
  box-shadow:0 24px 64px rgba(0,0,0,.2);
  animation:dch-up .22s ease;
}
@keyframes dch-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

.dch-sheet-head {
  padding:22px 24px 0;
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; background:white; z-index:1;
  border-bottom:1px solid #f0f4f8; padding-bottom:14px;
}
.dch-sheet-head h2 {
  font-size:1.1rem; font-weight:700; color:#1e3a5f; margin:0;
}
.dch-close-btn {
  width:32px; height:32px; border-radius:50%;
  border:none; background:#f0f4f8; color:#718096;
  font-size:.95rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all .15s;
}
.dch-close-btn:hover { background:#e2e8f0; color:#1e3a5f; }

/* ── LISTA DE DIRECCIONES ── */
.dch-list { padding:16px 24px; display:flex; flex-direction:column; gap:10px; }

.dch-dir-option {
  border:2px solid #e2e8f0;
  border-radius:12px; padding:14px 16px;
  cursor:pointer; transition:all .18s;
  position:relative;
}
.dch-dir-option:hover { border-color:#cbd5e0; background:#fafbfc; }
.dch-dir-option.selected {
  border-color:#1e3a5f;
  background:#f0f4f8;
}
.dch-dir-option-top {
  display:flex; align-items:flex-start; gap:10px; margin-bottom:6px;
}
.dch-dir-option-icon {
  width:32px; height:32px; border-radius:7px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f);
  display:flex; align-items:center; justify-content:center;
  font-size:.85rem; flex-shrink:0;
}
.dch-dir-option-info { flex:1; }
.dch-dir-option-name {
  font-weight:700; font-size:.88rem; color:#1e3a5f;
  display:flex; align-items:center; gap:6px;
}
.dch-dir-option-tipo {
  font-size:.7rem; color:#718096; text-transform:uppercase; letter-spacing:.4px;
}
.dch-dir-option-addr {
  font-size:.8rem; color:#4a5568; line-height:1.45; margin-top:3px;
}
.dch-dir-option-phone { font-size:.75rem; color:#718096; margin-top:2px; }
.dch-radio {
  width:18px; height:18px; border-radius:50%;
  border:2px solid #cbd5e0;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0; margin-top:2px; transition:border-color .15s;
}
.dch-dir-option.selected .dch-radio {
  border-color:#1e3a5f;
}
.dch-radio-dot {
  width:8px; height:8px; border-radius:50%;
  background:#1e3a5f; display:none;
}
.dch-dir-option.selected .dch-radio-dot { display:block; }
.dch-dir-option-actions {
  display:flex; gap:6px; margin-top:10px; padding-top:10px;
  border-top:1px solid #f0f4f8;
}
.dch-opt-edit-btn {
  flex:1; padding:7px; border:1.5px solid #e2e8f0; border-radius:7px;
  background:transparent; color:#4a5568;
  font-family:'Outfit',sans-serif; font-size:.76rem; font-weight:600;
  cursor:pointer; transition:all .15s;
  display:flex; align-items:center; justify-content:center; gap:4px;
}
.dch-opt-edit-btn:hover { border-color:#1e3a5f; color:#1e3a5f; background:#f0f4f8; }

/* ── BOTÓN AGREGAR NUEVA ── */
.dch-add-new-btn {
  margin:0 24px 16px;
  width:calc(100% - 48px);
  padding:12px;
  border:2px dashed #cbd5e0;
  border-radius:12px;
  background:transparent;
  color:#4a5568;
  font-family:'Outfit',sans-serif;
  font-size:.85rem; font-weight:600;
  cursor:pointer; transition:all .18s;
  display:flex; align-items:center; justify-content:center; gap:7px;
}
.dch-add-new-btn:hover { border-color:#1e3a5f; color:#1e3a5f; background:#f0f4f8; }

/* ── FORMULARIO ── */
.dch-form { padding:0 24px 24px; display:flex; flex-direction:column; gap:14px; }
.dch-form-back {
  display:flex; align-items:center; gap:6px;
  background:transparent; border:none;
  color:#2563eb; font-family:'Outfit',sans-serif;
  font-size:.82rem; font-weight:600; cursor:pointer;
  padding:0; transition:color .15s; margin-bottom:4px;
}
.dch-form-back:hover { color:#1e3a5f; }
.dch-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.dch-fg { display:flex; flex-direction:column; gap:5px; }
.dch-fg.full { grid-column:1/-1; }
.dch-location-btn {
  width:100%;
  border:none;
  border-radius:9px;
  background:#ebf3ff;
  color:#2563eb;
  padding:12px 14px;
  font-family:'Outfit',sans-serif;
  font-size:.86rem;
  font-weight:700;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  transition:all .18s;
}
.dch-location-btn:hover { background:#dbeafe; color:#1e3a5f; }
.dch-location-btn:disabled { opacity:.65; cursor:not-allowed; }
.dch-location-note {
  font-size:.72rem;
  color:#718096;
  line-height:1.35;
  margin-top:-8px;
}
.dch-location-note.err { color:#e53e3e; }
.dch-fg label {
  font-size:.7rem; font-weight:700; color:#4a5568;
  text-transform:uppercase; letter-spacing:.5px;
}
.dch-fg input, .dch-fg select {
  padding:10px 12px;
  border:1.5px solid #e2e8f0; border-radius:8px;
  font-size:.86rem; font-family:'Outfit',sans-serif; color:#1e3a5f;
  background:white; transition:border-color .15s, box-shadow .15s;
}
.dch-fg input:focus, .dch-fg select:focus {
  outline:none; border-color:#1e3a5f;
  box-shadow:0 0 0 3px rgba(30,58,95,.08);
}
.dch-fg input::placeholder { color:#cbd5e0; }
.dch-fg input.err { border-color:#e53e3e; }
.dch-fg select.err { border-color:#e53e3e; }
.dch-help {
  font-size:.72rem;
  color:#718096;
  line-height:1.35;
}
.dch-help.err { color:#e53e3e; }
.dch-inline-hint {
  display:flex;
  align-items:center;
  gap:6px;
}
.dch-mini-spinner {
  width:12px; height:12px;
  border:2px solid rgba(30,58,95,.18);
  border-top-color:#1e3a5f;
  border-radius:50%;
  animation:dch-spin .7s linear infinite;
}

.dch-tipo-row { display:flex; gap:8px; }
.dch-tipo-btn {
  flex:1; padding:9px;
  border:1.5px solid #e2e8f0; border-radius:8px;
  background:white; font-family:'Outfit',sans-serif;
  font-size:.8rem; font-weight:600; color:#718096;
  cursor:pointer; transition:all .15s; text-align:center;
}
.dch-tipo-btn.active { border-color:#1e3a5f; background:#f0f4f8; color:#1e3a5f; }

.dch-check-row { display:flex; align-items:center; gap:9px; cursor:pointer; }
.dch-check-row input { width:16px; height:16px; accent-color:#1e3a5f; cursor:pointer; }
.dch-check-row span { font-size:.83rem; color:#4a5568; font-weight:500; }

.dch-form-footer { display:flex; gap:10px; margin-top:4px; }
.dch-btn-cancel {
  flex:1; padding:12px;
  border:1.5px solid #e2e8f0; border-radius:9px;
  background:white; color:#718096;
  font-family:'Outfit',sans-serif; font-size:.88rem; font-weight:600;
  cursor:pointer; transition:all .15s;
}
.dch-btn-cancel:hover { border-color:#718096; color:#1e3a5f; }
.dch-btn-save {
  flex:2; padding:12px; border:none; border-radius:9px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f); color:white;
  font-family:'Outfit',sans-serif; font-size:.9rem; font-weight:700;
  cursor:pointer; transition:all .2s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.dch-btn-save:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(30,58,95,.25); }
.dch-btn-save:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }

.dch-map-box {
  border:1.5px solid #e2e8f0;
  border-radius:12px;
  overflow:hidden;
  background:#fafbfc;
}
.dch-map-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:10px 12px;
  border-bottom:1px solid #edf2f7;
}
.dch-map-title {
  font-size:.76rem;
  font-weight:700;
  color:#1e3a5f;
  text-transform:uppercase;
  letter-spacing:.4px;
}
.dch-map-link {
  color:#2563eb;
  font-size:.76rem;
  font-weight:700;
  text-decoration:none;
  white-space:nowrap;
}
.dch-map-link:hover { color:#1e3a5f; }
.dch-map-frame {
  width:100%;
  height:180px;
  border:0;
  display:block;
  background:#f0f4f8;
}

.dch-spinner {
  width:16px; height:16px;
  border:2.5px solid rgba(255,255,255,.3);
  border-top-color:white; border-radius:50%;
  animation:dch-spin .7s linear infinite;
}
@keyframes dch-spin { to{transform:rotate(360deg)} }

/* ── CONFIRM SELECT ── */
.dch-confirm-bar {
  display:flex; gap:10px;
  padding:14px 24px 20px;
  border-top:1px solid #f0f4f8;
  background:white;
  position:sticky; bottom:0;
}
.dch-confirm-btn {
  flex:1; padding:13px; border:none; border-radius:10px;
  background:linear-gradient(135deg,#0a1a2f,#1e3a5f); color:white;
  font-family:'Outfit',sans-serif; font-size:.92rem; font-weight:700;
  cursor:pointer; transition:all .2s;
}
.dch-confirm-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(30,58,95,.25); }
.dch-confirm-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }

/* ── TOAST ── */
.dch-toast {
  position:fixed; bottom:24px; right:24px; z-index:1400;
  background:#1e3a5f; color:white;
  padding:11px 18px; border-radius:9px;
  font-size:.83rem; font-weight:600;
  display:flex; align-items:center; gap:8px;
  box-shadow:0 8px 24px rgba(0,0,0,.18);
  animation:dch-up .22s ease;
}
.dch-toast.err { background:#e53e3e; }

/* ── LOADING ── */
.dch-loading {
  padding:28px; text-align:center;
  color:#a0aec0; font-size:.85rem;
}

/* ── Visual refresh SportLike ── */
.dch-block {
  border:1px solid rgba(10,26,47,.1);
  border-radius:24px;
  background:#fff;
  box-shadow:0 16px 38px rgba(10,26,47,.07);
}
.dch-block-head {
  padding:18px 20px;
  background:
    radial-gradient(circle at 96% -35%, rgba(189,230,50,.26), transparent 9rem),
    #fbfcff;
}
.dch-block-title {
  color:#0a1a2f;
  font-weight:900;
  letter-spacing:.08em;
}
.dch-change-btn {
  min-height:36px;
  padding:0 12px;
  border-radius:999px;
  background:rgba(36,79,219,.08);
  color:#244fdb;
  font-weight:850;
}
.dch-selected {
  padding:18px 20px;
}
.dch-sel-icon,
.dch-empty-icon,
.dch-form-icon {
  border-radius:16px;
  background:
    radial-gradient(circle at 18% 10%, rgba(189,230,50,.4), transparent 4rem),
    linear-gradient(145deg,#07182d,#102b4d);
}
.dch-sel-name {
  color:#0a1a2f;
  font-weight:900;
}
.dch-sel-badge {
  background:rgba(36,79,219,.08);
  color:#244fdb;
  border-radius:999px;
}
.dch-empty {
  padding:26px 20px;
}
.dch-empty-add-btn,
.dch-location-btn,
.dch-form-save,
.dch-confirm-btn {
  border-radius:16px;
  background:#244fdb;
  color:#fff;
  box-shadow:0 12px 24px rgba(36,79,219,.2);
}
.dch-empty-add-btn:hover,
.dch-location-btn:hover,
.dch-form-save:hover,
.dch-confirm-btn:hover {
  background:#183fc2;
}
.dch-overlay {
  backdrop-filter:blur(8px);
  background:rgba(4,13,26,.46);
}
.dch-sheet {
  border-radius:28px;
  border:1px solid rgba(10,26,47,.1);
  box-shadow:0 28px 80px rgba(0,0,0,.28);
}
.dch-sheet-head {
  background:
    radial-gradient(circle at 94% -30%, rgba(189,230,50,.38), transparent 10rem),
    linear-gradient(145deg,#07182d,#102b4d);
  color:#fff;
}
.dch-sheet-title,
.dch-sheet-subtitle {
  color:inherit;
}
.dch-sheet-subtitle {
  color:rgba(255,255,255,.65);
}
.dch-close-btn {
  border-radius:14px;
  background:rgba(255,255,255,.08);
  color:#fff;
}
.dch-dir-option,
.dch-form,
.dch-map-card {
  border-radius:20px;
  border:1px solid rgba(10,26,47,.1);
  background:#fff;
}
.dch-dir-option.selected {
  border-color:rgba(36,79,219,.45);
  background:rgba(36,79,219,.06);
}
.dch-opt-radio {
  border-color:#244fdb;
}
.dch-dir-option.selected .dch-opt-radio {
  background:#244fdb;
}
.dch-fg input,
.dch-fg select,
.dch-fg textarea {
  border-radius:14px;
  border:1px solid rgba(10,26,47,.13);
  background:#fbfcff;
}
.dch-fg input:focus,
.dch-fg select:focus,
.dch-fg textarea:focus {
  border-color:rgba(36,79,219,.55);
  box-shadow:0 0 0 4px rgba(36,79,219,.1);
}
.dch-map-frame {
  border-radius:0 0 20px 20px;
}
.dch-confirm-bar {
  padding:16px 24px 22px;
  background:rgba(255,255,255,.92);
  backdrop-filter:blur(12px);
}
.dch-toast {
  border-radius:16px;
  background:#07182d;
}

@media(max-width:480px) {
  .dch-sheet { border-radius:16px 16px 0 0; max-height:95vh; }
  .dch-overlay { align-items:flex-end; padding:0; }
  .dch-form-row { grid-template-columns:1fr; }
}

/* Superficies de dirección coherentes con el checkout oscuro. */
body[data-bs-theme="dark"] .dch-block,
body[data-bs-theme="dark"] .dch-sheet,
body[data-bs-theme="dark"] .dch-dir-option,
body[data-bs-theme="dark"] .dch-form,
body[data-bs-theme="dark"] .dch-map-card { background:#111d30; border-color:#263650; }
body[data-bs-theme="dark"] .dch-block-head { background:#142239; border-color:#263650; }
body[data-bs-theme="dark"] .dch-block-title,
body[data-bs-theme="dark"] .dch-sel-name,
body[data-bs-theme="dark"] .dch-dir-option-name,
body[data-bs-theme="dark"] .dch-sheet-head h2,
body[data-bs-theme="dark"] .dch-map-title { color:#f4f8ff; }
body[data-bs-theme="dark"] .dch-sel-addr,
body[data-bs-theme="dark"] .dch-sel-phone,
body[data-bs-theme="dark"] .dch-empty-text,
body[data-bs-theme="dark"] .dch-dir-option-addr,
body[data-bs-theme="dark"] .dch-dir-option-phone,
body[data-bs-theme="dark"] .dch-dir-option-tipo,
body[data-bs-theme="dark"] .dch-fg label,
body[data-bs-theme="dark"] .dch-help,
body[data-bs-theme="dark"] .dch-location-note,
body[data-bs-theme="dark"] .dch-check-row span,
body[data-bs-theme="dark"] .dch-loading { color:#aebed3; }
body[data-bs-theme="dark"] .dch-sheet-head { background:#0c1b2e; border-color:#263650; }
body[data-bs-theme="dark"] .dch-dir-option:hover { background:#16243a; border-color:#3c5273; }
body[data-bs-theme="dark"] .dch-dir-option.selected { background:#172846; border-color:#5f82d8; }
body[data-bs-theme="dark"] .dch-dir-option-actions,
body[data-bs-theme="dark"] .dch-map-head { border-color:#263650; }
body[data-bs-theme="dark"] .dch-fg input,
body[data-bs-theme="dark"] .dch-fg select,
body[data-bs-theme="dark"] .dch-fg textarea,
body[data-bs-theme="dark"] .dch-tipo-btn,
body[data-bs-theme="dark"] .dch-btn-cancel { background:#0b1627; color:#edf3ff; border-color:#30425e; }
body[data-bs-theme="dark"] .dch-fg input::placeholder { color:#71839d; }
body[data-bs-theme="dark"] .dch-confirm-bar { background:rgba(17,29,48,.94); border-color:#263650; }
body[data-bs-theme="dark"] .dch-map-box { background:#0b1627; border-color:#30425e; }
`;
export default CSS;
