import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-500 px-6">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-12 max-w-xl w-full text-center animate-fadeIn">

        {/* Código */}
        <h1 className="text-[120px] font-extrabold text-yellow-500 drop-shadow-lg tracking-wide">
          404
        </h1>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-900 uppercase">
          Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="mt-4 text-gray-600 text-lg">
          Ups… parece que esta ruta se salió del carril 🏃‍♂️💨  
          La página que buscas no existe o fue movida.
        </p>

        {/* Botón */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center bg-black text-yellow-400 px-8 py-4 rounded-xl font-semibold uppercase tracking-wide hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg hover:scale-105"
        >
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}
