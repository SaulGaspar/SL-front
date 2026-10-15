import React from "react";

export default function CachedCatalogNotice({ savedAt }) {
  if (!savedAt) return null;
  const date = new Date(savedAt);
  return <div className="sl-pwa-cached" role="status">
    Estás viendo una copia guardada{Number.isNaN(date.getTime()) ? "" : ` el ${date.toLocaleString("es-MX")}`}.
    {" "}Los precios y la disponibilidad pueden haber cambiado. Se confirmarán al conectarte.
  </div>;
}
