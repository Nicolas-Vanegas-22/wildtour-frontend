import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LogoutModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      // Redirigir al inicio después de 2 segundos
      const timer = setTimeout(() => {
        navigate('/');
        if (onClose) onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Contenido */}
              <div className="p-8 text-center">
                {/* Icono animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-200 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative bg-primary-100 rounded-full p-4">
                      <LogOut className="w-16 h-16 text-primary-600" strokeWidth={2} />
                    </div>
                  </div>
                </motion.div>

                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-display font-bold text-primary-700 mb-3"
                >
                  {t('app.sessionClosed')}
                </motion.h2>

                {/* Mensaje */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-neutral-600 mb-6 leading-relaxed"
                >
                  {t('app.redirecting')}
                </motion.p>

                {/* Indicador de progreso */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full"
                    />
                    <span>{t('app.redirecting')}</span>
                  </div>
                </motion.div>
              </div>

              {/* Decoración de fondo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-300 rounded-full opacity-20 blur-3xl" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
