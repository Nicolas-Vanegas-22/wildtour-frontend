import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Mountain,
  Camera,
  Telescope,
  UtensilsCrossed,
  Bed,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { cn } from '../../../shared/utils/cn';

interface VillaviejaReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: any;
}

interface ReservationData {
  // Datos del usuario
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    document: string;
  };
  // Datos de la reserva
  bookingInfo: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    packageType: string;
    specialRequests: string;
  };
  // Servicios adicionales
  additionalServices: {
    astronomicalTour: boolean;
    paleontologyGuide: boolean;
    transportation: boolean;
    meals: boolean;
  };
}

const VillaviejaReservationModal: React.FC<VillaviejaReservationModalProps> = ({
  isOpen,
  onClose,
  selectedPackage
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData>({
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      document: ''
    },
    bookingInfo: {
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      packageType: 'complete',
      specialRequests: ''
    },
    additionalServices: {
      astronomicalTour: false,
      paleontologyGuide: false,
      transportation: false,
      meals: false
    }
  });

  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    {
      id: 'complete',
      name: 'Experiencia Completa',
      duration: '3 días / 2 noches',
      price: 450000,
      includes: [
        'Alojamiento en hotel boutique',
        'Tour guiado al Desierto de la Tatacoa',
        'Observación astronómica nocturna',
        'Visita al Museo Paleontológico',
        'Desayunos incluidos',
        'Guía especializado'
      ],
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'adventure',
      name: 'Aventura Desierto',
      duration: '2 días / 1 noche',
      price: 280000,
      includes: [
        'Camping en el desierto',
        'Recorrido por los laberintos',
        'Observación de estrellas',
        'Trekking guiado',
        'Comidas campestres'
      ],
      icon: <Mountain className="w-6 h-6" />
    },
    {
      id: 'family',
      name: 'Plan Familiar',
      duration: '2 días / 1 noche',
      price: 320000,
      includes: [
        'Alojamiento familiar',
        'Actividades para niños',
        'Tours educativos',
        'Talleres de paleontología',
        'Todas las comidas'
      ],
      icon: <Users className="w-6 h-6" />
    }
  ];

  const additionalServicesData = [
    {
      id: 'astronomicalTour',
      name: 'Tour Astronómico Privado',
      price: 80000,
      description: 'Sesión privada de observación con telescopio profesional',
      icon: <Telescope className="w-5 h-5" />
    },
    {
      id: 'paleontologyGuide',
      name: 'Guía Paleontólogo Especializado',
      price: 120000,
      description: 'Guía experto en fósiles y geología del desierto',
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: 'transportation',
      name: 'Transporte Privado desde Neiva',
      price: 150000,
      description: 'Traslado ida y vuelta en vehículo privado',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'meals',
      name: 'Experiencia Gastronómica',
      price: 95000,
      description: 'Comidas típicas de la región con productos locales',
      icon: <UtensilsCrossed className="w-5 h-5" />
    }
  ];

  const selectedPackageData = packages.find(pkg => pkg.id === reservationData.bookingInfo.packageType);

  const calculateTotal = () => {
    let total = selectedPackageData?.price || 0;

    // Multiplicar por número de personas
    const totalPersons = reservationData.bookingInfo.adults + reservationData.bookingInfo.children;
    total *= totalPersons;

    // Agregar servicios adicionales
    Object.entries(reservationData.additionalServices).forEach(([serviceId, isSelected]) => {
      if (isSelected) {
        const service = additionalServicesData.find(s => s.id === serviceId);
        if (service) {
          total += service.price;
        }
      }
    });

    return total;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (section: keyof ReservationData, field: string, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setReservationData(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [serviceId]: !prev.additionalServices[serviceId as keyof typeof prev.additionalServices]
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simular envío de datos
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos de reserva:', reservationData);
      console.log('Total:', calculateTotal());

      // Mostrar mensaje de éxito y cerrar modal
      alert('¡Reserva enviada exitosamente! Te contactaremos pronto para confirmar los detalles.');
      onClose();

      // Reset form
      setCurrentStep(1);
      setReservationData({
        contactInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          document: ''
        },
        bookingInfo: {
          checkIn: '',
          checkOut: '',
          adults: 2,
          children: 0,
          packageType: 'complete',
          specialRequests: ''
        },
        additionalServices: {
          astronomicalTour: false,
          paleontologyGuide: false,
          transportation: false,
          meals: false
        }
      });

    } catch (error) {
      console.error('Error enviando reserva:', error);
      alert('Error al enviar la reserva. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return reservationData.bookingInfo.checkIn &&
               reservationData.bookingInfo.checkOut &&
               reservationData.bookingInfo.packageType;
      case 2:
        return reservationData.contactInfo.firstName &&
               reservationData.contactInfo.lastName &&
               reservationData.contactInfo.email &&
               reservationData.contactInfo.phone;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Reserva tu experiencia en Villavieja</h2>
                <p className="text-primary-100 mt-1">Paso {currentStep} de 3</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {/* Step 1: Fechas y Paquete */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    Selecciona tu paquete y fechas
                  </h3>

                  {/* Package Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => handleInputChange('bookingInfo', 'packageType', pkg.id)}
                        className={cn(
                          'border-2 rounded-lg p-4 cursor-pointer transition-all',
                          reservationData.bookingInfo.packageType === pkg.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-primary-600">{pkg.icon}</div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-neutral-900">
                              {formatPrice(pkg.price)}
                            </div>
                            <div className="text-sm text-neutral-600">por persona</div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-neutral-900 mb-1">{pkg.name}</h4>
                        <p className="text-sm text-neutral-600 mb-3">{pkg.duration}</p>
                        <div className="space-y-1">
                          {pkg.includes.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center text-xs text-neutral-600">
                              <Check className="w-3 h-3 text-success-500 mr-2" />
                              {item}
                            </div>
                          ))}
                          {pkg.includes.length > 3 && (
                            <div className="text-xs text-primary-600">
                              +{pkg.includes.length - 3} servicios más
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Fecha de llegada
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="date"
                          value={reservationData.bookingInfo.checkIn}
                          onChange={(e) => handleInputChange('bookingInfo', 'checkIn', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Fecha de salida
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="date"
                          value={reservationData.bookingInfo.checkOut}
                          onChange={(e) => handleInputChange('bookingInfo', 'checkOut', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min={reservationData.bookingInfo.checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Adultos
                      </label>
                      <select
                        value={reservationData.bookingInfo.adults}
                        onChange={(e) => handleInputChange('bookingInfo', 'adults', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} adulto{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Niños (0-12 años)
                      </label>
                      <select
                        value={reservationData.bookingInfo.children}
                        onChange={(e) => handleInputChange('bookingInfo', 'children', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {[0,1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} niño{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Información de Contacto */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    Información de contacto
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Nombres
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          value={reservationData.contactInfo.firstName}
                          onChange={(e) => handleInputChange('contactInfo', 'firstName', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Tu nombre"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Apellidos
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          value={reservationData.contactInfo.lastName}
                          onChange={(e) => handleInputChange('contactInfo', 'lastName', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Tus apellidos"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="email"
                          value={reservationData.contactInfo.email}
                          onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="tel"
                          value={reservationData.contactInfo.phone}
                          onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+57 300 123 4567"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Documento de identidad
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="text"
                          value={reservationData.contactInfo.document}
                          onChange={(e) => handleInputChange('contactInfo', 'document', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Número de cédula o pasaporte"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Solicitudes especiales (opcional)
                      </label>
                      <textarea
                        value={reservationData.bookingInfo.specialRequests}
                        onChange={(e) => handleInputChange('bookingInfo', 'specialRequests', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        placeholder="Alguna petición especial, necesidades alimentarias, etc."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Servicios Adicionales y Resumen */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    Servicios adicionales
                  </h3>

                  <div className="space-y-3 mb-6">
                    {additionalServicesData.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={reservationData.additionalServices[service.id as keyof typeof reservationData.additionalServices]}
                            onChange={() => handleServiceToggle(service.id)}
                            className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="text-primary-600">{service.icon}</div>
                              <h4 className="font-medium text-neutral-900">{service.name}</h4>
                            </div>
                            <p className="text-sm text-neutral-600">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-neutral-900">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de la reserva */}
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                      Resumen de tu reserva
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Paquete: {selectedPackageData?.name}</span>
                        <span className="font-medium">{formatPrice(selectedPackageData?.price || 0)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          Personas: {reservationData.bookingInfo.adults} adultos
                          {reservationData.bookingInfo.children > 0 && `, ${reservationData.bookingInfo.children} niños`}
                        </span>
                        <span className="font-medium">
                          x{reservationData.bookingInfo.adults + reservationData.bookingInfo.children}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          Fechas: {reservationData.bookingInfo.checkIn} a {reservationData.bookingInfo.checkOut}
                        </span>
                      </div>

                      {Object.entries(reservationData.additionalServices).some(([_, selected]) => selected) && (
                        <div className="pt-3 border-t border-neutral-200">
                          <div className="text-sm font-medium text-neutral-700 mb-2">Servicios adicionales:</div>
                          {Object.entries(reservationData.additionalServices).map(([serviceId, selected]) => {
                            if (!selected) return null;
                            const service = additionalServicesData.find(s => s.id === serviceId);
                            return service ? (
                              <div key={serviceId} className="flex justify-between text-sm">
                                <span className="text-neutral-600">{service.name}</span>
                                <span className="font-medium">{formatPrice(service.price)}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      <div className="pt-3 border-t border-neutral-300">
                        <div className="flex justify-between text-lg font-bold text-neutral-900">
                          <span>Total</span>
                          <span>{formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Importante:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Esta es una pre-reserva. Te contactaremos para confirmar disponibilidad.</li>
                          <li>El pago se realiza después de la confirmación.</li>
                          <li>Políticas de cancelación flexibles disponibles.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 p-6 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              {currentStep < 3 && (
                <span>Total estimado: {formatPrice(calculateTotal())}</span>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  Anterior
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VillaviejaReservationModal;