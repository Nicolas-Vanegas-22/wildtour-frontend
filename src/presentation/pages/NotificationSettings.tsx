import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Settings, Save, Volume2, VolumeX, Clock, Filter } from 'lucide-react';

interface NotificationPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'booking_confirmation',
      category: 'Reservas',
      label: 'Confirmación de reserva',
      description: 'Recibe notificaciones cuando tus reservas sean confirmadas',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'booking_reminder',
      category: 'Reservas',
      label: 'Recordatorios de viaje',
      description: 'Recordatorios antes de la fecha de tu viaje',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'booking_cancellation',
      category: 'Reservas',
      label: 'Cancelaciones',
      description: 'Notificaciones sobre cancelaciones de reservas',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'payment_confirmation',
      category: 'Pagos',
      label: 'Confirmación de pago',
      description: 'Confirmación cuando se procese un pago exitosamente',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'payment_failed',
      category: 'Pagos',
      label: 'Pagos fallidos',
      description: 'Notificaciones cuando un pago no se pueda procesar',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'refund_processed',
      category: 'Pagos',
      label: 'Reembolsos',
      description: 'Confirmación cuando se procese un reembolso',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'new_review',
      category: 'Reseñas',
      label: 'Nuevas reseñas',
      description: 'Cuando recibas una nueva reseña en tus servicios',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'review_response',
      category: 'Reseñas',
      label: 'Respuestas a reseñas',
      description: 'Cuando un proveedor responda a tu reseña',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'promotions',
      category: 'Marketing',
      label: 'Ofertas y promociones',
      description: 'Ofertas especiales y descuentos disponibles',
      email: false,
      push: false,
      sms: false
    },
    {
      id: 'newsletter',
      category: 'Marketing',
      label: 'Newsletter',
      description: 'Boletín semanal con destinos y consejos de viaje',
      email: false,
      push: false,
      sms: false
    },
    {
      id: 'system_maintenance',
      category: 'Sistema',
      label: 'Mantenimiento del sistema',
      description: 'Notificaciones sobre mantenimiento programado',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'security_alerts',
      category: 'Sistema',
      label: 'Alertas de seguridad',
      description: 'Actividad sospechosa en tu cuenta',
      email: true,
      push: true,
      sms: true
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    doNotDisturb: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    soundEnabled: true,
    vibrationEnabled: true
  });

  const updatePreference = (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => prev.map(pref =>
      pref.id === id ? { ...pref, [type]: value } : pref
    ));
  };

  const toggleGlobalSetting = (setting: keyof typeof globalSettings) => {
    setGlobalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const updateTime = (setting: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setGlobalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    console.log('Saving notification preferences:', { preferences, globalSettings });
    // Aquí implementarías la lógica para guardar las preferencias
  };

  const resetToDefaults = () => {
    // Implementar reset a valores por defecto
    console.log('Resetting to default settings');
  };

  const categories = [...new Set(preferences.map(pref => pref.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración de Notificaciones</h1>
                <p className="text-sm text-gray-600">Personaliza cómo y cuándo quieres recibir notificaciones</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Global Settings */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración General</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Notificaciones por email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSettings.emailNotifications}
                        onChange={() => toggleGlobalSetting('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Notificaciones push</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSettings.pushNotifications}
                        onChange={() => toggleGlobalSetting('pushNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Notificaciones SMS</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSettings.smsNotifications}
                        onChange={() => toggleGlobalSetting('smsNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <VolumeX className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">No molestar</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSettings.doNotDisturb}
                        onChange={() => toggleGlobalSetting('doNotDisturb')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Quiet Hours */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Horas de silencio</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                      <input
                        type="time"
                        value={globalSettings.quietHoursStart}
                        onChange={(e) => updateTime('quietHoursStart', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                      <input
                        type="time"
                        value={globalSettings.quietHoursEnd}
                        onChange={(e) => updateTime('quietHoursEnd', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sound Settings */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Sonido</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={globalSettings.soundEnabled}
                          onChange={() => toggleGlobalSetting('soundEnabled')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Vibración</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={globalSettings.vibrationEnabled}
                          onChange={() => toggleGlobalSetting('vibrationEnabled')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferencias por Categoría</h2>

              {categories.map(category => (
                <div key={category} className="mb-6 border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">{category}</h3>
                  </div>

                  <div className="p-4">
                    {preferences
                      .filter(pref => pref.category === category)
                      .map(pref => (
                        <div key={pref.id} className="py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{pref.label}</h4>
                              <p className="text-sm text-gray-600">{pref.description}</p>
                            </div>
                          </div>

                          <div className="flex space-x-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={pref.email}
                                onChange={(e) => updatePreference(pref.id, 'email', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                disabled={!globalSettings.emailNotifications}
                              />
                              <span className="text-sm text-gray-700">Email</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={pref.push}
                                onChange={(e) => updatePreference(pref.id, 'push', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                disabled={!globalSettings.pushNotifications}
                              />
                              <span className="text-sm text-gray-700">Push</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={pref.sms}
                                onChange={(e) => updatePreference(pref.id, 'sms', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                disabled={!globalSettings.smsNotifications}
                              />
                              <span className="text-sm text-gray-700">SMS</span>
                            </label>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Restaurar valores por defecto
              </button>

              <button
                onClick={saveSettings}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Guardar configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;