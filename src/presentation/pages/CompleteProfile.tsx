import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  CreditCard,
  Shield,
  Globe,
  Camera,
  Settings,
  Edit3,
  Save,
  X,
  Star,
  Clock,
  Award,
  Eye,
  EyeOff,
  Bell,
  Smartphone,
  Lock,
  FileText,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { User as UserModel, PersonInfo, UserPreferences, PaymentMethod, BillingInfo } from '../../domain/models/User';
import { cn } from '../../shared/utils/cn';
import { Button } from '../../shared/ui/Button';

interface CompleteProfileProps {
  className?: string;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ className }) => {
  const { user, setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para cada sección del perfil
  const [personalInfo, setPersonalInfo] = useState<PersonInfo>({
    firstName: '',
    lastName: '',
    document: 0,
    phoneNumber: 0,
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    region: '',
    interests: [],
    language: 'es',
    notifications: {
      push: true,
      email: true,
      sms: false,
      promotions: true,
      bookingReminders: true,
      localNews: false,
      routeSuggestions: true,
    },
    accessibility: {
      fontSize: 'medium',
      theme: 'light',
      highContrast: false,
      screenReader: false,
    }
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    name: '',
    address: '',
    city: '',
    country: 'Colombia',
  });

  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  // Datos mock del usuario
  const mockUserData: UserModel = {
    id: '1',
    username: 'maria_viajera',
    email: 'maria@example.com',
    role: 'tourist',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-5?w=150&h=150&fit=crop&crop=face',
    bio: 'Apasionada por los viajes y la fotografía. Siempre en busca de nuevas aventuras y culturas por descubrir.',
    person: {
      firstName: 'María',
      lastName: 'González',
      document: 12345678,
      phoneNumber: 3001234567,
    },
    preferences: {
      region: 'Región Andina',
      interests: ['Aventura', 'Fotografía', 'Gastronomía', 'Naturaleza'],
      language: 'es',
      notifications: {
        push: true,
        email: true,
        sms: false,
        promotions: true,
        bookingReminders: true,
        localNews: false,
        routeSuggestions: true,
      },
      accessibility: {
        fontSize: 'medium',
        theme: 'light',
        highContrast: false,
        screenReader: false,
      }
    },
    paymentMethods: [
      {
        id: '1',
        type: 'card',
        name: '**** **** **** 1234',
        isDefault: true,
        expiryDate: '12/25'
      },
      {
        id: '2',
        type: 'nequi',
        name: 'Nequi - 300 123 4567',
        isDefault: false,
      }
    ],
    billingInfo: {
      name: 'María González',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      country: 'Colombia',
    },
    currency: 'COP',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  useEffect(() => {
    // Cargar datos del usuario
    if (mockUserData.person) {
      setPersonalInfo(mockUserData.person);
    }
    if (mockUserData.preferences) {
      setPreferences(mockUserData.preferences);
    }
    if (mockUserData.paymentMethods) {
      setPaymentMethods(mockUserData.paymentMethods);
    }
    if (mockUserData.billingInfo) {
      setBillingInfo(mockUserData.billingInfo);
    }
    setBio(mockUserData.bio || '');
    setProfilePhoto(mockUserData.profilePhoto || '');
  }, []);

  const availableInterests = [
    'Aventura', 'Naturaleza', 'Cultura', 'Gastronomía', 'Historia',
    'Arte', 'Fotografía', 'Deportes', 'Relajación', 'Astronomía',
    'Arqueología', 'Arquitectura', 'Música', 'Festivales', 'Playa'
  ];

  const colombianRegions = [
    'Región Andina', 'Región Caribe', 'Región Pacífica',
    'Región Orinoquía', 'Región Amazonía', 'Región Insular'
  ];

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'preferences', label: 'Preferencias', icon: Settings },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'accessibility', label: 'Accesibilidad', icon: Eye },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsEditing(false);
      // Mostrar mensaje de éxito
    } catch (error) {
      // Manejar error
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: 'Nueva tarjeta',
      isDefault: false,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className={cn('max-w-6xl mx-auto p-6', className)}>
      {/* Header del perfil */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.firstName + ' ' + personalInfo.lastName)}&size=120`}
              alt="Foto de perfil"
              className="w-30 h-30 rounded-full border-4 border-white/20 object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-white text-primary-600 rounded-full p-2 hover:bg-gray-100 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-white/90 mb-2">{mockUserData.email}</p>
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <span className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {mockUserData.isVerified ? 'Verificado' : 'Sin verificar'}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Miembro desde 2023
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {preferences.region}
              </span>
            </div>
          </div>

          <div className="text-right">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              size="sm"
              leftIcon={isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>
        </div>

        {bio && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-white/90">{bio}</p>
          </div>
        )}
      </div>

      {/* Navegación por tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 text-center',
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de las tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                <input
                  type="number"
                  value={personalInfo.document}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, document: Number(e.target.value) }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: Number(e.target.value) }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                placeholder="Cuéntanos sobre ti, tus intereses y experiencias de viaje..."
              />
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferencias de Viaje</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Región preferida</label>
                <select
                  value={preferences.region}
                  onChange={(e) => setPreferences(prev => ({ ...prev, region: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                >
                  <option value="">Selecciona una región</option>
                  {colombianRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Intereses de viaje</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => isEditing && toggleInterest(interest)}
                    disabled={!isEditing}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm transition-colors border',
                      preferences.interests.includes(interest)
                        ? 'bg-primary-100 text-primary-700 border-primary-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
                      !isEditing && 'cursor-default'
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
              <div className="space-y-3">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {key === 'push' && 'Notificaciones push'}
                      {key === 'email' && 'Notificaciones por email'}
                      {key === 'sms' && 'Notificaciones por SMS'}
                      {key === 'promotions' && 'Promociones y ofertas'}
                      {key === 'bookingReminders' && 'Recordatorios de reservas'}
                      {key === 'localNews' && 'Noticias locales'}
                      {key === 'routeSuggestions' && 'Sugerencias de rutas'}
                    </span>
                    <button
                      onClick={() => isEditing && setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: !value }
                      }))}
                      disabled={!isEditing}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        value ? 'bg-primary-600' : 'bg-gray-200',
                        !isEditing && 'cursor-default'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          value ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
              {isEditing && (
                <Button
                  onClick={addPaymentMethod}
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Agregar método
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        method.type === 'card' ? 'bg-blue-100 text-blue-600' :
                        method.type === 'nequi' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      )}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          {method.type === 'card' ? 'Tarjeta de crédito/débito' :
                           method.type === 'nequi' ? 'Nequi' :
                           method.type === 'daviplata' ? 'Daviplata' : 'PSE'}
                        </p>
                        {method.isDefault && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                            Método principal
                          </span>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de facturación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Privacidad</h2>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Visibilidad del perfil</h3>
                    <p className="text-sm text-gray-600">Controla quién puede ver tu información</p>
                  </div>
                  <Shield className="w-6 h-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      className="text-primary-600 focus:ring-primary-500"
                      disabled={!isEditing}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Público</p>
                      <p className="text-xs text-gray-600">Cualquiera puede ver tu perfil</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="private"
                      defaultChecked
                      className="text-primary-600 focus:ring-primary-500"
                      disabled={!isEditing}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Privado</p>
                      <p className="text-xs text-gray-600">Solo tú puedes ver tu información completa</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de datos</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                    Descargar mis datos
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                    Ver política de privacidad
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Accesibilidad</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de fuente</label>
                <select
                  value={preferences.accessibility.fontSize}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, fontSize: e.target.value as any }
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                  <option value="extra-large">Muy grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <select
                  value={preferences.accessibility.theme}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, theme: e.target.value as any }
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Alto contraste</span>
                  <button
                    onClick={() => isEditing && setPreferences(prev => ({
                      ...prev,
                      accessibility: { ...prev.accessibility, highContrast: !prev.accessibility.highContrast }
                    }))}
                    disabled={!isEditing}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      preferences.accessibility.highContrast ? 'bg-primary-600' : 'bg-gray-200',
                      !isEditing && 'cursor-default'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        preferences.accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Soporte para lector de pantalla</span>
                  <button
                    onClick={() => isEditing && setPreferences(prev => ({
                      ...prev,
                      accessibility: { ...prev.accessibility, screenReader: !prev.accessibility.screenReader }
                    }))}
                    disabled={!isEditing}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      preferences.accessibility.screenReader ? 'bg-primary-600' : 'bg-gray-200',
                      !isEditing && 'cursor-default'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        preferences.accessibility.screenReader ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              loading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;