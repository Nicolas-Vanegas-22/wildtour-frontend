import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  Camera,
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  Download
} from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/utils/cn';
import { useToast } from '../hooks/useToast';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  address?: {
    street?: string;
    city?: string;
    department?: string;
    country?: string;
    postalCode?: string;
  };
  preferences?: {
    language: 'es' | 'en';
    currency: 'COP' | 'USD';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profilePublic: boolean;
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data del usuario
const mockUserProfile: UserProfile = {
  id: 'user1',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@email.com',
  phone: '+57 300 123 4567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  nationality: 'colombian',
  address: {
    street: 'Calle 123 #45-67',
    city: 'Bogotá',
    department: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111'
  },
  preferences: {
    language: 'es',
    currency: 'COP',
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    privacy: {
      profilePublic: false,
      showEmail: false,
      showPhone: false
    }
  },
  emergencyContact: {
    name: 'María González',
    phone: '+57 300 765 4321',
    relationship: 'Esposa'
  },
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-01-10T14:20:00Z'
};

type TabType = 'profile' | 'security' | 'notifications' | 'privacy' | 'emergency';

export default function UserSettings() {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    {
      id: 'profile' as TabType,
      name: 'Perfil',
      icon: User,
      description: 'Información personal y datos básicos'
    },
    {
      id: 'security' as TabType,
      name: 'Seguridad',
      icon: Shield,
      description: 'Contraseña y configuración de seguridad'
    },
    {
      id: 'notifications' as TabType,
      name: 'Notificaciones',
      icon: Bell,
      description: 'Preferencias de comunicación'
    },
    {
      id: 'privacy' as TabType,
      name: 'Privacidad',
      icon: Lock,
      description: 'Control de visibilidad de información'
    },
    {
      id: 'emergency' as TabType,
      name: 'Contacto de Emergencia',
      icon: Phone,
      description: 'Información de contacto en caso de emergencia'
    }
  ];

  useEffect(() => {
    // Detectar cambios no guardados
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(mockUserProfile);
    setUnsavedChanges(hasChanges);
  }, [profile]);

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserProfile],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aquí se enviaría la información al servidor
      console.log('Saving profile changes:', profile);

      showToast('Información actualizada exitosamente', 'success');
      setUnsavedChanges(false);
    } catch (error) {
      showToast('Error al actualizar la información', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast('Contraseña actualizada exitosamente', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error) {
      showToast('Error al cambiar la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'Esta acción eliminará permanentemente todos tus datos, reservas e información personal. ¿Continuar?'
      );

      if (doubleConfirmed) {
        setLoading(true);
        try {
          // Simular API call
          await new Promise(resolve => setTimeout(resolve, 2000));

          showToast('Cuenta eliminada exitosamente', 'success');
          // Logout y redirección
        } catch (error) {
          showToast('Error al eliminar la cuenta', 'error');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profile.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Foto de perfil</h3>
          <p className="text-gray-600 text-sm">JPG, GIF o PNG. Máximo 1MB.</p>
          <div className="flex space-x-2 mt-2">
            <Button variant="outline" size="sm">
              Cambiar foto
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género
          </label>
          <select
            value={profile.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccionar</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
            <option value="prefer_not_to_say">Prefiero no decir</option>
          </select>
        </div>
      </div>

      {/* Dirección */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Dirección</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={profile.address?.street || ''}
              onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={profile.address?.city || ''}
              onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <input
              type="text"
              value={profile.address?.department || ''}
              onChange={(e) => handleNestedInputChange('address', 'department', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <input
              type="text"
              value={profile.address?.country || ''}
              onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código postal
            </label>
            <input
              type="text"
              value={profile.address?.postalCode || ''}
              onChange={(e) => handleNestedInputChange('address', 'postalCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Cambio de contraseña */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contraseña</h3>
            <p className="text-gray-600">Última actualización: Hace 30 días</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            <Lock className="w-4 h-4 mr-2" />
            Cambiar contraseña
          </Button>
        </div>

        {showPasswordChange && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handlePasswordChange}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres con mayúsculas, minúsculas y números
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Autenticación de dos factores */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Autenticación de dos factores</h3>
            <p className="text-gray-600">Agrega una capa extra de seguridad a tu cuenta</p>
          </div>
          <Button variant="outline" disabled>
            <Shield className="w-4 h-4 mr-2" />
            Activar 2FA
          </Button>
        </div>
      </div>

      {/* Sesiones activas */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sesiones activas</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Navegador actual</p>
              <p className="text-sm text-gray-600">Chrome en Windows • Bogotá, Colombia</p>
              <p className="text-xs text-gray-500">Última actividad: Ahora</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Actual
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Aplicación móvil</p>
              <p className="text-sm text-gray-600">iPhone • Bogotá, Colombia</p>
              <p className="text-xs text-gray-500">Última actividad: Hace 2 horas</p>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de notificaciones</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones por email</h4>
              <p className="text-sm text-gray-600">Recibe confirmaciones y actualizaciones por correo</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notifications.email}
              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                ...profile.preferences?.notifications,
                email: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones SMS</h4>
              <p className="text-sm text-gray-600">Recibe recordatorios importantes por mensaje de texto</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notifications.sms}
              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                ...profile.preferences?.notifications,
                sms: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones push</h4>
              <p className="text-sm text-gray-600">Recibe notificaciones en tiempo real en tu dispositivo</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notifications.push}
              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                ...profile.preferences?.notifications,
                push: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing y promociones</h4>
              <p className="text-sm text-gray-600">Recibe ofertas especiales y noticias de productos</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.notifications.marketing}
              onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                ...profile.preferences?.notifications,
                marketing: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Configuración de idioma y moneda */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias regionales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={profile.preferences?.language}
              onChange={(e) => handleNestedInputChange('preferences', 'language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <select
              value={profile.preferences?.currency}
              onChange={(e) => handleNestedInputChange('preferences', 'currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="COP">Peso Colombiano (COP)</option>
              <option value="USD">Dólar Americano (USD)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de privacidad</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Perfil público</h4>
              <p className="text-sm text-gray-600">Permite que otros usuarios vean tu perfil básico</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.privacy.profilePublic}
              onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                ...profile.preferences?.privacy,
                profilePublic: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Mostrar email en perfil</h4>
              <p className="text-sm text-gray-600">Permite que otros usuarios vean tu dirección de correo</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.privacy.showEmail}
              onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                ...profile.preferences?.privacy,
                showEmail: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Mostrar teléfono en perfil</h4>
              <p className="text-sm text-gray-600">Permite que otros usuarios vean tu número de teléfono</p>
            </div>
            <input
              type="checkbox"
              checked={profile.preferences?.privacy.showPhone}
              onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                ...profile.preferences?.privacy,
                showPhone: e.target.checked
              })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Descarga de datos */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Descargar mis datos</h3>
            <p className="text-gray-600">Obtén una copia de toda tu información personal</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Descargar datos
          </Button>
        </div>
      </div>

      {/* Eliminar cuenta */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">Zona de peligro</h3>
            <p className="text-red-700 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor ten cuidado.
            </p>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="border-red-300 text-red-700 hover:bg-red-100"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar mi cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto de emergencia</h3>
        <p className="text-gray-600 mb-6">
          Esta información será utilizada para contactar a alguien en caso de emergencia durante tus viajes.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={profile.emergencyContact?.name || ''}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Nombre del contacto de emergencia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={profile.emergencyContact?.phone || ''}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Número de teléfono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relación
            </label>
            <select
              value={profile.emergencyContact?.relationship || ''}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar relación</option>
              <option value="spouse">Esposo/a</option>
              <option value="parent">Padre/Madre</option>
              <option value="child">Hijo/a</option>
              <option value="sibling">Hermano/a</option>
              <option value="friend">Amigo/a</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'emergency':
        return renderEmergencyTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Configuración de cuenta
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <nav className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-4 sticky top-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300',
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{tab.name}</div>
                        <div className={cn(
                          'text-xs',
                          isActive ? 'text-primary-100' : 'text-gray-500'
                        )}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8">
              {renderContent()}

              {/* Botones de acción */}
              {unsavedChanges && activeTab !== 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3"
                >
                  <Button
                    variant="outline"
                    onClick={() => setProfile(mockUserProfile)}
                  >
                    Cancelar cambios
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}