import { useEffect, useState } from "react";

const API = "https://sl-back.vercel.app";

export default function MetricCard({
  title,
  apiKey,
  icon,
  tone = "blue", // blue | green | purple | amber | red
}) {
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

        if (!res.ok) throw new Error();

        const data = await res.json();

        let val = 0;

        switch (apiKey) {
          case "totalSales":
            val = (data.salesTimeline || []).reduce(
              (sum, d) => sum + Number(d.total),
              0
            );
            break;

          case "branchesCount":
            val = (data.branchRanking || []).length;
            break;

          case "topProductSales":
            val = (data.topProducts || []).reduce(
              (sum, p) => sum + Number(p.vendidos),
              0
            );
            break;

          default:
            val = 0;
        }

        setValue(val);
      } catch {
        setError(true);
        setValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMetric();
  }, [apiKey]);

  // ===== contador animado =====
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value !== null && !loading && !error) {
      let start = 0;
      const end = value;
      const duration = 900;
      const step = end / (duration / 16);

      const timer = setInterval(() => {
        start += step;
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

  // ===== tonos visuales =====
  const tones = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-600",
      accent: "bg-blue-500",
    },
    green: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      text: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    purple: {
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      text: "text-violet-600",
      accent: "bg-violet-500",
    },
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-600",
      accent: "bg-amber-500",
    },
    red: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-600",
      accent: "bg-red-500",
    },
  };

  const t = tones[tone] || tones.blue;

  return (
    <div
      className="
        relative
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      {/* barra superior KPI */}
      <div className={`absolute top-0 left-0 h-1 w-full ${t.accent}`} />

      <div className="flex items-center justify-between">
        {/* texto */}
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {title}
          </p>

          <div className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? (
              <div className="h-8 w-20 bg-slate-200 animate-pulse rounded" />
            ) : error ? (
              <span className="text-red-500">—</span>
            ) : apiKey === "totalSales" ? (
              `$${displayValue.toLocaleString("es-MX")}`
            ) : (
              displayValue
            )}
          </div>

          {/* change indicator */}
          {!loading && !error && (
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              ▲ 12.5%
              <span className="text-slate-400 font-medium">
                vs periodo anterior
              </span>
            </div>
          )}
        </div>

        {/* icono */}
        {icon && (
          <div
            className={`
              ${t.iconBg}
              ${t.text}
              w-12 h-12
              rounded-xl
              flex items-center justify-center
              text-2xl
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
