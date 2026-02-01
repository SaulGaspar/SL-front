import { useState } from "react";
import MetricCard from "../../components/cards/MetricCard";
import SalesLineChart from "../../components/charts/SalesLineChart";
import BranchBarChart from "../../components/charts/BranchBarChart";
import TopProductsTable from "../../components/tables/TopProductsTable";
import { FaDollarSign, FaChartLine, FaStore } from "react-icons/fa";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("metricas");
  const [fadeKey, setFadeKey] = useState(0);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setFadeKey(prev => prev + 1); // Fuerza la reanimación
  };

  const sections = [
    { id: "metricas", label: "Métricas", icon: "📊", color: "from-green-500 to-emerald-600" },
    { id: "ventas", label: "Ventas", icon: "🏪", color: "from-purple-500 to-pink-600" },
    { id: "ingresos", label: "Ingresos", icon: "📈", color: "from-blue-500 to-blue-600" },
    { id: "productos", label: "Productos Más Vendidos", icon: "🔥", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* CABECERA */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard General</h1>
              <p className="text-gray-600 font-medium">Resumen operativo de la red de sucursales</p>
            </div>
            <div className="flex flex-col items-end gap-2">
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN DE SECCIONES (NAVBAR) */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`
                  relative px-6 py-4 rounded-xl font-bold text-base transition-all duration-300
                  ${activeSection === section.id 
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105 border-2 border-white` 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent hover:scale-102'}
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  <span>{section.label}</span>
                </div>
                {activeSection === section.id && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-200 shadow-md"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENIDO DINÁMICO SEGÚN LA SECCIÓN ACTIVA */}
        <div 
          key={fadeKey}
          className="transition-opacity duration-300 ease-in-out opacity-100"
        >
          
          {/* SECCIÓN: MÉTRICAS */}
          {activeSection === "metricas" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Métricas</h2>
                  <p className="text-sm text-gray-600">Indicadores clave de rendimiento</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard 
                    title="Ventas Hoy" 
                    icon={<FaDollarSign className="text-green-500" />} 
                    apiKey="totalSales" 
                    bgColor="bg-gradient-to-br from-green-50 to-emerald-50" 
                  />
                  <MetricCard 
                    title="Ventas Semana" 
                    icon={<FaChartLine className="text-blue-500" />} 
                    apiKey="totalSales" 
                    bgColor="bg-gradient-to-br from-blue-50 to-sky-50" 
                  />
                  <MetricCard 
                    title="Sucursales" 
                    icon={<FaStore className="text-purple-500" />} 
                    apiKey="branchesCount" 
                    bgColor="bg-gradient-to-br from-purple-50 to-pink-50" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN: VENTAS */}
          {activeSection === "ventas" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Ventas</h2>
                  <p className="text-sm text-gray-600">Análisis por sucursal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 border-b-4 border-purple-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">Ventas por Sucursal</h3>
                      <p className="text-purple-100 text-sm font-medium">Comparativa de rendimiento</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <BranchBarChart />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN: INGRESOS */}
          {activeSection === "ingresos" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Ingresos</h2>
                  <p className="text-sm text-gray-600">Evolución temporal de ingresos</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 border-b-4 border-blue-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">Análisis de Ingresos Diarios</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <SalesLineChart />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN: PRODUCTOS MÁS VENDIDOS */}
          {activeSection === "productos" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Productos Más Vendidos</h2>
                  <p className="text-sm text-gray-600">Top de productos con mejor rendimiento</p>
                </div>
              </div>
              
              <TopProductsTable />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}