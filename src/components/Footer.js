import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

import getCSS from "./Footer.styles";
import { PROMOTIONS_ENABLED } from "../config/features";

export default function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <style>{getCSS(darkMode)}</style>

      {/* Band superior */}
      <div className="ft-band">
        <p className="ft-band-text">
          <i className="bi bi-shield-check" /> <strong>Compra segura en SportLike</strong>
        </p>
        <div className="ft-band-icons">
          <a className="ft-social" href="https://www.facebook.com/search/top?q=sportlike" target="_blank" rel="noreferrer" title="Facebook">
            <i className="bi bi-facebook" />
          </a>
          <a className="ft-social" href="https://www.instagram.com/sportlikehidalgo/" target="_blank" rel="noreferrer" title="Instagram">
            <i className="bi bi-instagram" />
          </a>
          <a className="ft-social" href="https://www.threads.com/@sportlikehidalgo" target="_blank" rel="noreferrer" title="Threads">
            <i className="bi bi-threads" />
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="ft-main">

        {/* Marca */}
        <div>
          <span className="ft-brand-logo">SPORT<span>LIKE</span></span>
          <p className="ft-brand-desc">
            Artículos deportivos seleccionados para entrenar y competir.
          </p>
          <div className="ft-brand-badge">
            <i className="bi bi-patch-check-fill" /> Tienda oficial Hidalgo, México
          </div>
        </div>

        {/* Empresa */}
        <div>
          <div className="ft-col-title">Empresa</div>
          <ul className="ft-links">
            <li><Link to="/"><i className="bi bi-house" /> Inicio</Link></li>
            <li><Link to="/catalogo"><i className="bi bi-grid" /> Catálogo</Link></li>
            {PROMOTIONS_ENABLED && <li><Link to="/promociones"><i className="bi bi-tag" /> Promociones</Link></li>}
            <li><Link to="/tiendas"><i className="bi bi-shop" /> Tiendas</Link></li>
            <li><Link to="/contacto"><i className="bi bi-envelope" /> Contacto</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="ft-col-title">Legal</div>
          <ul className="ft-links">
            <li><Link to="/ayuda"><i className="bi bi-question-circle" /> Ayuda</Link></li>
            <li><Link to="/aviso-privacidad"><i className="bi bi-shield-check" /> Privacidad</Link></li>
            <li><Link to="/terminos"><i className="bi bi-file-text" /> Términos</Link></li>
            <li><Link to="/cambios"><i className="bi bi-arrow-left-right" /> Cambios</Link></li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <div className="ft-col-title">Síguenos</div>
          <div className="ft-social-grid">
            <a className="ft-social-card" href="https://www.facebook.com/search/top?q=sportlike" target="_blank" rel="noreferrer">
              <i className="bi bi-facebook" />
              <span>Facebook</span>
            </a>
            <a className="ft-social-card" href="https://www.instagram.com/sportlikehidalgo/" target="_blank" rel="noreferrer">
              <i className="bi bi-instagram" />
              <span>Instagram</span>
            </a>
            <a className="ft-social-card full" href="https://www.threads.com/@sportlikehidalgo" target="_blank" rel="noreferrer">
              <i className="bi bi-threads" />
              <span>@sportlikehidalgo en Threads</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="ft-bottom">
        <p className="ft-copy">© {year} <strong>SportLike</strong>. Todos los derechos reservados. Hidalgo, México.</p>
        <div className="ft-bottom-links">
          <Link to="/aviso-privacidad">Privacidad</Link>
          <Link to="/terminos">Términos</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
