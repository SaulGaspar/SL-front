import React, { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdLocalOffer,
  MdRefresh,
  MdToggleOff,
  MdToggleOn,
} from "react-icons/md";

const API = "https://sl-back.vercel.app/api/admin/promotions";

const emptyForm = {
  name: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  applies_to: "all",
  target: "",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: "",
  status: "active",
};

const dateText = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
    new Date(`${String(value).slice(0, 10)}T12:00:00`)
  );
};

const discountText = (promotion) =>
  promotion.discount_type === "percentage"
    ? `${Number(promotion.discount_value)} %`
    : new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(promotion.discount_value || 0);

export default function Promociones() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const request = async (url = API, options = {}) => {
    const response = await fetch(url, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Error ${response.status}`);
    return payload;
  };

  const loadPromotions = async () => {
    setLoading(true);
    setMessage(null);
    try {
      setPromotions(await request());
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (promotion) => {
    setEditingId(promotion.id);
    setForm({
      name: promotion.name || "",
      description: promotion.description || "",
      discount_type: promotion.discount_type || "percentage",
      discount_value: promotion.discount_value || "",
      applies_to: promotion.applies_to || "all",
      target: promotion.target || "",
      start_date: String(promotion.start_date || "").slice(0, 10),
      end_date: String(promotion.end_date || "").slice(0, 10),
      status: promotion.status || "draft",
    });
    setShowForm(true);
    setMessage(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = await request(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });

      const sent = payload.notification?.sent || 0;
      const warning = payload.notification?.warning;
      setMessage({
        type: warning ? "warning" : "success",
        text: editingId
          ? "Promoción actualizada correctamente."
          : warning
            ? warning
            : `Promoción registrada. Se enviaron ${sent} correo(s) informativo(s).`,
      });
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadPromotions();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (promotion) => {
    const status = promotion.status === "active" ? "inactive" : "active";
    try {
      await request(`${API}/${promotion.id}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessage({
        type: "success",
        text: status === "active" ? "Promoción activada." : "Promoción desactivada.",
      });
      await loadPromotions();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const notify = async (promotion) => {
    try {
      const result = await request(`${API}/${promotion.id}/notify`, { method: "POST" });
      setMessage({
        type: result.warning ? "warning" : "success",
        text: result.warning || `Se notificó a ${result.sent || 0} usuario(s).`,
      });
      await loadPromotions();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const remove = async (promotion) => {
    if (!window.confirm(`¿Eliminar la promoción "${promotion.name}"?`)) return;
    try {
      await request(`${API}/${promotion.id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Promoción eliminada." });
      await loadPromotions();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="promo-wrap">
      <style>{CSS}</style>

      <div className="page-header promo-header">
        <div>
          <h2>Promociones y descuentos</h2>
          <p>Crea ofertas y notifica automáticamente a los clientes registrados.</p>
        </div>
        <button className="promo-primary" onClick={openNew}>
          <MdAdd /> Nueva promoción
        </button>
      </div>

      {message && <div className={`promo-alert ${message.type}`}>{message.text}</div>}

      <div className="promo-toolbar">
        <div>
          <strong>{promotions.length}</strong> promociones registradas
        </div>
        <button className="promo-secondary" onClick={loadPromotions}>
          <MdRefresh /> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="promo-empty">Cargando promociones...</div>
      ) : promotions.length === 0 ? (
        <div className="promo-empty">
          <MdLocalOffer size={48} />
          <h3>Aún no hay promociones</h3>
          <p>Registra la primera oferta para publicarla y avisar a tus clientes.</p>
          <button className="promo-primary" onClick={openNew}>
            <MdAdd /> Crear promoción
          </button>
        </div>
      ) : (
        <div className="promo-grid">
          {promotions.map((promotion) => (
            <article className="promo-card" key={promotion.id}>
              <div className="promo-card-top">
                <div className="promo-discount">{discountText(promotion)}</div>
                <span className={`promo-status ${promotion.status}`}>
                  {promotion.status === "active"
                    ? "Activa"
                    : promotion.status === "draft"
                      ? "Borrador"
                      : "Inactiva"}
                </span>
              </div>
              <h3>{promotion.name}</h3>
              <p>{promotion.description}</p>
              <div className="promo-meta">
                <span>
                  <strong>Aplica a:</strong>{" "}
                  {promotion.applies_to === "all"
                    ? "Todos"
                    : promotion.target || promotion.applies_to}
                </span>
                <span>
                  <strong>Vigencia:</strong> {dateText(promotion.start_date)} -{" "}
                  {dateText(promotion.end_date)}
                </span>
                <span>
                  <strong>Correo:</strong>{" "}
                  {promotion.notified_at
                    ? `enviado ${dateText(promotion.notified_at)}`
                    : "sin enviar"}
                </span>
              </div>
              <div className="promo-actions">
                <button title="Editar" onClick={() => openEdit(promotion)}>
                  <MdEdit />
                </button>
                <button title="Activar o desactivar" onClick={() => toggle(promotion)}>
                  {promotion.status === "active" ? <MdToggleOn /> : <MdToggleOff />}
                </button>
                <button
                  title="Enviar correo"
                  disabled={promotion.status !== "active"}
                  onClick={() => notify(promotion)}
                >
                  <MdEmail />
                </button>
                <button className="danger" title="Eliminar" onClick={() => remove(promotion)}>
                  <MdDelete />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div className="promo-modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <div className="promo-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="promo-modal-header">
              <div>
                <h3>{editingId ? "Editar promoción" : "Registrar promoción"}</h3>
                <p>Al crearla como activa se enviará un correo a los clientes verificados.</p>
              </div>
              <button className="promo-close" onClick={() => setShowForm(false)}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={submit} className="promo-form">
              <label className="full">
                Nombre de la promoción
                <input
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Ej. Verano SportLike"
                />
              </label>

              <label className="full">
                Descripción
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe el beneficio y sus condiciones."
                />
              </label>

              <label>
                Tipo de descuento
                <select
                  value={form.discount_type}
                  onChange={(event) =>
                    setForm({ ...form, discount_type: event.target.value })
                  }
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Cantidad fija</option>
                </select>
              </label>

              <label>
                Valor del descuento
                <input
                  required
                  type="number"
                  min="0.01"
                  max={form.discount_type === "percentage" ? "100" : undefined}
                  step="0.01"
                  value={form.discount_value}
                  onChange={(event) =>
                    setForm({ ...form, discount_value: event.target.value })
                  }
                />
              </label>

              <label>
                Aplicar a
                <select
                  value={form.applies_to}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      applies_to: event.target.value,
                      target: event.target.value === "all" ? "" : form.target,
                    })
                  }
                >
                  <option value="all">Todos los productos</option>
                  <option value="category">Una categoría</option>
                  <option value="product">Un producto</option>
                </select>
              </label>

              <label>
                Producto o categoría
                <input
                  required={form.applies_to !== "all"}
                  disabled={form.applies_to === "all"}
                  value={form.target}
                  onChange={(event) => setForm({ ...form, target: event.target.value })}
                  placeholder={form.applies_to === "all" ? "No aplica" : "Escribe el nombre"}
                />
              </label>

              <label>
                Fecha de inicio
                <input
                  required
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    setForm({ ...form, start_date: event.target.value })
                  }
                />
              </label>

              <label>
                Fecha de finalización
                <input
                  required
                  type="date"
                  min={form.start_date}
                  value={form.end_date}
                  onChange={(event) =>
                    setForm({ ...form, end_date: event.target.value })
                  }
                />
              </label>

              <label className="full">
                Estado inicial
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="active">Activa y enviar correos</option>
                  <option value="draft">Guardar como borrador</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </label>

              <div className="promo-form-actions full">
                <button type="button" className="promo-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="promo-primary" disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Registrar promoción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
  .promo-wrap { font-family:'DM Sans',sans-serif; }
  .promo-header { display:flex; align-items:center; justify-content:space-between; gap:18px; }
  .promo-primary,.promo-secondary {
    border:0; border-radius:10px; padding:11px 17px; font-weight:700; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
  }
  .promo-primary { background:#1e3a5f; color:white; }
  .promo-primary:hover { background:#2c5282; }
  .promo-primary:disabled { opacity:.6; cursor:not-allowed; }
  .promo-secondary { background:white; color:#1e3a5f; border:1px solid #cbd5e0; }
  .promo-alert { padding:12px 16px; border-radius:10px; margin-bottom:16px; font-weight:600; }
  .promo-alert.success { background:#f0fff4; color:#276749; border:1px solid #9ae6b4; }
  .promo-alert.warning { background:#fffaf0; color:#975a16; border:1px solid #fbd38d; }
  .promo-alert.error { background:#fff5f5; color:#c53030; border:1px solid #feb2b2; }
  .promo-toolbar {
    background:white; border-radius:12px; padding:14px 18px; margin-bottom:18px;
    display:flex; align-items:center; justify-content:space-between; color:#718096;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  .promo-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:18px; }
  .promo-card { background:white; border-radius:14px; padding:20px; box-shadow:0 2px 9px rgba(0,0,0,.06); border-top:4px solid #c6f62d; }
  .promo-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .promo-discount { font-size:1.6rem; font-weight:800; color:#1e3a5f; }
  .promo-status { padding:4px 10px; border-radius:20px; font-size:.76rem; font-weight:700; }
  .promo-status.active { background:#c6f6d5; color:#276749; }
  .promo-status.inactive { background:#edf2f7; color:#4a5568; }
  .promo-status.draft { background:#fefcbf; color:#975a16; }
  .promo-card h3 { color:#1e3a5f; margin:14px 0 7px; }
  .promo-card>p { color:#718096; min-height:48px; }
  .promo-meta { display:flex; flex-direction:column; gap:6px; font-size:.83rem; color:#718096; padding:13px 0; border-top:1px solid #edf2f7; border-bottom:1px solid #edf2f7; }
  .promo-meta strong { color:#4a5568; }
  .promo-actions { display:flex; gap:8px; margin-top:14px; }
  .promo-actions button,.promo-close {
    width:40px; height:38px; border:1px solid #cbd5e0; border-radius:9px;
    background:white; color:#2c5282; cursor:pointer; font-size:1.25rem;
    display:flex; align-items:center; justify-content:center;
  }
  .promo-actions button:disabled { opacity:.35; cursor:not-allowed; }
  .promo-actions button.danger { color:#c53030; margin-left:auto; }
  .promo-empty {
    background:white; border-radius:16px; padding:58px 30px; text-align:center; color:#718096;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  .promo-empty svg { color:#667eea; }
  .promo-empty h3 { color:#1e3a5f; margin:12px 0 6px; }
  .promo-modal-backdrop {
    position:fixed; inset:0; background:rgba(15,23,42,.58); z-index:2000;
    display:flex; align-items:center; justify-content:center; padding:22px;
  }
  .promo-modal { background:white; border-radius:16px; width:min(760px,100%); max-height:92vh; overflow:auto; box-shadow:0 24px 70px rgba(0,0,0,.25); }
  .promo-modal-header { padding:20px 22px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; gap:16px; }
  .promo-modal-header h3 { margin:0 0 5px; color:#1e3a5f; }
  .promo-modal-header p { margin:0; color:#718096; font-size:.88rem; }
  .promo-form { padding:22px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .promo-form label { display:flex; flex-direction:column; gap:6px; color:#4a5568; font-weight:700; font-size:.84rem; }
  .promo-form .full { grid-column:1/-1; }
  .promo-form input,.promo-form textarea,.promo-form select {
    border:1px solid #cbd5e0; border-radius:9px; padding:10px 12px; color:#1a202c;
    font:500 .94rem 'DM Sans',sans-serif; background:white;
  }
  .promo-form input:focus,.promo-form textarea:focus,.promo-form select:focus {
    outline:none; border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,.14);
  }
  .promo-form input:disabled { background:#edf2f7; }
  .promo-form-actions { display:flex; justify-content:flex-end; gap:10px; padding-top:4px; }
  @media(max-width:700px) {
    .promo-header { align-items:flex-start; flex-direction:column; }
    .promo-form { grid-template-columns:1fr; }
    .promo-form .full { grid-column:auto; }
  }
`;
