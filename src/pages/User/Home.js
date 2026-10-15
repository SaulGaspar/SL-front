import React, { useEffect } from "react";

import css from "./Home.styles";

const Icon = ({ name, size = 22, strokeWidth = 1.8 }) => {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    rotate: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    shield: <><path d="M12 3 4.8 6v5.2c0 4.5 3 8.3 7.2 9.8 4.2-1.5 7.2-5.3 7.2-9.8V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z"/><path d="M17 18c0 2-2 3-5 3"/></>,
    shoe: <><path d="M3 15.5c2.3.1 4.4-.5 5.9-2.2L12 9.8l2.8 3.2 5.4 1.4c.5.1.8.5.8 1v1.1c0 .8-.7 1.5-1.5 1.5H5c-1.1 0-2-.9-2-2z"/><path d="m8.9 13.3 2.7 1.2M11 11l2.7 1.5"/></>,
    shirt: <><path d="m8 4-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3c-.5 1.2-1.9 2-4 2S8.5 5.2 8 4z"/></>,
    dumbbell: <><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></>,
    bag: <><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
    ball: <><circle cx="12" cy="12" r="9"/><path d="m12 8 3 2-1 4h-4l-1-4zM12 8V3M15 10l4-2M14 14l3 4M10 14l-3 4M9 10 5 8"/></>,
    bottle: <><path d="M9 3h6v3l2 3v11H7V9l2-3z"/><path d="M9 6h6M8 11h8"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const VALUES = [
  {
    icon: "check",
    title: "Calidad seleccionada",
    text: "Elegimos productos por su rendimiento, comodidad y durabilidad.",
  },
  {
    icon: "ball",
    title: "Pasión por el deporte",
    text: "Conocemos lo que necesitas para entrenar, competir y avanzar.",
  },
  {
    icon: "shield",
    title: "Confianza en cada compra",
    text: "Información clara y una experiencia segura de principio a fin.",
  },
  {
    icon: "headset",
    title: "Servicio cercano",
    text: "Te acompañamos antes, durante y después de tu compra.",
  },
];

const CATEGORIES = [
  { icon: "shoe", name: "Calzado", filter: "Calzado" },
  { icon: "shirt", name: "Ropa", filter: "Ropa" },
  { icon: "dumbbell", name: "Entrenamiento", filter: "Equipamiento" },
  { icon: "bag", name: "Accesorios", filter: "Accesorios" },
  { icon: "ball", name: "Balones", filter: "Balones" },
  { icon: "bottle", name: "Nutrición", filter: "Nutrición" },
];

const PRINCIPLES = [
  {
    title: "Selección con propósito",
    text: "Productos elegidos por su rendimiento, durabilidad y comodidad.",
  },
  {
    title: "Servicio claro y confiable",
    text: "Precios claros y un proceso de compra sencillo.",
  },
  {
    title: "Equipo para cada objetivo",
    text: "Opciones para cada nivel y disciplina.",
  },
];

const STEPS = [
  { title: "Encuentra lo tuyo", text: "Explora por disciplina, talla o el objetivo que tienes en mente." },
  { title: "Compra con confianza", text: "Elige tu forma de pago y revisa todo antes de confirmar." },
  { title: "Consulta tu pedido", text: "Revisa su estado desde tu cuenta." },
];

const SPORTS = ["Running", "Fútbol", "Gimnasio", "Ciclismo", "Natación", "Yoga"];

export default function Home() {
  useEffect(() => {
    if (!document.getElementById("sl-home-css")) {
      const tag = document.createElement("style");
      tag.id = "sl-home-css";
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => document.getElementById("sl-home-css")?.remove();
  }, []);

  return (
    <main className="sl-home">
      <section className="sl-hero">
        <div className="sl-container sl-hero-grid">
          <div className="sl-hero-copy">
            <span className="sl-eyebrow">Tienda deportiva en línea</span>
            <h1 className="sl-hero-title">
              Equípate para <em>llegar más lejos.</em>
            </h1>
            <p className="sl-hero-sub">
              Productos deportivos seleccionados por su calidad, rendimiento y diseño.
              Todo lo que necesitas para entrenar con confianza.
            </p>
            <div className="sl-actions">
              <a href="/catalogo" className="sl-btn sl-btn-primary">
                Comprar ahora <Icon name="arrow" size={19} />
              </a>
              <a href="/tiendas" className="sl-btn sl-btn-secondary">
                Conoce nuestras tiendas
              </a>
            </div>
            <div className="sl-proof">
              <span><Icon name="check" size={17} /> Pago seguro con Mercado Pago</span>
              <span><Icon name="check" size={17} /> Compra segura</span>
            </div>
          </div>

        </div>
      </section>

      <section className="sl-values" aria-labelledby="sl-values-title">
        <div className="sl-container">
          <div className="sl-values-head">
            <div>
              <span className="sl-label">Lo que nos mueve</span>
              <h2 className="sl-values-title" id="sl-values-title">Nuestros valores.</h2>
            </div>
            <p className="sl-values-intro">
              Estos principios guían la forma en que elegimos productos y atendemos
              a cada persona que confía en SportLike.
            </p>
          </div>
          <div className="sl-values-grid">
            {VALUES.map((item, index) => (
              <article className="sl-value-card" key={item.title}>
                <span className="sl-value-icon"><Icon name={item.icon} size={21} /></span>
                <div>
                  <span className="sl-value-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section sl-section-white">
        <div className="sl-container">
          <div className="sl-heading-row">
            <div>
              <span className="sl-label">Encuentra tu equipo</span>
              <h2 className="sl-title">Todo para tu disciplina.</h2>
            </div>
            <p className="sl-heading-note">
              Una selección para cada disciplina, desde el primer entrenamiento
              hasta el día de competencia.
            </p>
          </div>
          <div className="sl-category-grid">
            {CATEGORIES.map((category) => (
              <a
                className="sl-category"
                href={`/catalogo?categoria=${encodeURIComponent(category.filter)}`}
                key={category.name}
              >
                <span className="sl-category-icon">
                  <Icon name={category.icon} size={31} strokeWidth={1.65} />
                </span>
                <span className="sl-category-bottom">
                  <span>
                    <span className="sl-category-name">{category.name}</span>
                  </span>
                  <span className="sl-circle-arrow"><Icon name="arrow" size={18} /></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section">
        <div className="sl-container sl-story-grid">
          <div className="sl-story-sticky">
            <span className="sl-label">Compromiso SportLike</span>
            <h2 className="sl-title">Rendimiento, calidad y confianza.</h2>
            <p className="sl-story-copy">
              Seleccionamos productos que cumplen con las exigencias del deporte
              y ofrecemos una experiencia de compra clara de principio a fin.
            </p>
          </div>
          <div className="sl-principles">
            {PRINCIPLES.map((item, index) => (
              <article className="sl-principle" key={item.title}>
                <span className="sl-principle-num">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section sl-section-white">
        <div className="sl-container sl-process">
          <div className="sl-process-visual">
            <h2 className="sl-process-big">Equipo para cada disciplina y cada objetivo.</h2>
            <div className="sl-sport-tags">
              {SPORTS.map((sport) => <span className="sl-sport-tag" key={sport}>{sport}</span>)}
            </div>
          </div>
          <div className="sl-process-copy">
            <span className="sl-label">Una experiencia sencilla</span>
            <h2 className="sl-title">Compra fácil y segura.</h2>
            <div className="sl-steps">
              {STEPS.map((step, index) => (
                <article className="sl-step" key={step.title}>
                  <span className="sl-step-num">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sl-cta">
        <div className="sl-container">
          <div className="sl-cta-inner">
            <div className="sl-cta-copy">
              <h2 className="sl-cta-title">Prepárate para tu siguiente reto.</h2>
              <p>Explora nuestro catálogo y encuentra el equipo adecuado para alcanzar tus objetivos.</p>
            </div>
            <a href="/catalogo" className="sl-btn">
              Ver todo el catálogo <Icon name="arrow" size={19} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
