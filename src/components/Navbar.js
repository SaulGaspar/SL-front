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

        /* ================= PANEL LATERAL ================= */

        .side-panel-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 200;
          display: flex;
          justify-content: flex-end;
        }

        .side-panel {
          width: 50%;
          max-width: 420px;
          height: 100%;
          background: white;
          padding: 30px;
          box-shadow: -10px 0 40px rgba(0,0,0,.25);
          animation: slideIn .35s ease forwards;
          overflow-y: auto;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .side-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .side-header h4 {
          font-weight: 900;
          font-size: 1.5rem;
          color: #0a2540;
          margin: 0;
        }

        .side-header button {
          border: none;
          background: none;
          font-size: 2rem;
          cursor: pointer;
        }

        .side-links {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .side-links a {
          font-size: 1.25rem;
          font-weight: 700;
          text-decoration: none;
          color: #0a2540;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .side-links a:hover {
          color: #1a73e8;
          transform: translateX(6px);
        }

        /* ================= MOBILE ================= */

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

          .side-panel {
            width: 100%;
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

        {/* ---------------- MOBILE ROW ---------------- */}
        <div className="mobile-row">
          <Link className="logo-brand" to="/">SportLike</Link>

          <div className="d-flex align-items-center gap-3">

            <Link className="text-white" to="/search">
              <i className="bi bi-search" style={{ fontSize: "1.5rem" }} />
            </Link>

            <Link className="text-white" to="/carrito">
              <i className="bi bi-cart" style={{ fontSize: "1.5rem" }} />
            </Link>

            {user ? (
              <Link className="text-white" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }} />
              </Link>
            ) : (
              <Link className="text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: "1.5rem" }} />
              </Link>
            )}

            {/* 🍔 HAMBURGUESA */}
            <button
              className="btn btn-link text-white p-0"
              onClick={() => setMenuOpen(true)}
            >
              <i className="bi bi-list" style={{ fontSize: "1.7rem" }} />
            </button>
          </div>
        </div>

        {/* ---------------- MOBILE MENU INFERIOR ---------------- */}
        <div className="mobile-menu">
          <Link className="nav-link text-white fs-5" to="/">Inicio</Link>
          <Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link>
          <Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link>
        </div>

        {/* ---------------- DESKTOP NAV ---------------- */}
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

        {/* ---------------- ICONOS DESKTOP ---------------- */}
        <ul className="navbar-nav d-flex flex-row align-items-center me-3 desktop-only">

          {user && (
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }} />
              </Link>
            </li>
          )}

          {!user && (
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }} />
              </Link>
            </li>
          )}

          {/* 🍔 HAMBURGUESA */}
          <li className="nav-item">
            <button
              className="btn btn-link nav-link text-white"
              onClick={() => setMenuOpen(true)}
            >
              <i className="bi bi-list" style={{ fontSize: "1.7rem" }} />
            </button>
          </li>

        </ul>

        {/* ================= PANEL LATERAL ================= */}
        {menuOpen && (
          <div
            className="side-panel-overlay"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="side-panel"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="side-header">
                <h4>Menú</h4>
                <button onClick={() => setMenuOpen(false)}>✕</button>
              </div>

              <nav className="side-links">
                <Link to="/configuracion" onClick={() => setMenuOpen(false)}>
                  <i className="bi bi-gear"></i> Configuración
                </Link>
                <Link to="/ayuda" onClick={() => setMenuOpen(false)}>
                  <i className="bi bi-question-circle"></i> Ayuda
                </Link>
                <Link to="/contacto" onClick={() => setMenuOpen(false)}>
                  <i className="bi bi-envelope"></i> Contacto
                </Link>
                <Link to="/tiendas" onClick={() => setMenuOpen(false)}>
                  <i className="bi bi-shop"></i> Tiendas
                </Link>
                {user && (
                  <Link to="/" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                  </Link>
                )}
              </nav>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
