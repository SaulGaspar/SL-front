import React from "react";
import { useCart } from "../context/CartContext";

export default function CartFloatingButton() {
  const { cart, toggleMiniCart } = useCart();

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <style>{`
        .cart-float-btn {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #0a1a2f;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28px;
          cursor: pointer;
          z-index: 2000;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .cart-bubble {
          position: absolute;
          top: -6px;
          right: -6px;
          background: red;
          color: white;
          padding: 2px 7px;
          border-radius: 50%;
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>

      <div className="cart-float-btn" onClick={toggleMiniCart}>
        <i className="bi bi-cart3"></i>

        {count > 0 && <div className="cart-bubble">{count}</div>}
      </div>
    </>
  );
}
