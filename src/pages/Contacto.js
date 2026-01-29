import React from "react";
import { Link } from "react-router-dom";

export default function Contacto() {
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
          max-width:750px;
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
        .contact-box {
          background:#f6f8fc;
          border-radius:16px;
          padding:20px;
          margin-top:15px;
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Contacto</b>
        </div>

        <h1 className="page-title">Contáctanos</h1>

        <div className="contact-box">
          📧 soporte@sportlike.com  
        </div>

        <div className="contact-box">
          📞 +52 55 0000 0000
        </div>

        <div className="contact-box">
          📍 Atención L–V 9:00 a 18:00
        </div>
      </div>
    </div>
  );
}
