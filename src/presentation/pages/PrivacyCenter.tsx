import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mountain } from 'lucide-react';
import PrivacyDashboard from '../../compliance/components/PrivacyDashboard';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';

const PrivacyCenter: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
            Acceso Requerido
          </h2>
          <p className="text-neutral-600 mb-6">
            Para acceder al Centro de Privacidad, debe iniciar sesión en su cuenta.
          </p>
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full" size="lg">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/registro">
              <Button variant="outline" className="w-full" size="lg">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Mountain className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Centro de Privacidad
          </h1>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
            Gestione y controle sus datos personales con total transparencia.
            Cumplimiento completo con la <strong className="text-primary-600">Ley 1581 de 2012</strong> de Colombia.
          </p>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PrivacyDashboard />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
            <p className="text-sm text-neutral-600">
              <strong>Wild Tour</strong> se compromete con la protección de sus datos personales.
              Todos los tratamientos se realizan conforme a la Ley 1581 de 2012 y demás normativas aplicables.
            </p>
            <div className="flex justify-center gap-6 mt-4 text-xs text-neutral-500">
              <Link to="/privacy" className="hover:text-primary-600 transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="hover:text-primary-600 transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/data-rights" className="hover:text-primary-600 transition-colors">
                Ejercer Derechos
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyCenter;