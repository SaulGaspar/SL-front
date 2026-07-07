import React from "react";
import { useCart } from "../context/CartContext";

const CSS = `
  .cart-float {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1080;
    width: 68px;
    height: 68px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 22px;
    background:
      radial-gradient(circle at 78% 12%, rgba(189,230,50,.9), transparent 1.45rem),
      linear-gradient(145deg, #08182b, #102b4d);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 18px 40px rgba(8, 24, 43, .28);
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .cart-float:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 50px rgba(8, 24, 43, .34);
  }

  .cart-float:active {
    transform: translateY(-1px) scale(.96);
  }

  .cart-float-icon {
    position: relative;
    z-index: 1;
    font-size: 1.8rem;
    line-height: 1;
  }

  .cart-float-bubble {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    padding: 0 8px;
    border: 3px solid #fff;
    border-radius: 999px;
    background: #ff2020;
    color: #fff;
    font-size: .78rem;
    font-weight: 900;
    box-shadow: 0 8px 18px rgba(255, 32, 32, .26);
  }

  .cart-float-pulse {
    position: absolute;
    inset: -7px;
    border: 1px solid rgba(189,230,50,.55);
    border-radius: 26px;
    opacity: .7;
    animation: cart-pulse 1.9s ease-out infinite;
  }

  @keyframes cart-pulse {
    0% { transform: scale(.9); opacity: .55; }
    80%, 100% { transform: scale(1.22); opacity: 0; }
  }

  .cart-float:focus-visible {
    outline: 4px solid #bde632;
    outline-offset: 4px;
  }

  @media (max-width: 540px) {
    .cart-float {
      right: 16px;
      bottom: 16px;
      width: 62px;
      height: 62px;
      border-radius: 20px;
    }

    .cart-float-icon {
      font-size: 1.6rem;
    }

    .cart-float-bubble {
      top: -7px;
      right: -7px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cart-float,
    .cart-float-pulse {
      animation: none;
      transition: none;
    }
  }
`;

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
