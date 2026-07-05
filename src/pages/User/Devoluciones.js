import React from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Contáctanos",
    text: "Indica tu número de pedido, el producto y el motivo de la solicitud.",
  },
  {
    title: "Recibe las instrucciones",
    text: "Revisaremos el caso y te explicaremos cómo preparar y entregar el producto.",
  },
  {
    title: "Seguimiento y resolución",
    text: "Te mantendremos informado hasta concluir el cambio, reposición o devolución.",
  },
];

const CSS = `
  .rv-page {
    --rv-ink:#0a1a2f; --rv-muted:#687587; --rv-paper:#f5f7f4;
    --rv-card:#fff; --rv-line:rgba(10,26,47,.11);
    --rv-blue:#244fdb; --rv-acid:#bde632;
    min-height:100vh; background:var(--rv-paper); color:var(--rv-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }
  body[data-bs-theme="dark"] .rv-page {
    --rv-ink:#f3f6fa; --rv-muted:#a6b1c0; --rv-paper:#09131f;
    --rv-card:#101d2b; --rv-line:rgba(255,255,255,.11); --rv-blue:#82a2ff;
  }
  .rv-page *,.rv-page *::before,.rv-page *::after { box-sizing:border-box; }
  .rv-shell { width:min(1080px,calc(100% - 40px)); margin-inline:auto; }
  .rv-hero {
    position:relative; padding:48px 0 104px; overflow:hidden;
    background:#0a1a2f; color:#fff;
  }
  .rv-hero::after {
    content:""; position:absolute; width:340px; height:340px;
    right:7%; top:-230px; border:54px solid var(--rv-acid); border-radius:50%;
  }
  .rv-back {
    min-height:42px; display:inline-flex; align-items:center; gap:8px;
    padding:0 15px; border:1px solid rgba(255,255,255,.16);
    border-radius:999px; background:rgba(255,255,255,.05);
    color:rgba(255,255,255,.8); text-decoration:none;
    font-size:.82rem; font-weight:600;
  }
  .rv-hero-copy { position:relative; z-index:1; max-width:760px; margin-top:62px; }
  .rv-eyebrow {
    display:block; margin-bottom:14px; color:var(--rv-acid);
    font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
  }
  .rv-title {
    margin:0; color:#fff; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:.96; letter-spacing:-.06em;
  }
  .rv-lead {
    max-width:640px; margin:20px 0 0; color:rgba(255,255,255,.64);
    font-size:1rem; line-height:1.7;
  }
  .rv-content { position:relative; z-index:2; margin-top:-48px; padding-bottom:90px; }
  .rv-panel {
    padding:clamp(28px,5vw,52px); border:1px solid var(--rv-line);
    border-radius:26px; background:var(--rv-card);
    box-shadow:0 20px 55px rgba(10,26,47,.08);
  }
  .rv-intro {
    display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,.7fr);
    gap:42px; align-items:start; margin-bottom:42px;
  }
  .rv-intro h2 {
    margin:0 0 14px; color:var(--rv-ink);
    font-size:clamp(1.8rem,3.5vw,2.7rem); font-weight:750;
    line-height:1.05; letter-spacing:-.05em;
  }
  .rv-intro p { margin:0; color:var(--rv-muted); font-size:.9rem; line-height:1.72; }
  .rv-summary {
    padding:22px; border-radius:18px; background:#0a1a2f; color:#fff;
  }
  .rv-summary strong {
    display:block; margin-bottom:8px; color:var(--rv-acid);
    font-size:.72rem; letter-spacing:.1em; text-transform:uppercase;
  }
  .rv-summary p { color:rgba(255,255,255,.68); }
  .rv-steps {
    display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
    gap:12px; margin-bottom:34px;
  }
  .rv-step {
    min-height:210px; padding:23px; border:1px solid var(--rv-line);
    border-radius:18px; background:var(--rv-paper);
  }
  .rv-number {
    width:40px; height:40px; display:grid; place-items:center;
    margin-bottom:48px; border-radius:12px;
    background:rgba(36,79,219,.09); color:var(--rv-blue);
    font-size:.7rem; font-weight:750;
  }
  .rv-step h3 { margin:0 0 8px; color:var(--rv-ink); font-size:1rem; font-weight:750; }
  .rv-step p { margin:0; color:var(--rv-muted); font-size:.8rem; line-height:1.6; }
  .rv-conditions {
    padding-top:30px; border-top:1px solid var(--rv-line);
  }
  .rv-conditions h2 {
    margin:0 0 20px; color:var(--rv-ink); font-size:1.35rem; font-weight:750;
  }
  .rv-list {
    display:grid; grid-template-columns:repeat(2,minmax(0,1fr));
    gap:11px; margin:0; padding:0; list-style:none;
  }
  .rv-list li {
    position:relative; padding:15px 16px 15px 40px;
    border:1px solid var(--rv-line); border-radius:13px;
    color:var(--rv-muted); font-size:.82rem; line-height:1.55;
  }
  .rv-list li::before {
    content:"✓"; position:absolute; left:15px; top:15px;
    color:var(--rv-blue); font-weight:800;
  }
  .rv-cta {
    display:flex; align-items:center; justify-content:space-between;
    gap:24px; margin-top:28px; padding:24px;
    border-radius:18px; background:#244fdb; color:#fff;
  }
  .rv-cta h3 { margin:0 0 5px; color:#fff; font-size:1.08rem; }
  .rv-cta p { margin:0; color:rgba(255,255,255,.7); font-size:.8rem; }
  .rv-cta a {
    flex:0 0 auto; min-height:44px; display:inline-flex; align-items:center;
    padding:0 17px; border-radius:11px; background:#fff; color:#0a1a2f;
    text-decoration:none; font-size:.78rem; font-weight:750;
  }
  @media(max-width:720px) {
    .rv-shell { width:min(100% - 24px,1080px); }
    .rv-hero { padding:28px 0 76px; }
    .rv-hero-copy { margin-top:48px; }
    .rv-content { margin-top:-34px; padding-bottom:60px; }
    .rv-panel { border-radius:20px; }
    .rv-intro { grid-template-columns:1fr; gap:20px; }
    .rv-steps,.rv-list { grid-template-columns:1fr; }
    .rv-step { min-height:175px; }
    .rv-number { margin-bottom:28px; }
    .rv-cta { align-items:flex-start; flex-direction:column; }
  }
`;

export default function Devoluciones() {
  return (
    <main className="rv-page">
      <style>{CSS}</style>

      <header className="rv-hero">
        <div className="rv-shell">
          <Link to="/" className="rv-back">← Volver al inicio</Link>
          <div className="rv-hero-copy">
            <span className="rv-eyebrow">Cambios y devoluciones</span>
            <h1 className="rv-title">Queremos que compres con confianza.</h1>
            <p className="rv-lead">
              Si algo no salió como esperabas, te ayudamos a encontrar una solución clara.
            </p>
          </div>
        </div>
      </header>

      <div className="rv-shell rv-content">
        <section className="rv-panel">
          <div className="rv-intro">
            <div>
              <h2>Un proceso sencillo y acompañado.</h2>
              <p>
                Antes de devolver un producto, comunícate con nuestro equipo. Revisaremos
                el estado del pedido y te indicaremos la opción correspondiente.
              </p>
            </div>
            <div className="rv-summary">
              <strong>Importante</strong>
              <p>Conserva el producto sin uso, con sus accesorios y empaque original.</p>
            </div>
          </div>

          <div className="rv-steps">
            {STEPS.map((step, index) => (
              <article className="rv-step" key={step.title}>
                <span className="rv-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <div className="rv-conditions">
            <h2>Consideraciones generales</h2>
            <ul className="rv-list">
              <li>La cancelación no tiene costo mientras el pedido no haya sido enviado.</li>
              <li>Los productos incorrectos o dañados pueden solicitar reposición.</li>
              <li>El artículo debe conservarse sin uso y en su empaque original.</li>
              <li>La garantía por defectos de fábrica es de 30 días.</li>
            </ul>
          </div>

          <div className="rv-cta">
            <div>
              <h3>¿Quieres iniciar una solicitud?</h3>
              <p>Ten a la mano tu número de pedido para recibir atención más rápida.</p>
            </div>
            <Link to="/contacto">Contactar soporte</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
