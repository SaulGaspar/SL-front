import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import NotificacionesCliente from "./NotificacionesCliente"; // ← NUEVO

import CSS from "./Navbar.styles";
import { PROMOTIONS_ENABLED } from "../config/features";

const CFG_DEFAULTS = { notificaciones:true, darkMode:false, sonidos:true, promos:true, animaciones:true, idioma:"es" };

const ICON_COLORS = {
  notificaciones: { bg:"rgba(251,191,36,.15)", color:"#fbbf24" },
  darkMode:       { bg:"rgba(139,92,246,.15)",  color:"#a78bfa" },
  sonidos:        { bg:"rgba(59,130,246,.15)",   color:"#60a5fa" },
  promos:         { bg:"rgba(16,185,129,.15)",   color:"#34d399" },
  animaciones:    { bg:"rgba(236,72,153,.15)",   color:"#f472b6" },
};

export default function Navbar({ user, onLogout }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate(); // ← para la campana

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cfgOpen,    setCfgOpen]    = useState(false);
  const [cfg,        setCfg]        = useState(CFG_DEFAULTS);
  const [saved,      setSaved]      = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cfgRef   = useRef(null);
  const location = useLocation();
  const isAdmin  = user?.rol === "admin";
  const initial  = user?.nombre?.[0]?.toUpperCase() || "?";

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("config-app") || "null");
    if (s) setCfg({ ...CFG_DEFAULTS, ...s, darkMode });
    else   setCfg(c => ({ ...c, darkMode }));
  }, [darkMode]);

  useEffect(() => {
    const h = e => { if (cfgRef.current && !cfgRef.current.contains(e.target)) setCfgOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { setDrawerOpen(false); setCfgOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/catalogo") {
      setSearchTerm(new URLSearchParams(location.search).get("q") || "");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const nav    = p => location.pathname === p ? "nb-link active" : "nb-link";
  const toggle = k => setCfg(c => ({ ...c, [k]: !c[k] }));

  const buscar = event => {
    event.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  const guardar = () => {
    const { darkMode: dm, ...rest } = cfg;
    localStorage.setItem("config-app", JSON.stringify(rest));
    document.body.dataset.reduceMotion = cfg.animaciones ? "false" : "true";
    setDarkMode(dm);
    setSaved(true);
    setTimeout(() => { setSaved(false); setCfgOpen(false); }, 1200);
  };

  const CfgToggle = ({ id, icon, label, desc }) => (
    <div className="nb-cfg-row">
      <div className="nb-cfg-row-left">
        <div className="nb-cfg-row-icon" style={ICON_COLORS[id]}>
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="nb-cfg-row-label">{label}</div>
          <div className="nb-cfg-row-desc">{desc}</div>
        </div>
      </div>
      <label className="nb-sw" onClick={e => e.stopPropagation()}>
        <input type="checkbox" checked={cfg[id]} onChange={() => toggle(id)} />
        <span className="nb-sw-track" />
      </label>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <nav className="nb">

        {!isAdmin && (
          <div className="nb-strip">
            <Link className="nb-strip-link" to="/cambios"><i className="bi bi-arrow-left-right" /> Cambios</Link>
            <span className="nb-strip-sep">|</span>
            <Link className="nb-strip-link" to="/ayuda"><i className="bi bi-question-circle" /> Ayuda</Link>
            <span className="nb-strip-sep">|</span>
            <Link className="nb-strip-link" to="/contacto"><i className="bi bi-envelope" /> Contacto</Link>
            <span className="nb-strip-sep">|</span>
            <Link className="nb-strip-link" to="/tiendas"><i className="bi bi-shop" /> Tiendas</Link>
          </div>
        )}

        <div className="nb-main">
          <Link className="nb-logo" to="/">SPORTLIKE</Link>

          <ul className="nb-links">
            {!isAdmin ? (
              <>
                <li><Link className={nav("/")} to="/">Inicio</Link></li>
                <li><Link className={nav("/catalogo")} to="/catalogo">Catálogo</Link></li>
                {PROMOTIONS_ENABLED && <li><Link className={nav("/promociones")} to="/promociones">Promociones</Link></li>}
              </>
            ) : (
              <li><Link className="nb-link-admin" to="/admin"><i className="bi bi-speedometer2" /> Panel Admin</Link></li>
            )}
          </ul>

          {!isAdmin && (
            <form className="nb-search" onSubmit={buscar}>
              <button className="nb-search-ico" type="submit" aria-label="Buscar">
                <i className="bi bi-search" />
              </button>
              <input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Buscar productos, marcas…"
                aria-label="Buscar productos o marcas"
              />
            </form>
          )}

          <div className="nb-icons">

            {/* Carrito */}
            {!isAdmin && (
              <Link className="nb-icon-btn" to="/carrito" title="Carrito" style={{ position:"relative" }}>
                <i className="bi bi-bag" />
                <span className="nb-cart-dot" />
              </Link>
            )}

            {/* ── 🔔 CAMPANA NOTIFICACIONES CLIENTE ── */}
            {!isAdmin && user && (
              <NotificacionesCliente
                user={user}
                onVerPedidos={() => navigate("/orders")}
              />
            )}

            {/* Perfil */}
            {user
              ? <Link className="nb-icon-btn" to="/profile" title="Mi perfil"><i className="bi bi-person-circle" /></Link>
              : <Link className="nb-icon-btn" to="/login" title="Iniciar sesión"><i className="bi bi-box-arrow-in-right" /></Link>
            }

            <button className="nb-icon-btn" title="Configuración" onClick={() => navigate("/configuracion")}>
              <i className="bi bi-gear" />
            </button>

            {user && (
              <button className="nb-icon-btn nb-logout-btn" title="Cerrar sesión" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" />
              </button>
            )}

            <div className="nb-divider" />

            <button className={`nb-ham${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(v => !v)} aria-label="Menú">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* DRAWER mobile */}
      {drawerOpen && (
        <div className="nb-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="nb-drawer" onClick={e => e.stopPropagation()}>
            <div className="nb-dhead">
              <span className="nb-dhead-logo">SPORTLIKE</span>
              <button className="nb-dclose" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <div className="nb-dbody">
              <div className="nb-dsection">Navegación</div>
              {!isAdmin ? (
                <>
                  <Link className="nb-dlink" to="/"><i className="bi bi-house" /> Inicio</Link>
                  <Link className="nb-dlink" to="/catalogo"><i className="bi bi-grid" /> Catálogo</Link>
                  {PROMOTIONS_ENABLED && <Link className="nb-dlink" to="/promociones"><i className="bi bi-tag" /> Promociones</Link>}
                  <Link className="nb-dlink" to="/tiendas"><i className="bi bi-shop" /> Tiendas</Link>
                </>
              ) : (
                <Link className="nb-dlink" to="/admin"><i className="bi bi-speedometer2" /> Panel Admin</Link>
              )}
              <div className="nb-dsection" style={{marginTop:8}}>Cuenta</div>
              {!isAdmin && <Link className="nb-dlink" to="/favoritos"><i className="bi bi-heart" /> Favoritos</Link>}
              {user
                ? <Link className="nb-dlink" to="/profile"><i className="bi bi-person" /> Mi perfil</Link>
                : <Link className="nb-dlink" to="/login"><i className="bi bi-box-arrow-in-right" /> Iniciar sesión</Link>
              }
              {!isAdmin && user && (
                <Link className="nb-dlink" to="/orders"><i className="bi bi-bag-check" /> Mis pedidos</Link>
              )}
              {!isAdmin && <Link className="nb-dlink" to="/carrito"><i className="bi bi-bag" /> Carrito</Link>}
              <div className="nb-dsection" style={{marginTop:8}}>Soporte</div>
              <Link className="nb-dlink" to="/cambios"><i className="bi bi-arrow-left-right" /> Cambios</Link>
              <Link className="nb-dlink" to="/ayuda"><i className="bi bi-question-circle" /> Ayuda</Link>
              <Link className="nb-dlink" to="/contacto"><i className="bi bi-envelope" /> Contacto</Link>
              <Link className="nb-dlink" to="/tiendas"><i className="bi bi-shop" /> Tiendas</Link>
              {user && (
                <>
                  <div className="nb-dsection" style={{marginTop:8}} />
                  <a className="nb-dlink danger" href="/"
                    onClick={e => { e.preventDefault(); onLogout(); setDrawerOpen(false); }}>
                    <i className="bi bi-box-arrow-right" /> Cerrar sesión
                  </a>
                </>
              )}
            </div>
            {user && (
              <div className="nb-dfoot">
                <div className="nb-duser">
                  <div className="nb-davatar">{initial}</div>
                  <div>
                    <div className="nb-duname">{user.nombre} {user.apellidoP}</div>
                    <div className="nb-durole">{user.rol}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
