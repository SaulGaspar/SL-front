import React from "react";
import { Link } from "react-router-dom";

const STORES = [
  {
    zone: "Santa Irene",
    address: "Nuevo León 26, Santa Irene, 43000 Huejutla de Reyes, Hgo.",
    url: "https://www.google.com/maps/place/Av.+Juarez+2,+Centro,+43000+Huejutla+de+Reyes,+Hgo./@21.1431443,-98.4178778,3a,75y,317.93h,77.99t/data=!3m7!1e1!3m5!1skpafnhBauwq0akpw9od6Zw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D12.006366587530977%26panoid%3DkpafnhBauwq0akpw9od6Zw%26yaw%3D317.93086397801034!7i16384!8i8192!4m6!3m5!1s0x85d726eb18243db9:0x17d0f0a71acd2d72!8m2!3d21.1425763!4d-98.4199002!16s%2Fg%2F11c4rdtb4f",
  },
  {
    zone: "Centro",
    address: "Centro, 43000 Huejutla de Reyes, Hgo.",
    url: "https://www.google.com/maps/place/Sport+Like/@21.1403686,-98.4208846,17z/data=!4m15!1m8!3m7!1s0x85d72694be96c789:0x1baff4eb8cbe6fc0!2sNuevo+Le%C3%B3n,+43000+Huejutla+de+Reyes,+Hgo.!3b1!8m2!3d21.1433506!4d-98.4174085!16s%2Fg%2F1tgln7lr!3m5!1s0x85d726eceb2b9c7b:0x963765a68966155c!8m2!3d21.1388859!4d-98.4199824!16s%2Fg%2F11y411qltn",
  },
  {
    zone: "Juárez",
    address: "Juárez, 43000 Huejutla de Reyes, Hgo.",
    url: "https://www.google.com/maps/@21.1436644,-98.4196042,3a,75y,101.85h,72.87t/data=!3m7!1e1!3m5!1srmnLJxRENkzsx4Y-Knx7kg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D17.12947688254758%26panoid%3DrmnLJxRENkzsx4Y-Knx7kg%26yaw%3D101.85001835689152!7i16384!8i8192",
  },
  {
    zone: "Nuevo León",
    address: "Nuevo León, Santa Irene, 43000 Huejutla de Reyes, Hgo.",
    url: "https://www.google.com/maps/place/Sport+Like/@21.1427902,-98.4193933,17z/data=!4m15!1m8!3m7!1s0x85d72694be96c789:0x1baff4eb8cbe6fc0!2sNuevo+Le%C3%B3n,+43000+Huejutla+de+Reyes,+Hgo.!3b1!8m2!3d21.1433506!4d-98.4174085!16s%2Fg%2F1tgln7lr!3m5!1s0x85d726eb2dc7ade9:0x3afe875fa0041745!8m2!3d21.1427854!4d-98.4186982!16s%2Fg%2F11lf6y35rf",
  },
];

const CSS = `
  .st-page {
    --st-ink:#0a1a2f; --st-muted:#687587; --st-paper:#f5f7f4;
    --st-card:#fff; --st-line:rgba(10,26,47,.11);
    --st-blue:#244fdb; --st-acid:#bde632;
    min-height:100vh; background:var(--st-paper); color:var(--st-ink);
    font-family:"Poppins","Segoe UI",sans-serif;
  }
  body[data-bs-theme="dark"] .st-page {
    --st-ink:#f3f6fa; --st-muted:#a6b1c0; --st-paper:#09131f;
    --st-card:#101d2b; --st-line:rgba(255,255,255,.11); --st-blue:#82a2ff;
  }
  .st-page *,.st-page *::before,.st-page *::after { box-sizing:border-box; }
  .st-shell { width:min(1100px,calc(100% - 40px)); margin-inline:auto; }
  .st-hero {
    position:relative; padding:48px 0 106px; overflow:hidden;
    color:#fff; background:#0a1a2f;
  }
  .st-hero::after {
    content:""; position:absolute; width:340px; height:340px;
    right:7%; top:-230px; border:54px solid var(--st-acid); border-radius:50%;
  }
  .st-back {
    min-height:42px; display:inline-flex; align-items:center; gap:8px;
    padding:0 15px; border:1px solid rgba(255,255,255,.16);
    border-radius:999px; color:rgba(255,255,255,.8);
    background:rgba(255,255,255,.05); text-decoration:none;
    font-size:.82rem; font-weight:600;
  }
  .st-hero-copy { position:relative; z-index:1; max-width:760px; margin-top:62px; }
  .st-eyebrow {
    display:block; margin-bottom:14px; color:var(--st-acid);
    font-size:.7rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
  }
  .st-title {
    margin:0; color:#fff; font-size:clamp(2.8rem,6vw,5rem);
    font-weight:800; line-height:.96; letter-spacing:-.06em;
  }
  .st-lead {
    max-width:620px; margin:20px 0 0; color:rgba(255,255,255,.64);
    font-size:1rem; line-height:1.7;
  }
  .st-content {
    position:relative; z-index:2; margin-top:-48px; padding-bottom:90px;
  }
  .st-panel {
    padding:clamp(26px,5vw,48px); border:1px solid var(--st-line);
    border-radius:26px; background:var(--st-card);
    box-shadow:0 20px 55px rgba(10,26,47,.08);
  }
  .st-panel-head {
    display:flex; align-items:end; justify-content:space-between;
    gap:26px; margin-bottom:28px;
  }
  .st-panel-head h2 {
    margin:0; color:var(--st-ink); font-size:clamp(1.7rem,3vw,2.35rem);
    font-weight:750; letter-spacing:-.045em;
  }
  .st-panel-head p {
    max-width:390px; margin:0; color:var(--st-muted);
    font-size:.87rem; line-height:1.6;
  }
  .st-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .st-card {
    position:relative; min-height:220px; display:flex;
    flex-direction:column; justify-content:space-between; padding:24px;
    border:1px solid var(--st-line); border-radius:18px;
    background:var(--st-paper); color:var(--st-ink); text-decoration:none;
    transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
  }
  .st-card:hover {
    transform:translateY(-4px); border-color:rgba(36,79,219,.3);
    box-shadow:0 16px 34px rgba(10,26,47,.09);
  }
  .st-card-top { display:flex; align-items:center; justify-content:space-between; }
  .st-index {
    color:var(--st-blue); font-size:.7rem; font-weight:750;
    letter-spacing:.12em;
  }
  .st-pin {
    width:44px; height:44px; display:grid; place-items:center;
    border-radius:13px; background:rgba(36,79,219,.09);
    color:var(--st-blue); font-size:1.1rem;
  }
  .st-zone {
    margin:0 0 7px; color:var(--st-ink);
    font-size:1.15rem; font-weight:750; letter-spacing:-.025em;
  }
  .st-address { margin:0; color:var(--st-muted); font-size:.82rem; line-height:1.55; }
  .st-open {
    display:inline-flex; align-items:center; gap:8px; margin-top:15px;
    color:var(--st-blue); font-size:.76rem; font-weight:700;
  }
  .st-note {
    display:flex; align-items:center; justify-content:space-between;
    gap:20px; margin-top:18px; padding:20px 22px;
    border-radius:16px; background:#0a1a2f; color:rgba(255,255,255,.66);
    font-size:.82rem; line-height:1.55;
  }
  .st-note strong { color:#fff; }
  .st-note a {
    flex:0 0 auto; padding:9px 13px; border-radius:10px;
    background:var(--st-acid); color:#0a1a2f; text-decoration:none;
    font-size:.74rem; font-weight:750;
  }
  .st-back:focus-visible,.st-card:focus-visible,.st-note a:focus-visible {
    outline:3px solid var(--st-acid); outline-offset:3px;
  }
  @media(max-width:700px) {
    .st-shell { width:min(100% - 24px,1100px); }
    .st-hero { padding:28px 0 76px; }
    .st-hero-copy { margin-top:48px; }
    .st-content { margin-top:-34px; padding-bottom:60px; }
    .st-panel { border-radius:20px; }
    .st-panel-head { display:block; }
    .st-panel-head p { margin-top:12px; }
    .st-grid { grid-template-columns:1fr; }
    .st-card { min-height:190px; }
    .st-note { align-items:flex-start; flex-direction:column; }
  }
`;

export default function Tiendas() {
  return (
    <main className="st-page">
      <style>{CSS}</style>

      <header className="st-hero">
        <div className="st-shell">
          <Link to="/" className="st-back">← Volver al inicio</Link>
          <div className="st-hero-copy">
            <span className="st-eyebrow">Visítanos</span>
            <h1 className="st-title">Encuentra tu tienda.</h1>
            <p className="st-lead">
              Consulta nuestras ubicaciones en Huejutla de Reyes y abre la ruta directamente en Maps.
            </p>
          </div>
        </div>
      </header>

      <div className="st-shell st-content">
        <section className="st-panel" aria-labelledby="stores-title">
          <div className="st-panel-head">
            <h2 id="stores-title">Ubicaciones SportLike</h2>
            <p>Selecciona una tienda para consultar el mapa y obtener indicaciones.</p>
          </div>

          <div className="st-grid">
            {STORES.map((store, index) => (
              <a
                className="st-card"
                href={store.url}
                target="_blank"
                rel="noreferrer"
                key={`${store.zone}-${index}`}
              >
                <span className="st-card-top">
                  <span className="st-index">TIENDA 0{index + 1}</span>
                  <span className="st-pin" aria-hidden="true">⌖</span>
                </span>
                <span>
                  <h3 className="st-zone">{store.zone}</h3>
                  <p className="st-address">{store.address}</p>
                  <span className="st-open">Abrir en Google Maps ↗</span>
                </span>
              </a>
            ))}
          </div>

          <div className="st-note">
            <div>
              <strong>¿Necesitas confirmar una ubicación?</strong><br />
              Nuestro equipo puede orientarte antes de tu visita.
            </div>
            <Link to="/contacto">Contactar</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
