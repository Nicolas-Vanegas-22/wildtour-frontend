/**
 * Actividades Turísticas Reales de Colombia
 * Base de datos completa de experiencias auténticas
 */

export interface RealActivity {
  id: string;
  name: string;
  destination: string;
  category: 'Aventura' | 'Cultura' | 'Naturaleza' | 'Gastronomía' | 'Fotografía' | 'Extremo';
  duration: string;
  price: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Extremo';
  groupSize: { min: number; max: number };
  description: string;
  highlights: string[];
  included: string[];
  requirements: string[];
  schedule: string[];
  bestSeason: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  providerId: string;
  languages: string[];
}

export const realActivities: RealActivity[] = [
  // ========== VILLAVIEJA - DESIERTO DE LA TATACOA ==========
  {
    id: 'act-tatacoa-001',
    name: 'Trekking Fotográfico al Amanecer - Zona Gris',
    destination: 'Desierto de la Tatacoa, Villavieja',
    category: 'Fotografía',
    duration: '4 horas',
    price: 85000,
    difficulty: 'Moderado',
    groupSize: { min: 2, max: 8 },
    description: 'Captura la magia del desierto en las primeras horas del día. Recorre los laberintos de Los Hoyos con un fotógrafo profesional que te enseñará las mejores técnicas para fotografiar paisajes desérticos.',
    highlights: [
      'Salida antes del amanecer para capturar la hora dorada',
      'Guía fotógrafo profesional',
      'Acceso a los mejores puntos fotográficos',
      'Taller práctico de fotografía de paisaje',
      'Desayuno campestre incluido',
      'Grupo reducido para atención personalizada',
    ],
    included: [
      'Transporte desde/hasta tu alojamiento',
      'Guía fotógrafo profesional',
      'Desayuno campestre',
      'Botella de agua',
      'Snacks energéticos',
    ],
    requirements: [
      'Cámara fotográfica (réflex, mirrorless o celular de alta gama)',
      'Buen estado físico para caminar 3-4 km',
      'Linterna frontal',
    ],
    schedule: [
      '04:30 AM - Recogida en alojamiento',
      '05:00 AM - Llegada a Los Hoyos',
      '05:15 AM - Inicio de trekking y sesión fotográfica',
      '07:30 AM - Desayuno con vista panorámica',
      '08:30 AM - Retorno',
    ],
    bestSeason: 'Diciembre a Marzo (cielos despejados)',
    rating: 4.9,
    reviewsCount: 127,
    images: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    ],
    providerId: 'provider-001',
    languages: ['Español', 'Inglés'],
  },
  {
    id: 'act-tatacoa-002',
    name: 'Observación Astronómica Profesional',
    destination: 'Desierto de la Tatacoa, Villavieja',
    category: 'Naturaleza',
    duration: '3 horas',
    price: 95000,
    difficulty: 'Fácil',
    groupSize: { min: 2, max: 15 },
    description: 'Explora el universo desde uno de los mejores cielos de Colombia. Sesión guiada por astrónomos profesionales con telescopios de alta potencia para observar planetas, nebulosas y galaxias.',
    highlights: [
      'Telescopios profesionales (Celestron y Meade)',
      'Astrónomo certificado como guía',
      'Observación de planetas, luna, nebulosas',
      'Charla sobre constelaciones y mitología',
      'Uso de punteros láser astronómicos',
      'Bebidas calientes incluidas',
    ],
    included: [
      'Uso de telescopios profesionales',
      'Guía astrónomo certificado',
      'Café, chocolate caliente',
      'Mantas para el frío',
      'Sillas reclinables',
    ],
    requirements: [
      'Ninguno específico',
      'Ropa abrigada (temperaturas nocturnas de 15°C)',
    ],
    schedule: [
      '08:00 PM - Llegada al punto de observación',
      '08:15 PM - Charla introductoria sobre astronomía',
      '08:45 PM - Inicio de observación con telescopios',
      '10:30 PM - Refrigerio',
      '11:00 PM - Fin de la actividad',
    ],
    bestSeason: 'Todo el año (evitar luna llena)',
    rating: 5.0,
    reviewsCount: 243,
    images: [
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
      'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800',
    ],
    providerId: 'provider-002',
    languages: ['Español', 'Inglés'],
  },
  {
    id: 'act-tatacoa-003',
    name: 'Tour Paleontológico con Experto',
    destination: 'Desierto de la Tatacoa, Villavieja',
    category: 'Cultura',
    duration: '5 horas',
    price: 120000,
    difficulty: 'Fácil',
    groupSize: { min: 4, max: 12 },
    description: 'Viaja 13 millones de años atrás en el tiempo. Recorre el desierto con un paleontólogo que te explicará la historia geológica de la región y sus increíbles hallazgos fósiles.',
    highlights: [
      'Guía paleontólogo profesional',
      'Visita al Museo Paleontológico',
      'Explicación de formaciones geológicas',
      'Búsqueda de fósiles en áreas autorizadas',
      'Almuerzo típico incluido',
      'Material educativo',
    ],
    included: [
      'Transporte',
      'Guía paleontólogo',
      'Entrada al museo',
      'Almuerzo',
      'Material didáctico',
    ],
    requirements: [
      'Interés en ciencia y paleontología',
      'Calzado cerrado',
    ],
    schedule: [
      '08:00 AM - Inicio del tour',
      '08:30 AM - Visita al Museo Paleontológico',
      '10:30 AM - Recorrido por zonas de hallazgos',
      '12:30 PM - Almuerzo',
      '01:30 PM - Retorno',
    ],
    bestSeason: 'Todo el año',
    rating: 4.8,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    providerId: 'provider-003',
    languages: ['Español'],
  },

  // ========== CAÑO CRISTALES ==========
  {
    id: 'act-cano-001',
    name: 'Expedición Caño Cristales - Río de los 5 Colores',
    destination: 'La Macarena, Meta',
    category: 'Naturaleza',
    duration: '8 horas',
    price: 250000,
    difficulty: 'Moderado',
    groupSize: { min: 4, max: 16 },
    description: 'Conoce el río más hermoso del mundo. Trekking por selva y travesías en río para admirar la Macarenia clavigera, la planta acuática que pinta el río de colores.',
    highlights: [
      'Caminata por selva virgen',
      'Baño en pozos naturales',
      'Avistamiento de flora y fauna endémica',
      'Almuerzo campestre',
      'Guía ecológico local',
      'Permisos de ingreso incluidos',
    ],
    included: [
      'Transporte fluvial',
      'Guía ecológico certificado',
      'Almuerzo típico',
      'Permisos de Parques Nacionales',
      'Seguro de asistencia',
    ],
    requirements: [
      'Buen estado físico (caminata de 6 km)',
      'Permiso previo de Parques Nacionales',
      'Vacuna fiebre amarilla (obligatoria)',
      'Edad mínima: 10 años',
    ],
    schedule: [
      '05:30 AM - Salida desde La Macarena',
      '06:30 AM - Llegada en lancha',
      '07:00 AM - Inicio de trekking',
      '09:00 AM - Primera parada para baño',
      '12:00 PM - Almuerzo',
      '01:00 PM - Continuación del recorrido',
      '03:00 PM - Retorno',
    ],
    bestSeason: 'Junio a Noviembre (cuando el río muestra colores)',
    rating: 5.0,
    reviewsCount: 567,
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
    providerId: 'provider-004',
    languages: ['Español', 'Inglés', 'Francés'],
  },

  // ========== EJE CAFETERO ==========
  {
    id: 'act-cafe-001',
    name: 'Tour de Café: De la Semilla a la Taza',
    destination: 'Salento, Quindío',
    category: 'Cultura',
    duration: '4 horas',
    price: 75000,
    difficulty: 'Fácil',
    groupSize: { min: 2, max: 10 },
    description: 'Aprende todo sobre el café colombiano en una finca tradicional. Participa en cada proceso desde la siembra hasta la cata, guiado por caficultores de tercera generación.',
    highlights: [
      'Tour por cafetal en producción',
      'Participación en recolección (temporada)',
      'Proceso completo del café',
      'Tostado artesanal',
      'Cata profesional de 5 variedades',
      'Café para llevar de regalo',
    ],
    included: [
      'Transporte desde Salento',
      'Guía caficultor',
      'Cata de café',
      'Refrigerio típico',
      '250g de café de la finca',
    ],
    requirements: [
      'Ninguno específico',
    ],
    schedule: [
      '08:00 AM - Recogida en Salento',
      '08:30 AM - Llegada a la finca',
      '08:45 AM - Tour por cafetal',
      '10:00 AM - Proceso de café',
      '11:00 AM - Cata profesional',
      '12:00 PM - Retorno',
    ],
    bestSeason: 'Todo el año (cosecha: Octubre-Noviembre, Abril-Mayo)',
    rating: 4.9,
    reviewsCount: 421,
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    ],
    providerId: 'provider-005',
    languages: ['Español', 'Inglés'],
  },
  {
    id: 'act-cafe-002',
    name: 'Trekking Valle de Cocora - Bosque de Palmas',
    destination: 'Salento, Quindío',
    category: 'Aventura',
    duration: '6 horas',
    price: 65000,
    difficulty: 'Moderado',
    groupSize: { min: 2, max: 20 },
    description: 'Camina entre las palmas de cera más altas del mundo, árbol nacional de Colombia. Trekking por bosque de niebla con posibilidad de avistar colibríes y aves endémicas.',
    highlights: [
      'Bosque de palmas de cera (hasta 60m de altura)',
      'Caminata por bosque de niebla',
      'Casa de los colibríes',
      'Almuerzo típico en finca',
      'Avistamiento de aves',
      'Fotografía de paisaje',
    ],
    included: [
      'Transporte jeep Willys',
      'Guía naturalista',
      'Almuerzo campestre',
      'Entrada al parque',
    ],
    requirements: [
      'Buen estado físico (subidas empinadas)',
      'Zapatos de trekking impermeables',
      'Edad mínima: 8 años',
    ],
    schedule: [
      '06:30 AM - Salida desde Salento en jeep',
      '07:00 AM - Llegada al Valle de Cocora',
      '07:15 AM - Inicio del trekking',
      '09:30 AM - Casa de colibríes',
      '11:00 AM - Bosque de niebla',
      '12:30 PM - Almuerzo',
      '01:30 PM - Retorno',
    ],
    bestSeason: 'Todo el año (evitar abril-mayo por lluvias)',
    rating: 4.9,
    reviewsCount: 892,
    images: [
      'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800',
    ],
    providerId: 'provider-006',
    languages: ['Español', 'Inglés'],
  },

  // ========== CARTAGENA ==========
  {
    id: 'act-cartagena-001',
    name: 'Tour Gastronómico por Getsemaní',
    destination: 'Cartagena, Bolívar',
    category: 'Gastronomía',
    duration: '3.5 horas',
    price: 110000,
    difficulty: 'Fácil',
    groupSize: { min: 4, max: 12 },
    description: 'Descubre los sabores auténticos de Cartagena en el barrio más cultural de la ciudad. 7 paradas gastronómicas con explicación de historia y cultura local.',
    highlights: [
      'Arepa e´ huevo con vendedora tradicional',
      'Ceviche caribeño frente al mar',
      'Carimañola y patacones',
      'Limonada de coco',
      'Café de altura colombiano',
      'Dulces tradicionales',
      'Coctel de despedida',
    ],
    included: [
      'Guía gastronómico local',
      'Todas las degustaciones',
      'Bebidas',
      'Tour cultural por Getsemaní',
    ],
    requirements: [
      'Estómago vacío para disfrutar',
      'Informar alergias alimentarias',
    ],
    schedule: [
      '05:00 PM - Encuentro en Plaza Trinidad',
      '05:15 PM - Primera parada (arepa e´huevo)',
      '06:00 PM - Ceviche caribeño',
      '07:00 PM - Dulces tradicionales',
      '08:00 PM - Coctel de despedida',
      '08:30 PM - Fin del tour',
    ],
    bestSeason: 'Todo el año',
    rating: 4.9,
    reviewsCount: 378,
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ],
    providerId: 'provider-007',
    languages: ['Español', 'Inglés', 'Francés'],
  },

  // ========== AMAZONAS ==========
  {
    id: 'act-amazonas-001',
    name: 'Expedición Selva Amazónica - 3 Días Inmersión',
    destination: 'Leticia, Amazonas',
    category: 'Aventura',
    duration: '3 días',
    price: 850000,
    difficulty: 'Difícil',
    groupSize: { min: 4, max: 8 },
    description: 'Aventura de inmersión total en la selva amazónica. Duerme en hamacas, pesca pirañas, conoce comunidades indígenas y aprende técnicas de supervivencia.',
    highlights: [
      'Navegación por el río Amazonas',
      'Pesca de pirañas',
      'Caminatas nocturnas (sonidos de la selva)',
      'Visita a comunidad indígena Tikuna',
      'Avistamiento de delfines rosados',
      'Técnicas de supervivencia en selva',
      'Observación de caimanes',
    ],
    included: [
      'Transporte fluvial',
      'Guía nativo amazónico',
      'Todas las comidas',
      'Alojamiento en maloca',
      'Equipo de camping',
      'Permisos indígenas',
    ],
    requirements: [
      'Excelente estado físico',
      'Vacuna fiebre amarilla obligatoria',
      'Edad mínima: 16 años',
      'Seguro de viaje con cobertura médica',
    ],
    schedule: [
      'Día 1: Navegación río Amazonas, llegada a maloca, caminata exploratoria',
      'Día 2: Pesca de pirañas, visita comunidad Tikuna, caminata nocturna',
      'Día 3: Avistamiento delfines, técnicas supervivencia, retorno',
    ],
    bestSeason: 'Junio a Octubre (época seca)',
    rating: 5.0,
    reviewsCount: 156,
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    ],
    providerId: 'provider-008',
    languages: ['Español', 'Inglés', 'Portugués'],
  },
];

// Funciones de utilidad
export const getActivitiesByDestination = (destination: string) =>
  realActivities.filter(act => act.destination.includes(destination));

export const getActivitiesByCategory = (category: string) =>
  realActivities.filter(act => act.category === category);

export const getActivitiesByDifficulty = (difficulty: string) =>
  realActivities.filter(act => act.difficulty === difficulty);

export const getActivitiesByPriceRange = (min: number, max: number) =>
  realActivities.filter(act => act.price >= min && act.price <= max);

export const getTopRatedActivities = (minRating: number = 4.8) =>
  realActivities
    .filter(act => act.rating >= minRating)
    .sort((a, b) => b.rating - a.rating);
