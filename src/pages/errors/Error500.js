import { Link } from "react-router-dom";

export default function Error500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-700 px-6">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-12 max-w-xl w-full text-center animate-fadeIn">

        {/* Código */}
        <h1 className="text-[120px] font-extrabold text-red-600 drop-shadow-lg tracking-wide">
          500
        </h1>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-900 uppercase">
          Error interno del servidor
        </h2>

        {/* Descripción */}
        <p className="mt-4 text-gray-600 text-lg">
          Algo salió mal en nuestros sistemas ⚠️  
          Por favor, inténtalo nuevamente en unos minutos.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center bg-black text-red-500 px-8 py-4 rounded-xl font-semibold uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:scale-105"
        >
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
