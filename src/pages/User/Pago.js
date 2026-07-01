import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const API_URL = "https://sl-back.vercel.app";
const PENDING_KEY = "sportlike_pending_checkout";
const LAST_ORDER_KEY = "sportlike_last_paid_order";

const fmtMXN = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value) || 0);

function readSession(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function getPrice(item) {
  return Number(item.precio || item.price || 0);
}

function getQty(item) {
  return Number(item.qty || item.cantidad || 1);
}

function normalizeOrderItems(cart) {
  const merged = new Map();
  for (const item of cart) {
    const productId = Number(item.id || item.product_id);
    const quantity = getQty(item);
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) continue;
    merged.set(productId, (merged.get(productId) || 0) + quantity);
  }
  return [...merged.entries()].map(([product_id, cantidad]) => ({
    product_id,
    cantidad,
  }));
}

const CSS = `
  .mp-page * { box-sizing:border-box; }
  .mp-page { min-height:calc(100vh - 150px); background:#f3f6fa; padding:38px 20px 70px; color:#0b2545; }
  .mp-wrap { width:min(1080px,100%); margin:0 auto; }
  .mp-breadcrumb { display:flex; gap:8px; align-items:center; margin-bottom:20px; font-size:.82rem; color:#8795a8; }
  .mp-breadcrumb button { border:0; padding:0; background:transparent; color:#2468a2; cursor:pointer; font-weight:700; }
  .mp-grid { display:grid; grid-template-columns:minmax(0,1fr) 390px; gap:24px; align-items:start; }
  .mp-card { background:white; border:1px solid #e0e7ef; border-radius:18px; box-shadow:0 12px 36px rgba(13,39,68,.08); }
  .mp-checkout { padding:32px; overflow:hidden; position:relative; }
  .mp-checkout::after { content:""; position:absolute; width:240px; height:240px; border-radius:50%; right:-110px; top:-105px; background:rgba(0,158,227,.07); pointer-events:none; }
  .mp-kicker { display:inline-flex; align-items:center; gap:8px; color:#087db6; background:#eaf8ff; border-radius:999px; padding:6px 11px; font-size:.72rem; font-weight:800; letter-spacing:.6px; }
  .mp-title { margin:17px 0 8px; font-size:1.65rem; font-weight:850; color:#0b2545; }
  .mp-subtitle { margin:0; color:#65758a; line-height:1.65; max-width:610px; }
  .mp-brand { margin:28px 0 24px; min-height:122px; border-radius:16px; padding:24px; color:white; background:linear-gradient(135deg,#009ee3,#0878bd); display:flex; align-items:center; justify-content:space-between; gap:24px; position:relative; overflow:hidden; }
  .mp-brand::after { content:""; width:190px; height:190px; border:28px solid rgba(255,255,255,.1); border-radius:50%; position:absolute; right:-55px; top:-57px; }
  .mp-brand-name { position:relative; z-index:1; }
  .mp-brand-name strong { display:block; font-size:1.55rem; letter-spacing:-.5px; }
  .mp-brand-name span { display:block; opacity:.86; margin-top:4px; font-size:.86rem; }
  .mp-handshake { position:relative; z-index:1; width:62px; height:62px; border-radius:50%; background:white; color:#009ee3; display:grid; place-items:center; font-size:1.65rem; flex-shrink:0; }
  .mp-benefits { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:25px; }
  .mp-benefit { background:#f7f9fc; border:1px solid #e5ebf2; border-radius:11px; padding:13px; color:#53657a; font-size:.78rem; font-weight:650; }
  .mp-benefit i { color:#009ee3; margin-right:6px; }
  .mp-pay { width:100%; border:0; border-radius:11px; padding:14px 18px; background:#009ee3; color:white; font-size:1rem; font-weight:850; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; transition:transform .16s,background .16s; }
  .mp-pay:hover { background:#087db6; transform:translateY(-1px); }
  .mp-pay:disabled { opacity:.55; cursor:not-allowed; transform:none; }
  .mp-back { width:100%; border:1px solid #ccd7e4; border-radius:11px; padding:12px; margin-top:10px; background:white; color:#38516d; font-weight:750; cursor:pointer; }
  .mp-note { display:flex; gap:9px; margin-top:18px; color:#7b8a9d; font-size:.77rem; line-height:1.5; }
  .mp-note i { color:#2f855a; margin-top:1px; }
  .mp-summary { padding:25px; position:sticky; top:22px; }
  .mp-summary h2 { margin:0 0 18px; font-size:1rem; text-transform:uppercase; letter-spacing:.5px; }
  .mp-items { display:flex; flex-direction:column; gap:12px; max-height:330px; overflow:auto; padding-right:3px; }
  .mp-item { display:grid; grid-template-columns:50px minmax(0,1fr) auto; gap:10px; align-items:center; padding-bottom:12px; border-bottom:1px solid #edf1f5; }
  .mp-item img,.mp-item-placeholder { width:50px; height:50px; object-fit:cover; border-radius:9px; background:#eef2f6; }
  .mp-item-placeholder { display:grid; place-items:center; color:#8aa0b7; }
  .mp-item-name { font-size:.84rem; font-weight:750; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mp-item-detail { color:#8a98aa; font-size:.74rem; margin-top:3px; }
  .mp-item-price { color:#1f6b49; font-size:.82rem; font-weight:800; white-space:nowrap; }
  .mp-row { display:flex; justify-content:space-between; gap:15px; margin-top:14px; color:#6b7b8e; font-size:.86rem; }
  .mp-total { border-top:2px solid #e4eaf1; padding-top:15px; margin-top:15px; color:#0b2545; font-weight:800; }
  .mp-total strong { font-size:1.3rem; }
  .mp-alert { border-radius:11px; padding:12px 14px; margin:0 0 18px; font-size:.86rem; font-weight:700; }
  .mp-alert.error { background:#fff4f4; border:1px solid #f4a6a6; color:#a62b2b; }
  .mp-state { width:min(560px,100%); margin:25px auto; padding:42px; text-align:center; }
  .mp-state-icon { width:74px; height:74px; margin:0 auto 18px; border-radius:50%; display:grid; place-items:center; font-size:2rem; }
  .mp-state-icon.success { background:#d9f7e7; color:#24744e; }
  .mp-state-icon.pending { background:#fff4cc; color:#976500; }
  .mp-state-icon.failure { background:#ffe0e0; color:#ad2f2f; }
  .mp-state h1 { font-size:1.55rem; margin:0 0 9px; }
  .mp-state p { color:#6e7d90; line-height:1.65; margin:0 0 22px; }
  .mp-reference { display:inline-block; border-radius:999px; background:#edf5ff; color:#235987; padding:7px 14px; font-size:.8rem; font-weight:750; margin-bottom:20px; }
  .mp-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.45); border-top-color:white; border-radius:50%; animation:mp-spin .75s linear infinite; }
  @keyframes mp-spin { to { transform:rotate(360deg); } }
  @media(max-width:860px){ .mp-grid{grid-template-columns:1fr;} .mp-summary{position:static;} }
  @media(max-width:560px){ .mp-page{padding:22px 12px 50px;} .mp-checkout,.mp-summary,.mp-state{padding:23px 18px;} .mp-benefits{grid-template-columns:1fr;} .mp-brand{min-height:110px;} }
`;

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart } = useCart();
  const confirmingRef = useRef(false);

  const [pendingCheckout, setPendingCheckout] = useState(() => readSession(PENDING_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const result = searchParams.get("mp_result");
  const paymentId =
    searchParams.get("payment_id") || searchParams.get("collection_id");
  const paymentStatus =
    searchParams.get("status") || searchParams.get("collection_status");

  const checkoutCart =
    cart.length > 0 ? cart : pendingCheckout?.displayItems || [];
  const productsSubtotal = checkoutCart.reduce(
    (sum, item) => sum + getPrice(item) * getQty(item),
    0
  );
  const shipping = productsSubtotal >= 1500 ? 0 : checkoutCart.length ? 75 : 0;
  const calculatedTotal = productsSubtotal + shipping;
  const total =
    Number(location.state?.total) ||
    Number(pendingCheckout?.total) ||
    calculatedTotal;
  const addressId =
    location.state?.direccion_id ||
    location.state?.direccion?.id ||
    pendingCheckout?.direccion_id;

  const orderItems = useMemo(
    () =>
      pendingCheckout?.items?.length
        ? pendingCheckout.items
        : normalizeOrderItems(cart),
    [cart, pendingCheckout]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/pago", ...location.state } });
      return;
    }

    if (!result && !addressId) {
      navigate("/carrito", { replace: true });
    }
  }, [addressId, location.state, navigate, result]);

  useEffect(() => {
    if (result !== "success" || paymentStatus !== "approved" || !paymentId) return;
    if (confirmingRef.current) return;

    const lastOrder = readSession(LAST_ORDER_KEY);
    if (lastOrder?.paymentId && String(lastOrder.paymentId) === String(paymentId)) {
      setOrder(lastOrder);
      return;
    }

    if (!pendingCheckout?.direccion_id || !orderItems.length) {
      setError(
        "El pago fue aprobado, pero no encontramos los datos locales del carrito. Consulta el pago con soporte antes de volver a intentarlo."
      );
      return;
    }

    confirmingRef.current = true;
    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/payments/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        payment_id: paymentId,
        direccion_id: pendingCheckout.direccion_id,
        items: orderItems,
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "No se pudo generar el pedido");
        return data;
      })
      .then((data) => {
        const completed = { ...data, paymentId };
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(completed));
        sessionStorage.removeItem(PENDING_KEY);
        setPendingCheckout(null);
        setOrder(completed);
        clearCart();
      })
      .catch((requestError) => {
        setError(requestError.message);
        confirmingRef.current = false;
      })
      .finally(() => setLoading(false));
  }, [
    clearCart,
    orderItems,
    paymentId,
    paymentStatus,
    pendingCheckout,
    result,
  ]);

  const startCheckout = async () => {
    if (!addressId) {
      navigate("/carrito");
      return;
    }
    if (!cart.length || !orderItems.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/payments/preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          direccion_id: addressId,
          items: orderItems,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "No se pudo iniciar Mercado Pago");
      }
      if (!data.checkout_url) {
        throw new Error("Mercado Pago no devolvió una URL de pago");
      }

      const pending = {
        direccion_id: addressId,
        items: orderItems,
        displayItems: cart,
        total: data.total,
        preference_id: data.preference_id,
      };
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      sessionStorage.removeItem(LAST_ORDER_KEY);
      setPendingCheckout(pending);
      window.location.assign(data.checkout_url);
    } catch (requestError) {
      setError(requestError.message || "No se pudo iniciar el pago");
      setLoading(false);
    }
  };

  if (loading && result === "success") {
    return (
      <main className="mp-page">
        <style>{CSS}</style>
        <section className="mp-card mp-state">
          <div className="mp-state-icon pending">
            <i className="bi bi-hourglass-split" />
          </div>
          <h1>Confirmando tu pago</h1>
          <p>Estamos verificando la operación con Mercado Pago y creando tu pedido.</p>
          <button className="mp-pay" disabled>
            <span className="mp-spinner" /> Verificando...
          </button>
        </section>
      </main>
    );
  }

  if (order) {
    return (
      <main className="mp-page">
        <style>{CSS}</style>
        <section className="mp-card mp-state">
          <div className="mp-state-icon success">
            <i className="bi bi-check-lg" />
          </div>
          <h1>¡Pago aprobado y pedido confirmado!</h1>
          <p>
            Mercado Pago confirmó la operación. Ya puedes consultar el seguimiento
            desde la sección Mis pedidos.
          </p>
          <span className="mp-reference">Referencia: {order.pedidoRef}</span>
          <button className="mp-pay" onClick={() => navigate("/orders")}>
            Ver mis pedidos
          </button>
          <button className="mp-back" onClick={() => navigate("/")}>
            Seguir comprando
          </button>
        </section>
      </main>
    );
  }

  if (result === "success" && error) {
    return (
      <main className="mp-page">
        <style>{CSS}</style>
        <section className="mp-card mp-state">
          <div className="mp-state-icon pending">
            <i className="bi bi-exclamation-lg" />
          </div>
          <h1>Pago recibido; pedido en revisión</h1>
          <p>
            Mercado Pago informó una aprobación, pero no pudimos terminar el registro
            del pedido. No vuelvas a pagar. Conserva el identificador y comunícate con
            SportLike.
          </p>
          <span className="mp-reference">Pago: {paymentId || "sin referencia"}</span>
          <div className="mp-alert error">{error}</div>
          <button className="mp-pay" onClick={() => navigate("/orders")}>
            Consultar mis pedidos
          </button>
          <button className="mp-back" onClick={() => navigate("/contacto")}>
            Contactar a SportLike
          </button>
        </section>
      </main>
    );
  }

  if (result === "pending" || paymentStatus === "pending") {
    return (
      <main className="mp-page">
        <style>{CSS}</style>
        <section className="mp-card mp-state">
          <div className="mp-state-icon pending">
            <i className="bi bi-clock-history" />
          </div>
          <h1>Pago pendiente</h1>
          <p>
            Mercado Pago está esperando la acreditación. Si elegiste un medio
            offline, sigue las instrucciones del comprobante.
          </p>
          <button className="mp-pay" onClick={() => navigate("/orders")}>
            Consultar mis pedidos
          </button>
          <button className="mp-back" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  if (result === "failure" || (result && paymentStatus === "rejected")) {
    return (
      <main className="mp-page">
        <style>{CSS}</style>
        <section className="mp-card mp-state">
          <div className="mp-state-icon failure">
            <i className="bi bi-x-lg" />
          </div>
          <h1>No se completó el pago</h1>
          <p>
            Mercado Pago rechazó o canceló la operación. No se creó ningún pedido
            ni se descontó inventario.
          </p>
          <button className="mp-pay" onClick={() => navigate("/pago", { state: location.state })}>
            Intentar nuevamente
          </button>
          <button className="mp-back" onClick={() => navigate("/carrito")}>
            Volver al carrito
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mp-page">
      <style>{CSS}</style>
      <div className="mp-wrap">
        <nav className="mp-breadcrumb">
          <button onClick={() => navigate("/")}>Inicio</button>
          <span>/</span>
          <button onClick={() => navigate("/carrito")}>Carrito</button>
          <span>/</span>
          <strong>Pago</strong>
        </nav>

        <div className="mp-grid">
          <section className="mp-card mp-checkout">
            <span className="mp-kicker">
              <i className="bi bi-shield-check" /> CHECKOUT PRO
            </span>
            <h1 className="mp-title">Paga de forma segura con Mercado Pago</h1>
            <p className="mp-subtitle">
              Continuarás en el entorno protegido de Mercado Pago para elegir tarjeta,
              saldo disponible u otros medios habilitados. SportLike no almacena los
              datos de tu tarjeta.
            </p>

            <div className="mp-brand">
              <div className="mp-brand-name">
                <strong>Mercado Pago</strong>
                <span>Pago protegido y confirmación automática</span>
              </div>
              <div className="mp-handshake">
                <i className="bi bi-hand-thumbs-up-fill" />
              </div>
            </div>

            <div className="mp-benefits">
              <div className="mp-benefit">
                <i className="bi bi-lock-fill" /> Datos protegidos
              </div>
              <div className="mp-benefit">
                <i className="bi bi-credit-card" /> Diversos medios
              </div>
              <div className="mp-benefit">
                <i className="bi bi-arrow-return-left" /> Regreso automático
              </div>
            </div>

            {error && <div className="mp-alert error">{error}</div>}

            <button
              className="mp-pay"
              onClick={startCheckout}
              disabled={loading || !checkoutCart.length}
            >
              {loading ? (
                <>
                  <span className="mp-spinner" /> Conectando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-up-right" />
                  Pagar {fmtMXN(total)} con Mercado Pago
                </>
              )}
            </button>
            <button className="mp-back" onClick={() => navigate("/carrito")}>
              Volver al carrito
            </button>

            <div className="mp-note">
              <i className="bi bi-info-circle-fill" />
              <span>
                El pedido se crea y el inventario se descuenta únicamente después de
                que el backend comprueba que Mercado Pago aprobó el pago.
              </span>
            </div>
          </section>

          <aside className="mp-card mp-summary">
            <h2>Resumen del pedido</h2>
            <div className="mp-items">
              {checkoutCart.map((item, index) => (
                <article className="mp-item" key={`${item.id || item.product_id}-${index}`}>
                  {item.imagen || item.img ? (
                    <img
                      src={item.imagen || item.img}
                      alt={item.nombre || item.title || "Producto"}
                    />
                  ) : (
                    <div className="mp-item-placeholder">
                      <i className="bi bi-bag" />
                    </div>
                  )}
                  <div>
                    <div className="mp-item-name">
                      {item.nombre || item.title || item.name || "Producto"}
                    </div>
                    <div className="mp-item-detail">
                      {getQty(item)} × {fmtMXN(getPrice(item))}
                      {(item.talla || item.size) && ` · ${item.talla || item.size}`}
                      {item.color && ` · ${item.color}`}
                    </div>
                  </div>
                  <div className="mp-item-price">
                    {fmtMXN(getPrice(item) * getQty(item))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mp-row">
              <span>Subtotal</span>
              <strong>{fmtMXN(productsSubtotal)}</strong>
            </div>
            <div className="mp-row">
              <span>Envío</span>
              <strong>{shipping === 0 ? "Gratis" : fmtMXN(shipping)}</strong>
            </div>
            <div className="mp-row mp-total">
              <span>Total</span>
              <strong>{fmtMXN(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
