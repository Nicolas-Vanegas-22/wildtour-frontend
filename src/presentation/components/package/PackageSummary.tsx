import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowRight,
  Package,
  Receipt,
} from 'lucide-react';
import { usePackageStore } from '../../../application/state/usePackageStore';
import { CATEGORIES_INFO } from '../../../data/customPackageServices';

interface PackageSummaryProps {
  onContinueToCheckout: () => void;
  showCheckoutButton?: boolean;
  isMobile?: boolean;
}

export default function PackageSummary({
  onContinueToCheckout,
  showCheckoutButton = true,
  isMobile = false,
}: PackageSummaryProps) {
  const { currentPackage, removeService } = usePackageStore();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (category: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedModules(newExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasServices = currentPackage && Object.keys(currentPackage.modules).length > 0;

  const getTotalServices = () => {
    if (!currentPackage) return 0;
    return Object.values(currentPackage.modules).reduce(
      (sum, module) => sum + module.selectedServices.length,
      0
    );
  };

  if (isMobile) {
    // Versión mobile compacta
    return (
      <div className="p-3">
        {hasServices ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs text-neutral-600 mb-1">
                {getTotalServices()} servicio{getTotalServices() !== 1 ? 's' : ''}
              </p>
              <p className="text-lg font-bold text-primary-700">{formatPrice(currentPackage!.total)}</p>
            </div>
            {showCheckoutButton && (
              <button
                onClick={onContinueToCheckout}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center py-2">
            Agrega servicios para continuar
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-6 h-fit">
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">Tu Paquete</h3>
              <p className="text-sm text-white/90">
                {getTotalServices()} servicio{getTotalServices() !== 1 ? 's' : ''} seleccionado
                {getTotalServices() !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          {!hasServices ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-neutral-400" />
              </div>
              <p className="text-neutral-500 mb-2 font-medium">Tu paquete está vacío</p>
              <p className="text-sm text-neutral-400">
                Selecciona servicios para comenzar a armar tu experiencia
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Módulos */}
              {Object.entries(currentPackage!.modules).map(([categoryKey, module]) => {
                const categoryInfo = CATEGORIES_INFO.find((c) => c.category === categoryKey);
                const isExpanded = expandedModules.has(categoryKey);

                return (
                  <motion.div
                    key={categoryKey}
                    layout
                    className="bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200"
                  >
                    {/* Header del módulo */}
                    <button
                      onClick={() => toggleModule(categoryKey)}
                      className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 font-bold text-sm">
                            {module.selectedServices.length}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-neutral-900 text-sm">
                            {categoryInfo?.title}
                          </p>
                          <p className="text-xs text-neutral-600">{formatPrice(module.subtotal)}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>

                    {/* Servicios del módulo */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-2">
                            {module.selectedServices.map((selectedService) => (
                              <motion.div
                                key={selectedService.service.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="bg-white rounded-lg p-3 shadow-sm border border-neutral-200"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                      {selectedService.service.name}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      {selectedService.persons} persona
                                      {selectedService.persons !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeService(selectedService.service.id)}
                                    className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors flex-shrink-0"
                                    title="Eliminar servicio"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-neutral-500">
                                    {formatPrice(selectedService.service.pricing.basePrice)} × {selectedService.persons}
                                  </p>
                                  <p className="text-sm font-bold text-primary-700">
                                    {formatPrice(selectedService.subtotal)}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con totales */}
        {hasServices && (
          <div className="border-t border-neutral-200 p-5 space-y-3 bg-neutral-50">
            {/* Subtotal por módulo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <Receipt className="w-4 h-4" />
                <span>Desglose por categoría</span>
              </div>
              {Object.entries(currentPackage!.modules).map(([categoryKey, module]) => {
                const categoryInfo = CATEGORIES_INFO.find((c) => c.category === categoryKey);
                return (
                  <div key={categoryKey} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{categoryInfo?.title}</span>
                    <span className="font-medium text-neutral-900">
                      {formatPrice(module.subtotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-neutral-300 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(currentPackage!.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">IVA (19%)</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(currentPackage!.taxes)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                <span className="text-lg font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-bold text-primary-700">
                  {formatPrice(currentPackage!.total)}
                </span>
              </div>
            </div>

            {/* Botón de checkout */}
            {showCheckoutButton && (
              <button
                onClick={onContinueToCheckout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all group"
              >
                <span>Continuar con la reserva</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
