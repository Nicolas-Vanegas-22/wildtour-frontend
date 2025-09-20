import { useState, useEffect, useCallback } from 'react';

interface UseImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  lazy?: boolean;
}

interface ImageOptimizationResult {
  src: string;
  loading: boolean;
  error: boolean;
  retry: () => void;
}

export const useImageOptimization = (
  originalSrc: string,
  options: UseImageOptimizationOptions = {}
): ImageOptimizationResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [src, setSrc] = useState('');

  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    lazy = true
  } = options;

  const generateOptimizedUrl = useCallback((originalUrl: string) => {
    // En un entorno real, esto se conectaría a un servicio de optimización de imágenes
    // como Cloudinary, ImageKit, o un CDN con transformaciones
    const params = new URLSearchParams();

    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('f', format);

    // Para desarrollo, retornamos la URL original
    // En producción, esto sería algo como: `https://cdn.wildtour.com/images/${originalUrl}?${params}`
    return originalUrl;
  }, [width, height, quality, format]);

  const loadImage = useCallback(() => {
    setLoading(true);
    setError(false);

    const img = new Image();
    const optimizedSrc = generateOptimizedUrl(originalSrc);

    img.onload = () => {
      setSrc(optimizedSrc);
      setLoading(false);
    };

    img.onerror = () => {
      // Fallback a la imagen original si la optimizada falla
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setSrc(originalSrc);
        setLoading(false);
      };
      fallbackImg.onerror = () => {
        setError(true);
        setLoading(false);
      };
      fallbackImg.src = originalSrc;
    };

    img.src = optimizedSrc;
  }, [originalSrc, generateOptimizedUrl]);

  const retry = useCallback(() => {
    loadImage();
  }, [loadImage]);

  useEffect(() => {
    if (!lazy) {
      loadImage();
    }
  }, [loadImage, lazy]);

  return { src, loading, error, retry };
};

// Hook para lazy loading de imágenes
export const useLazyImage = (ref: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

// Hook para precargar imágenes críticas
export const useImagePreloader = (urls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, url]));
      };
      img.src = url;
    });
  }, [urls]);

  return loadedImages;
};