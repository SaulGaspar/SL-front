import React, { useState, useEffect } from "react";
import {
  MdBackup, MdDownload, MdDelete, MdRefresh, MdStorage,
  MdCheckCircle, MdWarning, MdInfo, MdSchedule, MdAutorenew,
  MdPerson, MdPlayArrow, MdPause, MdSettings, MdHistory,
  MdCloud, MdAccessTime, MdCalendarMonth, MdTimer,
} from "react-icons/md";

const API_URL = "https://sl-back.vercel.app";
const token   = () => localStorage.getItem("token");
const hdrs    = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

const fmtBytes = (b) => {
  if (!b) return "—";
  if (b < 1024)        return `${b} B`;
  if (b < 1024*1024)   return `${(b/1024).toFixed(1)} KB`;
  return `${(b/(1024*1024)).toFixed(2)} MB`;
};

const fmtFecha = (f) => {
  if (!f) return "—";
  return new Date(f).toLocaleString("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
};

const getTipo    = (b) => (b.creado_por==="sistema" || b.nombre?.includes("_auto_")) ? "auto" : "manual";
const getSubtipo = (nombre="") => {
  if (nombre.includes("_diario_"))  return "diario";
  if (nombre.includes("_semanal_")) return "semanal";
  if (nombre.includes("_mensual_")) return "mensual";
  return null;
};

const DIAS_SEMANA = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
.bk * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

/* ── Layout ── */
.bk-page-header { margin-bottom: 28px; }
.bk-page-header h2 { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #0f1f3d; letter-spacing: -.5px; }
.bk-page-header p  { margin: 0; color: #64748b; font-size: .88rem; }

/* ── Stats row ── */
.bk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 28px; }
.bk-stat { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.07); border: 1px solid #f1f5f9; position: relative; overflow: hidden; }
.bk-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: var(--accent, #1e3a8a); }
.bk-stat-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--icon-bg, #eff6ff); color: var(--icon-color, #1e40af); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.bk-stat-label { font-size: .72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.bk-stat-val { font-size: 1.8rem; font-weight: 800; color: #0f1f3d; line-height: 1; }
.bk-stat-sub { font-size: .76rem; color: #94a3b8; margin-top: 5px; }

/* ── Section headers ── */
.bk-section { margin-bottom: 28px; }
.bk-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.bk-section-header-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bk-section-title-block h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #0f1f3d; }
.bk-section-title-block p  { margin: 0; font-size: .78rem; color: #94a3b8; }

/* ── Schedule config card ── */
.bk-sched-config { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.bk-sched-config-top { background: linear-gradient(135deg, #0f2460 0%, #1e3a8a 100%); padding: 22px 24px; }
.bk-sched-config-top h3 { margin: 0 0 4px; color: #fff; font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 9px; }
.bk-sched-config-top p  { margin: 0; color: rgba(255,255,255,.65); font-size: .82rem; }
.bk-sched-config-body { padding: 24px; }

.bk-freq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
.bk-freq-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all .18s; background: #fafafa; text-align: center; }
.bk-freq-card:hover { border-color: #1e3a8a; background: #f0f4ff; }
.bk-freq-card.active { border-color: #1e3a8a; background: #eff6ff; }
.bk-freq-card.active .bk-freq-card-icon { background: #1e3a8a; color: #fff; }
.bk-freq-card-icon { width: 36px; height: 36px; border-radius: 9px; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; transition: all .18s; }
.bk-freq-card-label { font-size: .8rem; font-weight: 700; color: #0f1f3d; }
.bk-freq-card-desc  { font-size: .69rem; color: #94a3b8; margin-top: 2px; }

.bk-config-row { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.bk-config-field { flex: 1; min-width: 160px; }
.bk-config-field label { display: block; font-size: .76rem; font-weight: 700; color: #374151; margin-bottom: 7px; }
.bk-time-input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: .88rem; color: #0f1f3d; background: #fff; font-family: 'Sora', sans-serif; width: 100%; transition: border-color .15s; }
.bk-time-input:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,.1); }
.bk-day-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.bk-day-btn { padding: 7px 13px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; }
.bk-day-btn:hover { border-color: #1e3a8a; color: #1e3a8a; background: #eff6ff; }
.bk-day-btn.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
.bk-hours-btns { display: flex; gap: 6px; }
.bk-hours-btn { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fafafa; font-size: .8rem; font-weight: 700; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; color: #64748b; }
.bk-hours-btn.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }

/* ── Schedules table ── */
.bk-sched-table-wrap { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
.bk-sched-table-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
.bk-sched-table-header h3 { margin: 0; font-size: .95rem; font-weight: 700; color: #0f1f3d; }
.bk-sched-table { width: 100%; border-collapse: collapse; }
.bk-sched-table thead { background: #0f2460; }
.bk-sched-table th { padding: 11px 16px; color: rgba(255,255,255,.85); font-size: .68rem; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; text-align: left; white-space: nowrap; }
.bk-sched-table td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; font-size: .82rem; color: #374151; }
.bk-sched-table tbody tr:last-child td { border-bottom: none; }
.bk-sched-table tbody tr:hover td { background: #fafcff; }
.bk-badge-active   { background: #dcfce7; color: #15803d; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; }
.bk-badge-inactive { background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; }
.bk-cron-code { font-family: 'JetBrains Mono', monospace; font-size: .76rem; background: #1e293b; color: #7dd3fc; padding: 3px 8px; border-radius: 5px; }

/* ── Buttons ── */
.bk-btn { padding: 10px 18px; border-radius: 9px; border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: .86rem; font-weight: 700; display: inline-flex; align-items: center; gap: 7px; transition: all .2s; }
.bk-btn-primary { background: #1e3a8a; color: white; box-shadow: 0 4px 12px rgba(30,58,138,.25); }
.bk-btn-primary:hover { background: #1e40af; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(30,58,138,.35); }
.bk-btn-ghost { background: #f8fafc; color: #374151; border: 1.5px solid #e2e8f0; }
.bk-btn-ghost:hover { background: #f1f5f9; }
.bk-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.bk-btn-save { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #fff; box-shadow: 0 4px 14px rgba(30,58,138,.3); }
.bk-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,58,138,.4); }

.bk-icon-btn { padding: 7px 11px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-family: 'Sora', sans-serif; font-weight: 600; transition: all .15s; border: 1.5px solid; }
.bk-icon-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Toolbar ── */
.bk-toolbar { background: white; padding: 14px 18px; border-radius: 14px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.06); border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.bk-filter-chips { display: flex; gap: 6px; }
.bk-chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white; font-size: .76rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all .15s; font-family: 'Sora', sans-serif; }
.bk-chip:hover { border-color: #1e3a8a; color: #1e3a8a; }
.bk-chip.active { background: #1e3a8a; color: white; border-color: #1e3a8a; }

/* ── Backups table ── */
.bk-table-wrap { background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.06); border: 1px solid #f1f5f9; overflow: hidden; }
.bk-table { width: 100%; border-collapse: collapse; }
.bk-table thead { background: #f8fafc; }
.bk-table th { padding: 12px 16px; text-align: left; font-size: .68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .6px; border-bottom: 2px solid #f1f5f9; white-space: nowrap; }
.bk-table td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.bk-table tbody tr:hover { background: #fafcff; }
.bk-table tbody tr:last-child td { border-bottom: none; }
.bk-empty { padding: 56px; text-align: center; color: #94a3b8; }
.bk-foot { padding: 10px 16px; font-size: .77rem; color: #94a3b8; border-top: 1px solid #f1f5f9; }

.bk-filename { font-weight: 700; color: #0f1f3d; font-size: .82rem; font-family: 'JetBrains Mono', monospace; }
.bk-size-chip { background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-size: .76rem; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }

.bk-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: .74rem; font-weight: 700; }
.bk-badge-auto   { background: #ede9fe; color: #5b21b6; }
.bk-badge-manual { background: #dcfce7; color: #14532d; }
.bk-badge-sub    { background: #fef3c7; color: #78350f; font-size: .68rem; padding: 2px 8px; margin-left: 4px; }

.bk-row-actions { display: flex; gap: 6px; }
.bk-act { padding: 7px 13px; border: none; border-radius: 8px; cursor: pointer; font-size: .78rem; font-family: 'Sora', sans-serif; font-weight: 700; display: flex; align-items: center; gap: 5px; transition: all .15s; }
.bk-act-dl  { background: #dcfce7; color: #166534; }
.bk-act-dl:hover  { background: #bbf7d0; }
.bk-act-del { background: #fee2e2; color: #991b1b; }
.bk-act-del:hover { background: #fca5a5; }
.bk-act:disabled { opacity: .4; cursor: not-allowed; }

/* ── Modals & overlays ── */
.bk-overlay { position: fixed; inset: 0; background: rgba(15,31,61,.55); backdrop-filter: blur(4px); z-index: 4000; display: flex; align-items: center; justify-content: center; padding: 16px; }
.bk-modal { background: white; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 28px 64px rgba(0,0,0,.25); animation: bkIn .22s ease; padding: 30px; text-align: center; }
@keyframes bkIn { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
.bk-modal-icon { font-size: 3rem; margin-bottom: 12px; }
.bk-modal h3 { margin: 0 0 8px; color: #0f1f3d; font-size: 1.1rem; font-weight: 800; }
.bk-modal p  { margin: 0 0 24px; color: #64748b; font-size: .88rem; line-height: 1.55; }
.bk-modal-actions { display: flex; gap: 10px; justify-content: center; }

.bk-generating { position: fixed; inset: 0; background: rgba(15,31,61,.7); backdrop-filter: blur(6px); z-index: 5000; display: flex; align-items: center; justify-content: center; }
.bk-generating-box { background: white; border-radius: 20px; padding: 40px 52px; text-align: center; box-shadow: 0 28px 64px rgba(0,0,0,.3); }
.bk-generating-box h3 { margin: 18px 0 8px; color: #0f1f3d; font-size: 1.15rem; font-weight: 800; }
.bk-generating-box p  { margin: 0; color: #64748b; font-size: .88rem; }
.bk-spinner { width: 56px; height: 56px; border: 5px solid #e2e8f0; border-top-color: #1e3a8a; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.bk-toast { position: fixed; bottom: 28px; right: 28px; z-index: 9999; padding: 13px 22px; border-radius: 12px; color: white; font-family: 'Sora', sans-serif; font-size: .86rem; font-weight: 700; box-shadow: 0 8px 28px rgba(0,0,0,.22); animation: bkIn .3s ease; display: flex; align-items: center; gap: 9px; }
.bk-toast.ok  { background: linear-gradient(135deg, #166534, #15803d); }
.bk-toast.err { background: linear-gradient(135deg, #991b1b, #b91c1c); }

.spinning { animation: spin .8s linear infinite; }

/* ── Divider ── */
.bk-divider { display: flex; align-items: center; gap: 16px; margin: 32px 0; }
.bk-divider::before, .bk-divider::after { content:''; flex:1; height:1px; background: #e2e8f0; }
.bk-divider span { font-size: .72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; }
`;

export default function Respaldos() {
  const [backups,     setBackups]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [generating,  setGenerating]  = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [toast,       setToast]       = useState(null);
  const [filtro,      setFiltro]      = useState("todos");

  const [schedules,       setSchedules]       = useState([]);
  const [schedLoading,    setSchedLoading]    = useState(false);
  const [newFreq,         setNewFreq]         = useState("diario");
  const [newHora,         setNewHora]         = useState("02:00");
  const [newDiaSem,       setNewDiaSem]       = useState(0);
  const [newCadaHoras,    setNewCadaHoras]    = useState(6);
  const [savingSched,     setSavingSched]     = useState(false);
  const [runningId,       setRunningId]       = useState(null);
  const [deletingSchedId, setDeletingSchedId] = useState(null);

  useEffect(() => { fetchBackups(); fetchSchedules(); }, []);

  const showToast = (msg, type="ok") => {
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
      const res  = await fetch(`${API_URL}/api/admin/backups/generate`, { method:"POST", headers:hdrs() });
      const data = await res.json();
      if (res.ok) { showToast(`✅ Backup generado: ${data.nombre}`); fetchBackups(); }
      else showToast(data.error || "Error generando backup", "err");
    } catch { showToast("Error de conexión al generar backup", "err"); }
    finally { setGenerating(false); }
  };

  const handleDownload = async (backup) => {
    setDownloading(backup.id);
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/${backup.id}/download`, { headers:hdrs() });
      const data = await res.json();
      if (res.ok) {
        const fileRes = await fetch(data.url);
        const blob    = await fileRes.blob();
        const url     = URL.createObjectURL(new Blob([blob], { type:"application/octet-stream" }));
        const a       = document.createElement("a");
        a.href = url; a.download = data.nombre;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        showToast(`📥 Descargando ${data.nombre}`);
      } else showToast(data.error || "Error al descargar", "err");
    } catch { showToast("Error de conexión al descargar", "err"); }
    finally { setDownloading(null); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/backups/${confirmDel.id}`, { method:"DELETE", headers:hdrs() });
      if (res.ok) { showToast("Backup eliminado correctamente"); fetchBackups(); }
      else { const d = await res.json(); showToast(d.error || "Error al eliminar", "err"); }
    } catch { showToast("Error de conexión al eliminar", "err"); }
    finally { setDeleting(false); setConfirmDel(null); }
  };

  const fetchSchedules = async () => {
    setSchedLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/backups/schedules`, { headers:hdrs() });
      if (res.ok) setSchedules(await res.json());
    } catch {}
    finally { setSchedLoading(false); }
  };

  const handleSaveSchedule = async () => {
    setSavingSched(true);
    try {
      const body = {
        frecuencia: newFreq,
        hora:       newHora,
        dia_semana: newFreq==="semanal" ? parseInt(newDiaSem)   : null,
        cada_horas: newFreq==="horas"   ? parseInt(newCadaHoras): null,
      };
      const res  = await fetch(`${API_URL}/api/admin/backups/schedules`, {
        method:"POST", headers:hdrs(), body:JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) { showToast(`✅ Programación guardada (${data.cron_expr})`); await fetchSchedules(); }
      else showToast(data.error || "Error guardando programación", "err");
    } catch { showToast("Error de conexión", "err"); }
    finally { setSavingSched(false); }
  };

  const handleToggleSchedule = async (id) => {
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/schedules/${id}/toggle`, { method:"PATCH", headers:hdrs() });
      const data = await res.json();
      if (res.ok) { showToast(data.activo?"▶️ Activada":"⏸️ Pausada"); await fetchSchedules(); }
      else showToast(data.error||"Error", "err");
    } catch { showToast("Error de conexión", "err"); }
  };

  const handleRunSchedule = async (id) => {
    setRunningId(id);
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/schedules/${id}/run`, { method:"POST", headers:hdrs() });
      const data = await res.json();
      if (res.ok) { showToast(`✅ Backup ejecutado: ${data.nombre}`); await fetchBackups(); }
      else showToast(data.error||"Error ejecutando backup", "err");
    } catch { showToast("Error de conexión", "err"); }
    finally { setRunningId(null); }
  };

  const handleDeleteSchedule = async (id) => {
    setDeletingSchedId(id);
    try {
      const res  = await fetch(`${API_URL}/api/admin/backups/schedules/${id}`, { method:"DELETE", headers:hdrs() });
      const data = await res.json();
      if (res.ok) { showToast("Programación eliminada"); await fetchSchedules(); }
      else showToast(data.error||"Error", "err");
    } catch { showToast("Error de conexión", "err"); }
    finally { setDeletingSchedId(null); }
  };

  const fmtFrecuencia = (s) => {
    if (s.frecuencia==="diario")  return `Diario a las ${s.hora}`;
    if (s.frecuencia==="semanal") return `${DIAS_SEMANA[s.dia_semana??0]} a las ${s.hora}`;
    if (s.frecuencia==="mensual") return `Día 1 de cada mes a las ${s.hora}`;
    if (s.frecuencia==="horas")   return `Cada ${s.cada_horas}h`;
    return s.cron_expr || "—";
  };

  const totalBytes   = backups.reduce((s,b) => s+(b.tamanio_bytes||0), 0);
  const ultimoBackup = backups[0]?.creado_at;
  const totalAuto    = backups.filter(b=>getTipo(b)==="auto").length;
  const totalManual  = backups.filter(b=>getTipo(b)==="manual").length;
  const activeScheds = schedules.filter(s=>s.activo).length;

  const backupsFiltrados = backups.filter(b => {
    if (filtro==="todos")  return true;
    if (filtro==="auto")   return getTipo(b)==="auto";
    if (filtro==="manual") return getTipo(b)==="manual";
    return true;
  });

  const FREQ_OPTIONS = [
    { val:"diario",  icon:<MdTimer size={18}/>,       label:"Una vez al día",       desc:"Ideal para producción" },
    { val:"horas",   icon:<MdAccessTime size={18}/>,  label:"Cada varias horas",    desc:"Alta disponibilidad" },
    { val:"semanal", icon:<MdCalendarMonth size={18}/>,label:"Una vez a la semana", desc:"Moderado" },
    { val:"mensual", icon:<MdSchedule size={18}/>,    label:"Una vez al mes",       desc:"Archivado" },
  ];

  return (
    <div className="bk">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="bk-page-header">
        <h2>💾 Respaldos de la Base de Datos</h2>
        <p>Copias de seguridad almacenadas en Supabase Storage · Los enlaces de descarga expiran en 60 segundos</p>
      </div>

      {/* ── Stats ── */}
      <div className="bk-stats">
        <div className="bk-stat" style={{"--accent":"#2563eb","--icon-bg":"#eff6ff","--icon-color":"#1e40af"}}>
          <div className="bk-stat-icon"><MdBackup size={20}/></div>
          <div className="bk-stat-label">Total backups</div>
          <div className="bk-stat-val">{backups.length}</div>
          <div className="bk-stat-sub">{totalManual} manuales · {totalAuto} automáticos</div>
        </div>
        <div className="bk-stat" style={{"--accent":"#7c3aed","--icon-bg":"#f5f3ff","--icon-color":"#7c3aed"}}>
          <div className="bk-stat-icon"><MdCloud size={20}/></div>
          <div className="bk-stat-label">Espacio en Supabase</div>
          <div className="bk-stat-val" style={{fontSize:"1.4rem"}}>{fmtBytes(totalBytes)}</div>
          <div className="bk-stat-sub">almacenamiento total</div>
        </div>
        <div className="bk-stat" style={{"--accent":"#0891b2","--icon-bg":"#ecfeff","--icon-color":"#0e7490"}}>
          <div className="bk-stat-icon"><MdHistory size={20}/></div>
          <div className="bk-stat-label">Último backup</div>
          <div className="bk-stat-val" style={{fontSize:"1rem",marginTop:6}}>{ultimoBackup?fmtFecha(ultimoBackup):"—"}</div>
          <div className="bk-stat-sub">{ultimoBackup?(getTipo(backups[0])==="auto"?"🤖 automático":"👤 manual"):"ninguno aún"}</div>
        </div>
        <div className="bk-stat" style={{"--accent":"#16a34a","--icon-bg":"#f0fdf4","--icon-color":"#15803d"}}>
          <div className="bk-stat-icon"><MdSettings size={20}/></div>
          <div className="bk-stat-label">Programaciones activas</div>
          <div className="bk-stat-val">{activeScheds}</div>
          <div className="bk-stat-sub">de {schedules.length} configuradas</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* SECCIÓN 1 — CONFIGURAR RESPALDO AUTOMÁTICO  */}
      {/* ════════════════════════════════════════════ */}
      <div className="bk-section">
        <div className="bk-section-header">
          <div className="bk-section-header-icon" style={{background:"#eff6ff",color:"#1e40af"}}><MdSettings size={18}/></div>
          <div className="bk-section-title-block">
            <h3>Configurar respaldo automático</h3>
            <p>Define cuándo el servidor genera copias de seguridad de manera automática</p>
          </div>
        </div>

        <div className="bk-sched-config">
          <div className="bk-sched-config-top">
            <h3><MdAutorenew size={18}/> Nueva programación</h3>
            <p>El servidor ejecutará el backup en el horario configurado usando node-cron (zona horaria: Ciudad de México)</p>
          </div>
          <div className="bk-sched-config-body">

            {/* Frecuencia */}
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:".78rem",fontWeight:700,color:"#374151",marginBottom:10}}>¿Con qué frecuencia?</label>
              <div className="bk-freq-grid">
                {FREQ_OPTIONS.map(f=>(
                  <div key={f.val} className={`bk-freq-card${newFreq===f.val?" active":""}`} onClick={()=>setNewFreq(f.val)}>
                    <div className="bk-freq-card-icon">{f.icon}</div>
                    <div className="bk-freq-card-label">{f.label}</div>
                    <div className="bk-freq-card-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bk-config-row">
              {/* Hora */}
              {newFreq!=="horas" && (
                <div className="bk-config-field">
                  <label>¿A qué hora?</label>
                  <input type="time" value={newHora} onChange={e=>setNewHora(e.target.value)} className="bk-time-input"/>
                </div>
              )}
              {/* Cada cuántas horas */}
              {newFreq==="horas" && (
                <div className="bk-config-field">
                  <label>¿Cada cuántas horas?</label>
                  <div className="bk-hours-btns">
                    {[2,4,6,8,12].map(h=>(
                      <button key={h} className={`bk-hours-btn${newCadaHoras===h?" active":""}`} onClick={()=>setNewCadaHoras(h)}>{h}h</button>
                    ))}
                  </div>
                </div>
              )}
              {/* Día de la semana */}
              {newFreq==="semanal" && (
                <div className="bk-config-field" style={{flex:2}}>
                  <label>¿Qué día de la semana?</label>
                  <div className="bk-day-btns">
                    {DIAS_SEMANA.map((d,i)=>(
                      <button key={i} className={`bk-day-btn${newDiaSem===i?" active":""}`} onClick={()=>setNewDiaSem(i)}>{d.slice(0,3)}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="bk-btn bk-btn-save" onClick={handleSaveSchedule} disabled={savingSched}>
              {savingSched
                ? <><MdRefresh size={16} className="spinning"/> Guardando…</>
                : <><MdSchedule size={16}/> Guardar programación</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* SECCIÓN 2 — PROGRAMACIONES ACTIVAS           */}
      {/* ════════════════════════════════════════════ */}
      <div className="bk-section">
        <div className="bk-section-header">
          <div className="bk-section-header-icon" style={{background:"#f0fdf4",color:"#15803d"}}><MdTimer size={18}/></div>
          <div className="bk-section-title-block">
            <h3>Programaciones activas</h3>
            <p>Tareas cron corriendo en el servidor</p>
          </div>
        </div>

        <div className="bk-sched-table-wrap">
          <div className="bk-sched-table-header">
            <h3>☰ Lista de programaciones</h3>
            <button className="bk-btn bk-btn-ghost" onClick={fetchSchedules} disabled={schedLoading} style={{fontSize:".8rem",padding:"7px 13px"}}>
              <MdRefresh size={15} className={schedLoading?"spinning":""}/> Actualizar
            </button>
          </div>

          {schedLoading ? (
            <div style={{padding:"32px",textAlign:"center",color:"#94a3b8"}}>Cargando…</div>
          ) : schedules.length===0 ? (
            <div style={{padding:"48px",textAlign:"center",color:"#94a3b8"}}>
              <MdSchedule size={40} style={{display:"block",margin:"0 auto 12px",opacity:.35}}/>
              <p style={{margin:0,fontWeight:700,fontSize:".9rem"}}>Sin programaciones configuradas</p>
              <p style={{margin:"4px 0 0",fontSize:".8rem"}}>Crea una en la sección de arriba</p>
            </div>
          ) : (
            <table className="bk-sched-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Frecuencia</th>
                  <th>Expresión Cron</th>
                  <th>Última ejecución</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s=>(
                  <tr key={s.id}>
                    <td style={{fontWeight:700,color:"#0f1f3d"}}>{s.nombre}</td>
                    <td style={{color:"#475569"}}>{fmtFrecuencia(s)}</td>
                    <td><span className="bk-cron-code">{s.cron_expr}</span></td>
                    <td style={{color:"#94a3b8",fontSize:".8rem"}}>{s.ultima_ejecucion?new Date(s.ultima_ejecucion).toLocaleString("es-MX"):"—"}</td>
                    <td><span className={s.activo?"bk-badge-active":"bk-badge-inactive"}>{s.activo?"● Activa":"○ Inactiva"}</span></td>
                    <td>
                      <div style={{display:"flex",gap:6}}>
                        <button className="bk-icon-btn" onClick={()=>handleRunSchedule(s.id)} disabled={runningId===s.id} title="Ejecutar ahora" style={{borderColor:"#bbf7d0",background:"#f0fdf4",color:"#15803d"}}>
                          {runningId===s.id?<MdRefresh size={14} className="spinning"/>:<MdPlayArrow size={14}/>}
                        </button>
                        <button className="bk-icon-btn" onClick={()=>handleToggleSchedule(s.id)} title={s.activo?"Pausar":"Activar"} style={{borderColor:s.activo?"#fde68a":"#bbf7d0",background:s.activo?"#fffbeb":"#f0fdf4",color:s.activo?"#d97706":"#15803d"}}>
                          {s.activo?<MdPause size={14}/>:<MdPlayArrow size={14}/>}
                        </button>
                        <button className="bk-icon-btn" onClick={()=>handleDeleteSchedule(s.id)} disabled={deletingSchedId===s.id} title="Eliminar" style={{borderColor:"#fecaca",background:"#fef2f2",color:"#b91c1c"}}>
                          {deletingSchedId===s.id?<MdRefresh size={14} className="spinning"/>:<MdDelete size={14}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* SECCIÓN 3 — HISTORIAL DE BACKUPS             */}
      {/* ════════════════════════════════════════════ */}
      <div className="bk-section">
        <div className="bk-section-header">
          <div className="bk-section-header-icon" style={{background:"#faf5ff",color:"#7c3aed"}}><MdHistory size={18}/></div>
          <div className="bk-section-title-block">
            <h3>Historial de respaldos</h3>
            <p>Todos los backups almacenados en Supabase Storage</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bk-toolbar">
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <button className="bk-btn bk-btn-ghost" onClick={fetchBackups} disabled={loading} style={{fontSize:".82rem",padding:"8px 14px"}}>
              <MdRefresh size={16} className={loading?"spinning":""}/>
              Actualizar
            </button>
            <div className="bk-filter-chips">
              {["todos","manual","auto"].map(f=>(
                <button key={f} className={`bk-chip${filtro===f?" active":""}`} onClick={()=>setFiltro(f)}>
                  {f==="todos"?"Todos":f==="manual"?"👤 Manuales":"🤖 Automáticos"}
                </button>
              ))}
            </div>
          </div>
          <button className="bk-btn bk-btn-primary" onClick={handleGenerate} disabled={generating}>
            <MdBackup size={17}/>
            Generar backup ahora
          </button>
        </div>

        <div className="bk-table-wrap">
          {loading ? (
            <div className="bk-empty">Cargando respaldos…</div>
          ) : backupsFiltrados.length===0 ? (
            <div className="bk-empty">
              <MdStorage size={48} style={{display:"block",margin:"0 auto 12px",opacity:.3}}/>
              <p style={{margin:0,fontWeight:700,color:"#374151"}}>{filtro==="todos"?"No hay backups aún":"Sin backups con ese filtro"}</p>
              <p style={{margin:"6px 0 0",fontSize:".84rem"}}>
                {filtro==="todos"?"Genera el primero con el botón de arriba":"Cambia el filtro para ver otros"}
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
                  {backupsFiltrados.map(b=>{
                    const tipo    = getTipo(b);
                    const subtipo = getSubtipo(b.nombre);
                    return (
                      <tr key={b.id}>
                        <td><div className="bk-filename">{b.nombre}</div></td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                            {tipo==="auto"
                              ?<span className="bk-badge bk-badge-auto"><MdAutorenew size={13}/> Automático</span>
                              :<span className="bk-badge bk-badge-manual"><MdPerson size={13}/> Manual</span>}
                            {subtipo&&<span className="bk-badge bk-badge-sub">{subtipo}</span>}
                          </div>
                        </td>
                        <td><span className="bk-size-chip"><MdStorage size={13}/>{fmtBytes(b.tamanio_bytes)}</span></td>
                        <td style={{fontSize:".85rem",color:"#475569"}}>{b.creado_por==="sistema"?"🤖 sistema":b.creado_por||"—"}</td>
                        <td style={{fontSize:".82rem",color:"#64748b"}}>{fmtFecha(b.creado_at)}</td>
                        <td>
                          <div className="bk-row-actions">
                            <button className="bk-act bk-act-dl" onClick={()=>handleDownload(b)} disabled={downloading===b.id}>
                              {downloading===b.id?<MdRefresh size={14} className="spinning"/>:<MdDownload size={14}/>}
                              {downloading===b.id?"…":"Descargar"}
                            </button>
                            <button className="bk-act bk-act-del" onClick={()=>setConfirmDel(b)}>
                              <MdDelete size={14}/> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="bk-foot">{backupsFiltrados.length} backup{backupsFiltrados.length!==1?"s":""}{filtro!=="todos"&&` · filtro: ${filtro}`}</div>
            </>
          )}
        </div>
      </div>

      {/* Overlay generando */}
      {generating && (
        <div className="bk-generating">
          <div className="bk-generating-box">
            <div className="bk-spinner"/>
            <h3>Generando backup…</h3>
            <p>Exportando todas las tablas y subiendo a Supabase Storage</p>
            <p style={{marginTop:8,fontSize:".78rem",color:"#94a3b8"}}>Esto puede tardar unos segundos</p>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {confirmDel && (
        <div className="bk-overlay" onClick={()=>!deleting&&setConfirmDel(null)}>
          <div className="bk-modal" onClick={e=>e.stopPropagation()}>
            <div className="bk-modal-icon">🗑️</div>
            <h3>¿Eliminar este backup?</h3>
            <p>Se eliminará <strong>{confirmDel.nombre}</strong> de Supabase Storage y del registro.<br/><br/>
              <span style={{color:"#dc2626",fontWeight:700}}>Esta acción no se puede deshacer.</span></p>
            <div className="bk-modal-actions">
              <button className="bk-btn bk-btn-ghost" onClick={()=>setConfirmDel(null)} disabled={deleting}>Cancelar</button>
              <button className="bk-btn" style={{background:"#dc2626",color:"white"}} onClick={handleDelete} disabled={deleting}>
                {deleting?<><MdRefresh size={15} className="spinning"/> Eliminando…</>:<><MdDelete size={15}/> Sí, eliminar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`bk-toast ${toast.type}`}>
          {toast.type==="ok"?<MdCheckCircle size={18}/>:<MdWarning size={18}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}