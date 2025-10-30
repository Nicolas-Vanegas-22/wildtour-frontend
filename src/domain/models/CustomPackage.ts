// Tipos para el sistema de paquetes personalizados

export type ServiceCategory =
  | 'alojamiento'
  | 'alimentacion'
  | 'recorrido'
  | 'astronomicas'
  | 'sitios_interes';

export type AlojamientoType = 'hotel' | 'hostal' | 'camping' | 'glamping';
export type AlimentacionType = 'restaurante' | 'estadero';
export type RecorridoType = 'guia' | 'caballo' | 'bicicleta' | 'cuatrimoto';
export type AstronomicaType = 'observatorio';
export type SitioInteresType = 'piscina_natural' | 'museo';

export type ServiceSubcategory =
  | AlojamientoType
  | AlimentacionType
  | RecorridoType
  | AstronomicaType
  | SitioInteresType;

export interface ServiceSchedule {
  day: string; // 'monday' | 'tuesday' | etc.
  openTime: string; // '08:00'
  closeTime: string; // '18:00'
  available: boolean;
}

export interface ServicePricing {
  basePrice: number; // Precio por persona
  currency: 'COP';
  minPersons: number;
  maxPersons: number;
  seasonalPricing?: {
    highSeason: number; // Multiplicador ej: 1.3
    lowSeason: number; // Multiplicador ej: 0.9
  };
}

export interface ServiceImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  subcategory: ServiceSubcategory;
  name: string;
  description: string;
  shortDescription: string;
  location: string; // 'Villavieja' | 'Desierto de la Tatacoa' | etc.
  images: ServiceImage[];
  pricing: ServicePricing;
  schedule?: ServiceSchedule[];
  features: string[]; // ['WiFi', 'Aire acondicionado', etc.]
  rating?: number;
  reviewCount?: number;
  provider?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  isActive: boolean;
  availability?: {
    [date: string]: boolean; // '2025-10-27': true
  };
}

export interface SelectedService {
  service: Service;
  persons: number;
  date?: string; // ISO date for services that need date selection
  time?: string; // Time slot if applicable
  subtotal: number; // Calculated price
  notes?: string; // Special requests
}

export interface PackageModule {
  category: ServiceCategory;
  selectedServices: SelectedService[];
  subtotal: number;
}

export interface CustomPackage {
  id: string;
  userId?: string;
  name?: string; // User can name their package
  modules: {
    alojamiento?: PackageModule;
    alimentacion?: PackageModule;
    recorrido?: PackageModule;
    astronomicas?: PackageModule;
    sitios_interes?: PackageModule;
  };
  totalPersons: number;
  dateRange?: {
    checkIn: string;
    checkOut: string;
  };
  subtotal: number;
  taxes: number; // 19% IVA
  total: number;
  status: 'draft' | 'saved' | 'pending_payment' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // Draft packages expire after 7 days
}

export interface SavedPackage extends CustomPackage {
  status: 'saved';
}

export interface CategoryInfo {
  category: ServiceCategory;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  subcategories: {
    type: ServiceSubcategory;
    label: string;
    icon: string;
  }[];
}

// Request/Response types for API
export interface CreatePackageRequest {
  userId?: string;
  name?: string;
  services: {
    serviceId: string;
    persons: number;
    date?: string;
    time?: string;
    notes?: string;
  }[];
  totalPersons: number;
  dateRange?: {
    checkIn: string;
    checkOut: string;
  };
}

export interface SavePackageRequest extends CreatePackageRequest {
  packageId?: string; // If updating existing
}

export interface PackageCheckoutRequest {
  packageId: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentType: string;
    documentNumber: string;
  };
  paymentMethod: 'card' | 'nequi' | 'daviplata' | 'pse' | 'bank_transfer';
  specialRequests?: string;
}
