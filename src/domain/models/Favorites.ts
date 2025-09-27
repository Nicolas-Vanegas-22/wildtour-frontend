// Modelos para el sistema de favoritos

export interface FavoriteItem {
  id: string;
  userId: string;
  itemType: 'service_post' | 'accommodation' | 'activity' | 'package';
  itemId: string;
  itemData: {
    title: string;
    description: string;
    image: string;
    price: {
      amount: number;
      currency: string;
      unit: string;
    };
    rating: number;
    location: {
      name: string;
      city: string;
      department: string;
    };
    provider: {
      name: string;
      businessName: string;
    };
    serviceType: string;
    availability: {
      available: boolean;
      nextAvailableDate?: string;
    };
  };
  addedAt: string;
  notes?: string;
  tags?: string[];
}

export interface FavoritesCollection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  items: FavoriteItem[];
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
  icon?: string;
}

export interface FavoritesState {
  collections: FavoritesCollection[];
  currentCollection: FavoritesCollection | null;
  favoriteItems: FavoriteItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateFavoriteData {
  itemType: FavoriteItem['itemType'];
  itemId: string;
  collectionId?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateFavoriteData {
  notes?: string;
  tags?: string[];
  collectionId?: string;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  isPublic?: boolean;
  color?: string;
  icon?: string;
}

export interface FavoriteFilters {
  itemType?: FavoriteItem['itemType'][];
  collectionId?: string;
  tags?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  availability?: 'all' | 'available' | 'unavailable';
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface FavoriteSearchResult {
  items: FavoriteItem[];
  total: number;
  page: number;
  limit: number;
  filters: FavoriteFilters;
}

// Acciones del sistema de favoritos
export type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COLLECTIONS'; payload: FavoritesCollection[] }
  | { type: 'SET_CURRENT_COLLECTION'; payload: FavoritesCollection | null }
  | { type: 'SET_FAVORITE_ITEMS'; payload: FavoriteItem[] }
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'UPDATE_FAVORITE'; payload: { id: string; data: Partial<FavoriteItem> } }
  | { type: 'ADD_COLLECTION'; payload: FavoritesCollection }
  | { type: 'UPDATE_COLLECTION'; payload: { id: string; data: Partial<FavoritesCollection> } }
  | { type: 'REMOVE_COLLECTION'; payload: string }
  | { type: 'SET_TOTAL_COUNT'; payload: number };