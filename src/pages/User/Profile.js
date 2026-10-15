import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../config/api";
import Feedback from "../../components/Feedback";
import { useFavorites } from "../../context/FavoritesContext";
import "../../styles/account.css";

const labels = {pendiente:"Pendiente",preparando:"En preparación",en_camino:"En camino",entregado:"Entregado",cancelado:"Cancelado"};
export default function Profile({ user, setUser }) {
  const { favorites } = useFavorites();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.allSettled([
      apiRequest("/api/orders/mis-pedidos"),
      apiRequest("/api/user/addresses"),
      apiRequest("/api/returns")
    ]).then(results => {
      if (!active) return;
      setActivity(results.map(result => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : null));
      setLoading(false);
    });
    return () => { active = false; };
  }, [version]);
  const [orders, addresses, changes] = activity || [null,null,null];
  const latest = orders ? [...orders].sort((a,b) => new Date(b.fecha) - new Date(a.fecha))[0] : null;
  const metrics = [
    ["Pedidos activos", orders?.filter(order => ["pendiente","preparando","en_camino"].includes(order.status)).length, "/orders"],
    ["Compras realizadas", orders?.filter(order => order.status !== "cancelado").length, "/orders"],
    ["Direcciones guardadas", addresses?.length, "/direcciones"],
    ["Cambios en curso", changes?.filter(change => ["requested","reviewing","approved"].includes(change.status)).length, "/cambios"]
  ];
  function edit() {
    setForm(Object.fromEntries(["nombre","apellidoP","apellidoM","telefono","usuario"].map(key => [key,user[key] || ""])));
    setMessage(null); setEditing(true);
  }
  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setMessage(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key,value]) => [key,value.trim()]));
      if (payload.telefono && !/^\d{10}$/.test(payload.telefono)) throw new Error("Escribe un teléfono de 10 dígitos.");
      const response = await apiRequest("/api/update-profile", {method:"POST", body:JSON.stringify(payload)});
      const updated = response.user || {...user,...payload};
      setUser(updated);
      localStorage.setItem("user",JSON.stringify(updated));
      setEditing(false);
      setMessage({kind:"success",title:"Información actualizada"});
    } catch (error) { setMessage({kind:"error",title:error.message}); }
    finally { setSaving(false); }
  }
  return <main className="ac-page"><div className="ac-wrap">
    <nav className="ac-breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span>/</span><span>Mi cuenta</span></nav>
    <header className="ac-hero"><div className="ac-avatar" aria-hidden="true">{(user.nombre || user.usuario || "SL").slice(0,1).toUpperCase()}</div><div><span className="ac-eyebrow">Mi cuenta SportLike</span><h1>Hola, {user.nombre || user.usuario}</h1><p>Tu información y tus compras, en un mismo lugar.</p></div></header>
    {message && <div className="ac-alert"><Feedback {...message}/></div>}
    <div className="ac-columns">
      <section className="ac-card" aria-labelledby="account-data"><div className="ac-head"><h2 id="account-data">Mis datos</h2>{!editing && <button type="button" className="ac-button primary" onClick={edit}>Editar información</button>}</div>
        {editing ? <form className="ac-form" onSubmit={save}>
          <div className="ac-form-grid">{[["nombre","Nombre",true],["apellidoP","Apellido paterno",true],["apellidoM","Apellido materno",false],["telefono","Teléfono",false],["usuario","Usuario",true]].map(([key,label,required]) => <label className="ac-field" key={key}>{label}<input name={key} required={required} type={key === "telefono" ? "tel" : "text"} maxLength={key === "telefono" ? 10 : 120} value={form[key] || ""} onChange={event => setForm({...form,[key]:event.target.value})} autoComplete={{nombre:"given-name",apellidoP:"family-name",telefono:"tel",usuario:"username"}[key] || "off"} /></label>)}</div>
          <div className="ac-actions"><button className="ac-button primary" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button><button type="button" className="ac-button" disabled={saving} onClick={() => setEditing(false)}>Cancelar</button></div>
        </form> : <dl className="ac-data">
          <div><dt>Nombre completo</dt><dd>{[user.nombre,user.apellidoP,user.apellidoM].filter(Boolean).join(" ") || "Sin completar"}</dd></div>
          <div><dt>Correo</dt><dd>{user.correo || "Sin registrar"}</dd></div>
          <div><dt>Teléfono</dt><dd>{user.telefono || "Sin registrar"}</dd></div>
          <div><dt>Usuario</dt><dd>@{user.usuario}</dd></div>
        </dl>}
        <div className="ac-foot"><Link to="/change-password">Cambiar contraseña</Link></div>
      </section>
      <section className="ac-card" aria-labelledby="account-activity"><div className="ac-head"><h2 id="account-activity">Mi actividad</h2><Link to="/favoritos">Favoritos ({favorites.length})</Link></div>
        {loading ? <Feedback kind="loading" title="Cargando tu actividad…" /> : <>
          <div className="ac-metrics">{metrics.map(([label,value,to]) => <Link className="ac-metric" key={label} to={to}><strong>{value ?? "—"}</strong><span>{label}</span></Link>)}</div>
          {activity?.some(value => value === null) && <div className="ac-alert"><Feedback kind="error" title="No se pudo cargar parte de tu actividad." onRetry={() => setVersion(value => value+1)} /></div>}
          <div className="ac-recent"><h2>Último pedido</h2>{latest ? <><p><strong>#{latest.pedido_ref || latest.id}</strong> · {labels[latest.status] || latest.status}</p><p>{new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(Number(latest.total || 0))} · {new Date(latest.fecha).toLocaleDateString("es-MX")}</p><Link to="/orders">Consultar pedido</Link></> : orders ? <p>Aún no tienes compras. <Link to="/catalogo">Explorar catálogo</Link></p> : <p>Podrás consultar tu último pedido cuando se restablezca el servicio.</p>}</div>
        </>}
      </section>
    </div>
    <div className="ac-shortcuts">{[["/orders","bi-bag-check","Mis pedidos","Historial y seguimiento"],["/direcciones","bi-geo-alt","Mis direcciones","Agrega y administra tus direcciones"],["/cambios","bi-arrow-left-right","Cambios","Consulta o inicia una solicitud"]].map(([to,icon,title,description]) => <Link className="ac-shortcut" key={to} to={to}><i className={"bi "+icon} aria-hidden="true"/><div><strong>{title}</strong><span>{description}</span></div></Link>)}</div>
  </div></main>;
}
