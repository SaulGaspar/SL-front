import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import CSS from "./MiniCart.styles";

export default function MiniCart() {
  const { cart, updateQty, removeItem, showMiniCart, toggleMiniCart } = useCart();
  const navigate = useNavigate();

  if (!showMiniCart) return null;

  const items = Array.isArray(cart) ? cart : [];
  const total = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );

  const itemCount = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const money = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value) || 0);

  const goTo = (path) => {
    navigate(path);
    toggleMiniCart();
  };

  return (
    <div className="mc-backdrop" onClick={toggleMiniCart}>
      <style>{CSS}</style>

      <aside
        className="mc-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Carrito de compras"
      >
        <header className="mc-head">
          <div className="mc-topline">
            <div>
              <span className="mc-kicker">SportLike</span>
              <h2 className="mc-title">Tu carrito</h2>
            </div>

            <button className="mc-close" onClick={toggleMiniCart} aria-label="Cerrar carrito">
              ×
            </button>
          </div>

          <div className="mc-summary">
            <span className="mc-dot" />
            {itemCount === 1 ? "1 producto seleccionado" : `${itemCount} productos seleccionados`}
          </div>
        </header>

        <div className="mc-body">
          {items.length === 0 ? (
            <div className="mc-empty">
              <div className="mc-empty-card">
                <div className="mc-empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega tus productos favoritos y vuelve aquí para revisar tu compra.</p>
              </div>
            </div>
          ) : (
            <div className="mc-list">
              {items.map((item, index) => {
                const qty = Number(item.qty) || 1;
                const img = item.img || item.image || item.imagen || item.image_url;
                const title = item.title || item.nombre || "Producto SportLike";
                const details = [item.size || item.talla, item.color].filter(Boolean).join(" · ");

                return (
                  <article
                    className="mc-item"
                    key={`${item.id || item.producto_id || title}-${item.size || ""}-${item.color || ""}-${index}`}
                  >
                    <div className="mc-imgbox">
                      {img ? (
                        <img src={img} alt={title} />
                      ) : (
                        <span className="mc-img-fallback">SL</span>
                      )}
                    </div>

                    <div className="mc-info">
                      <div className="mc-item-head">
                        <p className="mc-name">{title}</p>
                        <button
                          className="mc-remove"
                          onClick={() => removeItem(item)}
                          aria-label={`Eliminar ${title}`}
                        >
                          ×
                        </button>
                      </div>

                      <p className="mc-meta">{details || "Producto deportivo"}</p>

                      <div className="mc-bottom-row">
                        <div className="mc-qty" aria-label="Cantidad">
                          <button
                            type="button"
                            disabled={qty <= 1}
                            onClick={() => updateQty(item, Math.max(1, qty - 1))}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span>{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item, qty + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <strong className="mc-price">{money(item.price)}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="mc-foot">
          <div className="mc-total">
            <span>Total estimado</span>
            <strong>{money(total)}</strong>
          </div>

          <div className="mc-actions">
            {items.length > 0 ? (
              <button className="mc-primary" onClick={() => goTo("/carrito")}>
                Ir al carrito
              </button>
            ) : (
              <button className="mc-primary" onClick={() => goTo("/catalogo")}>
                Ver catálogo
              </button>
            )}

            <button className="mc-secondary" onClick={toggleMiniCart}>
              Seguir comprando
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
