import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mountain, Shield, Users, MapPin, Calendar, CreditCard, AlertTriangle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            to="/registro"
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al registro
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Mountain className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-neutral-600 text-lg">
            Wild Tour - Plataforma de Turismo Nacional
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 space-y-8"
        >
          {/* Sección 1: Aceptación de términos */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                1. Aceptación de los Términos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                2. Definiciones
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p><strong>Plataforma:</strong> Wild Tour, incluyendo el sitio web, aplicaciones móviles y todos los servicios relacionados.</p>
              <p><strong>Usuario:</strong> Cualquier persona que accede o utiliza la plataforma.</p>
              <p><strong>Turista:</strong> Usuario que busca y contrata servicios turísticos a través de la plataforma.</p>
              <p><strong>Prestador:</strong> Persona natural o jurídica que ofrece servicios turísticos a través de la plataforma.</p>
              <p><strong>Servicios:</strong> Actividades turísticas, alojamientos, guías, transporte y otros servicios relacionados con el turismo.</p>
            </div>
          </section>

          {/* Sección 3: Registro y cuentas */}
          <section>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                3. Registro y Cuentas de Usuario
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                4. Servicios de la Plataforma
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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

          {/* Sección 5: Responsabilidades de los prestadores */}
          <section>
            <div className="flex items-center mb-4">
              <Mountain className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                5. Responsabilidades de los Prestadores
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Los prestadores deben cumplir con todas las leyes y regulaciones aplicables, incluyendo licencias, permisos y registros requeridos para operar servicios turísticos.
              </p>
              <p>
                Deben proporcionar información veraz y actualizada sobre sus servicios, incluyendo precios, disponibilidad, políticas de cancelación y requisitos.
              </p>
              <p>
                Son responsables de mantener estándares adecuados de calidad y seguridad en sus servicios, incluyendo seguros apropiados.
              </p>
              <p>
                Deben responder de manera oportuna a las consultas y solicitudes de reserva de los turistas.
              </p>
              <p>
                Están obligados a honrar las reservas confirmadas según los términos acordados.
              </p>
            </div>
          </section>

          {/* Sección 6: Responsabilidades de los turistas */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                6. Responsabilidades de los Turistas
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Los turistas deben proporcionar información veraz y completa al realizar reservas.
              </p>
              <p>
                Son responsables del cumplimiento de los términos y condiciones específicos de cada servicio contratado.
              </p>
              <p>
                Deben cumplir con las políticas de cancelación y pago establecidas por cada prestador.
              </p>
              <p>
                Son responsables de verificar los requisitos de documentación, salud y seguridad necesarios para las actividades turísticas.
              </p>
              <p>
                Deben comportarse de manera respetuosa con los prestadores, otros turistas y el medio ambiente.
              </p>
            </div>
          </section>

          {/* Sección 7: Pagos y facturación */}
          <section>
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                7. Pagos y Facturación
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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
              <p>
                Los usuarios son responsables de cualquier tasa o impuesto adicional que pueda aplicarse según su jurisdicción.
              </p>
            </div>
          </section>

          {/* Sección 8: Propiedad intelectual */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                8. Propiedad Intelectual
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio y software, es propiedad de Wild Tour o sus licenciantes.
              </p>
              <p>
                Los usuarios otorgan a Wild Tour una licencia no exclusiva para usar el contenido que publican en la plataforma.
              </p>
              <p>
                Los usuarios no pueden reproducir, distribuir, modificar o crear trabajos derivados del contenido de la plataforma sin autorización expresa.
              </p>
              <p>
                Las marcas comerciales y logos mostrados en la plataforma son propiedad de sus respectivos dueños.
              </p>
            </div>
          </section>

          {/* Sección 9: Limitación de responsabilidad */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                9. Limitación de Responsabilidad
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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

          {/* Sección 10: Terminación */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                10. Terminación
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Podemos suspender o terminar su acceso a la plataforma en cualquier momento por violación de estos términos.
              </p>
              <p>
                Usted puede cancelar su cuenta en cualquier momento a través de la configuración de su perfil.
              </p>
              <p>
                La terminación no afecta los derechos y obligaciones adquiridos antes de la fecha de terminación.
              </p>
              <p>
                Nos reservamos el derecho de conservar cierta información según lo requerido por la ley.
              </p>
            </div>
          </section>

          {/* Sección 11: Modificaciones */}
          <section>
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                11. Modificaciones a los Términos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
              </p>
              <p>
                Las modificaciones serán efectivas inmediatamente después de su publicación en la plataforma.
              </p>
              <p>
                Es responsabilidad del usuario revisar periódicamente estos términos.
              </p>
              <p>
                El uso continuado de la plataforma después de las modificaciones constituye aceptación de los nuevos términos.
              </p>
            </div>
          </section>

          {/* Sección 12: Ley aplicable */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                12. Ley Aplicable y Jurisdicción
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
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
          <section className="border-t border-neutral-200 pt-8">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Contacto
              </h2>
            </div>
            <div className="text-neutral-700 ml-9">
              <p>
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
              </p>
              <ul className="mt-3 space-y-2">
                <li>• Email: legal@wildtour.co</li>
                <li>• Teléfono: +57 (1) 234-5678</li>
                <li>• Dirección: Calle 123 #45-67, Bogotá, Colombia</li>
              </ul>
            </div>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/registro"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:from-primary-700 hover:to-primary-600 transition-all transform hover:scale-105"
          >
            Volver al Registro
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;