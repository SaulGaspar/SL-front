import React from "react";
import { Link } from "react-router-dom";

export default function Promociones() {
  return (
    <div className="container my-5">

      {/* Banner Principal */}
      <div className="promo-banner mb-5">
        <h1 className="promo-title">Promociones Exclusivas</h1>
        <p className="promo-sub mt-3">
          Ahorra más mientras te equipas con lo mejor del deporte.
        </p>
      </div>

      {/* Leyenda principal */}
      <div className="text-center mb-5">
        <h2 className="promo-highlight">
          🎉 ¡Todo el año descuentos especiales!
        </h2>
        <p className="mt-3" style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>
          Llévate <strong>2 productos</strong> y recibe un <strong>descuento especial</strong>.  
          <br />
          Al llevarte <strong>5 productos o más</strong>, obtienes un precio <strong>por mayoreo</strong>.
        </p>
      </div>

      {/* Cards de promociones */}
      <div className="row g-4 mb-5">
        {[1,2,3].map((n) => (
          <div key={n} className="col-md-4">
            <div className="card promo-card shadow-sm">
              <img
                src={`https://picsum.photos/seed/promo${n}/600/400`}
                className="card-img-top"
                alt={`promo-${n}`}
              />
              <div className="card-body text-center">
                <h5 className="fw-bold" style={{ color: "var(--text-main)" }}>
                  {n === 1 ? "Descuento por Dúo" : n === 2 ? "Mayoreo" : "Temporada Activa"}
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  {n === 1 && "Compra 2 productos y recibe descuentos inmediatos."}
                  {n === 2 && "Al llevarte 5 o más productos obtienes precios especiales."}
                  {n === 3 && "Promos en ropa, accesorios y artículos deportivos."}
                </p>
                <span className="badge bg-dark fs-6 p-2">
                  {n === 1 ? "Aprovecha" : n === 2 ? "Ideal para equipos" : "Por tiempo limitado"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Beneficios */}
      <h3 className="text-center mb-4" style={{ color: "var(--text-main)" }}>
        ¿Por qué elegir SportLike?
      </h3>
      <div className="row g-4 mb-5">
        {[
          { icon: "🚚", title: "Envíos rápidos", text: "Tu pedido llega entre 2 y 5 días hábiles." },
          { icon: "💳", title: "Pagos seguros", text: "Compra con métodos confiables y 100% protegidos." },
          { icon: "🏆", title: "Calidad garantizada", text: "Artículos deportivos seleccionados y probados." }
        ].map((b,i)=>(
          <div key={i} className="col-md-4">
            <div className="benefit-box shadow-sm">
              <div className="benefit-icon">{b.icon}</div>
              <h5 className="mt-3" style={{ color: "var(--text-main)" }}>{b.title}</h5>
              <p style={{ color: "var(--text-muted)" }}>{b.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-5 mb-5">
        <h3 className="mb-3" style={{ color: "var(--text-main)" }}>
          ¿Listo para aprovechar las ofertas?
        </h3>
        <Link to="/catalogo" className="btn cta-btn">
          Ver catálogo completo
        </Link>
      </div>

    </div>
  );
}
