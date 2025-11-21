import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function MiniCart() {
  const { cart, updateQty, removeItem, showMiniCart, toggleMiniCart } = useCart();
  const navigate = useNavigate();

  if (!showMiniCart) return null;

  const total = cart.reduce(
    (s, item) => s + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );

  return (
    <div
      className="position-fixed top-0 end-0 bg-white shadow"
      style={{
        width: 320,
        height: "80vh",
        maxHeight: "80vh",
        zIndex: 1050,
        display: "flex",
        flexDirection: "column",
        right: 20,
        top: 70,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Tu carrito</h6>
        <button className="btn btn-sm btn-outline-secondary" onClick={toggleMiniCart}>
          ✕
        </button>
      </div>

      {/* Lista de productos */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{ padding: "0 12px" }}
      >
        {cart.length === 0 ? (
          <p className="text-muted mt-3">Tu carrito está vacío.</p>
        ) : (
          cart.map((item, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-2 border-bottom py-2"
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <p className="mb-1 fw-bold" style={{ fontSize: 14 }}>{item.title}</p>
                  <button
                    className="btn btn-sm btn-outline-danger p-1"
                    onClick={() => removeItem(item)}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-muted mb-1" style={{ fontSize: 12 }}>
                  {item.size} | {item.color}
                </p>
                <div className="d-flex align-items-center gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQty(item, Math.max(1, (item.qty || 1) - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={item.qty || 1}
                    className="form-control text-center"
                    style={{ width: 36, fontSize: 12, padding: "2px" }}
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQty(item, (item.qty || 1) + 1)}
                  >
                    +
                  </button>
                  <span className="fw-bold ms-2">${item.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con total y botón siempre visible */}
      <div className="p-3 border-top bg-light">
        <div className="d-flex justify-content-between fw-bold mb-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-dark w-100"
          onClick={() => {
            navigate("/carrito");
            toggleMiniCart();
          }}
        >
          Ir al carrito
        </button>
      </div>
    </div>
  );
}
