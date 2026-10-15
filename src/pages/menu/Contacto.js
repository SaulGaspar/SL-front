import { API_BASE_URL } from "../../config/api";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import CSS from "./Contacto.styles";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo enviar el mensaje.");
      setForm({ nombre: "", email: "", mensaje: "" });
      setFeedback({ type: "ok", text: "Recibimos tu mensaje. Te responderemos pronto." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "No se pudo enviar el mensaje." });
    } finally {
      setSending(false);
    }
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
            {feedback && <p className={`ct-feedback ${feedback.type}`}>{feedback.text}</p>}
            <button className="ct-submit" type="submit" disabled={sending}>{sending ? "Enviando..." : "Enviar mensaje"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
