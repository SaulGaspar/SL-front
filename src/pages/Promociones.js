import React from "react";
import { Link } from "react-router-dom";

export default function Promociones() {
  return (
    <div className="container my-5">

      {/* Estilos internos */}
      <style>{`
        .promo-banner {
          background: linear-gradient(135deg, #0a1a2f, #142b47);
          color: white;
          padding: 50px 30px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .promo-title {
          font-size: 2.2rem;
          font-weight: 700;
        }
        .promo-sub {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        .promo-card {
          border-radius: 14px;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .promo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .promo-highlight {
          color: #0a1a2f;
          font-weight: 700;
          font-size: 1.4rem;
        }
        .benefit-box {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 18px;
          text-align: center;
          border: 1px solid #e6e6e6;
        }
        .benefit-icon {
          font-size: 2rem;
          color: #0a1a2f;
        }
        .cta-btn {
          background-color: #0a1a2f;
          padding: 12px 28px;
          border: none;
          color: white;
          font-size: 1.1rem;
          border-radius: 8px;
        }
        .cta-btn:hover {
          background-color: #07121b;
        }
      `}</style>

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
        <p className="mt-3" style={{ fontSize: "1.1rem" }}>
          Llévate <strong>2 productos</strong> y recibe un <strong>descuento especial</strong>.  
          <br />
          Al llevarte <strong>5 productos o más</strong>, obtienes un precio <strong>por mayoreo</strong>.
        </p>
      </div>

      {/* Cards de promociones */}
      <div className="row g-4 mb-5">

        <div className="col-md-4">
          <div className="card promo-card shadow-sm">
            <img
              src="https://picsum.photos/seed/promo1/600/400"
              className="card-img-top"
              alt="promo-1"
            />
            <div className="card-body text-center">
              <h5 className="fw-bold">Descuento por Dúo</h5>
              <p>Compra 2 productos y recibe descuentos inmediatos.</p>
              <span className="badge bg-dark fs-6 p-2">Aprovecha</span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card promo-card shadow-sm">
            <img
              src="https://picsum.photos/seed/promo2/600/400"
              className="card-img-top"
              alt="promo-2"
            />
            <div className="card-body text-center">
              <h5 className="fw-bold">Mayoreo</h5>
              <p>Al llevarte 5 o más productos obtienes precios especiales.</p>
              <span className="badge bg-dark fs-6 p-2">Ideal para equipos</span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card promo-card shadow-sm">
            <img
              src="https://picsum.photos/seed/promo3/600/400"
              className="card-img-top"
              alt="promo-3"
            />
            <div className="card-body text-center">
              <h5 className="fw-bold">Temporada Activa</h5>
              <p>Promos en ropa, accesorios y artículos deportivos.</p>
              <span className="badge bg-dark fs-6 p-2">Por tiempo limitado</span>
            </div>
          </div>
        </div>

      </div>

      {/* Beneficios */}
      <h3 className="text-center mb-4">¿Por qué elegir SportLike?</h3>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="benefit-box shadow-sm">
            <div className="benefit-icon">🚚</div>
            <h5 className="mt-3">Envíos rápidos</h5>
            <p>Tu pedido llega entre 2 y 5 días hábiles.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="benefit-box shadow-sm">
            <div className="benefit-icon">💳</div>
            <h5 className="mt-3">Pagos seguros</h5>
            <p>Compra con métodos confiables y 100% protegidos.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="benefit-box shadow-sm">
            <div className="benefit-icon">🏆</div>
            <h5 className="mt-3">Calidad garantizada</h5>
            <p>Artículos deportivos seleccionados y probados.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-5 mb-5">
        <h3 className="mb-3">¿Listo para aprovechar las ofertas?</h3>
        <Link to="/catalogo" className="btn cta-btn">
          Ver catálogo completo
        </Link>
      </div>

    </div>
  );
}
