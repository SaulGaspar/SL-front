import { Link } from "react-router-dom";

export default function Terminos() {
  return (
    <>
      <style>{`
        .terminos-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 40px;
          background: var(--bg-card);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          font-family: "Poppins", sans-serif;
          color: var(--text-main);
          line-height: 1.75;
          font-size: 1.05rem;
        }

        .terminos-title {
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
          color: var(--accent-primary);
        }

        .breadcrumb a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }

        .back-arrow {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--accent-primary);
          text-decoration: none;
          margin-bottom: 15px;
          display: inline-block;
        }

        h2 {
          font-size: 1.4rem;
          margin-top: 25px;
          color: var(--text-main);
          font-weight: 600;
          border-left: 5px solid var(--accent-primary);
          padding-left: 10px;
        }

        ul {
          margin: 12px 0;
          padding-left: 20px;
        }

        ul li {
          margin-bottom: 6px;
        }

        .section-box {
          background: var(--bg-section);
          padding: 15px;
          border-left: 4px solid var(--accent-primary);
          border-radius: 8px;
          margin: 20px 0;
          color: var(--text-main);
        }

        .last-update {
          margin-top: 35px;
          padding: 18px;
          text-align: center;
          background: var(--bg-accent);
          border-left: 5px solid var(--accent-secondary);
          border-radius: 10px;
          font-weight: 600;
          color: var(--text-main);
        }
      `}</style>

      <div className="terminos-container">
        {/* 🔙 Flecha para volver */}
        <Link to="/register" className="back-arrow">⬅ Volver al registro</Link>

        {/* 📌 Migas de pan */}
        <div className="breadcrumb">
          <Link to="/register">Registro</Link> / <span>Términos y Condiciones</span>
        </div>

        <h1 className="terminos-title">Términos y Condiciones</h1>

        <h2>Información general de la empresa</h2>
        <div className="section-box">
          <p><strong>Sport Like</strong> – Comercializadora de productos deportivos</p>
          <p><strong>Domicilio:</strong> Centro, 43000, Huejutla de Reyes, Hidalgo</p>
          <p><strong>Correo:</strong> ethraei_09@hotmail.com</p>
          <p><strong>Teléfono:</strong> 771 128 6709</p>
        </div>

        <h2>Naturaleza del negocio</h2>
        <p>
          Venta de ropa deportiva, accesorios y artículos para la práctica de diferentes disciplinas.
        </p>

        <h2>Marco legal</h2>
        <p>
          Este documento se sustenta en la Ley Federal de Protección al Consumidor (LFPC),
          Ley de Comercio Electrónico, Código de Comercio y demás leyes aplicables en México.
        </p>

        <h2>Aceptación de términos</h2>
        <p>
          Al utilizar la página web y realizar una compra, el usuario acepta estos términos.
          La aceptación se realiza al dar clic en el botón de confirmación de compra.
        </p>

        <p>Los términos y condiciones pueden ser modificados sin previo aviso.</p>

        <h2>Proceso de compra y precios</h2>
        <ul>
          <li>Selección de productos desde el catálogo digital.</li>
          <li>Agregar productos al carrito de compras.</li>
          <li>Confirmación de pedido.</li>
          <li>Pago en línea mediante pasarelas seguras.</li>
          <li>El precio mostrado incluye impuestos.</li>
        </ul>

        <h2>Envíos y entregas</h2>
        <ul>
          <li>Cobertura en Huejutla de Reyes y alrededores.</li>
          <li>Entrega estimada: 2 a 5 días hábiles.</li>
          <li>Costos de envío informados antes de pagar.</li>
          <li>Si el producto llega dañado, puede solicitar reposición.</li>
        </ul>

        <h2>Devoluciones y cancelaciones</h2>
        <ul>
          <li>Devolución sin costo mientras no haya sido enviado.</li>
          <li>Si ya está en tránsito, el cliente cubre devolución.</li>
          <li>Productos incorrectos o dañados se reemplazan sin costo.</li>
          <li>El artículo debe venir sin uso y en empaque original.</li>
        </ul>

        <h2>Garantías y responsabilidades</h2>
        <ul>
          <li>Garantía de 30 días por defectos de fábrica.</li>
          <li>No aplica en mal uso o daño intencional.</li>
        </ul>

        <h2>Resolución de conflictos</h2>
        <ul>
          <li>El cliente puede acudir a PROFECO.</li>
          <li>Tribunales competentes: Hidalgo, México.</li>
        </ul>

        <div className="last-update">
          Fecha de última actualización: 22/09/2025
        </div>
      </div>
    </>
  );
}
