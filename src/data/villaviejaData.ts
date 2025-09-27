// Datos completos del módulo de Villavieja para Wild Tour Colombia

import { Destination, Activity, Accommodation, TourismCategory } from '../domain/models/Destination';
import { GuideProfile, GuideReview, GuideStats } from '../domain/models/GuideReview';
import { ServiceWithReviews, ServiceReview, ServiceStats } from '../domain/models/ServiceReview';

// Información general de Villavieja
export const villaviejaInfo = {
  history: `Villavieja, conocida como "La Capital Paleontológica de Colombia", fue fundada en 1555 por el capitán español Pedro de Añasco. Su nombre original era "La Tora", derivado de la palabra indígena que significa "tierra seca".

  Esta región ha sido habitada durante milenios, como lo demuestran los importantes hallazgos fósiles que datan de hace 13 millones de años. Durante la época precolombina, fue territorio de los pueblos Pijao y Yalcón, quienes aprovecharon las condiciones únicas del desierto.

  En el período colonial, Villavieja fue un importante punto de paso en la ruta hacia el Alto Magdalena. En el siglo XIX, se convirtió en un centro de investigación paleontológica cuando se descubrieron los primeros fósiles importantes de la región.`,

  culture: `La cultura de Villavieja es una mezcla única de tradiciones indígenas, herencia colonial y adaptación al entorno desértico. Los habitantes locales, conocidos como "villaviejunos", han desarrollado técnicas ancestrales de supervivencia en el desierto.

  Las tradiciones incluyen la elaboración de artesanías en barro y fibras naturales, la música típica con instrumentos como la caña de millo y la tambora, y festivales como el Festival de las Estrellas que celebra la astronomía y las tradiciones ancestrales.

  La gastronomía local se caracteriza por el uso de ingredientes resistentes al clima seco, como la yuca, el plátano, y pescados del río Magdalena. Los dulces tradicionales incluyen la melcocha y los panelones.`,

  climate: `Villavieja presenta un clima seco tropical con características desérticas únicas en Colombia:

  **Temperatura:**
  - Máxima: 35-40°C durante el día
  - Mínima: 15-20°C durante la noche
  - Promedio anual: 28°C

  **Precipitaciones:**
  - Lluvias escasas: 500-600mm anuales
  - Época seca: Diciembre a Marzo
  - Época de lluvias: Abril a Noviembre (lluvia intermitente)

  **Características especiales:**
  - Humedad relativa: 40-60%
  - Vientos constantes que crean formaciones rocosas
  - Cielos despejados el 80% del año, ideal para astronomía
  - Variaciones térmicas de hasta 20°C entre día y noche`,

  location: {
    coordinates: { latitude: 3.2333, longitude: -75.1667 },
    altitude: "430 metros sobre el nivel del mar",
    area: "615 km²",
    distanceFromNeiva: "38 kilómetros",
    accessRoutes: [
      "Vía Neiva-Villavieja: Carretera pavimentada (45 min)",
      "Desde Bogotá: 5 horas vía Neiva",
      "Desde Ibagué: 3 horas vía Natagaima"
    ]
  }
};

// Atracciones turísticas de Villavieja
export const villaviejaAttractions = [
  {
    id: 'attr-1',
    name: 'Desierto de la Tatacoa',
    category: 'Formación Natural',
    description: 'El segundo desierto más grande de Colombia, con 330 km² de formaciones rocosas únicas en tonos rojos y grises.',
    highlights: [
      'Zona Roja (Cusco): Formaciones arcillosas rojizas',
      'Zona Gris (Los Hoyos): Laberintos de rocas grises',
      'Observatorio Astronómico',
      'Senderos interpretativos',
      'Pozos naturales de agua'
    ],
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop'
    ],
    timeRequired: '1-2 días',
    difficulty: 'Moderado',
    bestTimeToVisit: 'Diciembre a Marzo',
    price: 15000
  },
  {
    id: 'attr-2',
    name: 'Observatorio Astronómico de la Tatacoa',
    category: 'Ciencia y Tecnología',
    description: 'Centro de investigación astronómica con uno de los cielos más limpios de Colombia para observación estelar.',
    highlights: [
      'Telescopios profesionales disponibles',
      'Tours nocturnos guiados',
      'Charlas sobre astronomía',
      'Observación de planetas y galaxias',
      'Fotografía astronómica'
    ],
    images: [
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
    ],
    timeRequired: '3-4 horas',
    difficulty: 'Fácil',
    bestTimeToVisit: 'Todo el año',
    price: 25000
  },
  {
    id: 'attr-3',
    name: 'Museo Paleontológico',
    category: 'Educativo Cultural',
    description: 'Exhibición de fósiles únicos encontrados en la región, incluyendo especies extintas de hace 13 millones de años.',
    highlights: [
      'Fósiles de perezosos gigantes',
      'Esqueletos de armadillos prehistóricos',
      'Dientes de tiburones del Mioceno',
      'Recreaciones de ecosistemas antiguos',
      'Talleres de paleontología'
    ],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    timeRequired: '2 horas',
    difficulty: 'Fácil',
    bestTimeToVisit: 'Todo el año',
    price: 8000
  },
  {
    id: 'attr-4',
    name: 'Sitios Arqueológicos',
    category: 'Patrimonio Histórico',
    description: 'Vestigios de culturas precolombinas con petroglifos y herramientas líticas.',
    highlights: [
      'Petroglifos de Los Hoyos',
      'Herramientas líticas antiguas',
      'Sitios ceremoniales',
      'Arte rupestre',
      'Interpretación cultural'
    ],
    images: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d7d720?w=800&h=600&fit=crop'
    ],
    timeRequired: '2-3 horas',
    difficulty: 'Moderado',
    bestTimeToVisit: 'Diciembre a Marzo',
    price: 12000
  }
];

// Actividades disponibles en Villavieja
export const villaviejaActivities: Activity[] = [
  {
    id: 'vill-act-1',
    name: 'Senderismo Ecológico por el Desierto',
    description: 'Caminata interpretativa por los senderos del desierto con guía especializado en flora y fauna xerofítica.',
    duration: '4 horas',
    price: 65000,
    difficulty: 'Moderado',
    category: 'Naturaleza',
    included: [
      'Guía especializado en ecología',
      'Kit de hidratación',
      'Sombrero y protector solar',
      'Bastones de trekking',
      'Refrigerio energético'
    ],
    requirements: [
      'Calzado de trekking',
      'Ropa larga de colores claros',
      'Gorro y gafas de sol',
      'Bloqueador solar factor 50+',
      'Botella de agua adicional'
    ]
  },
  {
    id: 'vill-act-2',
    name: 'Observación Astronómica Nocturna',
    description: 'Tour nocturno con telescopios profesionales para observar constelaciones, planetas y objetos del espacio profundo.',
    duration: '3 horas',
    price: 85000,
    difficulty: 'Fácil',
    category: 'Ciencia',
    included: [
      'Telescopios profesionales',
      'Guía astronómico certificado',
      'Cartas estelares',
      'Sillas plegables',
      'Bebida caliente',
      'Manta térmica'
    ],
    requirements: [
      'Ropa abrigada para la noche',
      'Linterna con luz roja',
      'Abrigo impermeable',
      'Reserva previa requerida'
    ]
  },
  {
    id: 'vill-act-3',
    name: 'Fotografía de Paisajes Desérticos',
    description: 'Taller de fotografía especializado en capturar la belleza única del desierto en diferentes momentos del día.',
    duration: '6 horas',
    price: 120000,
    difficulty: 'Moderado',
    category: 'Arte',
    included: [
      'Instructor de fotografía profesional',
      'Transporte a mejores ubicaciones',
      'Trípodes profesionales',
      'Filtros para cámara',
      'Almuerzo de campo',
      'Edición básica digital'
    ],
    requirements: [
      'Cámara digital (réflex o mirrorless)',
      'Baterías adicionales',
      'Tarjetas de memoria',
      'Conocimientos básicos de fotografía'
    ]
  },
  {
    id: 'vill-act-4',
    name: 'Ciclismo de Montaña',
    description: 'Recorrido en bicicleta por senderos desérticos y formaciones rocosas con diferentes niveles de dificultad.',
    duration: '5 horas',
    price: 95000,
    difficulty: 'Difícil',
    category: 'Aventura',
    included: [
      'Bicicleta de montaña especializada',
      'Casco y protecciones',
      'Herramientas de reparación',
      'Guía especializado',
      'Hidratación deportiva',
      'Kit de primeros auxilios'
    ],
    requirements: [
      'Experiencia previa en ciclismo',
      'Excelente condición física',
      'Ropa deportiva transpirable',
      'Calzado deportivo cerrado',
      'Certificado médico'
    ]
  },
  {
    id: 'vill-act-5',
    name: 'Camping bajo las Estrellas',
    description: 'Experiencia de campamento en el desierto con observación astronómica y actividades nocturnas.',
    duration: '12 horas',
    price: 150000,
    difficulty: 'Moderado',
    category: 'Aventura',
    included: [
      'Carpa profesional para desierto',
      'Sleeping bag térmico',
      'Colchoneta aislante',
      'Cena y desayuno',
      'Observación astronómica',
      'Fogata controlada',
      'Guía nocturno'
    ],
    requirements: [
      'Ropa para clima frío nocturno',
      'Artículos de aseo personal',
      'Medicamentos personales',
      'Linterna',
      'Espíritu aventurero'
    ]
  }
];

// Alojamientos en Villavieja
export const villaviejaAccommodations: Accommodation[] = [
  {
    id: 'vill-acc-1',
    name: 'Hotel Estelar Tatacoa',
    type: 'Hotel',
    description: 'Hotel boutique con temática astronómica, ubicado estratégicamente para observación estelar.',
    pricePerNight: 180000,
    amenities: [
      'Observatorio privado',
      'Piscina',
      'Restaurante especializado',
      'WiFi',
      'Aire acondicionado',
      'Tours astronómicos incluidos',
      'Spa',
      'Bar temático'
    ],
    maxGuests: 4,
    images: ['hotel-estelar1.jpg', 'hotel-estelar2.jpg'],
    rating: 4.7,
    totalReviews: 156,
    available: true
  },
  {
    id: 'vill-acc-2',
    name: 'Hostería Posada del Desierto',
    type: 'Hotel',
    description: 'Alojamiento familiar con auténtica hospitalidad huilense y comida tradicional.',
    pricePerNight: 95000,
    amenities: [
      'Desayuno tradicional incluido',
      'WiFi',
      'Ventiladores',
      'Hamacas',
      'Cocina compartida',
      'Área de camping',
      'Tours locales'
    ],
    maxGuests: 3,
    images: ['hosteria1.jpg', 'hosteria2.jpg'],
    rating: 4.3,
    totalReviews: 89,
    available: true
  },
  {
    id: 'vill-acc-3',
    name: 'Glamping Noches Estrelladas',
    type: 'Glamping',
    description: 'Experiencia de lujo en el desierto con domos panorámicos para observación estelar.',
    pricePerNight: 250000,
    amenities: [
      'Domo panorámico',
      'Baño privado',
      'Cama queen premium',
      'Telescopio personal',
      'Cena gourmet incluida',
      'Desayuno continental',
      'Aire acondicionado silencioso'
    ],
    maxGuests: 2,
    images: ['glamping1.jpg', 'glamping2.jpg'],
    rating: 4.9,
    totalReviews: 67,
    available: true
  },
  {
    id: 'vill-acc-4',
    name: 'Casa Rural La Tatacoa',
    type: 'Casa Rural',
    description: 'Auténtica casa campestre para grupos grandes con todas las comodidades y vista al desierto.',
    pricePerNight: 320000,
    amenities: [
      'Casa completa',
      '4 habitaciones',
      '3 baños',
      'Cocina equipada',
      'Sala de estar',
      'Asador',
      'Zona de hamacas',
      'Área de juegos'
    ],
    maxGuests: 12,
    images: ['casa-rural1.jpg', 'casa-rural2.jpg'],
    rating: 4.5,
    totalReviews: 34,
    available: true
  },
  {
    id: 'vill-acc-5',
    name: 'Camping Tierra Roja',
    type: 'Cabañas',
    description: 'Zona de camping equipada en el corazón del desierto con servicios básicos.',
    pricePerNight: 25000,
    amenities: [
      'Área para carpas',
      'Baños compartidos',
      'Duchas con agua caliente',
      'Área de cocina',
      'Fogatas permitidas',
      'Tienda de suministros',
      'Seguridad 24h'
    ],
    maxGuests: 6,
    images: ['camping1.jpg', 'camping2.jpg'],
    rating: 4.1,
    totalReviews: 123,
    available: true
  }
];

// Gastronomía local de Villavieja
export const villaviejaGastronomy = {
  restaurants: [
    {
      id: 'rest-1',
      name: 'Restaurante El Cuzco',
      type: 'Tradicional',
      specialties: ['Sancocho huilense', 'Mojarra frita', 'Tamales tolimenses', 'Arepas de maíz'],
      priceRange: '$$',
      description: 'Auténtica cocina huilense en ambiente familiar con ingredientes locales.',
      location: 'Centro de Villavieja',
      hours: '6:00 AM - 10:00 PM',
      rating: 4.6,
      image: 'resto-cuzco.jpg'
    },
    {
      id: 'rest-2',
      name: 'Asadero Las Estrellas',
      type: 'Parrilla',
      specialties: ['Carne a la llanera', 'Chuleta de cerdo', 'Chorizo artesanal', 'Yuca asada'],
      priceRange: '$$$',
      description: 'Carnes premium cocinadas a la parrilla bajo el cielo estrellado del desierto.',
      location: 'Entrada al desierto',
      hours: '5:00 PM - 11:00 PM',
      rating: 4.8,
      image: 'asadero-estrellas.jpg'
    },
    {
      id: 'rest-3',
      name: 'Café Paleontológico',
      type: 'Cafetería',
      specialties: ['Café huilense premium', 'Achiras', 'Dulce de guayaba', 'Jugos naturales'],
      priceRange: '$',
      description: 'Cafetería temática con fósiles y historia local, perfecta para un descanso.',
      location: 'Junto al museo',
      hours: '7:00 AM - 6:00 PM',
      rating: 4.4,
      image: 'cafe-paleo.jpg'
    }
  ],

  traditionalDishes: [
    {
      name: 'Sancocho Huilense',
      description: 'Sopa tradicional con gallina criolla, yuca, plátano, mazorca y condimentos locales.',
      ingredients: ['Gallina criolla', 'Yuca', 'Plátano verde', 'Mazorca', 'Cilantro', 'Cebolla larga'],
      price: 18000,
      image: 'sancocho-huilense.jpg'
    },
    {
      name: 'Mojarra Frita',
      description: 'Pescado fresco del Magdalena, frito entero y acompañado de patacones y ensalada.',
      ingredients: ['Mojarra fresca', 'Plátano verde', 'Lechuga', 'Tomate', 'Limón'],
      price: 22000,
      image: 'mojarra-frita.jpg'
    },
    {
      name: 'Tamales Huilenses',
      description: 'Masa de maíz rellena de cerdo, pollo, garbanzos y huevo, envuelta en hoja de bijao.',
      ingredients: ['Masa de maíz', 'Cerdo', 'Pollo', 'Garbanzos', 'Huevo', 'Hoja de bijao'],
      price: 12000,
      image: 'tamales-huilenses.jpg'
    }
  ],

  localProducts: [
    {
      name: 'Melcocha de Panela',
      description: 'Dulce tradicional hecho con panela pura, típico de la región.',
      price: 5000,
      vendor: 'Dulcería Doña María'
    },
    {
      name: 'Achiras',
      description: 'Galletas crocantes hechas con harina de achira, especialidad huilense.',
      price: 8000,
      vendor: 'Panadería Central'
    },
    {
      name: 'Café Especial Huila',
      description: 'Café de origen single estate cultivado en las montañas cercanas.',
      price: 15000,
      vendor: 'Cooperativa Cafetera'
    }
  ]
};

// Servicios y logística en Villavieja
export const villaviejaServices = {
  transportation: [
    {
      type: 'Bus Intermunicipal',
      provider: 'Cooperativa Magdalena',
      route: 'Neiva - Villavieja',
      frequency: 'Cada 30 minutos',
      price: 8000,
      duration: '45 minutos',
      schedule: '5:00 AM - 10:00 PM'
    },
    {
      type: 'Taxi Local',
      provider: 'Asociación de Taxistas',
      coverage: 'Casco urbano y desierto',
      pricePerKm: 2500,
      contact: '+57 318 456 7890',
      available: '24 horas'
    },
    {
      type: 'Mototaxi',
      provider: 'Mototaxistas Unidos',
      coverage: 'Centro y zonas rurales',
      priceBase: 3000,
      contact: '+57 315 123 4567',
      available: '6:00 AM - 8:00 PM'
    }
  ],

  guides: [] as any[], // Reemplazado por villaviejaGuides más abajo

  equipment: [
    {
      item: 'Telescopio Profesional',
      description: 'Telescopio refractor para observación astronómica',
      pricePerDay: 25000,
      provider: 'Observatorio Tatacoa'
    },
    {
      item: 'Equipo de Camping Completo',
      description: 'Carpa, sleeping bags, colchonetas para 4 personas',
      pricePerDay: 40000,
      provider: 'Aventura Extrema'
    },
    {
      item: 'Bicicletas de Montaña',
      description: 'Bicicletas todo terreno con casco y protecciones',
      pricePerDay: 35000,
      provider: 'Bike Rental Tatacoa'
    }
  ],

  healthServices: [
    {
      name: 'Centro de Salud Villavieja',
      type: 'Puesto de Salud',
      address: 'Carrera 4 # 5-67',
      phone: '+57 8 8390123',
      schedule: '24 horas emergencias, 7:00 AM - 5:00 PM consulta',
      services: ['Urgencias', 'Medicina general', 'Primeros auxilios']
    },
    {
      name: 'Farmacia San Rafael',
      type: 'Farmacia',
      address: 'Calle 6 # 4-12',
      phone: '+57 8 8390456',
      schedule: '7:00 AM - 9:00 PM',
      services: ['Medicamentos', 'Botiquín de emergencia', 'Sueros']
    }
  ],

  fuelStations: [
    {
      name: 'Estación de Servicio Terpel',
      address: 'Entrada principal Villavieja',
      fuels: ['Gasolina corriente', 'ACPM'],
      services: ['Lubricantes', 'Llantería básica', 'Tienda'],
      schedule: '6:00 AM - 8:00 PM'
    }
  ]
};

// Experiencias y paquetes completos
export const villaviejaPackages = [
  {
    id: 'pack-1',
    name: 'Escapada Astronómica de 1 Día',
    duration: '1 día',
    type: 'Individual/Pareja',
    description: 'Día completo de exploración del desierto con observación astronómica nocturna.',
    included: [
      'Transporte desde Neiva',
      'Tour diurno por el desierto',
      'Almuerzo tradicional',
      'Observación astronómica nocturna',
      'Guía especializado',
      'Telescopio profesional'
    ],
    notIncluded: ['Alojamiento', 'Cenas', 'Seguros de viaje'],
    price: 185000,
    minPersons: 1,
    maxPersons: 8,
    bestFor: ['Parejas románticas', 'Amantes de la astronomía', 'Fotógrafos'],
    difficulty: 'Fácil',
    image: 'pack-astronomico.jpg'
  },
  {
    id: 'pack-2',
    name: 'Aventura Completa 2 Días',
    duration: '2 días, 1 noche',
    type: 'Aventura',
    description: 'Experiencia completa con actividades diurnas, camping nocturno y múltiples atracciones.',
    included: [
      'Transporte ida y vuelta',
      'Alojamiento en glamping',
      'Todas las comidas',
      'Senderismo ecológico',
      'Ciclismo de montaña',
      'Observación astronómica',
      'Visita al museo paleontológico',
      'Guías especializados',
      'Equipos de actividades'
    ],
    notIncluded: ['Seguros de viaje', 'Gastos personales', 'Propinas'],
    price: 380000,
    minPersons: 2,
    maxPersons: 12,
    bestFor: ['Grupos de aventura', 'Familias activas', 'Amigos'],
    difficulty: 'Moderado',
    image: 'pack-aventura.jpg'
  },
  {
    id: 'pack-3',
    name: 'Experiencia Familiar 3 Días',
    duration: '3 días, 2 noches',
    type: 'Familiar',
    description: 'Paquete diseñado para familias con actividades educativas y entretenimiento para todas las edades.',
    included: [
      'Alojamiento familiar (casa rural)',
      'Todas las comidas',
      'Tours educativos adaptados para niños',
      'Talleres de paleontología',
      'Observación astronómica familiar',
      'Actividades recreativas',
      'Materiales educativos',
      'Guías especializados en turismo familiar'
    ],
    notIncluded: ['Transporte', 'Actividades opcionales', 'Souvenirs'],
    price: 450000,
    minPersons: 4,
    maxPersons: 10,
    bestFor: ['Familias con niños', 'Grupos educativos', 'Colegios'],
    difficulty: 'Fácil',
    image: 'pack-familiar.jpg'
  },
  {
    id: 'pack-4',
    name: 'Tour Especializado en Astronomía',
    duration: '2 días, 1 noche',
    type: 'Especializado',
    description: 'Para verdaderos entusiastas de la astronomía con equipos profesionales y charlas especializadas.',
    included: [
      'Alojamiento en hotel astronómico',
      'Acceso a telescopios profesionales',
      'Charlas con astrónomos',
      'Software de astronomía',
      'Fotografía astronómica',
      'Certificado de participación',
      'Material especializado'
    ],
    notIncluded: ['Transporte', 'Comidas no especificadas', 'Equipo personal de fotografía'],
    price: 520000,
    minPersons: 2,
    maxPersons: 6,
    bestFor: ['Astrónomos aficionados', 'Estudiantes de ciencias', 'Fotógrafos especializados'],
    difficulty: 'Moderado',
    image: 'pack-astronomia.jpg'
  },
  {
    id: 'pack-5',
    name: 'Escapada Romántica Bajo las Estrellas',
    duration: '2 días, 1 noche',
    type: 'Romántico',
    description: 'Experiencia íntima para parejas con servicios personalizados y ambiente romántico.',
    included: [
      'Alojamiento en glamping premium',
      'Cena romántica bajo las estrellas',
      'Spa de parejas',
      'Observación astronómica privada',
      'Desayuno en la habitación',
      'Decoración especial',
      'Fotografía profesional de recuerdo'
    ],
    notIncluded: ['Transporte', 'Bebidas alcohólicas premium', 'Tratamientos spa adicionales'],
    price: 680000,
    minPersons: 2,
    maxPersons: 2,
    bestFor: ['Parejas', 'Luna de miel', 'Aniversarios'],
    difficulty: 'Fácil',
    image: 'pack-romantico.jpg'
  }
];

// Información práctica para viajeros
export const practicalInfo = {
  whatToPack: {
    clothing: [
      'Ropa ligera y transpirable para el día',
      'Ropa abrigada para las noches (15-20°C)',
      'Calzado cerrado y cómodo para caminar',
      'Sandalias para descanso',
      'Gorro o sombrero',
      'Chaqueta cortavientos',
      'Ropa de baño (si hay piscina en alojamiento)'
    ],
    personalItems: [
      'Protector solar factor 50+ (OBLIGATORIO)',
      'Gafas de sol de buena calidad',
      'Repelente de insectos',
      'Botella de agua reutilizable',
      'Botiquín personal básico',
      'Medicamentos personales',
      'Cargadores para dispositivos electrónicos',
      'Baterías adicionales'
    ],
    optional: [
      'Cámara fotográfica',
      'Binoculares',
      'Linterna con luz roja (para astronomía)',
      'Libros sobre astronomía o paleontología',
      'Snacks energéticos',
      'Termo para bebidas'
    ]
  },

  safetyRecommendations: [
    'Mantenerse hidratado constantemente (mínimo 3 litros de agua por día)',
    'Usar protector solar cada 2 horas, incluso en días nublados',
    'No alejarse de los senderos marcados sin guía',
    'Informar siempre sobre su ubicación a los operadores turísticos',
    'Evitar caminatas durante las horas más calurosas (11:00 AM - 3:00 PM)',
    'Respetar la fauna local (serpientes, escorpiones, arañas)',
    'No tocar ni mover rocas sin supervisión',
    'Llevar siempre un silbato para emergencias',
    'Verificar las condiciones climáticas antes de cada actividad'
  ],

  emergencyContacts: [
    {
      service: 'Policía Nacional',
      number: '123',
      local: '+57 8 8390789'
    },
    {
      service: 'Bomberos',
      number: '119',
      local: '+57 8 8390456'
    },
    {
      service: 'Cruz Roja',
      number: '132',
      local: '+57 8 8390123'
    },
    {
      service: 'Centro de Salud Villavieja',
      number: '+57 8 8390123',
      hours: '24 horas emergencias'
    },
    {
      service: 'Defensa Civil',
      number: '144',
      local: '+57 8 8390999'
    }
  ],

  banking: [
    {
      name: 'Cajero Bancolombia',
      location: 'Centro de Villavieja - Calle 5 # 4-23',
      services: ['Retiros', 'Consultas'],
      hours: '24 horas'
    },
    {
      name: 'Corresponsal Bancario Efecty',
      location: 'Carrera 4 # 6-12',
      services: ['Retiros', 'Depósitos', 'Pagos'],
      hours: '8:00 AM - 8:00 PM'
    }
  ],

  connectivity: {
    mobile: [
      'Claro: Buena cobertura en el centro, limitada en el desierto',
      'Movistar: Cobertura regular en el centro',
      'Tigo: Cobertura básica'
    ],
    internet: [
      'WiFi disponible en hoteles y restaurantes principales',
      'Velocidad limitada debido a la ubicación rural',
      'Se recomienda descargar mapas offline antes del viaje'
    ],
    recommendations: [
      'Descargar aplicaciones offline antes del viaje',
      'Coordinar puntos de encuentro en caso de pérdida de señal',
      'Llevar baterías portátiles para dispositivos',
      'Informar itinerarios detallados a familiares'
    ]
  }
};

// Datos completos de destino para Villavieja
export const villaviejaDestination: Destination = {
  id: 'villavieja-complete',
  name: 'Villavieja - Capital Paleontológica',
  slug: 'villavieja-capital-paleontologica',
  description: `Villavieja, conocida como "La Capital Paleontológica de Colombia", es un destino único donde se encuentran el Desierto de la Tatacoa, importantes yacimientos fósiles y uno de los mejores cielos para observación astronómica del país.

  Este municipio del Huila ofrece una experiencia completa que combina ciencia, naturaleza, aventura y cultura en un entorno desértico excepcional. Desde fósiles de 13 millones de años hasta espectáculos astronómicos nocturnos, Villavieja es el destino perfecto para quienes buscan algo diferente en Colombia.`,

  shortDescription: 'Capital paleontológica con desierto, astronomía y ciencia',
  location: {
    latitude: 3.2333,
    longitude: -75.1667,
    address: 'Villavieja, Huila',
    city: 'Villavieja',
    department: 'Huila',
    country: 'Colombia'
  },
  images: {
    main: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  },
  categories: [
    { id: '1', name: 'Naturaleza', icon: 'Leaf', description: 'Desierto único en Colombia' },
    { id: '2', name: 'Ciencia', icon: 'Telescope', description: 'Astronomía y paleontología' },
    { id: '3', name: 'Aventura', icon: 'Mountain', description: 'Actividades en el desierto' }
  ],
  tourismType: 'Naturaleza',
  difficulty: 'Moderado',
  activities: villaviejaActivities,
  accommodations: villaviejaAccommodations,
  priceRange: {
    min: 25000,
    max: 680000,
    currency: 'COP',
    includes: ['Actividades básicas', 'Tours guiados']
  },
  duration: {
    minimum: '1 día',
    recommended: '2-3 días'
  },
  bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero', 'Marzo'],
  weather: {
    temperature: { min: 15, max: 40, avg: 28 },
    humidity: 50,
    precipitation: 550,
    season: 'Seca',
    bestTimeToVisit: ['Diciembre', 'Enero', 'Febrero', 'Marzo'],
    currentCondition: 'Despejado y seco, ideal para astronomía'
  },
  howToGetThere: {
    byBus: 'Desde Neiva: Bus cada 30 min, 45 minutos de viaje',
    byCar: 'Vía Neiva-Villavieja, carretera pavimentada en excelente estado',
    estimatedTime: '45 minutos desde Neiva, 5 horas desde Bogotá'
  },
  rating: 4.8,
  totalReviews: 342,
  available: true,
  featured: true,
  tags: ['desierto', 'astronomía', 'paleontología', 'ciencia', 'aventura', 'tatacoa', 'estrellas', 'fósiles'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Datos completos de los guías con reviews y estadísticas
export const villaviejaGuides: GuideProfile[] = [
  {
    id: 'guide-1',
    name: 'Carlos Mendoza',
    specialty: 'Astronomía y Geología',
    experience: '15 años',
    languages: ['Español', 'Inglés'],
    certifications: ['Guía certificado SENA', 'Especialista en astronomía', 'Certificación internacional de astronomía'],
    contact: '+57 312 345 6789',
    pricePerDay: 80000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Guía especializado con 15 años de experiencia en astronomía y geología del desierto de la Tatacoa. Apasionado por compartir los secretos del universo y la historia geológica de esta región única.',
    location: 'Villavieja, Huila',
    availableDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    maxGroupSize: 12,
    equipmentIncluded: ['Telescopio profesional', 'Linterna roja', 'Material educativo', 'Binoculares'],
    isActive: true,
    isVerified: true,
    joinedDate: '2019-03-15',
    lastActiveDate: '2024-01-20',
    stats: {
      totalReviews: 94,
      averageRating: 4.8,
      categoryAverages: {
        knowledge: 4.9,
        communication: 4.8,
        punctuality: 4.7,
        professionalism: 4.8,
        overall: 4.8
      },
      ratingDistribution: {
        1: 1,
        2: 2,
        3: 5,
        4: 18,
        5: 68
      },
      verifiedReviews: 89,
      responseRate: 95,
      recommendationRate: 96,
      recentActivity: {
        lastReview: '2024-01-18',
        reviewsThisMonth: 8,
        reviewsThisYear: 94
      }
    },
    reviews: [
      {
        id: 'review-1',
        userId: 'user-1',
        userName: 'María González',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b167?w=50&h=50&fit=crop&crop=face',
        guideId: 'guide-1',
        guideName: 'Carlos Mendoza',
        tourDate: '2024-01-15',
        tourType: 'Astronomía y Geología',
        tourDuration: 4,
        groupSize: 6,
        title: 'Una experiencia astronómica increíble',
        comment: 'Carlos es un guía excepcional. Su conocimiento sobre astronomía es impresionante y sabe cómo transmitir su pasión de manera que todos entendamos. La observación nocturna fue mágica, nos mostró nebulosas y galaxias que nunca habíamos visto. Definitivamente recomendado.',
        rating: {
          knowledge: 5,
          communication: 5,
          punctuality: 5,
          professionalism: 5,
          overall: 5
        },
        media: [],
        travelWith: 'family',
        recommendedFor: ['Familias con niños', 'Principiantes', 'Estudiantes'],
        helpfulVotes: 12,
        reportedCount: 0,
        verified: true,
        status: 'approved',
        createdAt: '2024-01-16T09:30:00Z',
        guideResponse: {
          id: 'response-1',
          content: '¡Muchas gracias María! Me alegra mucho que hayan disfrutado la experiencia. Es un placer compartir mi pasión por las estrellas con familias tan entusiastas como la suya.',
          createdAt: '2024-01-16T14:20:00Z'
        }
      },
      {
        id: 'review-2',
        userId: 'user-2',
        userName: 'Juan Pérez',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        guideId: 'guide-1',
        guideName: 'Carlos Mendoza',
        tourDate: '2024-01-10',
        tourType: 'Geología del Desierto',
        tourDuration: 6,
        groupSize: 4,
        title: 'Excelente conocimiento geológico',
        comment: 'Como geólogo profesional, puedo decir que Carlos tiene un conocimiento sólido sobre la formación del desierto. Sus explicaciones son precisas y fascinantes. El tour superó mis expectativas.',
        rating: {
          knowledge: 5,
          communication: 4,
          punctuality: 5,
          professionalism: 5,
          overall: 5
        },
        media: [],
        travelWith: 'couple',
        recommendedFor: ['Aventureros experimentados', 'Estudiantes'],
        helpfulVotes: 8,
        reportedCount: 0,
        verified: true,
        status: 'approved',
        createdAt: '2024-01-11T16:45:00Z'
      }
    ]
  },
  {
    id: 'guide-2',
    name: 'Ana Lucía Torres',
    specialty: 'Ecoturismo y Flora Desértica',
    experience: '10 años',
    languages: ['Español', 'Francés'],
    certifications: ['Bióloga', 'Guía de naturaleza', 'Especialista en flora desértica'],
    contact: '+57 300 987 6543',
    pricePerDay: 75000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Bióloga especializada en ecosistemas desérticos con 10 años de experiencia guiando turistas por la flora única del desierto de la Tatacoa. Apasionada por la conservación y educación ambiental.',
    location: 'Villavieja, Huila',
    availableDays: ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    maxGroupSize: 10,
    equipmentIncluded: ['Lupas de campo', 'Guías de flora', 'Kit de primeros auxilios', 'Protección solar'],
    isActive: true,
    isVerified: true,
    joinedDate: '2020-05-20',
    lastActiveDate: '2024-01-19',
    stats: {
      totalReviews: 67,
      averageRating: 4.7,
      categoryAverages: {
        knowledge: 4.8,
        communication: 4.9,
        punctuality: 4.5,
        professionalism: 4.7,
        overall: 4.7
      },
      ratingDistribution: {
        1: 0,
        2: 1,
        3: 8,
        4: 22,
        5: 36
      },
      verifiedReviews: 62,
      responseRate: 88,
      recommendationRate: 94,
      recentActivity: {
        lastReview: '2024-01-17',
        reviewsThisMonth: 5,
        reviewsThisYear: 67
      }
    },
    reviews: [
      {
        id: 'review-3',
        userId: 'user-3',
        userName: 'Sophie Dubois',
        userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face',
        guideId: 'guide-2',
        guideName: 'Ana Lucía Torres',
        tourDate: '2024-01-12',
        tourType: 'Flora Desértica',
        tourDuration: 5,
        groupSize: 8,
        title: 'Une expérience éducative magnifique',
        comment: 'Ana Lucía es increíble. Aunque hablo francés, ella se comunicó perfectamente en mi idioma y me enseñó muchas plantas que nunca había visto. Su pasión por la naturaleza es contagiosa. ¡Muy recomendada!',
        rating: {
          knowledge: 5,
          communication: 5,
          punctuality: 4,
          professionalism: 5,
          overall: 5
        },
        media: [],
        travelWith: 'solo',
        recommendedFor: ['Viajeros solitarios', 'Estudiantes', 'Fotógrafos'],
        helpfulVotes: 15,
        reportedCount: 0,
        verified: true,
        status: 'approved',
        createdAt: '2024-01-13T11:20:00Z',
        guideResponse: {
          id: 'response-2',
          content: 'Merci beaucoup Sophie! It was a pleasure sharing the desert flora with you. Your enthusiasm and questions made the tour even more enjoyable.',
          createdAt: '2024-01-13T18:45:00Z'
        }
      }
    ]
  },
  {
    id: 'guide-3',
    name: 'José Ramírez',
    specialty: 'Historia y Paleontología',
    experience: '20 años',
    languages: ['Español'],
    certifications: ['Historiador', 'Especialista en paleontología', 'Guía cultural certificado'],
    contact: '+57 311 567 8901',
    pricePerDay: 70000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Historiador con 20 años de experiencia en la región. Especializado en paleontología y cultura precolombina del desierto de la Tatacoa. Conoce cada rincón histórico y cada hallazgo paleontológico importante.',
    location: 'Villavieja, Huila',
    availableDays: ['Lunes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    maxGroupSize: 15,
    equipmentIncluded: ['Material educativo', 'Mapas históricos', 'Réplicas de fósiles', 'Audioguía'],
    isActive: true,
    isVerified: true,
    joinedDate: '2018-08-10',
    lastActiveDate: '2024-01-18',
    stats: {
      totalReviews: 128,
      averageRating: 4.6,
      categoryAverages: {
        knowledge: 4.9,
        communication: 4.4,
        punctuality: 4.3,
        professionalism: 4.5,
        overall: 4.6
      },
      ratingDistribution: {
        1: 2,
        2: 5,
        3: 15,
        4: 38,
        5: 68
      },
      verifiedReviews: 115,
      responseRate: 75,
      recommendationRate: 89,
      recentActivity: {
        lastReview: '2024-01-16',
        reviewsThisMonth: 11,
        reviewsThisYear: 128
      }
    },
    reviews: [
      {
        id: 'review-4',
        userId: 'user-4',
        userName: 'Diego Morales',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        guideId: 'guide-3',
        guideName: 'José Ramírez',
        tourDate: '2024-01-08',
        tourType: 'Historia y Paleontología',
        tourDuration: 7,
        groupSize: 12,
        title: 'Un viaje a través del tiempo',
        comment: 'José es una enciclopedia viviente. Su conocimiento sobre la historia de la región y los fósiles es increíble. Aunque a veces se extiende demasiado en las explicaciones, la información que comparte es fascinante.',
        rating: {
          knowledge: 5,
          communication: 4,
          punctuality: 4,
          professionalism: 4,
          overall: 4
        },
        media: [],
        travelWith: 'friends',
        recommendedFor: ['Estudiantes', 'Familias con niños', 'Adultos mayores'],
        helpfulVotes: 9,
        reportedCount: 0,
        verified: true,
        status: 'approved',
        createdAt: '2024-01-09T13:15:00Z'
      }
    ]
  }
];

// Actualizar la referencia en villaviejaServices
villaviejaServices.guides = villaviejaGuides.map(guide => ({
  name: guide.name,
  specialty: guide.specialty,
  experience: guide.experience,
  languages: guide.languages,
  certifications: guide.certifications,
  contact: guide.contact,
  pricePerDay: guide.pricePerDay,
  // Agregar campos adicionales para compatibilidad
  id: guide.id,
  avatar: guide.avatar,
  rating: guide.stats.averageRating,
  totalReviews: guide.stats.totalReviews,
  verified: guide.isVerified
}));

// Servicios con sistema de reviews integrado
export const villaviejaServicesWithReviews: { [key: string]: ServiceWithReviews[] } = {
  transportation: [
    {
      id: 'transport-1',
      name: 'Bus Intermunicipal Neiva-Villavieja',
      type: 'transportation',
      provider: 'Cooperativa Magdalena',
      description: 'Servicio de transporte público entre Neiva y Villavieja con frecuencia cada 30 minutos',
      baseInfo: {
        route: 'Neiva - Villavieja',
        frequency: 'Cada 30 minutos',
        price: 8000,
        duration: '45 minutos',
        schedule: '5:00 AM - 10:00 PM'
      },
      stats: {
        totalReviews: 47,
        averageRating: 4.2,
        categoryAverages: {
          punctuality: 4.0,
          comfort: 3.8,
          safety: 4.5,
          driverService: 4.3,
          overall: 4.2
        },
        ratingDistribution: { 1: 2, 2: 3, 3: 8, 4: 18, 5: 16 },
        verifiedReviews: 35,
        responseRate: 15,
        recentActivity: {
          lastReview: '2024-01-15T09:30:00Z',
          reviewsThisMonth: 12,
          reviewsThisYear: 47
        }
      },
      reviews: [
        {
          id: 'rev-t1',
          userId: 'user-21',
          userName: 'Sandra López',
          serviceId: 'transport-1',
          serviceName: 'Bus Intermunicipal Neiva-Villavieja',
          serviceType: 'transportation',
          providerName: 'Cooperativa Magdalena',
          serviceDate: '2024-01-10T08:00:00Z',
          duration: 45,
          title: 'Servicio confiable y puntual',
          comment: 'He usado este bus varias veces para ir al desierto. Generalmente es puntual y los conductores son amables. Los asientos podrían ser más cómodos pero por el precio está bien.',
          rating: {
            punctuality: 4,
            comfort: 3,
            safety: 5,
            driverService: 4,
            overall: 4
          },
          media: [],
          usedFor: 'tourism',
          groupSize: 2,
          recommendedFor: ['Turistas nacionales', 'Viajeros con presupuesto limitado'],
          helpfulVotes: 8,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-10T16:45:00Z'
        }
      ],
      isActive: true,
      isVerified: true
    },
    {
      id: 'transport-2',
      name: 'Taxi Local Villavieja',
      type: 'transportation',
      provider: 'Asociación de Taxistas',
      description: 'Servicio de taxi local para movilizarse dentro del casco urbano y hacia el desierto',
      baseInfo: {
        coverage: 'Casco urbano y desierto',
        pricePerKm: 2500,
        contact: '+57 318 456 7890',
        available: '24 horas'
      },
      stats: {
        totalReviews: 23,
        averageRating: 4.6,
        categoryAverages: {
          punctuality: 4.4,
          comfort: 4.2,
          safety: 4.8,
          driverService: 4.9,
          overall: 4.6
        },
        ratingDistribution: { 1: 0, 2: 1, 3: 2, 4: 8, 5: 12 },
        verifiedReviews: 18,
        responseRate: 30,
        recentActivity: {
          lastReview: '2024-01-12T14:20:00Z',
          reviewsThisMonth: 7,
          reviewsThisYear: 23
        }
      },
      reviews: [
        {
          id: 'rev-t2',
          userId: 'user-22',
          userName: 'Miguel Torres',
          serviceId: 'transport-2',
          serviceName: 'Taxi Local Villavieja',
          serviceType: 'transportation',
          providerName: 'Asociación de Taxistas',
          serviceDate: '2024-01-08T19:30:00Z',
          duration: 25,
          title: 'Excelente servicio y conductores conocedores',
          comment: 'Los taxistas son muy amables y conocen bien la zona. Nos llevaron al desierto y nos esperaron durante toda la actividad. Precios justos y servicio de calidad.',
          rating: {
            punctuality: 5,
            comfort: 4,
            safety: 5,
            driverService: 5,
            overall: 5
          },
          media: [],
          usedFor: 'tourism',
          groupSize: 4,
          recommendedFor: ['Familias con niños', 'Grupos grandes', 'Turistas extranjeros'],
          helpfulVotes: 12,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-08T22:15:00Z'
        }
      ],
      isActive: true,
      isVerified: true
    }
  ],

  equipment: [
    {
      id: 'equip-1',
      name: 'Telescopio Profesional',
      type: 'equipment',
      provider: 'Observatorio Tatacoa',
      description: 'Telescopio refractor para observación astronómica con calidad profesional',
      baseInfo: {
        pricePerDay: 25000,
        description: 'Telescopio refractor para observación astronómica',
        specifications: 'Apertura 80mm, Focal 900mm, Oculares incluidos'
      },
      stats: {
        totalReviews: 34,
        averageRating: 4.7,
        categoryAverages: {
          quality: 4.8,
          condition: 4.5,
          functionality: 4.9,
          valueForMoney: 4.6,
          overall: 4.7
        },
        ratingDistribution: { 1: 0, 2: 1, 3: 3, 4: 12, 5: 18 },
        verifiedReviews: 28,
        responseRate: 25,
        recentActivity: {
          lastReview: '2024-01-14T11:30:00Z',
          reviewsThisMonth: 8,
          reviewsThisYear: 34
        }
      },
      reviews: [
        {
          id: 'rev-e1',
          userId: 'user-23',
          userName: 'Laura Gómez',
          serviceId: 'equip-1',
          serviceName: 'Telescopio Profesional',
          serviceType: 'equipment',
          providerName: 'Observatorio Tatacoa',
          serviceDate: '2024-01-12T20:00:00Z',
          title: 'Telescopio de excelente calidad',
          comment: 'Pudimos ver Júpiter y sus lunas con una claridad increíble. El telescopio está en perfecto estado y el personal del observatorio nos ayudó con la configuración. Una experiencia astronómica inolvidable.',
          rating: {
            quality: 5,
            condition: 5,
            functionality: 5,
            valueForMoney: 4,
            overall: 5
          },
          media: [],
          usedFor: 'tourism',
          groupSize: 3,
          recommendedFor: ['Parejas', 'Aventureros', 'Principiantes'],
          helpfulVotes: 15,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-13T08:45:00Z'
        }
      ],
      isActive: true,
      isVerified: true
    },
    {
      id: 'equip-2',
      name: 'Equipo de Camping Completo',
      type: 'equipment',
      provider: 'Aventura Extrema',
      description: 'Equipo completo de camping para 4 personas con carpa, sleeping bags y accesorios',
      baseInfo: {
        pricePerDay: 40000,
        capacity: '4 personas',
        includes: ['Carpa 4 personas', 'Sleeping bags', 'Colchonetas', 'Lámpara', 'Mesa plegable']
      },
      stats: {
        totalReviews: 19,
        averageRating: 4.3,
        categoryAverages: {
          quality: 4.2,
          condition: 4.0,
          functionality: 4.5,
          valueForMoney: 4.4,
          overall: 4.3
        },
        ratingDistribution: { 1: 0, 2: 2, 3: 3, 4: 9, 5: 5 },
        verifiedReviews: 16,
        responseRate: 40,
        recentActivity: {
          lastReview: '2024-01-11T07:15:00Z',
          reviewsThisMonth: 5,
          reviewsThisYear: 19
        }
      },
      reviews: [
        {
          id: 'rev-e2',
          userId: 'user-24',
          userName: 'Roberto Silva',
          serviceId: 'equip-2',
          serviceName: 'Equipo de Camping Completo',
          serviceType: 'equipment',
          providerName: 'Aventura Extrema',
          serviceDate: '2024-01-09T17:00:00Z',
          title: 'Buena experiencia de camping',
          comment: 'El equipo funcionó bien durante nuestra noche en el desierto. La carpa resistió el viento y los sleeping bags eran cómodos. Algunas colchonetas estaban un poco desgastadas pero en general cumplió su función.',
          rating: {
            quality: 4,
            condition: 3,
            functionality: 5,
            valueForMoney: 4,
            overall: 4
          },
          media: [],
          usedFor: 'tourism',
          groupSize: 4,
          recommendedFor: ['Aventureros', 'Grupos grandes', 'Familias con niños'],
          helpfulVotes: 7,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-10T09:30:00Z',
          providerResponse: {
            id: 'resp-e2',
            content: 'Gracias por tu comentario Roberto. Hemos tomado nota sobre las colchonetas y las reemplazaremos próximamente. ¡Esperamos verte de nuevo!',
            createdAt: '2024-01-10T14:20:00Z'
          }
        }
      ],
      isActive: true,
      isVerified: true
    }
  ],

  health: [
    {
      id: 'health-1',
      name: 'Centro de Salud Villavieja',
      type: 'health',
      provider: 'Centro de Salud Villavieja',
      description: 'Puesto de salud con atención 24 horas para emergencias y consulta médica general',
      baseInfo: {
        address: 'Carrera 4 # 5-67',
        phone: '+57 8 8390123',
        schedule: '24 horas emergencias, 7:00 AM - 5:00 PM consulta',
        services: ['Urgencias', 'Medicina general', 'Primeros auxilios']
      },
      stats: {
        totalReviews: 12,
        averageRating: 4.1,
        categoryAverages: {
          attention: 4.3,
          facilities: 3.7,
          professionalism: 4.5,
          availability: 4.0,
          overall: 4.1
        },
        ratingDistribution: { 1: 1, 2: 0, 3: 2, 4: 6, 5: 3 },
        verifiedReviews: 10,
        responseRate: 0,
        recentActivity: {
          lastReview: '2024-01-08T16:45:00Z',
          reviewsThisMonth: 3,
          reviewsThisYear: 12
        }
      },
      reviews: [
        {
          id: 'rev-h1',
          userId: 'user-25',
          userName: 'Ana Ruiz',
          serviceId: 'health-1',
          serviceName: 'Centro de Salud Villavieja',
          serviceType: 'health',
          providerName: 'Centro de Salud Villavieja',
          serviceDate: '2024-01-05T14:30:00Z',
          title: 'Atención médica cuando más la necesitábamos',
          comment: 'Mi esposo se sintió mal durante nuestra visita al desierto y el personal médico fue muy atento. Las instalaciones son básicas pero funcionales, y el doctor fue muy profesional en su diagnóstico.',
          rating: {
            attention: 5,
            facilities: 3,
            professionalism: 5,
            availability: 4,
            overall: 4
          },
          media: [],
          usedFor: 'emergency',
          recommendedFor: ['Turistas nacionales', 'Turistas extranjeros', 'Personas mayores'],
          helpfulVotes: 6,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-05T18:20:00Z'
        }
      ],
      isActive: true,
      isVerified: true
    }
  ],

  fuel: [
    {
      id: 'fuel-1',
      name: 'Estación Terpel Villavieja',
      type: 'fuel',
      provider: 'Estación de Servicio Terpel',
      description: 'Estación de servicio con combustibles y servicios básicos para vehículos',
      baseInfo: {
        address: 'Entrada principal Villavieja',
        fuels: ['Gasolina corriente', 'ACPM'],
        services: ['Lubricantes', 'Llantería básica', 'Tienda'],
        schedule: '6:00 AM - 8:00 PM'
      },
      stats: {
        totalReviews: 15,
        averageRating: 4.0,
        categoryAverages: {
          serviceSpeed: 4.1,
          fuelQuality: 4.2,
          facilities: 3.6,
          priceCompetitive: 3.9,
          overall: 4.0
        },
        ratingDistribution: { 1: 0, 2: 2, 3: 4, 4: 7, 5: 2 },
        verifiedReviews: 12,
        responseRate: 20,
        recentActivity: {
          lastReview: '2024-01-13T12:10:00Z',
          reviewsThisMonth: 4,
          reviewsThisYear: 15
        }
      },
      reviews: [
        {
          id: 'rev-f1',
          userId: 'user-26',
          userName: 'Carlos Mendez',
          serviceId: 'fuel-1',
          serviceName: 'Estación Terpel Villavieja',
          serviceType: 'fuel',
          providerName: 'Estación de Servicio Terpel',
          serviceDate: '2024-01-11T15:45:00Z',
          title: 'Servicio estándar de combustible',
          comment: 'Paré aquí antes de ir al desierto para tanquear. El servicio fue rápido y el combustible de buena calidad. Los precios son similares a otras estaciones de la región. Tienen una pequeña tienda con lo básico.',
          rating: {
            serviceSpeed: 4,
            fuelQuality: 4,
            facilities: 3,
            priceCompetitive: 4,
            overall: 4
          },
          media: [],
          usedFor: 'tourism',
          recommendedFor: ['Turistas nacionales', 'Viajeros con presupuesto limitado'],
          helpfulVotes: 5,
          reportedCount: 0,
          verified: true,
          status: 'approved',
          createdAt: '2024-01-11T16:30:00Z'
        }
      ],
      isActive: true,
      isVerified: true
    }
  ]
};