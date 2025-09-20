// Modelos para el sistema de opiniones y calificaciones

export interface ReviewRating {
  overall: number; // 1-5 estrellas
  categories: {
    service: number;
    cleanliness: number;
    location: number;
    valueForMoney: number;
    facilities: number;
  };
}

export interface ReviewMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface ReviewResponse {
  id: string;
  authorId: string; // ID del proveedor que responde
  authorName: string;
  authorRole: 'provider' | 'admin';
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReviewStatus =
  | 'pending'     // Esperando moderación
  | 'approved'    // Aprobada y visible
  | 'rejected'    // Rechazada por moderación
  | 'hidden'      // Oculta por el administrador
  | 'flagged';    // Reportada por usuarios

export interface Review {
  id: string;

  // Relaciones
  userId: string;
  userName: string;
  userAvatar?: string;
  destinationId: string;
  destinationName: string;
  bookingId?: string; // Opcional: vinculada a una reserva específica

  // Contenido de la reseña
  title: string;
  content: string;
  rating: ReviewRating;

  // Multimedia
  media: ReviewMedia[];

  // Información adicional
  travelDate: string; // Cuándo visitó el destino
  travelWith: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  recommendedFor: string[]; // ['familias', 'aventureros', 'parejas']

  // Moderación y estado
  status: ReviewStatus;
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;

  // Interacciones
  helpfulVotes: number; // Votos de "útil"
  reportedCount: number; // Número de reportes
  response?: ReviewResponse;

  // Verificación
  verified: boolean; // Si viene de una reserva confirmada

  // Fechas
  createdAt: string;
  updatedAt?: string;

  // Para respuestas anidadas
  replies?: Review[]; // Respuestas de otros usuarios (opcional)
}

// Para crear una nueva reseña
export interface CreateReviewRequest {
  destinationId: string;
  bookingId?: string;
  title: string;
  content: string;
  rating: ReviewRating;
  media?: File[];
  travelDate: string;
  travelWith: Review['travelWith'];
  recommendedFor: string[];
}

// Para responder a una reseña
export interface CreateResponseRequest {
  reviewId: string;
  content: string;
}

// Estadísticas de reseñas para un destino
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    service: number;
    cleanliness: number;
    location: number;
    valueForMoney: number;
    facilities: number;
  };
  verifiedReviews: number;
  recentReviews: number; // Últimos 30 días
}

// Filtros para búsqueda de reseñas
export interface ReviewFilters {
  destinationId?: string;
  userId?: string;
  status?: ReviewStatus[];
  rating?: number[]; // [4, 5] para 4-5 estrellas
  verified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  travelWith?: Review['travelWith'][];
  hasMedia?: boolean;
  sortBy?: 'newest' | 'oldest' | 'highest_rated' | 'lowest_rated' | 'most_helpful';
}

// Resultado de búsqueda de reseñas
export interface ReviewSearchResult {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  stats: ReviewStats;
}

// Estado del sistema de reseñas
export interface ReviewState {
  reviews: Review[];
  currentReview: Review | null;
  searchResults: ReviewSearchResult | null;
  filters: ReviewFilters;
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

// Para reportar una reseña
export interface ReportReview {
  reviewId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'personal_attack' | 'off_topic' | 'other';
  description?: string;
  reportedBy: string;
  reportedAt: string;
}

// Para moderar reseñas (admin)
export interface ModerationAction {
  reviewId: string;
  action: 'approve' | 'reject' | 'hide' | 'request_changes';
  reason?: string;
  notes?: string;
  moderatedBy: string;
}

// Métricas para el dashboard de admin
export interface ReviewMetrics {
  totalReviews: number;
  pendingModeration: number;
  averageRating: number;
  reviewsThisMonth: number;
  reportedReviews: number;
  topRatedDestinations: {
    destinationId: string;
    destinationName: string;
    averageRating: number;
    totalReviews: number;
  }[];
  recentActivity: {
    date: string;
    newReviews: number;
    moderatedReviews: number;
  }[];
}
