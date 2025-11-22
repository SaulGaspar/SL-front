import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar bg-primary-custom py-2">

      <style>{`
        .logo-brand {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: white !important;
          padding: 4px 10px;
          transition: all 0.25s ease-in-out;
        }
        .logo-brand:hover {
          color: #fff700 !important;
          text-shadow: 0 0 8px rgba(255, 247, 0, 0.7);
        }

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

        /* -------------------- ESTILO MÓVIL -------------------- */
        @media (max-width: 768px) {
          .navbar {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding-bottom: 10px;
          }

          .mobile-top {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }

          .mobile-icons {
            position: absolute;
            right: 15px;
            display: flex;
            gap: 12px;
          }

          .main-menu {
            margin-top: 8px;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            width: 100%;
            gap: 20px !important;
          }

          .main-menu .nav-link {
            font-size: 1.15rem !important;
          }

          /* Ocultar dropdown en móvil */
          .dropdown {
            display: none !important;
          }
        }
      `}</style>

      {/* SECCIÓN SUPERIOR EN MÓVIL */}
      <div className="container-fluid mobile-top">

        {/* LOGO CENTRADO */}
        <Link className="navbar-brand logo-brand text-center" to="/">
          SportLike
        </Link>

        {/* ICONOS DERECHA EN MÓVIL */}
        <div className="mobile-icons d-flex">
          {user && (
            <Link className="text-white me-2" to="/profile">
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
            </Link>
          )}
          <Link className="text-white" to="/carrito">
            <i className="bi bi-cart3" style={{ fontSize: '1.5rem' }}></i>
          </Link>
        </div>
      </div>

      {/* MENÚ CENTRAL SIEMPRE VISIBLE */}
      <ul className="navbar-nav d-flex flex-row gap-4 main-menu mt-2">
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

      {/* ICONOS DERECHA PARA ESCRITORIO */}
      <ul className="navbar-nav d-flex flex-row align-items-center me-3 d-none d-lg-flex">

        {user && (
          <li className="nav-item me-3">
            <Link className="nav-link text-white" to="/profile">
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
            </Link>
          </li>
        )}

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

    </nav>
  );
}
