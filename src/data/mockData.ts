// Datos de prueba para el Walking Skeleton de WildTour Colombia

import { Destination, TourismCategory, Activity, Accommodation, Weather, Location } from '../domain/models/Destination';
import { Review, ReviewRating } from '../domain/models/Review';
import { Booking, BookingStatus } from '../domain/models/Booking';

// Categorías de turismo
export const tourismCategories: TourismCategory[] = [
  {
    id: '1',
    name: 'Aventura',
    icon: 'Mountain',
    description: 'Actividades emocionantes y deportes extremos'
  },
  {
    id: '2',
    name: 'Naturaleza',
    icon: 'Leaf',
    description: 'Ecoturismo y observación de vida silvestre'
  },
  {
    id: '3',
    name: 'Cultural',
    icon: 'Theater',
    description: 'Historia, arte y tradiciones locales'
  },
  {
    id: '4',
    name: 'Gastronomía',
    icon: 'Utensils',
    description: 'Experiencias culinarias regionales'
  },
  {
    id: '5',
    name: 'Relajación',
    icon: 'Heart',
    description: 'Spa, termas y bienestar'
  }
];

// Actividades de ejemplo
const sampleActivities: Activity[] = [
  {
    id: 'act1',
    name: 'Rafting en el Río Magdalena',
    description: 'Descenso emocionante por las aguas bravas del río más importante de Colombia',
    duration: '4 horas',
    price: 120000,
    difficulty: 'Moderado',
    category: 'Aventura',
    included: ['Equipo de seguridad', 'Guía experto', 'Transporte', 'Refrigerio'],
    requirements: ['Saber nadar', 'Mayor de 12 años']
  },
  {
    id: 'act2',
    name: 'Tour Arqueológico',
    description: 'Visita guiada a las estatuas y tumbas precolombinas',
    duration: '3 horas',
    price: 80000,
    difficulty: 'Fácil',
    category: 'Cultural',
    included: ['Guía especializado', 'Entrada al parque', 'Material informativo'],
    requirements: ['Calzado cómodo']
  },
  {
    id: 'act3',
    name: 'Avistamiento de Aves',
    description: 'Observación de especies endémicas en el bosque seco tropical',
    duration: '5 horas',
    price: 95000,
    difficulty: 'Fácil',
    category: 'Naturaleza',
    included: ['Binoculares', 'Guía ornitólogo', 'Desayuno campestre'],
    requirements: ['Ropa cómoda', 'Protector solar']
  }
];

// Alojamientos de ejemplo
const sampleAccommodations: Accommodation[] = [
  {
    id: 'acc1',
    name: 'Hotel Boutique Magdalena',
    type: 'Hotel',
    description: 'Hotel de lujo con vista al río y arquitectura colonial moderna',
    pricePerNight: 280000,
    amenities: ['WiFi', 'Piscina', 'Spa', 'Restaurante', 'Bar', 'Aire acondicionado'],
    maxGuests: 4,
    images: ['hotel1.jpg', 'hotel2.jpg'],
    rating: 4.8,
    totalReviews: 245,
    available: true
  },
  {
    id: 'acc2',
    name: 'Glamping Valle Encantado',
    type: 'Glamping',
    description: 'Experiencia única bajo las estrellas con todas las comodidades',
    pricePerNight: 180000,
    amenities: ['Baño privado', 'Desayuno incluido', 'Fogata', 'Hamacas'],
    maxGuests: 2,
    images: ['glamping1.jpg', 'glamping2.jpg'],
    rating: 4.6,
    totalReviews: 128,
    available: true
  }
];

// Datos del clima
const sampleWeather: Weather = {
  temperature: {
    min: 18,
    max: 28,
    avg: 23
  },
  humidity: 70,
  precipitation: 150,
  season: 'Seca',
  bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero', 'Marzo'],
  currentCondition: 'Soleado con nubes dispersas'
};

// Destinos de prueba
export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Parque Arqueológico San Agustín',
    slug: 'parque-arqueologico-san-agustin',
    description: 'Descubre las misteriosas estatuas de piedra dejadas por la cultura San Agustín hace más de 1000 años. Este sitio Patrimonio de la Humanidad por la UNESCO alberga la mayor colección de monumentos megalíticos de América del Sur.',
    shortDescription: 'Sitio arqueológico UNESCO con estatuas de piedra milenarias',
    location: {
      latitude: 1.8833,
      longitude: -76.2667,
      address: 'Parque Arqueológico San Agustín',
      city: 'San Agustín',
      department: 'Huila',
      country: 'Colombia'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop'
      ]
    },
    categories: [tourismCategories[2], tourismCategories[1]], // Cultural, Naturaleza
    tourismType: 'Cultural',
    difficulty: 'Fácil',
    activities: sampleActivities,
    accommodations: sampleAccommodations,
    priceRange: {
      min: 50000,
      max: 400000,
      currency: 'COP',
      includes: ['Entrada al parque', 'Tour básico']
    },
    duration: {
      minimum: '1 día',
      recommended: '2-3 días'
    },
    bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Julio', 'Agosto'],
    weather: sampleWeather,
    howToGetThere: {
      byBus: 'Desde Neiva: 2 horas en bus intermunicipal',
      byCar: 'Vía Neiva-San Agustín, carretera pavimentada',
      estimatedTime: '2 horas desde Neiva'
    },
    rating: 4.7,
    totalReviews: 324,
    available: true,
    featured: true,
    tags: ['arqueología', 'unesco', 'historia', 'cultura', 'piedra', 'precolombino'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Desierto de la Tatacoa',
    slug: 'desierto-de-la-tatacoa',
    description: 'Un paisaje surrealista de formaciones rocosas rojizas y grises que crean un escenario único en Colombia. Perfecto para la observación astronómica y caminatas por senderos desérticos.',
    shortDescription: 'Desierto con formaciones rocosas únicas y cielos estrellados',
    location: {
      latitude: 3.2333,
      longitude: -75.1667,
      address: 'Desierto de la Tatacoa',
      city: 'Villavieja',
      department: 'Huila',
      country: 'Colombia'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ]
    },
    categories: [tourismCategories[1], tourismCategories[0]], // Naturaleza, Aventura
    tourismType: 'Naturaleza',
    difficulty: 'Moderado',
    activities: [
      {
        id: 'act4',
        name: 'Observación Astronómica',
        description: 'Contempla las estrellas en uno de los mejores cielos de Colombia',
        duration: '3 horas',
        price: 70000,
        difficulty: 'Fácil',
        category: 'Naturaleza',
        included: ['Telescopio', 'Guía astronómico', 'Café caliente'],
        requirements: ['Ropa abrigada para la noche']
      },
      {
        id: 'act5',
        name: 'Trekking Laberinto de Cuzco',
        description: 'Caminata por las formaciones rocosas del desierto gris',
        duration: '2 horas',
        price: 45000,
        difficulty: 'Moderado',
        category: 'Aventura',
        included: ['Guía local', 'Hidratación', 'Gorra'],
        requirements: ['Protector solar', 'Zapatos de trekking']
      }
    ],
    accommodations: [
      {
        id: 'acc3',
        name: 'Observatorio La Tatacoa',
        type: 'Hotel',
        description: 'Hotel temático con observatorio astronómico',
        pricePerNight: 150000,
        amenities: ['Observatorio', 'WiFi', 'Piscina', 'Restaurante'],
        maxGuests: 3,
        images: ['obs1.jpg', 'obs2.jpg'],
        rating: 4.4,
        totalReviews: 89,
        available: true
      }
    ],
    priceRange: {
      min: 30000,
      max: 250000,
      currency: 'COP',
      includes: ['Entrada', 'Guía básico']
    },
    duration: {
      minimum: '1 día',
      recommended: '2 días'
    },
    bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril'],
    weather: {
      temperature: { min: 15, max: 35, avg: 25 },
      humidity: 45,
      precipitation: 80,
      season: 'Seca',
      bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero'],
      currentCondition: 'Despejado y seco'
    },
    howToGetThere: {
      byBus: 'Desde Neiva: 1 hora en bus a Villavieja',
      byCar: 'Vía Neiva-Villavieja, luego 15 min en vehículo 4x4',
      estimatedTime: '1.5 horas desde Neiva'
    },
    rating: 4.5,
    totalReviews: 198,
    available: true,
    featured: true,
    tags: ['desierto', 'astronomía', 'trekking', 'naturaleza', 'estrellas'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    name: 'Termales de Rivera',
    slug: 'termales-de-rivera',
    description: 'Aguas termales naturales con propiedades medicinales, rodeadas de exuberante vegetación tropical. Un oasis de relajación y bienestar en el corazón del Huila.',
    shortDescription: 'Aguas termales medicinales en entorno natural',
    location: {
      latitude: 2.7333,
      longitude: -75.2500,
      address: 'Termales de Rivera',
      city: 'Rivera',
      department: 'Huila',
      country: 'Colombia'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1544737151681-6e4c999de2a7?w=800&h=600&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1544737151681-6e4c999de2a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ]
    },
    categories: [tourismCategories[4], tourismCategories[1]], // Relajación, Naturaleza
    tourismType: 'Relajación',
    difficulty: 'Fácil',
    activities: [
      {
        id: 'act6',
        name: 'Baños Termales',
        description: 'Disfruta de las propiedades terapéuticas de las aguas termales',
        duration: '2 horas',
        price: 35000,
        difficulty: 'Fácil',
        category: 'Relajación',
        included: ['Acceso a piscinas', 'Duchas', 'Vestidores'],
        requirements: ['Traje de baño', 'Toalla']
      },
      {
        id: 'act7',
        name: 'Masajes Terapéuticos',
        description: 'Masajes profesionales con aceites esenciales',
        duration: '1 hora',
        price: 85000,
        difficulty: 'Fácil',
        category: 'Relajación',
        included: ['Masaje completo', 'Aceites aromáticos', 'Relajación'],
        requirements: ['Cita previa']
      }
    ],
    accommodations: [
      {
        id: 'acc4',
        name: 'Hotel Termal Wellness',
        type: 'Hotel',
        description: 'Hotel con acceso directo a las termas y spa',
        pricePerNight: 220000,
        amenities: ['Spa', 'Termas privadas', 'Restaurante', 'WiFi', 'Piscina'],
        maxGuests: 2,
        images: ['termal1.jpg', 'termal2.jpg'],
        rating: 4.7,
        totalReviews: 156,
        available: true
      }
    ],
    priceRange: {
      min: 25000,
      max: 300000,
      currency: 'COP',
      includes: ['Acceso a termas básicas']
    },
    duration: {
      minimum: '4 horas',
      recommended: '1 día'
    },
    bestTimeToVisit: ['Todo el año'],
    weather: {
      temperature: { min: 20, max: 30, avg: 25 },
      humidity: 75,
      precipitation: 200,
      season: 'Seca',
      bestTimeToVisit: ['Todo el año'],
      currentCondition: 'Cálido y húmedo'
    },
    howToGetThere: {
      byBus: 'Desde Neiva: 30 minutos en bus urbano',
      byCar: 'Vía Neiva-Rivera, carretera principal',
      estimatedTime: '30 minutos desde Neiva'
    },
    rating: 4.6,
    totalReviews: 267,
    available: true,
    featured: false,
    tags: ['termas', 'spa', 'relajación', 'bienestar', 'salud'],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-19T13:20:00Z'
  }
];

// Reseñas de prueba
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'María García',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-5?w=50&h=50&fit=crop&crop=face',
    destinationId: '1',
    destinationName: 'Parque Arqueológico San Agustín',
    bookingId: 'book1',
    title: 'Experiencia increíble en San Agustín',
    content: 'Las estatuas son impresionantes y el guía muy conocedor. Definitivamente vale la pena visitarlo. La historia que guardan estas piedras es fascinante.',
    rating: {
      overall: 5,
      categories: {
        service: 5,
        cleanliness: 4,
        location: 5,
        valueForMoney: 5,
        facilities: 4
      }
    },
    media: [],
    travelDate: '2024-01-15',
    travelWith: 'family',
    recommendedFor: ['familias', 'amantes de la historia'],
    status: 'approved',
    helpfulVotes: 12,
    reportedCount: 0,
    verified: true,
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Carlos Rodríguez',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    destinationId: '2',
    destinationName: 'Desierto de la Tatacoa',
    title: 'Cielos estrellados únicos',
    content: 'La observación astronómica fue lo mejor del viaje. El guía astronómico era muy profesional y los telescopios de excelente calidad.',
    rating: {
      overall: 5,
      categories: {
        service: 5,
        cleanliness: 3,
        location: 5,
        valueForMoney: 4,
        facilities: 3
      }
    },
    media: [],
    travelDate: '2024-01-10',
    travelWith: 'couple',
    recommendedFor: ['parejas', 'amantes de la astronomía'],
    status: 'approved',
    helpfulVotes: 8,
    reportedCount: 0,
    verified: true,
    createdAt: '2024-01-11T16:45:00Z'
  }
];

// Reservas de prueba
export const mockBookings: Booking[] = [
  {
    id: 'book1',
    bookingNumber: 'WT-2024-001',
    userId: 'user1',
    destinationId: '1',
    providerId: 'prov1',
    items: [
      {
        id: 'item1',
        type: 'accommodation',
        itemId: 'acc1',
        name: 'Hotel Boutique Magdalena',
        description: 'Habitación doble con vista al río',
        price: 280000,
        quantity: 2,
        startDate: '2024-02-15',
        endDate: '2024-02-17',
        guests: 2
      },
      {
        id: 'item2',
        type: 'activity',
        itemId: 'act2',
        name: 'Tour Arqueológico',
        description: 'Visita guiada al parque arqueológico',
        price: 80000,
        quantity: 2,
        startDate: '2024-02-16',
        guests: 2
      }
    ],
    contact: {
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@email.com',
      phone: '+57 300 123 4567'
    },
    guests: [
      {
        firstName: 'María',
        lastName: 'García',
        document: '12345678',
        email: 'maria.garcia@email.com',
        phone: '+57 300 123 4567',
        age: 35
      },
      {
        firstName: 'Juan',
        lastName: 'García',
        document: '87654321',
        email: 'juan.garcia@email.com',
        phone: '+57 300 765 4321',
        age: 38
      }
    ],
    startDate: '2024-02-15',
    endDate: '2024-02-17',
    bookingDate: '2024-01-15T10:30:00Z',
    status: 'confirmed',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-01-15T10:30:00Z',
        updatedBy: 'user1'
      },
      {
        status: 'confirmed',
        date: '2024-01-15T11:00:00Z',
        updatedBy: 'prov1'
      }
    ],
    pricing: {
      subtotal: 720000,
      taxes: 108000,
      fees: 36000,
      discounts: 0,
      total: 864000,
      currency: 'COP'
    },
    payment: {
      method: 'card',
      status: 'completed',
      amount: 864000,
      currency: 'COP',
      transactionId: 'TXN-123456',
      paymentDate: '2024-01-15T10:35:00Z'
    },
    cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes',
    refundPolicy: 'Reembolso del 100% hasta 48 horas antes',
    confirmationSent: true,
    remindersSent: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    reviewed: true,
    reviewId: '1'
  }
];

// Filtros predefinidos populares
export const popularFilters = {
  aventura: {
    category: ['1'], // Aventura
    difficulty: ['Moderado', 'Difícil']
  },
  familias: {
    difficulty: ['Fácil'],
    tourismType: ['Cultural', 'Naturaleza']
  },
  economico: {
    priceMax: 200000
  },
  lujo: {
    priceMin: 250000
  },
  finDeSemana: {
    duration: '1-2 días'
  }
};

// Estados de Colombia para filtros
export const colombianDepartments = [
  'Huila', 'Tolima', 'Cundinamarca', 'Boyacá', 'Santander',
  'Antioquia', 'Valle del Cauca', 'Nariño', 'Cauca', 'Magdalena',
  'Atlántico', 'Bolívar', 'Córdoba', 'Sucre', 'Cesar', 'La Guajira'
];

// Función para generar datos aleatorios adicionales
export const generateMockDestination = (id: string): Destination => {
  const categories = [
    tourismCategories[Math.floor(Math.random() * tourismCategories.length)],
    tourismCategories[Math.floor(Math.random() * tourismCategories.length)]
  ];

  return {
    id,
    name: `Destino ${id}`,
    slug: `destino-${id}`,
    description: 'Descripción generada automáticamente para pruebas',
    shortDescription: 'Descripción corta del destino',
    location: {
      latitude: 1 + Math.random() * 5,
      longitude: -75 - Math.random() * 3,
      address: `Dirección ${id}`,
      city: 'Ciudad Ejemplo',
      department: 'Huila',
      country: 'Colombia'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
      ]
    },
    categories,
    tourismType: 'Naturaleza',
    difficulty: 'Fácil',
    activities: [],
    accommodations: [],
    priceRange: {
      min: 50000 + Math.random() * 100000,
      max: 200000 + Math.random() * 300000,
      currency: 'COP',
      includes: ['Entrada básica']
    },
    duration: {
      minimum: '1 día',
      recommended: '2 días'
    },
    bestTimeToVisit: ['Todo el año'],
    weather: sampleWeather,
    howToGetThere: {
      byBus: 'Acceso en bus desde la ciudad principal',
      byCar: 'Carretera principal pavimentada',
      estimatedTime: '2 horas'
    },
    rating: 3.5 + Math.random() * 1.5,
    totalReviews: Math.floor(Math.random() * 500),
    available: true,
    featured: Math.random() > 0.7,
    tags: ['ejemplo', 'prueba'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};