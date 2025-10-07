import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, Cookie, BarChart3, Megaphone, Share2, Database,
  CheckCircle, XCircle, Info, Clock, FileText, AlertTriangle
} from 'lucide-react';
import { useConsentStore, ConsentType, ConsentPreferences } from '../stores/useConsentStore';
import { Button } from '../../shared/ui/Button';

interface ConsentCategory {
  type: ConsentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  purposes: string[];
  retention: string;
  thirdParties?: string[];
  legalBasis: string;
  examples: string[];
}

const consentCategories: ConsentCategory[] = [
  {
    type: 'essential',
    title: 'Cookies Esenciales',
    description: 'Necesarias para el funcionamiento básico del sitio web y no se pueden desactivar.',
    icon: <Shield className="w-5 h-5" />,
    required: true,
    purposes: [
      'Autenticación y seguridad de sesión',
      'Recordar preferencias básicas',
      'Funcionamiento del carrito de compras',
      'Prevención de fraude'
    ],
    retention: 'Durante la sesión o hasta 30 días',
    legalBasis: 'Interés legítimo - Art. 10 Ley 1581/2012',
    examples: ['Tokens de sesión', 'Preferencias de idioma', 'Configuración de seguridad']
  },
  {
    type: 'functional',
    title: 'Cookies Funcionales',
    description: 'Mejoran la funcionalidad del sitio recordando sus elecciones y preferencias.',
    icon: <Cookie className="w-5 h-5" />,
    required: false,
    purposes: [
      'Recordar preferencias de usuario',
      'Personalización de la interfaz',
      'Funcionalidades mejoradas del sitio',
      'Configuraciones de accesibilidad'
    ],
    retention: 'Hasta 12 meses',
    legalBasis: 'Consentimiento - Art. 9 Ley 1581/2012',
    examples: ['Tema visual preferido', 'Configuraciones de mapa', 'Filtros guardados']
  },
  {
    type: 'analytics',
    title: 'Análisis y Rendimiento',
    description: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.',
    icon: <BarChart3 className="w-5 h-5" />,
    required: false,
    purposes: [
      'Análisis de tráfico y comportamiento',
      'Mejora del rendimiento del sitio',
      'Identificación de errores técnicos',
      'Optimización de la experiencia de usuario'
    ],
    retention: 'Hasta 24 meses',
    thirdParties: ['Google Analytics', 'Hotjar'],
    legalBasis: 'Consentimiento - Art. 9 Ley 1581/2012',
    examples: ['Páginas visitadas', 'Tiempo de permanencia', 'Clicks y navegación']
  },
  {
    type: 'marketing',
    title: 'Marketing y Publicidad',
    description: 'Utilizadas para mostrar anuncios relevantes y medir la efectividad de campañas.',
    icon: <Megaphone className="w-5 h-5" />,
    required: false,
    purposes: [
      'Publicidad personalizada',
      'Retargeting y remarketing',
      'Medición de campañas publicitarias',
      'Segmentación de audiencias'
    ],
    retention: 'Hasta 13 meses',
    thirdParties: ['Google Ads', 'Facebook Ads', 'Meta Pixel'],
    legalBasis: 'Consentimiento - Art. 9 Ley 1581/2012',
    examples: ['Intereses de viaje', 'Historial de búsquedas', 'Productos visualizados']
  },
  {
    type: 'social_media',
    title: 'Redes Sociales',
    description: 'Permiten compartir contenido y conectar con redes sociales externas.',
    icon: <Share2 className="w-5 h-5" />,
    required: false,
    purposes: [
      'Compartir contenido en redes sociales',
      'Login con redes sociales',
      'Widgets de redes sociales integrados',
      'Funcionalidades sociales mejoradas'
    ],
    retention: 'Hasta 12 meses',
    thirdParties: ['Facebook', 'Instagram', 'Twitter', 'WhatsApp'],
    legalBasis: 'Consentimiento - Art. 9 Ley 1581/2012',
    examples: ['Botones de compartir', 'Login social', 'Contenido embebido']
  },
  {
    type: 'data_processing',
    title: 'Procesamiento de Datos',
    description: 'Tratamiento de sus datos personales para servicios específicos de turismo.',
    icon: <Database className="w-5 h-5" />,
    required: false,
    purposes: [
      'Recomendaciones personalizadas de destinos',
      'Análisis de preferencias de viaje',
      'Mejora de servicios turísticos',
      'Comunicaciones personalizadas'
    ],
    retention: 'Hasta 5 años después de la última actividad',
    legalBasis: 'Consentimiento - Art. 9 Ley 1581/2012',
    examples: ['Perfil de viajero', 'Historial de reservas', 'Preferencias guardadas']
  },
  {
    type: 'third_party_sharing',
    title: 'Compartir con Terceros',
    description: 'Compartir información con socios comerciales para completar servicios.',
    icon: <Share2 className="w-5 h-5" />,
    required: false,
    purposes: [
      'Procesamiento de reservas con proveedores',
      'Servicios de pago y facturación',
      'Verificación de identidad',
      'Servicios de atención al cliente'
    ],
    retention: 'Según políticas del tercero (máximo 7 años)',
    thirdParties: ['Proveedores de servicios turísticos', 'Procesadores de pago', 'Verificadores de identidad'],
    legalBasis: 'Consentimiento específico - Art. 9 Ley 1581/2012',
    examples: ['Datos de reserva a hoteles', 'Información de pago', 'Documentos de identidad']
  }
];

const ConsentModal: React.FC = () => {
  const {
    showModal,
    modalType,
    hideConsentModal,
    preferences,
    updatePreferences,
    acceptAll,
    rejectNonEssential,
    getConsentHistory
  } = useConsentStore();

  const [currentPreferences, setCurrentPreferences] = useState<ConsentPreferences>(preferences);
  const [activeTab, setActiveTab] = useState<'preferences' | 'details' | 'history'>('preferences');

  const handleToggleConsent = (type: ConsentType) => {
    if (type === 'essential') return; // No se puede desactivar

    setCurrentPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    updatePreferences(currentPreferences, 'settings');
    hideConsentModal();
  };

  const handleAcceptAll = () => {
    acceptAll('settings');
    hideConsentModal();
  };

  const handleRejectAll = () => {
    rejectNonEssential('settings');
    hideConsentModal();
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={hideConsentModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-strong border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-neutral-800">
                    Centro de Privacidad
                  </h2>
                  <p className="text-neutral-600">
                    Gestione sus preferencias de privacidad y consentimientos
                  </p>
                </div>
              </div>
              <button
                onClick={hideConsentModal}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <X className="w-6 h-6 text-neutral-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mt-6 space-x-1 bg-white rounded-xl p-1">
              {[
                { id: 'preferences', label: 'Preferencias', icon: <Shield className="w-4 h-4" /> },
                { id: 'details', label: 'Detalles', icon: <Info className="w-4 h-4" /> },
                { id: 'history', label: 'Historial', icon: <Clock className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-1">
                        Importante - Ley 1581 de 2012
                      </h3>
                      <p className="text-sm text-amber-700">
                        Sus consentimientos son voluntarios y específicos. Puede revocarlos en cualquier momento
                        sin que esto afecte la licitud del tratamiento anterior. Los datos esenciales son
                        necesarios para el funcionamiento del servicio.
                      </p>
                    </div>
                  </div>
                </div>

                {consentCategories.map((category) => (
                  <div
                    key={category.type}
                    className={`border rounded-xl p-5 transition-all ${
                      currentPreferences[category.type]
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            currentPreferences[category.type]
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800 text-lg">
                              {category.title}
                              {category.required && (
                                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                  Requerido
                                </span>
                              )}
                            </h3>
                            <p className="text-neutral-600 text-sm">
                              {category.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-neutral-700 mb-2">Finalidades:</h4>
                            <ul className="space-y-1">
                              {category.purposes.map((purpose, idx) => (
                                <li key={idx} className="flex items-start text-neutral-600">
                                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {purpose}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-neutral-700 mb-1">Retención:</h4>
                              <p className="text-neutral-600">{category.retention}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-neutral-700 mb-1">Base Legal:</h4>
                              <p className="text-neutral-600">{category.legalBasis}</p>
                            </div>

                            {category.thirdParties && (
                              <div>
                                <h4 className="font-medium text-neutral-700 mb-1">Terceros:</h4>
                                <p className="text-neutral-600">{category.thirdParties.join(', ')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <button
                          onClick={() => handleToggleConsent(category.type)}
                          disabled={category.required}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            currentPreferences[category.type]
                              ? 'bg-primary-500'
                              : 'bg-neutral-300'
                          } ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <motion.div
                            animate={{
                              x: currentPreferences[category.type] ? 24 : 2
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                {consentCategories.map((category) => (
                  <div key={category.type} className="border border-neutral-200 rounded-xl p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-800">{category.title}</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-2">Ejemplos de Datos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.examples.map((example, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-neutral-700 mb-1">Retención:</h4>
                          <p className="text-neutral-600">{category.retention}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-700 mb-1">Base Legal:</h4>
                          <p className="text-neutral-600">{category.legalBasis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-700 mb-1">Estado:</h4>
                          <div className="flex items-center">
                            {currentPreferences[category.type] ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={currentPreferences[category.type] ? 'text-green-600' : 'text-red-600'}>
                              {currentPreferences[category.type] ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">
                        Registro de Consentimientos
                      </h3>
                      <p className="text-sm text-blue-700">
                        Historial completo de sus decisiones de consentimiento para cumplimiento
                        con la Ley 1581 de 2012. Estos registros se mantienen como prueba legal.
                      </p>
                    </div>
                  </div>
                </div>

                {consentCategories.map((category) => {
                  const history = getConsentHistory(category.type);
                  return (
                    <div key={category.type} className="border border-neutral-200 rounded-xl p-5">
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-neutral-800">{category.title}</h3>
                      </div>

                      {history.length > 0 ? (
                        <div className="space-y-2">
                          {history.slice(0, 3).map((record) => (
                            <div key={record.id} className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg">
                              <div className="flex items-center">
                                {record.granted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm font-medium">
                                  {record.granted ? 'Consentimiento otorgado' : 'Consentimiento revocado'}
                                </span>
                              </div>
                              <div className="text-xs text-neutral-500">
                                {new Date(record.timestamp).toLocaleString('es-ES')}
                              </div>
                            </div>
                          ))}
                          {history.length > 3 && (
                            <p className="text-xs text-neutral-500 text-center">
                              +{history.length - 3} registros más
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm">
                          No hay historial de consentimientos para esta categoría.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                size="lg"
              >
                Aceptar Todo
              </Button>
              <Button
                onClick={handleSavePreferences}
                variant="primary"
                className="flex-1"
                size="lg"
              >
                Guardar Preferencias
              </Button>
              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Solo Esenciales
              </Button>
            </div>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Sus preferencias se guardarán de forma segura y se aplicarán inmediatamente.
              Puede cambiarlas en cualquier momento desde la configuración de su cuenta.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsentModal;