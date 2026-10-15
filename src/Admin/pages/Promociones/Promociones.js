import { API_BASE_URL } from "../../../config/api";
import { PROMOTIONS_ENABLED } from "../../../config/features";
import { Link } from "react-router-dom";
import Feedback from "../../../components/Feedback";
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

const API = `${API_BASE_URL}/api/admin/promotions`;

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
  if (!PROMOTIONS_ENABLED) return <Feedback title="Promociones pausadas">
    <p>Por ahora no se publican descuentos ni se envían campañas. Los registros existentes se conservan.</p>
    <Link to="/admin/productos">Administrar productos</Link>
  </Feedback>;
  return <ActivePromotions />;
}

function ActivePromotions() {
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

import CSS from "./Promociones.styles";
