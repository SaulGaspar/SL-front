// SPORTLIKE_API_URL debe ser el origen del backend, sin /api al final.
export const API_BASE_URL = (process.env.SPORTLIKE_API_URL || "https://sl-back.vercel.app").replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(options.body ? {"Content-Type":"application/json"} : {}), ...(token ? {Authorization:`Bearer ${token}`} : {}), ...options.headers };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let response;
  try { response = await fetch(`${API_BASE_URL}${path}`, {...options, headers, signal:options.signal || controller.signal}); }
  catch (error) { throw new Error(error.name === "AbortError" ? "El servidor tardó demasiado. Inténtalo de nuevo." : "No pudimos conectar con el servidor. Revisa tu conexión."); }
  finally { clearTimeout(timer); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo completar la solicitud. Inténtalo de nuevo.");
  return data;
}
