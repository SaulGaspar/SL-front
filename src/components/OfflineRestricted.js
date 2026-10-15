import React from "react";
import { Link } from "react-router-dom";

export default function OfflineRestricted() {
  return <section className="sl-pwa-restricted" role="status">
    <h1>Esta sección necesita conexión</h1>
    <p>Conéctate a internet para acceder a tu cuenta, revisar pedidos o continuar con el pago. Tu carrito permanece guardado en este dispositivo.</p>
    <Link to="/catalogo">Explorar catálogo guardado</Link>
  </section>;
}
