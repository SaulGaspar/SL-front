import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdCalendarMonth, MdLocalOffer, MdStorefront } from "react-icons/md";

const API = "https://sl-back.vercel.app/api/promotions/active";

const discountText = (promotion) =>
  promotion.discount_type === "percentage"
    ? `${Number(promotion.discount_value)}%`
    : new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(promotion.discount_value || 0);

const dateText = (value) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(
    new Date(`${String(value).slice(0, 10)}T12:00:00`)
  );

export default function Promociones() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "No se pudieron cargar las promociones");
        return payload;
      })
      .then(setPromotions)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="customer-promotions">
      <style>{CSS}</style>

      <section className="customer-promotions-hero">
        <span><MdLocalOffer /> Ofertas SportLike</span>
        <h1>Promociones exclusivas</h1>
        <p>Aprovecha las ofertas vigentes y equípate con lo mejor del deporte.</p>
      </section>

      {loading ? (
        <section className="customer-promotions-state">Cargando promociones...</section>
      ) : error ? (
        <section className="customer-promotions-state error">{error}</section>
      ) : promotions.length === 0 ? (
        <section className="customer-promotions-state">
          <MdStorefront size={50} />
          <h2>Próximamente habrá nuevas ofertas</h2>
          <p>Por ahora puedes consultar todos nuestros productos disponibles.</p>
          <Link to="/catalogo">Ver catálogo</Link>
        </section>
      ) : (
        <section className="customer-promotions-grid">
          {promotions.map((promotion) => (
            <article className="customer-promotion-card" key={promotion.id}>
              <div className="customer-promotion-badge">{discountText(promotion)}</div>
              <div className="customer-promotion-body">
                <span className="customer-promotion-scope">
                  {promotion.applies_to === "all"
                    ? "Toda la tienda"
                    : promotion.target || "Productos seleccionados"}
                </span>
                <h2>{promotion.name}</h2>
                <p>{promotion.description}</p>
                <div className="customer-promotion-date">
                  <MdCalendarMonth />
                  Del {dateText(promotion.start_date)} al {dateText(promotion.end_date)}
                </div>
                <Link to="/catalogo">Aprovechar promoción</Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

const CSS = `
  .customer-promotions { max-width:1200px; margin:0 auto; padding:28px 10px 60px; }
  .customer-promotions-hero {
    border-radius:22px; padding:48px 28px; text-align:center; color:white;
    background:linear-gradient(135deg,#071a31,#1e3a5f);
    box-shadow:0 18px 45px rgba(7,26,49,.18); margin-bottom:28px;
  }
  .customer-promotions-hero>span {
    display:inline-flex; align-items:center; gap:7px; color:#c6f62d; font-weight:800;
    text-transform:uppercase; letter-spacing:1px; font-size:.82rem;
  }
  .customer-promotions-hero h1 { font-size:clamp(2rem,5vw,3.4rem); margin:12px 0 8px; font-weight:900; }
  .customer-promotions-hero p { margin:0; color:#d7e0ec; font-size:1.05rem; }
  .customer-promotions-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }
  .customer-promotion-card {
    position:relative; background:white; border-radius:18px; overflow:hidden;
    border:1px solid #e2e8f0; box-shadow:0 9px 28px rgba(15,23,42,.08);
  }
  .customer-promotion-badge {
    background:#c6f62d; color:#071a31; text-align:center; font-size:2.2rem;
    font-weight:900; padding:19px;
  }
  .customer-promotion-body { padding:22px; }
  .customer-promotion-scope {
    color:#2c5282; text-transform:uppercase; font-size:.76rem; font-weight:800; letter-spacing:.7px;
  }
  .customer-promotion-body h2 { color:#071a31; margin:8px 0; font-size:1.35rem; }
  .customer-promotion-body p { color:#64748b; line-height:1.55; min-height:72px; }
  .customer-promotion-date { display:flex; align-items:center; gap:7px; color:#64748b; font-size:.84rem; border-top:1px solid #edf2f7; padding-top:14px; }
  .customer-promotion-body a,.customer-promotions-state a {
    display:inline-block; margin-top:17px; background:#071a31; color:white; text-decoration:none;
    border-radius:10px; padding:10px 16px; font-weight:800;
  }
  .customer-promotions-state {
    background:white; border-radius:18px; padding:58px 28px; text-align:center; color:#64748b;
    border:1px solid #e2e8f0;
  }
  .customer-promotions-state svg { color:#2c5282; }
  .customer-promotions-state h2 { color:#071a31; margin:12px 0 7px; }
  .customer-promotions-state.error { color:#c53030; background:#fff5f5; border-color:#feb2b2; }
`;
