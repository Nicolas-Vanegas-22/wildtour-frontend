import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Check,
  Star,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { Service } from '../../../domain/models/CustomPackage';
import { usePackageStore } from '../../../application/state/usePackageStore';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { currentPackage, addService, removeService, updateServicePersons } = usePackageStore();
  const [persons, setPersons] = useState(service.pricing.minPersons);
  const [showDetails, setShowDetails] = useState(false);

  // Verificar si el servicio ya está en el paquete
  const isInPackage = currentPackage?.modules[service.category]?.selectedServices.some(
    (s) => s.service.id === service.id
  );

  const selectedService = currentPackage?.modules[service.category]?.selectedServices.find(
    (s) => s.service.id === service.id
  );

  const handleAddToPackage = () => {
    addService(service, persons);
  };

  const handleRemoveFromPackage = () => {
    removeService(service.id);
  };

  const handleIncrementPersons = () => {
    const newPersons = Math.min(persons + 1, service.pricing.maxPersons);
    setPersons(newPersons);
    if (isInPackage) {
      updateServicePersons(service.id, newPersons);
    }
  };

  const handleDecrementPersons = () => {
    const newPersons = Math.max(persons - 1, service.pricing.minPersons);
    setPersons(newPersons);
    if (isInPackage) {
      updateServicePersons(service.id, newPersons);
    }
  };

  const calculatePrice = () => {
    return service.pricing.basePrice * persons;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
        isInPackage ? 'border-primary-400 ring-2 ring-primary-200' : 'border-transparent'
      }`}
    >
      {/* Imagen */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={service.images[0]?.url}
          alt={service.images[0]?.alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium px-3 py-1 rounded-full shadow-md">
            {service.location}
          </span>
        </div>

        {/* Badge de seleccionado */}
        {isInPackage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-primary-500 text-white p-2 rounded-full shadow-lg"
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </motion.div>
        )}

        {/* Rating */}
        {service.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-neutral-900">{service.rating}</span>
            {service.reviewCount && (
              <span className="text-xs text-neutral-600">({service.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-5">
        {/* Título y descripción */}
        <h4 className="text-base sm:text-lg font-display font-bold text-neutral-900 mb-2 line-clamp-1">
          {service.name}
        </h4>
        <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 line-clamp-2">
          {service.shortDescription}
        </p>

        {/* Features destacados */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md"
            >
              {feature}
            </span>
          ))}
          {service.features.length > 3 && (
            <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md font-medium">
              +{service.features.length - 3}
            </span>
          )}
        </div>

        {/* Mostrar detalles adicionales */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mb-4 pt-2 border-t border-neutral-200">
                <p className="text-sm text-neutral-700 mb-3">{service.description}</p>

                {service.features.length > 3 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-700 mb-1">
                      Características completas:
                    </p>
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-neutral-600">
                        <Check className="w-3 h-3 text-primary-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {service.schedule && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <Clock className="w-3 h-3" />
                      <span>Horarios disponibles</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón ver más/menos */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
        >
          {showDetails ? (
            <>
              <span>Ver menos</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Ver más detalles</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Selector de personas */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Número de personas</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">
                {service.pricing.minPersons}-{service.pricing.maxPersons} personas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrementPersons}
              disabled={persons <= service.pricing.minPersons}
              className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-300 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 rounded-lg py-2">
              <Users className="w-4 h-4 text-neutral-600" />
              <span className="text-lg font-semibold text-neutral-900">{persons}</span>
            </div>

            <button
              onClick={handleIncrementPersons}
              disabled={persons >= service.pricing.maxPersons}
              className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-300 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Precio y acción */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-neutral-200">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Total para {persons} persona(s)</p>
            <p className="text-xl sm:text-2xl font-bold text-primary-700">{formatPrice(calculatePrice())}</p>
            <p className="text-xs text-neutral-500">
              {formatPrice(service.pricing.basePrice)} / persona
            </p>
          </div>

          {isInPackage ? (
            <button
              onClick={handleRemoveFromPackage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Quitar</span>
            </button>
          ) : (
            <button
              onClick={handleAddToPackage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
