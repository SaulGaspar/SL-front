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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-12">
      {/* Card principal */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-14 max-w-2xl w-full text-center">
        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Icono */}
        <Compass size={80} className="mx-auto text-yellow-500 mb-4" />
        
        {/* Código */}
        <h1 className="text-7xl md:text-9xl font-black text-yellow-500 leading-none">
          404
        </h1>
        
        {/* Título */}
        <h2 className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Página no encontrada
        </h2>
        
        {/* Texto */}
        <p className="mt-6 text-gray-600 text-base md:text-lg max-w-lg mx-auto">
          Esta ruta se perdió en el camino.
          <br />
          La página que buscas no existe o fue movida.
        </p>
        
        {/* Botón principal */}
        <div className="mt-8 md:mt-12">
          <Link
            to="/"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-wider text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #0a1a2f 0%, #061224 100%)"
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Home className="w-5 h-5" />
            )}
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}