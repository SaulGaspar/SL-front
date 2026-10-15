import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdStore, MdAssessment, MdMenu, MdClose, MdEmail, MdPerson, MdAdminPanelSettings, MdLogout, MdMonitor, MdLocalOffer, MdAssignmentReturn, MdTrendingDown, MdRateReview } from "react-icons/md";

import Dashboard   from "./pages/Dashboard/Dashboard";
import Productos   from "./pages/Productos/Productos";
import Inventario  from "./pages/Inventario/Inventario";
import Pedidos     from "./pages/Pedidos/Pedidos";
import Usuarios    from "./pages/Usuarios/Usuarios";
import Reportes    from "./pages/Reportes/Reportes";
import Sucursales  from "./pages/Sucursales/Sucursales";
import MonitorBD   from "./pages/Monitor/MonitorDB";
import Promociones from "./pages/Promociones/Promociones";
import Devoluciones from "./pages/Devoluciones/Devoluciones";
import Resenas from "./pages/Resenas/Resenas";
import Mensajes from "./pages/Mensajes/Mensajes";
import NotificacionesBell from "./Notificacionesbell";

export default function AdminLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location   = useLocation();
  const navigate   = useNavigate();

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { setProfileOpen(false); }, [location.pathname]);

  if (!user || user.rol !== "admin") return <Navigate to="/" replace />;
  const initial = (user.nombre || user.correo || "A").charAt(0).toUpperCase();

  const menuItems = [
    { path: "/admin",            icon: MdDashboard,    label: "Resumen",  exact: true },
    { path: "/admin/productos",  icon: MdInventory,    label: "Productos"               },
    { path: "/admin/inventario", icon: MdStore,        label: "Inventario"              },
    { path: "/admin/pedidos",    icon: MdShoppingCart, label: "Pedidos"                 },
    { path: "/admin/usuarios",   icon: MdPeople,       label: "Usuarios"                },
    { path: "/admin/sucursales", icon: MdStore,        label: "Sucursales"              },
    { path: "/admin/promociones",icon: MdLocalOffer,   label: "Promociones · pausadas"  },
    { path: "/admin/devoluciones",icon: MdAssignmentReturn,label: "Cambios"             },
    { path: "/admin/resenas",     icon: MdRateReview,   label: "Reseñas"             },
    { path: "/admin/mensajes",    icon: MdEmail,        label: "Mensajes"            },
    { path: "/admin/reportes",   icon: MdAssessment,   label: "Reportes"                },
    { path: "/admin/agotamiento",icon: MdTrendingDown, label: "Alertas de stock"        },
  ];

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);
  const currentTitle = menuItems.find(item => isActive(item.path, item.exact))?.label
    || (location.pathname.startsWith("/admin/monitor") ? "Monitor BD" : "Resumen");

  return (
    <div className="admin-layout">
      <style>{ADMIN_CSS}</style>

      <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside id="admin-navigation" className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`} inert={!sidebarOpen ? "" : undefined}>
        <div className="sidebar-header">
          <h3><MdDashboard /> Panel Admin</h3>
          <p>Administración SportLike</p>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-section-title">Principal</div>
            {menuItems.slice(0, 1).map(item => (
              <Link key={item.path} to={item.path} className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <item.icon /><span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="menu-section">
            <div className="menu-section-title">Gestión</div>
            {menuItems.slice(1, 10).map(item => (
              <Link key={item.path} to={item.path} className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <item.icon /><span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="menu-section">
            <div className="menu-section-title">Análisis</div>
            {menuItems.slice(10, 12).map(item => (
              <Link key={item.path} to={item.path} className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <item.icon /><span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="menu-section">
            <div className="menu-section-title">Sistema</div>
            <Link to="/admin/monitor" className={`menu-item monitor-item ${isActive("/admin/monitor") ? "active" : ""}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
              <MdMonitor /><span>Monitor BD</span>
            </Link>
          </div>
        </nav>
      </aside>

      <main className={`admin-main ${!sidebarOpen ? "expanded" : ""}`}>
        <div className="admin-topbar">
          <div className="topbar-left">
            <button className="toggle-sidebar-btn" type="button" aria-label={sidebarOpen ? "Cerrar menú de administración" : "Abrir menú de administración"} aria-expanded={sidebarOpen} aria-controls="admin-navigation" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <MdClose /> : <MdMenu />}
            </button>
            <h1 className="topbar-title">
              {currentTitle}
            </h1>
          </div>

          <div className="topbar-right">
            <NotificacionesBell onVerPedido={() => navigate("/admin/pedidos")} />

            <div className="admin-profile-wrapper" ref={profileRef}>
              <button type="button" aria-label="Opciones de mi cuenta" aria-expanded={profileOpen} className={`admin-user-info ${profileOpen ? "open" : ""}`} onClick={() => setProfileOpen(p => !p)}>
                <div className="admin-user-avatar">{initial}</div>
                <div className="admin-user-details">
                  <h5>{user.nombre} {user.apellidoP}</h5>
                  <p>Administrador</p>
                </div>
              </button>
              {profileOpen && (
                <div className="admin-profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar-lg">{initial}</div>
                    <div className="dropdown-header-info">
                      <h4>{user.nombre} {user.apellidoP}</h4>
                      <span><MdAdminPanelSettings style={{ verticalAlign: "middle", marginRight: 4 }} />Administrador</span>
                    </div>
                  </div>
                  <div className="dropdown-body">
                    <div className="dropdown-info-row">
                      <MdEmail />
                      <div><div className="info-label">Correo</div><div className="info-value">{user.correo || user.email || "—"}</div></div>
                    </div>
                    <div className="dropdown-info-row">
                      <MdPerson />
                      <div><div className="info-label">Usuario</div><div className="info-value">@{user.usuario || "—"}</div></div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button className="btn-logout" onClick={() => { setProfileOpen(false); onLogout(); }}>
                      <MdLogout /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`admin-content ${location.pathname === "/admin/monitor" ? "is-monitor" : ""}`}>
          <Routes>
            <Route path="/"           element={<Dashboard />}  />
            <Route path="/productos"  element={<Productos />}  />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/pedidos"    element={<Pedidos />}    />
            <Route path="/usuarios"   element={<Usuarios />}   />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/resenas"     element={<Resenas />} />
            <Route path="/mensajes"    element={<Mensajes />} />
            <Route path="/reportes"   element={<Reportes />}   />
            <Route path="/agotamiento" element={<Reportes initialTab="inventario" />} />
            <Route path="/monitor"    element={<MonitorBD />}  />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

import ADMIN_CSS from "./AdminLayout.styles";
