import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Mountain, ArrowLeft, UserPlus, Badge } from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { authApi } from '../../infrastructure/services/authApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';
import RegisterResultModal from '../components/RegisterResultModal';

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

  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
          rnt: formData.rnt
        })
      };

      const response = await authApi.register(registerData);
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
                Documento
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="number"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="1234567890"
                  required
                />
              </div>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre del negocio
                </label>
                <div className="relative">
                  <Mountain className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Mi empresa turística"
                    required={formData.role === 'provider'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  RNT (Registro Nacional de Turismo)
                </label>
                <div className="relative">
                  <Badge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    name="rnt"
                    value={formData.rnt}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="RNT-123456789"
                    required={formData.role === 'provider'}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Obligatorio para prestadores de servicios turísticos
                </p>
              </div>
            </div>
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
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
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
