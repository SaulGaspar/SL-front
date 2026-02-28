import React, { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdStore,
  MdLocalOffer,
  MdAssessment,
  MdMenu,
  MdClose,
} from "react-icons/md";

// ✅ Imports corregidos con subcarpetas
import Dashboard from "./pages/Dashboard/Dashboard";
import Productos from "./pages/Productos/Productos";
import Inventario from "./pages/Inventario/Inventario";
import Pedidos from "./pages/Pedidos/Pedidos";
import Usuarios from "./pages/Usuarios/Usuarios";
import Promociones from "./pages/Promociones/Promociones";
import Reportes from "./pages/Reportes/Reportes";
import Sucursales from "./pages/Sucursales/Sucursales";

export default function AdminLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  if (!user || user.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { path: "/admin", icon: MdDashboard, label: "Dashboard", exact: true },
    { path: "/admin/productos", icon: MdInventory, label: "Productos" },
    { path: "/admin/inventario", icon: MdStore, label: "Inventario" },
    { path: "/admin/pedidos", icon: MdShoppingCart, label: "Pedidos" },
    { path: "/admin/usuarios", icon: MdPeople, label: "Usuarios" },
    { path: "/admin/sucursales", icon: MdStore, label: "Sucursales" },
    { path: "/admin/promociones", icon: MdLocalOffer, label: "Promociones" },
    { path: "/admin/reportes", icon: MdAssessment, label: "Reportes" },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 4px 0 12px rgba(0,0,0,0.1);
        }

        .admin-sidebar.closed {
          transform: translateX(-260px);
        }

        .sidebar-header {
          padding: 24px 20px;
          background: rgba(0,0,0,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-header h3 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-header p {
          margin: 8px 0 0 0;
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .sidebar-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .sidebar-menu::-webkit-scrollbar { width: 6px; }
        .sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }

        .menu-section { margin-bottom: 24px; }

        .menu-section-title {
          padding: 8px 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
          opacity: 0.6;
          margin-bottom: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: white;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .menu-item::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: #fff700;
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.1);
          padding-left: 24px;
        }

        .menu-item.active {
          background: rgba(255,247,0,0.15);
          color: #fff700;
          font-weight: 600;
        }

        .menu-item.active::before { transform: scaleY(1); }
        .menu-item svg { font-size: 1.3rem; }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .admin-main.expanded { margin-left: 0; }

        .admin-topbar {
          background: white;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle-sidebar-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #2c5282;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .toggle-sidebar-btn:hover { background: #f5f7fa; }

        .topbar-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e3a5f;
          margin: 0;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #f5f7fa;
          border-radius: 8px;
        }

        .admin-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .admin-user-details h5 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c5282;
        }

        .admin-user-details p {
          margin: 0;
          font-size: 0.75rem;
          color: #718096;
        }

        .admin-content { padding: 24px; }

        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-260px); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; }
          .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
          .sidebar-overlay.active { display: block; }
        }

        .page-header {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .page-header h2 {
          margin: 0 0 8px 0;
          color: #1e3a5f;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .page-header p {
          margin: 0;
          color: #718096;
          font-size: 0.95rem;
        }
      `}</style>

      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? "closed" : ""}`}>
        <div className="sidebar-header">
          <h3>
            <MdDashboard />
            Panel Admin
          </h3>
          <p>SportLike Management</p>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-section-title">Principal</div>
            {menuItems.slice(0, 1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`}
                onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="menu-section">
            <div className="menu-section-title">Gestión</div>
            {menuItems.slice(1, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`}
                onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="menu-section">
            <div className="menu-section-title">Marketing & Análisis</div>
            {menuItems.slice(6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path, item.exact) ? "active" : ""}`}
                onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className={`admin-main ${!sidebarOpen ? "expanded" : ""}`}>
        <div className="admin-topbar">
          <div className="topbar-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <MdClose /> : <MdMenu />}
            </button>
            <h1 className="topbar-title">
              {menuItems.find((item) => isActive(item.path, item.exact))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="topbar-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="admin-user-details">
                <h5>{user.nombre} {user.apellidoP}</h5>
                <p>Administrador</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}