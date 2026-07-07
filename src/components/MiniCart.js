import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CSS = `
  .mc-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1090;
    background: rgba(4, 13, 26, .46);
    backdrop-filter: blur(7px);
    display: flex;
    justify-content: flex-end;
    padding: 18px;
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  .mc-panel {
    --mc-ink: #0a1a2f;
    --mc-muted: #6b7788;
    --mc-card: #ffffff;
    --mc-soft: #f4f7fb;
    --mc-line: rgba(10, 26, 47, .1);
    --mc-blue: #244fdb;
    --mc-acid: #bde632;
    width: min(430px, calc(100vw - 36px));
    max-height: calc(100vh - 36px);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--mc-line);
    border-radius: 26px;
    background: var(--mc-card);
    color: var(--mc-ink);
    overflow: hidden;
    box-shadow: 0 28px 80px rgba(0,0,0,.28);
    animation: mc-enter .22s ease both;
  }

  body[data-bs-theme="dark"] .mc-panel {
    --mc-ink: #f3f6fa;
    --mc-muted: #a7b2c0;
    --mc-card: #101d2b;
    --mc-soft: #0b1624;
    --mc-line: rgba(255,255,255,.11);
    --mc-blue: #86a5ff;
  }

  .mc-panel *,
  .mc-panel *::before,
  .mc-panel *::after { box-sizing: border-box; }

  @keyframes mc-enter {
    from { opacity: 0; transform: translateX(18px) scale(.98); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }

  .mc-head {
    position: relative;
    padding: 24px 24px 20px;
    background:
      radial-gradient(circle at 95% -20%, rgba(189,230,50,.42), transparent 9rem),
      linear-gradient(145deg, #08182b, #102b4d);
    color: #fff;
  }

  .mc-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .mc-kicker {
    display: block;
    color: var(--mc-acid);
    font-size: .68rem;
    font-weight: 850;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .mc-title {
    margin: 8px 0 0;
    color: #fff;
    font-size: 1.8rem;
    line-height: 1;
    font-weight: 900;
    letter-spacing: -.045em;
  }

  .mc-close {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 14px;
    background: rgba(255,255,255,.08);
    color: #fff;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease;
  }

  .mc-close:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,.14);
  }

  .mc-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    color: rgba(255,255,255,.7);
    font-size: .85rem;
  }

  .mc-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mc-acid);
  }

  .mc-body {
    flex: 1;
    min-height: 220px;
    overflow-y: auto;
    padding: 12px;
    background: var(--mc-soft);
  }

  .mc-list {
    display: grid;
    gap: 10px;
  }

  .mc-item {
    display: grid;
    grid-template-columns: 86px minmax(0, 1fr);
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--mc-line);
    border-radius: 20px;
    background: var(--mc-card);
  }

  .mc-imgbox {
    width: 86px;
    height: 92px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    background:
      radial-gradient(circle at 30% 20%, rgba(189,230,50,.35), transparent 4rem),
      #eef3fb;
    overflow: hidden;
  }

  body[data-bs-theme="dark"] .mc-imgbox {
    background:
      radial-gradient(circle at 30% 20%, rgba(189,230,50,.18), transparent 4rem),
      rgba(255,255,255,.06);
  }

  .mc-imgbox img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
    display: block;
  }

  .mc-img-fallback {
    color: var(--mc-blue);
    font-size: 1.6rem;
  }

  .mc-info {
    min-width: 0;
    display: grid;
    gap: 8px;
  }

  .mc-item-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 30px;
    gap: 8px;
    align-items: start;
  }

  .mc-name {
    margin: 0;
    color: var(--mc-ink);
    font-size: .92rem;
    font-weight: 850;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mc-remove {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 1px solid var(--mc-line);
    border-radius: 10px;
    background: transparent;
    color: #d13d3d;
    font-weight: 900;
    cursor: pointer;
  }

  .mc-meta {
    margin: 0;
    color: var(--mc-muted);
    font-size: .76rem;
    line-height: 1.35;
  }

  .mc-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .mc-qty {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border: 1px solid var(--mc-line);
    border-radius: 999px;
    background: var(--mc-soft);
  }

  .mc-qty button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 999px;
    background: var(--mc-card);
    color: var(--mc-ink);
    font-weight: 900;
    cursor: pointer;
  }

  .mc-qty button:disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  .mc-qty span {
    min-width: 22px;
    text-align: center;
    color: var(--mc-ink);
    font-size: .82rem;
    font-weight: 850;
  }

  .mc-price {
    color: var(--mc-ink);
    font-size: .93rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .mc-empty {
    height: 100%;
    min-height: 300px;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 24px;
  }

  .mc-empty-card {
    max-width: 280px;
  }

  .mc-empty-icon {
    width: 82px;
    height: 82px;
    display: grid;
    place-items: center;
    margin: 0 auto 18px;
    border-radius: 26px;
    background: var(--mc-card);
    color: var(--mc-blue);
    font-size: 2rem;
    box-shadow: 0 14px 32px rgba(10,26,47,.08);
  }

  .mc-empty h3 {
    margin: 0;
    color: var(--mc-ink);
    font-size: 1.25rem;
    font-weight: 900;
    letter-spacing: -.03em;
  }

  .mc-empty p {
    margin: 10px 0 0;
    color: var(--mc-muted);
    font-size: .88rem;
    line-height: 1.6;
  }

  .mc-foot {
    padding: 18px;
    border-top: 1px solid var(--mc-line);
    background: var(--mc-card);
  }

  .mc-total {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
  }

  .mc-total span:first-child {
    color: var(--mc-muted);
    font-size: .84rem;
    font-weight: 750;
  }

  .mc-total strong {
    color: var(--mc-ink);
    font-size: 1.45rem;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -.04em;
  }

  .mc-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .mc-primary,
  .mc-secondary {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-size: .88rem;
    font-weight: 850;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
  }

  .mc-primary {
    border: 0;
    background: #244fdb;
    color: #fff;
    box-shadow: 0 12px 24px rgba(36,79,219,.22);
  }

  .mc-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 34px rgba(36,79,219,.28);
  }

  .mc-primary:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
  }

  .mc-secondary {
    border: 1px solid var(--mc-line);
    background: transparent;
    color: var(--mc-ink);
  }

  .mc-close:focus-visible,
  .mc-remove:focus-visible,
  .mc-qty button:focus-visible,
  .mc-primary:focus-visible,
  .mc-secondary:focus-visible {
    outline: 3px solid var(--mc-acid);
    outline-offset: 3px;
  }

  @media (max-width: 540px) {
    .mc-backdrop {
      padding: 0;
      align-items: stretch;
    }

    .mc-panel {
      width: 100%;
      max-height: 100dvh;
      height: 100dvh;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      animation-name: mc-mobile-enter;
    }

    @keyframes mc-mobile-enter {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mc-head { padding: 22px 18px 18px; }
    .mc-body { padding: 10px; }
    .mc-item { grid-template-columns: 78px minmax(0, 1fr); padding: 10px; border-radius: 18px; }
    .mc-imgbox { width: 78px; height: 88px; }
    .mc-foot { padding: 14px; }
  }
`;

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
