import React, { useEffect, useState } from "react";
import {
  MdAssignmentReturn,
  MdCheckCircle,
  MdClose,
  MdRefresh,
  MdSearch,
} from "react-icons/md";

const API = "https://sl-back.vercel.app/api/admin/returns";

const statusLabels = {
  requested: "Solicitada",
  reviewing: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  refunded: "Reembolsada",
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
      status: item.status === "requested" ? "reviewing" : item.status,
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
          <h2>Devoluciones y reembolsos</h2>
          <p>
            Revisión de solicitudes. Las reglas finales se están afinando con el
            propietario de SportLike.
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
              <th>Monto</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="admin-returns-empty">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-returns-empty">
                  <MdCheckCircle /> No hay solicitudes en este estado.
                </td>
              </tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>#{item.id}</strong><small>{new Date(item.created_at).toLocaleDateString("es-MX")}</small></td>
                <td><strong>{item.nombre} {item.apellidoP}</strong><small>{item.correo}</small></td>
                <td><strong>#{item.pedido_ref}</strong><small>{item.sucursal_nombre || "—"}</small></td>
                <td><strong>{reasonLabels[item.reason] || item.reason}</strong><small>{item.details}</small></td>
                <td className="admin-returns-money">{money(item.requested_amount)}</td>
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
                <p>Pedido #{selected.pedido_ref} - {money(selected.requested_amount)}</p>
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
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="refunded">Reembolsada</option>
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

const CSS = `
  .admin-returns-header { display:flex; justify-content:space-between; gap:18px; align-items:center; }
  .admin-returns-header>button,.admin-returns-review,.admin-returns-modal-actions button {
    border:0; border-radius:9px; padding:10px 15px; background:#1e3a5f; color:white;
    font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;
  }
  .admin-returns-alert { padding:12px 16px; border-radius:10px; margin-bottom:15px; font-weight:700; }
  .admin-returns-alert.success { background:#f0fff4; color:#276749; border:1px solid #9ae6b4; }
  .admin-returns-alert.warning { background:#fffaf0; color:#975a16; border:1px solid #fbd38d; }
  .admin-returns-alert.error { background:#fff5f5; color:#c53030; border:1px solid #feb2b2; }
  .admin-returns-filter { background:white; padding:14px 18px; border-radius:12px 12px 0 0; display:flex; align-items:center; gap:10px; border-bottom:1px solid #e2e8f0; }
  .admin-returns-filter svg { color:#718096; }
  .admin-returns-filter select { border:1px solid #cbd5e0; border-radius:8px; padding:9px 12px; color:#1e3a5f; font-weight:600; }
  .admin-returns-filter span { margin-left:auto; color:#718096; font-size:.84rem; }
  .admin-returns-table-wrap { overflow:auto; background:white; border-radius:0 0 12px 12px; }
  .admin-returns-table-wrap table { width:100%; border-collapse:collapse; min-width:980px; }
  .admin-returns-table-wrap th { text-align:left; padding:12px 14px; color:#4a5568; font-size:.78rem; text-transform:uppercase; background:#f8fafc; }
  .admin-returns-table-wrap td { padding:13px 14px; border-top:1px solid #edf2f7; color:#475569; vertical-align:middle; font-size:.86rem; }
  .admin-returns-table-wrap td strong,.admin-returns-table-wrap td small { display:block; }
  .admin-returns-table-wrap td small { color:#94a3b8; max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:3px; }
  .admin-returns-money { font-weight:800; color:#276749!important; }
  .admin-returns-status { border-radius:20px; padding:4px 9px; font-size:.72rem; font-weight:800; background:#edf2f7; white-space:nowrap; }
  .admin-returns-status.requested { background:#fefcbf; color:#975a16; }
  .admin-returns-status.reviewing { background:#ebf8ff; color:#2b6cb0; }
  .admin-returns-status.approved,.admin-returns-status.refunded { background:#c6f6d5; color:#276749; }
  .admin-returns-status.rejected { background:#fed7d7; color:#9b2c2c; }
  .admin-returns-review { padding:7px 12px; }
  .admin-returns-empty { padding:42px!important; text-align:center; color:#94a3b8!important; }
  .admin-returns-backdrop { position:fixed; inset:0; z-index:2000; background:rgba(15,23,42,.58); display:grid; place-items:center; padding:20px; }
  .admin-returns-modal { background:white; border-radius:16px; width:min(590px,100%); padding:22px; box-shadow:0 24px 70px rgba(0,0,0,.25); }
  .admin-returns-modal-head { display:flex; justify-content:space-between; gap:12px; }
  .admin-returns-modal-head h3 { margin:0 0 4px; color:#1e3a5f; }
  .admin-returns-modal-head p { margin:0; color:#718096; }
  .admin-returns-modal-head>button { border:1px solid #cbd5e0; background:white; border-radius:8px; width:36px; height:36px; display:grid; place-items:center; cursor:pointer; }
  .admin-returns-summary { background:#f8fafc; border-radius:10px; padding:13px; margin:18px 0; color:#475569; }
  .admin-returns-summary p { margin:5px 0 0; }
  .admin-returns-evidence { margin:0 0 18px; color:#4a5568; font-size:.84rem; }
  .admin-returns-evidence>div { display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; }
  .admin-returns-evidence img { width:112px; height:86px; object-fit:cover; border-radius:9px; border:1px solid #cbd5e0; transition:transform .16s; }
  .admin-returns-evidence img:hover { transform:scale(1.04); }
  .admin-returns-modal label { display:flex; flex-direction:column; gap:6px; margin:13px 0; color:#4a5568; font-weight:700; font-size:.84rem; }
  .admin-returns-modal select,.admin-returns-modal textarea { border:1px solid #cbd5e0; border-radius:9px; padding:10px 12px; font:500 .92rem 'DM Sans',sans-serif; }
  .admin-returns-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:18px; }
  .admin-returns-modal-actions button.ghost { background:white; color:#1e3a5f; border:1px solid #cbd5e0; }
`;
