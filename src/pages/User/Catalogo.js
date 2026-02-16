import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PRODUCTS from "../../components/Products";
import { useCart } from "../../context/CartContext";

export default function Catalogo() {
  const navigate = useNavigate();
  const { addToCart, toggleMiniCart } = useCart(); 

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);

  const types = useMemo(() => [...new Set(PRODUCTS.map(p => p.type))], []);
  const sizes = useMemo(() => [...new Set(PRODUCTS.flatMap(p => p.sizes))], []);
  const colors = useMemo(() => [...new Set(PRODUCTS.flatMap(p => p.colors))], []);

  const filtered = PRODUCTS.filter(p => {
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (type ? p.type === type : true) &&
      (size ? p.sizes.includes(size) : true) &&
      (color ? p.colors.includes(color) : true) &&
      p.price <= maxPrice
    );
  });

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 fw-bold">Catálogo</h2>

      {/* FILTROS */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Buscar</label>
            <input
              className="form-control"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">Todos</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Talla</label>
            <select
              className="form-select"
              value={size}
              onChange={e => setSize(e.target.value)}
            >
              <option value="">Todas</option>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Color</label>
            <select
              className="form-select"
              value={color}
              onChange={e => setColor(e.target.value)}
            >
              <option value="">Todos</option>
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Precio máximo: ${maxPrice}</label>
            <input
              type="range"
              className="form-range"
              min="50"
              max="2000"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="row">
        {filtered.map(p => (
          <div key={p.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
              <div onClick={() => navigate(`/producto/${p.id}`)}>
                <img
                  src={p.img}
                  className="card-img-top"
                  alt={p.title}
                  style={{ height: 200, objectFit: "cover" }}
                />
              </div>

              <div className="card-body d-flex flex-column">
                <div onClick={() => navigate(`/producto/${p.id}`)}>
                  <h5 className="card-title fw-bold">{p.title}</h5>
                  <p className="text-muted mb-2">${p.price}</p>
                  <p className="small text-secondary mb-3">
                    {p.desc.length > 80 ? p.desc.substring(0, 80) + "..." : p.desc}
                  </p>
                </div>

                {/* BOTÓN AGREGAR AL CARRITO */}
                <button
                  className="btn w-100"
                  style={{ backgroundColor: "#0a1a2f", color: "#fff" }}
                  onClick={() => {
                    addToCart({
                      ...p,
                      qty: 1,
                      size: p.sizes[0],
                      color: p.colors[0]
                    });
                    toggleMiniCart();
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-12">
            <div className="text-center p-5 text-muted">
              No se encontraron productos con esos filtros.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
