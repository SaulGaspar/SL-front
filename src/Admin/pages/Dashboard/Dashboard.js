import React, { useState, useEffect } from "react";
import {
  MdTrendingUp, MdTrendingDown, MdShoppingCart, MdPeople, MdInventory,
  MdAttachMoney, MdWarning, MdRefresh, MdStore, MdCheckCircle,
  MdCancel, MdAccessTime, MdLocalShipping, MdBarChart,
} from "react-icons/md";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const BASE = "https://sl-back.vercel.app/api/admin";

const fmt = (v) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v || 0);

const fmtNum = (v) => Number(v || 0).toLocaleString("es-MX");

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [orderStats, setOrderStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [invStats, setInvStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [salesTimeline, setSalesTimeline] = useState([]);
  const [branchRanking, setBranchRanking] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [filters, setFilters] = useState({ from: "", to: "", branch: "all" });

  useEffect(() => { fetchAll(); }, []);

  const apiFetch = async (url) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sin token de autenticación");
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) throw new Error("Sesión expirada");
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  };

  // Versión segura: retorna null si el endpoint falla, no rompe el resto
  const apiFetchSafe = async (url) => {
    try { return await apiFetch(url); }
    catch (e) { console.warn(`⚠️ Endpoint falló (se omite): ${url} —`, e.message); return null; }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sin token de autenticación");

      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.branch !== "all") params.append("branch", filters.branch);

      // Promise.allSettled: todos se ejecutan aunque alguno falle
      const [dashboard, orders, users, inv, products, lowStock, recent] = await Promise.all([
        apiFetchSafe(`${BASE}/dashboard?${params}`),
        apiFetchSafe(`${BASE}/orders/stats/summary`),
        apiFetchSafe(`${BASE}/users/stats/summary`),
        apiFetchSafe(`${BASE}/inventory/stats`),
        apiFetchSafe(`${BASE}/products/stats/summary`),
        apiFetchSafe(`${BASE}/inventory?low_stock=true`),
        apiFetchSafe(`${BASE}/orders`),   // sin ?limit=5, lo limitamos en el front
      ]);

      if (dashboard) {
        setSalesTimeline(dashboard.salesTimeline || []);
        setBranchRanking(dashboard.branchRanking || []);
        setTopProducts(dashboard.topProducts || []);
      }
      if (orders)   setOrderStats(orders.resumen || {});
      if (users)    setUserStats(users.resumen || {});
      if (inv)      setInvStats(inv.general || {});
      if (products) setProductStats(products);
      if (lowStock) setLowStockItems((Array.isArray(lowStock) ? lowStock : []).slice(0, 6));
      if (recent)   setRecentOrders((Array.isArray(recent) ? recent : []).slice(0, 6));

      // Si el endpoint principal del dashboard falló, es un error real
      if (!dashboard) setError("No se pudo cargar el dashboard principal. Revisa los logs del servidor.");
    } catch (err) {
      setError(err.message || "Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchAll();

  // ── Loading ────────────────────────────────────────
  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner} />
      <p style={{ color: "#718096", marginTop: 16 }}>Cargando dashboard...</p>
    </div>
  );

  // ── Error ──────────────────────────────────────────
  if (error) return (
    <div style={S.errorBox}>
      <MdWarning size={36} color="#e53e3e" />
      <h3 style={{ color: "#e53e3e", margin: "10px 0 6px" }}>Error al cargar</h3>
      <p style={{ color: "#718096", marginBottom: 18 }}>{error}</p>
      <button style={S.btnPrimary} onClick={fetchAll}>Reintentar</button>
    </div>
  );

  // Tu BD usa columna 'status' (no 'estado')
  const statusColor = { pendiente: "#f6ad55", procesando: "#63b3ed", enviado: "#76e4f7", entregado: "#68d391", cancelado: "#fc8181" };
  const statusIcon  = { pendiente: <MdAccessTime />, procesando: <MdRefresh />, enviado: <MdLocalShipping />, entregado: <MdCheckCircle />, cancelado: <MdCancel /> };

  return (
    <div>
      <style>{CSS}</style>

      {/* Header */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Resumen general de SportLike</p>
      </div>

      {/* Filtros */}
      <div className="db-filters">
        <div className="db-filter-group">
          <label>Desde</label>
          <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} />
        </div>
        <div className="db-filter-group">
          <label>Hasta</label>
          <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} />
        </div>
        <div className="db-filter-group">
          <label>Sucursal</label>
          <select value={filters.branch} onChange={e => setFilters({ ...filters, branch: e.target.value })}>
            <option value="all">Todas</option>
            {branchRanking.map(b => <option key={b.sucursal} value={b.sucursal}>{b.sucursal}</option>)}
          </select>
        </div>
        <button className="db-btn-apply" onClick={handleFilter}>
          <MdRefresh size={16} /> Actualizar
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="db-kpi-grid">
        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
            <MdAttachMoney size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Ingresos totales</span>
            <span className="db-kpi-value">{fmt(orderStats?.ingresos_totales)}</span>
            <span className="db-kpi-sub">Ticket promedio: {fmt(orderStats?.ticket_promedio)}</span>
          </div>
        </div>

        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#f093fb,#f5576c)" }}>
            <MdShoppingCart size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Órdenes totales</span>
            <span className="db-kpi-value">{fmtNum(orderStats?.total_ordenes)}</span>
            <span className="db-kpi-sub">
              <span style={{ color: "#f6ad55" }}>{orderStats?.pendientes || 0} pendientes</span>
              {" · "}
              <span style={{ color: "#68d391" }}>{orderStats?.entregadas || 0} entregadas</span>
            </span>
          </div>
        </div>

        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}>
            <MdPeople size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Usuarios</span>
            <span className="db-kpi-value">{fmtNum(userStats?.total_usuarios)}</span>
            <span className="db-kpi-sub">
              <span style={{ color: "#68d391" }}>{userStats?.verificados || 0} verificados</span>
              {" · "}
              <span style={{ color: "#fc8181" }}>{userStats?.bloqueados || 0} bloqueados</span>
            </span>
          </div>
        </div>

        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}>
            <MdInventory size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Inventario</span>
            <span className="db-kpi-value">{fmtNum(invStats?.stock_total)} uds.</span>
            <span className="db-kpi-sub">
              Valor: {fmt(invStats?.valor_inventario)}
            </span>
          </div>
        </div>

        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#fa8231,#f7b731)" }}>
            <MdBarChart size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Productos</span>
            <span className="db-kpi-value">{fmtNum(productStats?.total_productos)}</span>
            <span className="db-kpi-sub">
              <span style={{ color: "#68d391" }}>{productStats?.activos || 0} activos</span>
              {" · "}
              <span style={{ color: "#a0aec0" }}>{productStats?.inactivos || 0} inactivos</span>
            </span>
          </div>
        </div>

        <div className="db-kpi-card" style={{ borderLeft: invStats?.productos_bajo_stock > 0 ? "4px solid #f6ad55" : "4px solid #e2e8f0" }}>
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#f6ad55,#e53e3e)" }}>
            <MdWarning size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Alertas de stock</span>
            <span className="db-kpi-value" style={{ color: invStats?.productos_sin_stock > 0 ? "#e53e3e" : "#1e3a5f" }}>
              {Number(invStats?.productos_sin_stock || 0) + Number(invStats?.productos_bajo_stock || 0)}
            </span>
            <span className="db-kpi-sub">
              <span style={{ color: "#e53e3e" }}>{invStats?.productos_sin_stock || 0} sin stock</span>
              {" · "}
              <span style={{ color: "#d69e2e" }}>{invStats?.productos_bajo_stock || 0} bajo mínimo</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Estado de órdenes ── */}
      <div className="db-section-title">Estado de órdenes</div>
      <div className="db-order-status-row">
        {[
          { key: "pendientes",  label: "Pendientes",  color: "#f6ad55" },
          { key: "procesando", label: "Procesando",  color: "#63b3ed" },
          { key: "enviado",    label: "Enviadas",    color: "#76e4f7" },
          { key: "entregadas", label: "Entregadas",  color: "#68d391" },
          { key: "canceladas", label: "Canceladas",  color: "#fc8181" },
        ].map(({ key, label, color }) => {
          const val = orderStats?.[key] || 0;
          const total = orderStats?.total_ordenes || 1;
          const pct = Math.round((val / total) * 100);
          return (
            <div className="db-status-card" key={key}>
              <div className="db-status-top">
                <span style={{ color, fontSize: "1.4rem" }}>{statusIcon[key] || statusIcon["pendiente"]}</span>
                <span className="db-status-count" style={{ color }}>{val}</span>
              </div>
              <div className="db-status-label">{label}</div>
              <div className="db-status-bar-track">
                <div className="db-status-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="db-status-pct">{pct}%</div>
            </div>
          );
        })}
      </div>

      {/* ── Gráficas ── */}
      <div className="db-charts-grid">
        <div className="db-card">
          <div className="db-card-title"><MdTrendingUp /> Ventas por día</div>
          {salesTimeline.length === 0
            ? <div className="db-empty">Sin datos para el período</div>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#a0aec0" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#a0aec0" }} />
                  <Tooltip
                    formatter={(v) => [fmt(v), "Ventas"]}
                    contentStyle={{ background: "white", border: "none", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#667eea" strokeWidth={2.5} dot={{ r: 4, fill: "#667eea" }} />
                </LineChart>
              </ResponsiveContainer>
            )
          }
        </div>

        <div className="db-card">
          <div className="db-card-title"><MdStore /> Ingresos por sucursal</div>
          {branchRanking.length === 0
            ? <div className="db-empty">Sin datos de sucursales</div>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={branchRanking}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="sucursal" tick={{ fontSize: 11, fill: "#a0aec0" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#a0aec0" }} />
                  <Tooltip
                    formatter={(v) => [fmt(v), "Ingresos"]}
                    contentStyle={{ background: "white", border: "none", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                  />
                  <Bar dataKey="ingresos" fill="#667eea" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* ── Bottom row: Bajo stock + Top productos + Órdenes recientes ── */}
      <div className="db-bottom-grid">

        {/* Productos con stock bajo */}
        <div className="db-card">
          <div className="db-card-title" style={{ color: lowStockItems.length > 0 ? "#c05621" : undefined }}>
            <MdWarning style={{ color: "#f6ad55" }} /> Alertas de inventario
            {lowStockItems.length > 0 && (
              <span style={{ marginLeft: "auto", background: "#fed7d7", color: "#9b2c2c", padding: "2px 10px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700 }}>
                {lowStockItems.length} alertas
              </span>
            )}
          </div>
          {lowStockItems.length === 0 ? (
            <div className="db-empty" style={{ color: "#68d391" }}>
              <MdCheckCircle size={32} style={{ marginBottom: 8 }} />
              <div>Todo el inventario está bien</div>
            </div>
          ) : (
            <div className="db-stock-list">
              {lowStockItems.map((item) => {
                const sinStock = item.stock === 0;
                return (
                  <div className="db-stock-row" key={item.id}>
                    <div className="db-stock-info">
                      <div className="db-stock-name">{item.producto}</div>
                      <div className="db-stock-branch">{item.sucursal}</div>
                    </div>
                    <div className="db-stock-right">
                      <span className="db-stock-badge" style={{
                        background: sinStock ? "#fed7d7" : "#fef5e7",
                        color: sinStock ? "#9b2c2c" : "#975a16"
                      }}>
                        {sinStock ? "Sin stock" : `${item.stock} / mín ${item.min_stock}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="db-card">
          <div className="db-card-title"><MdBarChart /> Top productos</div>
          {topProducts.length === 0
            ? <div className="db-empty">Sin datos</div>
            : (
              <div className="db-top-list">
                {topProducts.slice(0, 6).map((p, i) => (
                  <div className="db-top-row" key={i}>
                    <div className={`db-top-rank rank-${i < 3 ? i : "n"}`}>{i + 1}</div>
                    <div className="db-top-info">
                      <div className="db-top-name">{p.nombre}</div>
                      <div className="db-top-sub">{fmtNum(p.vendidos)} uds.</div>
                    </div>
                    <div className="db-top-val">{fmt(p.ingresos)}</div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Órdenes recientes */}
        <div className="db-card">
          <div className="db-card-title"><MdShoppingCart /> Órdenes recientes</div>
          {recentOrders.length === 0
            ? <div className="db-empty">Sin órdenes</div>
            : (
              <div className="db-orders-list">
                {recentOrders.map((o) => (
                  <div className="db-order-row" key={o.id}>
                    <div className="db-order-info">
                      <div className="db-order-name">{o.nombre} {o.apellidoP}</div>
                      <div className="db-order-date">{o.sucursal} · #{o.id}</div>
                    </div>
                    <div className="db-order-right">
                      <div className="db-order-total">{fmt(o.total)}</div>
                      <span className="db-order-badge" style={{
                        background: (statusColor[o.status] || "#e2e8f0") + "33",
                        color: statusColor[o.status] || "#718096",
                        border: `1px solid ${statusColor[o.status] || "#e2e8f0"}44`,
                      }}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* ── Usuarios resumen ── */}
      <div className="db-section-title">Resumen de usuarios</div>
      <div className="db-users-row">
        {[
          { label: "Total usuarios",    val: userStats?.total_usuarios, color: "#667eea", icon: <MdPeople /> },
          { label: "Clientes",          val: userStats?.clientes,       color: "#48bb78", icon: <MdPeople /> },
          { label: "Administradores",   val: userStats?.admins,         color: "#764ba2", icon: <MdPeople /> },
          { label: "Verificados",       val: userStats?.verificados,    color: "#4facfe", icon: <MdCheckCircle /> },
          { label: "Sin verificar",     val: userStats?.sin_verificar,  color: "#f6ad55", icon: <MdWarning /> },
          { label: "Bloqueados",        val: userStats?.bloqueados,     color: "#fc8181", icon: <MdCancel /> },
        ].map(({ label, val, color, icon }) => (
          <div className="db-user-stat" key={label}>
            <span style={{ color, fontSize: "1.4rem" }}>{icon}</span>
            <span className="db-user-stat-val" style={{ color }}>{fmtNum(val)}</span>
            <span className="db-user-stat-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inline styles (elementos dinámicos) ──────────────────────────────────────
const S = {
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 },
  spinner: { width: 48, height: 48, border: "4px solid #e2e8f0", borderTop: "4px solid #667eea", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  errorBox: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 12, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 440, margin: "48px auto", textAlign: "center" },
  btnPrimary: { background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600 },
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }

  .db-filters {
    background: white; padding: 18px 20px; border-radius: 12px; margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;
  }
  .db-filter-group { display: flex; flex-direction: column; gap: 5px; }
  .db-filter-group label { font-size: 0.8rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-filter-group input, .db-filter-group select {
    padding: 9px 13px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; min-width: 150px;
  }
  .db-filter-group input:focus, .db-filter-group select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .db-btn-apply {
    background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;
    padding: 9px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;
    font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px;
  }
  .db-btn-apply:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(102,126,234,0.3); }

  /* KPI */
  .db-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .db-kpi-card {
    background: white; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; align-items: center; gap: 16px; transition: all 0.25s ease; border-left: 4px solid transparent;
  }
  .db-kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  .db-kpi-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
  .db-kpi-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .db-kpi-label { font-size: 0.78rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-kpi-value { font-size: 1.6rem; font-weight: 700; color: #1e3a5f; line-height: 1.1; }
  .db-kpi-sub { font-size: 0.78rem; color: #a0aec0; margin-top: 2px; }

  /* Estado órdenes */
  .db-section-title { font-size: 0.85rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; margin-top: 4px; }
  .db-order-status-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .db-status-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .db-status-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .db-status-count { font-size: 1.6rem; font-weight: 700; }
  .db-status-label { font-size: 0.8rem; color: #718096; margin-bottom: 8px; }
  .db-status-bar-track { height: 4px; background: #f0f4f8; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
  .db-status-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
  .db-status-pct { font-size: 0.72rem; color: #a0aec0; }

  /* Charts */
  .db-charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 20px; margin-bottom: 20px; }
  .db-card { background: white; border-radius: 14px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .db-card-title { font-size: 0.95rem; font-weight: 700; color: #1e3a5f; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .db-card-title svg { color: #667eea; }
  .db-empty { text-align: center; color: #a0aec0; padding: 32px 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }

  /* Bottom 3 cols */
  .db-bottom-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px; }

  /* Stock bajo */
  .db-stock-list { display: flex; flex-direction: column; gap: 10px; }
  .db-stock-row { display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #fffaf0; border-radius: 8px; border-left: 3px solid #f6ad55; }
  .db-stock-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; }
  .db-stock-branch { font-size: 0.78rem; color: #718096; }
  .db-stock-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }

  /* Top productos */
  .db-top-list { display: flex; flex-direction: column; gap: 10px; }
  .db-top-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f0f4f8; }
  .db-top-row:last-child { border-bottom: none; }
  .db-top-rank { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; flex-shrink: 0; }
  .rank-0 { background: linear-gradient(135deg,#ffd700,#ffed4e); color: #744210; }
  .rank-1 { background: linear-gradient(135deg,#c0c0c0,#e8e8e8); color: #4a5568; }
  .rank-2 { background: linear-gradient(135deg,#cd7f32,#e8a87c); color: #744210; }
  .rank-n { background: #edf2f7; color: #718096; }
  .db-top-info { flex: 1; min-width: 0; }
  .db-top-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-top-sub { font-size: 0.76rem; color: #a0aec0; }
  .db-top-val { font-size: 0.88rem; font-weight: 700; color: #48bb78; white-space: nowrap; }

  /* Órdenes recientes */
  .db-orders-list { display: flex; flex-direction: column; gap: 10px; }
  .db-order-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f4f8; }
  .db-order-row:last-child { border-bottom: none; }
  .db-order-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; }
  .db-order-date { font-size: 0.76rem; color: #a0aec0; }
  .db-order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .db-order-total { font-size: 0.88rem; font-weight: 700; color: #1e3a5f; }
  .db-order-badge { padding: 2px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }

  /* Usuarios */
  .db-users-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .db-user-stat { background: white; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
  .db-user-stat-val { font-size: 1.8rem; font-weight: 700; }
  .db-user-stat-label { font-size: 0.78rem; color: #718096; }
`;