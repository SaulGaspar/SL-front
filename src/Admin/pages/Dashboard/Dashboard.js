import { API_BASE_URL } from "../../../config/api";
import Feedback from "../../../components/Feedback";
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

const BASE = `${API_BASE_URL}/api/admin`;

const fmt = (v) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v || 0);

const fmtNum = (v) => Number(v || 0).toLocaleString("es-MX");

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orderStats, setOrderStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [invStats, setInvStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [salesTimeline, setSalesTimeline] = useState([]);
  const [branchRanking, setBranchRanking] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filterError, setFilterError] = useState("");

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

  const apiFetchSafe = async (url) => {
    try { return await apiFetch(url); }
    catch (e) { console.warn(`⚠️ Endpoint falló (se omite): ${url} —`, e.message); return null; }
  };

  const fetchAll = async () => {
    if (filters.from && filters.to && filters.from > filters.to) {
      setFilterError("La fecha inicial no puede ser posterior a la final.");
      return;
    }
    setFilterError("");
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sin token de autenticación");

      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.branch !== "all") params.append("branch", filters.branch);
      const branchParams = new URLSearchParams();
      if (filters.branch !== "all") branchParams.set("branch", filters.branch);

      const [dashboard, users, inv, products, lowStock] = await Promise.all([
        apiFetchSafe(`${BASE}/dashboard?${params}`),
        apiFetchSafe(`${BASE}/users/stats/summary`),
        apiFetchSafe(`${BASE}/inventory/stats?${branchParams}`),
        apiFetchSafe(`${BASE}/products/stats/summary`),
        apiFetchSafe(`${BASE}/inventory?low_stock=true&${branchParams}`),
      ]);

      if (dashboard && (!dashboard.resumen || !Array.isArray(dashboard.branches))) {
        setError("El resumen necesita la versión actualizada del servidor.");
        return;
      }

      if (dashboard) {
        setSalesTimeline(dashboard.salesTimeline || []);
        setBranchRanking(dashboard.branchRanking || []);
        setTopProducts(dashboard.topProducts || []);
        setOrderStats(dashboard.resumen || {});
        setRecentOrders(dashboard.recentOrders || []);
        setBranches(dashboard.branches || []);
      }
      if (users)    setUserStats(users.resumen || {});
      if (inv)      setInvStats(inv.general || {});
      if (products) setProductStats(products);
      if (lowStock) setLowStockItems((Array.isArray(lowStock) ? lowStock : []).slice(0, 6));

      if ([dashboard, users, inv, products, lowStock].some(result => result === null)) {
        setError("No se pudo cargar el resumen completo. Intenta de nuevo para consultar cifras actualizadas.");
      }
    } catch (err) {
      setError(err.message || "Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchAll();

  if (loading) return <Feedback kind="loading" title="Cargando resumen…" />;

  if (error) return <Feedback kind="error" title={error} onRetry={fetchAll} />;

  const statusColor = { pendiente: "#f6ad55", preparando: "#63b3ed", procesando: "#63b3ed", en_camino: "#76e4f7", enviado: "#76e4f7", entregado: "#68d391", cancelado: "#fc8181" };
  const statusIcon  = { pendientes: <MdAccessTime />, preparando: <MdRefresh />, en_camino: <MdLocalShipping />, entregadas: <MdCheckCircle />, canceladas: <MdCancel /> };

  return (
    <div>
      <style>{CSS}</style>

      <div className="page-header">
        <h2>Resumen</h2>
        <p>Resumen general de SportLike</p>
      </div>

      {/* Filtros */}
      <div className="db-filters">
        <div className="db-filter-group">
          <label htmlFor="dashboard-from">Desde</label>
          <input id="dashboard-from" type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} />
        </div>
        <div className="db-filter-group">
          <label htmlFor="dashboard-to">Hasta</label>
          <input id="dashboard-to" type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} />
        </div>
        <div className="db-filter-group">
          <label htmlFor="dashboard-branch">Sucursal</label>
          <select id="dashboard-branch" value={filters.branch} onChange={e => setFilters({ ...filters, branch: e.target.value })}>
            <option value="all">Todas</option>
            {branches.map(b => <option key={b.id} value={String(b.id)}>{b.nombre}</option>)}
          </select>
        </div>
        <button className="db-btn-apply" onClick={handleFilter}>
          <MdRefresh size={16} /> Actualizar
        </button>
      </div>

      {filterError && <Feedback kind="error" title={filterError} />}
      <p className="db-filter-note">Fechas y sucursal filtran pedidos y ventas. Los importes excluyen pedidos cancelados. Inventario y alertas muestran existencias actuales de la sucursal; usuarios y productos son globales.</p>

      {/* ── KPI Cards ── */}
      <div className="db-kpi-grid">
        <div className="db-kpi-card">
          <div className="db-kpi-icon" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
            <MdAttachMoney size={28} />
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-label">Ingresos totales</span>
            {/* ← clamp: se achica si el número es largo */}
            <span className="db-kpi-value db-kpi-value--money">{fmt(orderStats?.ingresos_totales)}</span>
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
            <span className="db-kpi-sub">Valor: {fmt(invStats?.valor_inventario)}</span>
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
          { key: "preparando", label: "Preparando", color: "#63b3ed" },
          { key: "en_camino",  label: "En camino",  color: "#76e4f7" },
          { key: "entregadas", label: "Entregadas",  color: "#68d391" },
          { key: "canceladas", label: "Canceladas",  color: "#fc8181" },
        ].map(({ key, label, color }) => {
          const val = orderStats?.[key] || 0;
          const total = orderStats?.total_ordenes || 1;
          const pct = Math.round((val / total) * 100);
          return (
            <div className="db-status-card" key={key}>
              <div className="db-status-top">
                <span style={{ color, fontSize: "1.4rem" }}>{statusIcon[key]}</span>
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

      {/* ── Bottom row ── */}
      <div className="db-bottom-grid">

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
              <div>No hay alertas de existencias en esta selección.</div>
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
          { label: "Total usuarios",  val: userStats?.total_usuarios, color: "#667eea", icon: <MdPeople /> },
          { label: "Clientes",        val: userStats?.clientes,       color: "#48bb78", icon: <MdPeople /> },
          { label: "Administradores", val: userStats?.admins,         color: "#764ba2", icon: <MdPeople /> },
          { label: "Verificados",     val: userStats?.verificados,    color: "#4facfe", icon: <MdCheckCircle /> },
          { label: "Sin verificar",   val: userStats?.sin_verificar,  color: "#f6ad55", icon: <MdWarning /> },
          { label: "Bloqueados",      val: userStats?.bloqueados,     color: "#fc8181", icon: <MdCancel /> },
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

const S = {
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 },
  spinner: { width: 48, height: 48, border: "4px solid #e2e8f0", borderTop: "4px solid #667eea", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  errorBox: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 12, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 440, margin: "48px auto", textAlign: "center" },
  btnPrimary: { background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 600 },
};

import CSS from "./Dashboard.styles";
