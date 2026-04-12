// ============================================================
// DireccionCheckout.jsx
// Componente de selección/gestión de dirección dentro del checkout.
// Úsalo en tu carrito / página de pago así:
//
//   import DireccionCheckout from "./DireccionCheckout";
//
//   <DireccionCheckout
//     onDireccionSelect={(dir) => setDireccionSeleccionada(dir)}
//     direccionActual={direccionSeleccionada}
//   />
// ============================================================

import React, { useState, useEffect } from "react";

const API_URL = "https://sl-back.vercel.app";
const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const ESTADOS_MX = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas",
  "Chihuahua","Ciudad de México","Coahuila","Colima","Durango","Estado de México",
  "Guanajuato","Guerrero","Hidalgo","Jalisco","Michoacán","Morelos","Nayarit",
  "Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí",
  "Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas",
];

const TIPO_ICONS = { casa: "🏠", trabajo: "🏢", otro: "📍" };

const EMPTY_FORM = {
  alias: "", tipo: "casa",
  nombre_receptor: "", telefono: "",
  calle: "", numero_ext: "", numero_int: "",
  colonia: "", ciudad: "", estado: "", cp: "",
  referencias: "", predeterminada: false,
};

// ─── CSS ───────────────────────────────────────────────────────────────────
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

@media(max-width:480px) {
  .dch-sheet { border-radius:16px 16px 0 0; max-height:95vh; }
  .dch-overlay { align-items:flex-end; padding:0; }
  .dch-form-row { grid-template-columns:1fr; }
}
`;

// ─── Toast helper ──────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`dch-toast ${type === "error" ? "err" : ""}`}>
      {type === "error" ? "✕" : "✓"} {msg}
    </div>
  );
}

// ─── Formulario de dirección ───────────────────────────────────────────────
function FormularioDireccion({ inicial, onGuardar, onCancelar, saving }) {
  const [form, setForm] = useState(inicial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function validar() {
    const e = {};
    if (!form.nombre_receptor.trim()) e.nombre_receptor = true;
    if (!form.telefono.trim() || !/^\d{10}$/.test(form.telefono.replace(/\s/g, ""))) e.telefono = true;
    if (!form.calle.trim())      e.calle = true;
    if (!form.numero_ext.trim()) e.numero_ext = true;
    if (!form.colonia.trim())    e.colonia = true;
    if (!form.ciudad.trim())     e.ciudad = true;
    if (!form.estado)            e.estado = true;
    if (!form.cp.trim() || !/^\d{5}$/.test(form.cp)) e.cp = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (validar()) onGuardar(form);
  }

  return (
    <div className="dch-form">
      <button className="dch-form-back" onClick={onCancelar}>
        ← Volver a mis direcciones
      </button>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Alias (opcional)</label>
          <input placeholder="Ej: Casa de mamá" value={form.alias} onChange={e => set("alias", e.target.value)} />
        </div>
        <div className="dch-fg">
          <label>Nombre del receptor *</label>
          <input className={errors.nombre_receptor ? "err" : ""} placeholder="Nombre completo"
            value={form.nombre_receptor} onChange={e => set("nombre_receptor", e.target.value)} />
        </div>
      </div>

      <div className="dch-fg">
        <label>Teléfono (10 dígitos) *</label>
        <input className={errors.telefono ? "err" : ""} placeholder="5512345678" maxLength={10}
          value={form.telefono} onChange={e => set("telefono", e.target.value.replace(/\D/g, ""))} />
      </div>

      <div className="dch-fg full">
        <label>Calle *</label>
        <input className={errors.calle ? "err" : ""} placeholder="Nombre de la calle"
          value={form.calle} onChange={e => set("calle", e.target.value)} />
      </div>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Núm. exterior *</label>
          <input className={errors.numero_ext ? "err" : ""} placeholder="123"
            value={form.numero_ext} onChange={e => set("numero_ext", e.target.value)} />
        </div>
        <div className="dch-fg">
          <label>Núm. interior</label>
          <input placeholder="3B (opcional)" value={form.numero_int} onChange={e => set("numero_int", e.target.value)} />
        </div>
      </div>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Colonia *</label>
          <input className={errors.colonia ? "err" : ""} placeholder="Nombre de colonia"
            value={form.colonia} onChange={e => set("colonia", e.target.value)} />
        </div>
        <div className="dch-fg">
          <label>Código postal *</label>
          <input className={errors.cp ? "err" : ""} placeholder="12345" maxLength={5}
            value={form.cp} onChange={e => set("cp", e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Ciudad / Municipio *</label>
          <input className={errors.ciudad ? "err" : ""} placeholder="Ciudad"
            value={form.ciudad} onChange={e => set("ciudad", e.target.value)} />
        </div>
        <div className="dch-fg">
          <label>Estado *</label>
          <select className={errors.estado ? "err" : ""} value={form.estado} onChange={e => set("estado", e.target.value)}>
            <option value="">Selecciona…</option>
            {ESTADOS_MX.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="dch-fg">
        <label>Referencias adicionales</label>
        <input placeholder="Ej: Entre calles Juárez y Morelos, casa azul"
          value={form.referencias} onChange={e => set("referencias", e.target.value)} />
      </div>

      <label className="dch-check-row">
        <input type="checkbox" checked={form.predeterminada} onChange={e => set("predeterminada", e.target.checked)} />
        <span>Establecer como dirección predeterminada</span>
      </label>

      <div className="dch-form-footer">
        <button className="dch-btn-cancel" onClick={onCancelar}>Cancelar</button>
        <button className="dch-btn-save" onClick={submit} disabled={saving}>
          {saving ? <span className="dch-spinner" /> : "✓"}
          {saving ? "Guardando…" : inicial?.id ? "Guardar cambios" : "Agregar dirección"}
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function DireccionCheckout({ onDireccionSelect, direccionActual }) {
  const [direcciones,  setDirecciones]  = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [open,         setOpen]         = useState(false);
  // vista: "lista" | "nueva" | "editar"
  const [vista,        setVista]        = useState("lista");
  const [editando,     setEditando]     = useState(null);
  const [tempSelected, setTempSelected] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);

  useEffect(() => {
    if (open) cargar();
  }, [open]);

  // Al abrir, preseleccionar la dirección actual si existe
  useEffect(() => {
    if (open && direcciones.length) {
      setTempSelected(
        direccionActual?.id ||
        direcciones.find(d => d.predeterminada)?.id ||
        direcciones[0]?.id
      );
    }
  }, [open, direcciones]);

  async function cargar() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/addresses`, { headers: auth() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];
      setDirecciones(lista);
      // Si no hay dirección seleccionada aún, tomar la predeterminada
      if (!direccionActual && lista.length) {
        const def = lista.find(d => d.predeterminada) || lista[0];
        onDireccionSelect && onDireccionSelect(def);
      }
    } catch {
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial silenciosa para mostrar la dirección en el checkout sin abrir el sheet
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/addresses`, { headers: auth() });
        if (!res.ok) return;
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setDirecciones(lista);
        if (!direccionActual && lista.length) {
          const def = lista.find(d => d.predeterminada) || lista[0];
          onDireccionSelect && onDireccionSelect(def);
        }
      } catch {}
    })();
  }, []);

  async function guardar(formData) {
    setSaving(true);
    try {
      const url    = editando ? `${API_URL}/api/user/addresses/${editando.id}` : `${API_URL}/api/user/addresses`;
      const method = editando ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: auth(), body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      const savedRes = await fetch(`${API_URL}/api/user/addresses`, { headers: auth() });
      const lista = savedRes.ok ? await savedRes.json() : [];
      setDirecciones(lista);
      setToast({ msg: editando ? "Dirección actualizada" : "Dirección agregada", type: "ok" });
      setVista("lista");
      setEditando(null);
      // Si acabamos de agregar la primera, seleccionarla
      if (!editando && lista.length === 1) {
        setTempSelected(lista[0].id);
      }
    } catch {
      setToast({ msg: "Error al guardar la dirección", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  function confirmarSeleccion() {
    const dir = direcciones.find(d => d.id === tempSelected);
    if (dir) {
      onDireccionSelect && onDireccionSelect(dir);
      setOpen(false);
      setVista("lista");
    }
  }

  function abrirEditar(dir) {
    setEditando(dir);
    setVista("editar");
  }

  function cerrarSheet() {
    setOpen(false);
    setVista("lista");
    setEditando(null);
  }

  // ── RENDER DEL BLOQUE EN EL CHECKOUT ──────────────────────────────────
  const dirActiva = direccionActual || direcciones.find(d => d.predeterminada) || direcciones[0];

  return (
    <div className="dch">
      <style>{CSS}</style>

      {/* Bloque compacto en el checkout */}
      <div className="dch-block">
        <div className="dch-block-head">
          <div className="dch-block-title">
            <span>📍</span> Dirección de envío
          </div>
          {dirActiva && (
            <button className="dch-change-btn" onClick={() => setOpen(true)}>
              Cambiar dirección ›
            </button>
          )}
        </div>

        {dirActiva ? (
          <div className="dch-selected">
            <div className="dch-sel-icon">{TIPO_ICONS[dirActiva.tipo] || "📍"}</div>
            <div className="dch-sel-info">
              <div className="dch-sel-name">
                {dirActiva.alias || dirActiva.nombre_receptor}
                {dirActiva.predeterminada && <span className="dch-sel-badge">★ Predeterminada</span>}
              </div>
              <div className="dch-sel-addr">
                {dirActiva.calle} {dirActiva.numero_ext}{dirActiva.numero_int ? ` Int. ${dirActiva.numero_int}` : ""}, Col. {dirActiva.colonia}<br />
                {dirActiva.ciudad}, {dirActiva.estado} C.P. {dirActiva.cp}
                {dirActiva.referencias && <><br /><span style={{ color: "#a0aec0", fontStyle: "italic" }}>{dirActiva.referencias}</span></>}
              </div>
              <div className="dch-sel-phone">📞 {dirActiva.telefono} · {dirActiva.nombre_receptor}</div>
            </div>
          </div>
        ) : (
          <div className="dch-empty">
            <div className="dch-empty-text">No tienes ninguna dirección guardada</div>
            <button className="dch-empty-add-btn" onClick={() => { setOpen(true); setVista("nueva"); }}>
              + Agregar dirección de envío
            </button>
          </div>
        )}
      </div>

      {/* Sheet / Modal */}
      {open && (
        <div className="dch-overlay" onClick={e => e.target === e.currentTarget && cerrarSheet()}>
          <div className="dch-sheet">
            <div className="dch-sheet-head">
              <h2>
                {vista === "lista" ? "Mis direcciones" : vista === "nueva" ? "Nueva dirección" : "Editar dirección"}
              </h2>
              <button className="dch-close-btn" onClick={cerrarSheet}>✕</button>
            </div>

            {/* VISTA LISTA */}
            {vista === "lista" && (
              <>
                {loading ? (
                  <div className="dch-loading">Cargando direcciones…</div>
                ) : (
                  <>
                    <div className="dch-list">
                      {direcciones.map(dir => (
                        <div
                          key={dir.id}
                          className={`dch-dir-option ${tempSelected === dir.id ? "selected" : ""}`}
                          onClick={() => setTempSelected(dir.id)}
                        >
                          <div className="dch-dir-option-top">
                            <div className="dch-dir-option-icon">{TIPO_ICONS[dir.tipo] || "📍"}</div>
                            <div className="dch-dir-option-info">
                              <div className="dch-dir-option-name">
                                {dir.alias || dir.nombre_receptor}
                                {dir.predeterminada && <span className="dch-sel-badge">★</span>}
                              </div>
                              <div className="dch-dir-option-tipo">{dir.tipo || "otro"}</div>
                              <div className="dch-dir-option-addr">
                                {dir.calle} {dir.numero_ext}{dir.numero_int ? ` Int. ${dir.numero_int}` : ""}, Col. {dir.colonia}<br />
                                {dir.ciudad}, {dir.estado} C.P. {dir.cp}
                              </div>
                              <div className="dch-dir-option-phone">📞 {dir.telefono}</div>
                            </div>
                            <div className="dch-radio">
                              <div className="dch-radio-dot" />
                            </div>
                          </div>
                          <div className="dch-dir-option-actions">
                            <button className="dch-opt-edit-btn" onClick={e => { e.stopPropagation(); abrirEditar(dir); }}>
                              ✎ Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="dch-add-new-btn" onClick={() => setVista("nueva")}>
                      + Agregar nueva dirección
                    </button>

                    <div className="dch-confirm-bar">
                      <button
                        className="dch-confirm-btn"
                        disabled={!tempSelected}
                        onClick={confirmarSeleccion}
                      >
                        Usar esta dirección
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* VISTA FORMULARIO */}
            {(vista === "nueva" || vista === "editar") && (
              <FormularioDireccion
                inicial={
                  vista === "editar"
                    ? { ...editando }
                    : { ...EMPTY_FORM, predeterminada: direcciones.length === 0 }
                }
                onGuardar={guardar}
                onCancelar={() => { setVista("lista"); setEditando(null); }}
                saving={saving}
              />
            )}
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}