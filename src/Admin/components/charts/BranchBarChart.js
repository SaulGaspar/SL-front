import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

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
        const mapped = (data.branchRanking || []).map(b => ({
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
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-semibold">Cargando sucursales...</p>
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

  if (!branches.length) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <p className="text-gray-600 font-semibold text-lg">No hay ventas registradas aún</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200 p-4">
          <p className="text-gray-600 text-sm font-semibold mb-1">{payload[0].payload.branch}</p>
          <p className="text-2xl font-black text-purple-600">
            ${payload[0].value.toLocaleString('es-MX')}
          </p>
        </div>
      );
    }
    return null;
  };

  // Colores gradientes para cada barra
  const colors = [
    ['#8b5cf6', '#7c3aed'], // Púrpura
    ['#ec4899', '#db2777'], // Rosa
    ['#f59e0b', '#d97706'], // Ámbar
    ['#10b981', '#059669'], // Verde
    ['#3b82f6', '#2563eb'], // Azul
    ['#ef4444', '#dc2626'], // Rojo
  ];

  const totalSales = branches.reduce((sum, b) => sum + b.total, 0);
  const topBranch = branches.reduce((max, b) => b.total > max.total ? b : max, branches[0]);

  return (
    <div className="space-y-6">
      {/* Estadísticas Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Total General</p>
          <p className="text-2xl font-black text-purple-700">${totalSales.toLocaleString('es-MX')}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-200">
          <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-1">Líder</p>
          <p className="text-2xl font-black text-pink-700">{topBranch.branch}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={branches} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {colors.map((color, idx) => (
                <linearGradient key={idx} id={`barGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color[0]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={color[1]} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#c084fc" opacity={0.3} />
            <XAxis 
              dataKey="branch" 
              tick={{ fontSize: 13, fill: "#6b21a8", fontWeight: 600 }}
              tickLine={{ stroke: "#a855f7" }}
              stroke="#a855f7"
            />
            <YAxis 
              tick={{ fontSize: 13, fill: "#6b21a8", fontWeight: 600 }}
              tickLine={{ stroke: "#a855f7" }}
              stroke="#a855f7"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              radius={[12, 12, 0, 0]}
              animationDuration={800}
            >
              {branches.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#barGradient${index % colors.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de Sucursales */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {branches.map((branch, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-xl p-3 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${colors[idx % colors.length][0]}, ${colors[idx % colors.length][1]})` }}
              ></div>
              <p className="text-xs font-bold text-gray-700">{branch.branch}</p>
            </div>
            <p className="text-lg font-black text-gray-900">${branch.total.toLocaleString('es-MX')}</p>
            <p className="text-xs text-gray-500 font-semibold">
              {((branch.total / totalSales) * 100).toFixed(1)}% del total
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}