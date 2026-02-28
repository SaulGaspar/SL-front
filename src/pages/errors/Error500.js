import { Link } from "react-router-dom";
import { ServerCrash, Home, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Error500() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const audio = new Audio("/click.mp3");
    audio.play();
    setLoading(true);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div 
        className="rounded-2xl shadow-2xl p-12 max-w-xl w-full text-center"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <ServerCrash size={70} className="mx-auto text-red-600 mb-2" />

        <h1 className="text-[110px] font-extrabold text-red-600">
          500
        </h1>

        <h2 
          className="text-3xl font-bold uppercase"
          style={{ color: "var(--text-main)" }}
        >
          Error interno del servidor
        </h2>

        <p 
          className="mt-4 text-lg"
          style={{ color: "var(--text-muted)" }}
        >
          Algo salió mal en nuestros sistemas.  
          Inténtalo nuevamente más tarde.
        </p>

        <Link
          to="/"
          onClick={handleClick}
          className="mt-10 inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-extrabold uppercase tracking-wider shadow-xl transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: "var(--btn-main-bg)",
            color: "var(--btn-main-text)"
          }}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Home />}
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
