import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mountain, Shield, Eye, Database, Lock, Users, Globe, Smartphone, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
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
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Política de Privacidad
          </h1>
          <p className="text-neutral-600 text-lg">
            Wild Tour - Protección de Datos Personales
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
          {/* Introducción */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Introducción
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                En Wild Tour, respetamos y protegemos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando utiliza nuestra plataforma de turismo nacional.
              </p>
              <p>
                Cumplimos con la Ley 1581 de 2012 de Protección de Datos Personales de Colombia y demás normativas aplicables en materia de protección de datos.
              </p>
              <p>
                Al utilizar nuestros servicios, usted consiente el tratamiento de sus datos personales según se describe en esta política.
              </p>
            </div>
          </section>

          {/* Responsable del tratamiento */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Responsable del Tratamiento de Datos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p><strong>Razón social:</strong> Wild Tour SAS</p>
              <p><strong>Domicilio:</strong> Calle 123 #45-67, Bogotá, Colombia</p>
              <p><strong>Correo electrónico:</strong> privacidad@wildtour.co</p>
              <p><strong>Teléfono:</strong> +57 (1) 234-5678</p>
              <p><strong>Sitio web:</strong> www.wildtour.co</p>
            </div>
          </section>

          {/* Información que recopilamos */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Información que Recopilamos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-4 ml-9">
              <div>
                <h3 className="font-semibold text-lg mb-2">Información de registro:</h3>
                <ul className="space-y-1">
                  <li>• Nombre completo y apellidos</li>
                  <li>• Número de documento de identidad</li>
                  <li>• Correo electrónico</li>
                  <li>• Número de teléfono</li>
                  <li>• Nombre de usuario</li>
                  <li>• Contraseña (encriptada)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Información de perfil:</h3>
                <ul className="space-y-1">
                  <li>• Foto de perfil</li>
                  <li>• Preferencias de viaje</li>
                  <li>• Historial de reservas</li>
                  <li>• Reseñas y calificaciones</li>
                  <li>• Lista de favoritos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Información de transacciones:</h3>
                <ul className="space-y-1">
                  <li>• Datos de facturación</li>
                  <li>• Historial de pagos</li>
                  <li>• Métodos de pago (últimos 4 dígitos)</li>
                  <li>• Direcciones de facturación</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Información técnica:</h3>
                <ul className="space-y-1">
                  <li>• Dirección IP</li>
                  <li>• Tipo de dispositivo y navegador</li>
                  <li>• Datos de ubicación (con consentimiento)</li>
                  <li>• Cookies y tecnologías similares</li>
                  <li>• Registros de actividad en la plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidades del tratamiento */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Finalidades del Tratamiento
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Utilizamos su información personal para las siguientes finalidades:</p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Provisión de servicios:</h3>
                  <ul className="mt-1 space-y-1">
                    <li>• Crear y gestionar su cuenta de usuario</li>
                    <li>• Facilitar reservas y transacciones</li>
                    <li>• Conectar turistas con prestadores de servicios</li>
                    <li>• Procesar pagos y generar facturas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Comunicación:</h3>
                  <ul className="mt-1 space-y-1">
                    <li>• Enviar confirmaciones de reservas</li>
                    <li>• Notificar cambios en servicios</li>
                    <li>• Proporcionar atención al cliente</li>
                    <li>• Enviar actualizaciones importantes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Mejora de servicios:</h3>
                  <ul className="mt-1 space-y-1">
                    <li>• Personalizar experiencias de usuario</li>
                    <li>• Analizar uso de la plataforma</li>
                    <li>• Desarrollar nuevas funcionalidades</li>
                    <li>• Realizar investigación de mercado</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Seguridad y cumplimiento:</h3>
                  <ul className="mt-1 space-y-1">
                    <li>• Prevenir fraudes y actividades ilegales</li>
                    <li>• Cumplir obligaciones legales</li>
                    <li>• Resolver disputas</li>
                    <li>• Mantener la seguridad de la plataforma</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Marketing (con consentimiento):</h3>
                  <ul className="mt-1 space-y-1">
                    <li>• Enviar ofertas promocionales</li>
                    <li>• Recomendar destinos y servicios</li>
                    <li>• Newsletters y contenido turístico</li>
                    <li>• Publicidad personalizada</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Base legal */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Base Legal del Tratamiento
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>El tratamiento de sus datos personales se fundamenta en:</p>
              <ul className="space-y-2">
                <li>• <strong>Consentimiento:</strong> Para marketing, newsletters y funcionalidades opcionales</li>
                <li>• <strong>Ejecución contractual:</strong> Para procesar reservas y proporcionar servicios</li>
                <li>• <strong>Interés legítimo:</strong> Para mejorar servicios, seguridad y análisis</li>
                <li>• <strong>Cumplimiento legal:</strong> Para obligaciones fiscales, contables y regulatorias</li>
              </ul>
            </div>
          </section>

          {/* Compartir información */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Compartir Información
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Compartimos su información únicamente en las siguientes circunstancias:</p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Prestadores de servicios:</h3>
                  <p>Compartimos información necesaria para completar reservas (nombre, contacto, fechas).</p>
                </div>

                <div>
                  <h3 className="font-semibold">Proveedores de servicios tecnológicos:</h3>
                  <p>Procesadores de pago, servicios de hosting, análisis y comunicaciones que operan bajo acuerdos de confidencialidad.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Autoridades competentes:</h3>
                  <p>Cuando sea requerido por ley o para proteger derechos, seguridad y propiedad.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Transacciones comerciales:</h3>
                  <p>En caso de fusión, adquisición o venta de activos, con las debidas protecciones.</p>
                </div>
              </div>

              <p className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <strong>Importante:</strong> Nunca vendemos, alquilamos o compartimos su información personal con terceros para fines comerciales sin su consentimiento explícito.
              </p>
            </div>
          </section>

          {/* Seguridad de los datos */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Seguridad de los Datos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Implementamos múltiples medidas de seguridad para proteger su información:</p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-primary-50 rounded-xl p-4">
                  <h3 className="font-semibold text-primary-800 mb-2">Medidas técnicas:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Encriptación SSL/TLS</li>
                    <li>• Cifrado de bases de datos</li>
                    <li>• Firewalls y sistemas de detección</li>
                    <li>• Autenticación de dos factores</li>
                  </ul>
                </div>

                <div className="bg-accent-50 rounded-xl p-4">
                  <h3 className="font-semibold text-accent-800 mb-2">Medidas organizacionales:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Acceso restringido por roles</li>
                    <li>• Capacitación en privacidad</li>
                    <li>• Auditorías de seguridad</li>
                    <li>• Políticas de contraseñas</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4">
                Aunque implementamos las mejores prácticas de seguridad, ningún sistema es 100% seguro.
                Le recomendamos usar contraseñas fuertes y únicas para su cuenta.
              </p>
            </div>
          </section>

          {/* Retención de datos */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Retención de Datos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Conservamos su información personal durante los siguientes períodos:</p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Datos de cuenta activa:</h3>
                  <p>Mientras mantenga su cuenta activa y por 3 años después de la desactivación.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Información de transacciones:</h3>
                  <p>5 años según requerimientos fiscales y contables.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Datos de marketing:</h3>
                  <p>Hasta que retire su consentimiento o 2 años de inactividad.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Registros de seguridad:</h3>
                  <p>1 año para análisis de seguridad y prevención de fraudes.</p>
                </div>
              </div>

              <p className="mt-4">
                Después de estos períodos, eliminamos o anonimizamos su información personal de manera segura.
              </p>
            </div>
          </section>

          {/* Derechos del titular */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Sus Derechos
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Como titular de datos personales, usted tiene los siguientes derechos:</p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-primary-700">Acceso</h3>
                    <p className="text-sm">Conocer qué datos tenemos sobre usted</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary-700">Rectificación</h3>
                    <p className="text-sm">Corregir datos inexactos o incompletos</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary-700">Eliminación</h3>
                    <p className="text-sm">Solicitar la eliminación de sus datos</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary-700">Oposición</h3>
                    <p className="text-sm">Oponerse a ciertos tratamientos</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-accent-700">Portabilidad</h3>
                    <p className="text-sm">Obtener sus datos en formato portable</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-accent-700">Limitación</h3>
                    <p className="text-sm">Restringir el procesamiento</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-accent-700">Revocación</h3>
                    <p className="text-sm">Retirar consentimientos otorgados</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-accent-700">Consulta</h3>
                    <p className="text-sm">Consultar el uso de sus datos</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-4">
                <h3 className="font-semibold text-primary-800 mb-2">¿Cómo ejercer sus derechos?</h3>
                <p className="text-sm text-primary-700">
                  Envíe su solicitud a <strong>privacidad@wildtour.co</strong> con copia de su documento de identidad.
                  Responderemos en máximo 15 días hábiles.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Smartphone className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Cookies y Tecnologías Similares
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>Utilizamos cookies y tecnologías similares para:</p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Cookies esenciales:</h3>
                  <p>Necesarias para el funcionamiento básico de la plataforma (sesión, seguridad).</p>
                </div>

                <div>
                  <h3 className="font-semibold">Cookies de rendimiento:</h3>
                  <p>Analizar el uso de la plataforma y mejorar la experiencia del usuario.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Cookies de personalización:</h3>
                  <p>Recordar preferencias y personalizar contenido.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Cookies de marketing:</h3>
                  <p>Mostrar publicidad relevante y medir efectividad de campañas.</p>
                </div>
              </div>

              <p className="mt-4">
                Puede gestionar sus preferencias de cookies en la configuración de su navegador o a través de nuestro centro de preferencias.
              </p>
            </div>
          </section>

          {/* Transferencias internacionales */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Transferencias Internacionales
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Colombia.
                En estos casos, aseguramos que:
              </p>
              <ul className="space-y-2">
                <li>• El país de destino tenga un nivel adecuado de protección de datos</li>
                <li>• Se implementen garantías adecuadas (cláusulas contractuales estándar)</li>
                <li>• Se cumplan todas las medidas de seguridad requeridas</li>
                <li>• Se obtenga autorización previa cuando sea requerida por ley</li>
              </ul>
            </div>
          </section>

          {/* Menores de edad */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Menores de Edad
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años.
                No recopilamos intencionalmente información de menores de edad sin consentimiento parental.
              </p>
              <p>
                Si un padre o tutor descubre que su hijo menor de edad nos ha proporcionado información personal,
                debe contactarnos inmediatamente para proceder con la eliminación.
              </p>
              <p>
                Para menores que viajen con adultos, la información debe ser proporcionada por el adulto responsable.
              </p>
            </div>
          </section>

          {/* Cambios en la política */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Cambios en esta Política
              </h2>
            </div>
            <div className="text-neutral-700 space-y-3 ml-9">
              <p>
                Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o por otros motivos operacionales, legales o regulatorios.
              </p>
              <p>
                Le notificaremos sobre cambios importantes a través de correo electrónico o mediante un aviso destacado en nuestra plataforma.
              </p>
              <p>
                La fecha de "última actualización" al inicio de esta política indica cuándo se realizaron los cambios más recientes.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="border-t border-neutral-200 pt-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Contacto
              </h2>
            </div>
            <div className="text-neutral-700 ml-9">
              <p className="mb-4">
                Si tiene preguntas sobre esta política de privacidad o el tratamiento de sus datos personales, puede contactarnos:
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-3">Datos de Contacto del Responsable:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email de Privacidad:</strong> privacidad@wildtour.co</p>
                  <p><strong>Teléfono:</strong> +57 (1) 234-5678</p>
                  <p><strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia</p>
                  <p><strong>Horario de atención:</strong> Lunes a viernes, 8:00 AM - 5:00 PM</p>
                </div>
              </div>

              <p className="mt-4 text-sm">
                También puede presentar quejas ante la Superintendencia de Industria y Comercio (SIC)
                si considera que se han vulnerado sus derechos de protección de datos personales.
              </p>
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

export default Privacy;