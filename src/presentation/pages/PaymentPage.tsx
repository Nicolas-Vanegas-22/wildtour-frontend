import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookingRepo } from '../../infrastructure/repositories/BookingRepo';
import { PaymentRepo } from '../../infrastructure/repositories/PaymentRepo';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pse' | 'nequi' | 'daviplata';
  icon: string;
  description: string;
  processingFee?: number;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  holderName: string;
  documentType: string;
  documentNumber: string;
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    holderName: '',
    documentType: 'CC',
    documentNumber: ''
  });
  const [pseBank, setPseBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => BookingRepo.getById(bookingId!)
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      type: 'credit_card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      processingFee: 0
    },
    {
      id: 'debit_card',
      name: 'Tarjeta Débito',
      type: 'debit_card',
      icon: '💳',
      description: 'Tarjetas débito nacionales e internacionales',
      processingFee: 2000
    },
    {
      id: 'pse',
      name: 'PSE',
      type: 'pse',
      icon: '🏦',
      description: 'Pago seguro en línea con tu banco',
      processingFee: 3500
    },
    {
      id: 'nequi',
      name: 'Nequi',
      type: 'nequi',
      icon: '📱',
      description: 'Paga con tu cuenta Nequi',
      processingFee: 1000
    },
    {
      id: 'daviplata',
      name: 'DaviPlata',
      type: 'daviplata',
      icon: '📱',
      description: 'Paga con tu cuenta DaviPlata',
      processingFee: 1000
    }
  ];

  const pseBanks = [
    'Banco de Bogotá', 'Bancolombia', 'Banco de Occidente', 'Banco Popular',
    'BBVA Colombia', 'Banco Caja Social', 'Banco AV Villas', 'Bancoomeva',
    'Banco Falabella', 'Banco Pichincha', 'Banco Cooperativo Coopcentral',
    'Banco Mundo Mujer', 'Banco W', 'Banco Agrario', 'Banco GNB Sudameris'
  ];

  const calculateTotal = () => {
    if (!booking) return 0;
    const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
    const processingFee = selectedMethodData?.processingFee || 0;
    return booking.totalPrice + processingFee;
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardDetails(prev => ({ ...prev, number: formatCardNumber(value) }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardDetails(prev => ({ ...prev, expiry: formatExpiry(value) }));
  };

  const validatePayment = () => {
    if (!acceptedTerms) return false;

    switch (selectedMethod) {
      case 'credit_card':
      case 'debit_card':
        return (
          cardDetails.number.replace(/\s/g, '').length === 16 &&
          cardDetails.expiry.length === 5 &&
          cardDetails.cvv.length >= 3 &&
          cardDetails.holderName.trim() &&
          cardDetails.documentNumber.trim()
        );
      case 'pse':
        return pseBank !== '';
      case 'nequi':
      case 'daviplata':
        return cardDetails.documentNumber.trim() !== '';
      default:
        return false;
    }
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        bookingId: bookingId!,
        method: selectedMethod,
        amount: calculateTotal(),
        ...(selectedMethod === 'credit_card' || selectedMethod === 'debit_card' ? {
          cardDetails: {
            ...cardDetails,
            number: cardDetails.number.replace(/\s/g, '')
          }
        } : {}),
        ...(selectedMethod === 'pse' ? { bank: pseBank } : {}),
        ...(selectedMethod === 'nequi' || selectedMethod === 'daviplata' ? {
          phoneNumber: cardDetails.documentNumber
        } : {})
      };

      const payment = await PaymentRepo.processPayment(paymentData);

      if (payment.status === 'approved') {
        navigate(`/reserva-confirmada/${bookingId}`);
      } else if (payment.status === 'pending') {
        navigate(`/pago-pendiente/${bookingId}`);
      } else {
        alert('El pago fue rechazado. Por favor intenta con otro método de pago.');
      }
    } catch (error: any) {
      alert(error.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagar Reserva</h1>
        <p className="text-gray-600">Completa tu pago de forma segura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <label key={method.id} className="block">
                  <div className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                      {method.processingFee && method.processingFee > 0 && (
                        <div className="text-xs text-orange-600">
                          Tarifa de procesamiento: ${method.processingFee.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Detalles de pago</h2>

              {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta*
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de vencimiento*
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV*
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setCardDetails(prev => ({ ...prev, cvv: value }));
                          }
                        }}
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del titular*
                    </label>
                    <input
                      type="text"
                      value={cardDetails.holderName}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, holderName: e.target.value }))}
                      placeholder="Nombre como aparece en la tarjeta"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de documento*
                      </label>
                      <select
                        value={cardDetails.documentType}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, documentType: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="CC">Cédula de ciudadanía</option>
                        <option value="CE">Cédula de extranjería</option>
                        <option value="TI">Tarjeta de identidad</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de documento*
                      </label>
                      <input
                        type="text"
                        value={cardDetails.documentNumber}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, documentNumber: e.target.value }))}
                        placeholder="123456789"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'pse' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona tu banco*
                  </label>
                  <select
                    value={pseBank}
                    onChange={(e) => setPseBank(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecciona tu banco</option>
                    {pseBanks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-600">
                    Serás redirigido a tu banco para completar el pago de forma segura.
                  </p>
                </div>
              )}

              {(selectedMethod === 'nequi' || selectedMethod === 'daviplata') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de celular*
                  </label>
                  <input
                    type="tel"
                    value={cardDetails.documentNumber}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, documentNumber: e.target.value }))}
                    placeholder="3001234567"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Recibirás una notificación push para aprobar el pago.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="text-sm">
                <span className="text-gray-700">
                  Acepto los{' '}
                  <button className="text-green-600 hover:text-green-700 underline">
                    términos y condiciones
                  </button>
                  {' '}y la{' '}
                  <button className="text-green-600 hover:text-green-700 underline">
                    política de privacidad
                  </button>
                  . También acepto la política de cancelación y reembolso.
                </span>
              </div>
            </label>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={!validatePayment() || isProcessing}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando pago...
              </div>
            ) : (
              `Pagar ${calculateTotal().toLocaleString()} COP`
            )}
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>

            <div className="flex gap-3 mb-4">
              <img src={booking.service.image} alt={booking.service.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 className="font-medium">{booking.service.name}</h4>
                <p className="text-sm text-gray-600">{booking.service.location}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Fechas:</span>
                <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              {booking.checkOut && (
                <div className="flex justify-between">
                  <span>Hasta:</span>
                  <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Huéspedes:</span>
                <span>{booking.guests.adults + booking.guests.children} persona(s)</span>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t pt-4 mt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${booking.totalPrice.toLocaleString()}</span>
              </div>
              {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.processingFee && (
                <div className="flex justify-between">
                  <span>Tarifa de procesamiento:</span>
                  <span>${paymentMethods.find(m => m.id === selectedMethod)?.processingFee?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Pago seguro
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Tus datos están protegidos con encriptación SSL de 256 bits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}