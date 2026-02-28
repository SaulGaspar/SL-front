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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {/* Card principal */}
      <div 
        className="relative rounded-3xl shadow-2xl p-8 md:p-14 max-w-2xl w-full text-center"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Icono */}
        <Compass size={80} className="mx-auto text-yellow-500 mb-4" />
        
        {/* Código */}
        <h1 
          className="text-7xl md:text-9xl font-black leading-none"
          style={{ color: "var(--accent)" }}
        >
          404
        </h1>
        
        {/* Título */}
        <h2 
          className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--text-main)" }}
        >
          Página no encontrada
        </h2>
        
        {/* Texto */}
        <p 
          className="mt-6 text-base md:text-lg max-w-lg mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Esta ruta se perdió en el camino.
          <br />
          La página que buscas no existe o fue movida.
        </p>
        
        {/* Botón principal */}
        <Link
          to="/"
          onClick={handleClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "20px 48px",
            background: "var(--btn-main-bg)",
            color: "var(--btn-main-text)",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "16px",
            borderRadius: "9999px",
            boxShadow: "0 12px 35px rgba(10, 26, 47, 0.3)",
            textDecoration: "none",
            transition: "all 0.3s ease",
            marginTop: "48px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 18px 45px rgba(79, 124, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 35px rgba(10, 26, 47, 0.3)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
        >
          {loading ? (
            <Loader2 style={{ width: "24px", height: "24px" }} className="animate-spin" />
          ) : (
            <Home style={{ width: "24px", height: "24px" }} />
          )}
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}
