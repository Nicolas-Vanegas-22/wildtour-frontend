import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, ArrowRight } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface RegisterResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
  onContinue?: () => void;
}

export default function RegisterResultModal({
  isOpen,
  onClose,
  success,
  message,
  onContinue
}: RegisterResultModalProps) {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Contenido */}
              <div className="p-8">
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
                  {success ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-success-200 rounded-full blur-xl opacity-50 animate-pulse" />
                      <div className="relative bg-success-100 rounded-full p-4">
                        <CheckCircle className="w-16 h-16 text-success-600" strokeWidth={2} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-error-200 rounded-full blur-xl opacity-50 animate-pulse" />
                      <div className="relative bg-error-100 rounded-full p-4">
                        <XCircle className="w-16 h-16 text-error-600" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-2xl font-display font-bold text-center mb-3 ${
                    success ? 'text-success-700' : 'text-error-700'
                  }`}
                >
                  {success ? '¡Registro exitoso!' : 'Error en el registro'}
                </motion.h2>

                {/* Mensaje */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-neutral-600 text-center mb-8 leading-relaxed"
                >
                  {message}
                </motion.p>

                {/* Botones */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3"
                >
                  {success ? (
                    <Button
                      onClick={handleContinue}
                      className="w-full group"
                      size="lg"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={onClose}
                        variant="primary"
                        className="w-full"
                        size="lg"
                      >
                        Intentar de nuevo
                      </Button>
                      <button
                        onClick={onClose}
                        className="text-neutral-600 hover:text-neutral-800 text-sm font-medium transition-colors py-2"
                      >
                        Cerrar
                      </button>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Decoración de fondo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {success ? (
                  <>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-success-200 rounded-full opacity-20 blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-success-300 rounded-full opacity-20 blur-3xl" />
                  </>
                ) : (
                  <>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-error-200 rounded-full opacity-20 blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-error-300 rounded-full opacity-20 blur-3xl" />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
