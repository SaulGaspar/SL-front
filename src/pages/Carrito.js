import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const { cart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("🟢 Componente Carrito montado");
    console.log("🛒 Items en carrito:", cart.length);
  }, [cart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );
  const shipping = cart.length ? 75 : 0;
  const total = subtotal + shipping;

  const handlePago = () => {
    console.log("=== INICIO handlePago ===");
    
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    console.log("Token encontrado:", !!token);
    console.log("User encontrado:", !!user);
    console.log("Total:", total);
    
    if (token) {
      console.log("Navegando a /pago...");
      try {
        navigate("/pago", { state: { total } });
        console.log("Navigate ejecutado correctamente");
      } catch (error) {
        console.error("Error en navigate:", error);
      }
    } else {
      console.log("Sin token, redirigiendo a login");
      navigate("/login");
    }
    
    console.log("=== FIN handlePago ===");
  };

  return (
    <div className="container my-5">

      <h2 className="fw-bold mb-4">Tu Carrito de Compras</h2>
      
      <div className="row">
        <div className="col-lg-8">
          {cart.length === 0 ? (
            <div>
              <p className="text-muted">Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-center border-bottom py-3"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">{item.title}</h5>
                  <p className="text-muted mb-1">
                    Color: {item.color} | Talla: {item.size}
                  </p>
                  <p className="fw-bold mb-2">${item.price}</p>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateQty(item, Math.max(1, (item.qty || 1) - 1))
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.qty || 1}
                      readOnly
                      className="form-control text-center"
                      style={{ width: 60 }}
                    />

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateQty(item, (item.qty || 1) + 1)
                      }
                    >
                      +
                    </button>

                    <button
                      className="btn btn-link text-danger btn-sm ms-3"
                      onClick={() => removeItem(item)}
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>

                <div className="ms-3 fw-bold">
                  ${(item.qty || 1) * item.price}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-lg-4">
          <div className="card p-3 shadow-sm">
            <h6>
              Código promocional{" "}
              <span className="float-end text-primary">AÑADIR DESCUENTO</span>
            </h6>

            <hr />

            <h5 className="fw-bold">Resumen de compra</h5>

            <div className="d-flex justify-content-between">
              <span>Total parcial</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Estimado de envío</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button
              type="button"
              className="btn btn-dark w-100 mt-3 py-2 fs-5"
              onClick={handlePago}
            >
              Proceder al pago
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}