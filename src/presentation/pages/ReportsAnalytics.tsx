import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReportsRepo } from '../../infrastructure/repositories/ReportsRepo';

interface ReportData {
  bookings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byMonth: Array<{ month: string; count: number; revenue: number }>;
    byService: Array<{ name: string; count: number; revenue: number }>;
    byStatus: Array<{ status: string; count: number; percentage: number }>;
  };
  users: {
    total: number;
    active: number;
    newUsers: number;
    churnRate: number;
    byType: Array<{ type: string; count: number }>;
    byRegion: Array<{ region: string; count: number }>;
    activityTrend: Array<{ date: string; active: number }>;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byMonth: Array<{ month: string; amount: number }>;
    byCategory: Array<{ category: string; amount: number; percentage: number }>;
    commissions: number;
  };
  search: {
    topQueries: Array<{ query: string; count: number; conversionRate: number }>;
    topDestinations: Array<{ destination: string; searches: number; bookings: number }>;
    searchTrends: Array<{ date: string; searches: number }>;
    deviceBreakdown: Array<{ device: string; percentage: number }>;
  };
  performance: {
    avgResponseTime: number;
    uptimePercentage: number;
    errorRate: number;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
}

export default function ReportsAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'bookings' | 'users' | 'revenue' | 'search' | 'performance'>('overview');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', selectedTimeRange],
    queryFn: () => ReportsRepo.getReports(selectedTimeRange)
  });

  const handleExport = async () => {
    try {
      const exportData = await ReportsRepo.exportReport(selectedReport, selectedTimeRange, exportFormat);
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([exportData]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `wildtour_report_${selectedReport}_${selectedTimeRange}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al exportar el reporte');
    }
  };

  const reportTabs = [
    { id: 'overview', label: 'Resumen General', icon: '📊' },
    { id: 'bookings', label: 'Reservas', icon: '📅' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'revenue', label: 'Ingresos', icon: '💰' },
    { id: 'search', label: 'Búsquedas', icon: '🔍' },
    { id: 'performance', label: 'Rendimiento', icon: '⚡' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analíticas</h1>
          <p className="text-gray-600">Análisis detallado de tu plataforma WildTour</p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>

          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                selectedReport === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedReport === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{reportData?.bookings?.total?.toLocaleString() || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${reportData?.bookings?.growth && reportData.bookings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(reportData?.bookings?.growth || 0)} vs período anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-3xl font-bold text-gray-900">{reportData?.users?.active?.toLocaleString() || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {reportData?.users?.newUsers || 0} nuevos usuarios
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(reportData?.revenue?.thisMonth || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${reportData?.revenue?.growth && reportData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(reportData?.revenue?.growth || 0)} vs período anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {((reportData?.bookings?.total || 0) / Math.max(reportData?.performance?.uniqueVisitors || 1, 1) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  De {reportData?.performance?.uniqueVisitors?.toLocaleString() || 0} visitantes únicos
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Gráfico de línea - Ingresos por mes</p>
                  <p className="text-sm text-gray-400">Integración con Chart.js</p>
                </div>
              </div>
            </div>

            {/* Booking Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Reservas</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Gráfico de dona - Reservas por categoría</p>
                  <p className="text-sm text-gray-400">Hospedaje, Tours, Transporte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Destinations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinos Más Populares</h3>
              <div className="space-y-3">
                {reportData?.search?.topDestinations?.slice(0, 5).map((destination, index) => (
                  <div key={destination.destination} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{destination.destination}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{destination.bookings} reservas</p>
                      <p className="text-xs text-gray-500">{destination.searches} búsquedas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo de respuesta promedio</span>
                  <span className="font-medium">{reportData?.performance?.avgResponseTime || 150}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-green-600">{reportData?.performance?.uptimePercentage || 99.9}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de error</span>
                  <span className="font-medium text-red-600">{reportData?.performance?.errorRate || 0.1}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Páginas vistas</span>
                  <span className="font-medium">{reportData?.performance?.pageViews?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de rebote</span>
                  <span className="font-medium">{reportData?.performance?.bounceRate || 32}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {selectedReport === 'bookings' && (
        <div className="space-y-6">
          <BookingsReport data={reportData?.bookings} />
        </div>
      )}

      {/* Users Tab */}
      {selectedReport === 'users' && (
        <div className="space-y-6">
          <UsersReport data={reportData?.users} />
        </div>
      )}

      {/* Revenue Tab */}
      {selectedReport === 'revenue' && (
        <div className="space-y-6">
          <RevenueReport data={reportData?.revenue} />
        </div>
      )}

      {/* Search Tab */}
      {selectedReport === 'search' && (
        <div className="space-y-6">
          <SearchReport data={reportData?.search} />
        </div>
      )}

      {/* Performance Tab */}
      {selectedReport === 'performance' && (
        <div className="space-y-6">
          <PerformanceReport data={reportData?.performance} />
        </div>
      )}
    </div>
  );
}

// Bookings Report Component
function BookingsReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Reservas por Estado</h3>
          <div className="space-y-3">
            {data?.byStatus?.map((status: any) => (
              <div key={status.status} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{status.status}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{status.count}</span>
                  <span className="text-xs text-gray-500">({status.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Top Servicios</h3>
          <div className="space-y-3">
            {data?.byService?.slice(0, 5).map((service: any, index: number) => (
              <div key={service.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <span className="font-medium">{service.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Estadísticas Clave</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Promedio por reserva</span>
              <span className="font-medium">
                ${Math.round((data?.byService?.reduce((sum: number, s: any) => sum + s.revenue, 0) || 0) / Math.max(data?.total || 1, 1)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de cancelación</span>
              <span className="font-medium">
                {((data?.byStatus?.find((s: any) => s.status === 'cancelled')?.count || 0) / Math.max(data?.total || 1, 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo promedio de reserva</span>
              <span className="font-medium">2.3 días</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Reservas por Mes</h3>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Gráfico de barras - Reservas y ingresos por mes</p>
            <p className="text-sm text-gray-400">Implementar con Chart.js o D3.js</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Report Component
function UsersReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Usuarios por Tipo</h3>
          <div className="space-y-3">
            {data?.byType?.map((type: any) => (
              <div key={type.type} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{type.type === 'tourist' ? 'Turistas' : 'Proveedores'}</span>
                <span className="font-medium">{type.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Usuarios por Región</h3>
          <div className="space-y-3">
            {data?.byRegion?.slice(0, 5).map((region: any) => (
              <div key={region.region} className="flex justify-between items-center">
                <span className="text-gray-600">{region.region}</span>
                <span className="font-medium">{region.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Métricas de Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de retención</span>
              <span className="font-medium">
                {(100 - (data?.churnRate || 0)).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usuarios activos diarios</span>
              <span className="font-medium">{Math.round((data?.active || 0) * 0.3).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sesiones por usuario</span>
              <span className="font-medium">4.2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad de Usuarios en el Tiempo</h3>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Gráfico de línea - Usuarios activos por día</p>
            <p className="text-sm text-gray-400">Tendencia de actividad y engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Revenue Report Component
function RevenueReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${(data?.total || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Este Mes</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${(data?.thisMonth || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Comisiones</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${(data?.commissions || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Crecimiento</h3>
          <p className={`text-3xl font-bold ${(data?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data?.growth ? (data.growth > 0 ? '+' : '') + data.growth.toFixed(1) + '%' : '0%'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Categoría</h3>
          <div className="space-y-3">
            {data?.byCategory?.map((category: any) => (
              <div key={category.category} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{category.category}</span>
                <div className="text-right">
                  <span className="font-medium">${category.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-2">({category.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyección de Ingresos</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Gráfico de proyección</p>
              <p className="text-sm text-gray-400">Basado en tendencias actuales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Report Component
function SearchReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultas Más Populares</h3>
          <div className="space-y-3">
            {data?.topQueries?.slice(0, 10).map((query: any, index: number) => (
              <div key={query.query} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="font-medium">{query.query}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{query.count} búsquedas</span>
                  <span className="text-xs text-gray-500 block">{query.conversionRate}% conversión</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos de Búsqueda</h3>
          <div className="space-y-4">
            {data?.deviceBreakdown?.map((device: any) => (
              <div key={device.device} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 capitalize">{device.device}</span>
                  <span className="font-medium">{device.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Búsquedas</h3>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Gráfico de línea - Búsquedas por día</p>
            <p className="text-sm text-gray-400">Picos de actividad y estacionalidad</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Report Component
function PerformanceReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Métricas de Rendimiento</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo de respuesta</span>
              <span className="font-medium">{data?.avgResponseTime || 150}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium text-green-600">{data?.uptimePercentage || 99.9}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de error</span>
              <span className="font-medium text-red-600">{data?.errorRate || 0.1}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Tráfico Web</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Páginas vistas</span>
              <span className="font-medium">{(data?.pageViews || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visitantes únicos</span>
              <span className="font-medium">{(data?.uniqueVisitors || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de rebote</span>
              <span className="font-medium">{data?.bounceRate || 32}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Optimización</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Score de velocidad</span>
              <span className="font-medium text-green-600">87/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Optimización móvil</span>
              <span className="font-medium text-green-600">92/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SEO Score</span>
              <span className="font-medium text-green-600">95/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoreo en Tiempo Real</h3>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Dashboard en tiempo real</p>
            <p className="text-sm text-gray-400">Métricas de rendimiento actualizadas cada minuto</p>
          </div>
        </div>
      </div>
    </div>
  );
}