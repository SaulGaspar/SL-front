import React from "react";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          minHeight: "70vh",
          padding: "20px",
        }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
          Bienvenido a <span style={{ color: "#0d6efd" }}>SportLike</span>
        </h1>

        <p
          className="lead text-secondary"
          style={{ maxWidth: "750px", fontSize: "1.2rem", lineHeight: "1.6" }}
        >
          En SportLike nos dedicamos a ofrecer productos deportivos de alta
          calidad, combinando innovación, rendimiento y estilo. Nuestra misión
          es acompañarte en tu camino hacia un estilo de vida activo,
          proporcionándote una plataforma moderna, segura y eficiente para tus
          compras deportivas.
        </p>

        <a href="/catalogo" className="btn btn-primary btn-lg mt-3">
          Ver catálogo
        </a>
      </div>

      {/* CARDS */}
      <div className="container my-5">
        <div className="row g-4">

          {/* MISIÓN */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4 className="fw-bold mb-3">Nuestra Misión</h4>
                <p className="text-muted" style={{ fontSize: "1.05rem" }}>
                  Brindar productos deportivos de excelencia que motiven a
                  nuestros clientes a alcanzar sus objetivos, ofreciendo siempre
                  un servicio confiable, rápido y seguro.
                </p>
              </div>
            </div>
          </div>

          {/* VISIÓN */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4 className="fw-bold mb-3">Nuestra Visión</h4>
                <p className="text-muted" style={{ fontSize: "1.05rem" }}>
                  Convertirnos en la tienda deportiva líder en México,
                  destacándonos por nuestra innovación tecnológica, calidad de
                  productos y atención excepcional al cliente.
                </p>
              </div>
            </div>
          </div>

          {/* COMPROMISO */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4 className="fw-bold mb-3">Compromiso</h4>
                <p className="text-muted" style={{ fontSize: "1.05rem" }}>
                  Nos comprometemos a mejorar continuamente nuestra plataforma,
                  garantizando una experiencia de compra intuitiva, accesible y
                  con los mejores estándares del mercado.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECCIÓN INFERIOR MÁS CONTENIDO */}
      <div className="bg-light py-5 mt-4">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">¿Por qué elegir SportLike?</h2>

          <p
            className="text-center text-secondary mx-auto"
            style={{ maxWidth: "850px", fontSize: "1.1rem", lineHeight: "1.7" }}
          >
            En SportLike trabajamos diariamente para ofrecer una experiencia
            sobresaliente. Nuestra plataforma combina tecnología moderna,
            seguridad en tus compras y una selección de productos cuidadosamente
            pensados para atletas, deportistas recreativos y quienes buscan un
            estilo de vida más saludable.
          </p>

          <p
            className="text-center text-secondary mx-auto mt-3"
            style={{ maxWidth: "850px", fontSize: "1.1rem", lineHeight: "1.7" }}
          >
            Creemos firmemente que el deporte transforma vidas, y queremos ser
            parte de ese proceso brindándote herramientas, productos y apoyo
            para que avances hacia tus metas con confianza.
          </p>
        </div>
      </div>
    </div>
  );
}
