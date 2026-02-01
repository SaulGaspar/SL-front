// src/pages/AvisoPrivacidad.jsx
import { Link } from "react-router-dom";

export default function AvisoPrivacidad() {
  return (
    <>
      <style>{`
        .aviso-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 40px;
          background: var(--bg-card); /* adaptado dark mode */
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          font-family: "Poppins", sans-serif;
          color: var(--text-main);
          line-height: 1.75;
          font-size: 1.05rem;
        }

        .aviso-title {
          font-size: 2rem;
          margin-bottom: 25px;
          color: var(--text-main);
          font-weight: 700;
          text-align: center;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          margin-bottom: 20px;
          color: var(--accent);
        }

        .breadcrumb a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
        }

        .back-arrow {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--accent);
          text-decoration: none;
          margin-bottom: 15px;
          display: inline-block;
        }

        h2 {
          font-size: 1.4rem;
          margin-top: 25px;
          color: var(--text-main);
          font-weight: 600;
          border-left: 5px solid var(--accent);
          padding-left: 10px;
        }

        ul {
          margin: 12px 0;
          padding-left: 20px;
        }

        ul li {
          margin-bottom: 6px;
        }

        .aviso-box {
          background: var(--bg-muted); /* antes #f1f5f9 */
          padding: 15px;
          border-left: 4px solid var(--accent-danger); /* antes #ef4444 */
          border-radius: 8px;
          margin: 20px 0;
          color: var(--text-main);
        }

        .aviso-consent {
          margin-top: 35px;
          padding: 18px;
          text-align: center;
          background: var(--bg-accent); /* antes #e0f2fe */
          border-left: 5px solid var(--accent);
          border-radius: 10px;
          font-weight: 600;
          color: var(--text-main);
        }

        p {
          color: var(--text-main);
        }
      `}</style>

      <div className="aviso-container">

        {/* 🔙 Flecha para volver */}
        <Link to="/login" className="back-arrow">⬅ Volver al inicio de sesión</Link>

        {/* 📌 Migas de pan */}
        <div className="breadcrumb">
          <Link to="/login">Login</Link> / <span>Aviso de Privacidad</span>
        </div>

        <h1 className="aviso-title">Aviso de Privacidad</h1>

        <p>
          <strong>Sport Like</strong>, con domicilio en Centro, C.P. 43000,
          Huejutla de Reyes, Hidalgo, México, es responsable del uso y
          protección de sus datos personales, y al respecto le informamos lo
          siguiente:
        </p>

        <h2>¿Para qué fines utilizaremos sus datos personales?</h2>

        <p>Los datos personales que recabamos de usted los utilizaremos para las finalidades necesarias:</p>

        <ul>
          <li>Entregar los productos deportivos adquiridos.</li>
          <li>Enviar notificaciones relacionadas con el servicio y compras.</li>
        </ul>

        <p>Finalidades secundarias (opcionales):</p>

        <ul>
          <li>Registrar y administrar a los usuarios en la plataforma.</li>
        </ul>

        <div className="aviso-box">
          <strong>No consiento</strong> que mis datos personales se utilicen
          para los siguientes fines: Registrar y administrar a los usuarios en
          la plataforma.
        </div>

        <p>
          La negativa al uso de sus datos personales no será motivo para negarle
          los servicios proporcionados.
        </p>

        <h2>¿Qué datos personales utilizaremos?</h2>

        <ul>
          <li>Nombre</li>
          <li>Fecha de nacimiento</li>
          <li>Domicilio</li>
          <li>Teléfono celular</li>
          <li>Correo electrónico</li>
          <li>Datos de identificación</li>
          <li>Datos de contacto</li>
        </ul>

        <h2>Derechos ARCO</h2>
        <p>
          Usted puede acceder, rectificar, cancelar u oponerse al uso de sus
          datos personales mediante una solicitud enviada a:
        </p>

        <ul>
          <li><strong>Correo:</strong> ethraei_09@hotmail.com</li>
          <li><strong>Establecimiento físico:</strong> Sport Like</li>
        </ul>

        <h2>Datos del responsable del tratamiento</h2>

        <ul>
          <li><strong>Nombre:</strong> Jesús Nava Oviedo</li>
          <li><strong>Domicilio:</strong> Centro, Huejutla de Reyes, Hidalgo</li>
          <li><strong>Correo:</strong> ethraei_09@hotmail.com</li>
          <li><strong>Teléfono:</strong> 771 128 6709</li>
        </ul>

        <h2>Revocación del consentimiento</h2>
        <ul>
          <li>Correo: ethraei_09@hotmail.com</li>
          <li>Teléfono: 771 128 6709</li>
        </ul>

        <h2>Limitación del uso o divulgación</h2>
        <ul>
          <li>Correo: ethraei_09@hotmail.com</li>
          <li>Solicitud en el establecimiento físico</li>
        </ul>

        <h2>Uso de cookies</h2>
        <p>
          En nuestro portal usamos cookies con fines estadísticos y de registro
          de usuarios.
        </p>

        <h2>Cambios al aviso de privacidad</h2>
        <p>
          El aviso puede actualizarse por requerimientos legales o cambios en el
          modelo de negocio. Las modificaciones serán publicadas en el sitio web
          y en el establecimiento físico.
        </p>

        <div className="aviso-consent">
          Consiento que mis datos personales sean tratados de acuerdo con este
          aviso de privacidad.
        </div>
      </div>
    </>
  );
}
