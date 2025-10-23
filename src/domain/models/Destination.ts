// Modelo actualizado para destinos turísticos con toda la funcionalidad del Walking Skeleton

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  department: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string; // "2 horas", "Día completo"
  price: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  category: string;
  included: string[];
  requirements?: string[];
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'Hotel' | 'Hostal' | 'Cabañas' | 'Glamping' | 'Casa Rural';
  description: string;
  pricePerNight: number;
  amenities: string[];
  maxGuests: number;
  images: string[];
  rating: number;
  totalReviews: number;
  available: boolean;
}

export interface Weather {
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  precipitation: number;
  season: 'Seca' | 'Lluviosa';
  bestTimeToVisit: string[];
  currentCondition: string;
}

export interface TourismCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
  includes: string[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;

  // Ubicación y geografía
  location: Location;

  // Multimedia
  images: {
    main: string;
    gallery: string[];
    videos?: string[];
  };

  // Categorización y filtros
  categories: TourismCategory[];
  tourismType: 'Aventura' | 'Cultural' | 'Naturaleza' | 'Gastronómico' | 'Histórico' | 'Religioso' | 'Deportivo' | 'Relajación';
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';

  // Actividades y servicios
  activities: Activity[];
  accommodations: Accommodation[];

  // Información práctica
  priceRange: PriceRange;
  duration: {
    minimum: string; // "1 día"
    recommended: string; // "2-3 días"
  };
  bestTimeToVisit: string[];
  weather: Weather;

  // Logística
  howToGetThere: {
    byBus: string;
    byCar: string;
    byPlane?: string;
    estimatedTime: string;
  };

  // Ratings y reviews
  rating: number;
  totalReviews: number;

  // Disponibilidad y reservas
  available: boolean;
  featured: boolean;

  // SEO y metadatos
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;

  // Fechas
  createdAt: string;
  updatedAt: string;

  // Relaciones
  relatedDestinations?: string[]; // IDs de destinos relacionados
  providerId?: string; // Proveedor de servicios asociado
}

// Filtros para búsqueda
export interface DestinationFilters {
  category?: string[];
  tourismType?: string[];
  priceMin?: number;
  priceMax?: number;
  difficulty?: string[];
  duration?: string;
  rating?: number;
  location?: {
    department?: string;
    city?: string;
  };
  amenities?: string[];
  available?: boolean;
  featured?: boolean;
}

// Para resultados de búsqueda
export interface DestinationSearchResult {
  destinations: Destination[];
  total: number;
  page: number;
  limit: number;
  filters: DestinationFilters;
}

// Estados de carga
export interface DestinationState {
  destinations: Destination[];
  selectedDestination: Destination | null;
  searchResults: DestinationSearchResult | null;
  filters: DestinationFilters;
  loading: boolean;
  error: string | null;
}
