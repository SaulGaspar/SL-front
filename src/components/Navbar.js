import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ==================== ESTILOS ==================== */}
      <style>{`
        /* ===== LOGO ===== */
        .logo-brand {
          font-size: 1.9rem;
          font-weight: 900;
          letter-spacing: .5px;
          color: white !important;
          text-decoration: none;
        }

        .logo-brand:hover {
          color: #ffe600 !important;
        }

        /* ===== OVERLAY ===== */
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: flex-end;
          z-index: 999;
          animation: fadeIn .25s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        /* ===== PANEL ===== */
        .menu-panel {
          background: white;
          width: 85%;
          max-width: 420px;
          height: 100%;
          padding: 28px;
          box-shadow: -10px 0 40px rgba(0,0,0,.25);
          animation: slideIn .35s cubic-bezier(.4,0,.2,1);
          display: flex;
          flex-direction: column;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* ===== HEADER ===== */
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .menu-header h4 {
          font-weight: 900;
          letter-spacing: .5px;
        }

        .menu-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
        }

        /* ===== LINKS ===== */
        .menu-links {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .menu-links a {
          font-size: 1.2rem;
          font-weight: 700;
          text-decoration: none;
          color: #0a2540;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: .25s;
        }

        .menu-links a:hover {
          color: #1a73e8;
          transform: translateX(6px);
        }

        .menu-links i {
          font-size: 1.3rem;
        }

        /* ===== BOTONES ===== */
        .hamburger-btn {
          background: none;
          border: none;
          color: white;
        }

        .hamburger-btn:hover {
          transform: scale(1.1);
        }

        /* ===== MOBILE ===== */
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }

          .mobile-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 14px;
          }
        }

        @media (min-width: 769px) {
          .mobile-row { display: none !important; }
        }
      `}</style>

      {/* ==================== NAVBAR ==================== */}

      <nav className="navbar bg-primary-custom">

        <div className="container-fluid">

          {/* -------- MOBILE -------- */}
          <div className="mobile-row w-100">

            <Link to="/" className="logo-brand">
              SportLike
            </Link>

            <div className="d-flex align-items-center gap-3">

              <Link className="text-white" to="/carrito">
                <i className="bi bi-cart fs-4" />
              </Link>

              {user ? (
                <Link className="text-white" to="/profile">
                  <i className="bi bi-person-circle fs-4" />
                </Link>
              ) : (
                <Link className="text-white" to="/login">
                  <i className="bi bi-box-arrow-in-right fs-4" />
                </Link>
              )}

              <button
                className="hamburger-btn"
                onClick={() => setMenuOpen(true)}
              >
                <i className="bi bi-list fs-3" />
              </button>

            </div>
          </div>

          {/* -------- DESKTOP -------- */}

          <Link to="/" className="navbar-brand logo-brand desktop-only">
            SportLike
          </Link>

          <ul className="navbar-nav flex-row gap-4 mx-auto desktop-only">

            <li>
              <Link className="nav-link text-white" to="/">Inicio</Link>
            </li>

            <li>
              <Link className="nav-link text-white" to="/catalogo">Catálogo</Link>
            </li>

            <li>
              <Link className="nav-link text-white" to="/promociones">Promociones</Link>
            </li>

          </ul>

          <ul className="navbar-nav flex-row align-items-center desktop-only">

            <li>
              <button
                className="hamburger-btn nav-link"
                onClick={() => setMenuOpen(true)}
              >
                <i className="bi bi-list fs-3" />
              </button>
            </li>

          </ul>

        </div>
      </nav>

      {/* ==================== MENU LATERAL ==================== */}

      {menuOpen && (

        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        >

          <div
            className="menu-panel"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="menu-header">

              <h4>Menú</h4>

              <button
                className="menu-close"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>

            </div>

            <nav className="menu-links">

              <Link to="/configuracion" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-gear" />
                Configuración
              </Link>

              <Link to="/ayuda" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-question-circle" />
                Ayuda
              </Link>

              <Link to="/contacto" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-envelope" />
                Contacto
              </Link>

              <Link to="/tiendas" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-shop" />
                Tiendas
              </Link>

              {user && (
                <Link to="/" onClick={onLogout}>
                  <i className="bi bi-box-arrow-right" />
                  Cerrar sesión
                </Link>
              )}

            </nav>

          </div>

        </div>

      )}

    </>
  );
}
