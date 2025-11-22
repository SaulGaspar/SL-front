import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bg-primary-custom">

      <style>{`
        .logo-brand {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: white !important;
          padding: 4px 6px;
          text-decoration: none !important;
        }
        .logo-brand:hover {
          color: #fff700 !important;
          text-shadow: 0 0 8px rgba(255, 247, 0, 0.7);
        }

        .hamburger-menu {
          position: absolute;
          top: 60px;
          right: 10px;
          background: #1b1b1b;
          padding: 15px 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 99;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .hamburger-item {
          color: white;
          font-size: 1.1rem;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .mobile-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 6px 10px;
          }
          .mobile-menu {
            display: flex;
            justify-content: center;
            gap: 32px;
            width: 100%;
            padding-bottom: 8px;
          }
          .desktop-only {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-row,
          .mobile-menu {
            display: none !important;
          }
        }

        .nav-link {
          position: relative;
          padding-bottom: 5px;
          text-decoration: none !important;
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

        {/* -------------------- MOBILE ROW -------------------- */}
        <div className="mobile-row">
          <Link className="logo-brand" to="/">SportLike</Link>

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

            {/* 🍔 HAMBURGUESA MOBILE */}
            <button
              className="btn btn-link text-white p-0"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className="bi bi-list" style={{ fontSize: "1.7rem" }}></i>
            </button>
          </div>
        </div>

        {/* -------------------- MENÚ HAMBURGUESA COMPARTIDO -------------------- */}
        {menuOpen && (
          <div className="hamburger-menu">
            <Link className="hamburger-item" to="/">Inicio</Link>
            <Link className="hamburger-item" to="/catalogo">Catálogo</Link>
            <Link className="hamburger-item" to="/promociones">Promociones</Link>
            <Link className="hamburger-item" to="/ayuda">Ayuda</Link>
            <Link className="hamburger-item" to="/configuracion">Configuración</Link>
          </div>
        )}

        {/* -------------------- MOBILE MENU INFERIOR -------------------- */}
        <div className="mobile-menu">
          <Link className="nav-link text-white fs-5" to="/">Inicio</Link>
          <Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link>
          <Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link>
        </div>

        {/* -------------------- DESKTOP NAV -------------------- */}
        <Link className="navbar-brand logo-brand ms-2 desktop-only" to="/">SportLike</Link>

        <ul className="navbar-nav d-flex flex-row gap-4 mx-auto desktop-only">
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

        {/* -------------------- ICONOS DESKTOP + HAMBURGUESA -------------------- */}
        <ul className="navbar-nav d-flex flex-row align-items-center me-3 desktop-only">

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

          {/* 🍔 HAMBURGUESA DESKTOP */}
          <li className="nav-item">
            <button
              className="btn btn-link nav-link text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className="bi bi-list" style={{ fontSize: "1.7rem" }}></i>
            </button>
          </li>

        </ul>

      </div>
    </nav>
  );
}
