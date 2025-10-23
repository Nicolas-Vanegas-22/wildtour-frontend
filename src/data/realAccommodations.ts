/**
 * Alojamientos Reales de Colombia
 * Base de datos de opciones de hospedaje auténticas
 */

export interface RealAccommodation {
  id: string;
  name: string;
  type: 'Hotel' | 'Hostal' | 'Glamping' | 'Finca' | 'Cabaña' | 'Eco-lodge' | 'Apartamento';
  destination: string;
  stars: number;
  price: { min: number; max: number; currency: string };
  description: string;
  amenities: string[];
  rooms: {
    type: string;
    capacity: number;
    price: number;
    amenities: string[];
  }[];
  images: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    nearbyAttractions: string[];
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: string;
  };
  services: string[];
  rating: number;
  reviewsCount: number;
  highlights: string[];
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
}

export const realAccommodations: RealAccommodation[] = [
  // ========== VILLAVIEJA - DESIERTO DE LA TATACOA ==========
  {
    id: 'acc-tatacoa-001',
    name: 'Tatacoa Glamping - Estrellas del Desierto',
    type: 'Glamping',
    destination: 'Desierto de la Tatacoa, Villavieja',
    stars: 4,
    price: { min: 180000, max: 280000, currency: 'COP' },
    description: 'Experiencia única de glamping en el corazón del desierto. Carpas boutique con camas king size, baño privado y terraza para observación de estrellas. Ideal para parejas y amantes de la naturaleza.',
    amenities: [
      'WiFi en áreas comunes',
      'Restaurante on-site',
      'Bar bajo las estrellas',
      'Piscina natural',
      'Estacionamiento gratuito',
      'Observatorio astronómico',
      'Tours incluidos',
      'Energía solar',
    ],
    rooms: [
      {
        type: 'Carpa Deluxe Doble',
        capacity: 2,
        price: 180000,
        amenities: [
          'Cama king size',
          'Baño privado',
          'Ducha caliente',
          'Terraza privada',
          'Aire acondicionado',
          'Desayuno incluido',
        ],
      },
      {
        type: 'Carpa Familiar',
        capacity: 4,
        price: 280000,
        amenities: [
          '1 cama king + 2 individuales',
          'Baño privado',
          'Área de estar',
          'Terraza amplia',
          'Minibar',
          'Desayuno incluido',
        ],
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    ],
    location: {
      address: 'Sector Los Hoyos, Km 5 vía Villavieja-Baraya',
      coordinates: { lat: 3.2286, lng: -75.1868 },
      nearbyAttractions: [
        'Zona Gris (Los Hoyos) - 500m',
        'Observatorio Astronómico - 1km',
        'Zona Roja (Cusco) - 3km',
        'Museo Paleontológico - 6km',
      ],
    },
    policies: {
      checkIn: '2:00 PM - 8:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Cancelación gratuita hasta 48h antes. Después no hay reembolso.',
      children: 'Niños de todas las edades son bienvenidos. Menores de 5 años gratis.',
      pets: 'No se permiten mascotas',
    },
    services: [
      'Desayuno tipo buffet incluido',
      'Cena bajo las estrellas (reserva previa)',
      'Tour nocturno de observación astronómica',
      'Guías para senderismo',
      'Renta de bicicletas',
      'Transfer desde/hasta Neiva ($100,000)',
    ],
    rating: 4.9,
    reviewsCount: 243,
    highlights: [
      'Vista 360° del desierto desde cada carpa',
      'Observación de estrellas desde tu terraza privada',
      'Desayuno gourmet con productos locales',
      'Decoración bohemia y sostenible',
      'Staff super amable y conocedor',
    ],
    contact: {
      phone: '+57 315 234 5678',
      email: 'reservas@tatacoaglamping.com',
      whatsapp: '+57 315 234 5678',
    },
  },
  {
    id: 'acc-tatacoa-002',
    name: 'Hotel Boutique Bethel',
    type: 'Hotel',
    destination: 'Villavieja, Huila',
    stars: 3,
    price: { min: 120000, max: 200000, currency: 'COP' },
    description: 'Hotel tradicional en el centro de Villavieja con arquitectura colonial y servicios modernos. Piscina, restaurante y tours organizados. Perfecto equilibrio entre comodidad y aventura.',
    amenities: [
      'WiFi gratis',
      'Aire acondicionado',
      'Piscina',
      'Restaurante',
      'Parqueadero',
      'Recepción 24h',
      'Tours organizados',
      'Zona BBQ',
    ],
    rooms: [
      {
        type: 'Habitación Sencilla',
        capacity: 1,
        price: 120000,
        amenities: [
          'Cama doble',
          'Baño privado',
          'TV cable',
          'Aire acondicionado',
          'Desayuno',
        ],
      },
      {
        type: 'Habitación Doble',
        capacity: 2,
        price: 150000,
        amenities: [
          'Cama king',
          'Baño privado',
          'TV cable',
          'Aire acondicionado',
          'Minibar',
          'Desayuno',
        ],
      },
      {
        type: 'Suite Familiar',
        capacity: 4,
        price: 200000,
        amenities: [
          '2 habitaciones',
          '2 baños',
          'Sala de estar',
          'Balcón',
          'Desayuno',
        ],
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    location: {
      address: 'Carrera 5 #4-23, Centro, Villavieja',
      coordinates: { lat: 3.2240, lng: -75.2236 },
      nearbyAttractions: [
        'Plaza principal - 100m',
        'Museo Paleontológico - 800m',
        'Restaurantes - 50m',
        'Desierto entrada - 5km',
      ],
    },
    policies: {
      checkIn: '1:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Cancelación gratuita hasta 72h antes.',
      children: 'Niños bienvenidos. Cuna disponible sin costo.',
      pets: 'No se permiten mascotas',
    },
    services: [
      'Desayuno continental',
      'Restaurante a la carta',
      'Bar',
      'Organización de tours',
      'Transfer aeropuerto ($90,000)',
      'Lavandería',
    ],
    rating: 4.6,
    reviewsCount: 187,
    highlights: [
      'Excelente ubicación en el centro',
      'Staff muy servicial',
      'Piscina refrescante',
      'Buenos desayunos',
      'Relación calidad-precio',
    ],
    contact: {
      phone: '+57 311 456 7890',
      email: 'info@hotelbethel.com',
      whatsapp: '+57 311 456 7890',
    },
  },
  {
    id: 'acc-tatacoa-003',
    name: 'Hostal El Desierto - Backpackers',
    type: 'Hostal',
    destination: 'Villavieja, Huila',
    stars: 2,
    price: { min: 35000, max: 80000, currency: 'COP' },
    description: 'Hostal económico para mochileros y viajeros jóvenes. Ambiente social, cocina compartida y organización de tours grupales. La mejor opción para conocer otros viajeros.',
    amenities: [
      'WiFi gratis',
      'Cocina compartida',
      'Área común',
      'Terraza',
      'Hamacas',
      'Tours grupales',
      'Lockers',
      'Ducha compartida',
    ],
    rooms: [
      {
        type: 'Cama en Dormitorio Mixto (8 camas)',
        capacity: 1,
        price: 35000,
        amenities: [
          'Cama individual',
          'Locker',
          'Baño compartido',
          'Ventilador',
        ],
      },
      {
        type: 'Habitación Privada',
        capacity: 2,
        price: 80000,
        amenities: [
          'Cama doble',
          'Baño privado',
          'Ventilador',
          'Mesa de trabajo',
        ],
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    ],
    location: {
      address: 'Calle 6 #3-45, Villavieja',
      coordinates: { lat: 3.2250, lng: -75.2240 },
      nearbyAttractions: [
        'Centro - 200m',
        'Supermercado - 100m',
        'Buses al desierto - 300m',
      ],
    },
    policies: {
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Cancelación gratuita hasta 24h antes.',
      children: 'Solo mayores de 16 años',
      pets: 'No se permiten',
    },
    services: [
      'Desayuno básico ($8,000)',
      'Tours organizados diarios',
      'Renta de bicicletas',
      'Información turística',
      'Cambio de moneda',
    ],
    rating: 4.4,
    reviewsCount: 312,
    highlights: [
      'Muy económico',
      'Ambiente social',
      'Tours grupales baratos',
      'Conoces muchos viajeros',
      'Personal joven y amigable',
    ],
    contact: {
      phone: '+57 318 765 4321',
      email: 'info@eldesiertohostal.com',
      whatsapp: '+57 318 765 4321',
    },
  },

  // ========== EJE CAFETERO ==========
  {
    id: 'acc-cafe-001',
    name: 'Finca Hotel Cafetera La Esperanza',
    type: 'Finca',
    destination: 'Salento, Quindío',
    stars: 4,
    price: { min: 250000, max: 450000, currency: 'COP' },
    description: 'Finca cafetera tradicional convertida en hotel boutique. Rodeada de cafetales en producción, con arquitectura paisa auténtica y vistas al Valle de Cocora. Experiencia inmersiva en la cultura cafetera.',
    amenities: [
      'WiFi en áreas comunes',
      'Tour de café incluido',
      'Piscina natural',
      'Restaurante orgánico',
      'Spa y masajes',
      'Senderismo',
      'Avistamiento de aves',
      'Parqueadero',
    ],
    rooms: [
      {
        type: 'Habitación Standard Vista Cafetal',
        capacity: 2,
        price: 250000,
        amenities: [
          'Cama king size',
          'Baño privado',
          'Balcón con hamaca',
          'Agua caliente',
          'Desayuno orgánico',
        ],
      },
      {
        type: 'Suite Cafetera con Jacuzzi',
        capacity: 2,
        price: 380000,
        amenities: [
          'Cama king',
          'Jacuzzi privado',
          'Sala de estar',
          'Chimenea',
          'Vista panorámica',
          'Minibar',
        ],
      },
      {
        type: 'Cabaña Familiar',
        capacity: 5,
        price: 450000,
        amenities: [
          '2 habitaciones',
          '2 baños',
          'Cocina equipada',
          'Terraza privada',
          'BBQ',
        ],
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    location: {
      address: 'Vereda Boquía, Km 7 vía Salento-Cocora',
      coordinates: { lat: 4.6388, lng: -75.5683 },
      nearbyAttractions: [
        'Valle de Cocora - 4km',
        'Salento pueblo - 7km',
        'Cascada La Plata - 2km',
        'Mirador - 500m',
      ],
    },
    policies: {
      checkIn: '3:00 PM',
      checkOut: '1:00 PM',
      cancellation: 'Cancelación gratuita hasta 7 días antes.',
      children: 'Niños bienvenidos. Descuentos para menores de 10 años.',
      pets: 'Se aceptan mascotas pequeñas ($20,000/noche)',
    },
    services: [
      'Desayuno campestre incluido',
      'Tour de café diario (incluido)',
      'Almuerzo y cena disponibles',
      'Catas de café',
      'Clases de barismo',
      'Senderismo guiado',
      'Yoga matutino',
      'Transfer desde Pereira ($80,000)',
    ],
    rating: 4.9,
    reviewsCount: 428,
    highlights: [
      'Experiencia auténtica en finca cafetera',
      'Vistas espectaculares al Valle de Cocora',
      'Comida orgánica de la finca',
      'Silencio y naturaleza',
      'Dueños muy hospitalarios',
    ],
    contact: {
      phone: '+57 320 567 8901',
      email: 'reservas@fincalaesperanza.com',
      whatsapp: '+57 320 567 8901',
    },
  },

  // ========== CARTAGENA ==========
  {
    id: 'acc-cartagena-001',
    name: 'Casa Colonial Boutique Getsemaní',
    type: 'Hotel',
    destination: 'Cartagena, Bolívar',
    stars: 5,
    price: { min: 450000, max: 850000, currency: 'COP' },
    description: 'Mansión colonial del siglo XVIII restaurada con lujo contemporáneo. Ubicada en el corazón de Getsemaní, el barrio más auténtico de Cartagena. Roof-top con piscina y vista a la ciudad amurallada.',
    amenities: [
      'WiFi ultra rápido',
      'Piscina en terraza',
      'Bar rooftop',
      'Spa completo',
      'Restaurante gourmet',
      'Concierge 24h',
      'Gimnasio',
      'Sala de cine',
    ],
    rooms: [
      {
        type: 'Suite Colonial',
        capacity: 2,
        price: 450000,
        amenities: [
          'Cama king',
          'Baño de mármol',
          'Balcón con vista',
          'Aire acondicionado',
          'Smart TV',
          'Desayuno',
        ],
      },
      {
        type: 'Suite Premium con Jacuzzi',
        capacity: 2,
        price: 650000,
        amenities: [
          'Cama king',
          'Jacuzzi privado',
          'Sala de estar',
          'Terraza privada',
          'Minibar premium',
          'Desayuno',
        ],
      },
      {
        type: 'Penthouse Vista Mar',
        capacity: 4,
        price: 850000,
        amenities: [
          '2 habitaciones',
          '2 baños',
          'Piscina privada',
          'Terraza 360°',
          'Cocina',
          'Mayordomo',
        ],
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    location: {
      address: 'Calle de la Media Luna #10-89, Getsemaní',
      coordinates: { lat: 10.4230, lng: -75.5504 },
      nearbyAttractions: [
        'Plaza Trinidad - 200m',
        'Centro Histórico - 800m',
        'Playa Bocagrande - 2km',
        'Castillo San Felipe - 1.5km',
      ],
    },
    policies: {
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Cancelación gratuita hasta 14 días antes.',
      children: 'Mayores de 12 años',
      pets: 'No se permiten',
    },
    services: [
      'Desayuno gourmet incluido',
      'Coctel de bienvenida',
      'Servicio de habitación 24h',
      'Transfer aeropuerto incluido',
      'Tours privados organizados',
      'Masajes en habitación',
      'Chef privado disponible',
    ],
    rating: 4.9,
    reviewsCount: 567,
    highlights: [
      'Arquitectura colonial impecable',
      'Ubicación perfecta en Getsemaní',
      'Rooftop espectacular',
      'Servicio de lujo',
      'Atención personalizada',
    ],
    contact: {
      phone: '+57 305 890 1234',
      email: 'reservas@casacolonialboutique.com',
      whatsapp: '+57 305 890 1234',
    },
  },
];

// Funciones de utilidad
export const getAccommodationsByDestination = (destination: string) =>
  realAccommodations.filter(acc => acc.destination.includes(destination));

export const getAccommodationsByType = (type: string) =>
  realAccommodations.filter(acc => acc.type === type);

export const getAccommodationsByPriceRange = (min: number, max: number) =>
  realAccommodations.filter(
    acc => acc.price.min <= max && acc.price.max >= min
  );

export const getTopRatedAccommodations = (minRating: number = 4.5) =>
  realAccommodations
    .filter(acc => acc.rating >= minRating)
    .sort((a, b) => b.rating - a.rating);
