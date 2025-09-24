import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Star,
  Shield
} from 'lucide-react';
import { servicePostApi } from '../../infrastructure/services/servicePostApi';
import { bookingApi } from '../../infrastructure/services/bookingApi';
import { mercadoPagoApi } from '../../infrastructure/services/mercadoPagoApi';
import { ServicePost } from '../../domain/models/ServicePost';
import { CreateBookingData } from '../../infrastructure/services/bookingApi';
import { useAuthStore } from '../../application/state/useAuthStore';
import { Button } from '../../shared/ui/Button';
import { useToast } from '../hooks/useToast';

export default function ServiceBooking() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { showToast } = useToast();

  // Estados principales
  const [service, setService] = useState<ServicePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  // Datos de la reserva
  const [bookingData, setBookingData] = useState<CreateBookingData>({
    servicePostId: serviceId || '',
    guests: 1,
    checkIn: '',
    checkOut: '',
    userInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      document: '',
      specialRequests: ''
    }
  });

  // Datos de pago
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pse' | 'nequi' | 'mercadopago'>('mercadopago');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadService();

    // Pre-llenar datos de URL params
    const guests = searchParams.get('guests');
    const date = searchParams.get('date');

    if (guests) {
      setBookingData(prev => ({ ...prev, guests: parseInt(guests) }));
    }
    if (date) {
      setBookingData(prev => ({ ...prev, checkIn: date }));
    }
  }, [serviceId, isAuthenticated, navigate, searchParams]);

  const loadService = async () => {
    if (!serviceId) return;

    try {
      setLoading(true);
      const serviceData = await servicePostApi.getServicePost(serviceId);
      setService(serviceData);
    } catch (error) {
      showToast('Error cargando el servicio', 'error');
      navigate('/servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateBookingData, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserInfoChange = (field: keyof CreateBookingData['userInfo'], value: string) => {
    setBookingData(prev => ({
      ...prev,
      userInfo: { ...prev.userInfo, [field]: value }
    }));
  };

  const checkAvailability = async () => {
    if (!service || !bookingData.checkIn) return;

    try {
      setProcessing(true);
      const result = await bookingApi.checkAvailability(
        service.id,
        bookingData.checkIn,
        bookingData.guests,
        bookingData.checkOut
      );

      if (result.available) {
        setStep(2);
        showToast('¡Fechas disponibles!', 'success');
      } else {
        showToast(result.reason || 'No hay disponibilidad para estas fechas', 'error');
      }
    } catch (error) {
      showToast('Error verificando disponibilidad', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const createBooking = async () => {
    try {
      setProcessing(true);
      const booking = await bookingApi.createBooking(bookingData);
      setCurrentBookingId(booking.id);
      setStep(3);
      showToast('Reserva creada exitosamente', 'success');
    } catch (error) {
      showToast('Error creando la reserva', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = async () => {
    try {
      setProcessing(true);

      if (paymentMethod === 'mercadopago') {
        // Integración con MercadoPago
        const { checkoutUrl } = await mercadoPagoApi.createSimplePayment(
          currentBookingId,
          calculateTotal()
        );

        // Redirigir a MercadoPago
        window.location.href = checkoutUrl;
        return;
      }

      // Otros métodos de pago
      const paymentResult = await bookingApi.processPayment({
        bookingId: currentBookingId,
        amount: calculateTotal(),
        currency: 'COP',
        paymentMethod
      });

      if (paymentResult.success) {
        setStep(4);
        showToast('¡Pago procesado exitosamente!', 'success');
      } else {
        showToast(paymentResult.errorMessage || 'Error procesando el pago', 'error');
      }
    } catch (error) {
      showToast('Error procesando el pago', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!service) return 0;
    const basePrice = service.price.amount * bookingData.guests;
    const taxes = basePrice * 0.19;
    return basePrice + taxes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Servicio no encontrado</h2>
          <p className="text-gray-600 mb-4">El servicio que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => navigate('/servicios')}>Volver a servicios</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6">
            <div className="flex items-start space-x-4">
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {service.location.name}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {service.provider.rating}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.serviceType}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={service.provider.avatar}
                      alt={service.provider.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{service.provider.businessName}</p>
                      <p className="text-xs text-gray-600">{service.provider.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      ${service.price.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{service.price.unit}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { number: 1, title: 'Fechas' },
              { number: 2, title: 'Detalles' },
              { number: 3, title: 'Pago' },
              { number: 4, title: 'Confirmación' }
            ].map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  s.number <= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {s.number < step ? <CheckCircle className="w-5 h-5" /> : s.number}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{s.title}</span>
                {index < 3 && <div className="w-12 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-8"
            >
              {/* Paso 1: Selección de fechas */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Selecciona fechas y huéspedes</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de inicio
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>

                    {service.serviceType === 'alojamiento' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de salida
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={bookingData.checkOut}
                            onChange={(e) => handleInputChange('checkOut', e.target.value)}
                            min={bookingData.checkIn}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de huéspedes
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={bookingData.guests}
                          onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {Array.from({ length: service.availability.maxCapacity }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i + 1 === 1 ? 'huésped' : 'huéspedes'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={checkAvailability}
                      disabled={!bookingData.checkIn || processing}
                      className="px-8"
                    >
                      {processing ? 'Verificando...' : 'Verificar disponibilidad'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 2: Información personal */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Información de contacto</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={bookingData.userInfo.name}
                        onChange={(e) => handleUserInfoChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={bookingData.userInfo.email}
                          onChange={(e) => handleUserInfoChange('email', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={bookingData.userInfo.phone}
                          onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento de identidad
                      </label>
                      <input
                        type="text"
                        value={bookingData.userInfo.document}
                        onChange={(e) => handleUserInfoChange('document', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Solicitudes especiales (opcional)
                    </label>
                    <textarea
                      value={bookingData.userInfo.specialRequests}
                      onChange={(e) => handleUserInfoChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Alguna solicitud especial o necesidad específica..."
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Anterior
                    </Button>
                    <Button onClick={createBooking} disabled={processing}>
                      {processing ? 'Creando reserva...' : 'Continuar al pago'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 3: Método de pago */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Método de pago</h2>

                  <div className="space-y-4">
                    {[
                      {
                        id: 'mercadopago',
                        name: 'MercadoPago',
                        description: 'Tarjetas, PSE, Nequi, DaviPlata y más',
                        icon: CreditCard,
                        recommended: true
                      },
                      {
                        id: 'credit_card',
                        name: 'Tarjeta de crédito/débito',
                        description: 'Visa, Mastercard, American Express',
                        icon: CreditCard
                      },
                      {
                        id: 'pse',
                        name: 'PSE',
                        description: 'Débito a cuenta de ahorros o corriente',
                        icon: Shield
                      },
                      {
                        id: 'nequi',
                        name: 'Nequi',
                        description: 'Pago desde tu cuenta Nequi',
                        icon: Phone
                      }
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="sr-only"
                          />
                          <Icon className="w-6 h-6 text-gray-400 mr-4" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{method.name}</span>
                              {method.recommended && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Recomendado
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                      Acepto los{' '}
                      <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                        política de privacidad
                      </a>
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Anterior
                    </Button>
                    <Button
                      onClick={processPayment}
                      disabled={!acceptTerms || processing}
                    >
                      {processing ? 'Procesando pago...' : `Pagar $${calculateTotal().toLocaleString()}`}
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 4: Confirmación */}
              {step === 4 && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h2>
                    <p className="text-gray-600">
                      Tu reserva ha sido procesada exitosamente. Recibirás un email de confirmación en breve.
                    </p>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-6">
                    <h3 className="font-bold text-primary-900 mb-2">Número de reserva</h3>
                    <p className="text-2xl font-mono font-bold text-primary-600">#WTC{Date.now().toString().slice(-6)}</p>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={() => navigate('/profile')} className="w-full">
                      Ver mis reservas
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/servicios')} className="w-full">
                      Explorar más servicios
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar con resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-strong border border-white/20 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de reserva</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{service.serviceType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{bookingData.checkIn || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Huéspedes:</span>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${(service.price.amount * bookingData.guests).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (19%):</span>
                  <span>${(service.price.amount * bookingData.guests * 0.19).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">¿Necesitas ayuda?</h4>
                <p className="text-sm text-gray-600">
                  WhatsApp: +57 300 123 4567<br />
                  Email: soporte@wildtour.co
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}