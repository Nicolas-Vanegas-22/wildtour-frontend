// Modelos para reviews de diferentes tipos de servicios en Villavieja

export type ServiceType = 'transportation' | 'equipment' | 'health' | 'fuel';

// Categorías de rating específicas para cada tipo de servicio
export interface TransportationRatingCategories {
  punctuality: number; // Puntualidad (1-5)
  comfort: number; // Comodidad del vehículo (1-5)
  safety: number; // Seguridad del viaje (1-5)
  driverService: number; // Atención del conductor (1-5)
  overall: number; // Calificación general (1-5)
}

export interface EquipmentRatingCategories {
  quality: number; // Calidad del equipo (1-5)
  condition: number; // Estado de conservación (1-5)
  functionality: number; // Funcionalidad (1-5)
  valueForMoney: number; // Relación precio-calidad (1-5)
  overall: number; // Calificación general (1-5)
}

export interface HealthServiceRatingCategories {
  attention: number; // Atención recibida (1-5)
  facilities: number; // Instalaciones (1-5)
  professionalism: number; // Profesionalismo del personal (1-5)
  availability: number; // Disponibilidad/tiempos de espera (1-5)
  overall: number; // Calificación general (1-5)
}

export interface FuelServiceRatingCategories {
  serviceSpeed: number; // Velocidad del servicio (1-5)
  fuelQuality: number; // Calidad del combustible (1-5)
  facilities: number; // Estado de las instalaciones (1-5)
  priceCompetitive: number; // Competitividad de precios (1-5)
  overall: number; // Calificación general (1-5)
}

// Unión de todos los tipos de rating
export type ServiceRatingCategories =
  | TransportationRatingCategories
  | EquipmentRatingCategories
  | HealthServiceRatingCategories
  | FuelServiceRatingCategories;

export interface ServiceReviewMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  uploadedAt: string;
}

// Review base para cualquier servicio
export interface ServiceReview {
  id: string;

  // Información del revisor
  userId: string;
  userName: string;
  userAvatar?: string;

  // Información del servicio
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  providerName: string;

  // Información de la experiencia
  serviceDate: string;
  duration?: number; // en minutos para transporte, días para equipos

  // Contenido de la review
  title: string;
  comment: string;
  rating: ServiceRatingCategories;

  // Multimedia
  media: ServiceReviewMedia[];

  // Información del uso
  usedFor: string; // 'tourism' | 'emergency' | 'recreation' | 'work'
  groupSize?: number;
  recommendedFor: string[]; // Tipo de viajeros que lo recomendaría

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

  // Respuesta del proveedor
  providerResponse?: {
    id: string;
    content: string;
    createdAt: string;
  };
}

// Para crear una nueva review de servicio
export interface CreateServiceReviewRequest {
  serviceId: string;
  serviceType: ServiceType;
  serviceName: string;
  providerName: string;
  serviceDate: string;
  duration?: number;
  title: string;
  comment: string;
  rating: ServiceRatingCategories;
  media?: File[];
  usedFor: string;
  groupSize?: number;
  recommendedFor: string[];
}

// Estadísticas de un servicio
export interface ServiceStats {
  totalReviews: number;
  averageRating: number;
  categoryAverages: ServiceRatingCategories;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  responseRate: number; // Porcentaje de reviews con respuesta del proveedor
  recentActivity: {
    lastReview: string;
    reviewsThisMonth: number;
    reviewsThisYear: number;
  };
}

// Información extendida del servicio con estadísticas
export interface ServiceWithReviews {
  id: string;
  name: string;
  type: ServiceType;
  provider: string;
  description?: string;
  baseInfo: any; // Los datos originales del servicio

  // Estadísticas y reviews
  stats: ServiceStats;
  reviews: ServiceReview[];

  // Estado
  isActive: boolean;
  isVerified: boolean;
}

// Configuración de categorías de rating por tipo de servicio
export const SERVICE_RATING_CATEGORIES = {
  transportation: {
    punctuality: {
      label: 'Puntualidad',
      description: 'Cumplimiento de horarios',
      icon: 'Clock'
    },
    comfort: {
      label: 'Comodidad',
      description: 'Confort del vehículo',
      icon: 'Car'
    },
    safety: {
      label: 'Seguridad',
      description: 'Seguridad durante el viaje',
      icon: 'Shield'
    },
    driverService: {
      label: 'Atención',
      description: 'Servicio del conductor',
      icon: 'UserCheck'
    },
    overall: {
      label: 'Calificación General',
      description: 'Experiencia general del servicio',
      icon: 'Star'
    }
  },
  equipment: {
    quality: {
      label: 'Calidad',
      description: 'Calidad del equipo',
      icon: 'Wrench'
    },
    condition: {
      label: 'Estado',
      description: 'Estado de conservación',
      icon: 'Sparkles'
    },
    functionality: {
      label: 'Funcionalidad',
      description: 'Funcionamiento correcto',
      icon: 'Settings'
    },
    valueForMoney: {
      label: 'Precio-Calidad',
      description: 'Relación precio-calidad',
      icon: 'DollarSign'
    },
    overall: {
      label: 'Calificación General',
      description: 'Experiencia general del equipo',
      icon: 'Star'
    }
  },
  health: {
    attention: {
      label: 'Atención',
      description: 'Atención recibida',
      icon: 'Stethoscope'
    },
    facilities: {
      label: 'Instalaciones',
      description: 'Estado de instalaciones',
      icon: 'Building'
    },
    professionalism: {
      label: 'Profesionalismo',
      description: 'Profesionalismo del personal',
      icon: 'GraduationCap'
    },
    availability: {
      label: 'Disponibilidad',
      description: 'Tiempos de espera',
      icon: 'Timer'
    },
    overall: {
      label: 'Calificación General',
      description: 'Experiencia general del servicio',
      icon: 'Star'
    }
  },
  fuel: {
    serviceSpeed: {
      label: 'Velocidad',
      description: 'Rapidez del servicio',
      icon: 'Zap'
    },
    fuelQuality: {
      label: 'Calidad Combustible',
      description: 'Calidad del combustible',
      icon: 'Fuel'
    },
    facilities: {
      label: 'Instalaciones',
      description: 'Estado de instalaciones',
      icon: 'Store'
    },
    priceCompetitive: {
      label: 'Precios',
      description: 'Competitividad de precios',
      icon: 'TrendingDown'
    },
    overall: {
      label: 'Calificación General',
      description: 'Experiencia general del servicio',
      icon: 'Star'
    }
  }
} as const;

// Opciones para "usado para"
export const USED_FOR_OPTIONS = [
  { value: 'tourism', label: 'Turismo', icon: 'Map' },
  { value: 'emergency', label: 'Emergencia', icon: 'AlertTriangle' },
  { value: 'recreation', label: 'Recreación', icon: 'PartyPopper' },
  { value: 'work', label: 'Trabajo', icon: 'Briefcase' }
] as const;

// Opciones para recomendado para
export const SERVICE_RECOMMENDED_FOR_OPTIONS = [
  'Familias con niños',
  'Parejas',
  'Viajeros solitarios',
  'Grupos grandes',
  'Turistas nacionales',
  'Turistas extranjeros',
  'Aventureros',
  'Principiantes',
  'Personas mayores',
  'Viajeros con presupuesto limitado',
  'Viajeros de lujo',
  'Personas con movilidad reducida'
] as const;

// Estado del sistema de reviews de servicios
export interface ServiceReviewState {
  services: ServiceWithReviews[];
  currentService: ServiceWithReviews | null;
  reviews: ServiceReview[];
  searchResults: ServiceReview[] | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
}