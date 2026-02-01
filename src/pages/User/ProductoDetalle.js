import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PRODUCTS from "../../components/Products";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pid = Number(id);
  const product = PRODUCTS.find((p) => p.id === pid);

  // UI states
  const [mainImg, setMainImg] = useState(product ? product.img : "");
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : "");
  const [selectedColor, setSelectedColor] = useState(product ? product.colors[0] : "");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (product) {
      setMainImg(product.img);
      setSelectedSize(product.sizes?.[0] ?? "");
      setSelectedColor(product.colors?.[0] ?? "");
      setQty(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Producto no encontrado.
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
          <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = {
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      qty: qty,
      title: product.title,
      price: product.price,
      img: product.img
    };
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`${product.title} agregado al carrito`);
  }

  function showToast(message) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="container my-5">
      <style>{`
        .pd-breadcrumb { font-size: 0.95rem; color: #6c757d; }
        .pd-title { font-size: 1.9rem; font-weight: 700; margin-bottom: 0.25rem; }
        .pd-price { font-size: 1.6rem; color: #0a1a2f; font-weight:700; }
        .pd-cta { background-color: #0a1a2f; color: #fff; border-radius: 6px; padding: 12px 18px; border: none; }
        .pd-cta:hover { background-color: #07121b; color: #fff; }
        .pd-small { color: #6c757d; }
        .pd-chip { background: #f6f7f9; border-radius: 6px; padding: 6px 10px; font-size: 0.9rem; }
        .thumbnail { height: 72px; width: 72px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; }
        .thumbnail.active { border-color: #0a1a2f; }
        .related-card { transition: transform .18s ease, box-shadow .18s ease; }
        .related-card:hover { transform: translateY(-6px); box-shadow: 0 8px 24px rgba(10,26,47,0.12); }
        .specs-list li { margin-bottom: 8px; }
      `}</style>

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/catalogo">Catálogo</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* IMAGEN */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="p-3">
              <img src={mainImg} alt={product.title} className="img-fluid rounded" style={{ maxHeight: 560, width: "100%", objectFit: "cover" }} />
            </div>

            {/* miniaturas */}
            <div className="d-flex gap-2 p-3 flex-wrap">
              {[product.img, ...(product.extraImgs || [])].slice(0,4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className={`thumbnail ${mainImg === src ? "active" : ""}`}
                  onClick={() => setMainImg(src)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="col-lg-6">
          <h2 className="pd-title">{product.title}</h2>

          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="pd-price">${product.price}</div>
            <div className="pd-chip">En stock</div>
          </div>

          <p className="pd-small mb-4">{product.desc}</p>

          {/* Selecciones */}
          <div className="d-flex flex-column gap-3 mb-3">
            {/* Tallas */}
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <div style={{ minWidth: 80 }} className="small text-muted">Talla</div>
              <div className="d-flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`btn btn-outline-secondary ${selectedSize === s ? "active" : ""}`}
                    style={{ borderRadius: 8, minWidth: 56 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <div style={{ minWidth: 80 }} className="small text-muted">Color</div>
              <div className="d-flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`btn ${selectedColor === c ? "btn-dark" : "btn-outline-secondary"}`}
                    style={{ borderRadius: 8 }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="d-flex gap-2 align-items-center">
              <div style={{ minWidth: 80 }} className="small text-muted">Cantidad</div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                  style={{ width: 72 }}
                  className="form-control"
                />
                <button className="btn btn-outline-secondary" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto">
            <div className="d-flex gap-3 flex-column flex-sm-row">
              <button className="pd-cta w-100" onClick={addToCart}>
                Agregar al carrito
              </button>

              <button className="btn btn-outline-secondary w-100" onClick={() => navigate(-1)}>
                Volver
              </button>
            </div>

            <div className="mt-3 pd-small">
              <strong>Envío:</strong> Entrega en 2-5 días hábiles. <br/>
              <strong>Garantía:</strong> 30 días por defectos de fábrica.
            </div>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="row mt-5 g-4">
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Beneficios principales</h5>
            <ul className="list-unstyled">
              <li className="mb-2">✅ Material de alta calidad para máximo rendimiento.</li>
              <li className="mb-2">✅ Comodidad superior en cualquier actividad deportiva.</li>
              <li className="mb-2">✅ Durabilidad probada bajo uso intenso.</li>
            </ul>
          </div>
        </div>

        {/* Especificaciones */}
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Especificaciones</h5>
            <ul className="specs-list" style={{ paddingLeft: 18 }}>
              <li><strong>Peso:</strong> {product.weight || "Producto ligero"}</li>
              <li><strong>Material:</strong> {product.material || "Mezcla sintética deportiva"}</li>
              <li><strong>Origen:</strong> {product.origin || "Importado"}</li>
              <li><strong>Cuidados:</strong> Lavar a máquina en ciclo suave.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4>También te puede interesar</h4>
          <div className="row g-3 mt-2">
            {related.map((r) => (
              <div key={r.id} className="col-sm-6 col-md-3">
                <div
                  className="card related-card h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/producto/${r.id}`)}
                >
                  <img src={r.img} className="card-img-top" style={{ height: 150, objectFit: "cover" }} />
                  <div className="card-body">
                    <h6 className="mb-1">{r.title}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">${r.price}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 1050,
          minWidth: 240
        }}>
          <div className="toast show shadow" style={{ display: "block" }}>
            <div className="toast-body">
              {toast.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
