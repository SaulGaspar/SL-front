import { API_BASE_URL } from "../../../config/api";
import React, { useState, useEffect, useRef } from "react";
import { MdSearch, MdRefresh, MdEdit, MdWarning, MdCheckCircle, MdCancel, MdFileDownload, MdFileUpload, MdClose, MdVisibility, MdDateRange } from "react-icons/md";

const API_URL = API_BASE_URL;
const CSV_HEADERS        = ["producto","sucursal","branch_id","stock","min_stock","estado"];
const CSV_HEADERS_IMPORT = ["product_id","branch_id","stock","min_stock"];
const IMPORTANT_FIELDS   = { producto:"Producto", sucursal:"Sucursal", stock:"Stock", min_stock:"Stock Mínimo" };

import S from "./Inventario.styles";

// ── CSV helpers ──────────────────────────────────────────────────────────────
function toCSV(rows) {
  const escape = v => { const s = String(v ?? ""); return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s; };
  const lines = [CSV_HEADERS.join(",")];
  rows.forEach(r => lines.push(CSV_HEADERS.map(h => escape(r[h])).join(",")));
  return lines.join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const lines = text.trim().split("\n").map(l => l.replace(/\r/, ""));
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const vals = []; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"' && !inQ) { inQ = true; continue; }
      if (line[i] === '"' && inQ && line[i+1] === '"') { cur += '"'; i++; continue; }
      if (line[i] === '"' && inQ) { inQ = false; continue; }
      if (line[i] === ',' && !inQ) { vals.push(cur); cur = ""; continue; }
      cur += line[i];
    }
    vals.push(cur);
    const obj = {}; headers.forEach((h, i) => obj[h] = vals[i]?.trim() ?? "");
    return obj;
  });
}

function analyzeEmptyFields(rows) {
  const counts = {};
  Object.keys(IMPORTANT_FIELDS).forEach(f => { counts[f] = 0; });
  rows.forEach(r => {
    Object.keys(IMPORTANT_FIELDS).forEach(f => {
      if (r[f] === undefined || r[f] === null || r[f] === "") counts[f]++;
    });
  });
  return counts;
}

function interpretError(serverMsg, action, row) {
  const producto = row.producto || row.product_id || "?";
  const suc = row.branch_id;
  if (!serverMsg) return { producto, branch_id: suc, tipo: "desconocido", msg: "Error desconocido del servidor" };
  const m = serverMsg.toLowerCase();
  if (m.includes("ya tiene inventario") || m.includes("already") || m.includes("duplicate") || m.includes("use actualizar"))
    return { producto, branch_id: suc, tipo: "duplicado", msg: 'Ya existe en esa sucursal — usa "Actualizar existentes"' };
  if (m.includes("no encontrado") || m.includes("not found") || m.includes("producto no encontrado"))
    return { producto, branch_id: suc, tipo: "no_encontrado", msg: "Producto no encontrado en el catálogo" };
  if (m.includes("sucursal") || m.includes("branch"))
    return { producto, branch_id: suc, tipo: "sucursal", msg: "Sucursal no encontrada o inactiva" };
  if (m.includes("inactivo") || m.includes("activo"))
    return { producto, branch_id: suc, tipo: "inactivo", msg: "El producto está inactivo y no acepta inventario" };
  if (m.includes("conexion") || m.includes("connection") || m.includes("too many"))
    return { producto, branch_id: suc, tipo: "red", msg: "Servidor ocupado — reintenta en un momento" };
  return { producto, branch_id: suc, tipo: "servidor", msg: `Error: ${serverMsg}` };
}

export default function Inventario() {
  const [inventory,      setInventory]      = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [stats,          setStats]          = useState(null);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [filterBranch,   setFilterBranch]   = useState("all");
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [dateFrom,       setDateFrom]       = useState("");
  const [dateTo,         setDateTo]         = useState("");
  const [editing,        setEditing]        = useState(null);
  const [editStock,      setEditStock]      = useState("");
  const [editMin,        setEditMin]        = useState("");
  const [toast,          setToast]          = useState(null);
  const [showExport,     setShowExport]     = useState(false);
  const [exportData,     setExportData]     = useState([]);
  const [emptyFields,    setEmptyFields]    = useState({});
  const [showImport,     setShowImport]     = useState(false);
  const [importRows,     setImportRows]     = useState([]);
  const [importDups,     setImportDups]     = useState([]);
  const [dupAction,      setDupAction]      = useState(null);
  const [importing,      setImporting]      = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [showSummary,    setShowSummary]    = useState(false);
  const [importResult,   setImportResult]   = useState(null);

  const fileRef = useRef();

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    let f = [...inventory];
    if (searchTerm) f = f.filter(i =>
      i.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sucursal?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterBranch !== "all")  f = f.filter(i => String(i.branch_id) === filterBranch);
    if (filterStatus === "out")  f = f.filter(i => i.stock === 0);
    else if (filterStatus === "low") f = f.filter(i => i.stock > 0 && i.stock <= i.min_stock);
    else if (filterStatus === "ok")  f = f.filter(i => i.stock > i.min_stock);
    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00");
      f = f.filter(i => { const d = i.updated_at || i.created_at; return d ? new Date(d) >= from : true; });
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      f = f.filter(i => { const d = i.updated_at || i.created_at; return d ? new Date(d) <= to : true; });
    }
    setFiltered(f);
  }, [inventory, searchTerm, filterBranch, filterStatus, dateFrom, dateTo]);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [invRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/inventory`, { headers }),
        fetch(`${API_URL}/api/admin/inventory/stats`, { headers }),
      ]);
      if (invRes.ok)   setInventory(await invRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) { console.error("Error cargando inventario:", err); }
    finally { setLoading(false); }
  };

  // ── EXPORT ──────────────────────────────────────────────────────────────────
  const handleExportPreview = () => {
    const data = filtered.length && filtered.length < inventory.length ? filtered : inventory;
    setExportData(data);
    setEmptyFields(analyzeEmptyFields(data));
    setShowExport(true);
  };

  const handleExportConfirm = () => {
    downloadCSV(toCSV(exportData), `inventario_${new Date().toISOString().slice(0,10)}.csv`);
    setShowExport(false);
    showToast(`✅ ${exportData.length} registros exportados`);
  };

  // ── PLANTILLA ────────────────────────────────────────────────────────────────
  const handleDownloadTemplate = () => {
    const escape = v => { const s = String(v ?? ""); return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s; };
    const samples = inventory.length >= 3
      ? inventory.slice(0, 3).map(i => ({ product_id: i.product_id, branch_id: i.branch_id, stock: 50, min_stock: 40 }))
      : [{ product_id: 1, branch_id: 1, stock: 50, min_stock: 40 }, { product_id: 1, branch_id: 2, stock: 20, min_stock: 40 }, { product_id: 2, branch_id: 1, stock: 45, min_stock: 40 }];
    const lines = [CSV_HEADERS_IMPORT.join(",")];
    samples.forEach(s => lines.push(CSV_HEADERS_IMPORT.map(h => escape(s[h])).join(",")));
    downloadCSV(lines.join("\n"), "plantilla_inventario.csv");
    showToast("Plantilla descargada");
  };

  // ── IMPORT ──────────────────────────────────────────────────────────────────
  const handleFileRead = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCSV(e.target.result);
      const valid = rows.filter(r => r.producto && r.producto.trim() && r.branch_id && r.stock !== "");
      if (valid.length === 0) {
        showToast("No se encontraron filas válidas. Columnas requeridas: producto, branch_id, stock, min_stock", "err");
        return;
      }
      const existingKeys = new Set(inventory.map(i => `${(i.producto||"").toLowerCase().trim()}-${i.branch_id}`));
      const dups = valid.filter(r => existingKeys.has(`${r.producto.toLowerCase().trim()}-${r.branch_id}`));
      setImportRows(valid);
      setImportDups(dups);
      setDupAction(dups.length > 0 ? null : "skip");
      setShowImport(true);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleImportConfirm = async () => {
    if (importDups.length > 0 && !dupAction) return;
    setImporting(true);

    const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` };
    const norm = s => (s || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const productMap = new Map();
    const productMapRaw = new Map();
    try {
      const pRes = await fetch(`${API_URL}/api/admin/products`, { headers: authHeader });
      if (pRes.ok) {
        const prods = await pRes.json();
        prods.forEach(p => {
          productMap.set(norm(p.nombre), p.id);
          productMapRaw.set((p.nombre || "").toLowerCase().trim(), p.id);
        });
      }
    } catch (e) { console.error("No se pudo obtener productos:", e); }

    const existingMap   = new Map(inventory.map(i => [`${norm(i.producto)}-${i.branch_id}`, i]));
    const existingByIds = new Map(inventory.map(i => [`${i.product_id}-${i.branch_id}`, i]));

    const toProcess    = [];
    const noMatchNames = new Set();
    const errorDetails = [];
    let skipped = 0;

    for (const row of importRows) {
      const nombreNorm = norm(row.producto);
      const key        = `${nombreNorm}-${row.branch_id}`;
      const isDup      = existingMap.has(key);

      if (isDup && dupAction === "skip") { skipped++; continue; }

      const product_id = productMap.get(nombreNorm) || productMapRaw.get((row.producto || "").toLowerCase().trim());
      if (!product_id) { noMatchNames.add(row.producto); continue; }

      toProcess.push({ row, isDup, product_id, key });
    }

    let created = 0, updated = 0, errors = 0;

    const toCreate = toProcess.filter(p => !p.isDup).map(({ row, product_id }) => ({
      product_id,
      branch_id: parseInt(row.branch_id),
      stock:     parseInt(row.stock),
      min_stock: parseInt(row.min_stock) || 40,
      producto:  row.producto,
    }));

    const toUpdate = dupAction === "update"
      ? toProcess.filter(p => p.isDup).map(({ row, key }) => ({
          id:        existingMap.get(key).id,
          stock:     parseInt(row.stock),
          min_stock: parseInt(row.min_stock) || 40,
          producto:  row.producto,
          branch_id: row.branch_id,
        }))
      : [];

    setImportProgress({ done: 0, total: toCreate.length + toUpdate.length });

    if (toCreate.length > 0) {
      try {
        const res = await fetch(`${API_URL}/api/admin/inventory/batch`, {
          method: "POST", headers: authHeader,
          body: JSON.stringify({ items: toCreate }),
        });
        if (res.ok) {
          const d = await res.json();
          created += d.created || 0;
          updated += d.updated || 0;
          errors  += d.errors  || 0;
        } else {
          for (let i = 0; i < toCreate.length; i++) {
            const item = toCreate[i];
            setImportProgress({ done: i + 1, total: toCreate.length + toUpdate.length });
            try {
              const r = await fetch(`${API_URL}/api/admin/inventory`, {
                method: "POST", headers: authHeader,
                body: JSON.stringify({ product_id: item.product_id, branch_id: item.branch_id, stock: item.stock, min_stock: item.min_stock }),
              });
              if (r.ok) { created++; }
              else {
                const d = await r.json().catch(() => ({}));
                const errMsg = (d.error || "").toLowerCase();
                if (errMsg.includes("ya tiene") || errMsg.includes("error agregando")) {
                  const ex = existingByIds.get(`${item.product_id}-${item.branch_id}`);
                  if (ex) {
                    const pr = await fetch(`${API_URL}/api/admin/inventory/${ex.id}`, {
                      method: "PUT", headers: authHeader,
                      body: JSON.stringify({ stock: item.stock, min_stock: item.min_stock }),
                    });
                    if (pr.ok) updated++; else errors++;
                  } else errors++;
                } else { errorDetails.push(interpretError(d.error, "create", item)); errors++; }
              }
            } catch { errors++; }
            await new Promise(r => setTimeout(r, 300));
          }
        }
      } catch (e) { console.error("Batch create error:", e); errors += toCreate.length; }
    }

    setImportProgress({ done: toCreate.length, total: toCreate.length + toUpdate.length });

    if (toUpdate.length > 0) {
      try {
        const res = await fetch(`${API_URL}/api/admin/inventory/batch-update`, {
          method: "PUT", headers: authHeader,
          body: JSON.stringify({ items: toUpdate }),
        });
        if (res.ok) {
          const d = await res.json();
          updated += d.updated || 0;
          errors  += d.errors  || 0;
        } else {
          for (let i = 0; i < toUpdate.length; i++) {
            const item = toUpdate[i];
            setImportProgress({ done: toCreate.length + i + 1, total: toCreate.length + toUpdate.length });
            try {
              const r = await fetch(`${API_URL}/api/admin/inventory/${item.id}`, {
                method: "PUT", headers: authHeader,
                body: JSON.stringify({ stock: item.stock, min_stock: item.min_stock }),
              });
              if (r.ok) updated++;
              else { const d = await r.json().catch(() => ({})); errorDetails.push(interpretError(d.error, "update", item)); errors++; }
            } catch { errors++; }
            await new Promise(r => setTimeout(r, 300));
          }
        }
      } catch (e) { errors += toUpdate.length; }
    }

    setImportProgress({ done: toCreate.length + toUpdate.length, total: toCreate.length + toUpdate.length });
    if (noMatchNames.size > 0) console.warn("Sin coincidencia en BD:", [...noMatchNames]);

    setImporting(false);
    setShowImport(false);
    setImportProgress(null);
    setImportRows([]);
    fetchAll();

    setImportResult({
      created, updated, skipped,
      errors: errors + noMatchNames.size,
      total: importRows.length,
      errorDetails,
      noMatchNames: [...noMatchNames],
    });
    setShowSummary(true);
  };

  // ── Edit stock ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/inventory/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stock: Number(editStock), min_stock: Number(editMin) }),
      });
      if (res.ok) { setEditing(null); fetchAll(); showToast("Inventario actualizado"); }
      else showToast("Error al actualizar", "err");
    } catch (err) { console.error(err); }
  };

  const branches      = [...new Set(inventory.map(i => ({ id: i.branch_id, name: i.sucursal })).map(JSON.stringify))].map(JSON.parse);
  const hasDateFilter = dateFrom || dateTo;
  const warnFields    = exportData.length > 0 ? Object.entries(emptyFields).filter(([,c]) => c > 0).map(([f]) => f) : [];

  const getStockStatus = item => {
    if (item.stock === 0)             return { cls:"out", icon:<MdCancel/>,     label:"Sin stock"  };
    if (item.stock <= item.min_stock) return { cls:"low", icon:<MdWarning/>,    label:"Stock bajo" };
    return                                   { cls:"ok",  icon:<MdCheckCircle/>,label:"Disponible" };
  };
  const getBarColor = item => item.stock === 0 ? "#fc8181" : item.stock <= item.min_stock ? "#f6ad55" : "#68d391";
  const getBarWidth = item => { const max = Math.max(item.min_stock*3, item.stock, 1); return Math.min((item.stock/max)*100, 100); };

  return (
    <div className="inv-wrap">
      <style>{S}</style>

      <div className="page-header">
        <h2>Inventario</h2>
        <p>Gestiona el stock de tus productos por sucursal</p>
      </div>

      {/* Stats */}
      {stats?.general && (
        <div className="inv-stats">
          <div className="inv-stat-card">
            <span className="inv-stat-label">Total productos</span>
            <span className="inv-stat-value">{stats.general.total_productos || 0}</span>
            <span className="inv-stat-sub">en {stats.general.total_sucursales || 0} sucursales</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Stock total</span>
            <span className="inv-stat-value">{Number(stats.general.stock_total || 0).toLocaleString()}</span>
            <span className="inv-stat-sub">unidades</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Sin stock</span>
            <span className="inv-stat-value" style={{ color:"#e53e3e" }}>{stats.general.productos_sin_stock || 0}</span>
            <span className="inv-stat-sub">requieren atención</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Stock bajo</span>
            <span className="inv-stat-value" style={{ color:"#d69e2e" }}>{stats.general.productos_bajo_stock || 0}</span>
            <span className="inv-stat-sub">por reponer</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-label">Valor inventario</span>
            <span className="inv-stat-value" style={{ fontSize:"1.4rem" }}>
              ${Number(stats.general.valor_inventario || 0).toLocaleString("es-MX", { minimumFractionDigits:0 })}
            </span>
            <span className="inv-stat-sub">MXN estimado</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="inv-toolbar">
        <div style={{ display:"flex", gap:12, flex:1, flexWrap:"wrap" }}>
          <div className="inv-search-box">
            <MdSearch className="inv-search-icon" />
            <input placeholder="Buscar producto o sucursal..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="inv-select" value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
            <option value="all">Todas las sucursales</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="inv-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="ok">Disponible</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
          <div className="inv-date-row">
            <MdDateRange size={16} style={{ color:"#718096", flexShrink:0 }} />
            <span className="inv-date-label">Desde</span>
            <input type="date" className="inv-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="inv-date-sep">→</span>
            <span className="inv-date-label">Hasta</span>
            <input type="date" className="inv-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            {hasDateFilter && <button className="inv-date-clear" onClick={() => { setDateFrom(""); setDateTo(""); }}>✕ Limpiar</button>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button className="inv-btn inv-btn-refresh" onClick={fetchAll}>
            <MdRefresh size={18} className={loading ? "spinning" : ""} /> Actualizar
          </button>
          <button className="inv-btn inv-btn-export" onClick={handleExportPreview}>
            <MdFileDownload size={18} /> Exportar
          </button>
          <button className="inv-btn inv-btn-import" onClick={() => fileRef.current?.click()}>
            <MdFileUpload size={18} /> Importar
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e => { handleFileRead(e.target.files[0]); e.target.value=""; }} />
        </div>
      </div>

      {hasDateFilter && (
        <div className="inv-date-active">
          <MdDateRange size={15} />
          Filtrando por fecha:{" "}
          {dateFrom && <strong>{dateFrom}</strong>}
          {dateFrom && dateTo && " → "}
          {dateTo && <strong>{dateTo}</strong>}
          {" — "}<strong>{filtered.length}</strong> registro{filtered.length !== 1 ? "s" : ""} en este rango
        </div>
      )}

      {/* Tabla */}
      <div className="inv-table-wrap">
        {loading ? (
          <div className="inv-empty">Cargando inventario...</div>
        ) : (
          <table className="inv-table">
            <thead>
              <tr>
                <th>Producto</th><th>Sucursal</th><th>Categoría</th>
                <th>Stock actual</th><th>Mín. requerido</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="inv-empty">No se encontraron registros</td></tr>
              ) : filtered.map(item => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight:600, color:"#1e3a5f" }}>{item.producto}</td>
                    <td style={{ color:"#4a5568" }}>{item.sucursal}</td>
                    <td>{item.categoria && <span style={{ background:"#edf2f7", padding:"3px 10px", borderRadius:6, fontSize:"0.8rem", color:"#4a5568" }}>{item.categoria}</span>}</td>
                    <td>
                      <div style={{ fontWeight:700, fontSize:"1.05rem" }}>{item.stock}</div>
                      <div className="inv-progress-bar">
                        <div className="inv-progress-fill" style={{ width:`${getBarWidth(item)}%`, background:getBarColor(item) }} />
                      </div>
                    </td>
                    <td style={{ color:"#718096" }}>{item.min_stock}</td>
                    <td><span className={`inv-badge ${status.cls}`}>{status.icon} {status.label}</span></td>
                    <td>
                      <button className="inv-edit-btn" onClick={() => { setEditing(item); setEditStock(item.stock); setEditMin(item.min_stock); }}>
                        <MdEdit size={15} /> Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Export Preview */}
      {showExport && (
        <div className="inv-modal-overlay" onClick={() => setShowExport(false)}>
          <div className="inv-modal inv-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3><MdVisibility style={{ verticalAlign:"middle", marginRight:6 }} />Previsualizar exportación</h3>
              <button className="inv-modal-close" onClick={() => setShowExport(false)}><MdClose /></button>
            </div>
            <div className="inv-modal-body">
              <div className="inv-export-stats">
                <span className="inv-export-stat total">📦 {exportData.length} registros a exportar</span>
                {warnFields.length === 0
                  ? <span className="inv-export-stat ok">✅ Sin campos vacíos</span>
                  : <span className="inv-export-stat warn">⚠ {warnFields.length} campo{warnFields.length>1?"s":""} con vacíos</span>
                }
              </div>
              {warnFields.length > 0 && (
                <div className="inv-warn-box">
                  <div style={{ fontWeight:700, marginBottom:6, display:"flex", gap:6, alignItems:"center" }}><MdWarning /> Campos con valores vacíos</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {warnFields.map(f => (
                      <span key={f} style={{ background:"#fef5e7", border:"1px solid #f6e05e", borderRadius:6, padding:"2px 10px", fontSize:".8rem", fontWeight:700, color:"#975a16" }}>
                        {IMPORTANT_FIELDS[f]}: {emptyFields[f]} vacío{emptyFields[f]>1?"s":""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="inv-export-table-wrap">
                <table className="inv-export-table">
                  <thead><tr><th>#</th><th>Producto</th><th>Sucursal</th><th>Categoría</th><th>Stock</th><th>Mín.</th><th>Estado</th></tr></thead>
                  <tbody>
                    {exportData.map((item, idx) => {
                      const hasEmpty = warnFields.some(f => item[f] === undefined || item[f] === null || item[f] === "");
                      const status = getStockStatus(item);
                      return (
                        <tr key={item.id} className={hasEmpty ? "inv-cell-warn" : ""}>
                          <td style={{ color:"#a0aec0", fontSize:".75rem" }}>{idx+1}</td>
                          <td style={{ fontWeight:600, color:"#1e3a5f" }}>{item.producto || <span className="inv-cell-empty">vacío</span>}</td>
                          <td>{item.sucursal || <span className="inv-cell-empty">—</span>}</td>
                          <td>{item.categoria || <span className="inv-cell-empty">—</span>}</td>
                          <td style={{ fontWeight:700 }}>{item.stock ?? <span className="inv-cell-empty">—</span>}</td>
                          <td style={{ color:"#718096" }}>{item.min_stock}</td>
                          <td><span className={`inv-badge ${status.cls}`}>{status.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="inv-info-box">💡 El CSV incluirá: producto, sucursal, branch_id, stock, min_stock y estado.</div>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn-cancel" onClick={() => setShowExport(false)}>Cancelar</button>
              <button className="inv-btn-save" onClick={handleExportConfirm}>
                <MdFileDownload size={16} /> Descargar CSV ({exportData.length} registros)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit stock */}
      {editing && (
        <div className="inv-modal-overlay" onClick={() => setEditing(null)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3>Editar Stock</h3>
              <button className="inv-modal-close" onClick={() => setEditing(null)}><MdClose /></button>
            </div>
            <div className="inv-modal-body">
              <div style={{ background:"#f7fafc", borderRadius:8, padding:12, fontSize:"0.9rem", color:"#4a5568" }}>
                <strong>{editing.producto}</strong> — {editing.sucursal}
              </div>
              <div className="inv-form-group"><label>Stock actual</label><input type="number" min="0" value={editStock} onChange={e => setEditStock(e.target.value)} /></div>
              <div className="inv-form-group"><label>Stock mínimo</label><input type="number" min="0" value={editMin} onChange={e => setEditMin(e.target.value)} /></div>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn-cancel" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="inv-btn-save" onClick={handleSave}><MdCheckCircle size={16}/> Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import CSV */}
      {showImport && (
        <div className="inv-modal-overlay" onClick={() => { setShowImport(false); setImportRows([]); }}>
          <div className="inv-modal inv-modal-md" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3>Importar inventario desde CSV</h3>
              <button className="inv-modal-close" onClick={() => { setShowImport(false); setImportRows([]); }}><MdClose /></button>
            </div>
            <div className="inv-modal-body">
              {importDups.length > 0 && (
                <div className="inv-warn-box">
                  <div style={{ fontWeight:700, marginBottom:6, display:"flex", gap:6, alignItems:"center" }}>
                    <MdWarning/> {importDups.length} registro(s) ya existen en ese producto + sucursal
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <button className="inv-btn-cancel" style={{ flex:1, fontSize:".82rem", color:dupAction==="skip"?"#1e3a5f":"#2d3748", borderColor:dupAction==="skip"?"#1e3a5f":"#e2e8f0", background:dupAction==="skip"?"#ebf8ff":"white" }} onClick={() => setDupAction("skip")}>Ignorar duplicados</button>
                    <button className="inv-btn-cancel" style={{ flex:1, fontSize:".82rem", color:dupAction==="update"?"#1e3a5f":"#2d3748", borderColor:dupAction==="update"?"#1e3a5f":"#e2e8f0", background:dupAction==="update"?"#ebf8ff":"white" }} onClick={() => setDupAction("update")}>Actualizar existentes</button>
                  </div>
                </div>
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span className="inv-summary-badge new" style={{ fontSize:".82rem" }}>📄 {importRows.length} fila{importRows.length!==1?"s":""} en el CSV</span>
                <span className="inv-summary-badge new">{importRows.length - importDups.length} nuevos</span>
                {importDups.length > 0 && <span className="inv-summary-badge dup">⚠ {importDups.length} duplicados</span>}
              </div>
              <div className="inv-export-table-wrap">
                <table className="inv-export-table">
                  <thead><tr><th>#</th><th>Producto</th><th>Sucursal</th><th>Branch ID</th><th>Stock</th><th>Mín.</th></tr></thead>
                  <tbody>
                    {importRows.map((r, i) => {
                      const isDup = !!importDups.find(d =>
                        (d.producto||"").toLowerCase().trim() === (r.producto||"").toLowerCase().trim() &&
                        String(d.branch_id) === String(r.branch_id)
                      );
                      return (
                        <tr key={i} style={isDup ? { background:"#fffbeb" } : {}}>
                          <td style={{ color:"#a0aec0", fontSize:".75rem" }}>{i+1}</td>
                          <td style={{ fontWeight:600, color:"#1e3a5f" }}>
                            {r.producto || <span className="inv-cell-empty">—</span>}
                            {isDup && <span style={{ marginLeft:6, background:"#fef5e7", border:"1px solid #f6e05e", borderRadius:4, padding:"1px 6px", fontSize:".7rem", color:"#975a16", fontWeight:700 }}>dup</span>}
                          </td>
                          <td>{r.sucursal || "—"}</td>
                          <td>{r.branch_id}</td>
                          <td style={{ fontWeight:700 }}>{r.stock}</td>
                          <td style={{ color:"#718096" }}>{r.min_stock || 40}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="inv-info-box">
                <strong>📋 Columnas requeridas:</strong> <code>producto, branch_id, stock, min_stock</code>
                <div style={{ marginTop:8 }}>
                  <button onClick={handleDownloadTemplate} style={{ background:"none", border:"none", color:"#2b6cb0", fontWeight:700, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit", fontSize:"inherit" }}>
                    📥 Descargar plantilla CSV
                  </button>
                </div>
              </div>
            </div>
            {importing && importProgress && importProgress.total > 0 && (
              <div style={{ padding:"0 24px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", color:"#4a5568", marginBottom:5, fontWeight:600 }}>
                  <span>⏳ Procesando {importProgress.done} de {importProgress.total}…</span>
                  <span style={{ color:"#276749" }}>{Math.round((importProgress.done / importProgress.total) * 100)}%</span>
                </div>
                <div style={{ height:8, background:"#e2e8f0", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:4, background:"linear-gradient(90deg,#1e3a5f,#2c5282)", width:`${(importProgress.done/importProgress.total)*100}%`, transition:"width .25s ease" }} />
                </div>
              </div>
            )}
            <div className="inv-modal-footer">
              <button className="inv-btn-cancel" onClick={() => { setShowImport(false); setImportRows([]); }} disabled={importing}>Cancelar</button>
              <button className="inv-btn-save" onClick={handleImportConfirm} disabled={importing || (importDups.length > 0 && !dupAction)}>
                {importing ? <><MdRefresh size={16} className="spinning"/> Importando…</> : <><MdCheckCircle size={16}/> Confirmar importación</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Summary */}
      {showSummary && importResult && (
        <div className="inv-modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="inv-modal inv-modal-md" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3>✅ Importación completada</h3>
              <button className="inv-modal-close" onClick={() => setShowSummary(false)}><MdClose /></button>
            </div>
            <div className="inv-modal-body">
              <div className="inv-success-box">
                Se procesaron <strong>{importResult.total}</strong> fila{importResult.total !== 1 ? "s" : ""} del CSV.
              </div>
              <div className="inv-result-grid">
                <div className="inv-result-card created"><span className="inv-result-num created">{importResult.created}</span><span>🆕 Registros creados</span></div>
                <div className="inv-result-card updated"><span className="inv-result-num updated">{importResult.updated}</span><span>✏️ Actualizados</span></div>
                <div className="inv-result-card skipped"><span className="inv-result-num skipped">{importResult.skipped}</span><span>⏭ Omitidos</span></div>
                <div className="inv-result-card errors"><span className="inv-result-num errors">{importResult.errors}</span><span>❌ Errores</span></div>
              </div>
              {importResult.errors > 0 && (
                <div className="inv-warn-box">
                  <strong>⚠ {importResult.errors} fila(s) no se pudieron importar.</strong>
                  {importResult.noMatchNames?.length > 0 && (
                    <div style={{ marginTop:10 }}>
                      <div style={{ fontWeight:700, marginBottom:4, fontSize:".82rem" }}>🔍 {importResult.noMatchNames.length} producto(s) no encontrados:</div>
                      <div style={{ maxHeight:100, overflowY:"auto", background:"#fffbeb", borderRadius:6, padding:"6px 10px" }}>
                        {importResult.noMatchNames.map((n, i) => <div key={i} style={{ fontSize:".78rem", padding:"2px 0", borderBottom:"1px solid #fbd38d", color:"#744210" }}>• {n}</div>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn-save" onClick={() => setShowSummary(false)}><MdCheckCircle size={16} /> Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`inv-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
