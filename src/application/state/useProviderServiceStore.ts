import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProviderService } from '../../domain/models/ProviderService';
import { providerServiceApi } from '../../infrastructure/services/providerServiceApi';

interface ProviderServiceState {
  services: ProviderService[];
  selectedService: ProviderService | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  setSelectedService: (service: ProviderService | null) => void;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string, isActive: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  services: [],
  selectedService: null,
  isLoading: false,
  error: null,
};

export const useProviderServiceStore = create<ProviderServiceState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await providerServiceApi.getMyServices();
          set({ services: response.services, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar servicios',
            isLoading: false,
          });
        }
      },

      fetchServiceById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const service = await providerServiceApi.getServiceById(id);
          set({ selectedService: service, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar servicio',
            isLoading: false,
          });
        }
      },

      setSelectedService: (service: ProviderService | null) => {
        set({ selectedService: service });
      },

      deleteService: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await providerServiceApi.deleteService(id);
          const currentServices = get().services;
          set({
            services: currentServices.filter((s) => s.id !== id),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al eliminar servicio',
            isLoading: false,
          });
          throw error;
        }
      },

      toggleServiceStatus: async (id: string, isActive: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const updatedService = await providerServiceApi.toggleServiceStatus(id, isActive);
          const currentServices = get().services;
          set({
            services: currentServices.map((s) => (s.id === id ? updatedService : s)),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar estado',
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'provider-service-storage',
      partialize: (state) => ({
        services: state.services,
      }),
    }
  )
);
