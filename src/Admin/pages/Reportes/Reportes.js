import { useEffect, useState } from "react";
import SalesLineChart from "../../components/charts/SalesLineChart";
import BranchBarChart from "../../components/charts/BranchBarChart";
import TopProductsTable from "../../components/tables/TopProductsTable";

export default function Reportes() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [branch, setBranch] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "https://sl-back.vercel.app";

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/admin/dashboard?from=${from}&to=${to}&branch=${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">📊 Reportes por Sucursal</h2>

      {/* FILTROS */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label>Desde</label>
            <input type="date" className="form-control" value={from} onChange={e => setFrom(e.target.value)} />
          </div>

          <div className="col-md-3">
            <label>Hasta</label>
            <input type="date" className="form-control" value={to} onChange={e => setTo(e.target.value)} />
          </div>

          <div className="col-md-3">
            <label>Sucursal</label>
            <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="all">Todas</option>
              <option value="1">Centro</option>
              <option value="2">Norte</option>
              <option value="3">Sur</option>
              <option value="4">Playa</option>
            </select>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={loadReports}>Aplicar filtros</button>
          </div>
        </div>
      </div>

      {loading && <div className="p-4 text-gray-500">Cargando reportes...</div>}

      {!loading && data && (
        <>
          <div className="row mb-4">
            <div className="col-md-6"><SalesLineChart data={data.salesTimeline} /></div>
            <div className="col-md-6"><BranchBarChart data={data.branchRanking} /></div>
          </div>

          <TopProductsTable products={data.topProducts} />
        </>
      )}

      {!loading && !data && <div className="p-4 text-gray-500">No hay datos para mostrar.</div>}
    </div>
  );
}
