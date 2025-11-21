import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [showMiniCart, setShowMiniCart] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function addToCart(item) {
    const newCart = [...cart, item];
    saveCart(newCart);
    setShowMiniCart(true);
  }

  function updateQty(item, newQty) {
    if (newQty <= 0) return removeItem(item);

    const updated = cart.map((p) =>
      p === item ? { ...p, qty: newQty } : p
    );
    saveCart(updated);
  }

  function removeItem(item) {
    const updated = cart.filter((p) => p !== item);
    saveCart(updated);
  }

  function toggleMiniCart() {
    setShowMiniCart((prev) => !prev);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        showMiniCart,
        toggleMiniCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
