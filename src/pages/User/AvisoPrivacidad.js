import { Link, useNavigate } from "react-router-dom";

import CSS from "./AvisoPrivacidad.styles";

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
