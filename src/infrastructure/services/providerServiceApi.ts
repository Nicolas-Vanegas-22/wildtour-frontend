import { api } from '../http/apiClient';
import {
  ProviderService,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceListResponse,
  ServiceReview,
  CreateReviewRequest,
  ReviewListResponse,
} from '../../domain/models/ProviderService';

// ============================================
// GESTIÓN DE SERVICIOS DEL PROVEEDOR
// ============================================

export const providerServiceApi = {
  /**
   * Obtener todos los servicios del proveedor autenticado
   */
  async getMyServices(page: number = 1, pageSize: number = 10): Promise<ServiceListResponse> {
    const response = await api.get<ServiceListResponse>('/provider/services', {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * Obtener un servicio específico por ID
   */
  async getServiceById(id: string): Promise<ProviderService> {
    const response = await api.get<ProviderService>(`/provider/services/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo servicio
   */
  async createService(data: CreateServiceRequest): Promise<ProviderService> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());

    // Agregar imágenes
    data.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const response = await api.post<ProviderService>('/provider/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Actualizar un servicio existente
   */
  async updateService(data: UpdateServiceRequest): Promise<ProviderService> {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.price !== undefined) formData.append('price', data.price.toString());

    // Agregar imágenes (tanto nuevas como existentes)
    if (data.images) {
      const existingImages: string[] = [];
      const newImages: File[] = [];

      data.images.forEach((img) => {
        if (typeof img === 'string') {
          existingImages.push(img);
        } else {
          newImages.push(img);
        }
      });

      // URLs de imágenes existentes
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      // Nuevas imágenes
      newImages.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.put<ProviderService>(`/provider/services/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Eliminar un servicio
   */
  async deleteService(id: string): Promise<void> {
    await api.delete(`/provider/services/${id}`);
  },

  /**
   * Activar/desactivar un servicio
   */
  async toggleServiceStatus(id: string, isActive: boolean): Promise<ProviderService> {
    const response = await api.patch<ProviderService>(`/provider/services/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};

// ============================================
// GESTIÓN DE RESEÑAS
// ============================================

export const reviewApi = {
  /**
   * Obtener reseñas de un servicio
   */
  async getServiceReviews(serviceId: string, page: number = 1, pageSize: number = 10): Promise<ReviewListResponse> {
    const response = await api.get<ReviewListResponse>(`/services/${serviceId}/reviews`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * Crear una nueva reseña (para turistas)
   */
  async createReview(data: CreateReviewRequest): Promise<ServiceReview> {
    const response = await api.post<ServiceReview>('/reviews', data);
    return response.data;
  },

  /**
   * Actualizar una reseña existente
   */
  async updateReview(id: string, rating: number, comment: string): Promise<ServiceReview> {
    const response = await api.put<ServiceReview>(`/reviews/${id}`, {
      rating,
      comment,
    });
    return response.data;
  },

  /**
   * Eliminar una reseña
   */
  async deleteReview(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },
};
