import React from "react";

export default function Home() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "80vh", padding: "20px" }}
    >
      <h1 className="fw-bold" style={{ fontSize: "3rem", color: "#0d6efd" }}>
        PRUEBA NETLIFY 🔥
      </h1>

      <p className="mt-3" style={{ fontSize: "1.3rem", maxWidth: "600px" }}>
        Si estás viendo este mensaje en producción, Netlify SÍ está actualizando correctamente.
      </p>

      <a href="/catalogo" className="btn btn-primary btn-lg mt-4">
        Ir al catálogo
      </a>
    </div>
  );
}
