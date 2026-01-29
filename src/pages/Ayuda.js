import React from "react";
import { Link } from "react-router-dom";

export default function Ayuda() {
  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          min-height: 90vh;
          background: linear-gradient(135deg,#eef3ff,#fff);
          display:flex;
          justify-content:center;
          align-items:flex-start;
          padding:60px 20px;
        }
        .page-card {
          background:white;
          width:100%;
          max-width:800px;
          padding:45px;
          border-radius:22px;
          box-shadow:0 20px 45px rgba(0,0,0,.15);
        }
        .page-title {
          font-size:2.4rem;
          font-weight:900;
          color:#0a2540;
          margin-bottom:20px;
        }
        .section {
          margin-top:18px;
        }
        .section h5 {
          font-weight:700;
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Ayuda</b>
        </div>

        <h1 className="page-title">Centro de Ayuda</h1>

        <div className="section">
          <h5>📦 Pedidos</h5>
          <p>Consulta el estado de tus compras y entregas.</p>
        </div>

        <div className="section">
          <h5>🔑 Cuenta</h5>
          <p>Administra tu perfil y contraseñas.</p>
        </div>

        <div className="section">
          <h5>💳 Pagos</h5>
          <p>Información sobre métodos de pago y facturación.</p>
        </div>
      </div>
    </div>
  );
}
