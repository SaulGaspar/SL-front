import React, { createContext, useContext, useEffect, useState } from "react";
const Context = createContext(null);
export const useFavorites = () => useContext(Context);
export function FavoritesProvider({owner,children}) {
  const key = `sportlike-favorites:${owner}`;
  const [favorites,setFavorites] = useState(() => {
    try {const saved=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(saved) ? saved.filter(item=>item?.id) : [];}catch{return [];}
  });
  const [error,setError] = useState("");
  useEffect(() => {
    try{localStorage.setItem(key,JSON.stringify(favorites));setError("");}catch{setError("El navegador no permitió guardar tus favoritos en este dispositivo.");}
  },[favorites,key]);
  function toggle(product) {
    setFavorites(items=>items.some(item=>String(item.id)===String(product.id)) ? items.filter(item=>String(item.id)!==String(product.id)) : [...items,{id:product.id,nombre:product.nombre,precio:product.precio,imagen:product.imagen,marca:product.marca}]);
  }
  return <Context.Provider value={{favorites,toggle,error}}>{children}</Context.Provider>;
}
