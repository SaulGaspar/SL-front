import React from "react";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {

  const { cart, cartOpen, toggleCart, removeItem, updateQuantity, updateTalla, updateColor } = useCart();

  const total = cart.reduce((acc, p) => acc + p.price * p.cantidad, 0);

  return (
    <>
      <style>{`
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 340px;
          height: 100%;
          background: white;
          box-shadow: -5px 0 15px rgba(0,0,0,0.15);
          z-index: 1000;
          padding: 20px;
          transform: translateX(100%);
          transition: transform .25s ease-in-out;
          overflow-y: auto;
        }

        .cart-sidebar.open {
          transform: translateX(0);
        }

        .cart-item {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 12px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        
        <h4 className="fw-bold">Mi Carrito</h4>

        <button className="btn btn-sm btn-outline-dark mb-3" onClick={toggleCart}>
          Cerrar
        </button>

        {cart.length === 0 && <p className="text-muted">Tu carrito está vacío.</p>}

        {cart.map((p, index) => (
          <div key={index} className="cart-item">

            <h5>{p.title}</h5>
            <p className="text-muted">${p.price}</p>

            {/* Cantidad */}
            <div className="d-flex align-items-center mb-2">
              <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(index, p.cantidad - 1)}>-</button>
              <span className="mx-2">{p.cantidad}</span>
              <button className="btn btn-outline-dark btn-sm" onClick={() => updateQuantity(index, p.cantidad + 1)}>+</button>
            </div>

            {/* Talla */}
            <div className="mb-2">
              <label className="form-label">Talla</label>
              <select className="form-control" value={p.talla} onChange={e => updateTalla(index, e.target.value)}>
                <option>CH</option>
                <option>M</option>
                <option>G</option>
              </select>
            </div>

            {/* Color */}
            <div className="mb-2">
              <label className="form-label">Color</label>
              <select className="form-control" value={p.color} onChange={e => updateColor(index, e.target.value)}>
                <option>Negro</option>
                <option>Blanco</option>
                <option>Rojo</option>
                <option>Azul</option>
              </select>
            </div>

            {/* Eliminar */}
            <button className="btn btn-danger btn-sm mt-2" onClick={() => removeItem(index)}>
              Quitar
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <h4>Total: <span className="fw-bold text-success">${total}</span></h4>

            <button className="btn btn-primary-custom w-100 mt-3">
              Ir a pagar
            </button>
          </>
        )}

      </div>
    </>
  );
}
