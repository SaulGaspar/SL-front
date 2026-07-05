import { Link, useNavigate } from "react-router-dom";

const CSS = `
  .lg-page {
    --lg-ink: #0a1a2f;
    --lg-muted: #647185;
    --lg-paper: #f5f7f4;
    --lg-card: #ffffff;
    --lg-line: rgba(10, 26, 47, .11);
    --lg-blue: #244fdb;
    --lg-accent: #bde632;
    min-height: 100vh;
    background: var(--lg-paper);
    color: var(--lg-ink);
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  body[data-bs-theme="dark"] .lg-page {
    --lg-ink: #f2f5f8;
    --lg-muted: #a6b0bf;
    --lg-paper: #09131f;
    --lg-card: #101d2b;
    --lg-line: rgba(255, 255, 255, .11);
    --lg-blue: #82a2ff;
  }

  .lg-page *,
  .lg-page *::before,
  .lg-page *::after { box-sizing: border-box; }

  .lg-shell {
    width: min(1160px, calc(100% - 40px));
    margin-inline: auto;
  }

  .lg-hero {
    position: relative;
    padding: 46px 0 92px;
    color: #fff;
    background: #0a1a2f;
    overflow: hidden;
  }

  .lg-hero::before {
    content: "";
    position: absolute;
    width: 340px;
    height: 340px;
    top: -235px;
    right: 8%;
    border: 56px solid var(--lg-accent);
    border-radius: 50%;
  }

  .lg-hero::after {
    content: "";
    position: absolute;
    width: 210px;
    height: 210px;
    right: 28%;
    bottom: -190px;
    border: 36px solid rgba(36, 79, 219, .75);
    border-radius: 50%;
  }

  .lg-topline {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 66px;
  }

  .lg-back,
  .lg-home {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 0 15px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 999px;
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.82);
    font: inherit;
    font-size: .82rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: background .2s ease, color .2s ease;
  }

  .lg-back:hover,
  .lg-home:hover {
    background: rgba(255,255,255,.11);
    color: #fff;
  }

  .lg-hero-copy {
    position: relative;
    z-index: 1;
    max-width: 800px;
  }

  .lg-eyebrow {
    display: block;
    margin-bottom: 15px;
    color: var(--lg-accent);
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .lg-title {
    margin: 0;
    color: #fff;
    font-size: clamp(2.7rem, 6vw, 5rem);
    font-weight: 700;
    line-height: .98;
    letter-spacing: -.055em;
  }

  .lg-lead {
    max-width: 680px;
    margin: 22px 0 0;
    color: rgba(255,255,255,.65);
    font-size: 1rem;
    line-height: 1.7;
  }

  .lg-layout {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 250px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
    margin-top: -46px;
    padding-bottom: 90px;
  }

  .lg-nav {
    position: sticky;
    top: 100px;
    padding: 22px;
    border: 1px solid var(--lg-line);
    border-radius: 20px;
    background: var(--lg-card);
    box-shadow: 0 14px 35px rgba(10,26,47,.06);
  }

  .lg-nav-title {
    display: block;
    margin-bottom: 14px;
    color: var(--lg-muted);
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .lg-nav a {
    display: block;
    padding: 9px 10px;
    border-radius: 9px;
    color: var(--lg-muted);
    font-size: .78rem;
    line-height: 1.35;
    text-decoration: none;
    transition: color .2s ease, background .2s ease;
  }

  .lg-nav a:hover {
    color: var(--lg-blue);
    background: rgba(36,79,219,.07);
  }

  .lg-document {
    padding: clamp(30px, 5vw, 62px);
    border: 1px solid var(--lg-line);
    border-radius: 24px;
    background: var(--lg-card);
    box-shadow: 0 18px 48px rgba(10,26,47,.07);
  }

  .lg-intro {
    margin: 0 0 44px;
    padding-bottom: 34px;
    border-bottom: 1px solid var(--lg-line);
    color: var(--lg-muted);
    font-size: 1rem;
    line-height: 1.8;
  }

  .lg-intro strong { color: var(--lg-ink); }

  .lg-section {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 18px;
    padding: 34px 0;
    border-bottom: 1px solid var(--lg-line);
    scroll-margin-top: 100px;
  }

  .lg-section:last-of-type { border-bottom: 0; }

  .lg-number {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: rgba(36,79,219,.09);
    color: var(--lg-blue);
    font-size: .68rem;
    font-weight: 700;
  }

  .lg-section h2 {
    margin: 3px 0 14px;
    color: var(--lg-ink);
    font-size: clamp(1.15rem, 2vw, 1.38rem);
    font-weight: 700;
    letter-spacing: -.025em;
  }

  .lg-section p {
    margin: 0 0 13px;
    color: var(--lg-muted);
    font-size: .94rem;
    line-height: 1.75;
  }

  .lg-section p:last-child { margin-bottom: 0; }

  .lg-list {
    display: grid;
    gap: 10px;
    margin: 14px 0 0;
    padding: 0;
    list-style: none;
  }

  .lg-list li {
    position: relative;
    padding-left: 20px;
    color: var(--lg-muted);
    font-size: .92rem;
    line-height: 1.65;
  }

  .lg-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: .67em;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--lg-blue);
  }

  .lg-list strong { color: var(--lg-ink); }

  .lg-notice {
    margin-top: 18px;
    padding: 17px 18px;
    border: 1px solid rgba(180,83,9,.2);
    border-radius: 14px;
    background: rgba(245,158,11,.08);
    color: var(--lg-muted);
    font-size: .88rem;
    line-height: 1.65;
  }

  .lg-notice strong { color: var(--lg-ink); }

  .lg-contact {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .lg-contact-item {
    padding: 15px 16px;
    border: 1px solid var(--lg-line);
    border-radius: 13px;
    background: var(--lg-paper);
  }

  .lg-contact-label {
    display: block;
    margin-bottom: 5px;
    color: var(--lg-muted);
    font-size: .66rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .lg-contact-value {
    color: var(--lg-ink);
    font-size: .85rem;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .lg-consent {
    margin-top: 34px;
    padding: 22px 24px;
    border-radius: 16px;
    background: #0a1a2f;
    color: rgba(255,255,255,.76);
    font-size: .91rem;
    font-weight: 500;
    line-height: 1.65;
  }

  .lg-consent strong { color: var(--lg-accent); }

  .lg-back:focus-visible,
  .lg-home:focus-visible,
  .lg-nav a:focus-visible {
    outline: 3px solid var(--lg-accent);
    outline-offset: 3px;
  }

  @media (max-width: 850px) {
    .lg-layout { grid-template-columns: 1fr; }
    .lg-nav {
      position: static;
      display: flex;
      gap: 6px;
      padding: 10px;
      overflow-x: auto;
      border-radius: 15px;
    }
    .lg-nav-title { display: none; }
    .lg-nav a { flex: 0 0 auto; white-space: nowrap; }
  }

  @media (max-width: 600px) {
    .lg-shell { width: min(100% - 24px, 1160px); }
    .lg-hero { padding: 26px 0 72px; }
    .lg-topline { margin-bottom: 48px; }
    .lg-home span { display: none; }
    .lg-title { font-size: 2.75rem; }
    .lg-lead { font-size: .91rem; }
    .lg-layout { margin-top: -34px; padding-bottom: 60px; }
    .lg-document { padding: 26px 20px; border-radius: 19px; }
    .lg-intro { margin-bottom: 20px; padding-bottom: 26px; }
    .lg-section { grid-template-columns: 1fr; gap: 10px; padding: 28px 0; }
    .lg-number { width: 34px; height: 34px; }
    .lg-contact { grid-template-columns: 1fr; }
  }
`;

export default function AvisoPrivacidad() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <main className="lg-page">
      <style>{CSS}</style>

      <header className="lg-hero">
        <div className="lg-shell">
          <div className="lg-topline">
            <button type="button" className="lg-back" onClick={goBack}>
              <span aria-hidden="true">←</span> Volver
            </button>
            <Link to="/" className="lg-home">
              <span>Ir al inicio</span> <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="lg-hero-copy">
            <span className="lg-eyebrow">Información legal</span>
            <h1 className="lg-title">Aviso de Privacidad</h1>
            <p className="lg-lead">
              Conoce cómo Sport Like recaba, utiliza y protege tus datos personales,
              así como los medios disponibles para ejercer tus derechos.
            </p>
          </div>
        </div>
      </header>

      <div className="lg-shell lg-layout">
        <nav className="lg-nav" aria-label="Contenido del aviso">
          <span className="lg-nav-title">En esta página</span>
          <a href="#finalidades">Finalidades</a>
          <a href="#datos">Datos utilizados</a>
          <a href="#arco">Derechos ARCO</a>
          <a href="#responsable">Responsable</a>
          <a href="#revocacion">Revocación</a>
          <a href="#cookies">Cookies</a>
          <a href="#cambios">Actualizaciones</a>
        </nav>

        <article className="lg-document">
          <p className="lg-intro">
            <strong>Sport Like</strong>, con domicilio en Centro, C.P. 43000,
            Huejutla de Reyes, Hidalgo, México, es responsable del uso y protección
            de sus datos personales. Al respecto, le informamos lo siguiente:
          </p>

          <section className="lg-section" id="finalidades">
            <span className="lg-number">01</span>
            <div>
              <h2>Finalidades del uso de datos personales</h2>
              <p>Utilizaremos los datos recabados para las siguientes finalidades necesarias:</p>
              <ul className="lg-list">
                <li>Entregar los productos deportivos adquiridos.</li>
                <li>Enviar notificaciones relacionadas con el servicio y las compras.</li>
              </ul>
              <p style={{ marginTop: 18 }}>Como finalidad secundaria y opcional:</p>
              <ul className="lg-list">
                <li>Registrar y administrar usuarios dentro de la plataforma.</li>
              </ul>
              <div className="lg-notice">
                <strong>No consentimiento:</strong> puede manifestar que no desea que sus
                datos sean utilizados para finalidades secundarias. Esta negativa no será
                motivo para negarle los servicios ofrecidos.
              </div>
            </div>
          </section>

          <section className="lg-section" id="datos">
            <span className="lg-number">02</span>
            <div>
              <h2>Datos personales utilizados</h2>
              <ul className="lg-list">
                <li>Nombre y fecha de nacimiento.</li>
                <li>Domicilio y teléfono celular.</li>
                <li>Correo electrónico.</li>
                <li>Datos de identificación y contacto.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="arco">
            <span className="lg-number">03</span>
            <div>
              <h2>Derechos ARCO</h2>
              <p>
                Puede acceder, rectificar, cancelar u oponerse al uso de sus datos
                personales mediante una solicitud enviada por correo o presentada
                directamente en el establecimiento.
              </p>
              <div className="lg-contact">
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Correo</span>
                  <span className="lg-contact-value">ethraei_09@hotmail.com</span>
                </div>
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Establecimiento</span>
                  <span className="lg-contact-value">Sport Like</span>
                </div>
              </div>
            </div>
          </section>

          <section className="lg-section" id="responsable">
            <span className="lg-number">04</span>
            <div>
              <h2>Responsable del tratamiento</h2>
              <div className="lg-contact">
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Nombre</span>
                  <span className="lg-contact-value">Jesús Nava Oviedo</span>
                </div>
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Domicilio</span>
                  <span className="lg-contact-value">Centro, Huejutla de Reyes, Hidalgo</span>
                </div>
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Correo</span>
                  <span className="lg-contact-value">ethraei_09@hotmail.com</span>
                </div>
                <div className="lg-contact-item">
                  <span className="lg-contact-label">Teléfono</span>
                  <span className="lg-contact-value">771 128 6709</span>
                </div>
              </div>
            </div>
          </section>

          <section className="lg-section" id="revocacion">
            <span className="lg-number">05</span>
            <div>
              <h2>Revocación y limitación del uso</h2>
              <p>
                Puede solicitar la revocación de su consentimiento o limitar el uso
                y divulgación de sus datos mediante los siguientes medios:
              </p>
              <ul className="lg-list">
                <li><strong>Correo:</strong> ethraei_09@hotmail.com</li>
                <li><strong>Teléfono:</strong> 771 128 6709</li>
                <li>Solicitud presentada en el establecimiento físico.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="cookies">
            <span className="lg-number">06</span>
            <div>
              <h2>Uso de cookies</h2>
              <p>
                Nuestro portal utiliza cookies con fines estadísticos y para el
                registro de usuarios.
              </p>
            </div>
          </section>

          <section className="lg-section" id="cambios">
            <span className="lg-number">07</span>
            <div>
              <h2>Cambios al aviso de privacidad</h2>
              <p>
                Este aviso puede actualizarse por requerimientos legales o cambios
                en el modelo de negocio. Las modificaciones serán publicadas en el
                sitio web y en el establecimiento físico.
              </p>
            </div>
          </section>

          <div className="lg-consent">
            <strong>Consentimiento:</strong> al proporcionar sus datos, acepta que sean
            tratados de acuerdo con lo establecido en este aviso de privacidad.
          </div>
        </article>
      </div>
    </main>
  );
}
