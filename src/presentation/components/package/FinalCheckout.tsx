import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  Package,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePackageStore } from '../../../application/state/usePackageStore';
import { useAuthStore } from '../../../application/state/useAuthStore';

interface FinalCheckoutProps {
  onClose: () => void;
}

export default function FinalCheckout({ onClose }: FinalCheckoutProps) {
  const navigate = useNavigate();
  const { currentPackage, clearPackage } = usePackageStore();
  const { isAuthenticated } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalServices = () => {
    if (!currentPackage) return 0;
    return Object.values(currentPackage.modules).reduce(
      (sum, module) => sum + module.selectedServices.length,
      0
    );
  };

  const getTotalPersons = () => {
    if (!currentPackage) return 0;
    let total = 0;
    Object.values(currentPackage.modules).forEach((module) => {
      module.selectedServices.forEach((service) => {
        total = Math.max(total, service.persons);
      });
    });
    return total;
  };

  const handleSavePackage = async () => {
    if (!isAuthenticated) {
      // Redirigir al login
      alert('Debes iniciar sesión para guardar tu paquete');
      navigate('/login');
      return;
    }

    setIsSaving(true);

    // TODO: Llamar a la API para guardar el paquete
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        onClose();
        clearPackage();
      }, 2000);
    }, 1500);
  };

  const handlePayNow = () => {
    if (!isAuthenticated) {
      // Redirigir al login
      alert('Debes iniciar sesión para continuar con el pago');
      navigate('/login');
      return;
    }

    // TODO: Redirigir al proceso de pago
    // Por ahora mostrar alerta
    alert('Redirigiendo al proceso de pago...');
    onClose();
  };

  if (saveSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>

          <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
            ¡Paquete Guardado!
          </h3>
          <p className="text-neutral-600 mb-4">
            Tu paquete personalizado ha sido guardado exitosamente. Puedes consultarlo en cualquier
            momento desde tu perfil.
          </p>
          <p className="text-sm text-neutral-500">Cerrando...</p>
        </div>
      </motion.div>
    );
  }

  if (!currentPackage || getTotalServices() === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
            No hay servicios seleccionados
          </h3>
          <p className="text-neutral-600">
            Debes agregar al menos un servicio a tu paquete antes de continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen del paquete */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-lg border border-primary-200"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 mb-1 sm:mb-2">
              Tu Paquete Personalizado
            </h3>
            <p className="text-sm sm:text-base text-neutral-600">
              Revisa los detalles de tu paquete antes de continuar
            </p>
          </div>
        </div>

        {/* Estadísticas del paquete */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-neutral-600">Servicios</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{getTotalServices()}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-neutral-600">Personas</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{getTotalPersons()}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-neutral-600">Categorías</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {Object.keys(currentPackage.modules).length}
            </p>
          </div>
        </div>

        {/* Total destacado */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-1">Total a pagar</p>
              <p className="text-4xl font-bold">{formatPrice(currentPackage.total)}</p>
              <p className="text-sm text-primary-200 mt-1">
                Incluye IVA ({formatPrice(currentPackage.taxes)})
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Opciones de acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Guardar paquete */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-neutral-200 hover:border-neutral-300 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Save className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-neutral-900 mb-2">
                Guardar Paquete
              </h4>
              <p className="text-sm text-neutral-600">
                Guarda tu paquete para revisarlo más tarde o compartirlo con alguien más.
              </p>
            </div>
          </div>

          <ul className="space-y-2 mb-6 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Disponible por 7 días</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Puedes editarlo cuando quieras</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Sin compromiso de pago</span>
            </li>
          </ul>

          <button
            onClick={handleSavePackage}
            disabled={isSaving}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar para después'}</span>
          </button>
        </div>

        {/* Pagar ahora */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 shadow-lg border-2 border-primary-500 text-white">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold mb-2">Pagar Ahora</h4>
              <p className="text-sm text-primary-100">
                Completa tu reserva y asegura tu lugar para la aventura.
              </p>
            </div>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Confirmación inmediata</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Pago seguro</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Garantía de servicio</span>
            </li>
          </ul>

          <button
            onClick={handlePayNow}
            className="w-full bg-white hover:bg-neutral-100 text-primary-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg group"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceder al pago</span>
          </button>
        </div>
      </motion.div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-neutral-700">
            <p className="font-semibold mb-2">Antes de continuar</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Verifica que todos los servicios y fechas sean correctos</li>
              <li>Asegúrate de tener tu documento de identidad a mano</li>
              <li>Revisa las políticas de cancelación de cada servicio</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
