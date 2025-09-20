// Modelos para el sistema de reservas

export interface BookingGuest {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  phone: string;
  age: number;
}

export interface BookingItem {
  id: string;
  type: 'accommodation' | 'activity' | 'package';
  itemId: string; // ID del alojamiento o actividad
  name: string;
  description: string;
  price: number;
  quantity: number;
  startDate: string;
  endDate?: string;
  guests: number;
  specialRequests?: string;
}

export interface PaymentInfo {
  method: 'card' | 'nequi' | 'daviplata' | 'pse' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  transactionId?: string;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
}

export interface BookingContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type BookingStatus =
  | 'pending'           // Esperando confirmación
  | 'confirmed'         // Confirmada por el proveedor
  | 'in_progress'       // En progreso (tour iniciado)
  | 'completed'         // Completada exitosamente
  | 'cancelled_user'    // Cancelada por el usuario
  | 'cancelled_provider'// Cancelada por el proveedor
  | 'no_show'          // Usuario no se presentó
  | 'refunded';        // Reembolsada

export interface Booking {
  id: string;
  bookingNumber: string; // Número único de reserva

  // Relaciones
  userId: string;
  destinationId: string;
  providerId?: string;

  // Items de la reserva
  items: BookingItem[];

  // Información del contacto principal
  contact: BookingContact;

  // Lista de huéspedes/participantes
  guests: BookingGuest[];

  // Fechas importantes
  startDate: string;
  endDate: string;
  bookingDate: string;

  // Estado y seguimiento
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    date: string;
    reason?: string;
    updatedBy: string;
  }[];

  // Información financiera
  pricing: {
    subtotal: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
    currency: string;
  };

  payment: PaymentInfo;

  // Detalles adicionales
  specialRequests?: string;
  notes?: string;

  // Políticas
  cancellationPolicy: string;
  refundPolicy: string;

  // Confirmaciones y comprobantes
  confirmationSent: boolean;
  remindersSent: number;

  // Fechas del sistema
  createdAt: string;
  updatedAt: string;

  // Calificación post-servicio
  reviewed?: boolean;
  reviewId?: string;
}

// Para el carrito de compras
export interface CartItem {
  id: string;
  type: 'accommodation' | 'activity' | 'package';
  destinationId: string;
  destinationName: string;
  itemId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  maxGuests: number;
  selectedGuests: number;
  startDate: string;
  endDate?: string;
  availabilityChecked: boolean;
  available: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
  expiresAt: string; // Carrito temporal
  createdAt: string;
  updatedAt: string;
}

// Estados del sistema de reservas
export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  paymentProcessing: boolean;
}

// Filtros para búsqueda de reservas
export interface BookingFilters {
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
  destination?: string;
  provider?: string;
}

// Respuesta de búsqueda de reservas
export interface BookingSearchResult {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

// Para disponibilidad
export interface AvailabilityCheck {
  itemId: string;
  itemType: 'accommodation' | 'activity';
  startDate: string;
  endDate?: string;
  guests: number;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  alternativeDates?: string[];
  maxGuests?: number;
  priceAdjustment?: number;
}