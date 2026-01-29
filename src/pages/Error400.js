import { Link } from "react-router-dom";

export default function Error400() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-red-600">400</h1>
      <h2 className="text-2xl mt-4 font-semibold">
        Solicitud incorrecta
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        La petición enviada no es válida.  
        Verifica la información e inténtalo nuevamente.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
