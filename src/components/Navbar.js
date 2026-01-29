import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bg-primary-custom">

      {/* ==================== ESTILOS ==================== */}
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

        /* ============ PANEL PREMIUM ============ */

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

            {user && (
              <button className="btn btn-link text-white p-0" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" style={{ fontSize: "1.5rem" }} />
              </button>
            )}

            {/* 🍔 */}
            <button
              className="btn btn-link text-white p-0"
              onClick={() => setMenuOpen(true)}
            >
              <i className="bi bi-list" style={{ fontSize: "1.7rem" }} />
            </button>
          </div>
        </div>

        {/* ---------------- MOBILE MENU ---------------- */}
        <div className="mobile-menu">
          <Link className="nav-link text-white fs-5" to="/">Inicio</Link>
          <Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link>
          <Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link>
        </div>

        {/* ---------------- DESKTOP ---------------- */}
        <Link className="navbar-brand logo-brand ms-2 desktop-only" to="/">SportLike</Link>

        <ul className="navbar-nav d-flex flex-row gap-4 mx-auto desktop-only">
          <li><Link className="nav-link text-white fs-5" to="/">Inicio</Link></li>
          <li><Link className="nav-link text-white fs-5" to="/catalogo">Catálogo</Link></li>
          <li><Link className="nav-link text-white fs-5" to="/promociones">Promociones</Link></li>
        </ul>

        <ul className="navbar-nav d-flex flex-row align-items-center me-3 desktop-only">

          {user && (
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/profile">
                <i className="bi bi-person-circle" />
              </Link>
            </li>
          )}

          {!user && (
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/login">
                <i className="bi bi-box-arrow-in-right" />
              </Link>
            </li>
          )}

          {user && (
            <li className="nav-item me-3">
              <button
                className="btn btn-link nav-link text-white"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right" />
              </button>
            </li>
          )}

          <li className="nav-item">
            <button
              className="btn btn-link nav-link text-white"
              onClick={() => setMenuOpen(true)}
            >
              <i className="bi bi-list fs-4" />
            </button>
          </li>

        </ul>

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

      </div>
    </nav>
  );
}
