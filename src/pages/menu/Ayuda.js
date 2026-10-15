import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    category: "Pedidos",
    title: "¿Cómo puedo rastrear mi pedido?",
    text: "Consulta el estado desde “Mis compras” dentro de tu perfil. También recibirás una notificación cuando el pedido cambie de etapa.",
  },
  {
    category: "Cuenta",
    title: "No puedo iniciar sesión",
    text: "Utiliza la opción “Recuperar contraseña”. Si el problema continúa, nuestro equipo de soporte puede ayudarte a recuperar el acceso.",
  },
  {
    category: "Pagos",
    title: "¿Qué métodos de pago aceptan?",
    text: "Puedes utilizar las tarjetas y medios digitales disponibles al finalizar tu compra. Antes de confirmar verás todas las opciones habilitadas.",
  },
  {
    category: "Facturación",
    title: "¿Cómo solicito mi factura?",
    text: "Solicítala dentro de las 48 horas posteriores a la compra. Ten a la mano tus datos fiscales y la información del pedido.",
  },
  {
    category: "Cambios",
    title: "¿Cómo solicito una devolución?",
    text: "Comunícate con soporte indicando tu número de pedido y el motivo. Te explicaremos los pasos de acuerdo con el estado de la compra.",
  },
];

import CSS from "./Ayuda.styles";

export default function Ayuda() {
  const [open, setOpen] = useState(null);

  return (
    <main className="hp-page">
      <style>{CSS}</style>

      <header className="hp-hero">
        <div className="hp-shell">
          <Link to="/" className="hp-back">← Volver al inicio</Link>
          <div className="hp-hero-copy">
            <span className="hp-eyebrow">Soporte SportLike</span>
            <h1 className="hp-title">¿Cómo podemos ayudarte?</h1>
            <p className="hp-lead">
              Encuentra respuestas sobre compras, pagos y tu cuenta.
            </p>
          </div>
        </div>
      </header>

      <div className="hp-shell hp-content">
        <section className="hp-panel" aria-labelledby="faq-title">
          <div className="hp-panel-head">
            <h2 id="faq-title">Preguntas frecuentes</h2>
            <p>Selecciona una pregunta para consultar la respuesta.</p>
          </div>

          <div className="hp-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = open === index;
              return (
                <article className="hp-faq" key={faq.title}>
                  <button
                    type="button"
                    className="hp-question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className="hp-category">{faq.category}</span>
                    <strong>{faq.title}</strong>
                    <span className={`hp-toggle ${isOpen ? "open" : ""}`} aria-hidden="true">+</span>
                  </button>
                  {isOpen && (
                    <p className="hp-answer" id={`faq-answer-${index}`}>{faq.text}</p>
                  )}
                </article>
              );
            })}
          </div>

          <div className="hp-support">
            <div className="hp-support-copy">
              <h3>¿Necesitas atención personalizada?</h3>
              <p>Nuestro equipo está disponible para ayudarte con tu compra.</p>
            </div>
            <div className="hp-support-actions">
              <Link to="/contacto" className="hp-action">Contactar soporte</Link>
              <Link to="/orders" className="hp-action secondary">Ver mis compras</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
