import React from "react";
import { AlertTriangle } from "lucide-react";
import ErrorScreen from "./ErrorScreen";

export default function Error400() {
  return (
    <ErrorScreen
      code="400"
      eyebrow="Solicitud incorrecta"
      title="No pudimos procesar la información."
      message="Algunos datos están incompletos o no tienen el formato esperado. Revisa la información e inténtalo nuevamente."
      variant="warning"
      icon={AlertTriangle}
      secondaryHref="/ayuda"
      secondaryLabel="Obtener ayuda"
    />
  );
}
