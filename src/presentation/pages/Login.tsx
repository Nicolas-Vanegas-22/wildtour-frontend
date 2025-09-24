import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Mountain, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { authApi } from '../../infrastructure/services/authApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      setAuth(response.token, response.user);
      showToast('¡Bienvenido de vuelta!', 'success');
      navigate('/');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al iniciar sesión', 'error');
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
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Mountain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar tu aventura
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
