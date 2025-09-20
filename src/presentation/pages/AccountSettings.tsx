import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/account-settings.css';
import {
  User,
  Settings,
  CreditCard,
  Shield,
  Globe,
  Bell,
  Users,
  Lock,
  HelpCircle,
  Camera,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Link as LinkIcon,
  Unlink,
  MapPin,
  Languages,
  Palette,
  Volume2,
  VolumeX,
  Check,
  X,
  Phone,
  Mail,
  CreditCard as CardIcon,
  Smartphone,
  Key,
  UserCheck,
  MessageSquare,
  FileText,
  ChevronRight
} from 'lucide-react';

type SettingsSection =
  | 'personal'
  | 'preferences'
  | 'payments'
  | 'roles'
  | 'privacy'
  | 'connections'
  | 'support';

export default function AccountSettings() {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal');
  const [isLoading, setIsLoading] = useState(false);

  const sections = [
    {
      id: 'personal' as SettingsSection,
      title: 'Información Personal',
      icon: User,
      description: 'Perfil, contacto y seguridad'
    },
    {
      id: 'preferences' as SettingsSection,
      title: 'Preferencias',
      icon: Settings,
      description: 'Experiencia y notificaciones'
    },
    {
      id: 'payments' as SettingsSection,
      title: 'Pagos y Reservas',
      icon: CreditCard,
      description: 'Métodos de pago e historial'
    },
    {
      id: 'roles' as SettingsSection,
      title: 'Roles y Permisos',
      icon: Users,
      description: 'Gestión de roles y visibilidad'
    },
    {
      id: 'privacy' as SettingsSection,
      title: 'Privacidad y Seguridad',
      icon: Shield,
      description: 'Control de datos y privacidad'
    },
    {
      id: 'connections' as SettingsSection,
      title: 'Conexiones Externas',
      icon: Globe,
      description: 'Redes sociales e integraciones'
    },
    {
      id: 'support' as SettingsSection,
      title: 'Soporte y Ayuda',
      icon: HelpCircle,
      description: 'Centro de ayuda y contacto'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection user={user} updateProfile={updateProfile} />;
      case 'preferences':
        return <PreferencesSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'roles':
        return <RolesSection user={user} />;
      case 'privacy':
        return <PrivacySection />;
      case 'connections':
        return <ConnectionsSection />;
      case 'support':
        return <SupportSection />;
      default:
        return <PersonalInfoSection user={user} updateProfile={updateProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 animated-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="mb-8 text-center lg:text-left section-enter">
          <div className="relative">
            <h1 className="text-4xl lg:text-5xl font-bold animated-text-gradient mb-3">
              Configuración de Cuenta
            </h1>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 floating-particle"></div>
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-30 floating-particle" style={{animationDelay: '2s'}}></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0 section-enter-delay-1">
            Personaliza tu experiencia turística y gestiona tu información de manera segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación mejorado */}
          <div className="lg:col-span-1 section-enter-delay-2">
            <div className="glass-effect rounded-2xl custom-shadow-xl p-6 sticky top-8 card-hover-effect">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Configuraciones
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>

              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`group w-full text-left px-4 py-4 rounded-xl smooth-transition flex items-center space-x-3 relative overflow-hidden ripple-effect ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white custom-shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:transform hover:scale-102'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90 rounded-xl"></div>
                      )}

                      <div className={`relative z-10 p-2 rounded-lg ${
                        isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white/50'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                      </div>

                      <div className="flex-1 relative z-10">
                        <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {section.title}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                          {section.description}
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 relative z-10 transform transition-transform group-hover:translate-x-1 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenido principal mejorado */}
          <div className="lg:col-span-3 section-enter-delay-3">
            <div className="glass-effect rounded-2xl custom-shadow-xl overflow-hidden card-hover-effect">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 shimmer-button"></div>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para información personal
function PersonalInfoSection({ user, updateProfile }: any) {
  const [formData, setFormData] = useState({
    firstName: user?.person?.firstName || '',
    lastName: user?.person?.lastName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phoneNumber: user?.person?.phoneNumber || '',
    language: user?.language || 'es',
    profilePhoto: user?.profilePhoto || null
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="p-8">
      <div className="border-b border-gradient-to-r from-blue-100 to-purple-100 pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Información Personal
            </h2>
            <p className="text-gray-600 mt-1">Gestiona tu perfil y datos de contacto de manera segura</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Foto de perfil */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-600" />
            Foto de Perfil
          </h3>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                <img
                  src={formData.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-4">
                  Sube una foto de perfil para personalizar tu cuenta. Recomendamos una imagen cuadrada de al menos 200x200px.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 smooth-transition custom-shadow-lg hover:shadow-xl scale-effect shimmer-button ripple-effect"
                >
                  <Camera className="w-4 h-4" />
                  <span>Cambiar Foto</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                placeholder="Tu nombre"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                placeholder="Tu apellido"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                placeholder="@nombreusuario"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idioma Preferido
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>
          <div className="mt-6 group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              placeholder="Cuéntanos un poco sobre ti, tus intereses turísticos y qué te gusta hacer..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-2">
              {formData.bio.length}/500 caracteres
            </div>
          </div>
        </div>

        {/* Datos de contacto */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Datos de Contacto
          </h3>
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Correo Electrónico
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                  placeholder="tu@email.com"
                />
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-200">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verificado</span>
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Número de Teléfono
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                  placeholder="+57 300 123 4567"
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                >
                  Verificar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad</h3>
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium">Cambiar Contraseña</div>
                    <div className="text-sm text-gray-500">Última actualización hace 30 días</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              {showChangePassword && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Contraseña actual"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Nueva contraseña"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Cambiar Contraseña
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">Autenticación en Dos Pasos (2FA)</div>
                  <div className="text-sm text-gray-500">Añade una capa extra de seguridad</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Dispositivos Activos</div>
                <button className="text-blue-600 text-sm hover:text-blue-700">
                  Ver todos
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">iPhone 14 Pro</div>
                      <div className="text-xs text-gray-500">Actual • Bogotá, Colombia</div>
                    </div>
                  </div>
                  <button className="text-red-600 text-xs hover:text-red-700">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gradient-to-r from-gray-200 to-gray-100">
          <button
            type="button"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 smooth-transition custom-shadow-lg hover:shadow-xl scale-effect flex items-center justify-center space-x-2 font-medium shimmer-button ripple-effect"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente para preferencias de experiencia
function PreferencesSection() {
  const [preferences, setPreferences] = useState({
    region: 'huila',
    interests: ['aventura', 'gastronomia', 'naturaleza'],
    language: 'es',
    notifications: {
      push: true,
      email: true,
      sms: false,
      promotions: true,
      bookingReminders: true,
      localNews: false,
      routeSuggestions: true
    },
    accessibility: {
      fontSize: 'medium',
      theme: 'light',
      highContrast: false,
      screenReader: false
    }
  });

  const regions = [
    { value: 'huila', label: 'Huila' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'caribe', label: 'Caribe' },
    { value: 'pacifico', label: 'Pacífico' },
    { value: 'amazonia', label: 'Amazonía' },
    { value: 'andes', label: 'Andes' }
  ];

  const tourismInterests = [
    { value: 'aventura', label: 'Aventura', icon: '🏃‍♂️' },
    { value: 'gastronomia', label: 'Gastronomía', icon: '🍽️' },
    { value: 'historia', label: 'Historia', icon: '🏛️' },
    { value: 'naturaleza', label: 'Naturaleza', icon: '🌿' },
    { value: 'cultural', label: 'Cultural', icon: '🎭' },
    { value: 'relax', label: 'Relajación', icon: '🧘‍♀️' },
    { value: 'deportes', label: 'Deportes', icon: '⚽' },
    { value: 'fotografia', label: 'Fotografía', icon: '📸' }
  ];

  return (
    <div className="p-8">
      <div className="border-b border-gradient-to-r from-blue-100 to-purple-100 pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Preferencias de Experiencia
            </h2>
            <p className="text-gray-600 mt-1">Personaliza tu experiencia turística y notificaciones</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Ubicación y turismo */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Ubicación y Turismo
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región de Interés Principal
              </label>
              <select
                value={preferences.region}
                onChange={(e) => setPreferences({...preferences, region: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Intereses Turísticos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tourismInterests.map(interest => (
                  <label
                    key={interest.value}
                    className={`group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      preferences.interests.includes(interest.value)
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={preferences.interests.includes(interest.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            interests: [...preferences.interests, interest.value]
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            interests: preferences.interests.filter(i => i !== interest.value)
                          });
                        }
                      }}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3 transform group-hover:scale-110 transition-transform duration-300">
                      {interest.icon}
                    </span>
                    <span className="text-sm font-semibold">{interest.label}</span>
                    {preferences.interests.includes(interest.value) && (
                      <Check className="w-4 h-4 ml-auto text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notificaciones
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Push</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        push: !preferences.notifications.push
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Notificaciones en el dispositivo</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Email</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        email: !preferences.notifications.email
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Notificaciones por correo</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">SMS</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        sms: !preferences.notifications.sms
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Mensajes de texto</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3">Tipos de Notificaciones</h4>
              <div className="space-y-3">
                {[
                  { key: 'promotions', label: 'Promociones y ofertas especiales' },
                  { key: 'bookingReminders', label: 'Recordatorios de reservas' },
                  { key: 'localNews', label: 'Noticias locales de turismo' },
                  { key: 'routeSuggestions', label: 'Sugerencias de rutas personalizadas' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          [item.key]: !preferences.notifications[item.key as keyof typeof preferences.notifications]
                        }
                      })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        preferences.notifications[item.key as keyof typeof preferences.notifications] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          preferences.notifications[item.key as keyof typeof preferences.notifications] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accesibilidad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Accesibilidad
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de Letra
                </label>
                <select
                  value={preferences.accessibility.fontSize}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    accessibility: {
                      ...preferences.accessibility,
                      fontSize: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                  <option value="extra-large">Extra Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={preferences.accessibility.theme}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    accessibility: {
                      ...preferences.accessibility,
                      theme: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Alto Contraste</div>
                    <div className="text-sm text-gray-500">Mejora la legibilidad del texto</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({
                    ...preferences,
                    accessibility: {
                      ...preferences.accessibility,
                      highContrast: !preferences.accessibility.highContrast
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.accessibility.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Lector de Pantalla</div>
                    <div className="text-sm text-gray-500">Compatibilidad mejorada</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({
                    ...preferences,
                    accessibility: {
                      ...preferences.accessibility,
                      screenReader: !preferences.accessibility.screenReader
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.accessibility.screenReader ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.accessibility.screenReader ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gradient-to-r from-gray-200 to-gray-100">
          <button
            type="button"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 font-medium"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para pagos y reservas
function PaymentsSection() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ****1234',
      isDefault: true,
      expiryDate: '12/25'
    },
    {
      id: 2,
      type: 'nequi',
      name: 'Nequi - 300 123 4567',
      isDefault: false
    }
  ]);

  const [currency, setCurrency] = useState('COP');
  const [billingInfo, setBillingInfo] = useState({
    name: 'Juan Pérez',
    nit: '',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    country: 'Colombia'
  });

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pagos y Reservas</h2>
        <p className="text-gray-600 mt-1">Gestiona tus métodos de pago y configuración de facturación</p>
      </div>

      <div className="space-y-8">
        {/* Métodos de pago */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Métodos de Pago
            </h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Agregar Método
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-8 rounded flex items-center justify-center ${
                    method.type === 'card' ? 'bg-blue-100' :
                    method.type === 'nequi' ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    {method.type === 'card' && <CardIcon className="w-5 h-5 text-blue-600" />}
                    {method.type === 'nequi' && <span className="text-purple-600 font-bold text-xs">N</span>}
                    {method.type === 'daviplata' && <span className="text-green-600 font-bold text-xs">D</span>}
                  </div>
                  <div>
                    <div className="font-medium">{method.name}</div>
                    {method.expiryDate && (
                      <div className="text-sm text-gray-500">Expira: {method.expiryDate}</div>
                    )}
                    {method.isDefault && (
                      <div className="text-sm text-blue-600">Método por defecto</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button className="text-blue-600 text-sm hover:text-blue-700">
                      Predeterminado
                    </button>
                  )}
                  <button className="text-red-600 text-sm hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Pagos Seguros</span>
            </div>
            <p className="text-sm text-blue-700">
              Aceptamos tarjetas de crédito/débito, Nequi, Daviplata y PSE.
              Todos los pagos están protegidos con encriptación de 256 bits.
            </p>
          </div>
        </div>

        {/* Configuración de facturación */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Información de Facturación
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre o Razón Social
                </label>
                <input
                  type="text"
                  value={billingInfo.name}
                  onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIT/CC (Opcional)
                </label>
                <input
                  type="text"
                  value={billingInfo.nit}
                  onChange={(e) => setBillingInfo({...billingInfo, nit: e.target.value})}
                  placeholder="123456789-0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={billingInfo.address}
                onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={billingInfo.city}
                  onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País
                </label>
                <select
                  value={billingInfo.country}
                  onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Colombia">Colombia</option>
                  <option value="México">México</option>
                  <option value="Argentina">Argentina</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Moneda preferida */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Moneda Preferida</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
              { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
              { code: 'EUR', name: 'Euro', symbol: '€' }
            ].map(curr => (
              <label
                key={curr.code}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  currency === curr.code
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value={curr.code}
                  checked={currency === curr.code}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{curr.symbol}</span>
                  <div>
                    <div className="font-medium">{curr.code}</div>
                    <div className="text-sm text-gray-500">{curr.name}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Historial de reservas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Historial de Reservas</h3>
            <button className="text-blue-600 hover:text-blue-700">
              Ver todo
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 1,
                destination: 'Parque Arqueológico San Agustín',
                date: '2024-01-15',
                amount: '$250.000',
                status: 'completed'
              },
              {
                id: 2,
                destination: 'Desierto de la Tatacoa',
                date: '2024-02-20',
                amount: '$180.000',
                status: 'completed'
              },
              {
                id: 3,
                destination: 'Termales de Rivera',
                date: '2024-03-10',
                amount: '$120.000',
                status: 'cancelled'
              }
            ].map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">{booking.destination}</div>
                  <div className="text-sm text-gray-500">{booking.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{booking.amount}</div>
                  <div className={`text-sm ${
                    booking.status === 'completed' ? 'text-green-600' :
                    booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {booking.status === 'completed' ? 'Completado' :
                     booking.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para roles y permisos
function RolesSection({ user }: any) {
  const [currentRole, setCurrentRole] = useState(user?.role || 'tourist');
  const [requestedRole, setRequestedRole] = useState('');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [postVisibility, setPostVisibility] = useState('public');

  const roles = [
    {
      id: 'tourist',
      name: 'Turista',
      description: 'Explora destinos y realiza reservas',
      icon: '🧳',
      permissions: ['Ver destinos', 'Hacer reservas', 'Escribir reseñas', 'Ver perfiles públicos']
    },
    {
      id: 'provider',
      name: 'Proveedor de Servicios',
      description: 'Ofrece servicios turísticos',
      icon: '🏢',
      permissions: ['Gestionar servicios', 'Ver estadísticas', 'Responder reseñas', 'Crear ofertas']
    },
    {
      id: 'guide',
      name: 'Guía Turístico',
      description: 'Guía certificado para tours',
      icon: '👨‍🏫',
      permissions: ['Crear tours', 'Gestionar grupos', 'Certificaciones', 'Horarios flexibles']
    },
    {
      id: 'vendor',
      name: 'Vendedor de Productos',
      description: 'Vende productos locales y artesanías',
      icon: '🛍️',
      permissions: ['Gestionar inventario', 'Procesar pagos', 'Envío de productos', 'Catálogo online']
    }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Público', description: 'Visible para todos los usuarios' },
    { value: 'friends', label: 'Solo Contactos', description: 'Solo visible para tus contactos' },
    { value: 'private', label: 'Privado', description: 'Solo visible para ti' }
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Roles y Permisos</h2>
        <p className="text-gray-600 mt-1">Gestiona tu rol y configuración de visibilidad</p>
      </div>

      <div className="space-y-8">
        {/* Rol actual */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Rol Actual
          </h3>

          <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">
                {roles.find(r => r.id === currentRole)?.icon}
              </span>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-blue-900">
                  {roles.find(r => r.id === currentRole)?.name}
                </h4>
                <p className="text-blue-700 mb-3">
                  {roles.find(r => r.id === currentRole)?.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {roles.find(r => r.id === currentRole)?.permissions.map(permission => (
                    <span
                      key={permission}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solicitar cambio de rol */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitar Cambio de Rol</h3>

          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Quieres cambiar tu rol? Selecciona el rol que te gustaría tener y enviaremos tu solicitud para revisión.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.filter(role => role.id !== currentRole).map(role => (
                <label
                  key={role.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    requestedRole === role.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="requestedRole"
                    value={role.id}
                    checked={requestedRole === role.id}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{role.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map(permission => (
                          <span
                            key={permission}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{role.permissions.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {requestedRole && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Proceso de Verificación</span>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Para cambiar a {roles.find(r => r.id === requestedRole)?.name}, necesitaremos verificar:
                </p>
                <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                  {requestedRole === 'provider' && (
                    <>
                      <li>Registro mercantil o cédula de ciudadanía</li>
                      <li>Certificación en turismo (opcional)</li>
                      <li>Referencias comerciales</li>
                    </>
                  )}
                  {requestedRole === 'guide' && (
                    <>
                      <li>Licencia de guía turístico</li>
                      <li>Certificación SENA o entidad autorizada</li>
                      <li>Experiencia comprobable</li>
                    </>
                  )}
                  {requestedRole === 'vendor' && (
                    <>
                      <li>Registro de actividad comercial</li>
                      <li>Portafolio de productos</li>
                      <li>Documentación fiscal</li>
                    </>
                  )}
                </ul>
                <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm">
                  Enviar Solicitud
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configuración de visibilidad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Configuración de Visibilidad
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Visibilidad del Perfil</h4>
              <div className="space-y-3">
                {visibilityOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      profileVisibility === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={option.value}
                      checked={profileVisibility === option.value}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    {profileVisibility === option.value && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Visibilidad de Publicaciones</h4>
              <div className="space-y-3">
                {visibilityOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      postVisibility === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postVisibility"
                      value={option.value}
                      checked={postVisibility === option.value}
                      onChange={(e) => setPostVisibility(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    {postVisibility === option.value && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">Control de Mensajes</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Permitir mensajes de cualquier usuario</div>
                    <div className="text-sm text-gray-500">Los usuarios pueden enviarte mensajes directos</div>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Solicitudes de contacto</div>
                    <div className="text-sm text-gray-500">Requiere aprobación para nuevos contactos</div>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para privacidad y seguridad
function PrivacySection() {
  const [dataSettings, setDataSettings] = useState({
    allowDataCollection: true,
    allowAnalytics: false,
    allowMarketing: false,
    allowThirdParty: false
  });

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Privacidad y Seguridad</h2>
        <p className="text-gray-600 mt-1">Controla tus datos personales y configuración de privacidad</p>
      </div>

      <div className="space-y-8">
        {/* Control de datos */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Control de Datos Personales
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <Download className="w-6 h-6 text-blue-600 mb-2" />
                <div className="font-medium text-blue-900">Descargar mis Datos</div>
                <div className="text-sm text-blue-700">Obtén una copia de toda tu información</div>
              </button>

              <button className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
                <Trash2 className="w-6 h-6 text-red-600 mb-2" />
                <div className="font-medium text-red-900">Eliminar mi Cuenta</div>
                <div className="text-sm text-red-700">Borrar permanentemente todos los datos</div>
              </button>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">Configuración de Recopilación de Datos</h4>
              <div className="space-y-3">
                {[
                  {
                    key: 'allowDataCollection',
                    title: 'Recopilación básica de datos',
                    description: 'Necesario para el funcionamiento de la app'
                  },
                  {
                    key: 'allowAnalytics',
                    title: 'Análisis y métricas',
                    description: 'Ayuda a mejorar la experiencia del usuario'
                  },
                  {
                    key: 'allowMarketing',
                    title: 'Marketing personalizado',
                    description: 'Recibir ofertas y contenido personalizado'
                  },
                  {
                    key: 'allowThirdParty',
                    title: 'Compartir con terceros',
                    description: 'Compartir datos con socios comerciales'
                  }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDataSettings({
                        ...dataSettings,
                        [item.key]: !dataSettings[item.key as keyof typeof dataSettings]
                      })}
                      disabled={item.key === 'allowDataCollection'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        dataSettings[item.key as keyof typeof dataSettings] ? 'bg-blue-600' : 'bg-gray-200'
                      } ${item.key === 'allowDataCollection' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          dataSettings[item.key as keyof typeof dataSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de actividad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividad</h3>

          <div className="space-y-3">
            {[
              {
                action: 'Inicio de sesión',
                device: 'iPhone 14 Pro',
                location: 'Bogotá, Colombia',
                time: 'Hace 2 horas',
                ip: '192.168.1.1'
              },
              {
                action: 'Cambio de contraseña',
                device: 'MacBook Pro',
                location: 'Bogotá, Colombia',
                time: 'Hace 3 días',
                ip: '192.168.1.2'
              },
              {
                action: 'Inicio de sesión',
                device: 'Android Samsung',
                location: 'Medellín, Colombia',
                time: 'Hace 1 semana',
                ip: '10.0.0.1'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-500">
                      {activity.device} • {activity.location}
                    </div>
                    <div className="text-xs text-gray-400">IP: {activity.ip}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>

          <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm">
            Ver historial completo
          </button>
        </div>

        {/* Información legal */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Legal</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium">Política de Privacidad</div>
              <div className="text-sm text-gray-500">Última actualización: 15 de enero, 2024</div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium">Términos y Condiciones</div>
              <div className="text-sm text-gray-500">Última actualización: 15 de enero, 2024</div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium">Política de Cookies</div>
              <div className="text-sm text-gray-500">Información sobre el uso de cookies</div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Shield className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium">Habeas Data</div>
              <div className="text-sm text-gray-500">Derechos sobre datos personales</div>
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para conexiones externas
function ConnectionsSection() {
  const [connections, setConnections] = useState({
    google: { connected: true, email: 'usuario@gmail.com' },
    facebook: { connected: false, email: null },
    instagram: { connected: true, username: '@usuario' },
    googleCalendar: { connected: false },
    outlook: { connected: false },
    googleMaps: { connected: true },
    waze: { connected: false }
  });

  const socialConnections = [
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      description: 'Iniciar sesión con Google',
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      description: 'Conectar con Facebook',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'Compartir en Instagram',
      color: 'bg-pink-50 border-pink-200 text-pink-700'
    }
  ];

  const appConnections = [
    {
      id: 'googleCalendar',
      name: 'Google Calendar',
      icon: '📅',
      description: 'Sincronizar reservas con tu calendario',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: '📧',
      description: 'Integrar con Outlook Calendar',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'googleMaps',
      name: 'Google Maps',
      icon: '🗺️',
      description: 'Navegación y rutas automáticas',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'waze',
      name: 'Waze',
      icon: '🚗',
      description: 'Navegación con tráfico en tiempo real',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ];

  const toggleConnection = (connectionId: string) => {
    setConnections(prev => ({
      ...prev,
      [connectionId]: {
        ...prev[connectionId as keyof typeof prev],
        connected: !prev[connectionId as keyof typeof prev].connected
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Conexiones Externas</h2>
        <p className="text-gray-600 mt-1">Conecta con redes sociales y aplicaciones externas</p>
      </div>

      <div className="space-y-8">
        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Redes Sociales
          </h3>

          <div className="space-y-4">
            {socialConnections.map(social => {
              const isConnected = connections[social.id as keyof typeof connections].connected;
              const connectionData = connections[social.id as keyof typeof connections];

              return (
                <div key={social.id} className={`p-4 border rounded-lg ${social.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{social.icon}</span>
                      <div>
                        <div className="font-medium">{social.name}</div>
                        <div className="text-sm opacity-70">{social.description}</div>
                        {isConnected && connectionData.email && (
                          <div className="text-xs opacity-60">Conectado: {connectionData.email}</div>
                        )}
                        {isConnected && connectionData.username && (
                          <div className="text-xs opacity-60">Conectado: {connectionData.username}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConnection(social.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isConnected
                          ? 'bg-white bg-opacity-70 hover:bg-opacity-100'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Unlink className="w-4 h-4" />
                          <span>Desconectar</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          <span>Conectar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integraciones de aplicaciones */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Integraciones de Aplicaciones
          </h3>

          <div className="space-y-4">
            {appConnections.map(app => {
              const isConnected = connections[app.id as keyof typeof connections].connected;

              return (
                <div key={app.id} className={`p-4 border rounded-lg ${app.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm opacity-70">{app.description}</div>
                        {isConnected && (
                          <div className="text-xs opacity-60 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Conectado y sincronizando</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConnection(app.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isConnected
                          ? 'bg-white bg-opacity-70 hover:bg-opacity-100'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Unlink className="w-4 h-4" />
                          <span>Desconectar</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          <span>Conectar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuración de sincronización */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Sincronización</h3>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sincronización automática</div>
                  <div className="text-sm text-gray-500">
                    Sincronizar reservas y eventos automáticamente
                  </div>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificaciones de sincronización</div>
                  <div className="text-sm text-gray-500">
                    Recibir notificaciones cuando se sincronicen datos
                  </div>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Compartir ubicación</div>
                  <div className="text-sm text-gray-500">
                    Permitir que las apps de mapas accedan a tu ubicación
                  </div>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para soporte y ayuda
function SupportSection() {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqs = [
    {
      question: "¿Cómo cambio mi método de pago?",
      answer: "Puedes cambiar tu método de pago en la sección 'Pagos y Reservas' de tu configuración de cuenta. Haz clic en 'Agregar Método' para añadir uno nuevo o gestiona los existentes."
    },
    {
      question: "¿Cómo cancelo una reserva?",
      answer: "Para cancelar una reserva, ve a tu perfil > Mis Reservas, encuentra la reserva que deseas cancelar y haz clic en 'Cancelar'. Ten en cuenta las políticas de cancelación del proveedor."
    },
    {
      question: "¿Cómo me convierto en proveedor de servicios?",
      answer: "En la sección 'Roles y Permisos', puedes solicitar un cambio de rol a 'Proveedor de Servicios'. Necesitarás proporcionar documentación de verificación que será revisada por nuestro equipo."
    },
    {
      question: "¿Mi información personal está segura?",
      answer: "Sí, utilizamos encriptación de 256 bits y cumplimos con todas las regulaciones de protección de datos. Puedes revisar nuestra política de privacidad para más detalles."
    },
    {
      question: "¿Cómo funciona el sistema de reseñas?",
      answer: "Después de completar una reserva, puedes dejar una reseña calificando del 1 al 5 estrellas y escribiendo comentarios. Las reseñas son públicas y ayudan a otros usuarios a tomar decisiones."
    }
  ];

  const supportCategories = [
    { value: 'account', label: 'Cuenta y Perfil' },
    { value: 'bookings', label: 'Reservas y Pagos' },
    { value: 'technical', label: 'Problemas Técnicos' },
    { value: 'providers', label: 'Proveedores de Servicios' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Soporte y Ayuda</h2>
        <p className="text-gray-600 mt-1">Encuentra respuestas o contacta con nuestro equipo de soporte</p>
      </div>

      <div className="space-y-8">
        {/* Preguntas frecuentes */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Preguntas Frecuentes
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      selectedFAQ === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {selectedFAQ === index && (
                  <div className="px-4 pb-3 text-gray-600 border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Centro de soporte */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Centro de Soporte
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium text-blue-900">Chat en Vivo</div>
              <div className="text-sm text-blue-700">Disponible 24/7</div>
            </button>

            <button className="p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <Mail className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-medium text-green-900">Email</div>
              <div className="text-sm text-green-700">soporte@wildtour.com</div>
            </button>

            <button className="p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <Phone className="w-6 h-6 text-orange-600 mb-2" />
              <div className="font-medium text-orange-900">Teléfono</div>
              <div className="text-sm text-orange-700">+57 1 234 5678</div>
            </button>
          </div>

          {/* Formulario de contacto */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-4">Enviar Solicitud de Soporte</h4>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {supportCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm({...supportForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                  placeholder="Describe brevemente tu problema"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                  rows={4}
                  placeholder="Describe tu problema en detalle..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enlaces Útiles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Guía de Usuario</div>
                  <div className="text-sm text-gray-500">Manual completo de la aplicación</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Términos y Condiciones</div>
                  <div className="text-sm text-gray-500">Revisa nuestros términos de uso</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Política de Privacidad</div>
                  <div className="text-sm text-gray-500">Cómo protegemos tus datos</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Comunidad</div>
                  <div className="text-sm text-gray-500">Únete a nuestro foro de usuarios</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estado del sistema */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Sistema</h3>

          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-green-900">Todos los sistemas operativos</div>
                <div className="text-sm text-green-700">Última actualización: hace 2 minutos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}