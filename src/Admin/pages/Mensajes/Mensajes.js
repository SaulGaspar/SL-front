import { API_BASE_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";

const API_URL = API_BASE_URL;
const auth = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });
const states = ["nuevo", "leido", "cerrado"];

import CSS from "./Mensajes.styles";

export default function Mensajes() {
  const [status, setStatus] = useState("nuevo");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => { setLoading(true); setError(""); try { const response = await fetch(`${API_URL}/api/admin/contact?status=${status}`, { headers: auth() }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "No se pudieron cargar los mensajes."); setMessages(data); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [status]);
  const updateStatus = async (message, nextStatus) => { try { const response = await fetch(`${API_URL}/api/admin/contact/${message.id}`, { method:"PATCH", headers:auth(), body:JSON.stringify({ estado:nextStatus }) }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "No se pudo actualizar el mensaje."); await load(); } catch (requestError) { setError(requestError.message); } };

  return <section className="cm-page"><style>{CSS}</style><header className="cm-head"><div><h2>Mensajes de contacto</h2><p>Consultas enviadas por clientes desde la tienda.</p></div><button className="cm-refresh" onClick={load}><MdRefresh /> Actualizar</button></header><div className="cm-tabs">{states.map((item) => <button key={item} className={`cm-tab ${status===item?"active":""}`} onClick={() => setStatus(item)}>{item[0].toUpperCase()+item.slice(1)}s</button>)}</div>{error && <div className="cm-error">{error}</div>}{loading ? <div className="cm-empty">Cargando mensajes...</div> : !messages.length ? <div className="cm-empty">No hay mensajes {status === "nuevo" ? "nuevos" : `en estado ${status}`}.</div> : <div className="cm-list">{messages.map((message) => <article className="cm-message" key={message.id}><div className="cm-top"><div><div className="cm-name">{message.nombre}</div><div className="cm-email">{message.correo}</div></div><time className="cm-date">{new Date(message.creado_en).toLocaleString("es-MX")}</time></div><p className="cm-body">{message.mensaje}</p><label className="cm-status">Estado <select value={message.estado} onChange={(event) => updateStatus(message, event.target.value)}>{states.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></article>)}</div>}</section>;
}
