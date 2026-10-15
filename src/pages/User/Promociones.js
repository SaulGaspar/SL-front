import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { PROMOTIONS_ENABLED } from "../../config/features";
import Feedback from "../../components/Feedback";
import "../../styles/account.css";

const categories = [
  { name: "Calzado", filter: "Calzado", icon: "bi-person-walking" },
  { name: "Ropa deportiva", filter: "Ropa", icon: "bi-person" },
  { name: "Accesorios", filter: "Accesorios", icon: "bi-bag" },
];

export default function Promociones() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(PROMOTIONS_ENABLED);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!PROMOTIONS_ENABLED) return;
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/promotions/active`, {signal:controller.signal})
      .then(async response => {
        if (!response.ok) throw new Error("No se pudieron consultar las promociones.");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("No se pudieron consultar las promociones.");
        setPromotions(data);
      }).catch(error => { if (error.name !== "AbortError") setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return <main className="ac-page"><div className="ac-wrap">
    <div className="ac-breadcrumb"><Link to="/">Inicio</Link><span>/</span><span>Explora SportLike</span></div>
    <header className="ac-hero"><div>
      <span className="ac-eyebrow">Encuentra tu próximo equipo</span>
      <h1>Tu siguiente reto empieza aquí.</h1>
      <p>Por ahora no hay promociones disponibles. Sigue explorando nuestro catálogo.</p>
    </div></header>
    <section className="ac-card" aria-labelledby="explore-title">
      <div className="ac-head"><h2 id="explore-title">Elige tu categoría</h2><Link to="/catalogo">Ver catálogo completo</Link></div>
      <div className="ac-shortcuts">
        {categories.map(category => <Link className="ac-shortcut" key={category.filter} to={`/catalogo?categoria=${encodeURIComponent(category.filter)}`}>
          <i className={`bi ${category.icon}`} aria-hidden="true" /><div><strong>{category.name}</strong><span>Explorar productos</span></div>
        </Link>)}
      </div>
    </section>
    {PROMOTIONS_ENABLED && <section className="ac-card" style={{marginTop:22}} aria-label="Promociones">
      {loading ? <Feedback kind="loading" title="Cargando promociones…" /> : error ? <Feedback kind="error" title={error} /> :
        promotions.length > 0 && <div className="ac-shortcuts">{promotions.map(promotion =>
          <article className="ac-card" key={promotion.id}><h2>{promotion.name}</h2><p>{promotion.description}</p><Link to="/catalogo">Ver productos</Link></article>
        )}</div>}
    </section>}
  </div></main>;
}
