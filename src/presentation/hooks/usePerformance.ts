import { useCallback, useEffect, useRef, useState } from 'react';

// Hook para debouncing - evita ejecuciones excesivas
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttling - limita la frecuencia de ejecución
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
};

// Hook para detectar si el dispositivo es móvil
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Hook para detectar conexión lenta
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Detectar tipo de conexión si está disponible
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      setIsSlowConnection(['slow-2g', '2g'].includes(connection.effectiveType));

      const updateConnection = () => {
        setConnectionType(connection.effectiveType || 'unknown');
        setIsSlowConnection(['slow-2g', '2g'].includes(connection.effectiveType));
      };

      connection.addEventListener('change', updateConnection);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        connection.removeEventListener('change', updateConnection);
      };
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return { isOnline, connectionType, isSlowConnection };
};

// Hook para medir performance de componentes
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>();
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      if (startTime.current) {
        const endTime = performance.now();
        const duration = endTime - startTime.current;
        setRenderTime(duration);

        // Log performance en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
        }
      }
    };
  });

  return renderTime;
};

// Hook para virtual scrolling en listas grandes
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
};

// Hook para cache en memoria
export const useMemoryCache = <T>() => {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const get = useCallback((key: string, maxAge: number = 300000): T | null => {
    const item = cache.current.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > maxAge) {
      cache.current.delete(key);
      return null;
    }

    return item.data;
  }, []);

  const set = useCallback((key: string, data: T): void => {
    cache.current.set(key, { data, timestamp: Date.now() });
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const remove = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  return { get, set, clear, remove };
};