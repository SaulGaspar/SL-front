import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const API_URL = "https://sl-back.vercel.app";

export default function Catalogo() {
  const navigate = useNavigate();
  const { addToCart, toggleMiniCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categorias = useMemo(
    () => [...new Set(products.map(p => p.categoria).filter(Boolean))].sort(),
    [products]
  );

  const marcas = useMemo(
    () => [...new Set(products.map(p => p.marca).filter(Boolean))].sort(),
    [products]
  );

  const filtered = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = categoria ? p.categoria === categoria : true;
    const matchMarca = marca ? p.marca === marca : true;
    const matchPrice = p.precio <= maxPrice;
    return matchSearch && matchCategoria && matchMarca && matchPrice;
  });

  const limpiarFiltros = () => {
    setSearch("");
    setCategoria("");
    setMarca("");
    setMaxPrice(5000);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 fw-bold">Catálogo</h2>

      {/* FILTROS */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Buscar</label>
            <input
              className="form-control"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Marca</label>
            <select
              className="form-select"
              value={marca}
              onChange={e => setMarca(e.target.value)}
            >
              <option value="">Todas</option>
              {marcas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio máximo: ${maxPrice}</label>
            <input
              type="range"
              className="form-range"
              min="50"
              max="5000"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* ESTADOS */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status" />
          <p className="mt-2 text-muted">Cargando productos...</p>
        </div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* LISTA */}
      {!loading && !error && (
        <div className="row">
          {filtered.map(p => (
            <div key={p.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
                <div onClick={() => navigate(`/producto/${p.id}`)}>
                  <img
                    src={p.imagen || "https://picsum.photos/seed/default/800/600"}
                    className="card-img-top"
                    alt={p.nombre}
                    style={{ height: 200, objectFit: "cover" }}
                    onError={e => { e.target.src = "https://picsum.photos/seed/default/800/600"; }}
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <div onClick={() => navigate(`/producto/${p.id}`)}>
                    {p.marca && (
                      <p className="text-uppercase text-muted small mb-0" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                        {p.marca}
                      </p>
                    )}
                    <h5 className="card-title fw-bold mb-1">{p.nombre}</h5>
                    <p className="text-muted mb-2">${p.precio}</p>
                    <p className="small text-secondary mb-3">
                      {p.descripcion && p.descripcion.length > 80
                        ? p.descripcion.substring(0, 80) + "..."
                        : p.descripcion}
                    </p>
                    {p.stock_total === 0 && (
                      <span className="badge bg-danger mb-2">Sin stock</span>
                    )}
                  </div>

                  <button
                    className="btn w-100 mt-auto"
                    style={{ backgroundColor: "#0a1a2f", color: "#fff" }}
                    disabled={p.stock_total === 0}
                    onClick={() => {
                      addToCart({
                        id: p.id,
                        title: p.nombre,
                        price: p.precio,
                        img: p.imagen,
                        qty: 1,
                        size: "M",
                        color: "Único"
                      });
                      toggleMiniCart();
                    }}
                  >
                    {p.stock_total === 0 ? "Sin disponibilidad" : "Agregar al carrito"}
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
      )}
    </div>
  );
}