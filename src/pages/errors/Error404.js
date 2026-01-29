import { Link } from "react-router-dom";
import { Compass, Home, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Error404() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const audio = new Audio("/click.mp3");
    audio.play();
    setLoading(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1)_0%,_transparent_60%),repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_12px)] bg-[#111] px-6">

      <div className="bg-white/95 rounded-2xl shadow-2xl p-12 max-w-xl w-full text-center">

        <Compass size={70} className="mx-auto text-yellow-500 mb-2" />

        <h1 className="text-[110px] font-extrabold text-yellow-500">
          404
        </h1>

        <h2 className="text-3xl font-bold uppercase">
          Página no encontrada
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Esta ruta se perdió en el camino.  
          La página que buscas no existe.
        </p>

        <Link
          to="/"
          onClick={handleClick}
          className="mt-10 inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-extrabold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: "#0a1a2f" }}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Home />}
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
