import { Link } from "react-router-dom";

export default function Error400() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-500 px-6">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-12 max-w-xl w-full text-center animate-fadeIn">

        {/* Código */}
        <h1 className="text-[120px] font-extrabold text-orange-500 drop-shadow-lg tracking-wide">
          400
        </h1>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-900 uppercase">
          Solicitud incorrecta
        </h2>

        {/* Descripción */}
        <p className="mt-4 text-gray-600 text-lg">
          Algo no salió bien con la información enviada ⚠️  
          Revisa los datos e inténtalo nuevamente.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center bg-black text-orange-500 px-8 py-4 rounded-xl font-semibold uppercase tracking-wide hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-lg hover:scale-105"
        >
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
