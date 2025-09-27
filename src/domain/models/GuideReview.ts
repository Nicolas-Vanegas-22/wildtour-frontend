// Modelos específicos para el sistema de calificaciones de guías turísticos

export interface GuideRatingCategories {
  knowledge: number; // Conocimiento del área/especialidad (1-5)
  communication: number; // Habilidades de comunicación (1-5)
  punctuality: number; // Puntualidad y responsabilidad (1-5)
  professionalism: number; // Profesionalismo y actitud (1-5)
  overall: number; // Calificación general (1-5)
}

export interface GuideReviewMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface GuideReview {
  id: string;

  // Información del revisor
  userId: string;
  userName: string;
  userAvatar?: string;

  // Información del guía
  guideId: string;
  guideName: string;

  // Información del tour
  tourDate: string;
  tourType: string; // 'Astronomía y Geología', 'Ecoturismo', etc.
  tourDuration: number; // en horas
  groupSize: number;
  bookingId?: string; // Referencia a la reserva si existe

  // Contenido de la review
  title: string;
  comment: string;
  rating: GuideRatingCategories;

  // Multimedia
  media: GuideReviewMedia[];

  // Información del viaje
  travelWith: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  recommendedFor: string[]; // ['familias', 'aventureros', 'parejas', 'fotógrafos']

  // Interacciones
  helpfulVotes: number;
  reportedCount: number;

  // Verificación
  verified: boolean; // Si viene de una reserva confirmada

  // Estado
  status: 'pending' | 'approved' | 'rejected' | 'hidden';

  // Fechas
  createdAt: string;
  updatedAt?: string;

  // Respuesta del guía
  guideResponse?: {
    id: string;
    content: string;
    createdAt: string;
  };
}

// Para crear una nueva review de guía
export interface CreateGuideReviewRequest {
  guideId: string;
  tourDate: string;
  tourType: string;
  tourDuration: number;
  groupSize: number;
  bookingId?: string;
  title: string;
  comment: string;
  rating: GuideRatingCategories;
  media?: File[];
  travelWith: GuideReview['travelWith'];
  recommendedFor: string[];
}

// Estadísticas de un guía
export interface GuideStats {
  totalReviews: number;
  averageRating: number;
  categoryAverages: GuideRatingCategories;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  responseRate: number; // Porcentaje de reviews con respuesta del guía
  recommendationRate: number; // Porcentaje de reviews que lo recomiendan
  recentActivity: {
    lastReview: string;
    reviewsThisMonth: number;
    reviewsThisYear: number;
  };
}

// Información extendida del guía con estadísticas
export interface GuideProfile {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  certifications: string[];
  contact: string;
  pricePerDay: number;
  avatar?: string;
  bio?: string;

  // Información adicional
  location: string;
  availableDays: string[];
  maxGroupSize: number;
  equipmentIncluded: string[];

  // Estadísticas y reviews
  stats: GuideStats;
  reviews: GuideReview[];

  // Estado
  isActive: boolean;
  isVerified: boolean;
  joinedDate: string;
  lastActiveDate: string;
}

// Filtros para búsqueda de reviews de guías
export interface GuideReviewFilters {
  guideId?: string;
  rating?: number[]; // [4, 5] para 4-5 estrellas
  tourType?: string[];
  travelWith?: GuideReview['travelWith'][];
  verified?: boolean;
  hasMedia?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_rated' | 'lowest_rated' | 'most_helpful';
}

// Resultado de búsqueda de reviews de guías
export interface GuideReviewSearchResult {
  reviews: GuideReview[];
  total: number;
  page: number;
  limit: number;
  averageRating: number;
  stats: GuideStats;
}

// Para responder a una review (guía)
export interface CreateGuideResponseRequest {
  reviewId: string;
  content: string;
}

// Para reportar una review de guía
export interface ReportGuideReview {
  reviewId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'personal_attack' | 'off_topic' | 'other';
  description?: string;
  reportedBy: string;
  reportedAt: string;
}

// Estado del sistema de reviews de guías
export interface GuideReviewState {
  guides: GuideProfile[];
  currentGuide: GuideProfile | null;
  reviews: GuideReview[];
  searchResults: GuideReviewSearchResult | null;
  filters: GuideReviewFilters;
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

// Métricas para el dashboard
export interface GuideMetrics {
  totalGuides: number;
  activeGuides: number;
  averageRating: number;
  totalReviews: number;
  pendingReviews: number;
  topRatedGuides: {
    guideId: string;
    guideName: string;
    averageRating: number;
    totalReviews: number;
  }[];
  popularSpecialties: {
    specialty: string;
    guideCount: number;
    averageRating: number;
  }[];
  recentActivity: {
    date: string;
    newReviews: number;
    newGuides: number;
  }[];
}

// Configuración de categorías de rating
export const RATING_CATEGORIES = {
  knowledge: {
    label: 'Conocimiento',
    description: 'Dominio del área y especialidad',
    icon: 'GraduationCap'
  },
  communication: {
    label: 'Comunicación',
    description: 'Claridad en explicaciones y trato',
    icon: 'MessageCircle'
  },
  punctuality: {
    label: 'Puntualidad',
    description: 'Cumplimiento de horarios acordados',
    icon: 'Clock'
  },
  professionalism: {
    label: 'Profesionalismo',
    description: 'Actitud y presentación profesional',
    icon: 'Star'
  },
  overall: {
    label: 'Calificación General',
    description: 'Experiencia general con el guía',
    icon: 'Trophy'
  }
} as const;

// Tipos de tours disponibles
export const TOUR_TYPES = [
  'Astronomía y Geología',
  'Ecoturismo y Flora Desértica',
  'Historia y Paleontología',
  'Fotografía Nocturna',
  'Senderismo y Aventura',
  'Tour Cultural',
  'Observación de Fauna',
  'Tour Gastronómico'
] as const;

// Opciones para viajar con
export const TRAVEL_WITH_OPTIONS = [
  { value: 'solo', label: 'Solo', icon: 'User' },
  { value: 'couple', label: 'En pareja', icon: 'Heart' },
  { value: 'family', label: 'En familia', icon: 'Users' },
  { value: 'friends', label: 'Con amigos', icon: 'UserPlus' },
  { value: 'business', label: 'Viaje de negocios', icon: 'Briefcase' }
] as const;

// Opciones para recomendado para
export const RECOMMENDED_FOR_OPTIONS = [
  'Familias con niños',
  'Parejas románticas',
  'Aventureros experimentados',
  'Principiantes',
  'Fotógrafos',
  'Estudiantes',
  'Adultos mayores',
  'Grupos grandes',
  'Viajeros solitarios'
] as const;