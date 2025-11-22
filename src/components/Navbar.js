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

        @media (max-width: 768px) {
          .mobile-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .mobile-menu {
            display: flex;
            justify-content: center;
            gap: 35px;
            width: 100%;
            padding-bottom: 8px;
          }
          .desktop-menu {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-top, .mobile-menu {
            display: none !important;
          }
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
      `}</style>

      <div className="container-fluid">

        <div className="mobile-top px-3">
          <Link className="logo-brand mx-auto" to="/">SportLike</Link>

          <div className="d-flex align-items-center gap-3">
            <Link className="text-white" to="/search">
              <i className="bi bi-search" style={{ fontSize: "1.5rem" }}></i>
            </Link>

            <Link className="text-white" to="/carrito">
              <i className="bi bi-cart" style={{ fontSize: "1.5rem" }}></i>
            </Link>

            {user ? (
              <Link className="text-white" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
              </Link>
            ) : (
              <Link className="text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: "1.5rem" }}></i>
              </Link>
            )}

            {user && (
              <button className="btn btn-link text-white p-0" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" style={{ fontSize: "1.5rem" }}></i>
              </button>
            )}
          </div>
        </div>

        <div className="mobile-menu">
          <Link className="nav-link text-white fs-5" to="/">Inicio</Link>
          <Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link>
          <Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link>
        </div>

        <ul className="navbar-nav d-flex flex-row gap-4 mx-auto desktop-menu">
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

        <ul className="navbar-nav d-flex flex-row align-items-center me-3 desktop-menu">
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
        </ul>

      </div>
    </nav>
  );
}
