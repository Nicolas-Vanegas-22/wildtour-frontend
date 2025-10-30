import { Service, CategoryInfo } from '../domain/models/CustomPackage';

// ============================================
// CATEGORÍAS Y SUBCATEGORÍAS
// ============================================

export const CATEGORIES_INFO: CategoryInfo[] = [
  {
    category: 'alojamiento',
    title: 'Alojamiento',
    description: 'Encuentra el lugar perfecto para descansar durante tu aventura',
    icon: 'Hotel',
    subcategories: [
      { type: 'hotel', label: 'Hoteles Sencillos', icon: 'Building' },
      { type: 'hostal', label: 'Hostales', icon: 'Home' },
      { type: 'camping', label: 'Camping', icon: 'Tent' },
      { type: 'glamping', label: 'Glamping', icon: 'Sparkles' },
    ],
  },
  {
    category: 'alimentacion',
    title: 'Alimentación',
    description: 'Disfruta de la gastronomía local',
    icon: 'UtensilsCrossed',
    subcategories: [
      { type: 'restaurante', label: 'Restaurantes', icon: 'ChefHat' },
      { type: 'estadero', label: 'Estaderos', icon: 'Coffee' },
    ],
  },
  {
    category: 'recorrido',
    title: 'Recorridos y Transporte',
    description: 'Explora el desierto con nuestros servicios de movilidad',
    icon: 'Route',
    subcategories: [
      { type: 'guia', label: 'Guías Turísticos', icon: 'Users' },
      { type: 'caballo', label: 'Paseos a Caballo', icon: 'Mountain' },
      { type: 'bicicleta', label: 'Bicicletas', icon: 'Bike' },
      { type: 'cuatrimoto', label: 'Cuatrimotos', icon: 'Car' },
    ],
  },
  {
    category: 'astronomicas',
    title: 'Actividades Astronómicas',
    description: 'Descubre el cielo estrellado del desierto',
    icon: 'Stars',
    subcategories: [
      { type: 'observatorio', label: 'Observatorios', icon: 'Telescope' },
    ],
  },
  {
    category: 'sitios_interes',
    title: 'Sitios de Interés',
    description: 'Visita lugares emblemáticos de la región',
    icon: 'MapPin',
    subcategories: [
      { type: 'piscina_natural', label: 'Piscinas Naturales', icon: 'Waves' },
      { type: 'museo', label: 'Museos', icon: 'Landmark' },
    ],
  },
];

// ============================================
// ALOJAMIENTO
// ============================================

export const ALOJAMIENTO_SERVICES: Service[] = [
  // HOTELES
  {
    id: 'hotel-001',
    category: 'alojamiento',
    subcategory: 'hotel',
    name: 'Hotel Desierto Real',
    description: 'Hotel sencillo y cómodo en el centro de Villavieja con todas las comodidades básicas. Perfecto para viajeros que buscan una estadía tranquila.',
    shortDescription: 'Hotel sencillo con aire acondicionado y WiFi',
    location: 'Villavieja',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        alt: 'Hotel Desierto Real - Fachada',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        alt: 'Habitación doble',
        isPrimary: false,
      },
    ],
    pricing: {
      basePrice: 80000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 2,
      seasonalPricing: {
        highSeason: 1.3,
        lowSeason: 0.9,
      },
    },
    features: ['WiFi', 'Aire acondicionado', 'Baño privado', 'Desayuno incluido', 'Parqueadero'],
    rating: 4.2,
    reviewCount: 48,
    isActive: true,
  },
  {
    id: 'hotel-002',
    category: 'alojamiento',
    subcategory: 'hotel',
    name: 'Hotel Tatacoa Inn',
    description: 'Ubicado estratégicamente cerca del desierto rojo. Ofrece habitaciones amplias con vista al desierto y servicios básicos de calidad.',
    shortDescription: 'Vista al desierto, habitaciones amplias',
    location: 'Entrada Desierto Rojo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        alt: 'Hotel Tatacoa Inn',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 95000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 3,
      seasonalPricing: {
        highSeason: 1.4,
        lowSeason: 0.85,
      },
    },
    features: ['WiFi', 'Ventilador', 'Baño privado', 'Terraza', 'Agua caliente'],
    rating: 4.5,
    reviewCount: 62,
    isActive: true,
  },

  // HOSTALES
  {
    id: 'hostal-001',
    category: 'alojamiento',
    subcategory: 'hostal',
    name: 'Hostal Aventura Tatacoa',
    description: 'Hostal familiar con ambiente acogedor. Ideal para mochileros y grupos de amigos. Espacios comunes para compartir experiencias.',
    shortDescription: 'Ambiente familiar, espacios compartidos',
    location: 'Villavieja Centro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        alt: 'Hostal Aventura',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 35000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 1,
      seasonalPricing: {
        highSeason: 1.2,
        lowSeason: 1.0,
      },
    },
    features: ['WiFi', 'Cocina compartida', 'Sala común', 'Hamacas', 'Información turística'],
    rating: 4.7,
    reviewCount: 95,
    isActive: true,
  },
  {
    id: 'hostal-002',
    category: 'alojamiento',
    subcategory: 'hostal',
    name: 'Hostal Las Estrellas',
    description: 'Perfecto para observadores de estrellas. Terraza con vista al cielo nocturno y ambiente relajado.',
    shortDescription: 'Terraza astronómica, ambiente bohemio',
    location: 'Desierto Gris',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800',
        alt: 'Hostal Las Estrellas',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 40000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 1,
    },
    features: ['WiFi', 'Terraza', 'Baño compartido', 'Cocina', 'Telescopio disponible'],
    rating: 4.8,
    reviewCount: 78,
    isActive: true,
  },

  // CAMPING
  {
    id: 'camping-001',
    category: 'alojamiento',
    subcategory: 'camping',
    name: 'Camping Cielo Abierto',
    description: 'Experiencia de camping auténtica en pleno desierto. Incluye zona de fogata, baños compartidos y seguridad nocturna.',
    shortDescription: 'Camping tradicional con servicios básicos',
    location: 'Desierto Rojo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        alt: 'Zona de camping',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 25000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 4,
    },
    features: ['Zona de fogata', 'Baños', 'Agua potable', 'Seguridad 24h', 'Alquiler de carpas'],
    rating: 4.3,
    reviewCount: 54,
    isActive: true,
  },

  // GLAMPING
  {
    id: 'glamping-001',
    category: 'alojamiento',
    subcategory: 'glamping',
    name: 'Glamping Tatacoa Luxury',
    description: 'Carpas de lujo totalmente equipadas con camas cómodas, electricidad y baño privado. La experiencia del desierto con todas las comodidades.',
    shortDescription: 'Glamping de lujo con todas las comodidades',
    location: 'Sector Los Hoyos',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800',
        alt: 'Glamping Luxury',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 180000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 2,
      seasonalPricing: {
        highSeason: 1.5,
        lowSeason: 0.9,
      },
    },
    features: [
      'Cama king size',
      'Baño privado',
      'Electricidad',
      'Aire acondicionado',
      'Desayuno gourmet',
      'Terraza privada',
    ],
    rating: 4.9,
    reviewCount: 127,
    isActive: true,
  },
  {
    id: 'glamping-002',
    category: 'alojamiento',
    subcategory: 'glamping',
    name: 'Glamping Estrellas del Desierto',
    description: 'Domos transparentes para observación de estrellas. Experiencia romántica única bajo el cielo del desierto.',
    shortDescription: 'Domos transparentes para ver las estrellas',
    location: 'Desierto Gris',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
        alt: 'Domo Glamping',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 220000,
      currency: 'COP',
      minPersons: 2,
      maxPersons: 2,
      seasonalPricing: {
        highSeason: 1.6,
        lowSeason: 1.0,
      },
    },
    features: [
      'Domo transparente',
      'Cama queen',
      'Baño privado',
      'Jacuzzi',
      'Cena romántica',
      'Tour astronómico incluido',
    ],
    rating: 5.0,
    reviewCount: 89,
    isActive: true,
  },
];

// ============================================
// ALIMENTACIÓN
// ============================================

export const ALIMENTACION_SERVICES: Service[] = [
  // RESTAURANTES
  {
    id: 'rest-001',
    category: 'alimentacion',
    subcategory: 'restaurante',
    name: 'Restaurante El Desierto',
    description: 'Comida típica huilense en el corazón de Villavieja. Especialidad en carne a la llanera y viudo de pescado.',
    shortDescription: 'Comida típica huilense',
    location: 'Villavieja Centro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        alt: 'Restaurante El Desierto',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 25000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 20,
    },
    schedule: [
      { day: 'monday', openTime: '07:00', closeTime: '21:00', available: true },
      { day: 'tuesday', openTime: '07:00', closeTime: '21:00', available: true },
      { day: 'wednesday', openTime: '07:00', closeTime: '21:00', available: true },
      { day: 'thursday', openTime: '07:00', closeTime: '21:00', available: true },
      { day: 'friday', openTime: '07:00', closeTime: '22:00', available: true },
      { day: 'saturday', openTime: '07:00', closeTime: '22:00', available: true },
      { day: 'sunday', openTime: '07:00', closeTime: '21:00', available: true },
    ],
    features: ['Aire acondicionado', 'Terraza', 'Menú vegetariano', 'WiFi', 'Parqueadero'],
    rating: 4.6,
    reviewCount: 156,
    isActive: true,
  },
  {
    id: 'rest-002',
    category: 'alimentacion',
    subcategory: 'restaurante',
    name: 'La Tatacoa Gourmet',
    description: 'Fusión de cocina internacional y local. Platos creativos con ingredientes de la región.',
    shortDescription: 'Cocina fusión internacional-local',
    location: 'Entrada al Desierto',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        alt: 'La Tatacoa Gourmet',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 35000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 15,
    },
    features: ['Bar', 'Carta de vinos', 'Menú vegano', 'Música en vivo', 'Reservas'],
    rating: 4.8,
    reviewCount: 92,
    isActive: true,
  },

  // ESTADEROS
  {
    id: 'estad-001',
    category: 'alimentacion',
    subcategory: 'estadero',
    name: 'Estadero La Piscina',
    description: 'Estadero familiar ubicado cerca de las piscinas naturales. Especialidad en mojarra frita y sancocho.',
    shortDescription: 'Comida casera, ambiente familiar',
    location: 'Piscinas Naturales',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        alt: 'Estadero La Piscina',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 18000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 30,
    },
    features: ['Zona verde', 'Hamacas', 'Juegos infantiles', 'Parqueadero', 'Piscina'],
    rating: 4.4,
    reviewCount: 67,
    isActive: true,
  },
  {
    id: 'estad-002',
    category: 'alimentacion',
    subcategory: 'estadero',
    name: 'Mirador del Cuzco',
    description: 'Estadero con vista panorámica del desierto. Perfecto para almuerzos después de las caminatas.',
    shortDescription: 'Vista panorámica, comida típica',
    location: 'El Cuzco',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1530554764233-e79e16c91d08?w=800',
        alt: 'Mirador del Cuzco',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 20000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 25,
    },
    features: ['Mirador', 'Terraza', 'Bebidas naturales', 'Menú del día', 'Sombra natural'],
    rating: 4.5,
    reviewCount: 81,
    isActive: true,
  },
];

// ============================================
// RECORRIDOS
// ============================================

export const RECORRIDO_SERVICES: Service[] = [
  // GUÍAS
  {
    id: 'guia-001',
    category: 'recorrido',
    subcategory: 'guia',
    name: 'Guía Experto del Desierto - Juan García',
    description: 'Guía certificado con 10 años de experiencia. Conoce cada rincón del desierto y su historia geológica. Incluye recorrido de 4 horas por ambos desiertos.',
    shortDescription: 'Guía certificado, 4 horas de recorrido',
    location: 'Todo el Desierto',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
        alt: 'Guía turístico',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 15000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 15,
    },
    features: [
      'Certificación oficial',
      'Primeros auxilios',
      'Agua incluida',
      'Seguro',
      'Fotografías',
      'Información geológica',
    ],
    rating: 4.9,
    reviewCount: 234,
    provider: {
      id: 'prov-001',
      name: 'Juan García',
      phone: '+57 300 123 4567',
      email: 'juan@guiatatacoa.com',
    },
    isActive: true,
  },
  {
    id: 'guia-002',
    category: 'recorrido',
    subcategory: 'guia',
    name: 'Tour Nocturno con María Rodríguez',
    description: 'Especialista en tours nocturnos y observación de estrellas. Incluye recorrido de 3 horas + charla astronómica.',
    shortDescription: 'Especialista nocturno, 3 horas + astronomía',
    location: 'Desierto Gris',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
        alt: 'Tour nocturno',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 20000,
      currency: 'COP',
      minPersons: 2,
      maxPersons: 10,
    },
    features: ['Tour nocturno', 'Charla astronómica', 'Linternas', 'Manta térmica', 'Bebida caliente'],
    rating: 5.0,
    reviewCount: 178,
    isActive: true,
  },

  // CABALLOS
  {
    id: 'caballo-001',
    category: 'recorrido',
    subcategory: 'caballo',
    name: 'Cabalgata al Atardecer',
    description: 'Recorrido a caballo de 2 horas por el desierto rojo. Perfecto para ver el atardecer. Incluye guía y equipo de seguridad.',
    shortDescription: 'Cabalgata 2 horas, atardecer incluido',
    location: 'Desierto Rojo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
        alt: 'Cabalgata',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 45000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 8,
    },
    features: ['Guía experimentado', 'Casco', 'Seguro', 'Fotografías', 'Agua incluida'],
    rating: 4.7,
    reviewCount: 143,
    isActive: true,
  },

  // BICICLETAS
  {
    id: 'bici-001',
    category: 'recorrido',
    subcategory: 'bicicleta',
    name: 'Alquiler Bicicleta Todo Terreno',
    description: 'Bicicletas de montaña en excelente estado. Alquiler por 4 horas. Incluye casco y candado.',
    shortDescription: 'Alquiler 4 horas, todo terreno',
    location: 'Villavieja Centro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800',
        alt: 'Bicicletas',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 25000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 1,
    },
    features: ['Casco', 'Candado', 'Kit de reparación', 'Mapa de rutas', 'Botella de agua'],
    rating: 4.4,
    reviewCount: 89,
    isActive: true,
  },

  // CUATRIMOTOS
  {
    id: 'cuatri-001',
    category: 'recorrido',
    subcategory: 'cuatrimoto',
    name: 'Tour en Cuatrimoto Extremo',
    description: 'Aventura en cuatrimoto por rutas del desierto. Recorrido de 1.5 horas con guía. Requiere licencia de conducción.',
    shortDescription: 'Tour 1.5 horas, requiere licencia',
    location: 'Desierto Rojo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: 'Cuatrimotos',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 80000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 1,
    },
    features: ['Guía', 'Casco', 'Gafas', 'Seguro todo riesgo', 'Combustible incluido'],
    rating: 4.8,
    reviewCount: 112,
    isActive: true,
  },
];

// ============================================
// ACTIVIDADES ASTRONÓMICAS
// ============================================

export const ASTRONOMICAS_SERVICES: Service[] = [
  {
    id: 'astro-001',
    category: 'astronomicas',
    subcategory: 'observatorio',
    name: 'Observatorio Tatacoa',
    description: 'Observación astronómica profesional con telescopios de alta potencia. Sesión de 2 horas con astrónomo experto. Aprende sobre constelaciones, planetas y el universo.',
    shortDescription: 'Observación 2 horas con astrónomo',
    location: 'Desierto Gris',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
        alt: 'Observatorio',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 35000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 20,
    },
    schedule: [
      { day: 'monday', openTime: '19:00', closeTime: '23:00', available: true },
      { day: 'tuesday', openTime: '19:00', closeTime: '23:00', available: true },
      { day: 'wednesday', openTime: '19:00', closeTime: '23:00', available: true },
      { day: 'thursday', openTime: '19:00', closeTime: '23:00', available: true },
      { day: 'friday', openTime: '19:00', closeTime: '00:00', available: true },
      { day: 'saturday', openTime: '19:00', closeTime: '00:00', available: true },
      { day: 'sunday', openTime: '19:00', closeTime: '23:00', available: true },
    ],
    features: [
      'Telescopio profesional',
      'Astrónomo certificado',
      'Charla educativa',
      'Puntero láser',
      'Sillas cómodas',
      'Bebida caliente',
    ],
    rating: 5.0,
    reviewCount: 267,
    isActive: true,
  },
  {
    id: 'astro-002',
    category: 'astronomicas',
    subcategory: 'observatorio',
    name: 'Sesión Privada de Astrofotografía',
    description: 'Sesión exclusiva de 3 horas para aprender fotografía nocturna y astrofotografía. Incluye uso de equipo profesional y edición básica.',
    shortDescription: 'Sesión privada 3 horas, astrofotografía',
    location: 'Los Hoyos',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800',
        alt: 'Astrofotografía',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 120000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 4,
    },
    features: [
      'Equipo profesional',
      'Instructor experto',
      'Trípode',
      'Tus fotos editadas',
      'Certificado',
    ],
    rating: 4.9,
    reviewCount: 45,
    isActive: true,
  },
];

// ============================================
// SITIOS DE INTERÉS
// ============================================

export const SITIOS_INTERES_SERVICES: Service[] = [
  // PISCINAS NATURALES
  {
    id: 'piscina-001',
    category: 'sitios_interes',
    subcategory: 'piscina_natural',
    name: 'Piscinas Naturales Los Pozos',
    description: 'Entrada a las piscinas naturales de agua dulce. Perfectas para refrescarse después del recorrido por el desierto. Incluye acceso todo el día.',
    shortDescription: 'Acceso todo el día, agua dulce',
    location: 'Los Pozos',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800',
        alt: 'Piscinas Naturales',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 8000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 100,
    },
    schedule: [
      { day: 'monday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'tuesday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'wednesday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'thursday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'friday', openTime: '08:00', closeTime: '18:00', available: true },
      { day: 'saturday', openTime: '07:00', closeTime: '18:00', available: true },
      { day: 'sunday', openTime: '07:00', closeTime: '18:00', available: true },
    ],
    features: ['Vestidores', 'Baños', 'Zona de picnic', 'Parqueadero', 'Salvavidas'],
    rating: 4.6,
    reviewCount: 189,
    isActive: true,
  },

  // MUSEOS
  {
    id: 'museo-001',
    category: 'sitios_interes',
    subcategory: 'museo',
    name: 'Museo Paleontológico de Villavieja',
    description: 'Descubre la historia paleontológica de la región. Exhibición de fósiles de 13 millones de años. Recorrido guiado de 1 hora.',
    shortDescription: 'Museo de fósiles, recorrido 1 hora',
    location: 'Villavieja Centro',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565126492298-1fa5e85c62a2?w=800',
        alt: 'Museo Paleontológico',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 12000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 50,
    },
    schedule: [
      { day: 'monday', openTime: '08:00', closeTime: '12:00', available: true },
      { day: 'tuesday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'wednesday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'thursday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'friday', openTime: '08:00', closeTime: '17:00', available: true },
      { day: 'saturday', openTime: '09:00', closeTime: '16:00', available: true },
      { day: 'sunday', openTime: '09:00', closeTime: '16:00', available: true },
    ],
    features: ['Guía incluido', 'Aire acondicionado', 'Tienda de souvenirs', 'Baños', 'WiFi'],
    rating: 4.7,
    reviewCount: 203,
    isActive: true,
  },
  {
    id: 'museo-002',
    category: 'sitios_interes',
    subcategory: 'museo',
    name: 'Casa de la Cultura Huilense',
    description: 'Centro cultural que exhibe artesanías, arte y tradiciones de la región. Incluye presentaciones de música típica.',
    shortDescription: 'Cultura local, artesanías, música',
    location: 'Villavieja',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800',
        alt: 'Casa de la Cultura',
        isPrimary: true,
      },
    ],
    pricing: {
      basePrice: 5000,
      currency: 'COP',
      minPersons: 1,
      maxPersons: 40,
    },
    features: ['Presentaciones culturales', 'Talleres', 'Venta de artesanías', 'Biblioteca'],
    rating: 4.4,
    reviewCount: 76,
    isActive: true,
  },
];

// ============================================
// EXPORTAR TODOS LOS SERVICIOS
// ============================================

export const ALL_SERVICES: Service[] = [
  ...ALOJAMIENTO_SERVICES,
  ...ALIMENTACION_SERVICES,
  ...RECORRIDO_SERVICES,
  ...ASTRONOMICAS_SERVICES,
  ...SITIOS_INTERES_SERVICES,
];

// Helpers para filtrar servicios
export const getServicesByCategory = (category: string): Service[] => {
  return ALL_SERVICES.filter((s) => s.category === category && s.isActive);
};

export const getServicesBySubcategory = (
  category: string,
  subcategory: string
): Service[] => {
  return ALL_SERVICES.filter(
    (s) => s.category === category && s.subcategory === subcategory && s.isActive
  );
};

export const getServiceById = (id: string): Service | undefined => {
  return ALL_SERVICES.find((s) => s.id === id);
};
