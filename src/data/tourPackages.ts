/**
 * Paquetes Turísticos Completos para Wild Tour
 * Datos realistas para diferentes destinos de Colombia
 */

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  discountPrice?: number;
  category: 'Aventura' | 'Cultura' | 'Naturaleza' | 'Relajación' | 'Romántico' | 'Familiar';
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  groupSize: { min: number; max: number };
  images: string[];
  description: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];
  included: string[];
  notIncluded: string[];
  requirements: string[];
  whatToBring: string[];
  cancellationPolicy: string;
  availability: string[];
  rating: number;
  reviewsCount: number;
  featured: boolean;
}

export const tourPackages: TourPackage[] = [
  // ========== PAQUETES VILLAVIEJA - DESIERTO DE LA TATACOA ==========
  {
    id: 'pkg-tatacoa-001',
    name: 'Experiencia Completa Tatacoa - 3 Días / 2 Noches',
    destination: 'Villavieja - Desierto de la Tatacoa',
    duration: '3 días / 2 noches',
    price: 480000,
    discountPrice: 420000,
    category: 'Aventura',
    difficulty: 'Moderado',
    groupSize: { min: 2, max: 15 },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800',
    ],
    description: 'Sumérgete en una aventura inolvidable por el segundo desierto más grande de Colombia. Explora formaciones rocosas milenarias, observa el cielo más estrellado del país y conoce la riqueza paleontológica de la región.',
    highlights: [
      'Recorrido completo por las zonas Roja y Gris del desierto',
      'Observación astronómica con telescopios profesionales',
      'Visita al Museo Paleontológico',
      'Trekking al amanecer por Los Hoyos',
      'Baño en pozos naturales',
      'Fogata bajo las estrellas',
      'Gastronomía típica huilense',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada y Exploración del Desierto Rojo',
        activities: [
          '08:00 AM - Salida desde Neiva hacia Villavieja (38 km)',
          '09:30 AM - Bienvenida y charla informativa sobre el desierto',
          '10:00 AM - Caminata guiada por el Cusco (Zona Roja)',
          '01:00 PM - Almuerzo con platos típicos',
          '03:00 PM - Visita al Museo Paleontológico',
          '05:00 PM - Tiempo libre para descanso',
          '07:00 PM - Cena bajo las estrellas',
          '09:00 PM - Primera sesión de observación astronómica',
        ],
        meals: ['Desayuno', 'Almuerzo', 'Cena'],
        accommodation: 'Glamping en el desierto o Hotel boutique',
      },
      {
        day: 2,
        title: 'Aventura en Los Hoyos y Astronomía Profunda',
        activities: [
          '05:30 AM - Trekking al amanecer (opcional)',
          '07:00 AM - Desayuno energético',
          '08:30 AM - Exploración de Los Hoyos (Zona Gris)',
          '11:00 AM - Baño en pozos naturales',
          '01:00 PM - Almuerzo campestre',
          '03:00 PM - Tiempo libre (siesta o actividades opcionales)',
          '05:00 PM - Taller de fotografía del desierto',
          '07:00 PM - Cena BBQ',
          '09:00 PM - Observación astronómica profunda con astrónomos',
          '11:00 PM - Fogata y compartir experiencias',
        ],
        meals: ['Desayuno', 'Almuerzo', 'Cena'],
        accommodation: 'Glamping en el desierto o Hotel boutique',
      },
      {
        day: 3,
        title: 'Cultura Local y Retorno',
        activities: [
          '07:00 AM - Desayuno típico',
          '08:00 AM - Visita a talleres artesanales',
          '10:00 AM - Tour por el pueblo de Villavieja',
          '11:30 AM - Compra de souvenirs',
          '12:30 PM - Almuerzo de despedida',
          '02:00 PM - Retorno a Neiva',
        ],
        meals: ['Desayuno', 'Almuerzo'],
      },
    ],
    included: [
      'Transporte privado desde/hasta Neiva',
      '2 noches de alojamiento (Glamping o Hotel según preferencia)',
      'Todas las comidas especificadas (6 desayunos, 6 almuerzos, 4 cenas)',
      'Guía turístico certificado bilingüe',
      'Todas las entradas a atracciones',
      '2 sesiones de observación astronómica con telescopios',
      'Seguro de asistencia médica',
      'Kit de hidratación y snacks',
      'Fotos profesionales del tour',
    ],
    notIncluded: [
      'Vuelo o transporte hasta Neiva',
      'Comidas no especificadas',
      'Bebidas alcohólicas',
      'Propinas',
      'Gastos personales',
    ],
    requirements: [
      'Estado físico moderado (caminatas de 2-4 horas)',
      'Edad mínima: 8 años',
      'No apto para personas con problemas cardíacos severos',
    ],
    whatToBring: [
      'Ropa cómoda de colores claros',
      'Sombrero o gorra',
      'Protector solar SPF 50+',
      'Zapatos de trekking',
      'Linterna frontal',
      'Ropa abrigada para la noche',
      'Botella de agua reutilizable',
      'Cámara fotográfica',
    ],
    cancellationPolicy: 'Cancelación gratuita hasta 7 días antes. 50% de reembolso entre 7-3 días. Sin reembolso con menos de 3 días.',
    availability: ['Todo el año (mejor época: Diciembre-Marzo)'],
    rating: 4.9,
    reviewsCount: 287,
    featured: true,
  },
  {
    id: 'pkg-tatacoa-002',
    name: 'Escapada Astronómica - 2 Días / 1 Noche',
    destination: 'Villavieja - Desierto de la Tatacoa',
    duration: '2 días / 1 noche',
    price: 320000,
    category: 'Naturaleza',
    difficulty: 'Fácil',
    groupSize: { min: 2, max: 20 },
    images: [
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800',
      'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200&h=800',
    ],
    description: 'Perfecto para amantes de la astronomía. Disfruta de dos noches bajo el cielo más estrellado de Colombia con equipos profesionales y guías astrónomos.',
    highlights: [
      'Observación con telescopios de alta potencia',
      'Charlas sobre constelaciones y planetas',
      'Fotografía astronómica',
      'Glamping bajo las estrellas',
      'Recorrido por el desierto rojo',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada y Primera Noche Estelar',
        activities: [
          '04:00 PM - Llegada y check-in en glamping',
          '05:00 PM - Charla introductoria sobre astronomía',
          '06:30 PM - Cena',
          '08:00 PM - Sesión de observación astronómica',
          '10:00 PM - Taller de astrofotografía',
        ],
        meals: ['Cena'],
        accommodation: 'Glamping astronómico',
      },
      {
        day: 2,
        title: 'Exploración y Despedida',
        activities: [
          '07:00 AM - Desayuno',
          '08:30 AM - Tour fotográfico por el desierto',
          '12:00 PM - Almuerzo y check-out',
          '02:00 PM - Retorno',
        ],
        meals: ['Desayuno', 'Almuerzo'],
      },
    ],
    included: [
      '1 noche en glamping astronómico',
      'Comidas especificadas',
      'Sesión astronómica con telescopios',
      'Guía astrónomo',
      'Transporte interno',
    ],
    notIncluded: [
      'Transporte desde/hasta Neiva',
      'Bebidas alcohólicas',
      'Seguro de viaje',
    ],
    requirements: ['Ninguno específico'],
    whatToBring: [
      'Ropa abrigada para la noche',
      'Cámara con trípode (opcional)',
      'Linterna',
      'Protector solar',
    ],
    cancellationPolicy: 'Cancelación gratuita hasta 5 días antes.',
    availability: ['Todo el año'],
    rating: 4.8,
    reviewsCount: 156,
    featured: true,
  },

  // ========== PAQUETES CARIBE COLOMBIANO ==========
  {
    id: 'pkg-caribe-001',
    name: 'Paraíso Caribeño - Cartagena y Playas del Rosario',
    destination: 'Cartagena - Islas del Rosario',
    duration: '4 días / 3 noches',
    price: 1250000,
    discountPrice: 1100000,
    category: 'Relajación',
    difficulty: 'Fácil',
    groupSize: { min: 2, max: 12 },
    images: [
      'https://images.unsplash.com/photo-1580662775429-5da99ce7df3e?w=1200&h=800',
      'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=1200&h=800',
    ],
    description: 'Explora la ciudad amurallada más hermosa de América y relájate en las paradisíacas Islas del Rosario. Historia, cultura, playas y gastronomía caribeña.',
    highlights: [
      'Tour por el Centro Histórico de Cartagena',
      'Visita al Castillo de San Felipe',
      'Día completo en Islas del Rosario',
      'Tour gastronómico por Getsemaní',
      'Sunset en las murallas',
      'Playa Blanca',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada y Tour Ciudad Amurallada',
        activities: [
          '02:00 PM - Recogida en aeropuerto',
          '03:00 PM - Check-in en hotel boutique',
          '04:00 PM - Tour guiado Centro Histórico',
          '07:00 PM - Cena en restaurante tradicional',
          '09:00 PM - Paseo nocturno por las murallas',
        ],
        meals: ['Cena'],
        accommodation: 'Hotel boutique en el Centro Histórico',
      },
      {
        day: 2,
        title: 'Islas del Rosario - Paraíso Caribeño',
        activities: [
          '07:00 AM - Desayuno',
          '08:00 AM - Salida en lancha a Islas del Rosario',
          '09:30 AM - Snorkeling en arrecifes',
          '12:00 PM - Almuerzo playero',
          '02:00 PM - Playa Blanca',
          '05:00 PM - Retorno a Cartagena',
          '08:00 PM - Cena libre',
        ],
        meals: ['Desayuno', 'Almuerzo'],
        accommodation: 'Hotel boutique',
      },
      {
        day: 3,
        title: 'Historia y Gastronomía',
        activities: [
          '08:00 AM - Desayuno',
          '09:00 AM - Visita Castillo San Felipe',
          '11:00 AM - Convento de La Popa',
          '01:00 PM - Tour gastronómico por Getsemaní',
          '05:00 PM - Tiempo libre',
          '07:00 PM - Cena especial de despedida',
        ],
        meals: ['Desayuno', 'Almuerzo', 'Cena'],
        accommodation: 'Hotel boutique',
      },
      {
        day: 4,
        title: 'Despedida Caribeña',
        activities: [
          '08:00 AM - Desayuno',
          '09:00 AM - Shopping en Las Bóvedas',
          '11:00 AM - Check-out',
          '12:00 PM - Traslado al aeropuerto',
        ],
        meals: ['Desayuno'],
      },
    ],
    included: [
      '3 noches en hotel boutique 4 estrellas',
      'Desayunos diarios',
      'Tour a Islas del Rosario con almuerzo',
      'Todos los tours mencionados',
      'Transporte privado',
      'Guía turístico bilingüe',
      'Entradas a monumentos',
    ],
    notIncluded: [
      'Vuelos',
      'Algunas comidas',
      'Propinas',
      'Gastos personales',
    ],
    requirements: ['Ninguno'],
    whatToBring: [
      'Ropa de playa',
      'Protector solar',
      'Repelente de mosquitos',
      'Ropa cómoda',
      'Cámara',
    ],
    cancellationPolicy: 'Cancelación gratuita hasta 10 días antes.',
    availability: ['Todo el año'],
    rating: 4.9,
    reviewsCount: 412,
    featured: true,
  },

  // ========== PAQUETES EJE CAFETERO ==========
  {
    id: 'pkg-cafe-001',
    name: 'Ruta del Café - Experiencia Completa',
    destination: 'Eje Cafetero (Salento, Filandia, Manizales)',
    duration: '5 días / 4 noches',
    price: 980000,
    category: 'Cultura',
    difficulty: 'Fácil',
    groupSize: { min: 2, max: 10 },
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=800',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=800',
    ],
    description: 'Descubre el corazón cafetero de Colombia. Aprende todo sobre el proceso del café, explora el Valle de Cocora y sus palmas de cera, y sumérgete en la cultura paisa.',
    highlights: [
      'Tour por fincas cafeteras tradicionales',
      'Cata profesional de café',
      'Valle de Cocora y palmas de cera',
      'Pueblos patrimonio (Salento, Filandia)',
      'Termales de Santa Rosa',
      'Parque del Café',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada a Salento',
        activities: [
          '10:00 AM - Llegada a Pereira',
          '11:30 AM - Traslado a Salento',
          '01:00 PM - Almuerzo típico',
          '02:30 PM - Tour por Salento',
          '05:00 PM - Mirador y café en el atardecer',
          '07:00 PM - Cena en restaurante local',
        ],
        meals: ['Almuerzo', 'Cena'],
        accommodation: 'Hotel tradicional en Salento',
      },
      {
        day: 2,
        title: 'Valle de Cocora y Finca Cafetera',
        activities: [
          '07:00 AM - Desayuno',
          '08:00 AM - Caminata Valle de Cocora',
          '12:00 PM - Almuerzo campestre',
          '02:00 PM - Tour finca cafetera',
          '04:00 PM - Cata de café',
          '07:00 PM - Cena',
        ],
        meals: ['Desayuno', 'Almuerzo', 'Cena'],
        accommodation: 'Hotel tradicional',
      },
      {
        day: 3,
        title: 'Filandia y Cultura Paisa',
        activities: [
          '08:00 AM - Desayuno',
          '09:00 AM - Traslado a Filandia',
          '10:00 AM - Tour por Filandia',
          '12:30 PM - Almuerzo',
          '02:00 PM - Visita a mirador',
          '04:00 PM - Taller de artesanías',
          '07:00 PM - Cena paisa tradicional',
        ],
        meals: ['Desayuno', 'Almuerzo', 'Cena'],
        accommodation: 'Hotel tradicional',
      },
      {
        day: 4,
        title: 'Termales y Relajación',
        activities: [
          '07:00 AM - Desayuno',
          '08:00 AM - Traslado a Termales Santa Rosa',
          '09:00 AM - Día en aguas termales',
          '01:00 PM - Almuerzo en termales',
          '05:00 PM - Retorno a Salento',
          '07:30 PM - Cena libre',
        ],
        meals: ['Desayuno', 'Almuerzo'],
        accommodation: 'Hotel tradicional',
      },
      {
        day: 5,
        title: 'Parque del Café y Despedida',
        activities: [
          '07:00 AM - Desayuno',
          '08:00 AM - Visita Parque del Café',
          '12:00 PM - Almuerzo',
          '02:00 PM - Traslado al aeropuerto',
        ],
        meals: ['Desayuno', 'Almuerzo'],
      },
    ],
    included: [
      '4 noches de alojamiento',
      'Todas las comidas especificadas',
      'Transporte privado',
      'Guía especializado en café',
      'Entradas a parques y fincas',
      'Tour Valle de Cocora',
      'Cata de café profesional',
    ],
    notIncluded: [
      'Vuelos',
      'Algunas comidas',
      'Propinas',
    ],
    requirements: ['Condición física básica para caminatas'],
    whatToBring: [
      'Ropa cómoda',
      'Zapatos de trekking',
      'Impermeable',
      'Traje de baño (termales)',
      'Cámara',
    ],
    cancellationPolicy: 'Cancelación gratuita hasta 7 días antes.',
    availability: ['Todo el año (mejor: Septiembre-Noviembre)'],
    rating: 4.8,
    reviewsCount: 298,
    featured: true,
  },
];

// Filtros útiles
export const getPackagesByDestination = (destination: string) =>
  tourPackages.filter(pkg => pkg.destination.includes(destination));

export const getPackagesByCategory = (category: string) =>
  tourPackages.filter(pkg => pkg.category === category);

export const getFeaturedPackages = () =>
  tourPackages.filter(pkg => pkg.featured);

export const getPackagesByPriceRange = (min: number, max: number) =>
  tourPackages.filter(pkg => pkg.price >= min && pkg.price <= max);
