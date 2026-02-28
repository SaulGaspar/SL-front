import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const API = "https://sl-back.vercel.app";

export default function BranchBarChart() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const mapped = (data.branchRanking || []).map((b) => ({
          branch: `Sucursal ${b.sucursal}`,
          total: parseFloat(b.ingresos),
        }));

        setBranches(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las ventas por sucursal.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Cargando sucursales…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            ⚠️
          </div>
          <p className="font-semibold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!branches.length) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            🏪
          </div>
          <p className="text-slate-500 font-medium">
            No hay ventas registradas aún
          </p>
        </div>
      </div>
    );
  }

  const totalSales = branches.reduce((sum, b) => sum + b.total, 0);
  const topBranch = branches.reduce((max, b) =>
    b.total > max.total ? b : max
  , branches[0]);

  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
          <p className="text-xs text-slate-500 font-semibold mb-1">
            {payload[0].payload.branch}
          </p>
          <p className="text-lg font-bold text-slate-900">
            ${payload[0].value.toLocaleString("es-MX")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Ingresos totales
          </p>
          <p className="text-2xl font-bold text-slate-900">
            ${totalSales.toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Sucursal líder
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {topBranch.branch}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={branches}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="branch"
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {branches.map((_, i) => (
                <Cell
                  key={i}
                  fill={colors[i % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Branch list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {branches.map((b, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
              <p className="text-xs font-semibold text-slate-600">
                {b.branch}
              </p>
            </div>

            <p className="text-lg font-bold text-slate-900">
              ${b.total.toLocaleString("es-MX")}
            </p>

            <p className="text-xs text-slate-400">
              {((b.total / totalSales) * 100).toFixed(1)}% del total
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
