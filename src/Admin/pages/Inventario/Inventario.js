import React, { useState, useEffect, useRef } from "react";
import { MdSearch, MdRefresh, MdEdit, MdWarning, MdCheckCircle, MdCancel, MdFileDownload, MdFileUpload, MdClose, MdVisibility, MdDateRange } from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const CSV_HEADERS        = ["producto","sucursal","branch_id","stock","min_stock","estado"];
const CSV_HEADERS_IMPORT = ["product_id","branch_id","stock","min_stock"];
const IMPORTANT_FIELDS   = { producto:"Producto", sucursal:"Sucursal", stock:"Stock", min_stock:"Stock Mínimo" };

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .inv-wrap { font-family: 'DM Sans', sans-serif; }
  .inv-toolbar {
    background: white; padding: 20px; border-radius: 12px;
    margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: space-between;
  }
  .inv-search-box { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
  .inv-search-box input { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; }
  .inv-search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1.2rem; }
  .inv-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; min-width: 160px; background: white; }
  .inv-date-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
  .inv-date-label { font-size: .75rem; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
  .inv-date-input { padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: .88rem; font-family: inherit; background: white; color: #2d3748; }
  .inv-date-input:focus { outline: none; border-color: #1e3a5f; }
  .inv-date-sep { color: #a0aec0; }
  .inv-date-clear { background: none; border: none; color: #a0aec0; cursor: pointer; font-size: .8rem; padding: 2px 6px; border-radius: 4px; font-family: inherit; }
  .inv-date-clear:hover { color: #e53e3e; background: #fff5f5; }
  .inv-btn { padding: 10px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit; font-size: .88rem; font-weight: 600; border: 1.5px solid transparent; transition: all .2s; }
  .inv-btn-refresh { background: #f7fafc; color: #2d3748; border-color: #e2e8f0; }
  .inv-btn-refresh:hover { background: #edf2f7; }
  .inv-btn-export { background: #ebf8ff; color: #2b6cb0; border-color: #bee3f8; }
  .inv-btn-export:hover { background: #bee3f8; }
  .inv-btn-import { background: #f0fff4; color: #276749; border-color: #c6f6d5; }
  .inv-btn-import:hover { background: #c6f6d5; }
  .inv-btn:disabled { opacity: .5; cursor: not-allowed; }
  .inv-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .inv-stat-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 4px; }
  .inv-stat-label { font-size: 0.8rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .inv-stat-value { font-size: 2rem; font-weight: 700; color: #1e3a5f; }
  .inv-stat-sub { font-size: 0.8rem; color: #a0aec0; }
  .inv-table-wrap { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
  .inv-table { width: 100%; border-collapse: collapse; }
  .inv-table thead { background: #f7fafc; }
  .inv-table th { padding: 14px 16px; text-align: left; font-size: 0.8rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
  .inv-table td { padding: 14px 16px; border-bottom: 1px solid #f0f4f8; color: #2d3748; vertical-align: middle; }
  .inv-table tbody tr:hover { background: #f7fafc; }
  .inv-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .inv-badge.ok  { background: #c6f6d5; color: #276749; }
  .inv-badge.low { background: #fef5e7; color: #975a16; }
  .inv-badge.out { background: #fed7d7; color: #9b2c2c; }
  .inv-progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 4px; overflow: hidden; }
  .inv-progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
  .inv-edit-btn { background: #bee3f8; color: #2c5282; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-family: inherit; }
  .inv-edit-btn:hover { background: #90cdf4; }
  .inv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
  .inv-modal { background: white; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif; animation: invIn .22s ease; }
  .inv-modal-lg  { max-width: 680px; max-height: 90vh; overflow-y: auto; }
  .inv-modal-md  { max-width: 520px; max-height: 90vh; overflow-y: auto; }
  @keyframes invIn { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .inv-modal-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; border-radius: 16px 16px 0 0; z-index: 1; }
  .inv-modal-header h3 { margin: 0; color: #1e3a5f; font-size: 1.1rem; font-weight: 700; }
  .inv-modal-close { background: #f7fafc; border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #718096; }
  .inv-modal-close:hover { background: #fed7d7; color: #9b2c2c; }
  .inv-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .inv-form-group { display: flex; flex-direction: column; gap: 6px; }
  .inv-form-group label { font-weight: 600; font-size: 0.9rem; color: #2d3748; }
  .inv-form-group input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; font-family: inherit; }
  .inv-form-group input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end; position: sticky; bottom: 0; background: white; border-radius: 0 0 16px 16px; }
  .inv-btn-cancel { padding: 10px 20px; border: 1px solid #e2e8f0; background: white; color: #2d3748; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; }
  .inv-btn-save { padding: 10px 20px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .inv-btn-save:hover { background: #2c5282; }
  .inv-btn-save:disabled { opacity: .5; cursor: not-allowed; }
  .inv-empty { padding: 48px; text-align: center; color: #718096; }
  .inv-info-box { background: #ebf8ff; border: 1px solid #bee3f8; color: #2c5282; padding: 12px 14px; border-radius: 8px; font-size: .84rem; line-height: 1.5; }
  .inv-warn-box { background: #fffbeb; border: 1px solid #f6e05e; color: #744210; padding: 12px 14px; border-radius: 8px; font-size: .84rem; line-height: 1.6; }
  .inv-success-box { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 14px 16px; border-radius: 10px; font-size: .88rem; line-height: 1.7; }
  .inv-summary-badge { padding: 5px 12px; border-radius: 20px; font-size: .8rem; font-weight: 700; }
  .inv-summary-badge.new { background: #c6f6d5; color: #276749; }
  .inv-summary-badge.dup { background: #fef5e7; color: #975a16; }
  .inv-export-table-wrap { max-height: 320px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; }
  .inv-export-table { width: 100%; border-collapse: collapse; font-size: .78rem; }
  .inv-export-table thead { position: sticky; top: 0; background: #f7fafc; z-index: 1; }
  .inv-export-table th { padding: 9px 12px; text-align: left; color: #4a5568; font-weight: 700; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
  .inv-export-table td { padding: 7px 12px; border-bottom: 1px solid #f0f4f8; }
  .inv-export-table tr:hover td { background: #f8fafc; }
  .inv-cell-empty { color: #cbd5e0; font-style: italic; font-size: .73rem; }
  .inv-cell-warn  { background: #fffbeb !important; }
  .inv-export-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
  .inv-export-stat { padding: 5px 14px; border-radius: 20px; font-size: .8rem; font-weight: 700; }
  .inv-export-stat.total { background: #ebf8ff; color: #2b6cb0; }
  .inv-export-stat.warn  { background: #fffbeb; color: #975a16; }
  .inv-export-stat.ok    { background: #c6f6d5; color: #276749; }
  .inv-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .inv-result-card { border-radius: 10px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; }
  .inv-result-card.created { background: #f0fff4; border: 1px solid #9ae6b4; }
  .inv-result-card.updated { background: #ebf8ff; border: 1px solid #90cdf4; }
  .inv-result-card.skipped { background: #f7fafc; border: 1px solid #e2e8f0; }
  .inv-result-card.errors  { background: #fff5f5; border: 1px solid #fc8181; }
  .inv-result-num { font-size: 2rem; font-weight: 700; line-height: 1; }
  .inv-result-num.created { color: #276749; }
  .inv-result-num.updated { color: #2b6cb0; }
  .inv-result-num.skipped { color: #718096; }
  .inv-result-num.errors  { color: #9b2c2c; }
  .inv-result-label { font-size: .8rem; font-weight: 600; color: #718096; }
  .inv-date-active { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: .82rem; color: #2b6cb0; }
  .inv-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 12px 20px; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); animation: invIn .3s ease; }
  .inv-toast.ok  { background: #276749; }
  .inv-toast.err { background: #9b2c2c; }
  .spinning { animation: spin .9s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

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

// ── Interpreta errores del backend ───────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

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

    // Paso 1: mapa nombre → product_id desde la API
    const productMap    = new Map();
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

    // Paso 2: mapas del inventario local
    const existingMap   = new Map(inventory.map(i => [`${norm(i.producto)}-${i.branch_id}`, i]));
    const existingByIds = new Map(inventory.map(i => [`${i.product_id}-${i.branch_id}`, i]));

    // Paso 3: pre-filtrar filas
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

    // ── Batch create (1 sola conexión) ────────────────────────────────────────
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
          // Fallback secuencial si batch no existe
          for (let i = 0; i < toCreate.length; i++) {
            const item = toCreate[i];
            setImportProgress({ done: i + 1, total: toCreate.length + toUpdate.length });
            try {
              const r = await fetch(`${API_URL}/api/admin/inventory`, {
                method: "POST", headers: authHeader,
                body: JSON.stringify({ product_id: item.product_id, branch_id: item.branch_id, stock: item.stock, min_stock: item.min_stock }),
              });
              if (r.ok) {
                created++;
              } else {
                const d = await r.json().catch(() => ({}));
                const errMsg = (d.error || "").toLowerCase();
                if (errMsg.includes("ya tiene") || errMsg.includes("error agregando")) {
                  // Intentar PUT automático si ya existe
                  const ex = existingByIds.get(`${item.product_id}-${item.branch_id}`);
                  if (ex) {
                    const pr = await fetch(`${API_URL}/api/admin/inventory/${ex.id}`, {
                      method: "PUT", headers: authHeader,
                      body: JSON.stringify({ stock: item.stock, min_stock: item.min_stock }),
                    });
                    if (pr.ok) updated++; else errors++;
                  } else errors++;
                } else {
                  errorDetails.push(interpretError(d.error, "create", item));
                  errors++;
                }
              }
            } catch { errors++; }
            await new Promise(r => setTimeout(r, 300));
          }
        }
      } catch (e) { console.error("Batch create error:", e); errors += toCreate.length; }
    }

    setImportProgress({ done: toCreate.length, total: toCreate.length + toUpdate.length });

    // ── Batch update (1 sola conexión) ────────────────────────────────────────
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
          // Fallback secuencial
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

  // ── RENDER ───────────────────────────────────────────────────────────────────

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

      {/* ── Modal: Export Preview ── */}
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

      {/* ── Modal: Edit stock ── */}
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

      {/* ── Modal: Import CSV ── */}
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
                    <button className="inv-btn-cancel" style={{ flex:1, fontSize:".82rem", color:dupAction==="skip"?"#1e3a5f":"#2d3748", borderColor:dupAction==="skip"?"#1e3a5f":"#e2e8f0", background:dupAction==="skip"?"#ebf8ff":"white" }} onClick={() => setDupAction("skip")}>
                      Ignorar duplicados
                    </button>
                    <button className="inv-btn-cancel" style={{ flex:1, fontSize:".82rem", color:dupAction==="update"?"#1e3a5f":"#2d3748", borderColor:dupAction==="update"?"#1e3a5f":"#e2e8f0", background:dupAction==="update"?"#ebf8ff":"white" }} onClick={() => setDupAction("update")}>
                      Actualizar existentes
                    </button>
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
              <button className="inv-btn-cancel" onClick={() => { setShowImport(false); setImportRows([]); }} disabled={importing}>
                Cancelar
              </button>
              <button className="inv-btn-save" onClick={handleImportConfirm} disabled={importing || (importDups.length > 0 && !dupAction)}>
                {importing ? <><MdRefresh size={16} className="spinning"/> Importando…</> : <><MdCheckCircle size={16}/> Confirmar importación</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Import Summary ── */}
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
                <div className="inv-result-card created">
                  <span className="inv-result-num created">{importResult.created}</span>
                  <span className="inv-result-label">🆕 Registros creados</span>
                </div>
                <div className="inv-result-card updated">
                  <span className="inv-result-num updated">{importResult.updated}</span>
                  <span className="inv-result-label">✏️ Actualizados</span>
                </div>
                <div className="inv-result-card skipped">
                  <span className="inv-result-num skipped">{importResult.skipped}</span>
                  <span className="inv-result-label">⏭ Omitidos</span>
                </div>
                <div className="inv-result-card errors">
                  <span className="inv-result-num errors">{importResult.errors}</span>
                  <span className="inv-result-label">❌ Errores</span>
                </div>
              </div>

              {importResult.errors > 0 && (
                <div className="inv-warn-box">
                  <strong>⚠ {importResult.errors} fila(s) no se pudieron importar.</strong>

                  {importResult.noMatchNames?.length > 0 && (
                    <div style={{ marginTop:10 }}>
                      <div style={{ fontWeight:700, marginBottom:4, fontSize:".82rem" }}>
                        🔍 {importResult.noMatchNames.length} producto(s) no encontrados en el catálogo:
                      </div>
                      <div style={{ maxHeight:100, overflowY:"auto", background:"#fffbeb", borderRadius:6, padding:"6px 10px" }}>
                        {importResult.noMatchNames.map((n, i) => (
                          <div key={i} style={{ fontSize:".78rem", padding:"2px 0", borderBottom:"1px solid #fbd38d", color:"#744210" }}>• {n}</div>
                        ))}
                      </div>
                      <div style={{ marginTop:6, fontSize:".76rem", color:"#92400e" }}>
                        Verifica que los nombres coincidan exactamente con los del catálogo de productos.
                      </div>
                    </div>
                  )}

                  {(() => {
                    const errs = (importResult.errorDetails || []).filter(e => typeof e === "object");
                    if (!errs.length) return null;
                    const grupos = errs.reduce((acc, e) => {
                      const k = e.tipo || "servidor";
                      if (!acc[k]) acc[k] = { msg: e.msg, items:[] };
                      acc[k].items.push(e.producto);
                      return acc;
                    }, {});
                    const iconos = {
                      duplicado:    { icon:"🔁", color:"#975a16", bg:"#fef5e7", border:"#f6e05e" },
                      no_encontrado:{ icon:"🔍", color:"#9b2c2c", bg:"#fff5f5", border:"#fc8181" },
                      inactivo:     { icon:"⛔", color:"#744210", bg:"#fffbeb", border:"#f6e05e" },
                      sucursal:     { icon:"🏪", color:"#9b2c2c", bg:"#fff5f5", border:"#fc8181" },
                      red:          { icon:"📡", color:"#2c5282", bg:"#ebf8ff", border:"#90cdf4" },
                      servidor:     { icon:"⚠️", color:"#744210", bg:"#fffbeb", border:"#f6e05e" },
                      desconocido:  { icon:"❓", color:"#718096", bg:"#f7fafc", border:"#e2e8f0" },
                    };
                    return (
                      <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
                        {Object.entries(grupos).map(([tipo, { msg, items }]) => {
                          const st = iconos[tipo] || iconos.desconocido;
                          return (
                            <div key={tipo} style={{ background:st.bg, border:`1px solid ${st.border}`, borderRadius:8, padding:"10px 12px" }}>
                              <div style={{ fontWeight:700, fontSize:".82rem", color:st.color, marginBottom:4 }}>
                                {st.icon} {msg} <span style={{ fontWeight:400 }}>({items.length} producto{items.length>1?"s":""})</span>
                              </div>
                              <div style={{ maxHeight:72, overflowY:"auto" }}>
                                {items.slice(0,5).map((p,i) => <div key={i} style={{ fontSize:".76rem", color:st.color, padding:"1px 0" }}>• {p}</div>)}
                                {items.length > 5 && <div style={{ fontSize:".74rem", color:"#a0aec0", marginTop:2 }}>…y {items.length-5} más</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn-save" onClick={() => setShowSummary(false)}>
                <MdCheckCircle size={16} /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`inv-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}