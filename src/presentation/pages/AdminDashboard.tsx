import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminRepo } from '../../infrastructure/repositories/AdminRepo';
import { Link } from 'react-router-dom';

interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    tourists: number;
    providers: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    pending: number;
    completed: number;
    revenue: number;
  };
  content: {
    destinations: number;
    services: number;
    reviews: number;
    flaggedReviews: number;
  };
  system: {
    serverStatus: 'healthy' | 'warning' | 'error';
    lastBackup: string;
    diskUsage: number;
    activeConnections: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'booking_created' | 'review_flagged' | 'service_created' | 'payment_completed';
  description: string;
  user?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'system'>('overview');

  const { data: stats } = useQuery({
    queryKey: ['admin-stats', selectedTimeRange],
    queryFn: () => AdminRepo.getStats(selectedTimeRange)
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => AdminRepo.getRecentActivity()
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => AdminRepo.getSystemHealth(),
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: '📊' },
    { id: 'users', label: 'Gestión de Usuarios', icon: '👥' },
    { id: 'content', label: 'Gestión de Contenido', icon: '📝' },
    { id: 'system', label: 'Estado del Sistema', icon: '⚙️' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return '👤';
      case 'booking_created': return '📅';
      case 'review_flagged': return '🚩';
      case 'service_created': return '🏨';
      case 'payment_completed': return '💳';
      default: return '📋';
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-error-600';
      case 'warning': return 'text-warning-600';
      default: return 'text-primary-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-700">Panel de Administración</h1>
          <p className="text-neutral-600">Gestiona y supervisa la plataforma WildTour</p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>

          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            systemHealth?.status === 'healthy' ? 'bg-success-100 text-success-800' :
            systemHealth?.status === 'warning' ? 'bg-warning-100 text-warning-800' :
            'bg-error-100 text-error-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              systemHealth?.status === 'healthy' ? 'bg-success-500' :
              systemHealth?.status === 'warning' ? 'bg-warning-500' :
              'bg-error-500'
            }`}></div>
            <span className="text-sm font-medium">
              {systemHealth?.status === 'healthy' ? 'Sistema Saludable' :
               systemHealth?.status === 'warning' ? 'Advertencias' : 'Errores'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}>
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="text-sm text-success-600 font-medium">+{stats?.users?.newThisMonth || 0} este mes</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Usuarios Totales</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-2">{(stats?.users?.total || 0).toLocaleString()}</p>
              <div className="text-sm text-neutral-600">
                <span>{stats?.users?.tourists || 0} turistas • {stats?.users?.providers || 0} proveedores</span>
              </div>
            </div>

            {/* Bookings Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm text-success-600 font-medium">+{stats?.bookings?.thisMonth || 0} este mes</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Reservas</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-2">{(stats?.bookings?.total || 0).toLocaleString()}</p>
              <div className="text-sm text-neutral-600">
                <span>{stats?.bookings?.pending || 0} pendientes</span>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-sm text-success-600 font-medium">+15.3%</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Ingresos</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-2">${(stats?.bookings?.revenue || 0).toLocaleString()}</p>
              <div className="text-sm text-neutral-600">
                <span>Comisiones de plataforma</span>
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                {stats?.content?.flaggedReviews && stats.content.flaggedReviews > 0 && (
                  <span className="text-sm text-error-600 font-medium">{stats.content.flaggedReviews} reportadas</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Contenido</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-2">{(stats?.content?.destinations || 0).toLocaleString()}</p>
              <div className="text-sm text-neutral-600">
                <span>{stats?.content?.services || 0} servicios • {stats?.content?.reviews || 0} opiniones</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link
                to="/admin/reviews/moderation"
                className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900">Moderar Opiniones</span>
                {stats?.content?.flaggedReviews && stats.content.flaggedReviews > 0 && (
                  <span className="text-xs text-error-600 mt-1">{stats.content.flaggedReviews} pendientes</span>
                )}
              </Link>

              <button className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900">Gestionar Usuarios</span>
              </button>

              <button className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900">Aprobar Servicios</span>
              </button>

              <button className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900">Ver Reportes</span>
              </button>

              <button className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900">Configuración</span>
              </button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ingresos por Mes</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg">
                <div className="text-center">
                  <p className="text-neutral-500 mb-2">Gráfico de ingresos mensuales</p>
                  <p className="text-sm text-neutral-400">Integración con Chart.js o similar</p>
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Crecimiento de Usuarios</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg">
                <div className="text-center">
                  <p className="text-neutral-500 mb-2">Gráfico de crecimiento de usuarios</p>
                  <p className="text-sm text-neutral-400">Turistas vs Proveedores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Actividad Reciente</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver toda la actividad
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity?.slice(0, 10).map((activity: RecentActivity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {activity.user && (
                        <span className="text-xs text-neutral-500">{activity.user}</span>
                      )}
                      <span className="text-xs text-neutral-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 text-xs font-medium ${getActivityColor(activity.severity)}`}>
                    {activity.severity === 'error' ? 'Error' :
                     activity.severity === 'warning' ? 'Advertencia' : 'Info'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <UsersManagement />
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <ContentManagement />
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <SystemManagement systemHealth={systemHealth} />
        </div>
      )}
    </div>
  );
}

// Users Management Component
function UsersManagement() {
  const [filter, setFilter] = useState('all');

  const { data: users } = useQuery({
    queryKey: ['admin-users', filter],
    queryFn: () => AdminRepo.getUsers(filter)
  });

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos los usuarios</option>
            <option value="tourists">Turistas</option>
            <option value="providers">Proveedores</option>
            <option value="suspended">Suspendidos</option>
          </select>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 text-sm">
            Exportar datos
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Usuario</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Registro</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Última actividad</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id} className="border-b border-neutral-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=32`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">{user.name}</p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.type === 'provider' ? 'bg-primary-100 text-primary-800' : 'bg-success-100 text-success-800'
                  }`}>
                    {user.type === 'provider' ? 'Proveedor' : 'Turista'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-neutral-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-neutral-900">
                  {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'Nunca'}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-success-100 text-success-800' :
                    user.status === 'suspended' ? 'bg-error-100 text-error-800' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {user.status === 'active' ? 'Activo' :
                     user.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">Ver</button>
                    <button className="text-warning-600 hover:text-warning-700 text-sm">Editar</button>
                    <button className="text-error-600 hover:text-error-700 text-sm">Suspender</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Content Management Component
function ContentManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Destinos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Publicados</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Pendientes</span>
              <span className="font-medium text-warning-600">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Rechazados</span>
              <span className="font-medium text-error-600">3</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 text-sm">
            Gestionar destinos
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Servicios</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Activos</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">En revisión</span>
              <span className="font-medium text-warning-600">7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Suspendidos</span>
              <span className="font-medium text-error-600">2</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 text-sm">
            Gestionar servicios
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Opiniones</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Publicadas</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Reportadas</span>
              <span className="font-medium text-error-600">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Ocultas</span>
              <span className="font-medium text-neutral-600">8</span>
            </div>
          </div>
          <Link
            to="/admin/reviews/moderation"
            className="block w-full mt-4 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 text-sm text-center"
          >
            Moderar opiniones
          </Link>
        </div>
      </div>
    </div>
  );
}

// System Management Component
function SystemManagement({ systemHealth }: { systemHealth: any }) {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-3">Estado del Servidor</h3>
          <div className={`flex items-center space-x-2 ${
            systemHealth?.status === 'healthy' ? 'text-success-600' :
            systemHealth?.status === 'warning' ? 'text-warning-600' : 'text-error-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              systemHealth?.status === 'healthy' ? 'bg-success-500' :
              systemHealth?.status === 'warning' ? 'bg-warning-500' : 'bg-error-500'
            }`}></div>
            <span className="font-medium">
              {systemHealth?.status === 'healthy' ? 'Saludable' :
               systemHealth?.status === 'warning' ? 'Advertencia' : 'Error'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-3">Uso de Disco</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Usado</span>
              <span className="text-sm font-medium">{systemHealth?.diskUsage || 45}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  (systemHealth?.diskUsage || 45) > 80 ? 'bg-error-500' :
                  (systemHealth?.diskUsage || 45) > 60 ? 'bg-warning-500' : 'bg-success-500'
                }`}
                style={{ width: `${systemHealth?.diskUsage || 45}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-3">Conexiones Activas</h3>
          <p className="text-2xl font-bold text-neutral-900">{systemHealth?.activeConnections || 127}</p>
          <p className="text-sm text-neutral-600">usuarios conectados</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-lg mb-3">Último Backup</h3>
          <p className="text-sm text-neutral-900">
            {systemHealth?.lastBackup ? new Date(systemHealth.lastBackup).toLocaleString() : 'No disponible'}
          </p>
          <button className="mt-2 text-success-600 hover:text-success-700 text-sm font-medium">
            Crear backup ahora
          </button>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Acciones del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Crear Backup</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50">
            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reiniciar Servicios</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Ver Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
}