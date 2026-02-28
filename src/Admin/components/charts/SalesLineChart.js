import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

const API = "https://sl-back.vercel.app";

export default function SalesLineChart() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("all");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const mapped = (data.salesTimeline || []).map((d) => {
          const date = new Date(d.dia);
          return {
            date,
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            label: date.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "2-digit"
            }),
            total: Number(d.total)
          };
        });

        setSales(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los ingresos diarios");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // ===== AÑOS DISPONIBLES =====
  const years = useMemo(() => {
    return [...new Set(sales.map((s) => s.year))].sort((a, b) => a - b);
  }, [sales]);

  // ===== MESES DISPONIBLES =====
  const months = useMemo(() => {
    const filtered =
      year === "all" ? sales : sales.filter((s) => s.year === Number(year));

    return [...new Set(filtered.map((s) => s.month))].sort((a, b) => a - b);
  }, [sales, year]);

  // ===== DÍAS DISPONIBLES =====
  const days = useMemo(() => {
    let filtered = sales;

    if (year !== "all")
      filtered = filtered.filter((s) => s.year === Number(year));

    if (month !== "all")
      filtered = filtered.filter((s) => s.month === Number(month));

    return [...new Set(filtered.map((s) => s.day))].sort((a, b) => a - b);
  }, [sales, year, month]);

  // ===== DATOS FILTRADOS =====
  const filteredSales = useMemo(() => {
    let filtered = sales;

    if (year !== "all")
      filtered = filtered.filter((s) => s.year === Number(year));

    if (month !== "all")
      filtered = filtered.filter((s) => s.month === Number(month));

    if (day !== "all")
      filtered = filtered.filter((s) => s.day === Number(day));

    return filtered;
  }, [sales, year, month, day]);

  // ===== STATS =====
  const stats = useMemo(() => {
    if (!filteredSales.length) return { total: 0, avg: 0, max: 0 };

    const total = filteredSales.reduce((sum, i) => sum + i.total, 0);
    const avg = total / filteredSales.length;
    const max = Math.max(...filteredSales.map((s) => s.total));

    return { total, avg, max };
  }, [filteredSales]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!sales.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      {/* ===== FILTROS ===== */}
      <div className="flex flex-wrap gap-3">
        {/* Año */}
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setMonth("all");
            setDay("all");
          }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
        >
          <option value="all">Año</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Mes */}
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setDay("all");
          }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
        >
          <option value="all">Mes</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(0, m).toLocaleString("es-MX", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Día */}
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
        >
          <option value="all">Día</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* ===== STATS ===== */}
      <StatsRow stats={stats} />

      {/* ===== CHART ===== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart
            data={filteredSales}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" opacity={0.15} />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#salesGradient)"
              dot={{ r: 4, strokeWidth: 2, fill: "#3b82f6", stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  const items = [
    { label: "Total", value: stats.total },
    { label: "Promedio", value: stats.avg },
    { label: "Máximo", value: stats.max }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((i) => (
        <div
          key={i.label}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {i.label}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ${i.value.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
          </p>
        </div>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const d = payload[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2">
      <p className="text-xs text-slate-500 font-medium">{d.payload.label}</p>
      <p className="text-lg font-bold text-slate-900">
        ${d.value.toLocaleString("es-MX")}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-72 flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Cargando ingresos…</p>
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="h-72 flex items-center justify-center bg-white rounded-3xl border border-red-200 shadow-sm">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3 text-red-500 text-xl">
          ⚠️
        </div>
        <p className="font-semibold text-red-600">{message}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-72 flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500 text-xl">
          📊
        </div>
        <p className="font-semibold text-slate-600">
          No hay ventas registradas
        </p>
      </div>
    </div>
  );
}
