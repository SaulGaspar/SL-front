import React from "react";
import { ServerCrash } from "lucide-react";
import ErrorScreen from "./ErrorScreen";

export default function Error500() {
  return (
    <ErrorScreen
      code="500"
      eyebrow="Error del servidor"
      title="Algo salió mal de nuestro lado."
      message="No pudimos completar la operación en este momento. Inténtalo nuevamente dentro de unos minutos."
      variant="danger"
      icon={ServerCrash}
      secondaryHref="/contacto"
      secondaryLabel="Contactar soporte"
    />
  );
}
