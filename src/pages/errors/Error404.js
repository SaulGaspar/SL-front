import React from "react";
import { Compass } from "lucide-react";
import ErrorScreen from "./ErrorScreen";

export default function Error404() {
  return (
    <ErrorScreen
      code="404"
      eyebrow="Página no encontrada"
      title="Esta ruta se perdió en el camino."
      message="La página que buscas no existe, cambió de dirección o ya no se encuentra disponible."
      icon={Compass}
      secondaryHref="/catalogo"
      secondaryLabel="Explorar catálogo"
    />
  );
}
