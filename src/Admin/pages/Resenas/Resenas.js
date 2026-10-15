import { API_BASE_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";
import { MdCheckCircle, MdClose, MdRefresh, MdStar } from "react-icons/md";

const API_URL = API_BASE_URL;
const auth = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });
const stars = (rating) => "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

import CSS from "./Resenas.styles";

export default function Resenas() {
  const [status, setStatus] = useState("pendiente");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API_URL}/api/admin/reviews?status=${status}`, { headers: auth() });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar las reseñas.");
      setReviews(data);
      setNotes(Object.fromEntries(data.map((review) => [review.id, review.admin_notes || ""])));
    } catch (requestError) {
      setError(requestError.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const moderate = async (review, nextStatus) => {
    setSavingId(review.id);
    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${review.id}`, {
        method: "PATCH", headers: auth(), body: JSON.stringify({ status: nextStatus, admin_notes: notes[review.id] || "" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar la reseña.");
      await load();
    } catch (requestError) { setError(requestError.message); }
    finally { setSavingId(null); }
  };

  return <section className="rv-page"><style>{CSS}</style>
    <header className="rv-head"><div><h2>Reseñas de productos</h2><p>Aprueba o rechaza las opiniones enviadas por compradores verificados.</p></div><button className="rv-refresh" onClick={load} disabled={loading}><MdRefresh /> Actualizar</button></header>
    <div className="rv-tabs">{["pendiente", "publicada", "rechazada"].map((item) => <button key={item} className={`rv-tab ${status === item ? "active" : ""}`} onClick={() => setStatus(item)}>{item[0].toUpperCase() + item.slice(1)}s</button>)}</div>
    {error && <div className="rv-error">{error}</div>}
    {loading ? <div className="rv-empty">Cargando reseñas...</div> : !reviews.length ? <div className="rv-empty">No hay reseñas {status === "pendiente" ? "por revisar" : `en estado ${status}`}.</div> : <div className="rv-list">{reviews.map((review) => <article className="rv-card" key={review.id}><div className="rv-row"><div><div className="rv-name">{review.customer_name}</div><div className="rv-product">{review.product_name}</div><div className="rv-stars"><MdStar style={{verticalAlign:"-2px"}} /> {stars(review.rating)} · {review.rating}/5</div></div><time className="rv-date">{new Date(review.created_at).toLocaleDateString("es-MX")}</time></div>{review.comment && <p className="rv-comment">{review.comment}</p>}<textarea className="rv-notes" value={notes[review.id] || ""} maxLength="500" placeholder="Nota interna opcional" onChange={(event) => setNotes({ ...notes, [review.id]: event.target.value })} />{status === "pendiente" && <div className="rv-actions"><button className="rv-action approve" disabled={savingId === review.id} onClick={() => moderate(review, "publicada")}><MdCheckCircle /> Publicar</button><button className="rv-action reject" disabled={savingId === review.id} onClick={() => moderate(review, "rechazada")}><MdClose /> Rechazar</button></div>}</article>)}</div>}
  </section>;
}
