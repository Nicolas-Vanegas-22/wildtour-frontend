// Detección y compatibilidad de navegadores para WildTour

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: BrowserFeatures;
  os: string;
  isMobile: boolean;
  isTablet: boolean;
}

export interface BrowserFeatures {
  webp: boolean;
  avif: boolean;
  intersectionObserver: boolean;
  serviceWorker: boolean;
  webGL: boolean;
  cssGrid: boolean;
  cssFlexbox: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  fetch: boolean;
  promises: boolean;
  webSockets: boolean;
  webRTC: boolean;
  geolocation: boolean;
  mediaQueries: boolean;
  es6Modules: boolean;
  customElements: boolean;
  shadowDOM: boolean;
}

// Detectar información del navegador
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const features = detectFeatures();

  // Detectar navegador y versión
  let name = 'unknown';
  let version = '0';

  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    name = 'chrome';
    version = extractVersion(userAgent, /chrome\/([\d.]+)/);
  } else if (userAgent.includes('firefox')) {
    name = 'firefox';
    version = extractVersion(userAgent, /firefox\/([\d.]+)/);
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    name = 'safari';
    version = extractVersion(userAgent, /version\/([\d.]+)/);
  } else if (userAgent.includes('edg')) {
    name = 'edge';
    version = extractVersion(userAgent, /edg\/([\d.]+)/);
  } else if (userAgent.includes('msie') || userAgent.includes('trident')) {
    name = 'ie';
    version = extractVersion(userAgent, /(?:msie |rv:)([\d.]+)/);
  }

  // Detectar sistema operativo
  let os = 'unknown';
  if (userAgent.includes('windows')) os = 'windows';
  else if (userAgent.includes('mac')) os = 'macos';
  else if (userAgent.includes('linux')) os = 'linux';
  else if (userAgent.includes('android')) os = 'android';
  else if (userAgent.includes('ios')) os = 'ios';

  // Detectar tipo de dispositivo
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|tablet|(android(?!.*mobile))/i.test(userAgent);

  // Determinar si el navegador es compatible
  const isSupported = checkBrowserSupport(name, version);

  return {
    name,
    version,
    isSupported,
    features,
    os,
    isMobile,
    isTablet
  };
};

const extractVersion = (userAgent: string, regex: RegExp): string => {
  const match = userAgent.match(regex);
  return match ? match[1] : '0';
};

const checkBrowserSupport = (name: string, version: string): boolean => {
  const majorVersion = parseInt(version.split('.')[0]);

  const minimumVersions: { [key: string]: number } = {
    chrome: 80,
    firefox: 75,
    safari: 13,
    edge: 80,
    ie: 0 // IE no soportado
  };

  return majorVersion >= (minimumVersions[name] || 0);
};

// Detectar características del navegador
const detectFeatures = (): BrowserFeatures => {
  const features: BrowserFeatures = {
    webp: false,
    avif: false,
    intersectionObserver: 'IntersectionObserver' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: false,
    cssGrid: false,
    cssFlexbox: false,
    localStorage: false,
    sessionStorage: false,
    fetch: 'fetch' in window,
    promises: 'Promise' in window,
    webSockets: 'WebSocket' in window,
    webRTC: 'RTCPeerConnection' in window,
    geolocation: 'geolocation' in navigator,
    mediaQueries: 'matchMedia' in window,
    es6Modules: false,
    customElements: 'customElements' in window,
    shadowDOM: 'attachShadow' in Element.prototype
  };

  // Detectar soporte para WebP
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    features.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    features.webp = false;
  }

  // Detectar soporte para AVIF
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    features.avif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    features.avif = false;
  }

  // Detectar WebGL
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    features.webGL = !!gl;
  } catch {
    features.webGL = false;
  }

  // Detectar CSS Grid
  features.cssGrid = CSS.supports('display', 'grid');

  // Detectar CSS Flexbox
  features.cssFlexbox = CSS.supports('display', 'flex');

  // Detectar localStorage
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    features.localStorage = true;
  } catch {
    features.localStorage = false;
  }

  // Detectar sessionStorage
  try {
    const test = 'test';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    features.sessionStorage = true;
  } catch {
    features.sessionStorage = false;
  }

  // Detectar soporte para módulos ES6
  try {
    new Function('import("")');
    features.es6Modules = true;
  } catch {
    features.es6Modules = false;
  }

  return features;
};

// Polyfills y fallbacks
export const loadPolyfills = async (): Promise<void> => {
  const browserInfo = detectBrowser();

  // Cargar polyfills según las características del navegador
  const polyfillsToLoad: string[] = [];

  if (!browserInfo.features.intersectionObserver) {
    polyfillsToLoad.push('intersection-observer');
  }

  if (!browserInfo.features.fetch) {
    polyfillsToLoad.push('whatwg-fetch');
  }

  if (!browserInfo.features.promises) {
    polyfillsToLoad.push('es6-promise');
  }

  // Cargar polyfills dinámicamente
  for (const polyfill of polyfillsToLoad) {
    try {
      await import(`../polyfills/${polyfill}`);
    } catch (error) {
      console.warn(`Failed to load polyfill: ${polyfill}`, error);
    }
  }
};

// Aplicar prefijos CSS según el navegador
export const addCSSPrefixes = (property: string, value: string): { [key: string]: string } => {
  const browserInfo = detectBrowser();
  const prefixes: { [key: string]: string[] } = {
    transform: ['-webkit-', '-moz-', '-ms-', ''],
    transition: ['-webkit-', '-moz-', '-ms-', ''],
    'border-radius': ['-webkit-', '-moz-', ''],
    'box-shadow': ['-webkit-', '-moz-', ''],
    'user-select': ['-webkit-', '-moz-', '-ms-', ''],
    'backdrop-filter': ['-webkit-', '']
  };

  const result: { [key: string]: string } = {};

  if (prefixes[property]) {
    prefixes[property].forEach(prefix => {
      result[`${prefix}${property}`] = value;
    });
  } else {
    result[property] = value;
  }

  return result;
};

// Crear elemento con fallbacks para diferentes navegadores
export const createCompatibleElement = (tagName: string, options: any = {}): HTMLElement => {
  const element = document.createElement(tagName);
  const browserInfo = detectBrowser();

  // Aplicar opciones específicas del navegador
  if (options.styles) {
    Object.entries(options.styles).forEach(([property, value]) => {
      const prefixedStyles = addCSSPrefixes(property, value as string);
      Object.entries(prefixedStyles).forEach(([prefixedProperty, prefixedValue]) => {
        (element.style as any)[prefixedProperty] = prefixedValue;
      });
    });
  }

  return element;
};

// Detectar soporte para características específicas
export const supportsFeature = (feature: string): boolean => {
  const browserInfo = detectBrowser();

  switch (feature) {
    case 'webp':
      return browserInfo.features.webp;
    case 'avif':
      return browserInfo.features.avif;
    case 'grid':
      return browserInfo.features.cssGrid;
    case 'flexbox':
      return browserInfo.features.cssFlexbox;
    case 'intersection-observer':
      return browserInfo.features.intersectionObserver;
    case 'service-worker':
      return browserInfo.features.serviceWorker;
    default:
      return false;
  }
};

// Obtener el mejor formato de imagen soportado
export const getBestImageFormat = (): 'avif' | 'webp' | 'jpg' => {
  const browserInfo = detectBrowser();

  if (browserInfo.features.avif) return 'avif';
  if (browserInfo.features.webp) return 'webp';
  return 'jpg';
};

// Verificar si el navegador necesita actualización
export const needsBrowserUpdate = (): boolean => {
  const browserInfo = detectBrowser();
  return !browserInfo.isSupported;
};

// Obtener mensaje de actualización específico del navegador
export const getBrowserUpdateMessage = (): string => {
  const browserInfo = detectBrowser();

  const messages: { [key: string]: string } = {
    ie: 'Internet Explorer no es compatible. Por favor, usa Chrome, Firefox, Safari o Edge.',
    chrome: 'Tu versión de Chrome está desactualizada. Por favor, actualiza a la versión más reciente.',
    firefox: 'Tu versión de Firefox está desactualizada. Por favor, actualiza a la versión más reciente.',
    safari: 'Tu versión de Safari está desactualizada. Por favor, actualiza a la versión más reciente.',
    edge: 'Tu versión de Edge está desactualizada. Por favor, actualiza a la versión más reciente.',
    unknown: 'Tu navegador no es compatible. Por favor, usa Chrome, Firefox, Safari o Edge.'
  };

  return messages[browserInfo.name] || messages.unknown;
};

// Configurar event listeners con compatibilidad cross-browser
export const addCompatibleEventListener = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void => {
  if (element.addEventListener) {
    element.addEventListener(event, handler, options);
  } else if ((element as any).attachEvent) {
    // IE8 y anteriores
    (element as any).attachEvent(`on${event}`, handler);
  }
};

// Remover event listeners con compatibilidad
export const removeCompatibleEventListener = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
): void => {
  if (element.removeEventListener) {
    element.removeEventListener(event, handler, options);
  } else if ((element as any).detachEvent) {
    // IE8 y anteriores
    (element as any).detachEvent(`on${event}`, handler);
  }
};