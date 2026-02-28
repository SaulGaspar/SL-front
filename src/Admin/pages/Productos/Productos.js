import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh } from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    activo: 1
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterStatus]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(p => p.categoria === filterCategory);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(p =>
        filterStatus === "active" ? p.activo === 1 : p.activo === 0
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const url = editingProduct
        ? `${API_URL}/api/admin/products/${editingProduct.id}`
        : `${API_URL}/api/admin/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingProduct ? "Producto actualizado" : "Producto creado");
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || "Error al guardar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar producto");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de desactivar este producto?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Producto desactivado");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio,
      categoria: product.categoria || "",
      imagen: product.imagen || "",
      activo: product.activo
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", precio: "", categoria: "", imagen: "", activo: 1 });
    setEditingProduct(null);
  };

  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando productos...</div>;

  return (
    <div className="productos-page">
      <style>{`
        .page-toolbar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
        }
        .toolbar-left { display: flex; gap: 12px; flex: 1; flex-wrap: wrap; }
        .search-box { position: relative; flex: 1; min-width: 250px; max-width: 400px; }
        .search-box input {
          width: 100%; padding: 10px 10px 10px 40px;
          border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;
        }
        .search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1.2rem; }
        .filter-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; min-width: 150px; }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none; padding: 10px 20px; border-radius: 8px;
          font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(102,126,234,0.3); }
        .btn-refresh {
          background: #f7fafc; color: #2d3748; border: 1px solid #e2e8f0;
          padding: 10px; border-radius: 8px; cursor: pointer;
        }
        .btn-refresh:hover { background: #edf2f7; }
        .products-table-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
        .products-table { width: 100%; border-collapse: collapse; }
        .products-table thead { background: #f7fafc; }
        .products-table th {
          padding: 16px; text-align: left; font-size: 0.85rem;
          font-weight: 700; color: #4a5568; text-transform: uppercase;
          letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;
        }
        .products-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; color: #2d3748; }
        .products-table tbody tr:hover { background: #f7fafc; }
        .product-image { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; background: #edf2f7; }
        .product-name { font-weight: 600; color: #1e3a5f; }
        .product-category { background: #edf2f7; padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; color: #4a5568; display: inline-block; }
        .product-price { font-weight: 700; color: #48bb78; font-size: 1.1rem; }
        .stock-badge { padding: 4px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
        .stock-badge.high { background: #c6f6d5; color: #276749; }
        .stock-badge.medium { background: #fef5e7; color: #975a16; }
        .stock-badge.low { background: #fed7d7; color: #9b2c2c; }
        .status-badge { padding: 4px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
        .status-badge.active { background: #c6f6d5; color: #276749; }
        .status-badge.inactive { background: #fed7d7; color: #9b2c2c; }
        .action-buttons { display: flex; gap: 8px; }
        .btn-action { padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; }
        .btn-edit { background: #bee3f8; color: #2c5282; }
        .btn-edit:hover { background: #90cdf4; }
        .btn-delete { background: #fed7d7; color: #9b2c2c; }
        .btn-delete:hover { background: #fc8181; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: white; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .modal-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; color: #1e3a5f; font-size: 1.5rem; }
        .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #718096; padding: 4px; border-radius: 6px; }
        .modal-close:hover { background: #f7fafc; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 0.9rem; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
        .form-group textarea { resize: vertical; min-height: 100px; }
        .modal-footer { padding: 20px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end; }
        .btn-cancel { padding: 10px 24px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-cancel:hover { background: #f7fafc; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(102,126,234,0.3); }
      `}</style>

      <div className="page-header">
        <h2>Productos</h2>
        <p>Gestiona tu catálogo de productos</p>
      </div>

      <div className="page-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-refresh" onClick={fetchProducts}><MdRefresh size={20} /></button>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <MdAdd /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#718096" }}>
                  No se encontraron productos
                </td>
              </tr>
            ) : filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.imagen || "https://via.placeholder.com/50"}
                    alt={product.nombre}
                    className="product-image"
                  />
                </td>
                <td>
                  <div className="product-name">{product.nombre}</div>
                  <div style={{ fontSize: "0.85rem", color: "#718096", marginTop: 4 }}>
                    {product.descripcion?.substring(0, 50)}{product.descripcion?.length > 50 ? "..." : ""}
                  </div>
                </td>
                <td><span className="product-category">{product.categoria || "—"}</span></td>
                <td><span className="product-price">${Number(product.precio).toFixed(2)}</span></td>
                <td>
                  <span className={`stock-badge ${product.stock_total > 50 ? "high" : product.stock_total > 20 ? "medium" : "low"}`}>
                    {product.stock_total} unidades
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.activo ? "active" : "inactive"}`}>
                    {product.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit" onClick={() => openEditModal(product)}>
                      <MdEdit /> Editar
                    </button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(product.id)}>
                      <MdDelete /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Precio *</label>
                  <input type="number" step="0.01" required value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <input type="text" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>URL de Imagen</label>
                  <input type="text" value={formData.imagen} onChange={(e) => setFormData({ ...formData, imagen: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={formData.activo} onChange={(e) => setFormData({ ...formData, activo: Number(e.target.value) })}>
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">{editingProduct ? "Actualizar" : "Crear"} Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}