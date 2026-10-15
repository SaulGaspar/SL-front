import { API_BASE_URL } from "../../config/api";
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import DireccionCheckout from "./DireccionCheckOut";
import { usePwa } from "../../context/PwaContext";

const API_URL = API_BASE_URL;
const PENDING_KEY = "sportlike_pending_checkout";
const LAST_ORDER_KEY = "sportlike_last_paid_order";

const fmtMXN = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

import CSS from "./Carrito.styles";

export default function Carrito() {
  const { online } = usePwa();
  const { cart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [direccionRequerida, setDireccionRequerida] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const getPrice = i => Number(i.precio || i.price || 0);
  const getQty   = i => Number(i.qty || i.cantidad || 1);

  const subtotal = cart.reduce((s, i) => s + getPrice(i) * getQty(i), 0);
  const shipping = subtotal >= 1500 ? 0 : cart.length ? 75 : 0;
  const total    = subtotal + shipping;

  const seleccionarDireccion = (dir) => {
    setDireccionSeleccionada(dir);
    setDireccionRequerida(false);
  };

  const handlePago = async () => {
    if (!navigator.onLine) { setPaymentError("Conéctate a internet para confirmar disponibilidad y pagar."); return; }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/carrito" } });
      return;
    }
    if (!direccionSeleccionada?.id) {
      setDireccionRequerida(true);
      return;
    }

    const itemsByProduct = new Map();
    cart.forEach((item) => {
      const productId = Number(item.id || item.product_id);
      const quantity = getQty(item);
      if (!productId || !Number.isInteger(quantity) || quantity <= 0) return;
      itemsByProduct.set(productId, (itemsByProduct.get(productId) || 0) + quantity);
    });
    const items = [...itemsByProduct.entries()].map(([product_id, cantidad]) => ({
      product_id,
      cantidad,
    }));

    if (!items.length) {
      setPaymentError("No pudimos preparar los productos para el pago.");
      return;
    }

    setLoadingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch(`${API_URL}/api/payments/preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          direccion_id: direccionSeleccionada.id,
          items,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar Mercado Pago");
      if (!data.checkout_url) throw new Error("Mercado Pago no devolvió una URL de pago");

      sessionStorage.setItem(PENDING_KEY, JSON.stringify({
        direccion_id: direccionSeleccionada.id,
        items,
        displayItems: cart,
        total: data.total,
        preference_id: data.preference_id,
      }));
      sessionStorage.removeItem(LAST_ORDER_KEY);
      window.location.assign(data.checkout_url);
    } catch (error) {
      setPaymentError(error.message || "No se pudo iniciar el pago.");
      setLoadingPayment(false);
    }
  };

  return (
    <div className="crt">
      <style>{CSS}</style>

      <div className="crt-header">
        <div className="crt-header-inner">
          <div>
            <h1>Tu carrito</h1>
            <div className="crt-header-sub">
              {cart.length > 0
                ? "Revisa tu selección y prepara todo para recibir tu pedido."
                : "Cuando encuentres algo que te guste, lo guardaremos aquí."}
            </div>
          </div>
        </div>
      </div>

      <div className="crt-body">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className="crt-panel">
          <div className="crt-panel-head">
            <span className="crt-panel-title">Productos</span>
          </div>

          {cart.length === 0 ? (
            <div className="crt-empty">
              <div className="crt-empty-icon">🛍️</div>
              <h3>Tu carrito está vacío</h3>
              <p>Explora nuestro catálogo y encuentra lo que buscas</p>
              <button className="crt-empty-btn" onClick={() => navigate("/catalogo")}>
                Ver catálogo
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="crt-item">
                <img
                  src={item.imagen || item.img}
                  alt={item.nombre || item.title}
                  className="crt-item-img"
                  onError={e => { e.target.src = "https://placehold.co/90x90"; }}
                />
                <div className="crt-item-info">
                  <div className="crt-item-name">{item.nombre || item.title || "Producto"}</div>
                  <div className="crt-item-meta">
                    {(item.talla || item.size)  && <span>📐 {item.talla || item.size}</span>}
                    {item.color                 && <span>🎨 {item.color}</span>}
                    {item.marca                 && <span>🏷️ {item.marca}</span>}
                  </div>
                  <div className="crt-item-price">{fmtMXN(getPrice(item))} c/u</div>
                </div>
                <div className="crt-item-right">
                  <div className="crt-item-subtotal">{fmtMXN(getPrice(item) * getQty(item))}</div>
                  <div className="crt-qty">
                    <button className="crt-qty-btn" onClick={() => updateQty(item, Math.max(1, getQty(item) - 1))}>−</button>
                    <span className="crt-qty-val">{getQty(item)}</span>
                    <button className="crt-qty-btn" onClick={() => updateQty(item, getQty(item) + 1)}>+</button>
                  </div>
                  <button className="crt-remove" onClick={() => removeItem(item)}>
                    ✕ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── COLUMNA DERECHA ── */}
        {cart.length > 0 && (
          <div className="crt-right-col">
            {online && <DireccionCheckout
              onDireccionSelect={seleccionarDireccion}
              direccionActual={direccionSeleccionada}
            />}

            <div className="crt-summary">
              <div className="crt-summary-head">
                <h3>Resumen</h3>
                <p>Detalle de tu compra</p>
              </div>
              <div className="crt-summary-body">

                <div className="crt-row">
                  <span className="crt-row-lbl">Subtotal</span>
                  <span className="crt-row-val">{fmtMXN(subtotal)}</span>
                </div>
                <div className="crt-row">
                  <span className="crt-row-lbl">Entrega</span>
                  <span className={`crt-row-val ${shipping === 0 ? "green" : ""}`}>
                    {shipping === 0 ? "Sin costo" : fmtMXN(shipping)}
                  </span>
                </div>

                <div className="crt-divider" />

                <div className="crt-total-row">
                  <span className="crt-total-lbl">Total</span>
                  <span className="crt-total-val">{fmtMXN(total)}</span>
                </div>

                {direccionRequerida && (
                  <div className="crt-address-alert">
                    Agrega o selecciona una dirección de entrega antes de pagar.
                  </div>
                )}

                {paymentError && <div className="crt-payment-alert">{paymentError}</div>}

                <button
                  className="crt-pay-btn"
                  onClick={handlePago}
                  disabled={cart.length === 0 || loadingPayment || !online}
                >
                  {loadingPayment ? (
                    <><span className="crt-spinner" /> Redirigiendo a Mercado Pago...</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      {!online ? "Conéctate para pagar" : direccionSeleccionada?.id ? "Proceder al pago" : "Agrega una dirección"}
                    </>
                  )}
                </button>

                <div className="crt-secure">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Pago 100% seguro · SSL cifrado
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
