import React, { useState, useEffect } from "react";
import { MdRefresh, MdTrendingUp, MdStore, MdInventory } from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .rep-wrap { font-family: 'DM Sans', sans-serif; }
  .rep-filters {
    background: white; border-radius: 12px; padding: 20px; margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;
  }
  .rep-filter-group { display: flex; flex-direction: column; gap: 6px; }
  .rep-filter-group label { font-size: 0.82rem; font-weight: 600; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
  .rep-filter-group input, .rep-filter-group select {
    padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; min-width: 160px;
  }
  .rep-filter-group input:focus, .rep-filter-group select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .rep-btn-apply {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
    border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;
    font-family: inherit; display: flex; align-items: center; gap: 8px; align-self: flex-end;
  }
  .rep-btn-apply:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(102,126,234,0.3); }
  .rep-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  @media (max-width: 768px) { .rep-grid2 { grid-template-columns: 1fr; } }
  .rep-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .rep-card-title { font-size: 1rem; font-weight: 700; color: #1e3a5f; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .rep-card-title svg { color: #667eea; }
  /* Bar chart */
  .bar-chart { display: flex; flex-direction: column; gap: 12px; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-label { font-size: 0.82rem; color: #4a5568; width: 100px; text-align: right; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { flex: 1; height: 28px; background: #f0f4f8; border-radius: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 10px; font-size: 0.8rem; font-weight: 700; color: white; transition: width 0.6s ease; }
  .bar-val { font-size: 0.82rem; font-weight: 700; color: #1e3a5f; width: 80px; flex-shrink: 0; }
  /* Line chart */
  .line-chart-wrap { position: relative; height: 180px; }
  .line-chart-svg { width: 100%; height: 100%; }
  .line-chart-labels { display: flex; justify-content: space-between; margin-top: 6px; }
  .line-chart-labels span { font-size: 0.72rem; color: #a0aec0; }
  /* Top products */
  .top-table { width: 100%; border-collapse: collapse; }
  .top-table th { padding: 10px 12px; text-align: left; font-size: 0.78rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
  .top-table td { padding: 12px; border-bottom: 1px solid #f0f4f8; font-size: 0.88rem; color: #2d3748; }
  .top-table tbody tr:hover { background: #f7fafc; }
  .top-rank { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; }
  .rank-1 { background: #fef5e7; color: #975a16; }
  .rank-2 { background: #f0fff4; color: #276749; }
  .rank-3 { background: #ebf8ff; color: #2c5282; }
  .rank-n { background: #f7fafc; color: #718096; }
  .rep-empty { text-align: center; color: #a0aec0; padding: 40px; }
  .rep-loading { text-align: center; color: #718096; padding: 64px; }
`;

function BarChart({ data, labelKey, valueKey, color = "#667eea" }) {
  if (!data || data.length === 0) return <div className="rep-empty">Sin datos</div>;
  const max = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
  const COLORS = ["#667eea", "#764ba2", "#48bb78", "#ed8936", "#4299e1", "#e53e3e"];
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const val = Number(d[valueKey]) || 0;
        const pct = (val / max) * 100;
        return (
          <div className="bar-row" key={i}>
            <div className="bar-label" title={d[labelKey]}>{d[labelKey] || "—"}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}>
                {pct > 20 ? `$${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : ""}
              </div>
            </div>
            <div className="bar-val">${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}</div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data }) {
  if (!data || data.length === 0) return <div className="rep-empty">Sin datos</div>;
  const values = data.map(d => Number(d.total) || 0);
  const max = Math.max(...values, 1);
  const W = 400, H = 160, PAD = 10;
  const pts = values.map((v, i) => {
    const x = PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - (v / max) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `${PAD},${H - PAD} ${polyline} ${W - PAD},${H - PAD}`;
  const showLabels = data.filter((_, i) => i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2));

  return (
    <div>
      <div className="line-chart-wrap">
        <svg className="line-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#667eea" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#lineGrad)" />
          <polyline points={polyline} fill="none" stroke="#667eea" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {values.map((v, i) => {
            const x = PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2);
            const y = H - PAD - (v / max) * (H - PAD * 2);
            return <circle key={i} cx={x} cy={y} r="3.5" fill="#667eea" stroke="white" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="line-chart-labels">
        {data.length > 0 && <span>{data[0].dia}</span>}
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)].dia}</span>}
        {data.length > 1 && <span>{data[data.length - 1].dia}</span>}
      </div>
    </div>
  );
}

export default function Reportes() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [branch, setBranch] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (branch !== "all") params.append("branch", branch);
      const res = await fetch(`${API_URL}/api/admin/dashboard?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
      else console.error("Error cargando reportes");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rep-wrap">
      <style>{S}</style>

      <div className="page-header">
        <h2>Reportes</h2>
        <p>Analiza el rendimiento de ventas por período y sucursal</p>
      </div>

      {/* Filtros */}
      <div className="rep-filters">
        <div className="rep-filter-group">
          <label>Desde</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="rep-filter-group">
          <label>Hasta</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="rep-filter-group">
          <label>Sucursal</label>
          <select value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">Todas</option>
            <option value="1">Centro</option>
            <option value="2">Norte</option>
            <option value="3">Sur</option>
            <option value="4">Playa</option>
          </select>
        </div>
        <button className="rep-btn-apply" onClick={loadReports}>
          <MdRefresh size={18} /> Aplicar filtros
        </button>
      </div>

      {loading && <div className="rep-loading">Cargando reportes...</div>}

      {!loading && !data && <div className="rep-loading">No hay datos disponibles.</div>}

      {!loading && data && (
        <>
          {/* Gráficas */}
          <div className="rep-grid2">
            <div className="rep-card">
              <div className="rep-card-title"><MdTrendingUp /> Ventas en el tiempo</div>
              {data.salesTimeline?.length > 0
                ? <LineChart data={data.salesTimeline} />
                : <div className="rep-empty">Sin datos de ventas en el período</div>
              }
            </div>
            <div className="rep-card">
              <div className="rep-card-title"><MdStore /> Ingresos por sucursal</div>
              {data.branchRanking?.length > 0
                ? <BarChart data={data.branchRanking} labelKey="sucursal" valueKey="ingresos" />
                : <div className="rep-empty">Sin datos de sucursales en el período</div>
              }
            </div>
          </div>

          {/* Top productos */}
          <div className="rep-card">
            <div className="rep-card-title"><MdInventory /> Top productos más vendidos</div>
            {data.topProducts?.length > 0 ? (
              <table className="top-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Unidades vendidas</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <div className={`top-rank ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-n"}`}>
                          {i + 1}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: "#1e3a5f" }}>{p.nombre}</td>
                      <td>{Number(p.vendidos || 0).toLocaleString()} uds.</td>
                      <td style={{ fontWeight: 700, color: "#48bb78" }}>
                        ${Number(p.ingresos || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rep-empty">Sin datos de productos en el período</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
