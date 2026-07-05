import React, { useState } from "react";
import { Link } from "react-router-dom";

const CSS = `
  .ct-page {
    --ct-ink:#0a1a2f; --ct-muted:#687587; --ct-paper:#f5f7f4;
    --ct-card:#fff; --ct-line:rgba(10,26,47,.11);
    --ct-blue:#244fdb; --ct-acid:#bde632;
    min-height:100vh; background:var(--ct-paper); color:var(--ct-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }
  body[data-bs-theme="dark"] .ct-page {
    --ct-ink:#f3f6fa; --ct-muted:#a6b1c0; --ct-paper:#09131f;
    --ct-card:#101d2b; --ct-line:rgba(255,255,255,.11); --ct-blue:#82a2ff;
  }
  .ct-page *,.ct-page *::before,.ct-page *::after { box-sizing:border-box; }
  .ct-shell { width:min(1100px,calc(100% - 40px)); margin-inline:auto; }
  .ct-hero {
    position:relative; padding:48px 0 104px; overflow:hidden;
    color:#fff; background:#0a1a2f;
  }
  .ct-hero::after {
    content:""; position:absolute; width:340px; height:340px;
    right:7%; top:-230px; border:54px solid var(--ct-acid); border-radius:50%;
  }
  .ct-back {
    min-height:42px; display:inline-flex; align-items:center; gap:8px;
    padding:0 15px; border:1px solid rgba(255,255,255,.16);
    border-radius:999px; color:rgba(255,255,255,.8);
    background:rgba(255,255,255,.05); text-decoration:none;
    font-size:.82rem; font-weight:600;
  }
  .ct-hero-copy { position:relative; z-index:1; max-width:760px; margin-top:62px; }
  .ct-eyebrow {
    display:block; margin-bottom:14px; color:var(--ct-acid);
    font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
  }
  .ct-title {
    margin:0; color:#fff; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:.96; letter-spacing:-.06em;
  }
  .ct-lead {
    max-width:620px; margin:20px 0 0; color:rgba(255,255,255,.64);
    font-size:1rem; line-height:1.7;
  }
  .ct-layout {
    position:relative; z-index:2; display:grid;
    grid-template-columns:340px minmax(0,1fr); gap:20px;
    align-items:start; margin-top:-48px; padding-bottom:90px;
  }
  .ct-info,.ct-form-card {
    border:1px solid var(--ct-line); border-radius:24px;
    background:var(--ct-card); box-shadow:0 18px 48px rgba(10,26,47,.07);
  }
  .ct-info { padding:28px; }
  .ct-info h2,.ct-form-card h2 {
    margin:0; color:var(--ct-ink); font-size:1.35rem;
    font-weight:750; letter-spacing:-.035em;
  }
  .ct-info > p,.ct-form-intro {
    margin:10px 0 24px; color:var(--ct-muted); font-size:.86rem; line-height:1.65;
  }
  .ct-methods { display:grid; gap:10px; }
  .ct-method {
    display:grid; grid-template-columns:42px minmax(0,1fr); gap:13px;
    align-items:center; min-height:74px; padding:13px;
    border:1px solid var(--ct-line); border-radius:14px;
    color:var(--ct-ink); text-decoration:none;
    transition:transform .2s ease,border-color .2s ease;
  }
  .ct-method:hover { transform:translateY(-2px); border-color:rgba(36,79,219,.3); }
  .ct-method-icon {
    width:42px; height:42px; display:grid; place-items:center;
    border-radius:12px; background:rgba(36,79,219,.09);
    color:var(--ct-blue); font-size:1rem; font-weight:700;
  }
  .ct-method-label {
    display:block; margin-bottom:3px; color:var(--ct-muted);
    font-size:.64rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase;
  }
  .ct-method-value { display:block; font-size:.78rem; font-weight:650; overflow-wrap:anywhere; }
  .ct-form-card { padding:clamp(28px,5vw,48px); }
  .ct-form { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .ct-field { display:grid; gap:7px; }
  .ct-field.full { grid-column:1/-1; }
  .ct-field label {
    color:var(--ct-ink); font-size:.72rem; font-weight:700;
  }
  .ct-field input,.ct-field textarea {
    width:100%; min-height:50px; padding:13px 15px;
    border:1px solid var(--ct-line); border-radius:12px;
    background:var(--ct-paper); color:var(--ct-ink);
    font:inherit; font-size:.87rem; outline:0;
    transition:border-color .2s ease,box-shadow .2s ease;
  }
  .ct-field textarea { min-height:150px; resize:vertical; }
  .ct-field input:focus,.ct-field textarea:focus {
    border-color:var(--ct-blue); box-shadow:0 0 0 4px rgba(36,79,219,.1);
  }
  .ct-submit {
    width:fit-content; min-height:50px; grid-column:1/-1;
    padding:0 22px; border:0; border-radius:12px;
    background:#244fdb; color:#fff; font:inherit;
    font-size:.84rem; font-weight:700; cursor:pointer;
    box-shadow:0 10px 24px rgba(36,79,219,.2);
  }
  .ct-back:focus-visible,.ct-method:focus-visible,.ct-submit:focus-visible {
    outline:3px solid var(--ct-acid); outline-offset:3px;
  }
  @media(max-width:800px) {
    .ct-layout { grid-template-columns:1fr; }
    .ct-methods { grid-template-columns:repeat(3,minmax(0,1fr)); }
  }
  @media(max-width:650px) {
    .ct-shell { width:min(100% - 24px,1100px); }
    .ct-hero { padding:28px 0 76px; }
    .ct-hero-copy { margin-top:48px; }
    .ct-layout { margin-top:-34px; padding-bottom:60px; }
    .ct-info,.ct-form-card { border-radius:20px; }
    .ct-methods,.ct-form { grid-template-columns:1fr; }
    .ct-field.full,.ct-submit { grid-column:auto; }
    .ct-submit { width:100%; }
  }
`;

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Mensaje enviado correctamente");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <main className="ct-page">
      <style>{CSS}</style>

      <header className="ct-hero">
        <div className="ct-shell">
          <Link to="/" className="ct-back">← Volver al inicio</Link>
          <div className="ct-hero-copy">
            <span className="ct-eyebrow">Estamos para ayudarte</span>
            <h1 className="ct-title">Hablemos.</h1>
            <p className="ct-lead">
              Escríbenos sobre tu compra, pedido o cuenta. Te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </header>

      <div className="ct-shell ct-layout">
        <aside className="ct-info">
          <h2>Canales de atención</h2>
          <p>Elige el medio que te resulte más cómodo.</p>
          <div className="ct-methods">
            <a className="ct-method" href="mailto:ethraei_09@hotmail.com">
              <span className="ct-method-icon">@</span>
              <span>
                <span className="ct-method-label">Correo</span>
                <span className="ct-method-value">ethraei_09@hotmail.com</span>
              </span>
            </a>
            <a className="ct-method" href="tel:+527711286709">
              <span className="ct-method-icon">☎</span>
              <span>
                <span className="ct-method-label">Teléfono</span>
                <span className="ct-method-value">771 128 6709</span>
              </span>
            </a>
            <div className="ct-method">
              <span className="ct-method-icon">◷</span>
              <span>
                <span className="ct-method-label">Horario</span>
                <span className="ct-method-value">Lunes a sábado · 9:00–20:00</span>
              </span>
            </div>
          </div>
        </aside>

        <section className="ct-form-card" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">Envíanos un mensaje</h2>
          <p className="ct-form-intro">Cuéntanos brevemente cómo podemos ayudarte.</p>
          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-field">
              <label htmlFor="contact-name">Nombre</label>
              <input
                id="contact-name"
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ct-field">
              <label htmlFor="contact-email">Correo electrónico</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ct-field full">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea
                id="contact-message"
                name="mensaje"
                placeholder="Escribe aquí los detalles de tu consulta..."
                value={form.mensaje}
                onChange={handleChange}
                required
              />
            </div>
            <button className="ct-submit" type="submit">Enviar mensaje</button>
          </form>
        </section>
      </div>
    </main>
  );
}
