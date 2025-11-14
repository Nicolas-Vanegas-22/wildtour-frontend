import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  MoreVertical,
  Image as ImageIcon,
} from 'lucide-react';
import { ProviderService } from '../../../domain/models/ProviderService';
import { Button } from '../../../shared/ui/Button';
import { CATEGORIES_INFO } from '../../../data/customPackageServices';

interface ServiceListProps {
  services: ProviderService[];
  onEdit: (service: ProviderService) => void;
  onDelete: (service: ProviderService) => void;
  onToggleStatus: (service: ProviderService) => void;
}

export default function ServiceList({ services, onEdit, onDelete, onToggleStatus }: ServiceListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getCategoryTitle = (category: string) => {
    const cat = CATEGORIES_INFO.find((c) => c.category === category);
    return cat ? cat.title : category;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center"
      >
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No tienes servicios aún</h3>
        <p className="text-neutral-600 mb-6">
          Crea tu primer servicio para que los turistas puedan encontrarte
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition-all hover:shadow-xl ${
            service.isActive ? 'border-transparent' : 'border-warning-300 opacity-75'
          }`}
        >
          {/* Imagen principal */}
          <div className="relative h-48 bg-neutral-200 overflow-hidden">
            {service.images.length > 0 ? (
              <img
                src={service.images[0].url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-neutral-400" />
              </div>
            )}

            {/* Badge de estado */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.isActive
                    ? 'bg-success-100 text-success-700 border border-success-200'
                    : 'bg-warning-100 text-warning-700 border border-warning-200'
                }`}
              >
                {service.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Menú de opciones */}
            <div className="absolute top-3 right-3">
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === service.id ? null : service.id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-neutral-700" />
                </button>

                {activeMenu === service.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-10"
                  >
                    <button
                      onClick={() => {
                        onEdit(service);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onToggleStatus(service);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      {service.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onDelete(service);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Contador de imágenes */}
            {service.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {service.images.length}
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-5">
            {/* Categoría */}
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-3">
              {getCategoryTitle(service.category)}
            </span>

            {/* Nombre */}
            <h3 className="text-lg font-display font-bold text-neutral-900 mb-2 line-clamp-1">
              {service.name}
            </h3>

            {/* Descripción */}
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{service.description}</p>

            {/* Precio y Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                <span className="text-lg font-bold text-neutral-900">{formatPrice(service.price)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-warning-500 fill-current" />
                <span className="text-sm font-semibold text-neutral-900">
                  {service.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-500">({service.reviewCount})</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(service)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant={service.isActive ? 'outline' : 'primary'}
                size="sm"
                onClick={() => onToggleStatus(service)}
                className="flex items-center justify-center gap-2 px-4"
              >
                {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
