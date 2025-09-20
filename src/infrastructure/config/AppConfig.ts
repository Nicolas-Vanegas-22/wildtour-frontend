// Configuración centralizada de la aplicación para escalabilidad

export interface AppConfig {
  api: ApiConfig;
  features: FeatureFlags;
  performance: PerformanceConfig;
  security: SecurityConfig;
  analytics: AnalyticsConfig;
  cdn: CDNConfig;
  payments: PaymentConfig;
  maps: MapConfig;
  monitoring: MonitoringConfig;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  endpoints: {
    auth: string;
    users: string;
    destinations: string;
    bookings: string;
    payments: string;
    reviews: string;
    notifications: string;
    analytics: string;
    uploads: string;
  };
  versioning: {
    strategy: 'header' | 'url' | 'query';
    currentVersion: string;
    supportedVersions: string[];
  };
}

export interface FeatureFlags {
  enableTwoFactorAuth: boolean;
  enableOfflineMode: boolean;
  enablePushNotifications: boolean;
  enableAdvancedAnalytics: boolean;
  enableAIRecommendations: boolean;
  enableVirtualTours: boolean;
  enableSocialSharing: boolean;
  enableRealtimeChat: boolean;
  enableAdvancedSearch: boolean;
  enableDarkMode: boolean;
  enableHighContrast: boolean;
  enableVoiceSearch: boolean;
  experimentalFeatures: {
    [key: string]: boolean;
  };
}

export interface PerformanceConfig {
  lazyLoading: {
    enabled: boolean;
    threshold: number;
    rootMargin: string;
  };
  caching: {
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
    ttl: number;
    maxSize: number;
  };
  bundling: {
    chunkSize: number;
    splitVendors: boolean;
    prefetchRoutes: string[];
  };
  images: {
    formats: string[];
    sizes: number[];
    quality: number;
    lazyLoad: boolean;
  };
}

export interface SecurityConfig {
  csp: {
    enabled: boolean;
    directives: { [key: string]: string[] };
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
  };
  auth: {
    tokenStorage: 'localStorage' | 'sessionStorage' | 'httpOnly';
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  encryption: {
    algorithm: string;
    keySize: number;
  };
}

export interface AnalyticsConfig {
  enabled: boolean;
  providers: {
    googleAnalytics?: {
      trackingId: string;
      anonymizeIp: boolean;
    };
    mixpanel?: {
      token: string;
    };
    hotjar?: {
      siteId: string;
    };
  };
  trackingLevel: 'minimal' | 'standard' | 'detailed';
  dataRetention: number; // días
}

export interface CDNConfig {
  enabled: boolean;
  baseUrl: string;
  regions: string[];
  fallbackUrls: string[];
  cachePolicy: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
  };
}

export interface PaymentConfig {
  providers: {
    payu: {
      enabled: boolean;
      merchantId: string;
      publicKey: string;
      sandbox: boolean;
    };
    mercadopago: {
      enabled: boolean;
      publicKey: string;
      sandbox: boolean;
    };
    pse: {
      enabled: boolean;
      bankList: string[];
    };
  };
  currency: string;
  locale: string;
}

export interface MapConfig {
  provider: 'leaflet' | 'google' | 'mapbox';
  apiKey?: string;
  defaultCenter: [number, number];
  defaultZoom: number;
  clustering: {
    enabled: boolean;
    maxZoom: number;
  };
  tileProviders: {
    [key: string]: {
      url: string;
      attribution: string;
      maxZoom: number;
    };
  };
}

export interface MonitoringConfig {
  errorReporting: {
    enabled: boolean;
    sentry?: {
      dsn: string;
      environment: string;
    };
  };
  performance: {
    enabled: boolean;
    sampleRate: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    console: boolean;
    remote: boolean;
  };
}

// Configuración por ambiente
const configs: { [env: string]: AppConfig } = {
  development: {
    api: {
      baseUrl: 'http://localhost:3001/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      endpoints: {
        auth: '/auth',
        users: '/users',
        destinations: '/destinations',
        bookings: '/bookings',
        payments: '/payments',
        reviews: '/reviews',
        notifications: '/notifications',
        analytics: '/analytics',
        uploads: '/uploads'
      },
      versioning: {
        strategy: 'header',
        currentVersion: 'v1',
        supportedVersions: ['v1']
      }
    },
    features: {
      enableTwoFactorAuth: true,
      enableOfflineMode: false,
      enablePushNotifications: false,
      enableAdvancedAnalytics: false,
      enableAIRecommendations: false,
      enableVirtualTours: false,
      enableSocialSharing: true,
      enableRealtimeChat: false,
      enableAdvancedSearch: true,
      enableDarkMode: true,
      enableHighContrast: true,
      enableVoiceSearch: false,
      experimentalFeatures: {}
    },
    performance: {
      lazyLoading: {
        enabled: true,
        threshold: 0.1,
        rootMargin: '50px'
      },
      caching: {
        strategy: 'network-first',
        ttl: 300000, // 5 minutos
        maxSize: 50
      },
      bundling: {
        chunkSize: 250000, // 250KB
        splitVendors: true,
        prefetchRoutes: ['/destinos', '/perfil']
      },
      images: {
        formats: ['webp', 'jpg'],
        sizes: [320, 640, 1024, 1920],
        quality: 85,
        lazyLoad: true
      }
    },
    security: {
      csp: {
        enabled: false, // Deshabilitado en desarrollo
        directives: {}
      },
      cors: {
        allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      },
      auth: {
        tokenStorage: 'localStorage',
        sessionTimeout: 3600000, // 1 hora
        maxLoginAttempts: 5,
        lockoutDuration: 900000 // 15 minutos
      },
      encryption: {
        algorithm: 'AES-256-GCM',
        keySize: 256
      }
    },
    analytics: {
      enabled: false,
      providers: {},
      trackingLevel: 'minimal',
      dataRetention: 30
    },
    cdn: {
      enabled: false,
      baseUrl: '',
      regions: [],
      fallbackUrls: [],
      cachePolicy: {
        images: 86400, // 1 día
        scripts: 3600, // 1 hora
        styles: 3600, // 1 hora
        fonts: 604800 // 1 semana
      }
    },
    payments: {
      providers: {
        payu: {
          enabled: true,
          merchantId: 'test-merchant',
          publicKey: 'test-public-key',
          sandbox: true
        },
        mercadopago: {
          enabled: true,
          publicKey: 'test-public-key',
          sandbox: true
        },
        pse: {
          enabled: true,
          bankList: ['banco-test']
        }
      },
      currency: 'COP',
      locale: 'es-CO'
    },
    maps: {
      provider: 'leaflet',
      defaultCenter: [4.7110, -74.0721], // Bogotá
      defaultZoom: 6,
      clustering: {
        enabled: true,
        maxZoom: 15
      },
      tileProviders: {
        openstreetmap: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }
      }
    },
    monitoring: {
      errorReporting: {
        enabled: true,
        sentry: {
          dsn: '',
          environment: 'development'
        }
      },
      performance: {
        enabled: true,
        sampleRate: 1.0
      },
      logging: {
        level: 'debug',
        console: true,
        remote: false
      }
    }
  },

  production: {
    api: {
      baseUrl: 'https://api.wildtour.com',
      timeout: 15000,
      retryAttempts: 3,
      retryDelay: 2000,
      endpoints: {
        auth: '/auth',
        users: '/users',
        destinations: '/destinations',
        bookings: '/bookings',
        payments: '/payments',
        reviews: '/reviews',
        notifications: '/notifications',
        analytics: '/analytics',
        uploads: '/uploads'
      },
      versioning: {
        strategy: 'header',
        currentVersion: 'v1',
        supportedVersions: ['v1']
      }
    },
    features: {
      enableTwoFactorAuth: true,
      enableOfflineMode: true,
      enablePushNotifications: true,
      enableAdvancedAnalytics: true,
      enableAIRecommendations: true,
      enableVirtualTours: true,
      enableSocialSharing: true,
      enableRealtimeChat: true,
      enableAdvancedSearch: true,
      enableDarkMode: true,
      enableHighContrast: true,
      enableVoiceSearch: true,
      experimentalFeatures: {}
    },
    performance: {
      lazyLoading: {
        enabled: true,
        threshold: 0.1,
        rootMargin: '100px'
      },
      caching: {
        strategy: 'stale-while-revalidate',
        ttl: 600000, // 10 minutos
        maxSize: 100
      },
      bundling: {
        chunkSize: 200000, // 200KB
        splitVendors: true,
        prefetchRoutes: ['/destinos', '/perfil', '/reservar']
      },
      images: {
        formats: ['avif', 'webp', 'jpg'],
        sizes: [320, 640, 1024, 1920, 2560],
        quality: 80,
        lazyLoad: true
      }
    },
    security: {
      csp: {
        enabled: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.wildtour.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'img-src': ["'self'", 'data:', 'https:'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'connect-src': ["'self'", 'https://api.wildtour.com']
        }
      },
      cors: {
        allowedOrigins: ['https://wildtour.com', 'https://www.wildtour.com'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      },
      auth: {
        tokenStorage: 'httpOnly',
        sessionTimeout: 1800000, // 30 minutos
        maxLoginAttempts: 3,
        lockoutDuration: 1800000 // 30 minutos
      },
      encryption: {
        algorithm: 'AES-256-GCM',
        keySize: 256
      }
    },
    analytics: {
      enabled: true,
      providers: {
        googleAnalytics: {
          trackingId: 'GA_TRACKING_ID',
          anonymizeIp: true
        }
      },
      trackingLevel: 'standard',
      dataRetention: 90
    },
    cdn: {
      enabled: true,
      baseUrl: 'https://cdn.wildtour.com',
      regions: ['us-east-1', 'sa-east-1', 'eu-west-1'],
      fallbackUrls: ['https://backup-cdn.wildtour.com'],
      cachePolicy: {
        images: 604800, // 1 semana
        scripts: 86400, // 1 día
        styles: 86400, // 1 día
        fonts: 2592000 // 30 días
      }
    },
    payments: {
      providers: {
        payu: {
          enabled: true,
          merchantId: process.env.PAYU_MERCHANT_ID || '',
          publicKey: process.env.PAYU_PUBLIC_KEY || '',
          sandbox: false
        },
        mercadopago: {
          enabled: true,
          publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
          sandbox: false
        },
        pse: {
          enabled: true,
          bankList: ['bancolombia', 'davivienda', 'banco-bogota', 'bbva']
        }
      },
      currency: 'COP',
      locale: 'es-CO'
    },
    maps: {
      provider: 'leaflet',
      defaultCenter: [4.7110, -74.0721],
      defaultZoom: 6,
      clustering: {
        enabled: true,
        maxZoom: 15
      },
      tileProviders: {
        openstreetmap: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }
      }
    },
    monitoring: {
      errorReporting: {
        enabled: true,
        sentry: {
          dsn: process.env.SENTRY_DSN || '',
          environment: 'production'
        }
      },
      performance: {
        enabled: true,
        sampleRate: 0.1
      },
      logging: {
        level: 'error',
        console: false,
        remote: true
      }
    }
  }
};

// Función para obtener la configuración actual
export const getConfig = (): AppConfig => {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
};

// Función para verificar si una feature está habilitada
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const config = getConfig();
  return config.features[feature] || false;
};

// Función para obtener configuración de API
export const getApiConfig = (): ApiConfig => {
  return getConfig().api;
};

// Función para obtener endpoint específico
export const getApiEndpoint = (endpoint: keyof ApiConfig['endpoints']): string => {
  const config = getApiConfig();
  return `${config.baseUrl}${config.endpoints[endpoint]}`;
};