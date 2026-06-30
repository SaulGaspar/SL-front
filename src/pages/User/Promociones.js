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
        <p>Descuentos todo el año y nuevas promociones para equiparte mejor.</p>
      </section>

      <section className="evergreen-promotions">
        <div className="evergreen-heading">
          <span>Beneficios permanentes</span>
          <h2>Más productos, mayor ahorro</h2>
          <p>
            Estas promociones están disponibles durante todo el año en productos
            participantes.
          </p>
        </div>

        <div className="evergreen-grid">
          <article className="evergreen-card duo">
            <div className="evergreen-number">2</div>
            <div className="evergreen-card-content">
              <span>Descuento por dúo</span>
              <h3>Compra 2 productos</h3>
              <p>
                Combina tus artículos deportivos favoritos y recibe un descuento
                especial en la compra.
              </p>
              <Link to="/catalogo">Elegir productos</Link>
            </div>
          </article>

          <article className="evergreen-card wholesale">
            <div className="evergreen-number">5+</div>
            <div className="evergreen-card-content">
              <span>Precio de mayoreo</span>
              <h3>Compra 5 o más productos</h3>
              <p>
                Ideal para equipos, entrenadores y grupos que buscan equiparse con
                un mejor precio.
              </p>
              <Link to="/catalogo">Comprar por mayoreo</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="seasonal-promotions">
        <div className="seasonal-heading">
          <div>
            <span>Promociones registradas</span>
            <h2>Ofertas vigentes</h2>
          </div>
          <Link to="/catalogo">Ver catálogo completo</Link>
        </div>

        {loading ? (
          <div className="customer-promotions-state">Cargando promociones...</div>
        ) : error ? (
          <div className="customer-promotions-state error">{error}</div>
        ) : promotions.length === 0 ? (
          <div className="customer-promotions-state compact">
            <MdStorefront size={42} />
            <h2>Próximamente habrá nuevas ofertas</h2>
            <p>
              Mientras tanto, puedes aprovechar los descuentos permanentes por
              cantidad.
            </p>
          </div>
        ) : (
          <div className="customer-promotions-grid">
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
          </div>
        )}
      </section>
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
  .evergreen-promotions {
    border-radius:20px; padding:30px; margin-bottom:30px;
    background:linear-gradient(135deg,#f8fafc,#edf4fb); border:1px solid #dbe5f0;
  }
  .evergreen-heading { text-align:center; max-width:700px; margin:0 auto 24px; }
  .evergreen-heading>span,.seasonal-heading>div>span {
    color:#2c5282; text-transform:uppercase; letter-spacing:1px; font-size:.76rem; font-weight:900;
  }
  .evergreen-heading h2,.seasonal-heading h2 { color:#071a31; margin:7px 0; font-weight:900; }
  .evergreen-heading p { color:#64748b; margin:0; }
  .evergreen-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
  .evergreen-card {
    position:relative; overflow:hidden; display:flex; align-items:center; gap:20px;
    min-height:210px; padding:26px; border-radius:18px; color:white;
    box-shadow:0 16px 34px rgba(7,26,49,.15);
  }
  .evergreen-card::after {
    content:""; position:absolute; width:180px; height:180px; border-radius:50%;
    right:-70px; top:-80px; background:rgba(255,255,255,.09);
  }
  .evergreen-card.duo { background:linear-gradient(135deg,#071a31,#1e3a5f); }
  .evergreen-card.wholesale { background:linear-gradient(135deg,#1e3a5f,#2c5282); }
  .evergreen-number {
    width:92px; height:92px; border-radius:22px; display:grid; place-items:center;
    flex-shrink:0; background:#c6f62d; color:#071a31; font-size:2.45rem; font-weight:950;
    box-shadow:0 10px 25px rgba(0,0,0,.18);
  }
  .evergreen-card-content { position:relative; z-index:1; }
  .evergreen-card-content>span { color:#c6f62d; font-size:.76rem; font-weight:900; text-transform:uppercase; letter-spacing:.8px; }
  .evergreen-card-content h3 { margin:6px 0; font-size:1.35rem; font-weight:900; }
  .evergreen-card-content p { color:#d7e0ec; margin:0; line-height:1.48; }
  .evergreen-card-content a {
    display:inline-block; margin-top:15px; padding:9px 14px; border-radius:9px;
    background:white; color:#071a31; font-weight:900; text-decoration:none;
  }
  .seasonal-promotions { margin-top:4px; }
  .seasonal-heading {
    display:flex; justify-content:space-between; align-items:flex-end; gap:18px; margin-bottom:17px;
  }
  .seasonal-heading h2 { margin-bottom:0; }
  .seasonal-heading>a { color:#1e3a5f; font-weight:900; text-decoration:none; }
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
  .customer-promotions-state.compact { padding:38px 28px; }
  .customer-promotions-state svg { color:#2c5282; }
  .customer-promotions-state h2 { color:#071a31; margin:12px 0 7px; }
  .customer-promotions-state.error { color:#c53030; background:#fff5f5; border-color:#feb2b2; }
  @media(max-width:800px) {
    .evergreen-grid { grid-template-columns:1fr; }
    .evergreen-card { min-height:auto; }
  }
  @media(max-width:520px) {
    .evergreen-promotions { padding:20px 14px; }
    .evergreen-card { align-items:flex-start; flex-direction:column; }
    .evergreen-number { width:72px; height:72px; border-radius:18px; font-size:2rem; }
    .seasonal-heading { align-items:flex-start; flex-direction:column; }
  }
`;
