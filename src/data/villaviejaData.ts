// Datos completos del módulo de Villavieja para Wild Tour Colombia

import { Destination, Activity, Accommodation, TourismCategory } from '../domain/models/Destination';

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

  guides: [
    {
      name: 'Carlos Mendoza',
      specialty: 'Astronomía y Geología',
      experience: '15 años',
      languages: ['Español', 'Inglés'],
      certifications: ['Guía certificado SENA', 'Especialista en astronomía'],
      contact: '+57 312 345 6789',
      pricePerDay: 80000
    },
    {
      name: 'Ana Lucía Torres',
      specialty: 'Ecoturismo y Flora Desértica',
      experience: '10 años',
      languages: ['Español', 'Francés'],
      certifications: ['Bióloga', 'Guía de naturaleza'],
      contact: '+57 300 987 6543',
      pricePerDay: 75000
    },
    {
      name: 'José Ramírez',
      specialty: 'Historia y Paleontología',
      experience: '20 años',
      languages: ['Español'],
      certifications: ['Historiador', 'Especialista en paleontología'],
      contact: '+57 311 567 8901',
      pricePerDay: 70000
    }
  ],

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
    { id: '1', name: 'Naturaleza', icon: '🌿', description: 'Desierto único en Colombia' },
    { id: '2', name: 'Ciencia', icon: '🔭', description: 'Astronomía y paleontología' },
    { id: '3', name: 'Aventura', icon: '🏃‍♂️', description: 'Actividades en el desierto' }
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