import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookingItem, BookingContact, BookingGuest, CartItem } from '../../domain/models/Booking';
import { mockDestinations } from '../../data/mockData';
import '../../styles/account-settings.css';

const Booking: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [contact, setContact] = useState<BookingContact>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [guests, setGuests] = useState<BookingGuest[]>([]);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const destination = mockDestinations.find(d => d.id === destinationId);

  useEffect(() => {
    if (!destination) {
      navigate('/destinations');
      return;
    }

    // Parse URL parameters for pre-selected items
    const itemType = searchParams.get('type');
    const itemId = searchParams.get('itemId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const guests = searchParams.get('guests');

    if (itemType && itemId && startDate) {
      const item = itemType === 'activity'
        ? destination.activities.find(a => a.id === itemId)
        : destination.accommodations.find(a => a.id === itemId);

      if (item) {
        const cartItem: CartItem = {
          id: `${itemId}-${Date.now()}`,
          type: itemType as 'activity' | 'accommodation',
          destinationId: destination.id,
          destinationName: destination.name,
          itemId: item.id,
          name: item.name,
          description: item.description,
          image: item.images[0],
          price: item.price,
          quantity: 1,
          maxGuests: item.maxGuests || 10,
          selectedGuests: parseInt(guests || '1'),
          startDate,
          endDate: endDate || startDate,
          availabilityChecked: true,
          available: true,
        };
        setSelectedItems([cartItem]);
        setGuestCount(parseInt(guests || '1'));
      }
    }
  }, [destination, searchParams, navigate]);

  const addGuest = () => {
    if (guests.length < guestCount) {
      setGuests([...guests, {
        firstName: '',
        lastName: '',
        document: '',
        email: '',
        phone: '',
        age: 18,
      }]);
    }
  };

  const updateGuest = (index: number, field: keyof BookingGuest, value: string | number) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.selectedGuests), 0);
    const taxes = subtotal * 0.19; // IVA Colombia
    const fees = subtotal * 0.02; // Comisión plataforma
    return {
      subtotal,
      taxes,
      fees,
      total: subtotal + taxes + fees
    };
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Aquí se procesaría la reserva
    alert('¡Reserva creada exitosamente! Te enviaremos la confirmación por email.');
    navigate('/profile/bookings');
  };

  if (!destination) return null;

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Reservar en {destination.name}</h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s <= step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                <span className="ml-2">
                  {s === 1 && 'Selección'}
                  {s === 2 && 'Datos'}
                  {s === 3 && 'Huéspedes'}
                  {s === 4 && 'Pago'}
                </span>
                {s < 4 && <div className="w-8 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              {/* Step 1: Item Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Selecciona tus actividades</h2>

                  {/* Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Actividades disponibles</h3>
                    <div className="grid gap-4">
                      {destination.activities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg p-4 hover:border-emerald-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={activity.images[0]}
                                alt={activity.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{activity.name}</h4>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <p className="text-emerald-600 font-bold">${activity.price.toLocaleString()} COP</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                className="border rounded px-2 py-1"
                                onChange={(e) => {
                                  const guests = parseInt(e.target.value);
                                  setGuestCount(guests);
                                }}
                              >
                                {[...Array(activity.maxGuests)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1} persona{i > 0 ? 's' : ''}</option>
                                ))}
                              </select>
                              <button
                                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                                onClick={() => {
                                  const cartItem: CartItem = {
                                    id: `${activity.id}-${Date.now()}`,
                                    type: 'activity',
                                    destinationId: destination.id,
                                    destinationName: destination.name,
                                    itemId: activity.id,
                                    name: activity.name,
                                    description: activity.description,
                                    image: activity.images[0],
                                    price: activity.price,
                                    quantity: 1,
                                    maxGuests: activity.maxGuests,
                                    selectedGuests: guestCount,
                                    startDate: new Date().toISOString().split('T')[0],
                                    endDate: new Date().toISOString().split('T')[0],
                                    availabilityChecked: true,
                                    available: true,
                                  };
                                  setSelectedItems([...selectedItems, cartItem]);
                                }}
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accommodations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Alojamientos disponibles</h3>
                    <div className="grid gap-4">
                      {destination.accommodations.map((accommodation) => (
                        <div key={accommodation.id} className="border rounded-lg p-4 hover:border-emerald-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={accommodation.images[0]}
                                alt={accommodation.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{accommodation.name}</h4>
                                <p className="text-sm text-gray-600">{accommodation.description}</p>
                                <p className="text-emerald-600 font-bold">${accommodation.price.toLocaleString()} COP/noche</p>
                              </div>
                            </div>
                            <button
                              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                              onClick={() => {
                                const cartItem: CartItem = {
                                  id: `${accommodation.id}-${Date.now()}`,
                                  type: 'accommodation',
                                  destinationId: destination.id,
                                  destinationName: destination.name,
                                  itemId: accommodation.id,
                                  name: accommodation.name,
                                  description: accommodation.description,
                                  image: accommodation.images[0],
                                  price: accommodation.price,
                                  quantity: 1,
                                  maxGuests: accommodation.maxGuests,
                                  selectedGuests: guestCount,
                                  startDate: new Date().toISOString().split('T')[0],
                                  endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                  availabilityChecked: true,
                                  available: true,
                                };
                                setSelectedItems([...selectedItems, cartItem]);
                              }}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Información de contacto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={contact.firstName}
                        onChange={(e) => setContact({...contact, firstName: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        value={contact.lastName}
                        onChange={(e) => setContact({...contact, lastName: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({...contact, email: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({...contact, phone: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Solicitudes especiales</label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Alguna solicitud especial o necesidad específica..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Guest Information */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Información de huéspedes</h2>
                    <button
                      onClick={addGuest}
                      className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                      disabled={guests.length >= guestCount}
                    >
                      Agregar huésped
                    </button>
                  </div>

                  <p className="text-gray-600">Total de huéspedes: {guestCount}</p>

                  {guests.map((guest, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Huésped {index + 1}</h3>
                        <button
                          onClick={() => removeGuest(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={guest.firstName}
                          onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Apellido"
                          value={guest.lastName}
                          onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Documento"
                          value={guest.document}
                          onChange={(e) => updateGuest(index, 'document', e.target.value)}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="number"
                          placeholder="Edad"
                          value={guest.age}
                          onChange={(e) => updateGuest(index, 'age', parseInt(e.target.value))}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={guest.email}
                          onChange={(e) => updateGuest(index, 'email', e.target.value)}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="tel"
                          placeholder="Teléfono"
                          value={guest.phone}
                          onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Método de pago</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-300">
                      <input type="radio" name="payment" value="card" className="mr-3" defaultChecked />
                      <div>
                        <div className="font-medium">Tarjeta de crédito/débito</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-300">
                      <input type="radio" name="payment" value="nequi" className="mr-3" />
                      <div>
                        <div className="font-medium">Nequi</div>
                        <div className="text-sm text-gray-600">Pago móvil</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-300">
                      <input type="radio" name="payment" value="pse" className="mr-3" />
                      <div>
                        <div className="font-medium">PSE</div>
                        <div className="text-sm text-gray-600">Débito a cuenta</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-300">
                      <input type="radio" name="payment" value="daviplata" className="mr-3" />
                      <div>
                        <div className="font-medium">DaviPlata</div>
                        <div className="text-sm text-gray-600">Billetera digital</div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Política de cancelación:</strong> Cancelación gratuita hasta 24 horas antes del inicio de la actividad.
                      Para alojamientos, cancelación gratuita hasta 48 horas antes del check-in.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={
                      (step === 1 && selectedItems.length === 0) ||
                      (step === 2 && (!contact.firstName || !contact.lastName || !contact.email || !contact.phone))
                    }
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Confirmar reserva
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de reserva</h3>

              {/* Selected Items */}
              <div className="space-y-3 mb-6">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">{item.selectedGuests} persona{item.selectedGuests > 1 ? 's' : ''}</p>
                      <p className="text-emerald-600 font-bold text-sm">${(item.price * item.selectedGuests).toLocaleString()} COP</p>
                    </div>
                    <button
                      onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${pricing.subtotal.toLocaleString()} COP</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%):</span>
                  <span>${pricing.taxes.toLocaleString()} COP</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión:</span>
                  <span>${pricing.fees.toLocaleString()} COP</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${pricing.total.toLocaleString()} COP</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-800 mb-2">¿Necesitas ayuda?</h4>
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
};

export default Booking;