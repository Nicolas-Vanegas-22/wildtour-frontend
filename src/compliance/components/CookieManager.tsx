import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Trash2, Download, RefreshCw, Shield } from 'lucide-react';
import { useConsentStore, ConsentType } from '../stores/useConsentStore';
import { Button } from '../../shared/ui/Button';

interface CookieInfo {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: Date;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  category: ConsentType;
  purpose: string;
  retention: string;
}

interface CookieCategory {
  type: ConsentType;
  name: string;
  description: string;
  enabled: boolean;
  cookies: CookieInfo[];
}

const CookieManager: React.FC = () => {
  const { preferences, updatePreferences, clearAllConsents } = useConsentStore();
  const [detectedCookies, setDetectedCookies] = useState<CookieInfo[]>([]);
  const [categories, setCategories] = useState<CookieCategory[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Detectar cookies existentes
  useEffect(() => {
    const detectCookies = () => {
      const cookieStrings = document.cookie.split(';');
      const detected: CookieInfo[] = [];

      cookieStrings.forEach(cookieString => {
        const [name, value] = cookieString.trim().split('=');
        if (name && value) {
          // Categorizar cookie basado en su nombre/propósito
          const category = categorizeCookie(name);

          detected.push({
            name: name.trim(),
            value: value.trim(),
            domain: window.location.hostname,
            path: '/',
            secure: window.location.protocol === 'https:',
            httpOnly: false, // No podemos detectar httpOnly desde JS
            sameSite: 'Lax',
            category,
            purpose: getCookiePurpose(name),
            retention: getCookieRetention(name),
          });
        }
      });

      setDetectedCookies(detected);
    };

    detectCookies();

    // Actualizar cada 30 segundos
    const interval = setInterval(detectCookies, 30000);
    return () => clearInterval(interval);
  }, []);

  // Organizar cookies por categorías
  useEffect(() => {
    const organizedCategories: CookieCategory[] = [
      {
        type: 'essential',
        name: 'Cookies Esenciales',
        description: 'Necesarias para el funcionamiento del sitio',
        enabled: preferences.essential,
        cookies: detectedCookies.filter(c => c.category === 'essential')
      },
      {
        type: 'functional',
        name: 'Cookies Funcionales',
        description: 'Mejoran la funcionalidad y personalización',
        enabled: preferences.functional,
        cookies: detectedCookies.filter(c => c.category === 'functional')
      },
      {
        type: 'analytics',
        name: 'Cookies de Análisis',
        description: 'Ayudan a entender el uso del sitio',
        enabled: preferences.analytics,
        cookies: detectedCookies.filter(c => c.category === 'analytics')
      },
      {
        type: 'marketing',
        name: 'Cookies de Marketing',
        description: 'Publicidad y marketing personalizado',
        enabled: preferences.marketing,
        cookies: detectedCookies.filter(c => c.category === 'marketing')
      },
      {
        type: 'social_media',
        name: 'Cookies de Redes Sociales',
        description: 'Integración con redes sociales',
        enabled: preferences.social_media,
        cookies: detectedCookies.filter(c => c.category === 'social_media')
      }
    ];

    setCategories(organizedCategories);
  }, [detectedCookies, preferences]);

  const categorizeCookie = (cookieName: string): ConsentType => {
    const name = cookieName.toLowerCase();

    // Cookies esenciales
    if (name.includes('session') || name.includes('csrf') || name.includes('auth') ||
        name.includes('wildtour-token') || name.includes('security')) {
      return 'essential';
    }

    // Cookies de análisis
    if (name.includes('_ga') || name.includes('_gid') || name.includes('analytics') ||
        name.includes('_gtm') || name.includes('hotjar')) {
      return 'analytics';
    }

    // Cookies de marketing
    if (name.includes('_fbp') || name.includes('_fbc') || name.includes('ads') ||
        name.includes('marketing') || name.includes('pixel')) {
      return 'marketing';
    }

    // Cookies de redes sociales
    if (name.includes('facebook') || name.includes('twitter') || name.includes('instagram') ||
        name.includes('social') || name.includes('share')) {
      return 'social_media';
    }

    // Cookies funcionales por defecto
    return 'functional';
  };

  const getCookiePurpose = (cookieName: string): string => {
    const name = cookieName.toLowerCase();

    if (name.includes('session')) return 'Gestión de sesión de usuario';
    if (name.includes('auth')) return 'Autenticación y seguridad';
    if (name.includes('_ga')) return 'Google Analytics - Análisis de tráfico';
    if (name.includes('_fbp')) return 'Facebook Pixel - Seguimiento publicitario';
    if (name.includes('consent')) return 'Preferencias de consentimiento';
    if (name.includes('theme')) return 'Preferencias de tema visual';
    if (name.includes('lang')) return 'Preferencias de idioma';

    return 'Funcionalidad del sitio web';
  };

  const getCookieRetention = (cookieName: string): string => {
    const name = cookieName.toLowerCase();

    if (name.includes('session')) return 'Sesión';
    if (name.includes('_ga')) return '2 años';
    if (name.includes('_gid')) return '24 horas';
    if (name.includes('consent')) return '12 meses';
    if (name.includes('auth')) return '30 días';

    return '1 año';
  };

  const handleToggleCategory = (type: ConsentType) => {
    if (type === 'essential') return; // No se puede desactivar

    updatePreferences({
      [type]: !preferences[type as keyof typeof preferences]
    });
  };

  const handleDeleteCookie = (cookieName: string) => {
    // Eliminar la cookie configurando su fecha de expiración en el pasado
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;

    // Actualizar la lista
    setDetectedCookies(prev => prev.filter(cookie => cookie.name !== cookieName));
  };

  const handleClearCategory = (type: ConsentType) => {
    if (type === 'essential') return;

    const categoryFCookies = detectedCookies.filter(cookie => cookie.category === type);
    categoryFCookies.forEach(cookie => {
      handleDeleteCookie(cookie.name);
    });

    // Revocar el consentimiento para la categoría
    updatePreferences({ [type]: false });
  };

  const handleExportCookieData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      preferences,
      detectedCookies: detectedCookies.map(cookie => ({
        name: cookie.name,
        category: cookie.category,
        purpose: cookie.purpose,
        retention: cookie.retention,
        domain: cookie.domain
      })),
      categories: categories.map(cat => ({
        type: cat.type,
        name: cat.name,
        enabled: cat.enabled,
        cookieCount: cat.cookies.length
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wildtour-cookies-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (type: ConsentType, enabled: boolean) => {
    if (!enabled) return 'bg-neutral-100 text-neutral-500';

    switch (type) {
      case 'essential': return 'bg-green-100 text-green-700';
      case 'functional': return 'bg-blue-100 text-blue-700';
      case 'analytics': return 'bg-purple-100 text-purple-700';
      case 'marketing': return 'bg-orange-100 text-orange-700';
      case 'social_media': return 'bg-pink-100 text-pink-700';
      default: return 'bg-neutral-100 text-neutral-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
            <Cookie className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-neutral-800">
              Gestor de Cookies
            </h2>
            <p className="text-neutral-600 text-sm">
              Control granular de cookies por categorías
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showDetails ? 'Ocultar' : 'Detalles'}
          </Button>

          <Button
            onClick={handleExportCookieData}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-neutral-800">{detectedCookies.length}</div>
          <div className="text-sm text-neutral-600">Total Cookies</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            {categories.filter(c => c.enabled).length}
          </div>
          <div className="text-sm text-green-600">Categorías Activas</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">
            {detectedCookies.filter(c => c.category === 'essential').length}
          </div>
          <div className="text-sm text-blue-600">Esenciales</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">
            {detectedCookies.filter(c => c.category !== 'essential').length}
          </div>
          <div className="text-sm text-amber-600">Opcionales</div>
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-xl p-5 transition-all ${
              category.enabled
                ? 'border-primary-200 bg-primary-50'
                : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                  getCategoryColor(category.type, category.enabled)
                }`}>
                  {category.cookies.length} cookies
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">{category.name}</h3>
                  <p className="text-sm text-neutral-600">{category.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {category.type !== 'essential' && category.cookies.length > 0 && (
                  <Button
                    onClick={() => handleClearCategory(category.type)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}

                <button
                  onClick={() => handleToggleCategory(category.type)}
                  disabled={category.type === 'essential'}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    category.enabled ? 'bg-primary-500' : 'bg-neutral-300'
                  } ${category.type === 'essential' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <motion.div
                    animate={{ x: category.enabled ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  />
                </button>
              </div>
            </div>

            {/* Detalles de cookies */}
            {showDetails && category.cookies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-neutral-200 pt-4 mt-4"
              >
                <div className="space-y-3">
                  {category.cookies.map((cookie, index) => (
                    <div
                      key={`${cookie.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-neutral-800 mr-2">
                            {cookie.name}
                          </span>
                          {cookie.secure && (
                            <Shield className="w-3 h-3 text-green-500" title="Segura" />
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{cookie.purpose}</p>
                        <div className="flex gap-4 text-xs text-neutral-500">
                          <span>Dominio: {cookie.domain}</span>
                          <span>Retención: {cookie.retention}</span>
                          <span>SameSite: {cookie.sameSite}</span>
                        </div>
                      </div>

                      {category.type !== 'essential' && (
                        <Button
                          onClick={() => handleDeleteCookie(cookie.name)}
                          variant="outline"
                          size="sm"
                          className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </div>

          <div className="text-xs text-neutral-500">
            Cumplimiento Ley 1581/2012 - Colombia
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieManager;