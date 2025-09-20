export type UserRole = 'tourist' | 'provider' | 'admin' | 'guide' | 'vendor';

export interface PersonInfo {
  firstName: string;
  lastName: string;
  document: number;
  phoneNumber: number;
}

export interface UserPreferences {
  region: string;
  interests: string[];
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    promotions: boolean;
    bookingReminders: boolean;
    localNews: boolean;
    routeSuggestions: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    theme: 'light' | 'dark' | 'auto';
    highContrast: boolean;
    screenReader: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'nequi' | 'daviplata' | 'pse';
  name: string;
  isDefault: boolean;
  expiryDate?: string;
}

export interface BillingInfo {
  name: string;
  nit?: string;
  address: string;
  city: string;
  country: string;
}

export interface ExternalConnections {
  google?: {
    connected: boolean;
    email?: string;
  };
  facebook?: {
    connected: boolean;
    email?: string;
  };
  instagram?: {
    connected: boolean;
    username?: string;
  };
  googleCalendar?: {
    connected: boolean;
  };
  outlook?: {
    connected: boolean;
  };
  googleMaps?: {
    connected: boolean;
  };
  waze?: {
    connected: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  postVisibility: 'public' | 'friends' | 'private';
  allowMessages: boolean;
  requireContactApproval: boolean;
  dataCollection: {
    allowBasic: boolean;
    allowAnalytics: boolean;
    allowMarketing: boolean;
    allowThirdParty: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isVerified?: boolean;
  profilePhoto?: string;
  bio?: string;
  person?: PersonInfo;
  preferences?: UserPreferences;
  paymentMethods?: PaymentMethod[];
  billingInfo?: BillingInfo;
  currency?: string;
  externalConnections?: ExternalConnections;
  privacySettings?: PrivacySettings;
  createdAt?: string;
  updatedAt?: string;
}
