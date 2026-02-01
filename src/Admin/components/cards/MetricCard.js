import { useEffect, useState } from "react";

const API = "https://sl-back.vercel.app";

export default function MetricCard({ title, apiKey, icon, bgColor = "bg-gray-50" }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let val = 0;
        switch (apiKey) {
          case "totalSales":
            val = (data.salesTimeline || []).reduce(
              (sum, d) => sum + parseFloat(d.total),
              0
            );
            break;
          case "branchesCount":
            val = (data.branchRanking || []).length;
            break;
          case "topProductSales":
            val = (data.topProducts || []).reduce(
              (sum, p) => sum + parseFloat(p.vendidos),
              0
            );
            break;
          default:
            val = 0;
        }

        setValue(val);
      } catch (err) {
        console.error(err);
        setError(true);
        setValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMetric();
  }, [apiKey]);

  // Animación de contador
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value !== null && !loading && !error) {
      let start = 0;
      const end = value;
      const duration = 1000; // 1 segundo
      const increment = end / (duration / 16); // 60 FPS

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value, loading, error]);

  return (
    <div 
      className={`
        ${bgColor} 
        rounded-2xl 
        shadow-lg 
        hover:shadow-2xl 
        transition-all 
        duration-300
        p-6 
        border-2 
        border-gray-200 
        hover:border-gray-300
        hover:scale-105
        relative
        overflow-hidden
        group
      `}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-1000 -translate-x-full"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            {title}
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
          
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : error ? (
              <span className="text-red-500 font-black">Error</span>
            ) : apiKey === "totalSales" ? (
              `$${displayValue.toLocaleString('es-MX')}`
            ) : (
              displayValue
            )}
          </h2>

          {/* Indicador de cambio */}
          {!loading && !error && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12.5%
              </span>
              <span className="text-gray-500 font-semibold">vs. semana pasada</span>
            </div>
          )}
        </div>

        {/* Icono con efecto */}
        {icon && (
          <div className="ml-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-gray-200">
              <div className="text-4xl">
                {icon}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progreso decorativa */}
      <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: loading ? '0%' : '100%' }}
        ></div>
      </div>
    </div>
  );
}