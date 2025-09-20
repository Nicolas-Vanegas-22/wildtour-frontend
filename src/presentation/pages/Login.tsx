import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoginLoading, loginError, isAuthenticated, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {loginError && (
            <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
              {loginError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoginLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
          <p>
            ¿Olvidaste tu contraseña?{' '}
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Recuperar contraseña
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
