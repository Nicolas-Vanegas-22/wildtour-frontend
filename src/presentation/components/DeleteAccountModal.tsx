import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Shield } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const CONFIRM_PHRASE = 'ELIMINAR MI CUENTA';

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else if (confirmText === CONFIRM_PHRASE) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStep(1);
      setConfirmText('');
      onClose();
    }
  };

  const isConfirmEnabled = step === 2 && confirmText === CONFIRM_PHRASE;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con gradiente de advertencia */}
              <div className="bg-gradient-to-r from-error-500 to-error-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-30" />

                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Eliminar Cuenta</h2>
                    <p className="text-white/90 text-sm">Esta acción es irreversible</p>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      {/* Lista de advertencias */}
                      <div className="bg-error-50 border border-error-200 rounded-xl p-4 space-y-3">
                        <p className="font-semibold text-error-800 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Al eliminar tu cuenta perderás:
                        </p>
                        <ul className="space-y-2 text-sm text-error-700">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-error-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span>Toda tu información personal y datos de perfil</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-error-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span>Historial de reservas y favoritos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-error-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span>Reseñas y comentarios realizados</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-error-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span>Acceso a todas las funcionalidades de la plataforma</span>
                          </li>
                        </ul>
                      </div>

                      {/* Información adicional */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          <strong className="text-neutral-800">Nota importante:</strong> Esta acción no se puede deshacer.
                          Una vez eliminada tu cuenta, todos tus datos serán permanentemente borrados de nuestros servidores.
                        </p>
                      </div>

                      {/* Botones */}
                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleClose}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleConfirm}
                          disabled={isLoading}
                          className="flex-1 bg-error-500 hover:bg-error-600 text-white"
                        >
                          Continuar
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Confirmación de texto */}
                      <div className="space-y-3">
                        <p className="text-neutral-700 leading-relaxed">
                          Para confirmar la eliminación de tu cuenta, escribe la siguiente frase exactamente:
                        </p>

                        <div className="bg-neutral-100 border-2 border-neutral-300 rounded-xl p-4 text-center">
                          <code className="text-lg font-bold text-neutral-800 select-all">
                            {CONFIRM_PHRASE}
                          </code>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Escribe la frase aquí"
                            disabled={isLoading}
                            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
                            autoFocus
                          />
                        </div>

                        {confirmText && confirmText !== CONFIRM_PHRASE && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-error-600"
                          >
                            La frase no coincide. Verifica e intenta nuevamente.
                          </motion.p>
                        )}
                      </div>

                      {/* Botones finales */}
                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStep(1);
                            setConfirmText('');
                          }}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          Atrás
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleConfirm}
                          disabled={!isConfirmEnabled || isLoading}
                          className="flex-1 bg-error-600 hover:bg-error-700 text-white disabled:bg-neutral-300 disabled:cursor-not-allowed gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Eliminando...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Eliminar Cuenta
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer con progreso */}
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    Paso {step} de 2
                  </span>
                  <div className="flex gap-2">
                    <div className={`w-8 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-error-500' : 'bg-neutral-300'}`} />
                    <div className={`w-8 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-error-500' : 'bg-neutral-300'}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
