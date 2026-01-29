import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import CartFloatingButton from "./components/CartFloatingButton";
import MiniCart from "./components/MiniCart";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AvisoPrivacidad from "./pages/AvisoPrivacidad";
import Terminos from "./pages/Terminos";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Promociones from "./pages/Promociones";
import Carrito from "./pages/Carrito";
import Pago from "./pages/Pago";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";

import Error400 from "./pages/errors/Error400";
import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

/* 👉 nuevas páginas menú hamburguesa */
import Ayuda from "./pages/Ayuda";
import Configuracion from "./pages/Configuracion";
import Contacto from "./pages/Contacto";
import Tiendas from "./pages/Tiendas";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  // Sincroniza usuario con localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (token && u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <CartProvider>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Navbar user={user} onLogout={handleLogout} />
        <CartFloatingButton />
        <MiniCart />

        <div className="container my-4 flex-grow-1">
          <Routes>

            {/* PRINCIPALES */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* FOOTER */}
            <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
            <Route path="/terminos" element={<Terminos />} />

            {/* MENU HAMBURGUESA */}
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/tiendas" element={<Tiendas />} />

            {/* PAGO protegido */}
            <Route
              path="/pago"
              element={
                localStorage.getItem("token") ? (
                  <Pago />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* AUTH */}
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile"
              element={
                localStorage.getItem("token") ? (
                  <Profile user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/google-callback" element={<GoogleCallback onLogin={setUser} />} />

            {/* ERRORES */}
            <Route path="/400" element={<Error400 />} />
            <Route path="/500" element={<Error500 />} />

            {/* 404 SIEMPRE AL FINAL */}
            <Route path="*" element={<Error404 />} />

          </Routes>
        </div>

        <Footer />
      </div>
    </CartProvider>
  );
}
