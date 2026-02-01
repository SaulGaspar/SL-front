import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container py-4">

        <div className="row gy-3">

          {/* BRAND */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">SportLike</h6>
            <p className="small mb-1">
              Tu tienda de artículos deportivos con calidad e innovación.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2">Empresa</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/ayuda">Ayuda</Link></li>
              <li><Link to="/aviso-privacidad">Privacidad</Link></li>
              <li><Link to="/terminos">Términos</Link></li>
            </ul>
          </div>

          {/* CUENTA */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2">Cuenta</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/profile">Perfil</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="col-md-2">
            <h6 className="fw-bold mb-2">Síguenos</h6>
            <div className="d-flex gap-2 fs-5 social-icons">
              <a href="#">📘</a>
              <a href="#">📸</a>
              <a href="#">🐦</a>
            </div>
          </div>

        </div>

        <hr className="my-3" />

        <div className="text-center small opacity-75">
          © {new Date().getFullYear()} SportLike
        </div>

      </div>
    </footer>
  );
}
