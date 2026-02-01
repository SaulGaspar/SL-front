import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Ayuda() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  const faqs = [
    { title: "📦 ¿Cómo puedo rastrear mi pedido?", text: "Puedes ver el estado de tu pedido desde la sección 'Mis Pedidos' en tu perfil. También recibirás notificaciones por correo cuando cambie el estatus." },
    { title: "🔑 Problemas para iniciar sesión", text: "Si olvidaste tu contraseña, usa la opción 'Recuperar contraseña'. Si el problema persiste, contáctanos desde soporte." },
    { title: "💳 Métodos de pago aceptados", text: "Aceptamos tarjetas de crédito/débito, transferencias y pagos digitales autorizados." },
    { title: "📄 Facturación", text: "Solicita tu factura dentro de las 48 horas posteriores a tu compra desde tu perfil." },
    { title: "🚚 Envíos y tiempos de entrega", text: "Los tiempos varían según tu ubicación. Normalmente entre 2 y 5 días hábiles." },
    { title: "🔄 Devoluciones", text: "Puedes solicitar una devolución dentro de los primeros 7 días desde que recibiste tu pedido." }
  ];

  return (
    <div className="page-wrapper">
      <style>{`
        /* ================= VARIABLES ================= */
        :root {
          --bg-page: linear-gradient(135deg,#eef3ff,#fff);
          --card-bg: #ffffff;
          --title-color: #0a2540;
          --subtitle-color: #6b7a90;
          --faq-bg: #f6f8fc;
          --faq-hover: #eaf0ff;
          --faq-text: #444;
          --support-bg: linear-gradient(135deg,#4f7cff,#6ea8ff);
          --support-text: #ffffff;
          --support-btn-bg: #ffffff;
          --support-btn-text: #4f7cff;
        }

        body[data-bs-theme="dark"] {
          --bg-page: linear-gradient(135deg,#0a1120,#1b1f33);
          --card-bg: #131a2c;
          --title-color: #e5edff;
          --subtitle-color: #a0aec0;
          --faq-bg: #1e293b;
          --faq-hover: #273449;
          --faq-text: #e2e8f0;
          --support-bg: linear-gradient(135deg,#1e40af,#3b82f6);
          --support-text: #e5edff;
          --support-btn-bg: #3b82f6;
          --support-btn-text: #ffffff;
        }

        /* ================= ESTILOS ================= */
        .page-wrapper {
          min-height: 90vh;
          background: var(--bg-page);
          display:flex;
          justify-content:center;
          padding:60px 20px;
        }

        .page-card {
          background: var(--card-bg);
          width:100%;
          max-width:850px;
          padding:45px;
          border-radius:22px;
          box-shadow:0 20px 45px rgba(0,0,0,.15);
        }

        .page-title {
          font-size:2.6rem;
          font-weight:900;
          color: var(--title-color);
          margin-bottom:10px;
        }

        .subtitle {
          color: var(--subtitle-color);
          margin-bottom:35px;
        }

        .faq {
          background: var(--faq-bg);
          border-radius:16px;
          padding:18px 22px;
          margin-bottom:14px;
          cursor:pointer;
          transition:.25s;
        }

        .faq:hover {
          background: var(--faq-hover);
          transform:scale(1.01);
        }

        .faq h5 {
          display:flex;
          justify-content:space-between;
          align-items:center;
          font-weight:700;
          margin:0;
        }

        .faq p {
          margin-top:12px;
          color: var(--faq-text);
          line-height:1.6;
        }

        .arrow {
          font-size:1.2rem;
        }

        .support-box {
          margin-top:45px;
          background: var(--support-bg);
          color: var(--support-text);
          padding:28px;
          border-radius:20px;
          text-align:center;
        }

        .support-box h4 {
          font-weight:800;
        }

        .support-box a {
          display:inline-block;
          margin-top:15px;
          background: var(--support-btn-bg);
          color: var(--support-btn-text);
          padding:10px 22px;
          border-radius:999px;
          text-decoration:none;
          font-weight:700;
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Ayuda</b>
        </div>

        <h1 className="page-title">Centro de Ayuda</h1>
        <p className="subtitle">
          Encuentra respuestas rápidas o ponte en contacto con nuestro equipo.
        </p>

        {faqs.map((faq, i) => (
          <div key={i} className="faq" onClick={() => toggle(i)}>
            <h5>
              {faq.title}
              <span className="arrow">{open === i ? "▲" : "▼"}</span>
            </h5>
            {open === i && <p>{faq.text}</p>}
          </div>
        ))}

        <div className="support-box">
          <h4>¿Necesitas ayuda personalizada?</h4>
          <p>Escríbenos y nuestro equipo te responderá lo antes posible.</p>
          <Link to="/contacto">Contactar Soporte</Link>
        </div>
      </div>
    </div>
  );
}
