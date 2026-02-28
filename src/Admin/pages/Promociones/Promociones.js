import React from "react";
import { MdLocalOffer, MdConstruction } from "react-icons/md";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .promo-wrap { font-family: 'DM Sans', sans-serif; }
  .promo-coming {
    background: white; border-radius: 16px; padding: 64px 48px;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .promo-icon-wrap {
    width: 96px; height: 96px; border-radius: 24px; margin: 0 auto 24px;
    background: linear-gradient(135deg, #ebf4ff, #dbeafe);
    display: flex; align-items: center; justify-content: center;
  }
  .promo-coming h3 { font-size: 1.6rem; font-weight: 700; color: #1e3a5f; margin: 0 0 12px; }
  .promo-coming p { color: #718096; font-size: 1rem; max-width: 380px; margin: 0 auto; }
  .promo-tags { display: flex; gap: 10px; justify-content: center; margin-top: 28px; flex-wrap: wrap; }
  .promo-tag {
    background: linear-gradient(135deg, #667eea20, #764ba220);
    border: 1px solid #667eea40; color: #4c51bf;
    padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  }
`;

export default function Promociones() {
  return (
    <div className="promo-wrap">
      <style>{S}</style>
      <div className="page-header">
        <h2>Promociones</h2>
        <p>Gestión de promociones y descuentos</p>
      </div>
      <div className="promo-coming">
        <div className="promo-icon-wrap">
          <MdLocalOffer size={48} color="#667eea" />
        </div>
        <h3>Módulo en desarrollo</h3>
        <p>Próximamente podrás crear y gestionar promociones, cupones y descuentos para tus clientes.</p>
        <div className="promo-tags">
          <span className="promo-tag">🏷️ Cupones de descuento</span>
          <span className="promo-tag">📅 Promociones por fecha</span>
          <span className="promo-tag">🎯 Descuentos por categoría</span>
          <span className="promo-tag">🔖 2x1 y ofertas especiales</span>
        </div>
      </div>
    </div>
  );
}
