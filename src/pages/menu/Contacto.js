import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contacto() {

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado correctamente 👍");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="page-wrapper">
      <style>{`
        /* ================= VARIABLES ================= */
        :root {
          --bg-page: linear-gradient(135deg,#eef3ff,#fff);
          --card-bg: #ffffff;
          --title-color: #0a2540;
          --subtitle-color: #6b7a90;
          --contact-box-bg: #f6f8fc;
          --contact-box-hover: #eaf0ff;
          --contact-box-text: #0a2540;
          --form-bg: #f9fbff;
          --input-border: #dbe3f3;
          --input-focus: #4f7cff;
          --button-bg: #4f7cff;
          --button-hover: #3b66e0;
          --button-text: #ffffff;
        }

        body[data-bs-theme="dark"] {
          --bg-page: linear-gradient(135deg,#0a1120,#1b1f33);
          --card-bg: #131a2c;
          --title-color: #e5edff;
          --subtitle-color: #a0aec0;
          --contact-box-bg: #1e293b;
          --contact-box-hover: #273449;
          --contact-box-text: #e2e8f0;
          --form-bg: #1c253b;
          --input-border: #3b4a66;
          --input-focus: #3b82f6;
          --button-bg: #3b82f6;
          --button-hover: #2563eb;
          --button-text: #ffffff;
        }

        /* ================= ESTILOS ================= */
        .page-wrapper {
          min-height:90vh;
          background: var(--bg-page);
          display:flex;
          justify-content:center;
          padding:60px 20px;
        }

        .page-card {
          background: var(--card-bg);
          max-width:850px;
          width:100%;
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
          margin-bottom:30px;
        }

        .contact-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:15px;
          margin-bottom:35px;
        }

        .contact-box {
          background: var(--contact-box-bg);
          border-radius:18px;
          padding:22px;
          font-weight:600;
          transition:.25s;
          cursor:pointer;
          text-decoration:none;
          color: var(--contact-box-text);
        }

        .contact-box:hover {
          background: var(--contact-box-hover);
          transform:translateY(-4px);
        }

        .form-box {
          background: var(--form-bg);
          border-radius:20px;
          padding:28px;
        }

        .form-box h4 {
          font-weight:800;
          margin-bottom:20px;
        }

        input, textarea {
          width:100%;
          padding:12px 14px;
          margin-bottom:15px;
          border-radius:10px;
          border:1px solid var(--input-border);
          outline:none;
          font-size:.95rem;
          background: inherit;
          color: inherit;
        }

        input:focus, textarea:focus {
          border-color: var(--input-focus);
        }

        button {
          background: var(--button-bg);
          color: var(--button-text);
          border:none;
          padding:12px 30px;
          border-radius:999px;
          font-weight:700;
          cursor:pointer;
          transition:.25s;
        }

        button:hover {
          background: var(--button-hover);
        }
      `}</style>

      <div className="page-card">

        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Contacto</b>
        </div>

        <h1 className="page-title">Contáctanos</h1>
        <p className="subtitle">
          Estamos listos para ayudarte. Escríbenos o usa el formulario.
        </p>

        {/* INFO */}
        <div className="contact-grid">

          {/* EMAIL -> GMAIL */}
          <div
            className="contact-box"
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=soporte@sportlike.com",
                "_blank"
              )
            }
          >
            📧 soporte@sportlike.com
          </div>

          {/* TELÉFONO */}
          <a
            href="tel:+525500000000"
            className="contact-box"
          >
            📞 +52 55 0000 0000
          </a>

          {/* HORARIO */}
          <div className="contact-box">
            📍 L–V · 9:00 a 18:00
          </div>

        </div>

        {/* FORMULARIO */}
        <div className="form-box">
          <h4>Envíanos un mensaje</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Tu correo"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="mensaje"
              rows="4"
              placeholder="Escribe tu mensaje..."
              value={form.mensaje}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Enviar Mensaje
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
