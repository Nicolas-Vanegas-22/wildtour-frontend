import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Calendar, Heart, MessageCircle, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../application/state/useAuthStore';

export interface Notification {
  id: number;
  userId: number;
  type: 'booking' | 'favorite' | 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: number) => void;
}

const notificationIcons = {
  booking: Calendar,
  favorite: Heart,
  review: MessageCircle,
  system: AlertCircle,
  promotion: MapPin,
};

const notificationColors = {
  booking: 'text-primary-600 bg-primary-100',
  favorite: 'text-secondary-600 bg-secondary-100',
  review: 'text-accent-600 bg-accent-100',
  system: 'text-neutral-600 bg-neutral-100',
  promotion: 'text-success-600 bg-success-100',
};

export default function NotificationsDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-strong border border-neutral-200 overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 px-4 py-3 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-neutral-800">Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Acciones */}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 hover:bg-neutral-50 transition-colors ${
                        !notification.isRead ? 'bg-primary-50/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icono */}
                        <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-neutral-800 text-sm">
                                {notification.title}
                              </p>
                              <p className="text-neutral-600 text-sm mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-neutral-400 text-xs mt-1">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>

                            {/* Indicador de no leída */}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center gap-2 mt-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Marcar como leída
                              </button>
                            )}
                            {notification.link && (
                              <Link
                                to={notification.link}
                                onClick={onClose}
                                className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                              >
                                Ver más
                              </Link>
                            )}
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="text-xs text-error-600 hover:text-error-700 font-medium flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-neutral-50 border-t border-neutral-200 px-4 py-3">
              <Link
                to="/notificaciones"
                onClick={onClose}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center block"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
