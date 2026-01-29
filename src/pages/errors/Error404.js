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
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-6 py-20">

      {/* Card principal */}
      <div className="relative bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] p-14 max-w-2xl w-full text-center">

        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />

        {/* Icono */}
        <Compass size={80} className="mx-auto text-yellow-500 mb-4" />

        {/* Código */}
        <h1 className="text-[140px] font-black text-yellow-500 leading-none">
          404
        </h1>

        {/* Título */}
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
          Página no encontrada
        </h2>

        {/* Texto */}
        <p className="mt-6 text-gray-600 text-lg max-w-lg mx-auto">
          Esta ruta se perdió en el camino.  
          La página que buscas no existe o fue movida.
        </p>

        {/* Botón */}
        <Link
          to="/"
          onClick={handleClick}
          className="
            mt-12
            mx-auto
            inline-flex
            items-center
            justify-center
            gap-3
            px-16
            py-6
            rounded-full
            font-extrabold
            uppercase
            tracking-widest
            text-white
            text-lg
            shadow-[0_12px_35px_rgba(10,26,47,0.6)]
            transition-all
            duration-300
            hover:scale-110
            hover:shadow-[0_18px_45px_rgba(10,26,47,0.85)]
            active:scale-95
          "
          style={{ backgroundColor: "#0a1a2f" }}
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <Home className="w-6 h-6" />
          )}
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
