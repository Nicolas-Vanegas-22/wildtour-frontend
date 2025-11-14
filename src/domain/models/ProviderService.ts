// ============================================
// TIPOS Y MODELOS PARA SERVICIOS DE PROVEEDORES
// ============================================

export type ServiceCategory =
  | 'alojamiento'
  | 'alimentacion'
  | 'recorrido'
  | 'astronomicas'
  | 'sitios_interes';

export interface ServiceImage {
  id?: string;
  url: string;
  file?: File; // Para subida de archivos
  alt?: string;
  isPrimary?: boolean;
}

export interface ProviderService {
  id: string;
  providerId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  images: ServiceImage[];
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  images: File[];
}

export interface UpdateServiceRequest {
  id: string;
  name?: string;
  description?: string;
  category?: ServiceCategory;
  price?: number;
  images?: (File | string)[]; // File para nuevas imágenes, string para URLs existentes
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  serviceId: string;
  rating: number;
  comment: string;
}

export interface ServiceListResponse {
  services: ProviderService[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewListResponse {
  reviews: ServiceReview[];
  total: number;
  averageRating: number;
}
