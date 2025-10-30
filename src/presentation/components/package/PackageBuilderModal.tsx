import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Hotel,
  UtensilsCrossed,
  Route,
  Stars,
  MapPin,
  ArrowRight,
  Check,
} from 'lucide-react';
import { usePackageStore } from '../../../application/state/usePackageStore';
import { CATEGORIES_INFO } from '../../../data/customPackageServices';
import { ServiceCategory } from '../../../domain/models/CustomPackage';
import CategorySelector from './CategorySelector';
import ServiceGrid from './ServiceGrid';
import PackageSummary from './PackageSummary';
import FinalCheckout from './FinalCheckout';

const ICON_MAP: Record<string, React.FC<any>> = {
  Hotel,
  UtensilsCrossed,
  Route,
  Stars,
  MapPin,
};

export default function PackageBuilderModal() {
  const { isModalOpen, closeModal, currentCategory, setCurrentCategory } = usePackageStore();
  const [showFinalCheckout, setShowFinalCheckout] = useState(false);

  // Cerrar el modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleClose = () => {
    setCurrentCategory(null);
    setShowFinalCheckout(false);
    closeModal();
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    setCurrentCategory(category);
  };

  const handleBackToCategories = () => {
    setCurrentCategory(null);
  };

  const handleContinueToCheckout = () => {
    setShowFinalCheckout(true);
  };

  const handleBackFromCheckout = () => {
    setShowFinalCheckout(false);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Overlay con animación de fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal Fullscreen con animación de slide desde abajo */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 flex flex-col">
              {/* Header */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white shadow-lg border-b border-neutral-200"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    {/* Logo y título */}
                    <div className="flex items-center gap-4">
                      {showFinalCheckout && (
                        <button
                          onClick={handleBackFromCheckout}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                      )}
                      {currentCategory && !showFinalCheckout && (
                        <button
                          onClick={handleBackToCategories}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                      )}
                      <div>
                        <h2 className="text-2xl font-display font-bold text-primary-700">
                          {showFinalCheckout
                            ? 'Finalizar Reserva'
                            : currentCategory
                            ? CATEGORIES_INFO.find((c) => c.category === currentCategory)?.title
                            : 'Arma tu Paquete Personalizado'}
                        </h2>
                        <p className="text-sm text-neutral-600">
                          {showFinalCheckout
                            ? 'Revisa tu paquete y completa la reserva'
                            : currentCategory
                            ? 'Selecciona los servicios que deseas incluir'
                            : 'Selecciona los servicios que deseas para tu aventura'}
                        </p>
                      </div>
                    </div>

                    {/* Botón cerrar */}
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors group"
                      aria-label="Cerrar"
                    >
                      <X className="w-6 h-6 text-neutral-600 group-hover:text-neutral-900" />
                    </button>
                  </div>

                  {/* Progress indicator si está en una categoría */}
                  {!showFinalCheckout && currentCategory && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="mt-4 flex items-center gap-2"
                    >
                      {CATEGORIES_INFO.map((cat, index) => (
                        <div
                          key={cat.category}
                          className={`flex-1 h-1 rounded-full transition-all ${
                            cat.category === currentCategory
                              ? 'bg-primary-500'
                              : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Contenido principal con grid layout */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                  <div className="h-full flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Área de contenido principal */}
                    <motion.div
                      key={showFinalCheckout ? 'checkout' : currentCategory || 'categories'}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 overflow-y-auto"
                    >
                      {showFinalCheckout ? (
                        <FinalCheckout onClose={handleClose} />
                      ) : currentCategory ? (
                        <ServiceGrid category={currentCategory} />
                      ) : (
                        <CategorySelector onSelectCategory={handleCategorySelect} />
                      )}
                    </motion.div>

                    {/* Sidebar de resumen - Oculto en mobile, visible en lg */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="hidden lg:block lg:w-96 flex-shrink-0"
                    >
                      <PackageSummary
                        onContinueToCheckout={handleContinueToCheckout}
                        showCheckoutButton={!showFinalCheckout}
                      />
                    </motion.div>

                    {/* Resumen flotante en mobile */}
                    {!showFinalCheckout && (
                      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-2xl">
                        <PackageSummary
                          onContinueToCheckout={handleContinueToCheckout}
                          showCheckoutButton={true}
                          isMobile={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
