import { API_BASE_URL } from "../../config/api";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const API_URL = API_BASE_URL;
const PENDING_KEY = "sportlike_pending_checkout";
const LAST_ORDER_KEY = "sportlike_last_paid_order";

function readSession(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
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

import CSS from "./Pago.styles";

export default function Pago() {
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
      navigate("/login", { state: { from: "/pago" } });
      return;
    }

    if (!result) {
      navigate("/carrito", { replace: true });
    }
  }, [navigate, result]);

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
          <button className="mp-pay" onClick={() => navigate("/carrito")}>
            Volver al carrito
          </button>
          <button className="mp-back" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mp-page">
      <style>{CSS}</style>
      <section className="mp-card mp-state">
        <div className="mp-state-icon pending"><i className="bi bi-arrow-left-right" /></div>
        <h1>Redirigiendo al carrito</h1>
      </section>
    </main>
  );
}
