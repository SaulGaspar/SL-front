import React from "react";
import { Link } from "react-router-dom";

export default function Configuracion() {
  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          min-height:90vh;
          background:linear-gradient(135deg,#eef3ff,#fff);
          display:flex;
          justify-content:center;
          padding:60px 20px;
        }
        .page-card {
          background:white;
          max-width:720px;
          width:100%;
          padding:45px;
          border-radius:22px;
          box-shadow:0 20px 45px rgba(0,0,0,.15);
        }
        .page-title {
          font-size:2.4rem;
          font-weight:900;
          color:#0a2540;
        }
        .config-item {
          background:#f5f7fb;
          border-radius:14px;
          padding:18px;
          margin-top:15px;
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Configuración</b>
        </div>

        <h1 className="page-title">Configuración</h1>

        <div className="config-item">
          🔔 Notificaciones
        </div>

        <div className="config-item">
          🌙 Tema oscuro (próximamente)
        </div>

        <div className="config-item">
          🔒 Seguridad
        </div>
      </div>
    </div>
  );
}
