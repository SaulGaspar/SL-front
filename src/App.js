import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import AdminLayout from "./Admin/AdminLayout";

import { CartProvider } from "./context/CartContext";
import CartFloatingButton from "./components/CartFloatingButton";
import MiniCart from "./components/MiniCart";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AvisoPrivacidad from "./pages/User/AvisoPrivacidad";
import Terminos from "./pages/User/Terminos";

import Home from "./pages/User/Home";
import Catalogo from "./pages/User/Catalogo";
import ProductoDetalle from "./pages/User/ProductoDetalle";
import Promociones from "./pages/User/Promociones";
import Carrito from "./pages/User/Carrito";
import Pago from "./pages/User/Pago";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/User/Profile";

import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/User/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";

import Error400 from "./pages/errors/Error400";
import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

import Ayuda from "./pages/menu/Ayuda";
import Configuracion from "./pages/menu/Configuracion";
import Contacto from "./pages/menu/Contacto";
import Tiendas from "./pages/menu/Tiendas";

const API_URL = "https://sl-back.vercel.app";

// Rutas donde se oculta Navbar, Footer y botones flotantes
const HIDDEN_NAV_ROUTES = ["/login", "/register", "/../UpdateInfoForm", "/../ForgotPassword"];

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // true cuando la ruta actual es login o register
  const hideNav = HIDDEN_NAV_ROUTES.includes(location.pathname);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  useEffect(() => {
    async function cargarUsuario() {
      const token = localStorage.getItem("token");
      if (!token) { setLoadingUser(false); return; }

      try {
        const res = await axios.get(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    cargarUsuario();
  }, []);

  if (loadingUser) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", fontSize: "1.2rem", color: "#718096"
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <CartProvider>
      <Routes>

        {/* ===== RUTAS ADMIN (sin Navbar/Footer) ===== */}
        <Route
          path="/admin/*"
          element={
            user?.rol === "admin"
              ? <AdminLayout user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* ===== RUTAS PÚBLICAS ===== */}
        <Route
          path="/*"
          element={
            <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>

              {/* Se ocultan en /login y /register */}
              {!hideNav && <Navbar user={user} onLogout={handleLogout} />}
              {!hideNav && <CartFloatingButton />}
              {!hideNav && <MiniCart />}

              <div className={`flex-grow-1 ${!hideNav ? "container-fluid px-4 py-4" : ""}`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/producto/:id" element={<ProductoDetalle />} />
                  <Route path="/promociones" element={<Promociones />} />
                  <Route path="/carrito" element={<Carrito />} />

                  <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
                  <Route path="/terminos" element={<Terminos />} />

                  <Route path="/ayuda" element={<Ayuda />} />
                  <Route path="/configuracion" element={<Configuracion />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/tiendas" element={<Tiendas />} />

                  <Route
                    path="/pago"
                    element={localStorage.getItem("token") ? <Pago /> : <Navigate to="/login" />}
                  />

                  <Route path="/login" element={<Login onLogin={(u) => {
                    setUser(u);
                    if (u?.rol === "admin") navigate("/admin", { replace: true });
                    else navigate("/");
                  }} />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/profile"
                    element={localStorage.getItem("token") ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
                  />

                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/google-callback" element={<GoogleCallback onLogin={setUser} />} />

                  <Route path="/400" element={<Error400 />} />
                  <Route path="/500" element={<Error500 />} />
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </div>

              {/* Footer también se oculta */}
              {!hideNav && <Footer />}
            </div>
          }
        />

      </Routes>
    </CartProvider>
  );
}
