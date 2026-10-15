import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../config/api";
import Feedback from "../../components/Feedback";
import { FormularioDireccion, CSS } from "./DireccionCheckOut";
import "../../styles/account.css";

export default function Direcciones() {
  const [addresses,setAddresses] = useState([]);
  const [loading,setLoading] = useState(true);
  const [editing,setEditing] = useState(null);
  const [saving,setSaving] = useState(false);
  const [message,setMessage] = useState(null);
  const [deleteTarget,setDeleteTarget] = useState(null);
  async function load() {
    setLoading(true); setMessage(null);
    try { const data = await apiRequest("/api/user/addresses"); if (!Array.isArray(data)) throw new Error("No se pudieron cargar tus direcciones."); setAddresses(data); return true; }
    catch(error) { setMessage({kind:"error",title:error.message}); return false; }
    finally {setLoading(false);}
  }
  useEffect(() => {load();}, []);
  async function save(data) {
    setSaving(true);setMessage(null);
    try {
      await apiRequest(`/api/user/addresses${editing?.id ? `/${editing.id}` : ""}`,{method:editing?.id ? "PUT" : "POST",body:JSON.stringify(data)});
      setEditing(null);if(await load())setMessage({kind:"success",title:"Dirección guardada"});
    } catch(error){setMessage({kind:"error",title:error.message});}
    finally{setSaving(false);}
  }
  async function change(address,remove=false) {
    if(saving)return;
    setSaving(true);setMessage(null);
    try {
      await apiRequest(`/api/user/addresses/${address.id}${remove ? "" : "/default"}`,{method:remove ? "DELETE" : "PATCH"});
      setDeleteTarget(null);if(await load())setMessage({kind:"success",title:remove ? "Dirección eliminada" : "Dirección predeterminada actualizada"});
    } catch(error){setMessage({kind:"error",title:error.message});}
    finally{setSaving(false);}
  }
  return <main className="ac-page"><style>{CSS}</style><div className="ac-wrap">
    <nav className="ac-breadcrumb" aria-label="Ruta de navegación"><Link to="/profile">Mi cuenta</Link><span>/</span><span>Mis direcciones</span></nav>
    <header className="ac-hero"><div><span className="ac-eyebrow">Mi cuenta SportLike</span><h1>Mis direcciones</h1><p>Administra tus datos de entrega antes de comprar.</p></div></header>
    {message && <div className="ac-alert"><Feedback {...message} onRetry={message.kind === "error" && !editing ? load : undefined}/></div>}
    {editing ? <section className="ac-card ac-manager-form dch"><h2>{editing.id ? "Editar dirección" : "Nueva dirección"}</h2><FormularioDireccion key={editing.id || "new"} inicial={editing.id ? {...editing,predeterminada:Number(editing.predeterminada) === 1} : undefined} onGuardar={save} onCancelar={() => {if(!saving)setEditing(null);}} saving={saving}/></section> : <>
      <div className="ac-head"><p>{addresses.length} de 10 direcciones</p><button type="button" className="ac-button primary" disabled={loading || addresses.length>=10} onClick={() => {setMessage(null);setEditing({});}}>Agregar dirección</button></div>
      {loading ? <Feedback kind="loading" title="Cargando tus direcciones…"/> : addresses.length ? <div className="ac-addresses">{addresses.map(address => <article className="ac-card" key={address.id}>
        <div className="ac-head"><h2>{address.alias || address.nombre_receptor}</h2>{Number(address.predeterminada)===1 && <span className="ac-badge">Predeterminada</span>}</div>
        <address>{address.nombre_receptor}<br/>{address.calle} {address.numero_ext}{address.numero_int ? `, interior ${address.numero_int}` : ""}<br/>{address.colonia}, {address.ciudad}<br/>{address.estado}, C. P. {address.cp}<br/>{address.telefono}</address>
        {address.referencias && <p>{address.referencias}</p>}
        <div className="ac-actions"><button type="button" className="ac-button" disabled={saving} onClick={() => {setMessage(null);setEditing(address);}}>Editar</button>{Number(address.predeterminada)!==1 && <button type="button" className="ac-button" disabled={saving} onClick={() => change(address)}>Usar como predeterminada</button>}<button type="button" className="ac-button danger" disabled={saving} onClick={() => setDeleteTarget(address.id)}>Eliminar</button></div>
        {deleteTarget===address.id && <div className="ac-alert"><Feedback title="¿Eliminar esta dirección?"><p>Dejará de estar disponible para tus próximas compras.</p><div className="ac-actions"><button type="button" className="ac-button danger" disabled={saving} onClick={() => change(address,true)}>Confirmar eliminación</button><button type="button" className="ac-button" disabled={saving} onClick={() => setDeleteTarget(null)}>Conservar dirección</button></div></Feedback></div>}
      </article>)}</div> : !message && <Feedback title="Aún no tienes direcciones guardadas">Agrega una dirección para tenerla lista al comprar.</Feedback>}
    </>}
  </div></main>;
}
