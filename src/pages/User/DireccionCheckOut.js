import { API_BASE_URL } from "../../config/api";

import React, { useState, useEffect } from "react";

const API_URL = API_BASE_URL;
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
const CP_LOOKUP_URL = cp => `https://api.zippopotam.us/mx/${cp}`;
const REVERSE_GEOCODE_URL = (lat, lon) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=es`;

const ESTADO_ALIASES = {
  "cdmx": "Ciudad de México",
  "ciudad de mexico": "Ciudad de México",
  "ciudad de méxico": "Ciudad de México",
  "distrito federal": "Ciudad de México",
  "estado de mexico": "Estado de México",
  "estado de méxico": "Estado de México",
  "michoacan": "Michoacán",
  "michoacán de ocampo": "Michoacán",
  "nuevo leon": "Nuevo León",
  "queretaro": "Querétaro",
  "san luis potosi": "San Luis Potosí",
  "yucatan": "Yucatán",
};

const normalizarEstado = estado => {
  const limpio = (estado || "").trim();
  const key = limpio.toLowerCase();
  return ESTADO_ALIASES[key] || ESTADOS_MX.find(e => e.toLowerCase() === key) || limpio;
};

const unicos = lista => [...new Set(lista.filter(Boolean).map(v => v.trim()).filter(Boolean))];
const pick = (...valores) => valores.find(v => typeof v === "string" && v.trim())?.trim() || "";

const EMPTY_FORM = {
  alias: "", tipo: "casa",
  nombre_receptor: "", telefono: "",
  calle: "", numero_ext: "", numero_int: "",
  colonia: "", ciudad: "", estado: "", cp: "",
  referencias: "", predeterminada: false,
};

// ─── CSS ───────────────────────────────────────────────────────────────────
import CSS from "./DireccionCheckOut.styles";
export { CSS };

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
export function FormularioDireccion({ inicial, onGuardar, onCancelar, saving }) {
  const [form, setForm] = useState(inicial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [coloniasCp, setColoniasCp] = useState([]);
  const [ubicando, setUbicando] = useState(false);
  const [ubicacionError, setUbicacionError] = useState("");
  const [sinNumero, setSinNumero] = useState((inicial?.numero_ext || "").toUpperCase() === "SN");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const mapQuery = [
    form.calle,
    form.numero_ext,
    form.colonia,
    form.ciudad,
    form.estado,
    form.cp,
    "México",
  ].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const puedeMostrarMapa = form.calle && form.numero_ext && form.colonia && form.ciudad && form.estado && form.cp;

  useEffect(() => {
    const cp = form.cp.replace(/\D/g, "");

    if (cp.length !== 5) {
      setCpLoading(false);
      setCpError("");
      setColoniasCp([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCpLoading(true);
      setCpError("");

      try {
        const res = await fetch(CP_LOOKUP_URL(cp), { signal: controller.signal });
        if (!res.ok) throw new Error("CP no encontrado");

        const data = await res.json();
        const places = Array.isArray(data.places) ? data.places : [];
        const colonias = unicos(places.map(p => p["place name"] || p.placeName || p.colonia));
        const estado = normalizarEstado(places[0]?.state || data.state || data.estado);
        const ciudad = data.city || data.municipality || data.municipio || places[0]?.["place name"] || "";

        setColoniasCp(colonias);
        setForm(actual => ({
          ...actual,
          estado: estado || actual.estado,
          ciudad: ciudad || actual.ciudad,
          colonia: actual.colonia || colonias[0] || "",
        }));
      } catch (err) {
        if (err.name !== "AbortError") {
          setColoniasCp([]);
          setCpError("No se encontró el CP. Puedes llenar los campos manualmente.");
        }
      } finally {
        setCpLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.cp]);

  function aplicarSinNumero(checked) {
    setSinNumero(checked);
    setForm(f => ({ ...f, numero_ext: checked ? "SN" : "" }));
    if (errors.numero_ext) setErrors(e => ({ ...e, numero_ext: "" }));
  }

  async function llenarConUbicacion(position) {
    const { latitude, longitude } = position.coords;
    const res = await fetch(REVERSE_GEOCODE_URL(latitude, longitude));
    if (!res.ok) throw new Error("No se pudo obtener la dirección");

    const data = await res.json();
    const addr = data.address || {};
    const calle = pick(addr.road, addr.pedestrian, addr.footway, addr.neighbourhood, addr.suburb);
    const numero = pick(addr.house_number);
    const colonia = pick(addr.suburb, addr.neighbourhood, addr.quarter, addr.residential, addr.hamlet);
    const ciudad = pick(addr.city, addr.town, addr.village, addr.municipality, addr.county);
    const estado = normalizarEstado(pick(addr.state));
    const cp = pick(addr.postcode).replace(/\D/g, "").slice(0, 5);

    setSinNumero(!numero);
    setForm(actual => ({
      ...actual,
      calle: calle || actual.calle,
      numero_ext: numero || "SN",
      colonia: colonia || actual.colonia,
      ciudad: ciudad || actual.ciudad,
      estado: estado || actual.estado,
      cp: cp || actual.cp,
    }));
  }

  async function usarMiUbicacion() {
    setUbicacionError("");

    if (!navigator.geolocation) {
      setUbicacionError("Tu navegador no permite detectar ubicación. Llena la dirección manualmente.");
      return;
    }

    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          await llenarConUbicacion(position);
        } catch {
          setUbicacionError("Detectamos tu ubicación, pero no pudimos convertirla en dirección. Puedes llenarla manualmente.");
        } finally {
          setUbicando(false);
        }
      },
      () => {
        setUbicacionError("No pudimos usar tu ubicación. Revisa permisos del navegador o llena la dirección manualmente.");
        setUbicando(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  function validar() {
    const e = {};
    if (!form.nombre_receptor.trim()) e.nombre_receptor = true;
    if (!form.telefono.trim() || !/^\d{10}$/.test(form.telefono.replace(/\s/g, ""))) e.telefono = true;
    if (!form.calle.trim())      e.calle = true;
    if (!sinNumero && !form.numero_ext.trim()) e.numero_ext = true;
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

      <button className="dch-location-btn" type="button" onClick={usarMiUbicacion} disabled={ubicando}>
        {ubicando ? <span className="dch-mini-spinner" /> : "⌖"}
        {ubicando ? "Detectando ubicación..." : "Usar mi ubicación"}
      </button>
      {ubicacionError ? (
        <div className="dch-location-note err">{ubicacionError}</div>
      ) : (
        <div className="dch-location-note">
          Se completará la dirección aproximada con el permiso de ubicación del navegador.
        </div>
      )}

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
        <label>Dirección o lugar de entrega *</label>
        <input className={errors.calle ? "err" : ""} placeholder="Nombre de la calle"
          value={form.calle} onChange={e => set("calle", e.target.value)} />
      </div>

      <label className="dch-check-row">
        <input type="checkbox" checked={sinNumero} onChange={e => aplicarSinNumero(e.target.checked)} />
        <span>Mi calle no tiene número</span>
      </label>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Núm. exterior *</label>
          <input className={errors.numero_ext ? "err" : ""} placeholder="123"
            value={form.numero_ext} disabled={sinNumero} onChange={e => set("numero_ext", e.target.value)} />
        </div>
        <div className="dch-fg">
          <label>Núm. interior</label>
          <input placeholder="3B (opcional)" value={form.numero_int} onChange={e => set("numero_int", e.target.value)} />
        </div>
      </div>

      <div className="dch-form-row">
        <div className="dch-fg">
          <label>Colonia *</label>
          <input
            className={errors.colonia ? "err" : ""}
            placeholder="Busca o escribe tu colonia"
            list="dch-colonias-cp"
            value={form.colonia}
            onChange={e => set("colonia", e.target.value)}
          />
          <datalist id="dch-colonias-cp">
            {coloniasCp.map(colonia => <option key={colonia} value={colonia} />)}
          </datalist>
          {coloniasCp.length > 0 && (
            <span className="dch-help">Selecciona una colonia sugerida o escribe otra.</span>
          )}
        </div>
        <div className="dch-fg">
          <label>Código postal *</label>
          <input className={errors.cp ? "err" : ""} placeholder="12345" maxLength={5}
            value={form.cp} onChange={e => set("cp", e.target.value.replace(/\D/g, ""))} />
          {cpLoading && <span className="dch-help dch-inline-hint"><span className="dch-mini-spinner" /> Buscando datos del CP...</span>}
          {cpError && <span className="dch-help err">{cpError}</span>}
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

      {puedeMostrarMapa && (
        <div className="dch-map-box">
          <div className="dch-map-head">
            <div className="dch-map-title">Ubicación aproximada</div>
            <a className="dch-map-link" href={mapsUrl} target="_blank" rel="noreferrer">
              Abrir en Maps
            </a>
          </div>
          <iframe
            className="dch-map-frame"
            title="Ubicación de entrega"
            src={mapsEmbedUrl}
            loading="lazy"
          />
        </div>
      )}

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
            <span>📍</span> Dirección de entrega
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
              + Agregar dirección
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
