import {
  Booking,
  CreateBookingData,
  BookingFilters,
  PaymentData,
  PaymentResult,
  Cart,
  CartItem,
  AvailabilityCheck,
  AvailabilityResult
} from '../../domain/models/Booking';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté listo

// Mock data para desarrollo
const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    servicePostId: '1',
    providerId: 'provider1',
    serviceTitle: 'Tour Astronómico Nocturno en el Desierto de la Tatacoa',
    serviceImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    serviceType: 'experiencia',
    providerName: 'Carlos Mendoza',
    providerBusinessName: 'Tatacoa Adventures',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    guests: 2,
    checkIn: '2024-02-15',
    totalPrice: 240000,
    currency: 'COP',
    userInfo: {
      name: 'Ana García',
      email: 'ana@email.com',
      phone: '+57 300 123 4567',
      document: '12345678',
      specialRequests: 'Vegetarian meals please'
    },
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
    paymentMethod: 'credit_card',
    transactionId: 'TXN_12345'
  }
];

class BookingApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Crear nueva reserva
  async createBooking(data: CreateBookingData): Promise<Booking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        userId: 'current_user',
        servicePostId: data.servicePostId,
        providerId: 'provider1',
        serviceTitle: 'Tour de ejemplo',
        serviceImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
        serviceType: 'experiencia',
        providerName: 'Proveedor Test',
        providerBusinessName: 'Test Adventures',
        providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        guests: data.guests,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: 150000 * data.guests,
        currency: 'COP',
        userInfo: data.userInfo,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return newBooking;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Obtener reservas del usuario
  async getUserBookings(filters?: BookingFilters): Promise<{ bookings: Booking[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredBookings = [...mockBookings];

      if (filters?.status) {
        filteredBookings = filteredBookings.filter(booking => booking.status === filters.status);
      }

      return {
        bookings: filteredBookings,
        total: filteredBookings.length
      };
    }

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters?.serviceType) params.append('serviceType', filters.serviceType);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/bookings/user?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Obtener una reserva específica
  async getBooking(id: string): Promise<Booking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        throw new Error('Reserva no encontrada');
      }
      return booking;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Cancelar reserva
  async cancelBooking(id: string, reason: string): Promise<Booking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        throw new Error('Reserva no encontrada');
      }

      const updatedBooking = {
        ...booking,
        status: 'cancelled' as const,
        cancellationReason: reason,
        cancellationDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return updatedBooking;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Procesar pago
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular diferentes resultados
      const isSuccess = Math.random() > 0.2; // 80% de éxito

      if (isSuccess) {
        return {
          success: true,
          transactionId: `TXN_${Date.now()}`,
        };
      } else {
        return {
          success: false,
          errorMessage: 'Pago rechazado por el banco',
        };
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Verificar disponibilidad
  async checkAvailability(servicePostId: string, checkIn: string, guests: number, checkOut?: string): Promise<AvailabilityResult> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simular disponibilidad
      const isAvailable = Math.random() > 0.3; // 70% disponible

      if (isAvailable) {
        return {
          available: true,
        };
      } else {
        return {
          available: false,
          reason: 'No hay disponibilidad para las fechas seleccionadas',
          alternativeDates: [
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ],
        };
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/check-availability`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          servicePostId,
          checkIn,
          checkOut,
          guests,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reservas (para proveedores)
  async getBookingStats(providerId?: string): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        total: 45,
        pending: 8,
        confirmed: 25,
        cancelled: 7,
        completed: 5,
        totalRevenue: 12500000,
        monthlyRevenue: 3200000,
        revenueByMonth: [
          { month: 'Enero', revenue: 2800000 },
          { month: 'Febrero', revenue: 3200000 },
          { month: 'Marzo', revenue: 2900000 },
        ],
      };
    }

    try {
      const url = providerId
        ? `${API_BASE_URL}/bookings/stats/provider/${providerId}`
        : `${API_BASE_URL}/bookings/stats`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // Confirmar reserva (para proveedores)
  async confirmBooking(id: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/confirm`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  // Obtener reservas de un proveedor
  async getProviderBookings(providerId: string, filters?: BookingFilters): Promise<{ bookings: Booking[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters?.serviceType) params.append('serviceType', filters.serviceType);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`${API_BASE_URL}/bookings/provider/${providerId}?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
      throw error;
    }
  }
}

export const bookingApi = new BookingApi();