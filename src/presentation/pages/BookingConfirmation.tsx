import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BookingRepo } from '../../infrastructure/repositories/BookingRepo';
import { EmailService } from '../../infrastructure/services/EmailService';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const [emailSent, setEmailSent] = useState(false);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => BookingRepo.getById(bookingId!)
  });

  const { data: payment } = useQuery({
    queryKey: ['payment', bookingId],
    queryFn: () => BookingRepo.getPayment(bookingId!)
  });

  useEffect(() => {
    if (booking && !emailSent) {
      sendConfirmationEmail();
    }
  }, [booking, emailSent]);

  const sendConfirmationEmail = async () => {
    try {
      await EmailService.sendBookingConfirmation(booking!);
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const downloadTicket = () => {
    // Generar y descargar el ticket/voucher
    const ticketData = {
      booking,
      payment,
      qrCode: `https://wildtour.com/ticket/${bookingId}`
    };

    // Aquí implementarías la generación del PDF
    console.log('Downloading ticket:', ticketData);
    alert('El ticket se descargará en breve (funcionalidad pendiente de implementar)');
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi reserva en WildTour',
        text: `He reservado ${booking?.service.name} en WildTour`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
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
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
        <p className="text-gray-600">Tu reserva ha sido procesada exitosamente</p>
        <p className="text-sm text-gray-500 mt-2">Número de reserva: <span className="font-mono font-semibold">#{booking.id}</span></p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Detalles de tu reserva</h2>

            <div className="flex gap-4 mb-6">
              <img src={booking.service.image} alt={booking.service.name} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold text-lg">{booking.service.name}</h3>
                <p className="text-gray-600">{booking.service.location}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm">{booking.service.rating} ({booking.service.reviewCount} opiniones)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información de la reserva</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de inicio:</span>
                    <span>{new Date(booking.checkIn).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  {booking.checkOut && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de fin:</span>
                      <span>{new Date(booking.checkOut).toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Huéspedes:</span>
                    <span>{booking.guests.adults} adulto(s){booking.guests.children > 0 && `, ${booking.guests.children} niño(s)`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Confirmada</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información de contacto</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p>{booking.customerInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p>{booking.customerInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Teléfono:</span>
                    <p>{booking.customerInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking.customerInfo.specialRequests && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">Solicitudes especiales</h4>
                <p className="text-yellow-700 text-sm">{booking.customerInfo.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Payment Information */}
          {payment && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Información de pago</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de pago:</span>
                    <span>{new Date(payment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referencia:</span>
                    <span className="font-mono">{payment.reference}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${booking.totalPrice.toLocaleString()}</span>
                  </div>
                  {payment.processingFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarifa procesamiento:</span>
                      <span>${payment.processingFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total pagado:</span>
                    <span className="text-green-600">${payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">¿Qué sigue ahora?</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Confirmación por email</h3>
                  <p className="text-sm text-gray-600">
                    {emailSent
                      ? 'Te hemos enviado un email de confirmación con todos los detalles.'
                      : 'Recibirás un email de confirmación en unos minutos.'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Preparación para el viaje</h3>
                  <p className="text-sm text-gray-600">
                    El proveedor se pondrá en contacto contigo 24-48 horas antes del inicio para coordinar detalles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">¡Disfruta tu experiencia!</h3>
                  <p className="text-sm text-gray-600">
                    Lleva tu voucher (digital o impreso) y un documento de identidad válido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>

            <div className="space-y-3">
              <button
                onClick={downloadTicket}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar voucher</span>
              </button>

              <button
                onClick={shareBooking}
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Compartir</span>
              </button>

              <Link
                to="/reservas"
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ver mis reservas</span>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium">Atención al cliente</p>
                  <p className="text-sm text-gray-600">+57 1 234 5678</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.708a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">soporte@wildtour.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div>
                  <p className="font-medium">Chat en vivo</p>
                  <p className="text-sm text-gray-600">Disponible 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Política de cancelación</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>Cancelación gratuita:</strong> Hasta 48 horas antes</p>
              <p><strong>Cancelación con cargo:</strong> 50% del total entre 24-48 horas antes</p>
              <p><strong>No reembolsable:</strong> Menos de 24 horas antes</p>
            </div>
            <button className="mt-3 text-yellow-800 underline text-sm hover:text-yellow-900">
              Ver política completa
            </button>
          </div>
        </div>
      </div>

      {/* Continue Exploring */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Sigue explorando!</h2>
        <p className="text-gray-600 mb-6">Descubre más experiencias increíbles en Colombia</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/villavieja"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Explorar Villavieja
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}