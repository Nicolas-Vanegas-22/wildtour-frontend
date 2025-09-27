import { ServicePost, Review, PostComment, CreateServicePostData } from '../../domain/models/ServicePost';
import { mockServicePosts, mockReviews, mockComments } from '../../data/mockServicePosts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK_DATA = false; // Cambiar a false cuando el backend esté listo

class ServicePostApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private getFormDataHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Obtener todas las publicaciones (feed)
  async getServicePosts(filters?: {
    location?: string;
    serviceType?: string;
    priceRange?: { min: number; max: number };
    page?: number;
    limit?: number;
  }): Promise<{ posts: ServicePost[]; total: number; hasMore: boolean }> {
    if (USE_MOCK_DATA) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredPosts = [...mockServicePosts];

      // Aplicar filtros si existen
      if (filters?.serviceType && filters.serviceType !== '') {
        filteredPosts = filteredPosts.filter(post => post.serviceType === filters.serviceType);
      }

      if (filters?.location && filters.location !== '') {
        filteredPosts = filteredPosts.filter(post =>
          post.location.name.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      return {
        posts: filteredPosts,
        total: filteredPosts.length,
        hasMore: false
      };
    }

    try {
      const params = new URLSearchParams();
      if (filters?.location) params.append('location', filters.location);
      if (filters?.serviceType) params.append('serviceType', filters.serviceType);
      if (filters?.priceRange) {
        params.append('priceMin', filters.priceRange.min.toString());
        params.append('priceMax', filters.priceRange.max.toString());
      }
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/service-posts?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service posts:', error);
      throw error;
    }
  }

  // Obtener una publicación específica
  async getServicePost(id: string): Promise<ServicePost> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service post:', error);
      throw error;
    }
  }

  // Crear nueva publicación
  async createServicePost(data: CreateServicePostData): Promise<ServicePost> {
    try {
      const formData = new FormData();

      // Agregar datos básicos
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('serviceType', data.serviceType);
      formData.append('price', JSON.stringify(data.price));
      formData.append('location', JSON.stringify(data.location));
      formData.append('availability', JSON.stringify(data.availability));
      formData.append('features', JSON.stringify(data.features));
      formData.append('tags', JSON.stringify(data.tags));

      // Agregar imágenes
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await fetch(`${API_BASE_URL}/service-posts`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating service post:', error);
      throw error;
    }
  }

  // Actualizar publicación
  async updateServicePost(id: string, data: Partial<CreateServicePostData>): Promise<ServicePost> {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append('images', image);
          });
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(`${API_BASE_URL}/service-posts/${id}`, {
        method: 'PUT',
        headers: this.getFormDataHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating service post:', error);
      throw error;
    }
  }

  // Eliminar publicación
  async deleteServicePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting service post:', error);
      throw error;
    }
  }

  // Dar like a una publicación
  async likePost(id: string): Promise<ServicePost> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${id}/like`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // Quitar like de una publicación
  async unlikePost(id: string): Promise<ServicePost> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${id}/unlike`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Guardar/quitar de favoritos
  async bookmarkPost(id: string): Promise<ServicePost> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${id}/bookmark`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  }

  // Obtener reseñas de una publicación
  async getReviews(postId: string, page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const postReviews = mockReviews.filter(review => review.servicePostId === postId);
      return {
        reviews: postReviews,
        total: postReviews.length
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${postId}/reviews?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Crear reseña
  async createReview(postId: string, data: { rating: number; comment: string; images?: File[] }): Promise<Review> {
    try {
      const formData = new FormData();
      formData.append('rating', data.rating.toString());
      formData.append('comment', data.comment);

      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/service-posts/${postId}/reviews`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Obtener comentarios de una publicación
  async getComments(postId: string, page: number = 1, limit: number = 10): Promise<{ comments: PostComment[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const postComments = mockComments.filter(comment => comment.servicePostId === postId);
      return {
        comments: postComments,
        total: postComments.length
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${postId}/comments?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Crear comentario
  async createComment(postId: string, content: string): Promise<PostComment> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-posts/${postId}/comments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }
}

export const servicePostApi = new ServicePostApi();