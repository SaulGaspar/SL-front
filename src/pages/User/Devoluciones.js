import { API_BASE_URL } from "../../config/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAssignmentReturn,
  MdCheckCircle,
  MdClose,
  MdPhotoCamera,
  MdRefresh,
} from "react-icons/md";

const API = `${API_BASE_URL}/api/returns`;

const reasonLabels = {
  damaged: "Producto dañado",
  wrong_item: "Producto incorrecto",
  size: "Problema de talla",
  quality: "Calidad del producto",
  other: "Otro motivo",
};

const statusLabels = {
  requested: "Cambio solicitado",
  reviewing: "En revisión",
  approved: "Cambio autorizado",
  rejected: "No autorizado",
  refunded: "Solicitud cerrada",
};

const money = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value || 0
  );

const normalizeImages = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });

export default function Devoluciones() {
  const navigate = useNavigate();
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ order_id: "", reason: "damaged", details: "" });
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const request = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Error ${response.status}`);
    return payload;
  };

  const load = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const [orders, currentRequests] = await Promise.all([
        request(`${API}/eligible-orders`),
        request(API),
      ]);
      setEligibleOrders(orders);
      setRequests(currentRequests);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addEvidence = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setMessage(null);

    if (evidenceImages.length + files.length > 3) {
      setMessage({ type: "error", text: "Puedes agregar un máximo de 3 fotografías." });
      return;
    }

    const invalid = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 1.5 * 1024 * 1024
    );
    if (invalid) {
      setMessage({
        type: "error",
        text: "Usa imágenes JPG, PNG o WEBP de máximo 1.5 MB cada una.",
      });
      return;
    }

    try {
      const encoded = await Promise.all(files.map(fileToDataUrl));
      setEvidenceImages((current) => [...current, ...encoded]);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const result = await request(API, {
        method: "POST",
        body: JSON.stringify({ ...form, evidence_images: evidenceImages }),
      });
      setMessage({ type: "success", text: result.message });
      setForm({ order_id: "", reason: "damaged", details: "" });
      setEvidenceImages([]);
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="returns-page">
      <style>{CSS}</style>
      <header className="returns-hero">
        <MdAssignmentReturn />
        <div>
          <h1>Cambios de producto</h1>
          <p>
            SportLike realiza cambios de productos entregados. No se realizan devoluciones ni reembolsos.
          </p>
        </div>
      </header>

      {message && <div className={`returns-alert ${message.type}`}>{message.text}</div>}

      <section className="returns-layout">
        <form className="returns-card returns-form" onSubmit={submit}>
          <h2>Solicitar un cambio</h2>
          <label>
            Pedido entregado
            <select
              required
              value={form.order_id}
              onChange={(event) => setForm({ ...form, order_id: event.target.value })}
            >
              <option value="">Selecciona un pedido</option>
              {eligibleOrders.map((order) => (
                <option value={order.id} key={order.id}>
                  #{order.pedido_ref} - {money(order.total)} -{" "}
                  {order.sucursal_nombre || "Sucursal"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Motivo
            <select
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
            >
              {Object.entries(reasonLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descripción del problema
            <textarea
              required
              minLength={10}
              maxLength={1500}
              rows={5}
              value={form.details}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
              placeholder="Describe el producto, la talla o el detalle que quieres cambiar."
            />
          </label>
          <div className="returns-evidence">
            <div className="returns-evidence-head">
              <div>
                <strong>Fotografías de evidencia</strong>
                <small>Opcional · hasta 3 imágenes JPG, PNG o WEBP</small>
              </div>
              <label className="returns-upload">
                <MdPhotoCamera />
                Agregar fotos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={addEvidence}
                  disabled={evidenceImages.length >= 3}
                />
              </label>
            </div>
            {evidenceImages.length > 0 && (
              <div className="returns-evidence-grid">
                {evidenceImages.map((image, index) => (
                  <figure key={`${image.slice(0, 30)}-${index}`}>
                    <img src={image} alt={`Evidencia ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() =>
                        setEvidenceImages((current) =>
                          current.filter((_, imageIndex) => imageIndex !== index)
                        )
                      }
                      aria-label={`Eliminar evidencia ${index + 1}`}
                    >
                      <MdClose />
                    </button>
                  </figure>
                ))}
              </div>
            )}
          </div>
          <button disabled={saving || eligibleOrders.length === 0}>
            {saving ? "Enviando..." : "Solicitar cambio"}
          </button>
          {eligibleOrders.length === 0 && !loading && (
            <small>No hay pedidos entregados disponibles para solicitar un cambio.</small>
          )}
        </form>

        <section className="returns-card">
          <div className="returns-card-title">
            <h2>Mis cambios</h2>
            <button className="returns-refresh" onClick={load} title="Actualizar">
              <MdRefresh />
            </button>
          </div>
          {loading ? (
            <div className="returns-empty">Cargando...</div>
          ) : requests.length === 0 ? (
            <div className="returns-empty">
              <MdCheckCircle />
              <p>No has solicitado cambios.</p>
            </div>
          ) : (
            <div className="returns-list">
              {requests.map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>Cambio #{item.id}</strong>
                    <span>Pedido #{item.pedido_ref}</span>
                  </div>
                  <span className={`returns-status ${item.status}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                  <p>{reasonLabels[item.reason]}: {item.details}</p>
                  {normalizeImages(item.evidence_images).length > 0 && (
                    <div className="returns-request-evidence">
                      {normalizeImages(item.evidence_images).map((image, index) => (
                        <img
                          src={image}
                          alt={`Evidencia ${index + 1} de la solicitud ${item.id}`}
                          key={index}
                        />
                      ))}
                    </div>
                  )}
                  <footer><span>Sin devolución de dinero</span><span>{item.sucursal_nombre || "SportLike"}</span></footer>
                  {item.admin_notes && (
                    <div className="returns-notes">
                      <strong>Respuesta:</strong> {item.admin_notes}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

import CSS from "./Devoluciones.styles";
