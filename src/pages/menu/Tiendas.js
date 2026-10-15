import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePwa } from "../../context/PwaContext";

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

import CSS from "./Tiendas.styles";

export default function Tiendas() {
  const { online } = usePwa();
  const [position, setPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  function locate() {
    setLocationError("");
    if (!window.isSecureContext) { setLocationError("La ubicación requiere HTTPS o localhost."); return; }
    if (!navigator.geolocation) { setLocationError("Tu navegador no admite ubicación. Puedes abrir las tiendas manualmente."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setPosition({ latitude:coords.latitude, longitude:coords.longitude, accuracy:coords.accuracy }); setLocating(false); },
      error => {
        setLocationError(error.code === 1 ? "No autorizaste la ubicación. Puedes seguir consultando las tiendas manualmente." : error.code === 3 ? "La ubicación tardó demasiado. Inténtalo otra vez." : "No pudimos obtener tu ubicación. Revisa que esté disponible en el dispositivo.");
        setLocating(false);
      },
      { enableHighAccuracy:false, timeout:12000, maximumAge:60000 }
    );
  }

  function storeRoute(store) {
    if (!position) return store.url;
    return "https://www.google.com/maps/dir/?" + new URLSearchParams({
      api:"1", origin:`${position.latitude},${position.longitude}`, destination:store.address, travelmode:"driving",
    }).toString();
  }
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

          <section className="st-location" aria-labelledby="store-location-title">
            <h3 id="store-location-title">Cómo llegar desde tu ubicación</h3>
            <p>Si lo autorizas, usaremos la ubicación de tu dispositivo para preparar la ruta a la tienda que elijas. No se guarda en tu cuenta.</p>
            <button type="button" onClick={locate} disabled={locating}>{locating ? "Obteniendo ubicación…" : position ? "Actualizar mi ubicación" : "Usar mi ubicación"}</button>
            {position && <div role="status"><p>Ubicación obtenida. Precisión aproximada: {Math.round(position.accuracy)} metros. Elige una tienda para abrir la ruta.</p><p>Al abrir la ruta, se enviará a Google Maps tu ubicación como punto de partida.</p><button type="button" onClick={() => setPosition(null)}>Dejar de usar esta ubicación</button></div>}
            {locationError && <p className="st-location-error" role="alert">{locationError}</p>}
            {!online && <p role="status">Puedes consultar las direcciones guardadas. Para cargar mapas y rutas necesitas conexión; la detección de ubicación depende de tu dispositivo.</p>}
          </section>

          <div className="st-grid">
            {STORES.map((store, index) => (
              <a
                className="st-card"
                href={storeRoute(store)}
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
                  <span className="st-open">{position ? "Ver ruta desde mi ubicación ↗" : "Abrir en Google Maps ↗"}</span>
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
