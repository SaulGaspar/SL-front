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
    category: "Envíos",
    title: "¿Cuánto tarda en llegar mi compra?",
    text: "La entrega habitual es de 2 a 5 días hábiles. El tiempo puede variar según la ubicación y la disponibilidad del producto.",
  },
  {
    category: "Cambios",
    title: "¿Cómo solicito una devolución?",
    text: "Comunícate con soporte indicando tu número de pedido y el motivo. Te explicaremos los pasos de acuerdo con el estado de la compra.",
  },
];

const CSS = `
  .hp-page {
    --hp-ink:#0a1a2f; --hp-muted:#687587; --hp-paper:#f5f7f4;
    --hp-card:#fff; --hp-line:rgba(10,26,47,.11);
    --hp-blue:#244fdb; --hp-acid:#bde632;
    min-height:100vh; background:var(--hp-paper); color:var(--hp-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }
  body[data-bs-theme="dark"] .hp-page {
    --hp-ink:#f3f6fa; --hp-muted:#a6b1c0; --hp-paper:#09131f;
    --hp-card:#101d2b; --hp-line:rgba(255,255,255,.11); --hp-blue:#82a2ff;
  }
  .hp-page *,.hp-page *::before,.hp-page *::after { box-sizing:border-box; }
  .hp-shell { width:min(1060px,calc(100% - 40px)); margin-inline:auto; }
  .hp-hero {
    position:relative; padding:48px 0 100px; overflow:hidden;
    color:#fff; background:#0a1a2f;
  }
  .hp-hero::after {
    content:""; position:absolute; width:340px; height:340px;
    right:7%; top:-230px; border:54px solid var(--hp-acid); border-radius:50%;
  }
  .hp-back {
    min-height:42px; display:inline-flex; align-items:center; gap:8px;
    padding:0 15px; border:1px solid rgba(255,255,255,.16);
    border-radius:999px; color:rgba(255,255,255,.8);
    background:rgba(255,255,255,.05); text-decoration:none;
    font-size:.82rem; font-weight:600;
  }
  .hp-hero-copy { position:relative; z-index:1; max-width:760px; margin-top:62px; }
  .hp-eyebrow {
    display:block; margin-bottom:14px; color:var(--hp-acid);
    font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
  }
  .hp-title {
    margin:0; color:#fff; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:.96; letter-spacing:-.06em;
  }
  .hp-lead {
    max-width:620px; margin:20px 0 0; color:rgba(255,255,255,.64);
    font-size:1rem; line-height:1.7;
  }
  .hp-content {
    position:relative; z-index:2; margin-top:-48px; padding-bottom:90px;
  }
  .hp-panel {
    padding:clamp(26px,5vw,52px); border:1px solid var(--hp-line);
    border-radius:26px; background:var(--hp-card);
    box-shadow:0 20px 55px rgba(10,26,47,.08);
  }
  .hp-panel-head {
    display:flex; align-items:end; justify-content:space-between;
    gap:28px; margin-bottom:28px;
  }
  .hp-panel-head h2 {
    margin:0; color:var(--hp-ink); font-size:clamp(1.65rem,3vw,2.25rem);
    font-weight:750; letter-spacing:-.045em;
  }
  .hp-panel-head p {
    max-width:390px; margin:0; color:var(--hp-muted);
    font-size:.87rem; line-height:1.6;
  }
  .hp-faq-list { border-top:1px solid var(--hp-line); }
  .hp-faq {
    border-bottom:1px solid var(--hp-line);
  }
  .hp-question {
    width:100%; min-height:82px; display:grid;
    grid-template-columns:105px minmax(0,1fr) 38px;
    align-items:center; gap:18px; padding:16px 0;
    border:0; background:transparent; color:var(--hp-ink);
    font:inherit; text-align:left; cursor:pointer;
  }
  .hp-category {
    width:fit-content; padding:6px 10px; border-radius:999px;
    color:var(--hp-blue); background:rgba(36,79,219,.08);
    font-size:.66rem; font-weight:700; letter-spacing:.04em;
  }
  .hp-question strong { font-size:.96rem; font-weight:700; }
  .hp-toggle {
    width:34px; height:34px; display:grid; place-items:center;
    border:1px solid var(--hp-line); border-radius:50%;
    color:var(--hp-blue); font-size:1.1rem; transition:transform .2s ease;
  }
  .hp-toggle.open { transform:rotate(45deg); }
  .hp-answer {
    max-width:720px; margin:0 42px 0 123px; padding:0 0 24px;
    color:var(--hp-muted); font-size:.9rem; line-height:1.72;
  }
  .hp-support {
    position:relative; display:grid; grid-template-columns:1fr auto;
    align-items:center; gap:28px; margin-top:24px; padding:30px;
    border-radius:20px; overflow:hidden; background:#244fdb; color:#fff;
  }
  .hp-support::after {
    content:""; position:absolute; width:180px; height:180px;
    right:-105px; top:-105px; border:32px solid var(--hp-acid); border-radius:50%;
  }
  .hp-support-copy { position:relative; z-index:1; }
  .hp-support h3 { margin:0 0 7px; color:#fff; font-size:1.25rem; font-weight:750; }
  .hp-support p { margin:0; color:rgba(255,255,255,.7); font-size:.85rem; }
  .hp-support-actions { position:relative; z-index:1; display:flex; gap:9px; }
  .hp-action {
    min-height:44px; display:inline-flex; align-items:center; justify-content:center;
    padding:0 17px; border-radius:11px; background:#fff; color:#0a1a2f;
    text-decoration:none; font-size:.8rem; font-weight:700;
  }
  .hp-action.secondary {
    border:1px solid rgba(255,255,255,.28); background:transparent; color:#fff;
  }
  .hp-question:focus-visible,.hp-action:focus-visible,.hp-back:focus-visible {
    outline:3px solid var(--hp-acid); outline-offset:3px;
  }
  @media(max-width:700px) {
    .hp-shell { width:min(100% - 24px,1060px); }
    .hp-hero { padding:28px 0 76px; }
    .hp-hero-copy { margin-top:48px; }
    .hp-content { margin-top:-34px; padding-bottom:60px; }
    .hp-panel { border-radius:20px; }
    .hp-panel-head { display:block; }
    .hp-panel-head p { margin-top:12px; }
    .hp-question { grid-template-columns:1fr 34px; gap:12px; }
    .hp-category { grid-column:1/-1; }
    .hp-answer { margin-left:0; margin-right:38px; }
    .hp-support { grid-template-columns:1fr; padding:24px; }
    .hp-support-actions { flex-wrap:wrap; }
  }
`;

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
              Encuentra respuestas sobre compras, pagos, entregas y tu cuenta.
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
