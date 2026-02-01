import React from "react";
import { Link } from "react-router-dom";

export default function Tiendas() {

  const openMap = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="page-wrapper">
      <style>{`
        /* ================= VARIABLES ================= */
        :root {
          --bg-page: linear-gradient(135deg,#eef3ff,#fff);
          --card-bg: #ffffff;
          --title-color: #0a2540;
          --store-bg: #f6f8fc;
          --store-hover: #eaf0ff;
          --store-text: #0a2540;
        }

        body[data-bs-theme="dark"] {
          --bg-page: linear-gradient(135deg,#0a1120,#1b1f33);
          --card-bg: #131a2c;
          --title-color: #e5edff;
          --store-bg: #1e293b;
          --store-hover: #273449;
          --store-text: #e2e8f0;
        }

        /* ================= ESTILOS ================= */
        .page-wrapper {
          min-height:90vh;
          background: var(--bg-page);
          display:flex;
          justify-content:center;
          padding:60px 20px;
        }

        .page-card {
          background: var(--card-bg);
          max-width:900px;
          width:100%;
          padding:45px;
          border-radius:22px;
          box-shadow:0 20px 45px rgba(0,0,0,.15);
        }

        .page-title {
          font-size:2.4rem;
          font-weight:900;
          color: var(--title-color);
        }

        .store {
          background: var(--store-bg);
          border-radius:18px;
          padding:22px;
          margin-top:15px;
          cursor:pointer;
          transition:.25s;
          color: var(--store-text);
        }

        .store:hover {
          transform:scale(1.02);
          background: var(--store-hover);
        }
      `}</style>

      <div className="page-card">
        <div className="mb-3">
          <Link to="/">Inicio</Link> / <b>Tiendas</b>
        </div>

        <h1 className="page-title">Nuestras Tiendas</h1>

        <div
          className="store"
          onClick={() =>
            openMap("https://www.google.com/maps/place/Av.+Juarez+2,+Centro,+43000+Huejutla+de+Reyes,+Hgo./@21.1431443,-98.4178778,3a,75y,317.93h,77.99t/data=!3m7!1e1!3m5!1skpafnhBauwq0akpw9od6Zw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D12.006366587530977%26panoid%3DkpafnhBauwq0akpw9od6Zw%26yaw%3D317.93086397801034!7i16384!8i8192!4m6!3m5!1s0x85d726eb18243db9:0x17d0f0a71acd2d72!8m2!3d21.1425763!4d-98.4199002!16s%2Fg%2F11c4rdtb4f?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D")
          }
        >
          🏬 Nuevo León 26, Santa Irene, 43000 Huejutla de Reyes, Hgo.
        </div>

        <div
          className="store"
          onClick={() =>
            openMap("https://www.google.com/maps/place/Sport+Like/@21.1403686,-98.4208846,17z/data=!4m15!1m8!3m7!1s0x85d72694be96c789:0x1baff4eb8cbe6fc0!2sNuevo+Le%C3%B3n,+43000+Huejutla+de+Reyes,+Hgo.!3b1!8m2!3d21.1433506!4d-98.4174085!16s%2Fg%2F1tgln7lr!3m5!1s0x85d726eceb2b9c7b:0x963765a68966155c!8m2!3d21.1388859!4d-98.4199824!16s%2Fg%2F11y411qltn?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D")
          }
        >
          🏬 Centro, 43000 Huejutla de Reyes, Hgo.
        </div>

        <div
          className="store"
          onClick={() =>
            openMap("https://www.google.com/maps/@21.1436644,-98.4196042,3a,75y,101.85h,72.87t/data=!3m7!1e1!3m5!1srmnLJxRENkzsx4Y-Knx7kg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D17.12947688254758%26panoid%3DrmnLJxRENkzsx4Y-Knx7kg%26yaw%3D101.85001835689152!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D")
          }
        >
          🏬 Juárez, 43000 Huejutla de Reyes, Hgo.
        </div>

        <div
          className="store"
          onClick={() =>
            openMap("https://www.google.com/maps/place/Sport+Like/@21.1427902,-98.4193933,17z/data=!4m15!1m8!3m7!1s0x85d72694be96c789:0x1baff4eb8cbe6fc0!2sNuevo+Le%C3%B3n,+43000+Huejutla+de+Reyes,+Hgo.!3b1!8m2!3d21.1433506!4d-98.4174085!16s%2Fg%2F1tgln7lr!3m5!1s0x85d726eb2dc7ade9:0x3afe875fa0041745!8m2!3d21.1427854!4d-98.4186982!16s%2Fg%2F11lf6y35rf?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D")
          }
        >
          🏬 Nuevo León, Santa Irene, 43000 Huejutla de Reyes, Hgo
        </div>

      </div>
    </div>
  );
}
