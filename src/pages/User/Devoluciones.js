import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAssignmentReturn,
  MdCheckCircle,
  MdClose,
  MdPhotoCamera,
  MdRefresh,
} from "react-icons/md";

const API = "https://sl-back.vercel.app/api/returns";

const reasonLabels = {
  damaged: "Producto dañado",
  wrong_item: "Producto incorrecto",
  size: "Problema de talla",
  quality: "Calidad del producto",
  other: "Otro motivo",
};

const statusLabels = {
  requested: "Solicitada",
  reviewing: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  refunded: "Reembolsada",
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
          <h1>Devoluciones y reembolsos</h1>
          <p>
            Registra una solicitud para un pedido entregado. Las condiciones finales
            continúan afinándose con el propietario de SportLike.
          </p>
        </div>
      </header>

      {message && <div className={`returns-alert ${message.type}`}>{message.text}</div>}

      <section className="returns-layout">
        <form className="returns-card returns-form" onSubmit={submit}>
          <h2>Nueva solicitud</h2>
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
              placeholder="Describe el estado del producto y la solución que solicitas."
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
            {saving ? "Registrando..." : "Enviar solicitud"}
          </button>
          {eligibleOrders.length === 0 && !loading && (
            <small>No hay pedidos entregados disponibles para devolución.</small>
          )}
        </form>

        <section className="returns-card">
          <div className="returns-card-title">
            <h2>Mis solicitudes</h2>
            <button className="returns-refresh" onClick={load} title="Actualizar">
              <MdRefresh />
            </button>
          </div>
          {loading ? (
            <div className="returns-empty">Cargando...</div>
          ) : requests.length === 0 ? (
            <div className="returns-empty">
              <MdCheckCircle />
              <p>No has registrado devoluciones.</p>
            </div>
          ) : (
            <div className="returns-list">
              {requests.map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>Solicitud #{item.id}</strong>
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
                  <footer>
                    <span>{money(item.requested_amount)}</span>
                    <span>{item.sucursal_nombre || "SportLike"}</span>
                  </footer>
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

const CSS = `
  .returns-page { max-width:1180px; margin:0 auto; padding:26px 8px 60px; }
  .returns-hero {
    display:flex; gap:18px; align-items:flex-start; background:#0b2545; color:white;
    padding:28px; border-radius:18px; margin-bottom:20px;
  }
  .returns-hero>svg { font-size:2.6rem; color:#c6f62d; flex-shrink:0; }
  .returns-hero h1 { margin:0 0 6px; font-size:1.8rem; }
  .returns-hero p { margin:0; color:#d6e0ec; max-width:760px; }
  .returns-alert { border-radius:10px; padding:12px 16px; margin-bottom:16px; font-weight:700; }
  .returns-alert.success { background:#f0fff4; color:#276749; border:1px solid #9ae6b4; }
  .returns-alert.error { background:#fff5f5; color:#c53030; border:1px solid #feb2b2; }
  .returns-layout { display:grid; grid-template-columns:minmax(300px,.8fr) minmax(360px,1.2fr); gap:20px; align-items:start; }
  .returns-card { background:white; border:1px solid #e2e8f0; border-radius:16px; padding:22px; box-shadow:0 6px 24px rgba(15,23,42,.06); }
  .returns-card h2 { margin:0 0 18px; color:#0b2545; font-size:1.2rem; }
  .returns-form { display:flex; flex-direction:column; gap:14px; }
  .returns-form label { display:flex; flex-direction:column; gap:6px; color:#475569; font-size:.86rem; font-weight:800; }
  .returns-form select,.returns-form textarea { border:1px solid #cbd5e0; border-radius:9px; padding:10px 12px; font:500 .94rem 'DM Sans',sans-serif; }
  .returns-form select:focus,.returns-form textarea:focus { outline:none; border-color:#2c5282; box-shadow:0 0 0 3px rgba(44,82,130,.12); }
  .returns-evidence { border:1px dashed #b8c7d9; background:#f8fafc; border-radius:12px; padding:13px; }
  .returns-evidence-head { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .returns-evidence-head>div { display:flex; flex-direction:column; color:#0b2545; font-size:.86rem; }
  .returns-evidence-head small { color:#718096; margin-top:2px; font-weight:500; }
  .returns-upload { display:inline-flex!important; flex-direction:row!important; align-items:center; gap:6px!important; border:0; border-radius:9px; padding:9px 12px; background:#e8f2ff; color:#1e3a5f!important; cursor:pointer; white-space:nowrap; }
  .returns-upload input { display:none; }
  .returns-evidence-grid,.returns-request-evidence { display:flex; flex-wrap:wrap; gap:9px; margin-top:12px; }
  .returns-evidence-grid figure { width:82px; height:70px; margin:0; position:relative; }
  .returns-evidence-grid img,.returns-request-evidence img { width:82px; height:70px; object-fit:cover; border-radius:9px; border:1px solid #dbe4ef; }
  .returns-evidence-grid button { position:absolute; top:-6px; right:-6px; border:0; border-radius:50%; width:23px; height:23px; display:grid; place-items:center; padding:0; background:#c53030; color:white; cursor:pointer; }
  .returns-request-evidence { margin:0 0 12px; }
  .returns-request-evidence img { width:66px; height:56px; }
  .returns-form>button { border:0; border-radius:10px; padding:12px 18px; color:white; background:#0b2545; font-weight:800; cursor:pointer; }
  .returns-form>button:disabled { opacity:.5; cursor:not-allowed; }
  .returns-form small { color:#975a16; }
  .returns-card-title { display:flex; justify-content:space-between; align-items:center; }
  .returns-refresh { border:1px solid #cbd5e0; background:white; color:#2c5282; border-radius:8px; width:36px; height:36px; display:grid; place-items:center; cursor:pointer; }
  .returns-empty { padding:38px; color:#94a3b8; text-align:center; }
  .returns-empty svg { font-size:2.4rem; color:#68d391; }
  .returns-list { display:flex; flex-direction:column; gap:12px; }
  .returns-list article { border:1px solid #e2e8f0; border-radius:12px; padding:15px; position:relative; }
  .returns-list article>div:first-child { display:flex; flex-direction:column; color:#0b2545; }
  .returns-list article>div:first-child span { color:#94a3b8; font-size:.78rem; }
  .returns-list article>p { color:#64748b; margin:12px 0; }
  .returns-list footer { display:flex; justify-content:space-between; color:#475569; font-weight:700; font-size:.82rem; }
  .returns-status { position:absolute; right:14px; top:14px; border-radius:20px; padding:4px 9px; font-size:.73rem; font-weight:800; background:#edf2f7; }
  .returns-status.requested { background:#fefcbf; color:#975a16; }
  .returns-status.reviewing { background:#ebf8ff; color:#2b6cb0; }
  .returns-status.approved,.returns-status.refunded { background:#c6f6d5; color:#276749; }
  .returns-status.rejected { background:#fed7d7; color:#9b2c2c; }
  .returns-notes { margin-top:12px; padding:9px 11px; border-radius:8px; background:#f8fafc; color:#475569; font-size:.82rem; }
  @media(max-width:820px){ .returns-layout{grid-template-columns:1fr;} }
  @media(max-width:520px){ .returns-evidence-head{align-items:flex-start; flex-direction:column;} .returns-upload{width:100%; justify-content:center;} }
`;
