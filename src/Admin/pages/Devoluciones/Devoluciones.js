import { API_BASE_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";
import {
  MdAssignmentReturn,
  MdCheckCircle,
  MdClose,
  MdRefresh,
  MdSearch,
} from "react-icons/md";

const API = `${API_BASE_URL}/api/admin/returns`;

const statusLabels = {
  requested: "Cambio solicitado",
  reviewing: "En revisión",
  approved: "Cambio autorizado",
  rejected: "No autorizado",
  refunded: "Solicitud cerrada",
};

const reasonLabels = {
  damaged: "Producto dañado",
  wrong_item: "Producto incorrecto",
  size: "Problema de talla",
  quality: "Calidad",
  other: "Otro",
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

export default function Devoluciones() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState({ status: "reviewing", admin_notes: "" });
  const [message, setMessage] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const request = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Error ${response.status}`);
    return payload;
  };

  const load = async () => {
    setLoading(true);
    try {
      setItems(await request(`${API}?status=${status}`));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const openReview = (item) => {
    setSelected(item);
    setReview({
      status: ["requested", "refunded"].includes(item.status) ? "reviewing" : item.status,
      admin_notes: item.admin_notes || "",
    });
  };

  const saveReview = async (event) => {
    event.preventDefault();
    try {
      const result = await request(`${API}/${selected.id}/status`, {
        method: "PATCH",
        body: JSON.stringify(review),
      });
      setMessage({
        type: result.warning ? "warning" : "success",
        text: result.warning || "Solicitud actualizada y usuario notificado.",
      });
      setSelected(null);
      await load();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="admin-returns">
      <style>{CSS}</style>
      <div className="page-header admin-returns-header">
        <div>
          <h2>Cambios de producto</h2>
          <p>
            Revisión de solicitudes de cambio. SportLike no realiza devoluciones ni reembolsos.
          </p>
        </div>
        <button onClick={load}><MdRefresh /> Actualizar</button>
      </div>

      {message && <div className={`admin-returns-alert ${message.type}`}>{message.text}</div>}

      <div className="admin-returns-filter">
        <MdSearch />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
        <span>{items.length} solicitud(es)</span>
      </div>

      <div className="admin-returns-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Solicitud</th>
              <th>Cliente</th>
              <th>Pedido</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="admin-returns-empty">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-returns-empty">
                  <MdCheckCircle /> No hay solicitudes en este estado.
                </td>
              </tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>#{item.id}</strong><small>{new Date(item.created_at).toLocaleDateString("es-MX")}</small></td>
                <td><strong>{item.nombre} {item.apellidoP}</strong><small>{item.correo}</small></td>
                <td><strong>#{item.pedido_ref}</strong><small>{item.sucursal_nombre || "—"}</small></td>
                <td><strong>{reasonLabels[item.reason] || item.reason}</strong><small>{item.details}</small></td>
                <td><span className={`admin-returns-status ${item.status}`}>{statusLabels[item.status] || item.status}</span></td>
                <td><button className="admin-returns-review" onClick={() => openReview(item)}>Revisar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-returns-backdrop" onMouseDown={() => setSelected(null)}>
          <form className="admin-returns-modal" onSubmit={saveReview} onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-returns-modal-head">
              <div>
                <h3>Revisar solicitud #{selected.id}</h3>
                <p>Pedido #{selected.pedido_ref} · solicitud de cambio</p>
              </div>
              <button type="button" onClick={() => setSelected(null)}><MdClose /></button>
            </div>
            <div className="admin-returns-summary">
              <strong>{reasonLabels[selected.reason]}</strong>
              <p>{selected.details}</p>
            </div>
            {normalizeImages(selected.evidence_images).length > 0 && (
              <div className="admin-returns-evidence">
                <strong>Evidencia fotográfica</strong>
                <div>
                  {normalizeImages(selected.evidence_images).map((image, index) => (
                    <a
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      key={index}
                      title="Abrir imagen"
                    >
                      <img src={image} alt={`Evidencia ${index + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <label>
              Nuevo estado
              <select value={review.status} onChange={(event) => setReview({ ...review, status: event.target.value })}>
                <option value="reviewing">En revisión</option>
                <option value="approved">Cambio autorizado</option>
                <option value="rejected">No autorizado</option>
              </select>
            </label>
            <label>
              Observaciones para el cliente
              <textarea rows="4" value={review.admin_notes} onChange={(event) => setReview({ ...review, admin_notes: event.target.value })} placeholder="Indica la resolución o los siguientes pasos." />
            </label>
            <div className="admin-returns-modal-actions">
              <button type="button" className="ghost" onClick={() => setSelected(null)}>Cancelar</button>
              <button type="submit">Guardar resolución</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import CSS from "./Devoluciones.styles";
