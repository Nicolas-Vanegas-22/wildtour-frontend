import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProviderRepo } from '../../infrastructure/repositories/ProviderRepo';
import { useAuthStore } from '../../application/state/useAuthStore';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeServices: number;
  occupancyRate: number;
}

interface Booking {
  id: string;
  service: {
    name: string;
    image: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  checkIn: string;
  checkOut?: string;
  guests: {
    adults: number;
    children: number;
  };
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  specialRequests?: string;
}

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'calendar' | 'analytics'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const { data: stats } = useQuery({
    queryKey: ['provider-stats', selectedTimeRange],
    queryFn: () => ProviderRepo.getStats(selectedTimeRange)
  });

  const { data: recentBookings } = useQuery({
    queryKey: ['provider-bookings', 'recent'],
    queryFn: () => ProviderRepo.getRecentBookings()
  });

  const { data: services } = useQuery({
    queryKey: ['provider-services'],
    queryFn: () => ProviderRepo.getServices()
  });

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'bookings', label: 'Reservas', icon: '📅' },
    { id: 'services', label: 'Servicios', icon: '🏨' },
    { id: 'calendar', label: 'Calendario', icon: '📆' },
    { id: 'analytics', label: 'Analíticas', icon: '📈' }
  ];

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'cancel') => {
    try {
      await ProviderRepo.updateBookingStatus(bookingId, action);
      // Refetch data
      alert(`Reserva ${action === 'confirm' ? 'confirmada' : 'cancelada'} exitosamente`);
    } catch (error) {
      alert('Error al actualizar la reserva');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Proveedor</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
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
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Crear servicio
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
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
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stats?.pendingBookings || 0} pendientes</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+${(stats?.monthlyRevenue || 0).toLocaleString()} este mes</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Calificación</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats?.averageRating || 0).toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stats?.totalReviews || 0} opiniones</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ocupación</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats?.occupancyRate || 0).toFixed(0)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stats?.activeServices || 0} servicios activos</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Reservas Recientes</h2>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver todas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Servicio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Huéspedes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings?.slice(0, 5).map((booking: Booking) => (
                    <tr key={booking.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer.name}</div>
                          <div className="text-sm text-gray-500">{booking.customer.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img src={booking.service.image} alt={booking.service.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium">{booking.service.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {booking.guests.adults + booking.guests.children}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        ${booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' :
                           booking.status === 'pending' ? 'Pendiente' :
                           booking.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'confirm')}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'cancel')}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <BookingsTab />
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <ServicesTab services={services} />
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <CalendarTab />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsTab />
        </div>
      )}
    </div>
  );
}

// Bookings Tab Component
function BookingsTab() {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const { data: bookings } = useQuery({
    queryKey: ['provider-bookings', filter, dateRange],
    queryFn: () => ProviderRepo.getBookings(filter, dateRange)
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Reservas</h2>

        <div className="flex space-x-4 mt-4 lg:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Todas las reservas</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Servicio</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Huéspedes</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking: Booking) => (
              <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-mono text-gray-600">#{booking.id.slice(-6)}</td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{booking.customer.name}</div>
                    <div className="text-sm text-gray-500">{booking.customer.email}</div>
                    <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img src={booking.service.image} alt={booking.service.name} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium">{booking.service.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                  {booking.checkOut && (
                    <div className="text-gray-500">hasta {new Date(booking.checkOut).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {booking.guests.adults} adulto(s)
                  {booking.guests.children > 0 && <div>{booking.guests.children} niño(s)</div>}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  ${booking.totalAmount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmada' :
                     booking.status === 'pending' ? 'Pendiente' :
                     booking.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Ver</button>
                    {booking.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-700 text-sm">Confirmar</button>
                        <button className="text-red-600 hover:text-red-700 text-sm">Cancelar</button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Completar</button>
                    )}
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

// Services Tab Component
function ServicesTab({ services }: { services: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mis Servicios</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Agregar Servicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <div key={service.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-green-600">${service.price.toLocaleString()}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm">{service.rating} ({service.reviewCount})</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700">
                  Editar
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-50">
                  Estadísticas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Calendar Tab Component
function CalendarTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Calendario de Disponibilidad</h2>
      <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Calendario interactivo de disponibilidad</p>
          <p className="text-sm text-gray-400">Aquí se integraría un componente de calendario completo</p>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analíticas Detalladas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Ingresos por Mes</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Gráfico de ingresos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Reservas por Servicio</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Gráfico de reservas</p>
          </div>
        </div>
      </div>
    </div>
  );
}