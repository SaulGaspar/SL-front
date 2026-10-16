export function checkoutItems(cart) {
  const merged = new Map();
  for (const item of cart) {
    const product_id = Number(item.id || item.product_id);
    const cantidad = Number(item.qty || item.cantidad || 1);
    const talla = String(item.size || item.talla || "Único").trim();
    const color = String(item.color || "Único").trim();
    if (!Number.isSafeInteger(product_id) || product_id <= 0 || !Number.isSafeInteger(cantidad) || cantidad <= 0) throw new Error("Revisa las cantidades de tu carrito.");
    const key = JSON.stringify([product_id,talla,color]);
    const previous = merged.get(key);
    merged.set(key,{product_id,cantidad:cantidad+(previous?.cantidad || 0),talla,color});
  }
  return [...merged.values()];
}
