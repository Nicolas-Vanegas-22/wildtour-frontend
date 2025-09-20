// Registro de servicios para una arquitectura escalable

export interface ServiceInterface {
  name: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  isInitialized(): boolean;
}

export interface ServiceDependency {
  service: string;
  required: boolean;
}

export interface ServiceConfig {
  dependencies?: ServiceDependency[];
  lazy?: boolean;
  singleton?: boolean;
  priority?: number;
}

class ServiceRegistry {
  private services = new Map<string, ServiceInterface>();
  private configs = new Map<string, ServiceConfig>();
  private factories = new Map<string, () => ServiceInterface>();
  private initializing = new Set<string>();
  private initialized = new Set<string>();

  // Registrar un servicio
  register<T extends ServiceInterface>(
    name: string,
    factory: () => T,
    config: ServiceConfig = {}
  ): void {
    this.factories.set(name, factory);
    this.configs.set(name, {
      dependencies: [],
      lazy: false,
      singleton: true,
      priority: 0,
      ...config
    });
  }

  // Obtener un servicio (con lazy loading)
  async get<T extends ServiceInterface>(name: string): Promise<T> {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    if (!this.factories.has(name)) {
      throw new Error(`Service "${name}" is not registered`);
    }

    return this.createService<T>(name);
  }

  // Crear e inicializar un servicio
  private async createService<T extends ServiceInterface>(name: string): Promise<T> {
    if (this.initializing.has(name)) {
      // Evitar inicialización circular
      throw new Error(`Circular dependency detected for service "${name}"`);
    }

    this.initializing.add(name);

    try {
      // Resolver dependencias primero
      await this.resolveDependencies(name);

      // Crear la instancia del servicio
      const factory = this.factories.get(name)!;
      const service = factory() as T;

      // Verificar si es singleton
      const config = this.configs.get(name)!;
      if (config.singleton) {
        this.services.set(name, service);
      }

      // Inicializar el servicio
      await service.initialize();
      this.initialized.add(name);

      return service;
    } finally {
      this.initializing.delete(name);
    }
  }

  // Resolver dependencias de un servicio
  private async resolveDependencies(serviceName: string): Promise<void> {
    const config = this.configs.get(serviceName);
    if (!config?.dependencies) return;

    const promises = config.dependencies.map(async dep => {
      try {
        await this.get(dep.service);
      } catch (error) {
        if (dep.required) {
          throw new Error(`Required dependency "${dep.service}" failed to initialize for service "${serviceName}": ${error}`);
        }
        console.warn(`Optional dependency "${dep.service}" failed to initialize for service "${serviceName}":`, error);
      }
    });

    await Promise.all(promises);
  }

  // Inicializar todos los servicios no lazy
  async initializeAll(): Promise<void> {
    const nonLazyServices = Array.from(this.configs.entries())
      .filter(([_, config]) => !config.lazy)
      .sort(([_, a], [__, b]) => (b.priority || 0) - (a.priority || 0))
      .map(([name]) => name);

    for (const serviceName of nonLazyServices) {
      try {
        await this.get(serviceName);
      } catch (error) {
        console.error(`Failed to initialize service "${serviceName}":`, error);
      }
    }
  }

  // Destruir todos los servicios
  async destroyAll(): Promise<void> {
    const promises = Array.from(this.services.values()).map(service =>
      service.destroy().catch(error =>
        console.error(`Error destroying service "${service.name}":`, error)
      )
    );

    await Promise.all(promises);
    this.services.clear();
    this.initialized.clear();
  }

  // Verificar si un servicio está registrado
  isRegistered(name: string): boolean {
    return this.factories.has(name);
  }

  // Verificar si un servicio está inicializado
  isInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  // Obtener lista de servicios registrados
  getRegisteredServices(): string[] {
    return Array.from(this.factories.keys());
  }

  // Obtener lista de servicios inicializados
  getInitializedServices(): string[] {
    return Array.from(this.initialized);
  }

  // Obtener estadísticas del registro
  getStats(): {
    registered: number;
    initialized: number;
    initializing: number;
  } {
    return {
      registered: this.factories.size,
      initialized: this.initialized.size,
      initializing: this.initializing.size
    };
  }
}

// Instancia singleton del registro
export const serviceRegistry = new ServiceRegistry();

// Decorador para servicios
export function Service(name: string, config: ServiceConfig = {}) {
  return function<T extends new () => ServiceInterface>(constructor: T) {
    serviceRegistry.register(name, () => new constructor(), config);
    return constructor;
  };
}

// Clase base para servicios
export abstract class BaseService implements ServiceInterface {
  abstract name: string;
  private _initialized = false;

  async initialize(): Promise<void> {
    if (this._initialized) return;

    await this.onInitialize();
    this._initialized = true;
  }

  async destroy(): Promise<void> {
    if (!this._initialized) return;

    await this.onDestroy();
    this._initialized = false;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onDestroy(): Promise<void>;
}

// Servicios específicos de WildTour

@Service('logger', { priority: 100 })
export class LoggerService extends BaseService {
  name = 'logger';
  private logLevel: string = 'info';

  protected async onInitialize(): Promise<void> {
    this.logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'error';
    console.log('Logger service initialized');
  }

  protected async onDestroy(): Promise<void> {
    console.log('Logger service destroyed');
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    if (this.shouldLog(level)) {
      console[level](`[${new Date().toISOString()}] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }
}

@Service('analytics', {
  dependencies: [{ service: 'logger', required: true }],
  lazy: true
})
export class AnalyticsService extends BaseService {
  name = 'analytics';
  private logger!: LoggerService;

  protected async onInitialize(): Promise<void> {
    this.logger = await serviceRegistry.get<LoggerService>('logger');
    this.logger.info('Analytics service initialized');
  }

  protected async onDestroy(): Promise<void> {
    this.logger?.info('Analytics service destroyed');
  }

  track(event: string, properties?: Record<string, any>): void {
    this.logger.debug('Analytics event:', event, properties);
    // Implementar tracking real aquí
  }

  page(name: string, properties?: Record<string, any>): void {
    this.logger.debug('Analytics page view:', name, properties);
    // Implementar page tracking aquí
  }
}

@Service('cache', { priority: 90 })
export class CacheService extends BaseService {
  name = 'cache';
  private cache = new Map<string, { data: any; expires: number }>();
  private cleanupInterval?: number;

  protected async onInitialize(): Promise<void> {
    // Limpiar caché cada 5 minutos
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  protected async onDestroy(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

@Service('notification', {
  dependencies: [{ service: 'logger', required: true }],
  lazy: true
})
export class NotificationService extends BaseService {
  name = 'notification';
  private logger!: LoggerService;
  private permission: NotificationPermission = 'default';

  protected async onInitialize(): Promise<void> {
    this.logger = await serviceRegistry.get<LoggerService>('logger');

    if ('Notification' in window) {
      this.permission = Notification.permission;
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }

    this.logger.info('Notification service initialized', { permission: this.permission });
  }

  protected async onDestroy(): Promise<void> {
    this.logger?.info('Notification service destroyed');
  }

  async show(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      this.logger.warn('Notifications not supported');
      return;
    }

    if (this.permission !== 'granted') {
      this.logger.warn('Notification permission not granted');
      return;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    } catch (error) {
      this.logger.error('Failed to show notification:', error);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  hasPermission(): boolean {
    return this.permission === 'granted';
  }
}

// Hook para usar servicios en componentes React
import { useEffect, useState } from 'react';

export function useService<T extends ServiceInterface>(serviceName: string): {
  service: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [service, setService] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadService = async () => {
      try {
        setLoading(true);
        setError(null);
        const svc = await serviceRegistry.get<T>(serviceName);
        if (mounted) {
          setService(svc);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load service'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      mounted = false;
    };
  }, [serviceName]);

  return { service, loading, error };
}