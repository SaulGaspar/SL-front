import React, { useEffect } from "react";

const css = `
  /* ── HERO ── */
  .sl-hero {
    position: relative;
    min-height: 78vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 70px 24px 60px;
    overflow: hidden;
  }
  .sl-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 90% 55% at 50% 0%,
      rgba(79,124,255,0.14) 0%, transparent 70%);
    pointer-events: none;
  }
  body[data-bs-theme="dark"] .sl-hero::before {
    background: radial-gradient(ellipse 90% 55% at 50% 0%,
      rgba(96,165,250,0.13) 0%, transparent 70%);
  }
  .sl-hero-inner { position: relative; z-index: 1; }

  .sl-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(79,124,255,0.10);
    border: 1px solid rgba(79,124,255,0.25);
    color: var(--accent);
    padding: 5px 16px;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    margin-bottom: 22px;
  }

  .sl-hero-title {
    font-size: clamp(2.3rem, 5.5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--text-main);
    margin-bottom: 22px;
  }
  .sl-hero-title em {
    font-style: normal;
    color: var(--accent);
  }

  .sl-hero-sub {
    max-width: 660px;
    font-size: 1.12rem;
    line-height: 1.75;
    color: var(--text-muted);
    margin: 0 auto 38px;
  }

  .sl-hero-btns {
    display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
  }
  .sl-btn-primary {
    background: var(--accent);
    color: #fff !important;
    padding: 13px 32px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    text-decoration: none;
    transition: all .2s;
    display: inline-block;
  }
  .sl-btn-primary:hover { filter: brightness(1.12); transform: translateY(-2px); }
  .sl-btn-ghost {
    background: transparent;
    border: 2px solid var(--border-soft);
    color: var(--text-main) !important;
    padding: 13px 32px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all .2s;
    display: inline-block;
  }
  .sl-btn-ghost:hover {
    border-color: var(--accent);
    color: var(--accent) !important;
  }

  /* ── STRIP GARANTIAS ── */
  .sl-strip {
    background: var(--bg-card);
    border-top: 1px solid var(--border-soft);
    border-bottom: 1px solid var(--border-soft);
    padding: 22px 0;
  }
  .sl-strip-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    padding: 10px 8px;
  }
  .sl-strip-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: rgba(79,124,255,0.10);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.15rem;
    flex-shrink: 0;
  }
  body[data-bs-theme="dark"] .sl-strip-icon { background: rgba(96,165,250,0.13); }
  .sl-strip-title { font-weight: 700; font-size: 0.88rem; color: var(--text-main); line-height: 1.2; }
  .sl-strip-sub   { font-size: 0.78rem; color: var(--text-muted); line-height: 1.3; }

  /* ── SECCION LABELS ── */
  .sl-section-label {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .sl-section-title {
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .sl-section-sub {
    color: var(--text-muted);
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ── MISSION CARDS ── */
  .sl-cards-section { padding: 72px 0; }
  .sl-mission-card {
    background: var(--bg-card);
    border: 1px solid var(--border-soft);
    border-radius: 18px;
    padding: 30px 26px;
    height: 100%;
    transition: transform .2s, box-shadow .2s;
    position: relative;
    overflow: hidden;
  }
  .sl-mission-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 32px rgba(0,0,0,0.10);
  }
  .sl-mission-card::after {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    border-radius: 3px 3px 0 0;
    opacity: 0;
    transition: opacity .2s;
  }
  .sl-mission-card:hover::after { opacity: 1; }
  .sl-mission-icon {
    width: 50px; height: 50px;
    background: rgba(79,124,255,0.10);
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 18px;
  }
  body[data-bs-theme="dark"] .sl-mission-icon { background: rgba(96,165,250,0.14); }
  .sl-mission-card h4 { font-weight: 800; font-size: 1.05rem; color: var(--text-main); margin-bottom: 10px; }
  .sl-mission-card p  { font-size: 0.96rem; color: var(--text-muted); line-height: 1.7; margin: 0; }

  /* ── CATEGORIAS ── */
  .sl-categories-section { padding: 70px 0; background: var(--bg-main); }
  .sl-cat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-soft);
    border-radius: 16px;
    padding: 26px 16px;
    text-align: center;
    transition: all .2s;
    text-decoration: none;
    display: block;
    color: var(--text-main);
  }
  .sl-cat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 26px rgba(0,0,0,0.09);
    border-color: var(--accent);
    color: var(--text-main);
  }
  .sl-cat-emoji { font-size: 2.4rem; display: block; margin-bottom: 10px; }
  .sl-cat-name  { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }

  /* ── POR QUE SPORTLIKE (dark mode fix) ── */
  .sl-why-section {
    padding: 80px 0;
    background: var(--bg-card);
    border-top: 1px solid var(--border-soft);
    border-bottom: 1px solid var(--border-soft);
  }
  .sl-why-section h2, .sl-why-section h3 { color: var(--text-main) !important; }
  .sl-why-section p { color: var(--text-muted) !important; }
  .sl-why-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-main);
    border: 1px solid var(--border-soft);
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-main);
    width: 100%;
    transition: border-color .2s, transform .15s;
  }
  .sl-why-pill:hover {
    border-color: var(--accent);
    transform: translateX(4px);
  }

  /* ── FEATURES / COMO FUNCIONA ── */
  .sl-features-section { padding: 80px 0; background: var(--bg-main); }
  .sl-feature-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }
  .sl-feature-row:last-child { margin-bottom: 0; }
  .sl-feature-num {
    width: 38px; height: 38px;
    background: var(--accent);
    color: #fff;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  body[data-bs-theme="dark"] .sl-feature-num { color: #020617; }
  .sl-feature-text h5 { font-weight: 700; font-size: 0.97rem; color: var(--text-main); margin-bottom: 4px; }
  .sl-feature-text p  { font-size: 0.92rem; color: var(--text-muted); margin: 0; line-height: 1.65; }
  .sl-feature-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-soft);
    border-radius: 20px;
    padding: 40px 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .sl-feature-panel-title {
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--text-main);
    margin-bottom: 14px;
    line-height: 1.25;
  }
  .sl-feature-panel-sub {
    font-size: 0.97rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .sl-tag {
    display: inline-block;
    background: rgba(79,124,255,0.10);
    color: var(--accent);
    border-radius: 8px;
    padding: 5px 13px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 3px;
  }
  body[data-bs-theme="dark"] .sl-tag { background: rgba(96,165,250,0.14); }

  /* ── CTA FINAL ── */
  .sl-cta-section { padding: 80px 0; background: var(--bg-main); }
  .sl-cta-inner {
    background: linear-gradient(135deg, var(--accent) 0%, #142b47 100%);
    border-radius: 24px;
    padding: 64px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  body[data-bs-theme="dark"] .sl-cta-inner {
    background: linear-gradient(135deg, #1e3a5f 0%, #0b1220 100%);
  }
  .sl-cta-inner::before {
    content: "";
    position: absolute;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    top: -120px; right: -80px;
    pointer-events: none;
  }
  .sl-cta-inner h2 {
    color: #fff !important;
    font-weight: 800;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    margin-bottom: 14px;
    position: relative;
  }
  .sl-cta-inner p {
    color: rgba(255,255,255,0.82) !important;
    font-size: 1.05rem;
    max-width: 520px;
    margin: 0 auto 34px;
    line-height: 1.7;
    position: relative;
  }
  .sl-cta-btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    position: relative;
  }
  .sl-btn-white {
    background: #fff;
    color: var(--accent) !important;
    padding: 13px 34px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.97rem;
    text-decoration: none;
    transition: all .2s;
    display: inline-block;
  }
  .sl-btn-white:hover { background: #f0f4ff; transform: translateY(-2px); }
  .sl-btn-outline-white {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.45);
    color: #fff !important;
    padding: 13px 34px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.97rem;
    text-decoration: none;
    transition: all .2s;
    display: inline-block;
  }
  .sl-btn-outline-white:hover { border-color: rgba(255,255,255,0.85); }
`;

const CARDS = [
  {
    icon: "🎯",
    title: "Nuestra Misión",
    text: "Brindar productos deportivos de excelencia que motiven a nuestros clientes a alcanzar sus objetivos, ofreciendo siempre un servicio confiable, rápido y seguro.",
  },
  {
    icon: "🔭",
    title: "Nuestra Visión",
    text: "Convertirnos en la tienda deportiva líder en México, destacándonos por nuestra innovación tecnológica, calidad de productos y atención excepcional al cliente.",
  },
  {
    icon: "🤝",
    title: "Compromiso",
    text: "Mejoramos continuamente nuestra plataforma, garantizando una experiencia de compra intuitiva, accesible y con los mejores estándares del mercado.",
  },
];

const CATEGORIES = [
  { emoji: "👟", name: "Calzado" },
  { emoji: "👕", name: "Ropa" },
  { emoji: "🏋️", name: "Equipamiento" },
  { emoji: "🎒", name: "Accesorios" },
  { emoji: "⚽", name: "Balones" },
  { emoji: "🧴", name: "Nutrición" },
];

const STRIP = [
  { icon: "🚚", title: "Envío Gratis", sub: "Pedidos mayores a $999 MXN" },
  { icon: "↩️",  title: "Devolución Fácil", sub: "30 días sin preguntas" },
  { icon: "🔒", title: "Pago Seguro",   sub: "Cifrado SSL bancario" },
  { icon: "🎧", title: "Soporte",       sub: "Lunes a sábado, 9–20 h" },
];

const WHY_PILLS = [
  ["🌟", "Calidad garantizada"],
  ["📦", "Envíos a todo México"],
  ["🔒", "Pagos 100% seguros"],
  ["🎯", "Productos auténticos"],
  ["💯", "Satisfacción total"],
  ["🤝", "Atención personalizada"],
];

const FEATURES = [
  { title: "Catálogo curado", desc: "Seleccionamos cada producto pensando en rendimiento, durabilidad y relación calidad-precio." },
  { title: "Plataforma segura", desc: "Tecnología de cifrado avanzada protege cada transacción que realizas en nuestra tienda." },
  { title: "Entrega a domicilio", desc: "Recibe tu pedido en 2-5 días hábiles en cualquier punto de la república." },
  { title: "Devoluciones sin complicaciones", desc: "Si no estás satisfecho, tienes 30 días para devolver tu compra sin costo adicional." },
];

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
    <div>
      {/* HERO */}
      <section className="sl-hero">
        <div className="sl-hero-inner">
          <div className="sl-hero-eyebrow">
            <span>⚡</span> Tienda deportiva en línea
          </div>
          <h1 className="sl-hero-title">
            Bienvenido a <em>SportLike</em>
          </h1>
          <p className="sl-hero-sub">
            Nos dedicamos a ofrecer productos deportivos de alta calidad, combinando
            innovación, rendimiento y estilo. Acompañándote en tu camino hacia un
            estilo de vida activo con una plataforma moderna, segura y eficiente.
          </p>
          <div className="sl-hero-btns">
            <a href="/catalogo" className="sl-btn-primary">Ver catálogo</a>
            <a href="/promociones" className="sl-btn-ghost">Ver promociones</a>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="sl-strip">
        <div className="container">
          <div className="row g-2">
            {STRIP.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="sl-strip-item">
                  <div className="sl-strip-icon">{s.icon}</div>
                  <div>
                    <div className="sl-strip-title">{s.title}</div>
                    <div className="sl-strip-sub">{s.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISION / VISION / COMPROMISO */}
      <section className="sl-cards-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="sl-section-label">Quiénes somos</span>
            <h2 className="sl-section-title">Lo que nos define</h2>
            <p className="sl-section-sub">
              Conoce los pilares que guían cada decisión en SportLike.
            </p>
          </div>
          <div className="row g-4">
            {CARDS.map((c, i) => (
              <div key={i} className="col-md-4">
                <div className="sl-mission-card">
                  <div className="sl-mission-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="sl-categories-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="sl-section-label">Catálogo</span>
            <h2 className="sl-section-title">Explora por categoría</h2>
            <p className="sl-section-sub">
              Encuentra exactamente lo que buscas entre nuestras líneas deportivas.
            </p>
          </div>
          <div className="row g-3 justify-content-center">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="col-4 col-md-2">
                <a href="/catalogo" className="sl-cat-card">
                  <span className="sl-cat-emoji">{cat.emoji}</span>
                  <div className="sl-cat-name">{cat.name}</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE SPORTLIKE */}
      <section className="sl-why-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="sl-section-label">Nuestra propuesta</span>
              <h2 className="sl-section-title">¿Por qué elegir SportLike?</h2>
              <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                En SportLike trabajamos diariamente para ofrecer una experiencia
                sobresaliente. Nuestra plataforma combina tecnología moderna, seguridad
                en tus compras y una selección de productos cuidadosamente pensados para
                atletas, deportistas recreativos y quienes buscan un estilo de vida más
                saludable.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
                Creemos firmemente que el deporte transforma vidas, y queremos ser parte
                de ese proceso brindándote herramientas, productos y apoyo para que
                avances hacia tus metas con confianza.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="row g-2">
                {WHY_PILLS.map(([icon, label], i) => (
                  <div key={i} className="col-6">
                    <div className="sl-why-pill">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="sl-features-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-2">
              <span className="sl-section-label">Proceso de compra</span>
              <h2 className="sl-section-title" style={{ marginBottom: 32 }}>
                Comprar en SportLike es sencillo
              </h2>
              {FEATURES.map((f, i) => (
                <div key={i} className="sl-feature-row">
                  <div className="sl-feature-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="sl-feature-text">
                    <h5>{f.title}</h5>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="sl-feature-panel">
                <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🏃</div>
                <div className="sl-feature-panel-title">
                  Más de 500 productos<br />para cada disciplina
                </div>
                <p className="sl-feature-panel-sub">
                  Desde calzado de alto rendimiento hasta suplementos deportivos,
                  tenemos todo lo que necesitas para entrenar, competir y recuperarte.
                </p>
                <div>
                  {["Running","Fútbol","Gimnasio","Ciclismo","Natación","Yoga"].map((tag, i) => (
                    <span key={i} className="sl-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="sl-cta-section">
        <div className="container">
          <div className="sl-cta-inner">
            <h2>¿Listo para empezar?</h2>
            <p>
              Explora nuestro catálogo completo y encuentra los productos que
              necesitas para alcanzar tus metas deportivas.
            </p>
            <div className="sl-cta-btns">
              <a href="/catalogo" className="sl-btn-white">Ver catálogo completo</a>
              <a href="/register" className="sl-btn-outline-white">Crear cuenta gratis</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}