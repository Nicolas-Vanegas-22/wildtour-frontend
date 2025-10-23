import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mountain, Shield, Users, MapPin, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Términos y Condiciones</h2>
                    <p className="text-sm text-neutral-600">Wild Tour - Plataforma de Turismo Nacional</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Sección 1: Aceptación de términos */}
                <section>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      1. Aceptación de los Términos
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Al acceder y utilizar la plataforma Wild Tour, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                    </p>
                    <p>
                      Wild Tour es una plataforma digital que facilita la conexión entre turistas y prestadores de servicios turísticos en Colombia, promoviendo el turismo nacional sostenible y responsable.
                    </p>
                  </div>
                </section>

                {/* Sección 2: Definiciones */}
                <section>
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      2. Definiciones
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Plataforma:</strong> Wild Tour, incluyendo el sitio web, aplicaciones móviles y todos los servicios relacionados.</p>
                    <p><strong>Usuario:</strong> Cualquier persona que accede o utiliza la plataforma.</p>
                    <p><strong>Turista:</strong> Usuario que busca y contrata servicios turísticos a través de la plataforma.</p>
                    <p><strong>Prestador:</strong> Persona natural o jurídica que ofrece servicios turísticos a través de la plataforma.</p>
                    <p><strong>Servicios:</strong> Actividades turísticas, alojamientos, guías, transporte y otros servicios relacionados con el turismo.</p>
                  </div>
                </section>

                {/* Sección 3: Registro y cuentas */}
                <section>
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      3. Registro y Cuentas de Usuario
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Para utilizar ciertos servicios de la plataforma, debe crear una cuenta proporcionando información veraz, completa y actualizada.
                    </p>
                    <p>
                      Es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
                    </p>
                    <p>
                      Debe notificar inmediatamente cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad.
                    </p>
                    <p>
                      Los prestadores deben proporcionar documentación adicional para verificar su identidad y capacidad legal para ofrecer servicios turísticos.
                    </p>
                  </div>
                </section>

                {/* Sección 4: Servicios de la plataforma */}
                <section>
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      4. Servicios de la Plataforma
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Wild Tour actúa como intermediario entre turistas y prestadores de servicios, facilitando la búsqueda, comparación y reserva de servicios turísticos.
                    </p>
                    <p>
                      La plataforma proporciona herramientas para la gestión de reservas, comunicación entre usuarios, sistema de reseñas y calificaciones, y procesamiento de pagos.
                    </p>
                    <p>
                      No somos responsables de la calidad, seguridad o legalidad de los servicios ofrecidos por los prestadores, ni de la capacidad de los turistas para pagar por los servicios.
                    </p>
                    <p>
                      Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de la plataforma en cualquier momento.
                    </p>
                  </div>
                </section>

                {/* Sección 5: Pagos y facturación */}
                <section>
                  <div className="flex items-center mb-3">
                    <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      5. Pagos y Facturación
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Los pagos se procesan a través de procesadores de pago seguros y confiables integrados en la plataforma.
                    </p>
                    <p>
                      Wild Tour puede cobrar una comisión por las transacciones realizadas a través de la plataforma.
                    </p>
                    <p>
                      Los precios mostrados incluyen todos los impuestos aplicables según la legislación colombiana.
                    </p>
                    <p>
                      Las políticas de reembolso y cancelación específicas dependen de cada prestador y se muestran claramente antes de confirmar la reserva.
                    </p>
                  </div>
                </section>

                {/* Sección 6: Propiedad intelectual */}
                <section>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      6. Propiedad Intelectual
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio y software, es propiedad de Wild Tour o sus licenciantes.
                    </p>
                    <p>
                      Los usuarios otorgan a Wild Tour una licencia no exclusiva para usar el contenido que publican en la plataforma.
                    </p>
                    <p>
                      Los usuarios no pueden reproducir, distribuir, modificar o crear trabajos derivados del contenido de la plataforma sin autorización expresa.
                    </p>
                  </div>
                </section>

                {/* Sección 7: Limitación de responsabilidad */}
                <section>
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      7. Limitación de Responsabilidad
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Wild Tour actúa únicamente como intermediario y no se hace responsable por la calidad, seguridad o legalidad de los servicios turísticos ofrecidos.
                    </p>
                    <p>
                      No garantizamos la disponibilidad continua de la plataforma y no seremos responsables por interrupciones del servicio.
                    </p>
                    <p>
                      Nuestra responsabilidad total por cualquier reclamo no excederá el monto pagado por el usuario por el servicio específico en cuestión.
                    </p>
                    <p>
                      Los usuarios participan en actividades turísticas bajo su propio riesgo y responsabilidad.
                    </p>
                    <p>
                      Recomendamos encarecidamente contratar seguros de viaje apropiados antes de participar en cualquier actividad turística.
                    </p>
                  </div>
                </section>

                {/* Sección 8: Ley aplicable */}
                <section>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      8. Ley Aplicable y Jurisdicción
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Estos términos se regirán e interpretarán de acuerdo con las leyes de la República de Colombia.
                    </p>
                    <p>
                      Cualquier disputa será sometida a la jurisdicción exclusiva de los tribunales de Colombia.
                    </p>
                    <p>
                      En caso de conflicto entre la versión en español y cualquier traducción, prevalecerá la versión en español.
                    </p>
                  </div>
                </section>

                {/* Contacto */}
                <section className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Contacto
                    </h3>
                  </div>
                  <div className="text-neutral-700 ml-7 text-sm">
                    <p className="mb-2">
                      Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
                    </p>
                    <ul className="space-y-1">
                      <li>• Email: legal@wildtour.co</li>
                      <li>• Teléfono: +57 (1) 234-5678</li>
                      <li>• Dirección: Calle 123 #45-67, Bogotá, Colombia</li>
                    </ul>
                  </div>
                </section>

                <div className="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200">
                  Última actualización: {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 bg-neutral-50 border-t border-neutral-200">
                <Button
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Solo leer
                  </Button>
                  {onAccept && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        onAccept();
                        onClose();
                      }}
                    >
                      Acepto los términos
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;