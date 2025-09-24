import { ServicePost, ServiceProvider, Review, PostComment } from '../domain/models/ServicePost';

export const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    businessName: 'Tatacoa Adventures',
    rating: 4.8,
    totalReviews: 127,
    location: {
      city: 'Villavieja',
      department: 'Huila'
    },
    verified: true,
    joinedDate: '2022-03-15'
  },
  {
    id: '2',
    name: 'María González',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d8?w=100&h=100&fit=crop&crop=face',
    businessName: 'Huila Extremo',
    rating: 4.6,
    totalReviews: 89,
    location: {
      city: 'Neiva',
      department: 'Huila'
    },
    verified: true,
    joinedDate: '2021-11-20'
  },
  {
    id: '3',
    name: 'Luis Ramírez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    businessName: 'Desierto Mágico Tours',
    rating: 4.9,
    totalReviews: 156,
    location: {
      city: 'Villavieja',
      department: 'Huila'
    },
    verified: true,
    joinedDate: '2020-08-10'
  }
];

export const mockServicePosts: ServicePost[] = [
  {
    id: '1',
    provider: mockProviders[0],
    title: 'Tour Astronómico Nocturno en el Desierto de la Tatacoa',
    description: 'Disfruta de una experiencia única observando las estrellas en uno de los mejores cielos de Colombia. Incluye transporte desde Villavieja, guía especializado en astronomía, telescopio profesional y refrigerio. Una aventura perfecta para conectar con el universo.',
    images: [
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop'
    ],
    serviceType: 'experiencia',
    price: {
      amount: 120000,
      currency: 'COP',
      unit: 'por persona'
    },
    location: {
      name: 'Desierto de la Tatacoa, Villavieja',
      coordinates: {
        lat: 3.2297,
        lng: -75.1678
      }
    },
    availability: {
      dates: ['2024-01-15', '2024-01-16', '2024-01-17'],
      maxCapacity: 12,
      currentBookings: 3
    },
    features: [
      'Telescopio profesional incluido',
      'Guía certificado en astronomía',
      'Transporte ida y vuelta',
      'Refrigerio nocturno',
      'Mapas estelares'
    ],
    tags: ['astronomía', 'noche', 'estrellas', 'desierto', 'aventura'],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    likes: 43,
    shares: 12,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '2',
    provider: mockProviders[1],
    title: 'Caminata de Aventura por los Laberintos de la Tatacoa',
    description: 'Explora los impresionantes laberintos naturales del desierto gris. Un recorrido de 3 horas con paradas en los mejores miradores, explicación geológica y fotografía profesional. Perfecto para aventureros que buscan paisajes únicos.',
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
    ],
    serviceType: 'actividad',
    price: {
      amount: 80000,
      currency: 'COP',
      unit: 'por persona'
    },
    location: {
      name: 'Desierto Gris, Tatacoa',
      coordinates: {
        lat: 3.2297,
        lng: -75.1678
      }
    },
    availability: {
      dates: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18'],
      maxCapacity: 8,
      currentBookings: 2
    },
    features: [
      'Guía experto en geología',
      'Fotografías profesionales',
      'Hidratación incluida',
      'Equipo de seguridad',
      'Seguro de accidentes'
    ],
    tags: ['senderismo', 'geología', 'fotografía', 'desierto', 'aventura'],
    createdAt: '2024-01-09T10:15:00Z',
    updatedAt: '2024-01-09T10:15:00Z',
    likes: 28,
    shares: 8,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    provider: mockProviders[2],
    title: 'Experiencia Gastronómica Tradicional Huilense',
    description: 'Degusta los sabores auténticos de la región con un almuerzo tradicional preparado por familias locales. Incluye tamales huilenses, arepas rellenas, chicha y postres típicos. Una experiencia cultural única en ambiente familiar.',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'
    ],
    serviceType: 'comida',
    price: {
      amount: 45000,
      currency: 'COP',
      unit: 'por persona'
    },
    location: {
      name: 'Casa Familiar, Villavieja Centro',
      coordinates: {
        lat: 3.2297,
        lng: -75.1678
      }
    },
    availability: {
      dates: ['2024-01-15', '2024-01-16', '2024-01-17'],
      maxCapacity: 15,
      currentBookings: 7
    },
    features: [
      'Comida 100% casera',
      'Recetas tradicionales',
      'Ambiente familiar',
      'Historia de los platos',
      'Bebidas típicas incluidas'
    ],
    tags: ['gastronomía', 'tradicional', 'familia', 'cultura', 'huilense'],
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    likes: 67,
    shares: 15,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '4',
    provider: mockProviders[0],
    title: 'Hospedaje Glamping bajo las Estrellas',
    description: 'Pasa la noche en nuestras cómodas carpas glamping con vista directa al cielo estrellado. Incluye cena, desayuno, kit de observación astronómica y actividades nocturnas. Una experiencia de lujo en plena naturaleza.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1510424449025-81e9a3dc4d34?w=800&h=600&fit=crop'
    ],
    serviceType: 'alojamiento',
    price: {
      amount: 250000,
      currency: 'COP',
      unit: 'por noche'
    },
    location: {
      name: 'Desierto de la Tatacoa, Zona Camping',
      coordinates: {
        lat: 3.2297,
        lng: -75.1678
      }
    },
    availability: {
      dates: ['2024-01-15', '2024-01-16', '2024-01-17'],
      maxCapacity: 4,
      currentBookings: 1
    },
    features: [
      'Carpas totalmente equipadas',
      'Baño privado',
      'Cena y desayuno incluidos',
      'Kit astronómico',
      'Fogata nocturna'
    ],
    tags: ['glamping', 'alojamiento', 'estrellas', 'lujo', 'naturaleza'],
    createdAt: '2024-01-07T12:20:00Z',
    updatedAt: '2024-01-07T12:20:00Z',
    likes: 92,
    shares: 28,
    isLiked: true,
    isBookmarked: true
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Ana Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    servicePostId: '1',
    rating: 5,
    comment: 'Increíble experiencia! El guía Carlos es súper conocedor y nos explicó todo de manera muy clara. Ver las constelaciones con ese nivel de detalle fue mágico. Definitivamente recomendado.',
    images: [
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'
    ],
    createdAt: '2024-01-11T20:30:00Z',
    helpful: 8,
    isHelpful: false
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Miguel Torres',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    servicePostId: '1',
    rating: 4,
    comment: 'Muy buena experiencia, aunque el transporte se demoró un poco. El telescopio es excelente y la explicación del guía muy profesional.',
    createdAt: '2024-01-12T08:15:00Z',
    helpful: 3,
    isHelpful: true
  }
];

export const mockComments: PostComment[] = [
  {
    id: '1',
    user: {
      id: 'u3',
      name: 'Laura Jiménez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d8?w=100&h=100&fit=crop&crop=face'
    },
    servicePostId: '1',
    content: '¿Qué días de la semana tienen disponibilidad? Me interesa mucho!',
    createdAt: '2024-01-11T15:20:00Z',
    likes: 2,
    isLiked: false
  },
  {
    id: '2',
    user: {
      id: 'u4',
      name: 'David González',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    servicePostId: '1',
    content: 'Excelente post! ¿Incluye transporte desde Neiva?',
    createdAt: '2024-01-11T18:45:00Z',
    likes: 1,
    isLiked: true
  }
];