// Utilidades de seguridad para WildTour

// Sanitización de HTML para prevenir XSS
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Validación de URLs para prevenir ataques de redirección
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Validación de dominios permitidos
export const isAllowedDomain = (url: string, allowedDomains: string[]): boolean => {
  try {
    const parsedUrl = new URL(url);
    return allowedDomains.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};

// Escapar caracteres especiales
export const escapeSpecialChars = (input: string): string => {
  const entityMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return input.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
};

// Validación de entrada de formularios
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe incluir al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe incluir al menos una letra minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe incluir al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe incluir al menos un carácter especial');
    }

    return { isValid: errors.length === 0, errors };
  },

  phoneNumber: (phone: string): boolean => {
    // Formato colombiano: +57 3XX XXX XXXX o similares
    const phoneRegex = /^(\+57)?[1-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  name: (name: string): boolean => {
    // Solo letras, espacios y algunos caracteres especiales
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    return nameRegex.test(name) && name.trim().length >= 2 && name.length <= 50;
  },

  documentNumber: (document: string): boolean => {
    // Validación básica para documentos colombianos
    const cleanDocument = document.replace(/\D/g, '');
    return cleanDocument.length >= 7 && cleanDocument.length <= 12;
  }
};

// Generación de tokens seguros
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Verificación de CSP (Content Security Policy)
export const checkCSP = (): boolean => {
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return meta !== null;
};

// Detección de inyección de SQL básica en strings
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(--|\/\*|\*\/)/,
    /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT|ONLOAD|ONERROR)\b)/i
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

// Validación de archivos subidos
export const validateFile = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
  ];

  if (file.size > maxSize) {
    errors.push('El archivo no puede superar los 5MB');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipo de archivo no permitido');
  }

  // Verificar extensión del archivo
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt'];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    errors.push('Extensión de archivo no permitida');
  }

  return { isValid: errors.length === 0, errors };
};

// Encriptación básica para almacenamiento local (no para datos sensibles)
export const encryptLocalData = (data: string, key: string): string => {
  // Implementación simple de XOR para datos no críticos
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

export const decryptLocalData = (encryptedData: string, key: string): string => {
  try {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return '';
  }
};

// Rate limiting básico del lado cliente
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts: number = 5, timeWindowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Registrar el nuevo intento
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

// Verificación de integridad de datos
export const verifyDataIntegrity = (data: string, expectedHash: string): boolean => {
  // En un entorno real, usarías una biblioteca de hash criptográfico
  // Esta es una implementación simplificada
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit
  }
  return hash.toString() === expectedHash;
};

// Configuración de seguridad para headers HTTP
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'none';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };
};

// Validación de sesión y tokens
export const validateSession = (token: string): boolean => {
  if (!token) return false;

  try {
    // Verificar formato básico del JWT (sin validar firma)
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Verificar expiración
    if (payload.exp && payload.exp < now) return false;

    return true;
  } catch {
    return false;
  }
};

// Limpieza de datos sensibles
export const clearSensitiveData = () => {
  // Limpiar localStorage
  const keysToRemove = Object.keys(localStorage).filter(key =>
    key.includes('token') ||
    key.includes('password') ||
    key.includes('session')
  );

  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Limpiar sessionStorage
  const sessionKeysToRemove = Object.keys(sessionStorage).filter(key =>
    key.includes('token') ||
    key.includes('password') ||
    key.includes('session')
  );

  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
};

// Detección de ataques de fuerza bruta
export const detectBruteForce = (identifier: string): boolean => {
  const attempts = localStorage.getItem(`login_attempts_${identifier}`);
  if (!attempts) return false;

  const data = JSON.parse(attempts);
  const now = Date.now();

  // Si hay más de 5 intentos en los últimos 15 minutos
  if (data.count >= 5 && now - data.lastAttempt < 15 * 60 * 1000) {
    return true;
  }

  return false;
};