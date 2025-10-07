import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Eye, Cookie, Download, Trash2, Settings,
  CheckCircle, XCircle, AlertTriangle, Clock, Database,
  FileText, Lock, Globe, Users, BarChart3, RefreshCw
} from 'lucide-react';
import { useConsentStore } from '../stores/useConsentStore';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';
import CookieManager from './CookieManager';
import ConsentModal from './ConsentModal';

interface DataSummary {
  category: string;
  count: number;
  lastUpdated: string;
  retention: string;
  purposes: string[];
}

interface PrivacyActivity {
  id: string;
  type: 'consent' | 'access' | 'update' | 'delete' | 'export';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const PrivacyDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    preferences,
    consentRecords,
    lastUpdated,
    showConsentModal,
    revokeAllConsents,
    exportConsentData
  } = useConsentStore();

  const [activeSection, setActiveSection] = useState<'overview' | 'data' | 'consents' | 'activity' | 'settings'>('overview');
  const [dataSummary, setDataSummary] = useState<DataSummary[]>([]);
  const [recentActivity, setRecentActivity] = useState<PrivacyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simular carga de datos del usuario
  useEffect(() => {
    const loadUserData = () => {
      // Datos simulados - en producción vendrían de APIs
      setDataSummary([
        {
          category: 'Perfil Personal',
          count: 8,
          lastUpdated: '2025-01-20',
          retention: '5 años después de cierre de cuenta',
          purposes: ['Identificación', 'Comunicación', 'Prestación de servicios']
        },
        {
          category: 'Historial de Reservas',
          count: 12,
          lastUpdated: '2025-01-18',
          retention: '7 años (obligación fiscal)',
          purposes: ['Prestación de servicios', 'Facturación', 'Atención al cliente']
        },
        {
          category: 'Preferencias de Usuario',
          count: 5,
          lastUpdated: '2025-01-15',
          retention: '2 años de inactividad',
          purposes: ['Personalización', 'Mejora de servicios']
        },
        {
          category: 'Datos de Navegación',
          count: 150,
          lastUpdated: '2025-01-21',
          retention: '12 meses',
          purposes: ['Análisis de uso', 'Optimización', 'Seguridad']
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'consent',
          description: 'Consentimiento otorgado para cookies de marketing',
          timestamp: '2025-01-21T10:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'update',
          description: 'Información de perfil actualizada',
          timestamp: '2025-01-20T15:45:00Z',
          status: 'success'
        },
        {
          id: '3',
          type: 'access',
          description: 'Solicitud de acceso a datos procesada',
          timestamp: '2025-01-19T09:15:00Z',
          status: 'success'
        }
      ]);
    };

    loadUserData();
  }, []);

  const handleExportAllData = async () => {
    setIsLoading(true);
    try {
      // Simular exportación completa
      await new Promise(resolve => setTimeout(resolve, 2000));

      const exportData = {
        user: {
          id: user?.id,
          email: user?.email,
          username: user?.username,
          registrationDate: user?.registrationDate,
          lastLoginDate: user?.lastLoginDate
        },
        consents: exportConsentData(),
        dataSummary,
        recentActivity,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wildtour-datos-completos-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (!confirm('¿Está seguro de que desea eliminar TODOS sus datos? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 2000));
      revokeAllConsents();
      alert('Solicitud de eliminación de datos enviada. Será procesada en los próximos 15 días hábiles.');
    } catch (error) {
      console.error('Error al solicitar eliminación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConsentStatus = () => {
    const total = Object.keys(preferences).length;
    const granted = Object.values(preferences).filter(Boolean).length;
    return { granted, total, percentage: Math.round((granted / total) * 100) };
  };

  const getActivityIcon = (type: PrivacyActivity['type']) => {
    switch (type) {
      case 'consent': return <Shield className="w-4 h-4" />;
      case 'access': return <Eye className="w-4 h-4" />;
      case 'update': return <RefreshCw className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: PrivacyActivity['type']) => {
    switch (type) {
      case 'consent': return 'bg-green-100 text-green-700';
      case 'access': return 'bg-blue-100 text-blue-700';
      case 'update': return 'bg-yellow-100 text-yellow-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'export': return 'bg-purple-100 text-purple-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const consentStatus = getConsentStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-800">
            Centro de Privacidad
          </h2>
          <p className="text-neutral-600">
            Controle y gestione sus datos personales según la Ley 1581/2012
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportAllData}
            variant="outline"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Datos
          </Button>
          <Button
            onClick={() => showConsentModal('preferences')}
            variant="primary"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'data', label: 'Mis Datos', icon: <Database className="w-4 h-4" /> },
          { id: 'consents', label: 'Consentimientos', icon: <Shield className="w-4 h-4" /> },
          { id: 'activity', label: 'Actividad', icon: <Clock className="w-4 h-4" /> },
          { id: 'settings', label: 'Configuración', icon: <Settings className="w-4 h-4" /> }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-white text-primary-700 shadow-sm font-medium'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            {section.icon}
            <span className="ml-2 hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Estado general */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-700">
                    {consentStatus.percentage}%
                  </span>
                </div>
                <h3 className="font-semibold text-green-800">Consentimientos</h3>
                <p className="text-sm text-green-600">
                  {consentStatus.granted} de {consentStatus.total} categorías activas
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-700">
                    {dataSummary.reduce((sum, item) => sum + item.count, 0)}
                  </span>
                </div>
                <h3 className="font-semibold text-blue-800">Datos Almacenados</h3>
                <p className="text-sm text-blue-600">
                  En {dataSummary.length} categorías diferentes
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-700">
                    {recentActivity.length}
                  </span>
                </div>
                <h3 className="font-semibold text-purple-800">Actividades</h3>
                <p className="text-sm text-purple-600">
                  En los últimos 30 días
                </p>
              </div>
            </div>

            {/* Alertas importantes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-800">Alertas de Privacidad</h3>

              {!preferences.marketing && (
                <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Consentimiento de Marketing Desactivado
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      No recibirá ofertas personalizadas ni promociones especiales.
                    </p>
                  </div>
                </div>
              )}

              {lastUpdated && new Date().getTime() - new Date(lastUpdated).getTime() > 365 * 24 * 60 * 60 * 1000 && (
                <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Revisión Anual de Consentimientos
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Es recomendable revisar sus preferencias de privacidad anualmente.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones rápidas */}
            <div>
              <h3 className="font-semibold text-neutral-800 mb-4">Acciones Rápidas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => showConsentModal('preferences')}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Gestionar Consentimientos</div>
                    <div className="text-sm text-neutral-500">Configurar preferencias de privacidad</div>
                  </div>
                </Button>

                <Button
                  onClick={handleExportAllData}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  disabled={isLoading}
                >
                  <Download className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Exportar Mis Datos</div>
                    <div className="text-sm text-neutral-500">Descargar toda la información</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'data' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800">Resumen de Datos Personales</h3>

            <div className="space-y-4">
              {dataSummary.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-neutral-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-neutral-800 text-lg">{category.category}</h4>
                      <p className="text-neutral-600">{category.count} elementos de datos</p>
                    </div>
                    <div className="text-right text-sm text-neutral-500">
                      <div>Actualizado: {new Date(category.lastUpdated).toLocaleDateString('es-ES')}</div>
                      <div>Retención: {category.retention}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Finalidades del tratamiento:</h5>
                    <div className="flex flex-wrap gap-2">
                      {category.purposes.map((purpose, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {purpose}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Sus Derechos</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Según la Ley 1581 de 2012, usted puede:
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Solicitar acceso completo a todos sus datos</li>
                    <li>• Corregir información inexacta o incompleta</li>
                    <li>• Solicitar la eliminación de datos innecesarios</li>
                    <li>• Oponerse al tratamiento para finalidades específicas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'consents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-neutral-800">Estado de Consentimientos</h3>
              <Button
                onClick={() => showConsentModal('history')}
                variant="outline"
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver Historial
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(preferences).map(([key, value]) => (
                <div
                  key={key}
                  className={`border rounded-xl p-4 ${
                    value ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-800 capitalize">
                      {key.replace('_', ' ')}
                    </h4>
                    {value ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {value ? 'Consentimiento otorgado' : 'Consentimiento no otorgado'}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-neutral-800 mb-4">Gestión de Consentimientos</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => showConsentModal('preferences')}
                  variant="primary"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Modificar Preferencias
                </Button>
                <Button
                  onClick={exportConsentData}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Historial
                </Button>
                <Button
                  onClick={revokeAllConsents}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revocar Todo
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800">Actividad Reciente</h3>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-4 border border-neutral-200 rounded-xl"
                >
                  <div className={`p-2 rounded-lg mr-4 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">{activity.description}</p>
                    <p className="text-sm text-neutral-500">
                      {new Date(activity.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'success' ? 'bg-green-100 text-green-700' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {activity.status === 'success' ? 'Exitoso' :
                     activity.status === 'pending' ? 'Pendiente' : 'Fallido'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800">Configuración de Privacidad</h3>

            <CookieManager />

            <div className="border-t pt-6">
              <h4 className="font-semibold text-neutral-800 mb-4 text-red-700">Zona de Peligro</h4>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h5 className="font-semibold text-red-800 mb-2">Eliminar Todos los Datos</h5>
                <p className="text-sm text-red-700 mb-4">
                  Esta acción eliminará permanentemente todos sus datos de nuestros sistemas.
                  No se puede deshacer.
                </p>
                <Button
                  onClick={handleDeleteAllData}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-100"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Solicitar Eliminación Completa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConsentModal />
    </div>
  );
};

export default PrivacyDashboard;