import React, { useState } from 'react';
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  MousePointer,
  Keyboard,
  Settings,
  Plus,
  Minus,
  RotateCcw,
  Check
} from 'lucide-react';
import { useHighContrast, useFontSize, useScreenReader } from '../hooks/useAccessibility';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
  const { announce } = useScreenReader();

  const [preferences, setPreferences] = useState({
    soundEnabled: true,
    animationsEnabled: true,
    keyboardNavigationHelp: false,
    focusIndicator: true,
    autoAnnouncements: true
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => {
      const newValue = !prev[key];
      announce(`${key} ${newValue ? 'activado' : 'desactivado'}`, 'polite');
      return { ...prev, [key]: newValue };
    });
  };

  const handleContrastToggle = () => {
    toggleHighContrast();
    announce(`Modo de alto contraste ${!isHighContrast ? 'activado' : 'desactivado'}`, 'polite');
  };

  const handleFontIncrease = () => {
    increaseFontSize();
    announce(`Tamaño de fuente aumentado a ${fontSize + 10}%`, 'polite');
  };

  const handleFontDecrease = () => {
    decreaseFontSize();
    announce(`Tamaño de fuente reducido a ${fontSize - 10}%`, 'polite');
  };

  const handleFontReset = () => {
    resetFontSize();
    announce('Tamaño de fuente restablecido al valor por defecto', 'polite');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 id="accessibility-title" className="text-xl font-semibold text-gray-900">
              Configuración de Accesibilidad
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Cerrar configuración de accesibilidad"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Configuración Visual */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Configuración Visual
            </h3>

            <div className="space-y-4">
              {/* Alto Contraste */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Modo de Alto Contraste
                  </label>
                  <p className="text-sm text-gray-500">
                    Mejora la visibilidad con colores de mayor contraste
                  </p>
                </div>
                <button
                  onClick={handleContrastToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isHighContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={isHighContrast}
                  aria-label="Alternar modo de alto contraste"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Tamaño de Fuente */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tamaño de Fuente ({fontSize}%)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleFontDecrease}
                    disabled={fontSize <= 80}
                    className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Reducir tamaño de fuente"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${((fontSize - 80) / 70) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={handleFontIncrease}
                    disabled={fontSize >= 150}
                    className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Aumentar tamaño de fuente"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleFontReset}
                    className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Restablecer tamaño de fuente"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Configuración de Audio */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
              Configuración de Audio
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sonidos del Sistema
                  </label>
                  <p className="text-sm text-gray-500">
                    Reproducir sonidos para acciones e interacciones
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('soundEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.soundEnabled}
                  aria-label="Alternar sonidos del sistema"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Anuncios Automáticos
                  </label>
                  <p className="text-sm text-gray-500">
                    Anunciar automáticamente cambios importantes en la página
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoAnnouncements')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.autoAnnouncements ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.autoAnnouncements}
                  aria-label="Alternar anuncios automáticos"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.autoAnnouncements ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Configuración de Navegación */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Keyboard className="w-5 h-5 mr-2 text-blue-600" />
              Navegación
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Indicadores de Foco Mejorados
                  </label>
                  <p className="text-sm text-gray-500">
                    Resaltar claramente el elemento enfocado
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('focusIndicator')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.focusIndicator ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.focusIndicator}
                  aria-label="Alternar indicadores de foco mejorados"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.focusIndicator ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ayuda de Navegación por Teclado
                  </label>
                  <p className="text-sm text-gray-500">
                    Mostrar atajos de teclado disponibles
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('keyboardNavigationHelp')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.keyboardNavigationHelp ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.keyboardNavigationHelp}
                  aria-label="Alternar ayuda de navegación por teclado"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.keyboardNavigationHelp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Animaciones Reducidas
                  </label>
                  <p className="text-sm text-gray-500">
                    Reducir o desactivar animaciones para mejor experiencia
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('animationsEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    !preferences.animationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={!preferences.animationsEnabled}
                  aria-label="Alternar animaciones reducidas"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !preferences.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Atajos de Teclado */}
          {preferences.keyboardNavigationHelp && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Atajos de Teclado
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Navegación General:</strong>
                    <ul className="mt-2 space-y-1">
                      <li><kbd className="bg-white px-2 py-1 rounded">Tab</kbd> - Siguiente elemento</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">Shift + Tab</kbd> - Elemento anterior</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">Enter</kbd> - Activar elemento</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">Escape</kbd> - Cerrar modal/menú</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Navegación por Listas:</strong>
                    <ul className="mt-2 space-y-1">
                      <li><kbd className="bg-white px-2 py-1 rounded">↑ ↓</kbd> - Navegar elementos</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">Home</kbd> - Primer elemento</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">End</kbd> - Último elemento</li>
                      <li><kbd className="bg-white px-2 py-1 rounded">Ctrl + F</kbd> - Buscar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Los cambios se guardan automáticamente
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Check className="w-4 h-4 inline-block mr-2" />
            Cerrar
          </button>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
    </div>
  );
};

export default AccessibilitySettings;