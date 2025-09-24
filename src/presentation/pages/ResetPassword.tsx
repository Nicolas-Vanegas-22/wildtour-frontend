import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowLeft, Mountain, CheckCircle } from 'lucide-react';
import { authApi } from '../../infrastructure/services/authApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const token = params.get('token') || '';

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, password: formData.password });
      setSuccess(true);
      showToast('Contraseña restablecida exitosamente', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al restablecer contraseña', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 w-full max-w-md text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            ¡Contraseña actualizada!
          </h1>
          <p className="text-gray-600 mb-8">
            Tu contraseña ha sido restablecida exitosamente.
            Ahora puedes iniciar sesión con tu nueva contraseña.
          </p>

          <Button asChild className="w-full">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

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
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al login
          </Link>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Mountain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Nueva contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña para restablecer tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Confirma tu nueva contraseña"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Las contraseñas no coinciden</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || formData.password !== formData.confirmPassword}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
