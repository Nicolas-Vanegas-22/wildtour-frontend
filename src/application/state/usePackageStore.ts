import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomPackage,
  SelectedService,
  ServiceCategory,
  Service,
} from '../../domain/models/CustomPackage';

interface PackageState {
  // Estado del paquete actual
  currentPackage: CustomPackage | null;

  // UI State
  isModalOpen: boolean;
  currentCategory: ServiceCategory | null;

  // Totals
  totalPersons: number;
  dateRange: {
    checkIn: string;
    checkOut: string;
  } | null;
}

interface PackageActions {
  // Modal Control
  openModal: () => void;
  closeModal: () => void;
  setCurrentCategory: (category: ServiceCategory | null) => void;

  // Package Management
  initializePackage: () => void;
  clearPackage: () => void;

  // Service Management
  addService: (service: Service, persons: number, date?: string, time?: string, notes?: string) => void;
  removeService: (serviceId: string) => void;
  updateServicePersons: (serviceId: string, persons: number) => void;
  updateServiceDate: (serviceId: string, date: string) => void;
  updateServiceTime: (serviceId: string, time: string) => void;
  updateServiceNotes: (serviceId: string, notes: string) => void;

  // Package Settings
  setTotalPersons: (persons: number) => void;
  setDateRange: (checkIn: string, checkOut: string) => void;

  // Calculations
  calculatePrices: () => void;

  // Persistence
  loadSavedPackage: (packageId: string) => void;
}

type PackageStore = PackageState & PackageActions;

const IVA_RATE = 0.19; // 19% IVA Colombia

export const usePackageStore = create<PackageStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentPackage: null,
      isModalOpen: false,
      currentCategory: null,
      totalPersons: 1,
      dateRange: null,

      // Acciones de Modal
      openModal: () => {
        const state = get();
        if (!state.currentPackage) {
          state.initializePackage();
        }
        set({ isModalOpen: true });
      },

      closeModal: () => {
        set({ isModalOpen: false, currentCategory: null });
      },

      setCurrentCategory: (category) => {
        set({ currentCategory: category });
      },

      // Gestión de Paquetes
      initializePackage: () => {
        const newPackage: CustomPackage = {
          id: `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          modules: {},
          totalPersons: 1,
          subtotal: 0,
          taxes: 0,
          total: 0,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ currentPackage: newPackage });
      },

      clearPackage: () => {
        set({
          currentPackage: null,
          totalPersons: 1,
          dateRange: null,
          currentCategory: null,
        });
      },

      // Agregar Servicio
      addService: (service, persons, date, time, notes) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) {
          state.initializePackage();
          return state.addService(service, persons, date, time, notes);
        }

        // Calcular precio basado en personas
        let pricePerPerson = service.pricing.basePrice;

        // Aplicar seasonal pricing si existe
        if (service.pricing.seasonalPricing && date) {
          const month = new Date(date).getMonth();
          // Temporada alta: Diciembre, Enero, Junio, Julio (12, 0, 5, 6)
          const isHighSeason = [12, 0, 5, 6].includes(month);
          if (isHighSeason) {
            pricePerPerson *= service.pricing.seasonalPricing.highSeason;
          } else {
            pricePerPerson *= service.pricing.seasonalPricing.lowSeason;
          }
        }

        const subtotal = Math.round(pricePerPerson * persons);

        const selectedService: SelectedService = {
          service,
          persons,
          date,
          time,
          subtotal,
          notes,
        };

        // Obtener o crear el módulo de la categoría
        const categoryModule = pkg.modules[service.category] || {
          category: service.category,
          selectedServices: [],
          subtotal: 0,
        };

        // Verificar si el servicio ya existe
        const existingIndex = categoryModule.selectedServices.findIndex(
          (s) => s.service.id === service.id
        );

        if (existingIndex >= 0) {
          // Actualizar servicio existente
          categoryModule.selectedServices[existingIndex] = selectedService;
        } else {
          // Agregar nuevo servicio
          categoryModule.selectedServices.push(selectedService);
        }

        // Recalcular subtotal del módulo
        categoryModule.subtotal = categoryModule.selectedServices.reduce(
          (sum, s) => sum + s.subtotal,
          0
        );

        // Actualizar el paquete
        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: {
            ...pkg.modules,
            [service.category]: categoryModule,
          },
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
        get().calculatePrices();
      },

      // Eliminar Servicio
      removeService: (serviceId) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        const updatedModules = { ...pkg.modules };

        // Buscar y eliminar el servicio en todos los módulos
        Object.keys(updatedModules).forEach((categoryKey) => {
          const category = categoryKey as ServiceCategory;
          const module = updatedModules[category];

          if (module) {
            module.selectedServices = module.selectedServices.filter(
              (s) => s.service.id !== serviceId
            );

            // Recalcular subtotal del módulo
            module.subtotal = module.selectedServices.reduce(
              (sum, s) => sum + s.subtotal,
              0
            );

            // Eliminar módulo si está vacío
            if (module.selectedServices.length === 0) {
              delete updatedModules[category];
            }
          }
        });

        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: updatedModules,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
        get().calculatePrices();
      },

      // Actualizar personas de un servicio
      updateServicePersons: (serviceId, persons) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        const updatedModules = { ...pkg.modules };

        // Buscar y actualizar el servicio
        Object.keys(updatedModules).forEach((categoryKey) => {
          const category = categoryKey as ServiceCategory;
          const module = updatedModules[category];

          if (module) {
            module.selectedServices = module.selectedServices.map((s) => {
              if (s.service.id === serviceId) {
                const newSubtotal = Math.round(s.service.pricing.basePrice * persons);
                return { ...s, persons, subtotal: newSubtotal };
              }
              return s;
            });

            // Recalcular subtotal del módulo
            module.subtotal = module.selectedServices.reduce(
              (sum, s) => sum + s.subtotal,
              0
            );
          }
        });

        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: updatedModules,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
        get().calculatePrices();
      },

      // Actualizar fecha de un servicio
      updateServiceDate: (serviceId, date) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        const updatedModules = { ...pkg.modules };

        Object.keys(updatedModules).forEach((categoryKey) => {
          const category = categoryKey as ServiceCategory;
          const module = updatedModules[category];

          if (module) {
            module.selectedServices = module.selectedServices.map((s) => {
              if (s.service.id === serviceId) {
                return { ...s, date };
              }
              return s;
            });
          }
        });

        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: updatedModules,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
      },

      // Actualizar hora de un servicio
      updateServiceTime: (serviceId, time) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        const updatedModules = { ...pkg.modules };

        Object.keys(updatedModules).forEach((categoryKey) => {
          const category = categoryKey as ServiceCategory;
          const module = updatedModules[category];

          if (module) {
            module.selectedServices = module.selectedServices.map((s) => {
              if (s.service.id === serviceId) {
                return { ...s, time };
              }
              return s;
            });
          }
        });

        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: updatedModules,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
      },

      // Actualizar notas de un servicio
      updateServiceNotes: (serviceId, notes) => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        const updatedModules = { ...pkg.modules };

        Object.keys(updatedModules).forEach((categoryKey) => {
          const category = categoryKey as ServiceCategory;
          const module = updatedModules[category];

          if (module) {
            module.selectedServices = module.selectedServices.map((s) => {
              if (s.service.id === serviceId) {
                return { ...s, notes };
              }
              return s;
            });
          }
        });

        const updatedPackage: CustomPackage = {
          ...pkg,
          modules: updatedModules,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
      },

      // Establecer total de personas
      setTotalPersons: (persons) => {
        set({ totalPersons: persons });
        const state = get();
        if (state.currentPackage) {
          set({
            currentPackage: {
              ...state.currentPackage,
              totalPersons: persons,
            },
          });
        }
      },

      // Establecer rango de fechas
      setDateRange: (checkIn, checkOut) => {
        set({ dateRange: { checkIn, checkOut } });
        const state = get();
        if (state.currentPackage) {
          set({
            currentPackage: {
              ...state.currentPackage,
              dateRange: { checkIn, checkOut },
            },
          });
        }
      },

      // Calcular precios
      calculatePrices: () => {
        const state = get();
        const pkg = state.currentPackage;

        if (!pkg) return;

        // Calcular subtotal sumando todos los módulos
        const subtotal = Object.values(pkg.modules).reduce(
          (sum, module) => sum + module.subtotal,
          0
        );

        // Calcular IVA
        const taxes = Math.round(subtotal * IVA_RATE);

        // Total
        const total = subtotal + taxes;

        const updatedPackage: CustomPackage = {
          ...pkg,
          subtotal,
          taxes,
          total,
          updatedAt: new Date().toISOString(),
        };

        set({ currentPackage: updatedPackage });
      },

      // Cargar paquete guardado
      loadSavedPackage: (packageId) => {
        // TODO: Implementar cuando tengamos la API
        console.log('Loading package:', packageId);
      },
    }),
    {
      name: 'wildtour-package',
      partialize: (state) => ({
        currentPackage: state.currentPackage,
        totalPersons: state.totalPersons,
        dateRange: state.dateRange,
      }),
    }
  )
);
