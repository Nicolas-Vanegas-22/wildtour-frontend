import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DestinationsRepo } from '../../infrastructure/repositories/DestinationsRepo';
import { useAuthStore } from '../../application/state/useAuthStore';

interface BookingDetails {
  serviceId: string;
  serviceType: 'hospedaje' | 'tours' | 'transporte';
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  extras: string[];
  totalPrice: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
}

interface BookingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function BookingFlow() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingDetails>({
    serviceId: id || '',
    serviceType: type as any || 'tours',
    checkIn: '',
    checkOut: '',
    guests: { adults: 2, children: 0 },
    extras: [],
    totalPrice: 0,
    customerInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      specialRequests: ''
    }
  });

  const steps: BookingStep[] = [
    { id: 1, title: 'Fechas y Huéspedes', description: 'Selecciona fechas y número de personas', completed: false },
    { id: 2, title: 'Servicios Adicionales', description: 'Elige extras y personalizaciones', completed: false },
    { id: 3, title: 'Información Personal', description: 'Completa tus datos de contacto', completed: false },
    { id: 4, title: 'Confirmación', description: 'Revisa y confirma tu reserva', completed: false },
    { id: 5, title: 'Pago', description: 'Completa el proceso de pago', completed: false }
  ];

  const { data: service } = useQuery({
    queryKey: ['service', id, type],
    queryFn: () => DestinationsRepo.getServiceDetails(id!, type!)
  });

  const { data: availability } = useQuery({
    queryKey: ['availability', id, bookingData.checkIn, bookingData.checkOut],
    queryFn: () => DestinationsRepo.checkAvailability(id!, bookingData.checkIn, bookingData.checkOut),
    enabled: !!bookingData.checkIn && !!bookingData.checkOut
  });

  useEffect(() => {
    if (service && bookingData.checkIn && bookingData.checkOut) {
      calculateTotal();
    }
  }, [service, bookingData.checkIn, bookingData.checkOut, bookingData.guests, bookingData.extras]);

  const calculateTotal = () => {
    if (!service) return;

    const basePrice = service.price;
    const nights = type === 'hospedaje' ? calculateNights() : 1;
    const guestMultiplier = bookingData.guests.adults + (bookingData.guests.children * 0.5);
    const extrasPrice = bookingData.extras.reduce((sum, extraId) => {
      const extra = service.extras?.find((e: any) => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);

    const total = (basePrice * nights * guestMultiplier) + extrasPrice;
    setBookingData(prev => ({ ...prev, totalPrice: total }));
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 1;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return bookingData.checkIn && bookingData.checkOut && bookingData.guests.adults > 0;
      case 2:
        return true; // Los extras son opcionales
      case 3:
        return bookingData.customerInfo.name && bookingData.customerInfo.email && bookingData.customerInfo.phone;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmitBooking = async () => {
    try {
      const booking = await DestinationsRepo.createBooking(bookingData);
      navigate(`/pago/${booking.id}`);
    } catch (error) {
      alert('Error al crear la reserva. Por favor intenta nuevamente.');
    }
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservar {service.name}</h1>
        <p className="text-gray-600">{service.location}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Fechas y Huéspedes */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Fechas y Huéspedes</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type === 'hospedaje' ? 'Fecha de entrada' : 'Fecha de inicio'}
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {type === 'hospedaje' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de salida</label>
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adultos</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setBookingData(prev => ({
                        ...prev,
                        guests: { ...prev.guests, adults: Math.max(1, prev.guests.adults - 1) }
                      }))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{bookingData.guests.adults}</span>
                    <button
                      onClick={() => setBookingData(prev => ({
                        ...prev,
                        guests: { ...prev.guests, adults: prev.guests.adults + 1 }
                      }))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niños</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setBookingData(prev => ({
                        ...prev,
                        guests: { ...prev.guests, children: Math.max(0, prev.guests.children - 1) }
                      }))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{bookingData.guests.children}</span>
                    <button
                      onClick={() => setBookingData(prev => ({
                        ...prev,
                        guests: { ...prev.guests, children: prev.guests.children + 1 }
                      }))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {availability === false && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">No hay disponibilidad para las fechas seleccionadas. Por favor elige otras fechas.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Servicios Adicionales */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Servicios Adicionales</h2>

              <div className="space-y-4">
                {service.extras?.map((extra: any) => (
                  <div key={extra.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={extra.id}
                        checked={bookingData.extras.includes(extra.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBookingData(prev => ({ ...prev, extras: [...prev.extras, extra.id] }));
                          } else {
                            setBookingData(prev => ({ ...prev, extras: prev.extras.filter(id => id !== extra.id) }));
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <label htmlFor={extra.id} className="font-medium text-gray-900 cursor-pointer">
                          {extra.name}
                        </label>
                        <p className="text-sm text-gray-600">{extra.description}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">+${extra.price.toLocaleString()}</span>
                  </div>
                ))}

                {(!service.extras || service.extras.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No hay servicios adicionales disponibles para este servicio.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Información Personal */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Información de Contacto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo*</label>
                  <input
                    type="text"
                    value={bookingData.customerInfo.name}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, name: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    value={bookingData.customerInfo.email}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, email: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono*</label>
                  <input
                    type="tel"
                    value={bookingData.customerInfo.phone}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, phone: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Solicitudes especiales</label>
                <textarea
                  value={bookingData.customerInfo.specialRequests}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    customerInfo: { ...prev.customerInfo, specialRequests: e.target.value }
                  }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="¿Tienes alguna solicitud especial? (dieta, accesibilidad, etc.)"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmación */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Confirma tu Reserva</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-gray-600">{service.location}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{service.rating} ({service.reviewCount} opiniones)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Detalles de la reserva</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fechas:</span>
                      <span>{new Date(bookingData.checkIn).toLocaleDateString()} - {type === 'hospedaje' ? new Date(bookingData.checkOut).toLocaleDateString() : 'Un día'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Huéspedes:</span>
                      <span>{bookingData.guests.adults} adulto(s){bookingData.guests.children > 0 && `, ${bookingData.guests.children} niño(s)`}</span>
                    </div>
                    {type === 'hospedaje' && (
                      <div className="flex justify-between">
                        <span>Noches:</span>
                        <span>{calculateNights()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {bookingData.extras.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Servicios adicionales</h4>
                    <div className="space-y-2 text-sm">
                      {bookingData.extras.map(extraId => {
                        const extra = service.extras?.find((e: any) => e.id === extraId);
                        return extra && (
                          <div key={extraId} className="flex justify-between">
                            <span>{extra.name}</span>
                            <span>${extra.price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Información de contacto</h4>
                  <div className="space-y-1 text-sm">
                    <p>{bookingData.customerInfo.name}</p>
                    <p>{bookingData.customerInfo.email}</p>
                    <p>{bookingData.customerInfo.phone}</p>
                    {bookingData.customerInfo.specialRequests && (
                      <div className="mt-2">
                        <span className="font-medium">Solicitudes especiales:</span>
                        <p className="text-gray-600">{bookingData.customerInfo.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={!validateCurrentStep() || (currentStep === 1 && availability === false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmitBooking}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Proceder al Pago
              </button>
            )}
          </div>
        </div>

        {/* Sidebar - Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Resumen de Reserva</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Precio base:</span>
                <span>${service.price?.toLocaleString()}</span>
              </div>

              {type === 'hospedaje' && bookingData.checkIn && bookingData.checkOut && (
                <div className="flex justify-between text-sm">
                  <span>× {calculateNights()} noche(s):</span>
                  <span>${(service.price * calculateNights()).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>× {bookingData.guests.adults + (bookingData.guests.children * 0.5)} persona(s):</span>
                <span>${((service.price || 0) * (type === 'hospedaje' ? calculateNights() : 1) * (bookingData.guests.adults + (bookingData.guests.children * 0.5))).toLocaleString()}</span>
              </div>

              {bookingData.extras.length > 0 && (
                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Extras:</div>
                  {bookingData.extras.map(extraId => {
                    const extra = service.extras?.find((e: any) => e.id === extraId);
                    return extra && (
                      <div key={extraId} className="flex justify-between text-sm">
                        <span>{extra.name}:</span>
                        <span>${extra.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">${bookingData.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Política de cancelación</h4>
              <p className="text-sm text-green-700">
                Cancelación gratuita hasta 48 horas antes del inicio del servicio.
                Después se aplicará una penalidad del 50%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}