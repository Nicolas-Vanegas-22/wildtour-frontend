import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings, Globe, BarChart3, Share2, Lock } from 'lucide-react';
import CookieManager from '../../compliance/components/CookieManager';

const CookiePolicy: React.FC = () => {
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
            to="/"
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Cookie className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Política de Cookies
          </h1>
          <p className="text-neutral-600 text-lg">
            Wild Tour - Uso de Cookies y Tecnologías Similares
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
          className="space-y-8"
        >
          {/* Introducción */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                ¿Qué son las cookies?
              </h2>
            </div>
            <div className="text-neutral-700 space-y-4">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
                visita nuestro sitio web. Nos ayudan a proporcionar una mejor experiencia de usuario,
                recordar sus preferencias y analizar cómo utiliza nuestros servicios.
              </p>
              <p>
                En Wild Tour utilizamos cookies de manera responsable y transparente, cumpliendo con
                la Ley 1581 de 2012 de Colombia y las mejores prácticas internacionales de privacidad.
              </p>
            </div>
          </div>

          {/* Tipos de cookies */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Tipos de Cookies que Utilizamos
              </h2>
            </div>

            <div className="space-y-6">
              {/* Cookies Esenciales */}
              <div className="border border-green-200 bg-green-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-green-800">
                    Cookies Esenciales
                  </h3>
                  <span className="ml-auto bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Siempre Activas
                  </span>
                </div>
                <p className="text-green-700 mb-4">
                  Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden
                  ser desactivadas en nuestros sistemas.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Finalidades:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Autenticación y gestión de sesión</li>
                      <li>• Seguridad y prevención de fraudes</li>
                      <li>• Funcionamiento del carrito de compras</li>
                      <li>• Recordar configuraciones básicas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Ejemplos:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <code>wildtour_session</code></li>
                      <li>• <code>csrf_token</code></li>
                      <li>• <code>auth_remember</code></li>
                      <li>• <code>security_verify</code></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-600">
                  <strong>Retención:</strong> Durante la sesión o hasta 30 días
                </div>
              </div>

              {/* Cookies Funcionales */}
              <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Settings className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-blue-800">
                    Cookies Funcionales
                  </h3>
                  <span className="ml-auto bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Opcional
                  </span>
                </div>
                <p className="text-blue-700 mb-4">
                  Estas cookies mejoran la funcionalidad del sitio web recordando sus elecciones
                  y proporcionando características mejoradas y personalizadas.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Finalidades:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Recordar preferencias de idioma</li>
                      <li>• Guardar configuraciones de visualización</li>
                      <li>• Mantener filtros y búsquedas</li>
                      <li>• Funcionalidades de accesibilidad</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Ejemplos:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <code>language_preference</code></li>
                      <li>• <code>theme_setting</code></li>
                      <li>• <code>map_view_config</code></li>
                      <li>• <code>accessibility_settings</code></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-sm text-blue-600">
                  <strong>Retención:</strong> Hasta 12 meses
                </div>
              </div>

              {/* Cookies de Análisis */}
              <div className="border border-purple-200 bg-purple-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-purple-800">
                    Cookies de Análisis
                  </h3>
                  <span className="ml-auto bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Opcional
                  </span>
                </div>
                <p className="text-purple-700 mb-4">
                  Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro
                  sitio web, proporcionando información sobre las páginas visitadas, el tiempo de
                  permanencia y otras estadísticas de uso.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Finalidades:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Análisis de tráfico del sitio web</li>
                      <li>• Medición del rendimiento</li>
                      <li>• Identificación de errores técnicos</li>
                      <li>• Optimización de la experiencia</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Proveedores:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Hotjar (mapas de calor)</li>
                      <li>• Sistema interno de métricas</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-sm text-purple-600">
                  <strong>Retención:</strong> Hasta 24 meses
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className="border border-orange-200 bg-orange-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-orange-800">
                    Cookies de Marketing
                  </h3>
                  <span className="ml-auto bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Opcional
                  </span>
                </div>
                <p className="text-orange-700 mb-4">
                  Estas cookies se utilizan para rastrear a los visitantes en los sitios web con
                  la intención de mostrar anuncios que sean relevantes y atractivos para el usuario
                  individual.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Finalidades:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Publicidad personalizada</li>
                      <li>• Retargeting y remarketing</li>
                      <li>• Medición de campañas</li>
                      <li>• Segmentación de audiencias</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Proveedores:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Google Ads</li>
                      <li>• Facebook Ads</li>
                      <li>• Meta Pixel</li>
                      <li>• Redes publicitarias</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-sm text-orange-600">
                  <strong>Retención:</strong> Hasta 13 meses
                </div>
              </div>

              {/* Cookies de Redes Sociales */}
              <div className="border border-pink-200 bg-pink-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Share2 className="w-6 h-6 text-pink-600 mr-3" />
                  <h3 className="text-xl font-semibold text-pink-800">
                    Cookies de Redes Sociales
                  </h3>
                  <span className="ml-auto bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                    Opcional
                  </span>
                </div>
                <p className="text-pink-700 mb-4">
                  Estas cookies permiten compartir contenido del sitio web en redes sociales y
                  conectar con plataformas sociales externas.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-pink-800 mb-2">Finalidades:</h4>
                    <ul className="text-sm text-pink-700 space-y-1">
                      <li>• Compartir en redes sociales</li>
                      <li>• Login social integrado</li>
                      <li>• Widgets de redes sociales</li>
                      <li>• Funcionalidades sociales</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-800 mb-2">Plataformas:</h4>
                    <ul className="text-sm text-pink-700 space-y-1">
                      <li>• Facebook</li>
                      <li>• Instagram</li>
                      <li>• Twitter</li>
                      <li>• WhatsApp</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-sm text-pink-600">
                  <strong>Retención:</strong> Hasta 12 meses
                </div>
              </div>
            </div>
          </div>

          {/* Gestor de Cookies */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Gestión de Cookies
              </h2>
            </div>

            <CookieManager />
          </div>

          {/* Control del Usuario */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Control del Usuario
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Sus Opciones</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Configuración del Navegador</h4>
                    <p className="text-sm text-neutral-600">
                      Puede configurar su navegador para rechazar todas las cookies o
                      para indicar cuándo se está enviando una cookie.
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Centro de Preferencias</h4>
                    <p className="text-sm text-neutral-600">
                      Use nuestro centro de preferencias para activar o desactivar
                      categorías específicas de cookies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Instrucciones por Navegador</h3>
                <div className="space-y-3">
                  <details className="bg-neutral-50 rounded-xl p-4">
                    <summary className="font-medium text-neutral-800 cursor-pointer">Google Chrome</summary>
                    <div className="mt-3 text-sm text-neutral-600">
                      <p>1. Haga clic en el menú Chrome (⋮) → Configuración</p>
                      <p>2. Vaya a "Privacidad y seguridad" → "Cookies y otros datos de sitios"</p>
                      <p>3. Seleccione sus preferencias de cookies</p>
                    </div>
                  </details>

                  <details className="bg-neutral-50 rounded-xl p-4">
                    <summary className="font-medium text-neutral-800 cursor-pointer">Mozilla Firefox</summary>
                    <div className="mt-3 text-sm text-neutral-600">
                      <p>1. Haga clic en el menú (☰) → Configuración</p>
                      <p>2. Vaya a "Privacidad y seguridad"</p>
                      <p>3. Configure las opciones en "Cookies y datos del sitio"</p>
                    </div>
                  </details>

                  <details className="bg-neutral-50 rounded-xl p-4">
                    <summary className="font-medium text-neutral-800 cursor-pointer">Safari</summary>
                    <div className="mt-3 text-sm text-neutral-600">
                      <p>1. Vaya a Safari → Preferencias</p>
                      <p>2. Haga clic en la pestaña "Privacidad"</p>
                      <p>3. Configure "Cookies y datos de sitios web"</p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>

          {/* Información Legal */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Marco Legal y Cumplimiento
              </h2>
            </div>

            <div className="space-y-4 text-neutral-700">
              <p>
                Esta política de cookies cumple con la Ley 1581 de 2012 de Colombia sobre
                Protección de Datos Personales y demás normativas aplicables.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Base Legal</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Cookies esenciales:</strong> Interés legítimo (Art. 10 Ley 1581/2012)</li>
                  <li>• <strong>Cookies opcionales:</strong> Consentimiento informado (Art. 9 Ley 1581/2012)</li>
                  <li>• <strong>Cumplimiento:</strong> Principio de transparencia y acceso</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">Sus Derechos</h3>
                <p className="text-sm text-green-700 mb-2">
                  Según la Ley 1581 de 2012, usted tiene derecho a:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Conocer qué cookies utilizamos y para qué</li>
                  <li>• Activar o desactivar cookies no esenciales</li>
                  <li>• Revocar su consentimiento en cualquier momento</li>
                  <li>• Acceder y eliminar cookies almacenadas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <Cookie className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Contacto y Consultas
              </h2>
            </div>

            <div className="text-neutral-700">
              <p className="mb-4">
                Si tiene preguntas sobre nuestra política de cookies o desea ejercer
                sus derechos, puede contactarnos:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Correo Electrónico</h4>
                  <p className="text-sm text-neutral-600">cookies@wildtour.co</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Teléfono</h4>
                  <p className="text-sm text-neutral-600">+57 (1) 234-5678</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700">
                  <strong>Actualizaciones:</strong> Esta política puede ser actualizada periódicamente.
                  La fecha de última modificación se muestra al inicio del documento.
                  Le notificaremos sobre cambios significativos a través de nuestro sitio web.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="flex justify-center gap-6">
            <Link
              to="/privacy-center"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:from-primary-700 hover:to-primary-600 transition-all transform hover:scale-105"
            >
              <Settings className="w-5 h-5 mr-2" />
              Centro de Privacidad
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 border border-primary-200 rounded-xl font-medium shadow-lg hover:bg-primary-50 transition-all transform hover:scale-105"
            >
              Política de Privacidad
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;