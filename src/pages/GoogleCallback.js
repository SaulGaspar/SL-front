import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import CSS from "./GoogleCallback.styles";

const PENDING_KEY = "sportlike_google_signup";

function readCredentials() {
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get("token") || query.get("token");
  const error = fragment.get("error") || query.get("error");
  let registration = fragment.get("registration_token") || query.get("registration_token");
  if (!registration && !token && !error) {
    try { registration = sessionStorage.getItem(PENDING_KEY); } catch { /* La URL sigue funcionando sin almacenamiento. */ }
  }
  return {token,registration,error};
}

async function googleRequest(path, token, options = {}) {
  const controller=new AbortController();
  const abort=()=>controller.abort();
  options.signal?.addEventListener("abort",abort,{once:true});
  if(options.signal?.aborted)controller.abort();
  const timer=setTimeout(abort,15000);
  try {
  const response = await fetch(API_BASE_URL+path,{
    ...options,
    signal:controller.signal,
    headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},
    cache:"no-store"
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.error || "No se pudo completar el acceso con Google.");
  return data;
  } catch(error) {
    if(error.name==="AbortError")throw new Error("El servidor tardó demasiado. Intenta iniciar sesión nuevamente.");
    if(error instanceof TypeError)throw new Error("No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.");
    throw error;
  } finally {clearTimeout(timer);options.signal?.removeEventListener("abort",abort);}
}

export default function GoogleCallback({ onLogin }) {
  const navigate = useNavigate();
  const [credentials] = useState(readCredentials);
  const [phase,setPhase] = useState("loading");
  const [error,setError] = useState("");
  const [account,setAccount] = useState(null);
  const [usuario,setUsuario] = useState("");
  const [saving,setSaving] = useState(false);
  const alive = useRef(true);
  const submitting = useRef(false);

  useEffect(()=>{
    alive.current=true;
    const controller=new AbortController();
    const cleanPending=()=>{try{sessionStorage.removeItem(PENDING_KEY);}catch{}};
    // No conservar credenciales de OAuth en el historial ni en peticiones posteriores.
    window.history.replaceState(window.history.state,"",window.location.pathname);
    if (credentials.token || credentials.registration) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      onLogin?.(null);
    }
    async function load() {
      try {
        if (credentials.error) throw new Error("No se pudo autorizar el acceso. Vuelve a continuar con Google.");
        if (credentials.token) {
          cleanPending();
          const user=await googleRequest("/api/me",credentials.token,{signal:controller.signal});
          if (!user.id || !user.usuario || !user.correo) throw new Error("No se pudieron recuperar los datos de tu cuenta.");
          if (!alive.current || controller.signal.aborted) return;
          localStorage.setItem("token",credentials.token);
          localStorage.setItem("user",JSON.stringify(user));
          onLogin?.(user);
          navigate(user.rol==="admin"?"/admin":"/profile",{replace:true});
        } else if(credentials.registration) {
          try{sessionStorage.setItem(PENDING_KEY,credentials.registration);}catch{}
          const data=await googleRequest("/api/google/registration",credentials.registration,{signal:controller.signal});
          if (!alive.current || controller.signal.aborted) return;
          setAccount(data);setPhase("choose");
        } else throw new Error("No recibimos los datos del acceso. Vuelve a continuar con Google.");
      } catch(error) {
        if (!alive.current || controller.signal.aborted) return;
        cleanPending();setError(error.message);setPhase("error");
      }
    }
    load();
    return ()=>{alive.current=false;controller.abort();};
  },[credentials,navigate,onLogin]);

  async function complete(event) {
    event.preventDefault();
    if (submitting.current) return;
    if (!/^[a-zA-Z0-9_-]{4,20}$/.test(usuario.trim())) {setError("Usa de 4 a 20 caracteres: letras, números, guion o guion bajo.");return;}
    submitting.current=true;setSaving(true);setError("");
    try {
      const result=await googleRequest("/api/google/complete",credentials.registration,{method:"POST",body:JSON.stringify({usuario:usuario.trim()})});
      // Se consulta el perfil real también después de crear la cuenta.
      const user=await googleRequest("/api/me",result.token);
      if (!user.id || !user.usuario || !user.correo) throw new Error("No se pudieron recuperar los datos de tu cuenta. Intenta continuar otra vez.");
      if (!alive.current) return;
      try{sessionStorage.removeItem(PENDING_KEY);}catch{}
      localStorage.setItem("token",result.token);
      localStorage.setItem("user",JSON.stringify(user));
      onLogin?.(user);
      navigate("/profile",{replace:true});
    } catch(error) {if(alive.current)setError(error.message || "No se pudo crear tu cuenta.");}
    finally {submitting.current=false;if(alive.current)setSaving(false);}
  }

  return <main className="gc-page"><style>{CSS}</style>
    <section className="gc-card" aria-live="polite">
      <div className="gc-brand"><span className="gc-brand-mark">SL</span>SportLike</div>
      <div className={`gc-icon ${phase==="error"?"error":""}`} aria-hidden="true">{phase==="loading"?<span className="gc-spinner"/>:phase==="error"?"!":"@"}</div>
      <span className="gc-kicker">Cuenta SportLike</span>
      <h1 className="gc-title">{phase==="choose"?"Elige tu nombre de usuario":phase==="error"?"No pudimos iniciar sesión":"Conectando tu cuenta"}</h1>
      {phase==="loading" && <p className="gc-message">Estamos recuperando los datos de tu cuenta.</p>}
      {phase==="choose" && <>
        <p className="gc-message">Continúa con <strong>{account?.correo}</strong>. Solo falta elegir cómo te identificarás en SportLike.</p>
        <form className="gc-form" onSubmit={complete}>
          <label htmlFor="google-username">Nombre de usuario</label>
          <input id="google-username" name="usuario" value={usuario} onChange={event=>setUsuario(event.target.value)} minLength={4} maxLength={20} pattern="[a-zA-Z0-9_-]{4,20}" required autoComplete="username" autoCapitalize="none" spellCheck={false} aria-describedby="google-username-help" disabled={saving}/>
          <small id="google-username-help">De 4 a 20 caracteres. Puedes usar letras, números, guion y guion bajo.</small>
          {error && <p className="gc-error" role="alert">{error}</p>}
          <button className="gc-button" type="submit" disabled={saving}>{saving?"Creando cuenta…":"Crear mi cuenta"}</button>
        </form>
        <div className="gc-actions"><Link className="gc-button secondary" to="/login" onClick={()=>{try{sessionStorage.removeItem(PENDING_KEY);}catch{}}}>Cancelar</Link></div>
      </>}
      {phase==="error" && <><p className="gc-message" role="alert">{error}</p><div className="gc-actions"><Link className="gc-button" to="/login">Volver a iniciar sesión</Link><Link className="gc-button secondary" to="/">Ir al inicio</Link></div></>}
    </section>
  </main>;
}
