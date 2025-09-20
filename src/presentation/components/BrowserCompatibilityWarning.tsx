import React, { useState, useEffect } from 'react';
import { AlertTriangle, Chrome, Firefox, ExternalLink, X } from 'lucide-react';
import { detectBrowser, needsBrowserUpdate, getBrowserUpdateMessage } from '../../infrastructure/compatibility/browserDetection';

const BrowserCompatibilityWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState(detectBrowser());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);

    // Verificar si el usuario ya descartó la advertencia en esta sesión
    const sessionDismissed = sessionStorage.getItem('browser-warning-dismissed');

    if (needsBrowserUpdate() && !sessionDismissed) {
      setShowWarning(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowWarning(false);
    sessionStorage.setItem('browser-warning-dismissed', 'true');
  };

  const getBrowserDownloadLinks = () => {
    return [
      {
        name: 'Google Chrome',
        url: 'https://www.google.com/chrome/',
        icon: <Chrome className="w-6 h-6" />,
        description: 'Rápido, seguro y fácil de usar'
      },
      {
        name: 'Mozilla Firefox',
        url: 'https://www.mozilla.org/firefox/',
        icon: <Firefox className="w-6 h-6" />,
        description: 'Navegador privado y personalizable'
      },
      {
        name: 'Microsoft Edge',
        url: 'https://www.microsoft.com/edge/',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.86 6.57a11.94 11.94 0 0 0-18.47 4.06c-.64 1.24-.86 2.64-.65 4.01.22 1.37.89 2.6 1.91 3.51a7.25 7.25 0 0 0 5.43 2.34c2.02 0 3.93-.8 5.35-2.24l.02-.02.02-.02a7.6 7.6 0 0 0 2.24-5.35c0-.85-.15-1.68-.44-2.44a11.4 11.4 0 0 0-2.64-4.85 11.94 11.94 0 0 0-8.83-3.68c-1.89 0-3.7.45-5.33 1.26a11.7 11.7 0 0 0-4.35 3.44 11.94 11.94 0 0 0-2.45 7.26c0 6.6 5.37 11.97 11.97 11.97 2.02 0 3.93-.5 5.61-1.4a11.97 11.97 0 0 0 6.38-10.57c0-2.02-.5-3.93-1.4-5.61z"/>
          </svg>
        ),
        description: 'El navegador moderno de Microsoft'
      },
      {
        name: 'Safari',
        url: 'https://www.apple.com/safari/',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9L12 8.5 8.5 12 12 15.5 15.5 12z"/>
          </svg>
        ),
        description: 'El navegador de Apple (solo macOS/iOS)'
      }
    ];
  };

  if (!showWarning || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Navegador No Compatible
              </h2>
              <p className="text-sm text-gray-600">
                Para una mejor experiencia, actualiza tu navegador
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Cerrar advertencia"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Información del navegador actual */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-orange-800 mb-2">Tu navegador actual:</h3>
            <div className="text-sm text-orange-700">
              <p><strong>Navegador:</strong> {browserInfo.name} {browserInfo.version}</p>
              <p><strong>Sistema:</strong> {browserInfo.os}</p>
              <p className="mt-2">{getBrowserUpdateMessage()}</p>
            </div>
          </div>

          {/* Características no soportadas */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Características que podrían no funcionar correctamente:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {!browserInfo.features.cssGrid && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Diseño de cuadrícula CSS
                </div>
              )}
              {!browserInfo.features.cssFlexbox && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Diseño flexible CSS
                </div>
              )}
              {!browserInfo.features.fetch && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Carga de datos moderna
                </div>
              )}
              {!browserInfo.features.intersectionObserver && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Carga perezosa de imágenes
                </div>
              )}
              {!browserInfo.features.serviceWorker && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Funcionalidad offline
                </div>
              )}
              {!browserInfo.features.webp && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Imágenes optimizadas WebP
                </div>
              )}
            </div>
          </div>

          {/* Navegadores recomendados */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Navegadores recomendados para WildTour:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getBrowserDownloadLinks().map((browser) => (
                <a
                  key={browser.name}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="text-blue-600 mr-4 group-hover:text-blue-700">
                    {browser.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700">
                      {browser.name}
                    </h4>
                    <p className="text-sm text-gray-600">{browser.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">¿Por qué actualizar?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mayor velocidad y rendimiento</li>
              <li>• Mejor seguridad y protección</li>
              <li>• Acceso a las últimas características</li>
              <li>• Experiencia de usuario mejorada</li>
              <li>• Compatibilidad con tecnologías modernas</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Puedes continuar, pero algunas funciones podrían no estar disponibles.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Continuar de todos modos
            </button>
            <a
              href="https://www.google.com/chrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Actualizar navegador
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserCompatibilityWarning;