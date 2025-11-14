import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Mountain, ArrowLeft, UserPlus, Badge, Building2 } from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { authApi } from '../../infrastructure/services/authApi';
import { rntApi } from '../../infrastructure/services/rntApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';
import RegisterResultModal from '../components/RegisterResultModal';

// Tipos de RNT según el Ministerio de Comercio, Industria y Turismo de Colombia
const RNT_TYPES = [
  { value: 'alojamiento_hotel', label: 'Hotel' },
  { value: 'alojamiento_hostel', label: 'Hostal' },
  { value: 'alojamiento_apartamento', label: 'Apartamento Turístico' },
  { value: 'alojamiento_camping', label: 'Camping / Glamping' },
  { value: 'alojamiento_casa_rural', label: 'Casa Rural / Finca' },
  { value: 'agencia_viajes', label: 'Agencia de Viajes' },
  { value: 'operador_turismo', label: 'Operador de Turismo' },
  { value: 'guia_turismo', label: 'Guía de Turismo' },
  { value: 'transporte_terrestre', label: 'Transporte Terrestre Automotor' },
  { value: 'transporte_aereo', label: 'Transporte Aéreo' },
  { value: 'transporte_maritimo', label: 'Transporte Marítimo' },
  { value: 'arrendador_vehiculos', label: 'Arrendador de Vehículos' },
  { value: 'operador_congresos', label: 'Operador de Congresos y Eventos' },
  { value: 'parque_tematico', label: 'Parque Temático' },
  { value: 'restaurante', label: 'Restaurante y Bar Turístico' },
  { value: 'empresa_navegacion', label: 'Empresa de Navegación Turística' },
  { value: 'plataforma_digital', label: 'Plataforma Electrónica de Servicios Turísticos' },
  { value: 'centro_buceo', label: 'Centro de Buceo' },
  { value: 'establecimiento_gastronomia', label: 'Establecimiento de Gastronomía' },
  { value: 'turismo_aventura', label: 'Operador de Turismo de Aventura' },
  { value: 'otro', label: 'Otro' }
];

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    document: '',
    phoneNumber: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'user' as 'user' | 'provider',
    businessName: '',
    rnt: '',
    rntType: '', // Nuevo campo para el tipo de RNT
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState({
    success: false,
    message: ''
  });

  // Estado simplificado para verificación RNT
  const [isVerifyingRNT, setIsVerifyingRNT] = useState(false);

  // Estado para validación de cédula
  const [documentValidation, setDocumentValidation] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message: string;
  }>({
    status: 'idle',
    message: ''
  });

  const { setAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Limpiar campos específicos de prestador cuando cambia a turista
  useEffect(() => {
    if (formData.role === 'user') {
      setFormData(prev => ({
        ...prev,
        businessName: '',
        rnt: '',
        rntType: ''
      }));
    }
  }, [formData.role]);

  // Validación de cédula con debounce - PARA TODOS LOS USUARIOS
  useEffect(() => {
    if (!formData.document || formData.document.length < 6) {
      setDocumentValidation({ status: 'idle', message: '' });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setDocumentValidation({ status: 'validating', message: 'Validando cédula...' });

      try {
        const result = await authApi.validateDocument(formData.document);

        if (result.isValid) {
          setDocumentValidation({
            status: 'valid',
            message: '✓ Cédula válida'
          });
        } else {
          setDocumentValidation({
            status: 'invalid',
            message: result.message || 'Cédula inválida'
          });
        }
      } catch (error) {
        setDocumentValidation({
          status: 'invalid',
          message: 'Error al validar la cédula'
        });
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Función para verificar el RNT (llamada internamente durante el registro)
  const verifyRNT = async (): Promise<{ isValid: boolean; message: string; details?: string }> => {
    try {
      const result = await rntApi.verifyRNT({
        rntNumber: formData.rnt,
        rntType: formData.rntType,
        businessName: formData.businessName
      });

      if (result.isValid && result.status === 'active') {
        return {
          isValid: true,
          message: 'RNT verificado correctamente',
          details: result.registeredName ? `Registrado como: ${result.registeredName}` : undefined
        };
      } else {
        return {
          isValid: false,
          message: result.message || 'El RNT no pudo ser verificado'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        message: 'Error al verificar el RNT. Por favor intenta nuevamente.'
      };
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (!formData.acceptTerms) {
      showToast('Debes aceptar los términos y condiciones', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Si es prestador, verificar RNT primero
      if (formData.role === 'provider') {
        setIsVerifyingRNT(true);
        const rntVerification = await verifyRNT();
        setIsVerifyingRNT(false);

        if (!rntVerification.isValid) {
          // Mostrar modal de error de verificación RNT
          setRegistrationResult({
            success: false,
            message: rntVerification.message
          });
          setShowResultModal(true);
          setIsLoading(false);
          return;
        }
      }

      // Transform role to roleId: 1 = Usuario, 2 = Prestador de Servicio
      const roleId = formData.role === 'provider' ? 2 : 1;

      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roleId: roleId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        document: formData.document,
        phoneNumber: formData.phoneNumber,
        ...(formData.role === 'provider' && {
          businessName: formData.businessName,
          rnt: formData.rnt,
          rntType: formData.rntType
        })
      };

      // 🔍 LOG 1: Mostrar el objeto completo que se envía al backend
      console.log('📤 Datos de registro que se envían al backend:');
      console.log(JSON.stringify(registerData, null, 2));
      console.log('RoleId:', registerData.roleId, '(1=Turista, 2=Prestador)');

      const response = await authApi.register(registerData);

      // 🔍 LOG 2: Mostrar la respuesta del backend con roleId y roleName
      console.log('📥 Respuesta del backend después del registro:');
      console.log('Usuario completo:', JSON.stringify(response.user, null, 2));
      console.log('Role:', response.user.role);
      console.log('Token recibido:', response.token ? '✅ Token presente' : '❌ Sin token');

      setAuth(response.token, response.user);

      // Mostrar modal de éxito
      setRegistrationResult({
        success: true,
        message: formData.role === 'provider'
          ? '¡Bienvenido! Tu cuenta de prestador ha sido creada exitosamente. Ahora podrás gestionar tus servicios turísticos.'
          : '¡Bienvenido a WildTour! Tu cuenta ha sido creada exitosamente. Comienza a explorar los mejores destinos de Colombia.'
      });
      setShowResultModal(true);
    } catch (error) {
      // Mostrar modal de error
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';
      setRegistrationResult({
        success: false,
        message: errorMessage
      });
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
      setIsVerifyingRNT(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Únete a la aventura
          </h1>
          <p className="text-neutral-600">
            Crea tu cuenta y descubre Colombia
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Tipo de cuenta */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                className={`p-4 rounded-xl border-2 transition-all text-neutral-800 ${
                  formData.role === 'user'
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <User className={`w-6 h-6 mx-auto mb-2 ${
                  formData.role === 'user' ? 'text-primary-600' : 'text-neutral-600'
                }`} />
                <span className="text-sm font-medium">Turista</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'provider' }))}
                className={`p-4 rounded-xl border-2 transition-all text-neutral-800 ${
                  formData.role === 'provider'
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <Mountain className={`w-6 h-6 mx-auto mb-2 ${
                  formData.role === 'provider' ? 'text-primary-600' : 'text-neutral-600'
                }`} />
                <span className="text-sm font-medium">Prestador</span>
              </button>
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="juan_perez"
                required
              />
            </div>
          </div>

          {/* Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombres
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Juan"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Apellidos
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
          </div>

          {/* Documento y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Documento (Cédula)
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    documentValidation.status === 'valid'
                      ? 'border-success-500 focus:ring-success-500'
                      : documentValidation.status === 'invalid'
                      ? 'border-error-500 focus:ring-error-500'
                      : 'border-neutral-200 focus:ring-primary-500'
                  }`}
                  placeholder="1234567890"
                  required
                />
                {/* Indicador de validación */}
                {documentValidation.status === 'validating' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                  </div>
                )}
                {documentValidation.status === 'valid' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {documentValidation.status === 'invalid' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-error-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Mensaje de validación */}
              {documentValidation.message && (
                <p className={`text-xs mt-1 ${
                  documentValidation.status === 'valid'
                    ? 'text-success-600'
                    : documentValidation.status === 'invalid'
                    ? 'text-error-600'
                    : 'text-neutral-500'
                }`}>
                  {documentValidation.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="3001234567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Campos adicionales para prestadores */}
          {formData.role === 'provider' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-neutral-200 pt-6"
            >
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-primary-800 font-medium">
                  📋 Información del Prestador de Servicios Turísticos
                </p>
                <p className="text-xs text-primary-700 mt-1">
                  Completa la información de tu registro RNT
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tipo de Prestador (Según RNT)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none z-10" />
                  <select
                    name="rntType"
                    value={formData.rntType}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer text-neutral-800"
                    required={formData.role === 'provider'}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="" className="text-neutral-400">Selecciona el tipo de prestador...</option>
                    {RNT_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="text-neutral-800">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Selecciona la categoría bajo la cual está registrado tu RNT
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre de la Empresa o Establecimiento
                </label>
                <div className="relative">
                  <Mountain className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Ej: Hotel Vista Hermosa, Tours Aventura Colombia"
                    required={formData.role === 'provider'}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Nombre comercial de tu empresa o establecimiento
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Número de RNT (Registro Nacional de Turismo)
                </label>
                <div className="relative">
                  <Badge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    name="rnt"
                    value={formData.rnt}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Ej: 12345"
                    required={formData.role === 'provider'}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Número de registro asignado por el Ministerio de Comercio, Industria y Turismo. Este será verificado automáticamente al crear la cuenta.
                </p>
              </div>
            </motion.div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula, un número y un carácter especial"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password !== formData.passwordConfirmation && formData.passwordConfirmation && (
              <p className="text-red-500 text-sm mt-2">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              required
            />
            <label className="text-sm text-neutral-600">
              Acepto los{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                términos y condiciones
              </button>{' '}
              y la{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                política de privacidad
              </button>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || formData.password !== formData.passwordConfirmation || !formData.acceptTerms}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              isVerifyingRNT ? 'Verificando RNT...' : 'Creando cuenta...'
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Modal de términos y condiciones */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setFormData(prev => ({ ...prev, acceptTerms: true }));
        }}
      />

      {/* Modal de política de privacidad */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Modal de resultado de registro */}
      <RegisterResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        success={registrationResult.success}
        message={registrationResult.message}
        onContinue={() => {
          setShowResultModal(false);
          // Redirigir según el rol del usuario
          const user = useAuthStore.getState().user;
          if (user?.role === 'provider') {
            navigate('/panel-proveedor');
          } else if (user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }}
      />
    </div>
  );
}
