import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mountain, Shield, Users, MapPin, Calendar, Database, Eye, Lock, Bell, Globe } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAccept }) => {
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
                    <h2 className="text-xl font-bold text-neutral-900">Política de Privacidad</h2>
                    <p className="text-sm text-neutral-600">Wild Tour - Protección de Datos Personales</p>
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
                {/* Introducción */}
                <section>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Introducción
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      En Wild Tour, respetamos y protegemos la privacidad de nuestros usuarios. Esta política de privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando utiliza nuestra plataforma.
                    </p>
                    <p>
                      Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política de privacidad. Si no está de acuerdo con esta política, no debe utilizar nuestra plataforma.
                    </p>
                  </div>
                </section>

                {/* Información que recopilamos */}
                <section>
                  <div className="flex items-center mb-3">
                    <Database className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      1. Información que Recopilamos
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Información de cuenta:</strong> Nombre, apellidos, correo electrónico, número de documento, teléfono, nombre de usuario y contraseña.</p>
                    <p><strong>Información de perfil:</strong> Foto de perfil, biografía, preferencias de viaje, intereses y configuraciones de cuenta.</p>
                    <p><strong>Información de reservas:</strong> Detalles de servicios reservados, fechas, huéspedes, preferencias especiales y historial de viajes.</p>
                    <p><strong>Información de pago:</strong> Datos de tarjetas de crédito/débito, información de facturación y historial de transacciones (procesados de forma segura por terceros).</p>
                    <p><strong>Información de comunicaciones:</strong> Mensajes, reseñas, comentarios y comunicaciones con otros usuarios o con soporte.</p>
                    <p><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de uso y patrones de navegación.</p>
                  </div>
                </section>

                {/* Cómo usamos la información */}
                <section>
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      2. Cómo Usamos su Información
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Provisión de servicios:</strong> Facilitar reservas, procesar pagos, conectar turistas con prestadores y proporcionar soporte al cliente.</p>
                    <p><strong>Personalización:</strong> Mostrar contenido relevante, recomendaciones personalizadas y experiencias adaptadas a sus preferencias.</p>
                    <p><strong>Comunicación:</strong> Enviar confirmaciones de reserva, actualizaciones de servicios, ofertas especiales y notificaciones importantes.</p>
                    <p><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma, identificar problemas técnicos y desarrollar nuevas funcionalidades.</p>
                    <p><strong>Seguridad:</strong> Prevenir fraudes, detectar actividades sospechosas y proteger la integridad de la plataforma.</p>
                    <p><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales, regulatorias y fiscales aplicables en Colombia.</p>
                  </div>
                </section>

                {/* Compartir información */}
                <section>
                  <div className="flex items-center mb-3">
                    <Globe className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      3. Cómo Compartimos su Información
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Prestadores de servicios:</strong> Compartimos información necesaria con prestadores para facilitar sus reservas y servicios.</p>
                    <p><strong>Proveedores de tecnología:</strong> Terceros que nos ayudan a operar la plataforma (hosting, analytics, procesamiento de pagos).</p>
                    <p><strong>Autoridades legales:</strong> Cuando sea requerido por ley, orden judicial o para proteger derechos legales.</p>
                    <p><strong>Otros usuarios:</strong> Información pública de perfil, reseñas y calificaciones según su configuración de privacidad.</p>
                    <p><strong>Nunca vendemos</strong> su información personal a terceros para fines de marketing.</p>
                  </div>
                </section>

                {/* Protección de datos */}
                <section>
                  <div className="flex items-center mb-3">
                    <Lock className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      4. Protección de sus Datos
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Encriptación:</strong> Usamos SSL/TLS para proteger la transmisión de datos y encriptación en nuestras bases de datos.</p>
                    <p><strong>Acceso limitado:</strong> Solo personal autorizado tiene acceso a información personal, bajo estrictos controles de seguridad.</p>
                    <p><strong>Monitoreo:</strong> Sistemas de detección de intrusos y monitoreo continuo de actividades sospechosas.</p>
                    <p><strong>Actualizaciones:</strong> Mantenemos nuestros sistemas actualizados con los últimos parches de seguridad.</p>
                    <p><strong>Cumplimiento:</strong> Seguimos estándares internacionales de seguridad y las mejores prácticas de la industria.</p>
                  </div>
                </section>

                {/* Cookies y tecnologías similares */}
                <section>
                  <div className="flex items-center mb-3">
                    <Eye className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      5. Cookies y Tecnologías Similares
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma (sesión, seguridad).</p>
                    <p><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los usuarios interactúan con la plataforma.</p>
                    <p><strong>Cookies de personalización:</strong> Recuerdan sus preferencias y configuraciones.</p>
                    <p><strong>Cookies de marketing:</strong> Usadas para mostrar anuncios relevantes (solo con su consentimiento).</p>
                    <p>Puede gestionar sus preferencias de cookies en cualquier momento desde la configuración de su navegador o nuestra herramienta de consentimiento.</p>
                  </div>
                </section>

                {/* Sus derechos */}
                <section>
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      6. Sus Derechos sobre los Datos
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Acceso:</strong> Puede solicitar una copia de toda la información personal que tenemos sobre usted.</p>
                    <p><strong>Rectificación:</strong> Puede corregir información incorrecta o incompleta en su perfil.</p>
                    <p><strong>Eliminación:</strong> Puede solicitar la eliminación de su cuenta y datos personales.</p>
                    <p><strong>Portabilidad:</strong> Puede solicitar sus datos en un formato estructurado y legible.</p>
                    <p><strong>Oposición:</strong> Puede oponerse al procesamiento de sus datos para ciertos fines.</p>
                    <p><strong>Limitación:</strong> Puede solicitar la restricción del procesamiento en ciertas circunstancias.</p>
                    <p>Para ejercer estos derechos, contáctenos en privacy@wildtour.co</p>
                  </div>
                </section>

                {/* Retención de datos */}
                <section>
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      7. Retención de Datos
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p><strong>Cuenta activa:</strong> Mantenemos su información mientras su cuenta esté activa y sea necesaria para proporcionar servicios.</p>
                    <p><strong>Datos de reserva:</strong> Conservamos información de reservas durante 5 años para fines contables y legales.</p>
                    <p><strong>Datos de marketing:</strong> Mantenemos preferencias de comunicación hasta que se dé de baja o elimine su cuenta.</p>
                    <p><strong>Datos técnicos:</strong> Logs del sistema se conservan hasta 2 años para fines de seguridad y mejora del servicio.</p>
                    <p><strong>Eliminación:</strong> Cuando elimine su cuenta, eliminaremos o anonimizaremos sus datos personales, excepto cuando la ley requiera retención.</p>
                  </div>
                </section>

                {/* Transferencias internacionales */}
                <section>
                  <div className="flex items-center mb-3">
                    <Globe className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      8. Transferencias Internacionales
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Colombia. En estos casos, nos aseguramos de que:
                    </p>
                    <p>• Existan garantías adecuadas de protección de datos</p>
                    <p>• Se cumplan los estándares internacionales de privacidad</p>
                    <p>• Se implementen medidas de seguridad apropiadas</p>
                    <p>• Se respeten sus derechos de privacidad</p>
                  </div>
                </section>

                {/* Menores de edad */}
                <section>
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      9. Menores de Edad
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información personal de menores de 18 años.
                    </p>
                    <p>
                      Si descubrimos que hemos recopilado información de un menor sin el consentimiento parental apropiado, eliminaremos esa información de inmediato.
                    </p>
                    <p>
                      Si cree que hemos recopilado información de un menor, contáctenos inmediatamente.
                    </p>
                  </div>
                </section>

                {/* Cambios en la política */}
                <section>
                  <div className="flex items-center mb-3">
                    <Bell className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      10. Cambios en esta Política
                    </h3>
                  </div>
                  <div className="text-neutral-700 space-y-2 ml-7 text-sm">
                    <p>
                      Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales.
                    </p>
                    <p>
                      Cuando hagamos cambios significativos, le notificaremos por correo electrónico o mediante un aviso prominente en nuestra plataforma.
                    </p>
                    <p>
                      Le recomendamos revisar periódicamente esta política para mantenerse informado sobre cómo protegemos su información.
                    </p>
                  </div>
                </section>

                {/* Contacto */}
                <section className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Contacto para Asuntos de Privacidad
                    </h3>
                  </div>
                  <div className="text-neutral-700 ml-7 text-sm">
                    <p className="mb-2">
                      Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de sus datos personales, puede contactarnos:
                    </p>
                    <ul className="space-y-1">
                      <li>• Email: privacy@wildtour.co</li>
                      <li>• Oficial de Protección de Datos: dpo@wildtour.co</li>
                      <li>• Teléfono: +57 (1) 234-5678</li>
                      <li>• Dirección: Calle 123 #45-67, Bogotá, Colombia</li>
                      <li>• Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM</li>
                    </ul>
                  </div>
                </section>

                <div className="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200">
                  Última actualización: {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} | Versión 2.1
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
                      Acepto la política
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

export default PrivacyModal;