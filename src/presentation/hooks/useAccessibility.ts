import { useState, useEffect, useCallback, useRef } from 'react';

// Hook para gestión de foco y navegación por teclado
export const useFocusManagement = () => {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(selectors)) as HTMLElement[];
  }, []);

  const updateFocusableElements = useCallback(() => {
    const elements = getFocusableElements();
    setFocusableElements(elements);
  }, [getFocusableElements]);

  const focusNext = useCallback(() => {
    const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
    setCurrentFocusIndex(nextIndex);
  }, [currentFocusIndex, focusableElements]);

  const focusPrevious = useCallback(() => {
    const prevIndex = currentFocusIndex - 1 < 0
      ? focusableElements.length - 1
      : currentFocusIndex - 1;
    focusableElements[prevIndex]?.focus();
    setCurrentFocusIndex(prevIndex);
  }, [currentFocusIndex, focusableElements]);

  const focusFirst = useCallback(() => {
    focusableElements[0]?.focus();
    setCurrentFocusIndex(0);
  }, [focusableElements]);

  const focusLast = useCallback(() => {
    const lastIndex = focusableElements.length - 1;
    focusableElements[lastIndex]?.focus();
    setCurrentFocusIndex(lastIndex);
  }, [focusableElements]);

  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  return {
    containerRef,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    updateFocusableElements,
    focusableElements
  };
};

// Hook para anuncios de screen reader
export const useScreenReader = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);

    // Crear elemento temporal para anuncio inmediato
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remover después de un tiempo
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  return { announce, clearAnnouncements, announcements, announcementRef };
};

// Hook para temas de alto contraste
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('high-contrast', newValue);
      localStorage.setItem('wildtour-high-contrast', newValue.toString());
      return newValue;
    });
  }, []);

  const enableHighContrast = useCallback(() => {
    setIsHighContrast(true);
    document.documentElement.classList.add('high-contrast');
    localStorage.setItem('wildtour-high-contrast', 'true');
  }, []);

  const disableHighContrast = useCallback(() => {
    setIsHighContrast(false);
    document.documentElement.classList.remove('high-contrast');
    localStorage.setItem('wildtour-high-contrast', 'false');
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wildtour-high-contrast');
    if (saved === 'true') {
      enableHighContrast();
    }

    // Detectar preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    if (mediaQuery.matches && saved === null) {
      enableHighContrast();
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && saved === null) {
        enableHighContrast();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableHighContrast]);

  return { isHighContrast, toggleHighContrast, enableHighContrast, disableHighContrast };
};

// Hook para tamaño de fuente ajustable
export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(100); // Porcentaje base

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 10, 150);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('wildtour-font-size', newSize.toString());
      return newSize;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 10, 80);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('wildtour-font-size', newSize.toString());
      return newSize;
    });
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
    localStorage.setItem('wildtour-font-size', '100');
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wildtour-font-size');
    if (saved) {
      const size = parseInt(saved, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
  }, []);

  return { fontSize, increaseFontSize, decreaseFontSize, resetFontSize };
};

// Hook para animaciones reducidas
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [prefersReducedMotion]);

  return prefersReducedMotion;
};

// Hook para navegación por teclado
export const useKeyboardNavigation = (
  onEscape?: () => void,
  onEnter?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
};