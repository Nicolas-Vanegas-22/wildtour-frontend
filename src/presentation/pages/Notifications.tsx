import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Settings, Check, X, Trash2, Filter, Search, MessageSquare, Calendar, CreditCard, Users, Globe } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'system' | 'promotion' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actions?: {
    label: string;
    action: () => void;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Nueva reserva confirmada',
      message: 'Tu reserva para "Tour por el Cocuy" ha sido confirmada para el 25 de septiembre.',
      timestamp: '2024-09-18T10:30:00Z',
      read: false,
      priority: 'high',
      category: 'Reservas',
      actions: [
        { label: 'Ver detalles', action: () => {}, variant: 'primary' },
        { label: 'Descargar voucher', action: () => {}, variant: 'secondary' }
      ]
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pago procesado exitosamente',
      message: 'Tu pago de $150.000 COP ha sido procesado correctamente.',
      timestamp: '2024-09-18T09:15:00Z',
      read: false,
      priority: 'medium',
      category: 'Pagos'
    },
    {
      id: '3',
      type: 'review',
      title: 'Nueva reseña recibida',
      message: 'Has recibido una nueva reseña de 5 estrellas para tu servicio "Aventura en los Llanos".',
      timestamp: '2024-09-17T16:45:00Z',
      read: true,
      priority: 'medium',
      category: 'Reseñas',
      actions: [
        { label: 'Responder', action: () => {}, variant: 'primary' },
        { label: 'Ver reseña', action: () => {}, variant: 'secondary' }
      ]
    },
    {
      id: '4',
      type: 'system',
      title: 'Actualización de términos y condiciones',
      message: 'Hemos actualizado nuestros términos y condiciones. Por favor revísalos.',
      timestamp: '2024-09-16T12:00:00Z',
      read: true,
      priority: 'low',
      category: 'Sistema'
    },
    {
      id: '5',
      type: 'promotion',
      title: '¡Oferta especial disponible!',
      message: 'Descuento del 20% en tours de aventura este fin de semana.',
      timestamp: '2024-09-15T08:00:00Z',
      read: false,
      priority: 'medium',
      category: 'Promociones'
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Recordatorio de viaje',
      message: 'Tu viaje a Cartagena comienza mañana. ¡No olvides tus documentos!',
      timestamp: '2024-09-14T18:30:00Z',
      read: false,
      priority: 'high',
      category: 'Recordatorios'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'review': return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'system': return <Settings className="w-5 h-5 text-gray-500" />;
      case 'promotion': return <Globe className="w-5 h-5 text-purple-500" />;
      case 'reminder': return <Bell className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'read' && notification.read);

    const matchesType = filterType === 'all' || notification.type === filterType;

    const matchesSearch = searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesType && matchesSearch;
  });

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const markAsRead = (ids: string[]) => {
    console.log('Marking as read:', ids);
  };

  const markAsUnread = (ids: string[]) => {
    console.log('Marking as unread:', ids);
  };

  const deleteNotifications = (ids: string[]) => {
    console.log('Deleting notifications:', ids);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                  <p className="text-sm text-gray-600">
                    {unreadCount} notificaciones sin leer
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Configurar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'Todas', count: notifications.length },
                  { id: 'unread', label: 'No leídas', count: unreadCount },
                  { id: 'read', label: 'Leídas', count: notifications.length - unreadCount }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="booking">Reservas</option>
                  <option value="payment">Pagos</option>
                  <option value="review">Reseñas</option>
                  <option value="system">Sistema</option>
                  <option value="promotion">Promociones</option>
                  <option value="reminder">Recordatorios</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedNotifications.length} notificación(es) seleccionada(s)
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsRead(selectedNotifications)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Marcar como leída</span>
                  </button>
                  <button
                    onClick={() => markAsUnread(selectedNotifications)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Marcar como no leída</span>
                  </button>
                  <button
                    onClick={() => deleteNotifications(selectedNotifications)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Select All */}
          {filteredNotifications.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Seleccionar todas</span>
              </label>
            </div>
          )}

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                <p className="text-gray-600">No tienes notificaciones que coincidan con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  } ${getPriorityColor(notification.priority)} border-l-4`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {notification.category}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>

                            {notification.actions && (
                              <div className="flex space-x-2">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={action.action}
                                    className={`text-xs px-3 py-1 rounded-md transition-colors ${
                                      action.variant === 'primary'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : action.variant === 'danger'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;