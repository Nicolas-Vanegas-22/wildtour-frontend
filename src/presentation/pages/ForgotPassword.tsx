import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Mountain, Send } from 'lucide-react';
import { authApi } from '../../infrastructure/services/authApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setEmailSent(true);
      showToast('Email de recuperación enviado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error enviando email', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              <Send className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            ¡Email enviado!
          </h1>
          <p className="text-gray-600 mb-8">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">Volver al login</Link>
            </Button>
            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              Enviar otro email
            </button>
          </div>
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
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            No te preocupes, te enviaremos instrucciones para restablecerla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
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