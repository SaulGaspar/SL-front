import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const getCSS = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

.ft {
  font-family: 'Outfit', sans-serif;
  background: ${dark ? "#060e1a" : "#0a1a2f"};
  color: rgba(255,255,255,.6);
  position: relative;
  overflow: hidden;
}

/* Fondo decorativo */
.ft::before {
  content: '';
  position: absolute;
  top: -120px; right: -80px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,240,60,.06) 0%, transparent 70%);
  pointer-events: none;
}
.ft::after {
  content: '';
  position: absolute;
  bottom: 40px; left: -60px;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,240,60,.04) 0%, transparent 70%);
  pointer-events: none;
}

/* ── TOP BAND ── */
.ft-band {
  border-bottom: 1px solid rgba(255,255,255,.07);
  padding: 18px 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ft-band-text {
  font-size: .8rem;
  color: rgba(255,255,255,.4);
  letter-spacing: .3px;
}
.ft-band-text strong { color: #c8f03c; font-weight: 700; }

.ft-band-icons { display: flex; align-items: center; gap: 8px; }
.ft-social {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.5);
  text-decoration: none;
  font-size: 1rem;
  transition: all .2s;
  background: rgba(255,255,255,.04);
}
.ft-social:hover { border-color: #c8f03c; color: #c8f03c; background: rgba(200,240,60,.08); transform: translateY(-2px); }

/* ── MAIN GRID ── */
.ft-main {
  padding: 56px 64px 48px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
}

/* Brand col */
.ft-brand-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.4rem;
  letter-spacing: 5px;
  color: white;
  display: block;
  margin-bottom: 14px;
  line-height: 1;
}
.ft-brand-logo span { color: #c8f03c; }
.ft-brand-desc {
  font-size: .85rem;
  line-height: 1.7;
  color: rgba(255,255,255,.45);
  max-width: 260px;
  margin-bottom: 24px;
}
.ft-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(200,240,60,.1);
  border: 1px solid rgba(200,240,60,.2);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: .75rem;
  color: #c8f03c;
  font-weight: 600;
  letter-spacing: .5px;
}
.ft-brand-badge i { font-size: .9rem; }

/* Col headers */
.ft-col-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: .95rem;
  letter-spacing: 2.5px;
  color: white;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ft-col-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,.1);
}

/* Links */
.ft-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ft-links li a {
  font-size: .85rem;
  color: rgba(255,255,255,.45);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all .15s;
  padding: 2px 0;
}
.ft-links li a i { font-size: .8rem; opacity: .5; transition: opacity .15s; }
.ft-links li a:hover { color: white; padding-left: 4px; }
.ft-links li a:hover i { opacity: 1; color: #c8f03c; }

/* Social col */
.ft-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ft-social-card {
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: 14px 12px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,.03);
  transition: all .2s;
  grid-column: auto;
}
.ft-social-card:hover { border-color: rgba(200,240,60,.3); background: rgba(200,240,60,.06); transform: translateY(-2px); }
.ft-social-card i { font-size: 1.3rem; color: rgba(255,255,255,.6); transition: color .2s; }
.ft-social-card:hover i { color: #c8f03c; }
.ft-social-card span { font-size: .7rem; font-weight: 600; color: rgba(255,255,255,.35); letter-spacing: .5px; text-transform: uppercase; transition: color .2s; }
.ft-social-card:hover span { color: rgba(255,255,255,.7); }
.ft-social-card.full { grid-column: 1/-1; flex-direction: row; justify-content: center; gap: 10px; }

/* ── BOTTOM ── */
.ft-bottom {
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 20px 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.ft-copy {
  font-size: .78rem;
  color: rgba(255,255,255,.25);
  letter-spacing: .3px;
}
.ft-copy strong { color: rgba(255,255,255,.4); }
.ft-bottom-links { display: flex; gap: 20px; }
.ft-bottom-links a {
  font-size: .75rem;
  color: rgba(255,255,255,.25);
  text-decoration: none;
  transition: color .15s;
}
.ft-bottom-links a:hover { color: #c8f03c; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .ft-main { grid-template-columns: 1fr 1fr; gap: 32px; padding: 40px 32px; }
  .ft-band { padding: 14px 32px; }
  .ft-bottom { padding: 16px 32px; }
}
@media (max-width: 640px) {
  .ft-main { grid-template-columns: 1fr; gap: 28px; padding: 32px 20px; }
  .ft-band { padding: 12px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
  .ft-bottom { padding: 14px 20px; flex-direction: column; align-items: flex-start; gap: 8px; }
  .ft-brand-logo { font-size: 2rem; }
  .ft-social-grid { grid-template-columns: repeat(3, 1fr); }
  .ft-social-card.full { grid-column: auto; flex-direction: column; }
}
`;

export default function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <style>{getCSS(darkMode)}</style>

      {/* Band superior */}
      <div className="ft-band">
        <p className="ft-band-text">
          🚚 <strong>Envío gratis</strong> en pedidos mayores a $999 MXN · Entrega en 2–5 días hábiles
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
            Tu tienda de artículos deportivos en Hidalgo. Calidad, innovación y pasión por el deporte en cada producto.
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
            <li><Link to="/promociones"><i className="bi bi-tag" /> Promociones</Link></li>
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
            <li><Link to="/devoluciones"><i className="bi bi-arrow-return-left" /> Devoluciones</Link></li>
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
