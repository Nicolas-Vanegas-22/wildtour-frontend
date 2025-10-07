import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useConsentStore, useShouldShowConsentBanner } from '../stores/useConsentStore';
import { Button } from '../../shared/ui/Button';

interface ConsentBannerProps {
  position?: 'top' | 'bottom';
  theme?: 'light' | 'dark';
  showDetails?: boolean;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({
  position = 'bottom',
  theme = 'light',
  showDetails = true
}) => {
  const {
    showBanner,
    hideConsentBanner,
    acceptAll,
    rejectNonEssential,
    showConsentModal,
    setUserContext
  } = useConsentStore();

  const shouldShow = useShouldShowConsentBanner();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Configurar contexto del usuario para auditoría
    setUserContext({
      userAgent: navigator.userAgent,
      // La IP se obtendría del backend por seguridad
    });

    // Mostrar banner después de un pequeño delay para mejor UX
    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, setUserContext]);

  const handleAcceptAll = () => {
    acceptAll('banner');
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    rejectNonEssential('banner');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    showConsentModal('preferences');
  };

  const handleClose = () => {
    setIsVisible(false);
    hideConsentBanner();
  };

  if (!shouldShow && !showBanner && !isVisible) {
    return null;
  }

  const bannerClasses = `
    fixed left-0 right-0 z-50 mx-4 mb-4 md:mx-6 md:mb-6
    ${position === 'top' ? 'top-4 md:top-6' : 'bottom-4 md:bottom-6'}
    ${theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
    shadow-strong border border-neutral-200 rounded-2xl
    max-w-6xl mx-auto backdrop-blur-lg
    ${theme === 'dark' ? 'bg-opacity-95' : 'bg-opacity-95'}
  `;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            y: position === 'bottom' ? 100 : -100,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: position === 'bottom' ? 100 : -100,
            scale: 0.9
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className={bannerClasses}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-neutral-800">
                    Protección de Datos Personales
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Cumplimiento Ley 1581 de 2012 - Colombia
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Cerrar banner"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Contenido principal */}
            <div className="mb-6">
              <p className="text-neutral-700 mb-3 leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia,
                personalizar contenido y analizar nuestro tráfico. Al hacer clic en "Aceptar todo",
                usted consiente el uso de TODAS las cookies según nuestra
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium mx-1">
                  Política de Privacidad
                </a>
                y
                <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium mx-1">
                  Términos y Condiciones
                </a>.
              </p>

              {showDetails && (
                <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-neutral-800 mb-2 flex items-center">
                    <Cookie className="w-4 h-4 mr-2 text-primary-600" />
                    Tipos de Datos que Recopilamos:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Información de registro y perfil
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Preferencias de viaje y reservas
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                      Datos de navegación y cookies
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                      Información de ubicación (opcional)
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <h4 className="font-semibold text-primary-800 mb-2">
                  Sus Derechos (Ley 1581/2012):
                </h4>
                <p className="text-sm text-primary-700">
                  Puede ejercer sus derechos de <strong>acceso, rectificación, cancelación y oposición</strong>
                  en cualquier momento. También puede revocar su consentimiento sin afectar
                  la licitud del tratamiento anterior.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Aceptar Todo
              </Button>

              <Button
                onClick={handleRejectNonEssential}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Solo Esenciales
              </Button>

              <Button
                onClick={handleCustomize}
                variant="ghost"
                className="flex-1"
                size="lg"
              >
                <Settings className="w-5 h-5 mr-2" />
                Personalizar
              </Button>
            </div>

            {/* Footer legal */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 text-center">
                Al continuar navegando sin cambiar la configuración, acepta el uso de cookies esenciales.
                Puede cambiar sus preferencias en cualquier momento desde la configuración de privacidad.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;