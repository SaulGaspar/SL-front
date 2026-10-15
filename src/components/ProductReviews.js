import { API_BASE_URL } from "../config/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Feedback from "./Feedback";

const API_URL = API_BASE_URL;

import CSS from "./ProductReviews.styles";

const stars = (rating) => "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

export default function ProductReviews({ productId }) {
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: 0 });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadReviews = async () => {
    const response = await fetch(`${API_URL}/api/reviews/product/${productId}`);
    if (!response.ok) throw new Error("No se pudieron cargar las reseñas.");
    const data = await response.json();
    setReviews(data.reviews || []);
    setSummary(data.summary || { count: 0, average: 0 });
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadReviews()
      // Si el servicio todavía no está disponible, la ficha debe seguir siendo usable.
      .catch(() => active && setReviews([]))
      .finally(() => active && setLoading(false));

    if (token) {
      fetch(`${API_URL}/api/reviews/product/${productId}/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!active || !data?.review) return;
          setRating(data.review.rating);
          setComment(data.review.comment || "");
        })
        .catch(() => {});
    }
    return () => { active = false; };
  }, [productId, token]);

  const submit = async (event) => {
    event.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setFormError("");
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/reviews/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo enviar tu reseña.");
      setMessage("Tu reseña fue enviada para revisión.");
    } catch (requestError) {
      setFormError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pr" aria-labelledby="reviews-title">
      <style>{CSS}</style>
      <div className="pr-head">
        <div>
          <h2 className="pr-title" id="reviews-title">Opiniones de clientes</h2>
          <div className="pr-summary">
            <span className="pr-average">{summary.average ? summary.average.toFixed(1) : "—"}</span>
            <span className="pr-stars" aria-label={`${summary.average || 0} de 5 estrellas`}>{stars(Math.round(summary.average || 0))}</span>
            <span>({summary.count} {summary.count === 1 ? "reseña" : "reseñas"})</span>
          </div>
        </div>
      </div>

      {token ? (
        <form className="pr-form" onSubmit={submit}>
          <label className="pr-form-label">Tu calificación</label>
          <div className="pr-star-buttons" aria-label="Selecciona una calificación">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" className={`pr-star-button ${value <= rating ? "active" : ""}`} onClick={() => setRating(value)} aria-label={`${value} estrellas`}>★</button>
            ))}
          </div>
          <textarea className="pr-textarea" value={comment} maxLength="500" onChange={(event) => setComment(event.target.value)} placeholder="Cuéntanos tu experiencia con este producto" />
          <p className="pr-note">Solo las compras entregadas pueden dejar una reseña. Las opiniones se revisan antes de publicarse.</p>
          {formError && <Feedback kind="error" title={formError}/>}
          {message && <Feedback kind="success" title={message}/>}
          <button className="pr-submit" disabled={submitting}>{submitting ? "Enviando..." : "Enviar reseña"}</button>
        </form>
      ) : (
        <p className="pr-note"><Link to="/login">Inicia sesión</Link> para dejar una reseña después de recibir tu compra.</p>
      )}

      {loading ? <Feedback kind="loading" title="Cargando reseñas…"/> : reviews.length ? (
        <div className="pr-list">
          {reviews.map((review) => (
            <article className="pr-review" key={review.id}>
              <div className="pr-review-top"><span className="pr-author">{review.author}</span><span className="pr-date">{new Date(review.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}</span></div>
              <div className="pr-stars" aria-label={`${review.rating} de 5 estrellas`}>{stars(review.rating)}</div>
              {review.comment && <p className="pr-comment">{review.comment}</p>}
            </article>
          ))}
        </div>
      ) : <Feedback title="Aún no hay reseñas">Sé el primero en compartir tu experiencia.</Feedback>}
    </section>
  );
}
