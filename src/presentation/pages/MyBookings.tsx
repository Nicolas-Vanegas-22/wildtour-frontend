import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { Booking, BookingStatus } from '../../domain/models/Booking';
import { useToast } from '../hooks/useToast';

// Mock data para demostración
const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'WTC001234',
    userId: 'user1',
    destinationId: 'villavieja',
    providerId: 'provider1',
    items: [
      {
        id: 'item1',
        type: 'activity',
        itemId: 'tatacoa-tour',
        name: 'Tour Astronómico Desierto de la Tatacoa',
        description: 'Experiencia nocturna de observación de estrellas',
        price: 150000,
        quantity: 1,
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        guests: 2,
        specialRequests: 'Vegetarian meals preferred'
      }
    ],
    contact: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567'
    },
    guests: [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        document: '12345678',
        email: 'juan@email.com',
        phone: '+57 300 123 4567',
        age: 30
      },
      {
        firstName: 'María',
        lastName: 'González',
        document: '87654321',
        email: 'maria@email.com',
        phone: '+57 300 765 4321',
        age: 28
      }
    ],
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    bookingDate: '2024-01-01',
    status: 'confirmed',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-01-01',
        updatedBy: 'system'
      },
      {
        status: 'confirmed',
        date: '2024-01-02',
        reason: 'Payment received',
        updatedBy: 'provider1'
      }
    ],
    pricing: {
      subtotal: 300000,
      taxes: 57000,
      fees: 10000,
      discounts: 0,
      total: 367000,
      currency: 'COP'
    },
    payment: {
      method: 'card',
      status: 'completed',
      amount: 367000,
      currency: 'COP',
      transactionId: 'TXN123456',
      paymentDate: '2024-01-01T10:30:00Z'
    },
    specialRequests: 'Vegetarian meals preferred',
    cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes',
    refundPolicy: 'Reembolso completo disponible',
    confirmationSent: true,
    remindersSent: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-02T09:15:00Z',
    reviewed: false
  },
  {
    id: '2',
    bookingNumber: 'WTC001235',
    userId: 'user1',
    destinationId: 'villavieja',
    items: [
      {
        id: 'item2',
        type: 'accommodation',
        itemId: 'desert-lodge',
        name: 'Hospedaje Desert Lodge',
        description: 'Noche en lodge con vista al desierto',
        price: 200000,
        quantity: 1,
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        guests: 2
      }
    ],
    contact: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567'
    },
    guests: [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        document: '12345678',
        email: 'juan@email.com',
        phone: '+57 300 123 4567',
        age: 30
      }
    ],
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    bookingDate: '2024-01-20',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-01-20',
        updatedBy: 'system'
      }
    ],
    pricing: {
      subtotal: 400000,
      taxes: 76000,
      fees: 15000,
      discounts: 20000,
      total: 471000,
      currency: 'COP'
    },
    payment: {
      method: 'pse',
      status: 'pending',
      amount: 471000,
      currency: 'COP'
    },
    cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes',
    refundPolicy: 'Reembolso parcial disponible',
    confirmationSent: false,
    remindersSent: 0,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    reviewed: false
  }
];

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
    textColor: 'text-yellow-600'
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    textColor: 'text-green-600'
  },
  in_progress: {
    label: 'En progreso',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
    textColor: 'text-blue-600'
  },
  completed: {
    label: 'Completada',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle,
    textColor: 'text-emerald-600'
  },
  cancelled_user: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    textColor: 'text-red-600'
  },
  cancelled_provider: {
    label: 'Cancelada por proveedor',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    textColor: 'text-red-600'
  },
  no_show: {
    label: 'No se presentó',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
    textColor: 'text-gray-600'
  },
  refunded: {
    label: 'Reembolsada',
    color: 'bg-purple-100 text-purple-800',
    icon: RefreshCw,
    textColor: 'text-purple-600'
  }
};

export default function MyBookings() {
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, dateFilter, bookings]);

  const applyFilters = () => {
    let filtered = bookings;

    // Filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filtro de fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(booking => {
        const startDate = new Date(booking.startDate);
        if (dateFilter === 'upcoming') {
          return startDate >= now;
        } else {
          return startDate < now;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      setLoading(true);
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'cancelled_user' as BookingStatus }
              : booking
          )
        );
        showToast('Reserva cancelada exitosamente', 'success');
      } catch (error) {
        showToast('Error al cancelar la reserva', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const canCancel = (booking: Booking) => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return ['pending', 'confirmed'].includes(booking.status) && hoursUntilStart > 24;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona todas tus reservas en Villavieja
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por número de reserva o servicio..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Botones de filtro */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'px-4 py-3 rounded-xl border-2 font-medium transition-all duration-300 flex items-center space-x-2',
                  showFilters
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform',
                  showFilters ? 'rotate-180' : ''
                )} />
              </button>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Panel de filtros desplegable */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled_user">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Todas las fechas</option>
                    <option value="upcoming">Próximas</option>
                    <option value="past">Pasadas</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    className="w-full"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Lista de reservas */}
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => {
            const config = statusConfig[booking.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.items[0].name}
                        </h3>
                        <p className="text-gray-600">#{booking.bookingNumber}</p>
                        <div className="flex items-center mt-2">
                          <StatusIcon className={cn('w-4 h-4 mr-2', config.textColor)} />
                          <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            config.color
                          )}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(booking.pricing.total)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.startDate)}
                        {booking.endDate !== booking.startDate &&
                          ` - ${formatDate(booking.endDate)}`
                        }
                      </div>
                    </div>
                  </div>

                  {/* Detalles básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{booking.guests.length} huéspedes</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Villavieja, Huila</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span className="capitalize">{booking.payment.method}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>

                    {canCancel(booking) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    )}

                    {booking.status === 'completed' && !booking.reviewed && (
                      <Button variant="primary" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Calificar
                      </Button>
                    )}

                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron reservas
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no tienes reservas. ¡Explora nuestros servicios!'
              }
            </p>
            <Button variant="primary">
              Explorar servicios
            </Button>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}

// Componente Modal de detalles
interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles de la Reserva
              </h2>
              <p className="text-gray-600">#{booking.bookingNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado y fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Estado</h3>
              <div className="flex items-center">
                <StatusIcon className={cn('w-5 h-5 mr-3', config.textColor)} />
                <span className={cn(
                  'px-4 py-2 rounded-full font-medium',
                  config.color
                )}>
                  {config.label}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Fechas</h3>
              <div className="space-y-1 text-gray-600">
                <p>Inicio: {formatDate(booking.startDate)}</p>
                <p>Fin: {formatDate(booking.endDate)}</p>
                <p>Reservado: {formatDate(booking.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Servicios</h3>
            <div className="space-y-3">
              {booking.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span><Users className="w-4 h-4 inline mr-1" />{item.guests} personas</span>
                        <span><Calendar className="w-4 h-4 inline mr-1" />{formatDate(item.startDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price)}</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Huéspedes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Huéspedes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.guests.map((guest, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">
                    {guest.firstName} {guest.lastName}
                  </h4>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p>Documento: {guest.document}</p>
                    <p>Email: {guest.email}</p>
                    <p>Teléfono: {guest.phone}</p>
                    <p>Edad: {guest.age} años</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de pago */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Información de Pago</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>{formatPrice(booking.pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Impuestos:</span>
                    <span>{formatPrice(booking.pricing.taxes)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tarifas:</span>
                    <span>{formatPrice(booking.pricing.fees)}</span>
                  </div>
                  {booking.pricing.discounts > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Descuentos:</span>
                      <span>-{formatPrice(booking.pricing.discounts)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-semibold border-t border-gray-200">
                    <span>Total:</span>
                    <span>{formatPrice(booking.pricing.total)}</span>
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Método:</span> <span className="capitalize">{booking.payment.method}</span></p>
                    <p><span className="font-medium">Estado:</span> <span className="capitalize">{booking.payment.status}</span></p>
                    {booking.payment.transactionId && (
                      <p><span className="font-medium">ID Transacción:</span> {booking.payment.transactionId}</p>
                    )}
                    {booking.payment.paymentDate && (
                      <p><span className="font-medium">Fecha de pago:</span> {formatDate(booking.payment.paymentDate)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solicitudes especiales */}
          {booking.specialRequests && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Solicitudes Especiales</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Historial de estado */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Historial</h3>
            <div className="space-y-2">
              {booking.statusHistory.map((history, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className={cn(
                      'w-3 h-3 rounded-full mr-3',
                      statusConfig[history.status].textColor.replace('text-', 'bg-')
                    )} />
                    <span className="font-medium">{statusConfig[history.status].label}</span>
                    {history.reason && (
                      <span className="text-sm text-gray-600 ml-2">- {history.reason}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(history.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}