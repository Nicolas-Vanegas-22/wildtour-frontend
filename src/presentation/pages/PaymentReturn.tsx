import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { mercadoPagoApi } from '../../infrastructure/services/mercadoPagoApi';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'approved' | 'pending' | 'rejected' | 'error'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    processPaymentReturn();
  }, []);

  const processPaymentReturn = async () => {
    try {
      // Obtener parámetros de MercadoPago
      const collection_id = searchParams.get('collection_id');
      const collection_status = searchParams.get('collection_status');
      const payment_id = searchParams.get('payment_id');
      const status = searchParams.get('status');
      const external_reference = searchParams.get('external_reference');
      const payment_type = searchParams.get('payment_type');
      const merchant_order_id = searchParams.get('merchant_order_id');
      const preference_id = searchParams.get('preference_id');

      if (!collection_id && !payment_id) {
        setPaymentStatus('error');
        return;
      }

      // Procesar según el estado
      switch (collection_status || status) {
        case 'approved':
          setPaymentStatus('approved');
          setPaymentData({
            collection_id,
            payment_id,
            external_reference,
            payment_type,
            merchant_order_id
          });
          showToast('¡Pago aprobado exitosamente!', 'success');
          break;

        case 'pending':
        case 'in_process':
          setPaymentStatus('pending');
          setPaymentData({
            collection_id,
            payment_id,
            external_reference,
            payment_type
          });
          showToast('Pago en proceso de verificación', 'info');
          break;

        case 'rejected':
        case 'cancelled':
          setPaymentStatus('rejected');
          showToast('Pago rechazado o cancelado', 'error');
          break;

        default:
          setPaymentStatus('error');
          showToast('Estado de pago desconocido', 'error');
      }

      // Opcional: Verificar estado en el backend
      if (payment_id) {
        try {
          const statusFromAPI = await mercadoPagoApi.getPaymentStatus(payment_id);
          console.log('Payment status from API:', statusFromAPI);
        } catch (error) {
          console.error('Error getting payment status:', error);
        }
      }

    } catch (error) {
      console.error('Error processing payment return:', error);
      setPaymentStatus('error');
      showToast('Error procesando el resultado del pago', 'error');
    }
  };

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: '¡Pago aprobado!',
          message: 'Tu pago ha sido procesado exitosamente. Recibirás un email de confirmación.',
          actionText: 'Ver mi reserva',
          actionPath: '/profile'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Pago en proceso',
          message: 'Tu pago está siendo verificado. Te notificaremos cuando se confirme.',
          actionText: 'Ver estado de reserva',
          actionPath: '/profile'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Pago rechazado',
          message: 'Tu pago no pudo ser procesado. Puedes intentar con otro método de pago.',
          actionText: 'Intentar de nuevo',
          actionPath: '/servicios'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'Error procesando pago',
          message: 'Hubo un problema al procesar tu pago. Contacta con soporte.',
          actionText: 'Volver al inicio',
          actionPath: '/'
        };
    }
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Procesando resultado del pago...</h2>
          <p className="text-gray-600">Por favor espera mientras verificamos tu pago</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8 w-full max-w-md text-center"
      >
        {/* Icono de estado */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
            <StatusIcon className={`w-12 h-12 ${statusInfo.color}`} />
          </div>
        </div>

        {/* Título y mensaje */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{statusInfo.title}</h1>
          <p className="text-gray-600 leading-relaxed">{statusInfo.message}</p>
        </div>

        {/* Información del pago (si está disponible) */}
        {paymentData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detalles del pago</h3>
            <div className="space-y-2 text-sm">
              {paymentData.payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID del pago:</span>
                  <span className="font-mono">{paymentData.payment_id}</span>
                </div>
              )}
              {paymentData.collection_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de cobro:</span>
                  <span className="font-mono">{paymentData.collection_id}</span>
                </div>
              )}
              {paymentData.external_reference && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Referencia:</span>
                  <span className="font-mono">{paymentData.external_reference}</span>
                </div>
              )}
              {paymentData.payment_type && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="capitalize">{paymentData.payment_type.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate(statusInfo.actionPath)}
            className="w-full"
            variant={paymentStatus === 'approved' ? 'primary' : 'outline'}
          >
            {statusInfo.actionText}
          </Button>

          {paymentStatus === 'rejected' && (
            <Button
              onClick={() => navigate('/servicios')}
              variant="outline"
              className="w-full"
            >
              Explorar servicios
            </Button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Ir al inicio
          </button>
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Tienes preguntas sobre tu pago?
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-primary-600 font-medium">WhatsApp: +57 300 123 4567</p>
            <p className="text-primary-600 font-medium">Email: soporte@wildtour.co</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}