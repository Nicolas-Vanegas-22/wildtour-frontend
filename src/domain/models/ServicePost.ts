export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  businessName: string;
  rating: number;
  totalReviews: number;
  location: {
    city: string;
    department: string;
  };
  verified: boolean;
  joinedDate: string;
}

export interface ServicePost {
  id: string;
  provider: ServiceProvider;
  title: string;
  description: string;
  images: string[];
  serviceType: 'guia' | 'transporte' | 'alojamiento' | 'comida' | 'actividad' | 'experiencia';
  price: {
    amount: number;
    currency: string;
    unit: string; // 'por persona', 'por día', 'por grupo'
  };
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    dates: string[];
    maxCapacity: number;
    currentBookings: number;
  };
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  servicePostId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  isHelpful: boolean;
}

export interface PostComment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  servicePostId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: PostComment[];
}

export interface CreateServicePostData {
  title: string;
  description: string;
  images: File[];
  serviceType: ServicePost['serviceType'];
  price: ServicePost['price'];
  location: ServicePost['location'];
  availability: ServicePost['availability'];
  features: string[];
  tags: string[];
}