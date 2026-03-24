import React, { useState, useEffect } from "react";
import {
  MdBackup, MdDownload, MdDelete, MdRefresh, MdStorage,
  MdCheckCircle, MdWarning, MdInfo, MdSchedule, MdAutorenew, MdPerson,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const token   = () => localStorage.getItem("token");
const hdrs    = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

const fmtBytes = (b) => {
  if (!b) return "—";
  if (b < 1024)         return `${b} B`;
  if (b < 1024 * 1024)  return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
};

const fmtFecha = (f) => {
  if (!f) return "—";
  return new Date(f).toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Detecta si un backup fue automático según el nombre o el creador
const getTipo = (b) => {
  if (b.creado_por === "sistema") return "auto";
  if (b.nombre?.includes("_auto_")) return "auto";
  return "manual";
};

// Extrae el subtipo (diario/semanal/mensual) si es automático
const getSubtipo = (nombre = "") => {
  if (nombre.includes("_diario_"))  return "diario";
  if (nombre.includes("_semanal_")) return "semanal";
  if (nombre.includes("_mensual_")) return "mensual";
  return null;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
.bk * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

/* Stats */
.bk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.bk-stat { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
.bk-stat-label { font-size: .75rem; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: .5px; }
.bk-stat-val { font-size: 1.9rem; font-weight: 700; color: #1e3a5f; margin: 6px 0 2px; }
.bk-stat-sub { font-size: .78rem; color: #a0aec0; }

/* Info box */
.bk-info { background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; gap: 12px; align-items: flex-start; }
.bk-info svg { color: #2b6cb0; flex-shrink: 0; margin-top: 2px; }
.bk-info-text { font-size: .88rem; color: #2c5282; line-height: 1.6; }
.bk-info-text strong { display: block; margin-bottom: 4px; font-size: .92rem; }

/* Toolbar */
.bk-toolbar { background: white; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.05); display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.bk-toolbar-left { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.bk-filter-label { font-size: .82rem; font-weight: 600; color: #718096; }

/* Filtro chips */
.bk-filter-chips { display: flex; gap: 6px; }
.bk-chip { padding: 5px 13px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white; font-size: .78rem; font-weight: 600; color: #718096; cursor: pointer; transition: all .15s; }
.bk-chip:hover { border-color: #1e3a5f; color: #1e3a5f; }
.bk-chip.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }

/* Botones */
.bk-btn { padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer; font-family: inherit; font-size: .88rem; font-weight: 600; display: flex; align-items: center; gap: 7px; transition: all .2s; }
.bk-btn-primary { background: #1e3a5f; color: white; }
.bk-btn-primary:hover { background: #2c5282; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(30,58,95,.3); }
.bk-btn-ghost { background: #f7fafc; color: #2d3748; border: 1.5px solid #e2e8f0; }
.bk-btn-ghost:hover { background: #edf2f7; }
.bk-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

/* Tabla */
.bk-table-wrap { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.05); overflow: hidden; }
.bk-table { width: 100%; border-collapse: collapse; }
.bk-table thead { background: #f7fafc; }
.bk-table th { padding: 13px 16px; text-align: left; font-size: .74rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: .5px; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
.bk-table td { padding: 14px 16px; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
.bk-table tbody tr:hover { background: #f8fafc; }
.bk-table tbody tr:last-child td { border-bottom: none; }
.bk-empty { padding: 60px; text-align: center; color: #a0aec0; }
.bk-foot { padding: 10px 16px; font-size: .8rem; color: #718096; border-top: 1px solid #f0f4f8; }

/* Nombre archivo */
.bk-name { font-weight: 700; color: #1e3a5f; font-size: .85rem; font-family: 'Courier New', monospace; }

/* Chips de tamaño */
.bk-size-chip { background: #edf2f7; padding: 3px 10px; border-radius: 6px; font-size: .78rem; color: #4a5568; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }

/* ── Badges tipo ── */
.bk-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: .76rem; font-weight: 700; white-space: nowrap; }
.bk-badge-auto   { background: #e9d8fd; color: #553c9a; }
.bk-badge-manual { background: #c6f6d5; color: #22543d; }
.bk-badge-sub    { background: #feebc8; color: #7b341e; font-size: .7rem; padding: 2px 8px; margin-left: 4px; }

/* Acciones de fila */
.bk-row-actions { display: flex; gap: 6px; }
.bk-act { padding: 7px 12px; border: none; border-radius: 7px; cursor: pointer; font-size: .8rem; font-family: inherit; font-weight: 600; display: flex; align-items: center; gap: 4px; transition: all .15s; }
.bk-act-dl  { background: #c6f6d5; color: #276749; }
.bk-act-dl:hover  { background: #9ae6b4; }
.bk-act-del { background: #fed7d7; color: #9b2c2c; }
.bk-act-del:hover { background: #fc8181; color: white; }
.bk-act:disabled { opacity: .4; cursor: not-allowed; }

/* Modal confirmación */
.bk-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.bk-modal { background: white; border-radius: 16px; width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,.28); animation: bkIn .22s ease; padding: 28px; text-align: center; }
@keyframes bkIn { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
.bk-modal-icon { font-size: 2.8rem; margin-bottom: 12px; }
.bk-modal h3 { margin: 0 0 8px; color: #1e3a5f; font-size: 1.1rem; }
.bk-modal p  { margin: 0 0 24px; color: #718096; font-size: .9rem; line-height: 1.5; }
.bk-modal-actions { display: flex; gap: 10px; justify-content: center; }

/* Generando overlay */
.bk-generating { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 5000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.bk-generating-box { background: white; border-radius: 16px; padding: 36px 48px; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.3); }
.bk-generating-box h3 { margin: 16px 0 8px; color: #1e3a5f; font-size: 1.1rem; }
.bk-generating-box p  { margin: 0; color: #718096; font-size: .88rem; }
.bk-spinner { width: 52px; height: 52px; border: 5px solid #e2e8f0; border-top-color: #1e3a5f; border-radius: 50%; animation: spin .9s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.bk-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 12px 20px; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); animation: bkIn .3s ease; display: flex; align-items: center; gap: 8px; }
.bk-toast.ok  { background: #276749; }
.bk-toast.err { background: #9b2c2c; }

.spinning { animation: spin .9s linear infinite; }
`;

export default function Respaldos() {
  const [backups,     setBackups]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [generating,  setGenerating]  = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [toast,       setToast]       = useState(null);
  const [filtro,      setFiltro]      = useState("todos"); // todos | manual | auto

  useEffect(() => { fetchBackups(); }, []);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/backups`, { headers: hdrs() });
      if (res.ok) setBackups(await res.json());
      else showToast("Error cargando backups", "err");
    } catch { showToast("Error de conexión", "err"); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/generate`, { method: "POST", headers: hdrs() });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ Backup generado: ${data.nombre}`);
        fetchBackups();
      } else {
        showToast(data.error || "Error generando backup", "err");
      }
    } catch { showToast("Error de conexión al generar backup", "err"); }
    finally { setGenerating(false); }
  };

  const handleDownload = async (backup) => {
    setDownloading(backup.id);
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/${backup.id}/download`, { headers: hdrs() });
      const data = await res.json();
      if (res.ok) {
        const fileRes = await fetch(data.url);
        const blob    = await fileRes.blob();
        const url     = URL.createObjectURL(new Blob([blob], { type: "application/octet-stream" }));
        const a       = document.createElement("a");
        a.href        = url;
        a.download    = data.nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`📥 Descargando ${data.nombre}`);
      } else {
        showToast(data.error || "Error al descargar", "err");
      }
    } catch { showToast("Error de conexión al descargar", "err"); }
    finally { setDownloading(null); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/backups/${confirmDel.id}`, { method: "DELETE", headers: hdrs() });
      if (res.ok) {
        showToast("Backup eliminado correctamente");
        fetchBackups();
      } else {
        const d = await res.json();
        showToast(d.error || "Error al eliminar", "err");
      }
    } catch { showToast("Error de conexión al eliminar", "err"); }
    finally { setDeleting(false); setConfirmDel(null); }
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalBytes   = backups.reduce((s, b) => s + (b.tamanio_bytes || 0), 0);
  const ultimoBackup = backups[0]?.creado_at;
  const totalAuto    = backups.filter(b => getTipo(b) === "auto").length;
  const totalManual  = backups.filter(b => getTipo(b) === "manual").length;

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const backupsFiltrados = backups.filter(b => {
    if (filtro === "todos")  return true;
    if (filtro === "auto")   return getTipo(b) === "auto";
    if (filtro === "manual") return getTipo(b) === "manual";
    return true;
  });

  return (
    <div className="bk">
      <style>{CSS}</style>

      <div className="page-header">
        <h2>Respaldos</h2>
        <p>Copias de seguridad de la base de datos — guardadas en Supabase Storage</p>
      </div>

      {/* Stats */}
      <div className="bk-stats">
        <div className="bk-stat">
          <div className="bk-stat-label">Total backups</div>
          <div className="bk-stat-val">{backups.length}</div>
          <div className="bk-stat-sub">{totalManual} manuales · {totalAuto} automáticos</div>
        </div>
        <div className="bk-stat">
          <div className="bk-stat-label">Espacio usado</div>
          <div className="bk-stat-val" style={{ fontSize: "1.5rem" }}>{fmtBytes(totalBytes)}</div>
          <div className="bk-stat-sub">en Supabase Storage</div>
        </div>
        <div className="bk-stat">
          <div className="bk-stat-label">Último backup</div>
          <div className="bk-stat-val" style={{ fontSize: "1.1rem", marginTop: 10 }}>
            {ultimoBackup ? fmtFecha(ultimoBackup) : "—"}
          </div>
          <div className="bk-stat-sub">
            {ultimoBackup
              ? `${getTipo(backups[0]) === "auto" ? "🤖 automático" : "👤 manual"}`
              : "ninguno aún"}
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bk-info">
        <MdInfo size={22} />
        <div className="bk-info-text">
          <strong>¿Cómo funciona?</strong>
          Al hacer clic en <b>Generar backup</b>, el servidor exporta toda la base de datos como un archivo <code>.sql</code>, lo sube a Supabase Storage de forma privada y registra la metadata aquí.
          Los backups <b>automáticos</b> se ejecutan diario (2 AM), semanal (dom 3 AM) y mensual (día 1, 4 AM).
          Los enlaces de descarga expiran en <b>60 segundos</b> por seguridad.
        </div>
      </div>

      {/* Toolbar */}
      <div className="bk-toolbar">
        <div className="bk-toolbar-left">
          <button className="bk-btn bk-btn-ghost" onClick={fetchBackups} disabled={loading}>
            <MdRefresh size={18} className={loading ? "spinning" : ""} />
            Actualizar
          </button>
          <span className="bk-filter-label" style={{ marginLeft: 4 }}>Filtrar:</span>
          <div className="bk-filter-chips">
            {["todos", "manual", "auto"].map(f => (
              <button
                key={f}
                className={`bk-chip ${filtro === f ? "active" : ""}`}
                onClick={() => setFiltro(f)}
              >
                {f === "todos" ? "Todos" : f === "manual" ? "👤 Manuales" : "🤖 Automáticos"}
              </button>
            ))}
          </div>
        </div>
        <button className="bk-btn bk-btn-primary" onClick={handleGenerate} disabled={generating}>
          <MdBackup size={18} />
          Generar backup
        </button>
      </div>

      {/* Tabla */}
      <div className="bk-table-wrap">
        {loading ? (
          <div className="bk-empty">Cargando respaldos…</div>
        ) : backupsFiltrados.length === 0 ? (
          <div className="bk-empty">
            <MdStorage size={44} style={{ display: "block", margin: "0 auto 12px", color: "#cbd5e0" }} />
            <p style={{ margin: 0, fontWeight: 600, color: "#4a5568" }}>
              {filtro === "todos" ? "No hay backups aún" : `No hay backups ${filtro === "auto" ? "automáticos" : "manuales"}`}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: ".85rem" }}>
              {filtro === "todos" ? "Genera el primero con el botón de arriba" : "Cambia el filtro para ver otros"}
            </p>
          </div>
        ) : (
          <>
            <table className="bk-table">
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Tipo</th>
                  <th>Tamaño</th>
                  <th>Generado por</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {backupsFiltrados.map(b => {
                  const tipo    = getTipo(b);
                  const subtipo = getSubtipo(b.nombre);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="bk-name">{b.nombre}</div>
                      </td>

                      {/* ── Columna tipo ── */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                          {tipo === "auto" ? (
                            <span className="bk-badge bk-badge-auto">
                              <MdAutorenew size={13} /> Automático
                            </span>
                          ) : (
                            <span className="bk-badge bk-badge-manual">
                              <MdPerson size={13} /> Manual
                            </span>
                          )}
                          {subtipo && (
                            <span className="bk-badge bk-badge-sub">{subtipo}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="bk-size-chip">
                          <MdStorage size={13} />
                          {fmtBytes(b.tamanio_bytes)}
                        </span>
                      </td>
                      <td style={{ color: "#4a5568", fontSize: ".88rem" }}>
                        {b.creado_por === "sistema" ? "🤖 sistema" : b.creado_por || "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".85rem", color: "#4a5568" }}>
                          <MdSchedule size={15} />
                          {fmtFecha(b.creado_at)}
                        </div>
                      </td>
                      <td>
                        <div className="bk-row-actions">
                          <button
                            className="bk-act bk-act-dl"
                            onClick={() => handleDownload(b)}
                            disabled={downloading === b.id}
                            title="Descargar backup"
                          >
                            {downloading === b.id
                              ? <MdRefresh size={14} className="spinning" />
                              : <MdDownload size={14} />}
                            {downloading === b.id ? "…" : "Descargar"}
                          </button>
                          <button
                            className="bk-act bk-act-del"
                            onClick={() => setConfirmDel(b)}
                            title="Eliminar backup"
                          >
                            <MdDelete size={14} /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="bk-foot">
              {backupsFiltrados.length} backup{backupsFiltrados.length !== 1 ? "s" : ""}
              {filtro !== "todos" && ` · filtro: ${filtro}`}
            </div>
          </>
        )}
      </div>

      {/* Overlay generando */}
      {generating && (
        <div className="bk-generating">
          <div className="bk-generating-box">
            <div className="bk-spinner" />
            <h3>Generando backup…</h3>
            <p>Exportando todas las tablas y subiendo a Supabase Storage</p>
            <p style={{ marginTop: 8, fontSize: ".8rem", color: "#a0aec0" }}>Esto puede tardar unos segundos</p>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDel && (
        <div className="bk-overlay" onClick={() => !deleting && setConfirmDel(null)}>
          <div className="bk-modal" onClick={e => e.stopPropagation()}>
            <div className="bk-modal-icon">🗑️</div>
            <h3>¿Eliminar este backup?</h3>
            <p>
              Se eliminará <strong>{confirmDel.nombre}</strong> tanto de Supabase Storage como del registro.
              <br /><br />
              <span style={{ color: "#e53e3e", fontWeight: 600 }}>Esta acción no se puede deshacer.</span>
            </p>
            <div className="bk-modal-actions">
              <button className="bk-btn bk-btn-ghost" onClick={() => setConfirmDel(null)} disabled={deleting}>
                Cancelar
              </button>
              <button
                className="bk-btn"
                style={{ background: "#e53e3e", color: "white" }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? <><MdRefresh size={15} className="spinning" /> Eliminando…</>
                  : <><MdDelete size={15} /> Sí, eliminar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`bk-toast ${toast.type}`}>
          {toast.type === "ok" ? <MdCheckCircle size={18} /> : <MdWarning size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}