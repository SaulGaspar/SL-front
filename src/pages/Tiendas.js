import React from "react";
import { Link } from "react-router-dom";

export default function Tiendas() {
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
          max-width:900px;
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
        .store {
          background:#f6f8fc;
          border-radius:18px;
          padding:22px;
          margin-top:15px;
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Tiendas</b>
        </div>

        <h1 className="page-title">Nuestras Tiendas</h1>

        <div className="store">
          🏬 CDMX – Reforma 123
        </div>

        <div className="store">
          🏬 Guadalajara – Andares
        </div>

        <div className="store">
          🏬 Monterrey – San Pedro
        </div>
      </div>
    </div>
  );
}
