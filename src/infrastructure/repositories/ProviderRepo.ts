/**
 * Provider Repository
 * TODO: Integrate with backend API
 */

export interface ProviderStats {
  totalBookings: number;
  totalRevenue: number;
  activeListings: number;
  averageRating: number;
  pendingBookings: number;
}

export interface ProviderListing {
  id: string;
  name: string;
  type: 'destination' | 'activity' | 'accommodation';
  status: 'active' | 'inactive' | 'pending';
  bookings: number;
  revenue: number;
}

export class ProviderRepo {
  /**
   * Get provider dashboard stats
   */
  static async getProviderStats(providerId: string): Promise<ProviderStats> {
    console.warn('ProviderRepo.getProviderStats not implemented - using mock data');

    return {
      totalBookings: 125,
      totalRevenue: 15600000,
      activeListings: 8,
      averageRating: 4.7,
      pendingBookings: 3,
    };
  }

  /**
   * Get provider listings
   */
  static async getProviderListings(providerId: string): Promise<ProviderListing[]> {
    console.warn('ProviderRepo.getProviderListings not implemented - using mock data');
    return [];
  }

  /**
   * Create new listing
   */
  static async createListing(providerId: string, data: any): Promise<ProviderListing> {
    console.warn('ProviderRepo.createListing not implemented - using mock data');

    return {
      id: `listing-${Date.now()}`,
      name: data.name,
      type: data.type,
      status: 'pending',
      bookings: 0,
      revenue: 0,
    };
  }
}
