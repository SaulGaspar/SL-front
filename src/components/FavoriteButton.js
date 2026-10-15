import React from "react";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/favorites.css";
export default function FavoriteButton({product,compact=false}) {
  const {favorites,toggle} = useFavorites();
  const selected=favorites.some(item=>String(item.id)===String(product.id));
  return <button type="button" className={`sl-favorite ${compact ? "sl-favorite-compact" : ""}`} aria-label={`${selected ? "Quitar de" : "Guardar en"} favoritos: ${product.nombre}`} aria-pressed={selected} onClick={event=>{event.stopPropagation();toggle(product);}}><i className={`bi bi-heart${selected ? "-fill" : ""}`} aria-hidden="true"/>{!compact && <span>{selected ? "En favoritos" : "Guardar favorito"}</span>}</button>;
}
