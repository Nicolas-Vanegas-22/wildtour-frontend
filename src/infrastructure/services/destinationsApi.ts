import { api } from '../http/apiClient';
import {
  ApiResponse,
  BackendDestination,
  PaginatedResponse,
  PaginationParams,
  handleApiError
} from '../http/apiTypes';
import { Destination, DestinationFilters } from '../../domain/models/Destination';

/**
 * Service for Destinations API
 * Connects to .NET backend endpoints
 *
 * TODO: Backend .NET needs to implement these endpoints:
 * - GET /api/destinations
 * - GET /api/destinations/:id
 * - POST /api/destinations (Admin/Provider only)
 * - PUT /api/destinations/:id (Admin/Provider only)
 * - DELETE /api/destinations/:id (Admin only)
 */

class DestinationsApi {
  /**
   * Get all destinations with optional filters and pagination
   */
  async getDestinations(
    filters?: DestinationFilters,
    pagination?: PaginationParams
  ): Promise<{ destinations: Destination[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();

      // Pagination
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.pageSize) params.append('pageSize', pagination.pageSize.toString());
      if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);

      // Filters
      if (filters?.category) params.append('category', filters.category.join(','));
      if (filters?.tourismType) params.append('tourismType', filters.tourismType.join(','));
      if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
      if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
      if (filters?.difficulty) params.append('difficulty', filters.difficulty.join(','));
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.location?.department) params.append('department', filters.location.department);
      if (filters?.location?.city) params.append('city', filters.location.city);
      if (filters?.available !== undefined) params.append('available', filters.available.toString());
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());

      const response = await api.get<ApiResponse<PaginatedResponse<BackendDestination>>>(
        `/destinations?${params.toString()}`
      );

      const data = response.data as any as PaginatedResponse<BackendDestination>;

      // Transform backend destinations to frontend format
      const destinations = data.items.map(this.transformDestination);

      return {
        destinations,
        total: data.totalCount,
        hasMore: data.hasNextPage,
      };
    } catch (error: any) {
      console.error('Error fetching destinations:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single destination by ID
   */
  async getDestination(id: string): Promise<Destination> {
    try {
      const response = await api.get<ApiResponse<BackendDestination>>(
        `/destinations/${id}`
      );

      const backendDestination = response.data as any as BackendDestination;
      return this.transformDestination(backendDestination);
    } catch (error: any) {
      console.error('Error fetching destination:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new destination (Provider/Admin only)
   */
  async createDestination(data: Partial<Destination>): Promise<Destination> {
    try {
      const response = await api.post<ApiResponse<BackendDestination>>(
        '/destinations',
        this.transformToBackend(data)
      );

      const backendDestination = response.data as any as BackendDestination;
      return this.transformDestination(backendDestination);
    } catch (error: any) {
      console.error('Error creating destination:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update an existing destination (Provider/Admin only)
   */
  async updateDestination(id: string, data: Partial<Destination>): Promise<Destination> {
    try {
      const response = await api.put<ApiResponse<BackendDestination>>(
        `/destinations/${id}`,
        this.transformToBackend(data)
      );

      const backendDestination = response.data as any as BackendDestination;
      return this.transformDestination(backendDestination);
    } catch (error: any) {
      console.error('Error updating destination:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a destination (Admin only)
   */
  async deleteDestination(id: string): Promise<void> {
    try {
      await api.delete(`/destinations/${id}`);
    } catch (error: any) {
      console.error('Error deleting destination:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Transform backend destination to frontend format
   */
  private transformDestination(backendDest: BackendDestination): Destination {
    return {
      id: backendDest.id.toString(),
      name: backendDest.name || '',
      slug: backendDest.name?.toLowerCase().replace(/\s+/g, '-') || '',
      description: backendDest.description || '',
      shortDescription: backendDest.description?.substring(0, 150) || '',

      location: {
        latitude: backendDest.latitude || 0,
        longitude: backendDest.longitude || 0,
        address: '',
        city: backendDest.region || '',
        department: backendDest.region || '',
        country: backendDest.country || 'Colombia',
        coordinates: {
          lat: backendDest.latitude || 0,
          lng: backendDest.longitude || 0,
        },
      },

      images: {
        main: '/placeholder-destination.jpg',
        gallery: [],
      },

      categories: [],
      tourismType: 'Naturaleza',
      difficulty: 'Moderado',

      activities: [],
      accommodations: [],

      priceRange: {
        min: 0,
        max: 0,
        currency: 'COP',
        includes: [],
      },

      duration: {
        minimum: '1 día',
        recommended: '2-3 días',
      },

      bestTimeToVisit: [],
      weather: {
        temperature: { min: 18, max: 28, avg: 23 },
        humidity: 70,
        precipitation: 1200,
        season: 'Seca',
        bestTimeToVisit: [],
        currentCondition: 'Soleado',
      },

      howToGetThere: {
        byBus: '',
        byCar: '',
        estimatedTime: '',
      },

      rating: 0,
      totalReviews: 0,

      available: backendDest.isActive,
      featured: false,

      tags: [],

      createdAt: backendDest.createdAt,
      updatedAt: backendDest.updatedAt || backendDest.createdAt,
    };
  }

  /**
   * Transform frontend destination to backend format
   */
  private transformToBackend(dest: Partial<Destination>): Partial<BackendDestination> {
    return {
      name: dest.name,
      description: dest.description,
      country: dest.location?.country,
      region: dest.location?.department || dest.location?.city,
      latitude: dest.location?.latitude,
      longitude: dest.location?.longitude,
      isActive: dest.available,
    };
  }
}

export const destinationsApi = new DestinationsApi();
