import { Link, useNavigate } from "react-router-dom";

import CSS from "./Terminos.styles";

export default function Terminos() {
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
            <h1 className="lg-title">Términos y Condiciones</h1>
            <p className="lg-lead">
              Estas disposiciones regulan el uso de Sport Like y las compras
              realizadas a través de nuestra tienda.
            </p>
          </div>
        </div>
      </header>

      <div className="lg-shell lg-layout">
        <nav className="lg-nav" aria-label="Contenido de los términos">
          <span className="lg-nav-title">En esta página</span>
          <a href="#empresa">La empresa</a>
          <a href="#aceptacion">Aceptación</a>
          <a href="#compra">Compra y precios</a>
          <a href="#pedidos">Pedidos</a>
          <a href="#cambios">Cambios</a>
          <a href="#garantias">Garantías</a>
          <a href="#conflictos">Conflictos</a>
        </nav>

        <article className="lg-document">
          <p className="lg-intro">
            Al navegar por este sitio o realizar una compra, el usuario acepta los
            presentes <strong>Términos y Condiciones</strong>. Recomendamos leerlos
            cuidadosamente antes de confirmar cualquier pedido.
          </p>

          <section className="lg-section" id="empresa">
            <span className="lg-number">01</span>
            <div>
              <h2>Información general de la empresa</h2>
              <div className="lg-company">
                <div className="lg-company-item">
                  <span className="lg-company-label">Nombre comercial</span>
                  <span className="lg-company-value">Sport Like</span>
                </div>
                <div className="lg-company-item">
                  <span className="lg-company-label">Actividad</span>
                  <span className="lg-company-value">Comercializadora de productos deportivos</span>
                </div>
                <div className="lg-company-item">
                  <span className="lg-company-label">Domicilio</span>
                  <span className="lg-company-value">Centro, C.P. 43000, Huejutla de Reyes, Hidalgo</span>
                </div>
                <div className="lg-company-item">
                  <span className="lg-company-label">Contacto</span>
                  <span className="lg-company-value">ethraei_09@hotmail.com · 771 128 6709</span>
                </div>
              </div>
              <p style={{ marginTop: 18 }}>
                La actividad de Sport Like consiste en la venta de ropa, accesorios
                y artículos para la práctica de distintas disciplinas deportivas.
              </p>
              <p>
                Este documento se sustenta en la Ley Federal de Protección al
                Consumidor, el Código de Comercio y demás disposiciones aplicables
                en México.
              </p>
            </div>
          </section>

          <section className="lg-section" id="aceptacion">
            <span className="lg-number">02</span>
            <div>
              <h2>Aceptación de los términos</h2>
              <p>
                Al utilizar la página y realizar una compra, el usuario acepta estas
                condiciones. La aceptación se confirma al completar el proceso de compra.
              </p>
              <p>
                Los términos pueden actualizarse cuando sea necesario. La versión
                publicada en el sitio será la aplicable al momento de la compra.
              </p>
            </div>
          </section>

          <section className="lg-section" id="compra">
            <span className="lg-number">03</span>
            <div>
              <h2>Proceso de compra y precios</h2>
              <ul className="lg-list">
                <li>Los productos se seleccionan desde el catálogo digital.</li>
                <li>El usuario agrega su selección al carrito y confirma el pedido.</li>
                <li>El pago se realiza mediante los medios disponibles en la plataforma.</li>
                <li>Los precios mostrados incluyen los impuestos correspondientes.</li>
                <li>El total y los costos adicionales se muestran antes de pagar.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="pedidos">
            <span className="lg-number">04</span>
            <div>
              <h2>Confirmación de pedidos</h2>
              <ul className="lg-list">
                <li>La disponibilidad se valida al procesar la compra.</li>
                <li>El pedido se confirma cuando el pago es aprobado.</li>
                <li>Sport Like informará los siguientes pasos desde la cuenta del cliente.</li>
                <li>Si un producto presenta daños, el cliente puede solicitar su reposición.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="cambios">
            <span className="lg-number">05</span>
            <div>
              <h2>Cambios y cancelaciones</h2>
              <ul className="lg-list">
                <li>La cancelación no genera costo mientras el pedido no haya sido enviado.</li>
                <li>SportLike no realiza devoluciones ni reembolsos.</li>
                <li>Los productos incorrectos, dañados o con problema de talla podrán solicitar cambio.</li>
                <li>El artículo debe conservarse sin uso y en su empaque original.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="garantias">
            <span className="lg-number">06</span>
            <div>
              <h2>Garantías y responsabilidades</h2>
              <ul className="lg-list">
                <li>Los productos cuentan con 30 días de garantía por defectos de fábrica.</li>
                <li>La garantía no cubre mal uso, desgaste normal o daño intencional.</li>
              </ul>
            </div>
          </section>

          <section className="lg-section" id="conflictos">
            <span className="lg-number">07</span>
            <div>
              <h2>Resolución de conflictos</h2>
              <ul className="lg-list">
                <li>El cliente puede acudir a la Procuraduría Federal del Consumidor.</li>
                <li>Serán competentes los tribunales del estado de Hidalgo, México.</li>
              </ul>
            </div>
          </section>

          <div className="lg-update">
            <div>
              <strong>Última actualización</strong><br />
              Estos términos fueron actualizados el 22 de septiembre de 2025.
            </div>
            <span className="lg-update-badge">Versión vigente</span>
          </div>
        </article>
      </div>
    </main>
  );
}
