/**
 * Booking Repository
 * TODO: Integrate with backend API
 */

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  activityId?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface CreateBookingParams {
  destinationId: string;
  activityId?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
}

export class BookingRepo {
  /**
   * Create a new booking
   * TODO: Implement with backend API
   */
  static async createBooking(params: CreateBookingParams): Promise<Booking> {
    // Stub implementation
    console.warn('BookingRepo.createBooking not implemented - using mock data');

    return {
      id: `booking-${Date.now()}`,
      userId: 'current-user',
      destinationId: params.destinationId,
      activityId: params.activityId,
      startDate: params.startDate,
      endDate: params.endDate,
      guests: params.guests,
      totalPrice: params.totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Get booking by ID
   */
  static async getBooking(id: string): Promise<Booking | null> {
    console.warn('BookingRepo.getBooking not implemented - using mock data');
    return null;
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string): Promise<Booking[]> {
    console.warn('BookingRepo.getUserBookings not implemented - using mock data');
    return [];
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(id: string): Promise<void> {
    console.warn('BookingRepo.cancelBooking not implemented');
  }
}
