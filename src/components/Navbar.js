import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-primary-custom">
      <style>{`
        .nav-link {
          position: relative;
          padding-bottom: 5px;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 3px;
          background: white;
          transition: width 0.25s ease-in-out;
          border-radius: 4px;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #e6e6e6 !important;
        }
      `}</style>

      <div className="container-fluid d-flex align-items-center">
        {/* IZQUIERDA */}
        <Link className="navbar-brand text-white fs-4 ms-3" to="/">
          SportLike
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* CENTRO */}
          <ul className="navbar-nav position-absolute start-50 translate-middle-x d-flex flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link text-white fs-5" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link>
            </li>
          </ul>

          {/* DERECHA */}
          <ul className="navbar-nav ms-auto d-flex align-items-center me-4">
            {/* ICONO DE USUARIO */}
            {user && (
              <li className="nav-item me-2">
                <Link className="nav-link text-white" to="/profile">
                  <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                </Link>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            {!user && (
              <li className="nav-item me-3">
                <Link className="nav-link text-white" to="/login">
                  <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i>
                </Link>
              </li>
            )}
            {user && (
              <li className="nav-item me-3">
                <button className="btn btn-link nav-link text-white" onClick={onLogout}>
                  <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem' }}></i>
                </button>
              </li>
            )}

            {/* MENÚ ADICIONAL */}
            <li className="nav-item dropdown">
              <button className="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
                <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item fs-6" to="/configuracion">Configuración</Link></li>
                <li><Link className="dropdown-item fs-6" to="/ayuda">Ayuda</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
