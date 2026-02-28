import { useEffect, useState } from "react";

export default function TopProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://sl-back.vercel.app/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error API ${res.status}`);
        const data = await res.json();

        const mapped = (data.topProducts || []).map((p) => ({
          ...p,
          ingresos: parseFloat(p.ingresos || 0),
          vendidos: parseInt(p.vendidos || 0, 10),
        }));

        setProducts(mapped);
      } catch {
        setError("No se pudieron cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!products.length) return <EmptyState />;

  const totalVendidos = products.reduce((s, p) => s + p.vendidos, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-slate-300 bg-slate-50">
        <h3 className="text-base font-semibold text-slate-800">
          Top productos
        </h3>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          
          {/* HEAD */}
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm">
              <th className="px-4 py-3 border border-slate-300 text-left w-12">#</th>
              <th className="px-4 py-3 border border-slate-300 text-left">Producto</th>
              <th className="px-4 py-3 border border-slate-300 text-right">Vendidos</th>
              <th className="px-4 py-3 border border-slate-300 text-right">Ingresos</th>
              <th className="px-4 py-3 border border-slate-300 text-right">% ventas</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {products.map((p, idx) => {
              const percent = (p.vendidos / totalVendidos) * 100;

              return (
                <tr
                  key={idx}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-3 border border-slate-200 text-center font-semibold text-slate-600">
                    {idx + 1}
                  </td>

                  <td className="px-4 py-3 border border-slate-200 font-medium text-slate-800">
                    {p.nombre}
                  </td>

                  <td className="px-4 py-3 border border-slate-200 text-right font-semibold">
                    {p.vendidos.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 border border-slate-200 text-right">
                    ${p.ingresos.toLocaleString("es-MX")}
                  </td>

                  <td className="px-4 py-3 border border-slate-200 text-right font-semibold text-slate-700">
                    {percent.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-3 border-t border-slate-300 bg-slate-50 text-sm text-slate-600">
        Total vendidos:{" "}
        <span className="font-semibold text-slate-800">
          {totalVendidos.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* STATES */

function LoadingState() {
  return (
    <div className="h-64 flex items-center justify-center bg-white border border-slate-300 rounded-2xl">
      <p className="text-slate-500">Cargando productos…</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="h-64 flex items-center justify-center bg-white border border-red-300 rounded-2xl">
      <p className="text-red-600 font-semibold">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-64 flex items-center justify-center bg-white border border-slate-300 rounded-2xl">
      <p className="text-slate-500">Sin productos</p>
    </div>
  );
}
