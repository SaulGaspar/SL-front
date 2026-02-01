import { useEffect, useState } from "react";

export default function TopProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://sl-back.vercel.app/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error en API: ${res.status}`);
        const data = await res.json();

        const mappedProducts = (data.topProducts || []).map((p) => ({
          ...p,
          ingresos: parseFloat(p.ingresos || 0),
          vendidos: parseInt(p.vendidos || 0, 10),
        }));

        setProducts(mappedProducts);
      } catch (err) {
        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-400">Cargando productos...</div>;
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;

  const maxVendidos = Math.max(...products.map(p => p.vendidos), 1);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      {/* HEADER */}
      <div style={{
        background: '#0a1a2f',
        padding: '24px',
        borderBottom: '4px solid #0a1a2f'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '800',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: 0
          }}>
            <span style={{ fontSize: '30px' }}>🔥</span>
            Productos más vendidos
          </h3>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '700',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            Top {products.length}
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRight: '1px solid #d1d5db',
                borderBottom: '2px solid #d1d5db'
              }}>
                Ranking
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '2px solid #d1d5db'
              }}>
                Producto
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => {
              let medalBg = '';
              let medalBorder = '';
              let medalText = '';
              
              if (idx === 0) {
                medalBg = 'linear-gradient(to bottom right, #fde047, #eab308)';
                medalBorder = '#ca8a04';
                medalText = '#713f12';
              } else if (idx === 1) {
                medalBg = 'linear-gradient(to bottom right, #d1d5db, #9ca3af)';
                medalBorder = '#6b7280';
                medalText = '#1f2937';
              } else if (idx === 2) {
                medalBg = 'linear-gradient(to bottom right, #fdba74, #f97316)';
                medalBorder = '#ea580c';
                medalText = '#7c2d12';
              } else {
                medalBg = 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)';
                medalBorder = '#93c5fd';
                medalText = '#1e40af';
              }

              return (
                <tr 
                  key={idx}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #e0f2fe, #dbeafe)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  {/* Ranking */}
                  <td style={{
                    padding: '20px 24px',
                    whiteSpace: 'nowrap',
                    borderRight: '2px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '900',
                      fontSize: '16px',
                      background: medalBg,
                      color: medalText,
                      border: `2px solid ${medalBorder}`,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                    </div>
                  </td>

                  {/* Producto */}
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#1f2937'
                    }}>
                      {p.nombre}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '16px 24px',
        borderTop: '2px solid #d1d5db'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          <span style={{ color: '#4b5563', fontWeight: '600' }}>
            Total de productos destacados: <span style={{ color: '#111827', fontWeight: '700' }}>{products.length}</span>
          </span>
          <span style={{ color: '#4b5563', fontWeight: '600' }}>
            Total unidades vendidas: <span style={{ color: '#0a1a2f', fontWeight: '700' }}>
              {products.reduce((sum, p) => sum + p.vendidos, 0)} unidades
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}