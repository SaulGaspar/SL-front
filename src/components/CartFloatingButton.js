import React from "react";
import { useCart } from "../context/CartContext";

import CSS from "./CartFloatingButton.styles";

export default function CartFloatingButton() {
  const { cart, toggleMiniCart } = useCart();

  const items = Array.isArray(cart) ? cart : [];
  const count = items.reduce((sum, item) => sum + (Number(item.qty) || Number(item.cantidad) || 0), 0);
  const label = count > 0 ? `Abrir carrito, ${count} productos` : "Abrir carrito";

  return (
    <>
      <style>{CSS}</style>

      <button className="cart-float" onClick={toggleMiniCart} aria-label={label}>
        {count > 0 && <span className="cart-float-pulse" aria-hidden="true" />}
        <i className="bi bi-cart3 cart-float-icon" aria-hidden="true" />
        {count > 0 && (
          <span className="cart-float-bubble">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    </>
  );
}
