import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-primary-custom">

      <style>{`
        .logo-brand {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: white !important;
          padding: 6px 14px;
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

        @media (max-width: 768px) {
          .main-menu {
            gap: 15px !important;
          }
          .nav-link {
            font-size: 1.15rem !important;
          }
        }
      `}</style>

      <div className="container-fluid d-flex align-items-center justify-content-between">

        <Link className="navbar-brand logo-brand ms-2" to="/">SportLike</Link>

        {/* MENÚ CENTRAL SIEMPRE VISIBLE */}
        <ul className="navbar-nav d-flex flex-row gap-4 main-menu mx-auto">
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

        <ul className="navbar-nav d-flex flex-row align-items-center me-3">
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

      </div>
    </nav>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-primary-custom">

      <style>{`
        .logo-brand {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: white !important;
          padding: 6px 14px;
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

        /* ----------- VISTA MÓVIL ----------- */
        @media (max-width: 768px) {
          .navbar {
            flex-direction: column !important;
            padding: 10px 0 !important;
          }

          .desktop-menu,
          .desktop-icons,
          .navbar-toggler {
            display: none !important;
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
            gap: 15px;
          }

          .mobile-menu {
            width: 100%;
            margin-top: 10px;
            display: flex !important;
            justify-content: center !important;
            gap: 25px;
          }

          .mobile-menu .nav-link {
            font-size: 1.18rem !important;
          }
        }
      `}</style>

      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* -------- VISTA MÓVIL -------- */}
        <div className="mobile-top d-lg-none">

          {/* LOGO CENTRADO */}
          <Link className="navbar-brand logo-brand text-center" to="/">
            SportLike
          </Link>

          {/* ICONOS DERECHA */}
          <div className="mobile-icons">

            {/* LOGIN (si NO hay user) */}
            {!user && (
              <Link className="text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.45rem' }}></i>
              </Link>
            )}

            {/* PERFIL (si hay user) */}
            {user && (
              <Link className="text-white" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: '1.45rem' }}></i>
              </Link>
            )}

            {/* CARRITO */}
            <Link className="text-white" to="/carrito">
              <i className="bi bi-cart3" style={{ fontSize: '1.45rem' }}></i>
            </Link>

            {/* LOGOUT (si hay user) */}
            {user && (
              <button
                className="btn btn-link text-white p-0"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: '1.45rem' }}></i>
              </button>
            )}

          </div>
        </div>

        {/* -------- VISTA ESCRITORIO (igual que antes) -------- */}
        <Link className="navbar-brand logo-brand ms-3 d-none d-lg-block" to="/">
          SportLike
        </Link>

        <ul className="navbar-nav position-absolute start-50 translate-middle-x d-flex flex-row gap-4 desktop-menu">
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

        <ul className="navbar-nav d-flex flex-row align-items-center me-3 desktop-icons">

          {/* LOGIN desktop */}
          {!user && (
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i>
              </Link>
            </li>
          )}

          {/* PERFIL desktop */}
          {user && (
            <li className="nav-item me-2">
              <Link className="nav-link text-white" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
              </Link>
            </li>
          )}

          {/* CARRITO desktop */}
          <li className="nav-item me-3">
            <Link className="nav-link text-white" to="/carrito">
              <i className="bi bi-cart3" style={{ fontSize: '1.5rem' }}></i>
            </Link>
          </li>

          {/* LOGOUT desktop */}
          {user && (
            <li className="nav-item me-3">
              <button className="btn btn-link nav-link text-white" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem' }}></i>
              </button>
            </li>
          )}

          {/* DROPDOWN desktop */}
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

      {/* -------- MENÚ MÓVIL CENTRADO -------- */}
      <ul className="navbar-nav mobile-menu d-lg-none">
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

    </nav>
  );
}
