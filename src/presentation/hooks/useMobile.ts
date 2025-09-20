import { useState, useEffect, useCallback } from 'react';

// Hook para detectar dispositivos móviles
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return { isMobile, isTablet, orientation };
};

// Hook para gestos táctiles
export const useTouch = () => {
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDragging: false,
    isLongPress: false
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
      isDragging: false,
      isLongPress: false
    }));
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
      isDragging: true
    }));
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    setTouchState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  const getSwipeDirection = useCallback(() => {
    const { startX, startY, endX, endY } = touchState;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return null;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, [touchState]);

  return {
    touchState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getSwipeDirection
  };
};

// Hook para viewport móvil
export const useMobileViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // Detectar si el teclado virtual está abierto (reducción significativa de altura)
      setIsKeyboardOpen(heightDifference > 150);
      setViewportHeight(currentHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { viewportHeight, isKeyboardOpen };
};

// Hook para optimización de rendimiento en móviles
export const useMobilePerformance = () => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Detectar modo de bajo consumo (aproximado)
    const checkLowPowerMode = () => {
      // Heurística: si el dispositivo tiene menos cores o frecuencia baja
      if ('hardwareConcurrency' in navigator) {
        setIsLowPowerMode(navigator.hardwareConcurrency <= 2);
      }
    };

    // Detectar tipo de conexión
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    checkLowPowerMode();
    checkConnection();

    // Listener para cambios de conexión
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', checkConnection);

      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);

  const shouldReduceAnimations = isLowPowerMode || ['slow-2g', '2g'].includes(connectionType);
  const shouldReduceImages = ['slow-2g', '2g', '3g'].includes(connectionType);

  return {
    isLowPowerMode,
    connectionType,
    shouldReduceAnimations,
    shouldReduceImages
  };
};

// Hook para pull-to-refresh
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    // Solo permitir pull-to-refresh si estamos en la parte superior
    if (window.scrollY === 0 && distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, 100));
    }
  }, [startY]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isRefreshing, pullDistance };
};

// Hook para infinite scroll optimizado para móviles
export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  hasMore: boolean = true,
  threshold: number = 100
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const handleScroll = async () => {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < threshold) {
        setIsLoading(true);
        setError(null);

        try {
          await loadMore();
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load more'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Throttle scroll events para mejor rendimiento en móviles
    let timeoutId: number;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        handleScroll();
        timeoutId = 0;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  return { isLoading, error };
};

// Hook para safe area (notch handling)
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0')
      });
    };

    updateSafeArea();
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

// Hook para haptic feedback
export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(50), [vibrate]);
  const heavyTap = useCallback(() => vibrate(100), [vibrate]);
  const doubleTap = useCallback(() => vibrate([50, 50, 50]), [vibrate]);
  const success = useCallback(() => vibrate([100, 50, 100]), [vibrate]);
  const error = useCallback(() => vibrate([200, 100, 200, 100, 200]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    doubleTap,
    success,
    error,
    isSupported: 'vibrate' in navigator
  };
};

// Hook para bottom sheet behavior
export const useBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      setHeight(Math.max(0, height - deltaY));
    }
  }, [isDragging, startY, height]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    // Si se arrastra más del 30%, cerrar
    if (height < window.innerHeight * 0.3) {
      close();
    } else {
      // Volver a la posición original
      setHeight(window.innerHeight * 0.6);
    }
  }, [height, close]);

  return {
    isOpen,
    height,
    isDragging,
    open,
    close,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};