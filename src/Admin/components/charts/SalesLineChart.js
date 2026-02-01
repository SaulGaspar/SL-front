import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

const API = "https://sl-back.vercel.app";

export default function SalesLineChart() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const mapped = (data.salesTimeline || []).map(d => ({
          day: new Date(d.dia).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" }),
          total: parseFloat(d.total),
        }));
        setSales(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los ingresos diarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 font-bold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!sales.length) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-gray-600 font-semibold text-lg">No hay ventas registradas aún</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-4">
          <p className="text-gray-600 text-sm font-semibold mb-1">{payload[0].payload.day}</p>
          <p className="text-2xl font-black text-blue-600">
            ${payload[0].value.toLocaleString('es-MX')}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalSales = sales.reduce((sum, item) => sum + item.total, 0);
  const avgSales = totalSales / sales.length;
  const maxSale = Math.max(...sales.map(s => s.total));

  return (
    <div className="space-y-6">
      {/* Estadísticas Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Total</p>
          <p className="text-2xl font-black text-blue-700">${totalSales.toLocaleString('es-MX')}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Promedio</p>
          <p className="text-2xl font-black text-green-700">${avgSales.toFixed(0).toLocaleString('es-MX')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Máximo</p>
          <p className="text-2xl font-black text-purple-700">${maxSale.toLocaleString('es-MX')}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={sales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#93c5fd" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 13, fill: "#1e40af", fontWeight: 600 }} 
              tickLine={{ stroke: "#60a5fa" }}
              stroke="#60a5fa"
            />
            <YAxis 
              tick={{ fontSize: 13, fill: "#1e40af", fontWeight: 600 }}
              tickLine={{ stroke: "#60a5fa" }}
              stroke="#60a5fa"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#colorTotal)"
              dot={{ r: 5, strokeWidth: 2, fill: "#2563eb", stroke: "#ffffff" }}
              activeDot={{ r: 8, fill: "#1e40af", stroke: "#ffffff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}