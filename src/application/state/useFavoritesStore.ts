import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  FavoriteItem,
  FavoritesCollection,
  FavoritesState,
  CreateFavoriteData,
  UpdateFavoriteData,
  CreateCollectionData,
  FavoriteFilters
} from '../../domain/models/Favorites';

// Mock data para demostración
const mockFavoriteItems: FavoriteItem[] = [
  {
    id: 'fav1',
    userId: 'user1',
    itemType: 'service_post',
    itemId: 'service1',
    itemData: {
      title: 'Tour Astronómico Desierto de la Tatacoa',
      description: 'Experiencia nocturna única de observación de estrellas en el desierto más hermoso de Colombia',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop',
      price: {
        amount: 150000,
        currency: 'COP',
        unit: 'por persona'
      },
      rating: 4.9,
      location: {
        name: 'Desierto de la Tatacoa',
        city: 'Villavieja',
        department: 'Huila'
      },
      provider: {
        name: 'Carlos Mendoza',
        businessName: 'Tatacoa Adventures'
      },
      serviceType: 'Tour Astronómico',
      availability: {
        available: true
      }
    },
    addedAt: '2024-01-15T10:30:00Z',
    notes: 'Perfecto para nuestra luna de miel',
    tags: ['astronomía', 'romántico', 'nocturno']
  },
  {
    id: 'fav2',
    userId: 'user1',
    itemType: 'accommodation',
    itemId: 'lodge1',
    itemData: {
      title: 'Desert Lodge Villavieja',
      description: 'Hospedaje cómodo con vista panorámica al desierto y servicios de primera',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      price: {
        amount: 200000,
        currency: 'COP',
        unit: 'por noche'
      },
      rating: 4.7,
      location: {
        name: 'Villavieja Centro',
        city: 'Villavieja',
        department: 'Huila'
      },
      provider: {
        name: 'Ana García',
        businessName: 'Desert Stays'
      },
      serviceType: 'Alojamiento',
      availability: {
        available: false,
        nextAvailableDate: '2024-02-15'
      }
    },
    addedAt: '2024-01-10T14:20:00Z',
    tags: ['alojamiento', 'vista', 'confortable']
  }
];

const mockCollections: FavoritesCollection[] = [
  {
    id: 'default',
    name: 'Mis Favoritos',
    description: 'Colección principal de servicios favoritos',
    userId: 'user1',
    items: mockFavoriteItems,
    isPublic: false,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    color: '#3B82F6',
    icon: 'heart'
  },
  {
    id: 'wishlist',
    name: 'Lista de Deseos',
    description: 'Servicios que quiero probar en el futuro',
    userId: 'user1',
    items: [],
    isPublic: false,
    isDefault: false,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    color: '#F59E0B',
    icon: 'star'
  }
];

interface FavoritesStore extends FavoritesState {
  // Actions
  addToFavorites: (data: CreateFavoriteData) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  updateFavorite: (id: string, data: UpdateFavoriteData) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  getFavoriteByItemId: (itemId: string) => FavoriteItem | null;

  // Collections
  createCollection: (data: CreateCollectionData) => Promise<void>;
  updateCollection: (id: string, data: Partial<FavoritesCollection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  setCurrentCollection: (collection: FavoritesCollection | null) => void;
  getDefaultCollection: () => FavoritesCollection | null;

  // Data loading
  loadFavorites: () => Promise<void>;
  loadCollections: () => Promise<void>;
  searchFavorites: (query: string, filters?: FavoriteFilters) => Promise<FavoriteItem[]>;

  // Utils
  clearError: () => void;
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        collections: mockCollections,
        currentCollection: mockCollections[0],
        favoriteItems: mockFavoriteItems,
        loading: false,
        error: null,
        totalCount: mockFavoriteItems.length,

        // Actions
        addToFavorites: async (data: CreateFavoriteData) => {
          const state = get();
          set({ loading: true, error: null });

          try {
            // Verificar si ya está en favoritos
            const existing = state.favoriteItems.find(item => item.itemId === data.itemId);
            if (existing) {
              throw new Error('Este elemento ya está en tus favoritos');
            }

            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Aquí normalmente obtendrías los datos completos del servicio desde la API
            const newFavorite: FavoriteItem = {
              id: `fav_${Date.now()}`,
              userId: 'user1', // Obtener del auth store
              itemType: data.itemType,
              itemId: data.itemId,
              itemData: {
                title: 'Nuevo Servicio',
                description: 'Descripción del servicio',
                image: '/placeholder-image.jpg',
                price: {
                  amount: 0,
                  currency: 'COP',
                  unit: 'por persona'
                },
                rating: 0,
                location: {
                  name: 'Villavieja',
                  city: 'Villavieja',
                  department: 'Huila'
                },
                provider: {
                  name: 'Proveedor',
                  businessName: 'Empresa'
                },
                serviceType: 'Servicio',
                availability: {
                  available: true
                }
              },
              addedAt: new Date().toISOString(),
              notes: data.notes,
              tags: data.tags || []
            };

            const collectionId = data.collectionId || state.getDefaultCollection()?.id || 'default';

            set(state => ({
              favoriteItems: [...state.favoriteItems, newFavorite],
              collections: state.collections.map(collection =>
                collection.id === collectionId
                  ? { ...collection, items: [...collection.items, newFavorite] }
                  : collection
              ),
              totalCount: state.totalCount + 1,
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al agregar a favoritos'
            });
            throw error;
          }
        },

        removeFromFavorites: async (itemId: string) => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 300));

            set(state => ({
              favoriteItems: state.favoriteItems.filter(item => item.itemId !== itemId),
              collections: state.collections.map(collection => ({
                ...collection,
                items: collection.items.filter(item => item.itemId !== itemId)
              })),
              totalCount: Math.max(0, state.totalCount - 1),
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al quitar de favoritos'
            });
            throw error;
          }
        },

        updateFavorite: async (id: string, data: UpdateFavoriteData) => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 300));

            set(state => ({
              favoriteItems: state.favoriteItems.map(item =>
                item.id === id ? { ...item, ...data } : item
              ),
              collections: state.collections.map(collection => ({
                ...collection,
                items: collection.items.map(item =>
                  item.id === id ? { ...item, ...data } : item
                )
              })),
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al actualizar favorito'
            });
            throw error;
          }
        },

        isFavorite: (itemId: string) => {
          const state = get();
          return state.favoriteItems.some(item => item.itemId === itemId);
        },

        getFavoriteByItemId: (itemId: string) => {
          const state = get();
          return state.favoriteItems.find(item => item.itemId === itemId) || null;
        },

        // Collections
        createCollection: async (data: CreateCollectionData) => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const newCollection: FavoritesCollection = {
              id: `col_${Date.now()}`,
              name: data.name,
              description: data.description,
              userId: 'user1',
              items: [],
              isPublic: data.isPublic || false,
              isDefault: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              color: data.color || '#3B82F6',
              icon: data.icon || 'folder'
            };

            set(state => ({
              collections: [...state.collections, newCollection],
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al crear colección'
            });
            throw error;
          }
        },

        updateCollection: async (id: string, data: Partial<FavoritesCollection>) => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 300));

            set(state => ({
              collections: state.collections.map(collection =>
                collection.id === id
                  ? { ...collection, ...data, updatedAt: new Date().toISOString() }
                  : collection
              ),
              currentCollection: state.currentCollection?.id === id
                ? { ...state.currentCollection, ...data }
                : state.currentCollection,
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al actualizar colección'
            });
            throw error;
          }
        },

        deleteCollection: async (id: string) => {
          const state = get();
          const collection = state.collections.find(c => c.id === id);

          if (collection?.isDefault) {
            throw new Error('No puedes eliminar la colección principal');
          }

          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => ({
              collections: state.collections.filter(c => c.id !== id),
              currentCollection: state.currentCollection?.id === id ? null : state.currentCollection,
              loading: false
            }));

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al eliminar colección'
            });
            throw error;
          }
        },

        setCurrentCollection: (collection: FavoritesCollection | null) => {
          set({ currentCollection: collection });
        },

        getDefaultCollection: () => {
          const state = get();
          return state.collections.find(c => c.isDefault) || state.collections[0] || null;
        },

        // Data loading
        loadFavorites: async () => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // En producción, aquí cargarías los datos del servidor
            set({
              favoriteItems: mockFavoriteItems,
              totalCount: mockFavoriteItems.length,
              loading: false
            });

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al cargar favoritos'
            });
          }
        },

        loadCollections: async () => {
          set({ loading: true, error: null });

          try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 500));

            set({
              collections: mockCollections,
              currentCollection: mockCollections[0],
              loading: false
            });

          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Error al cargar colecciones'
            });
          }
        },

        searchFavorites: async (query: string, filters?: FavoriteFilters) => {
          const state = get();
          let results = state.favoriteItems;

          // Filtrar por query
          if (query) {
            results = results.filter(item =>
              item.itemData.title.toLowerCase().includes(query.toLowerCase()) ||
              item.itemData.description.toLowerCase().includes(query.toLowerCase()) ||
              item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
          }

          // Aplicar filtros adicionales
          if (filters) {
            if (filters.itemType && filters.itemType.length > 0) {
              results = results.filter(item => filters.itemType!.includes(item.itemType));
            }

            if (filters.tags && filters.tags.length > 0) {
              results = results.filter(item =>
                item.tags?.some(tag => filters.tags!.includes(tag))
              );
            }

            if (filters.availability) {
              if (filters.availability === 'available') {
                results = results.filter(item => item.itemData.availability.available);
              } else if (filters.availability === 'unavailable') {
                results = results.filter(item => !item.itemData.availability.available);
              }
            }

            if (filters.priceRange) {
              results = results.filter(item =>
                item.itemData.price.amount >= (filters.priceRange!.min || 0) &&
                item.itemData.price.amount <= (filters.priceRange!.max || Infinity)
              );
            }
          }

          return results;
        },

        // Utils
        clearError: () => set({ error: null }),

        reset: () => {
          set({
            collections: [],
            currentCollection: null,
            favoriteItems: [],
            loading: false,
            error: null,
            totalCount: 0
          });
        }
      }),
      {
        name: 'favorites-storage',
        partialize: (state) => ({
          collections: state.collections,
          favoriteItems: state.favoriteItems,
          totalCount: state.totalCount
        })
      }
    ),
    { name: 'favorites-store' }
  )
);