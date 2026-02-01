import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Pago() {
  console.log("✅ Componente Pago renderizado");
  
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  
  console.log("Total recibido:", total);

  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // VALIDACIÓN
  const validar = () => {
    let e = {};
    if (!nombre.trim() || nombre.length < 4) {
      e.nombre = "El nombre debe tener al menos 4 caracteres.";
    }
    if (!/^\d{16}$/.test(tarjeta.replace(/\s/g, ''))) {
      e.tarjeta = "El número de tarjeta debe tener 16 dígitos.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiracion)) {
      e.expiracion = "Formato de expiración inválido (MM/AA).";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      e.cvv = "CVV inválido.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    setSuccess("Pago realizado correctamente!");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div style={{ minHeight: '75vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Migas de pan */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" style={{ textDecoration: 'none' }}>Inicio</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/carrito" style={{ textDecoration: 'none' }}>Carrito</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Pago
            </li>
          </ol>
        </nav>

        {/* Formulario centrado */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-sm p-4">
              <h2 className="text-center mb-4 fw-bold">Pago Seguro</h2>

              {success && (
                <div className="alert alert-success text-center" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={submit}>
                {/* Nombre */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-semibold">
                    Nombre en la tarjeta
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre}</div>
                  )}
                </div>

                {/* Número de tarjeta */}
                <div className="mb-3">
                  <label htmlFor="tarjeta" className="form-label fw-semibold">
                    Número de tarjeta
                  </label>
                  <input
                    id="tarjeta"
                    type="text"
                    className={`form-control ${errors.tarjeta ? 'is-invalid' : ''}`}
                    value={tarjeta}
                    onChange={e => setTarjeta(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                  {errors.tarjeta && (
                    <div className="invalid-feedback">{errors.tarjeta}</div>
                  )}
                </div>

                {/* Expiración y CVV */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="expiracion" className="form-label fw-semibold">
                      Expiración
                    </label>
                    <input
                      id="expiracion"
                      type="text"
                      className={`form-control ${errors.expiracion ? 'is-invalid' : ''}`}
                      value={expiracion}
                      onChange={e => setExpiracion(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                    {errors.expiracion && (
                      <div className="invalid-feedback">{errors.expiracion}</div>
                    )}
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="cvv" className="form-label fw-semibold">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <div className="invalid-feedback">{errors.cvv}</div>
                    )}
                  </div>
                </div>

                {/* Botón de pago */}
                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 mt-3 fw-semibold"
                  style={{ fontSize: '1.1rem' }}
                >
                  Pagar ${total.toFixed(2)}
                </button>

                {/* Botón volver al carrito */}
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 py-2 mt-2"
                  onClick={() => navigate('/carrito')}
                >
                  Volver al carrito
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}