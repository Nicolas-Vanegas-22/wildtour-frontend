import { useState, useEffect, useCallback } from 'react';
import {
  rateLimiter,
  validateSession,
  clearSensitiveData,
  detectBruteForce,
  validateInput,
  sanitizeHtml
} from '../../infrastructure/security/securityUtils';

// Hook para gestión segura de autenticación
export const useSecureAuth = () => {
  const [isSecureConnection, setIsSecureConnection] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const [bruteForceProtection, setBruteForceProtection] = useState(false);

  useEffect(() => {
    // Verificar conexión HTTPS
    setIsSecureConnection(window.location.protocol === 'https:');

    // Verificar sesión actual
    const token = localStorage.getItem('wildtour-token');
    setSessionValid(validateSession(token || ''));

    // Configurar limpieza automática en visibilitychange
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Marcar tiempo de inactividad
        sessionStorage.setItem('lastActivity', Date.now().toString());
      } else {
        // Verificar tiempo de inactividad al volver (30 minutos)
        const lastActivity = sessionStorage.getItem('lastActivity');
        if (lastActivity && Date.now() - parseInt(lastActivity) > 30 * 60 * 1000) {
          logout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const secureLogin = useCallback(async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;

    // Validar rate limiting
    if (!rateLimiter.isAllowed(email)) {
      throw new Error('Demasiados intentos de inicio de sesión. Intenta nuevamente en unos minutos.');
    }

    // Detectar ataques de fuerza bruta
    if (detectBruteForce(email)) {
      setBruteForceProtection(true);
      throw new Error('Cuenta temporalmente bloqueada por actividad sospechosa.');
    }

    // Validar formato de email
    if (!validateInput.email(email)) {
      throw new Error('Formato de email inválido');
    }

    // Validar conexión segura
    if (!isSecureConnection && process.env.NODE_ENV === 'production') {
      throw new Error('Conexión no segura. Se requiere HTTPS.');
    }

    try {
      // Aquí iría la llamada real a la API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        // Registrar intento fallido
        const attempts = localStorage.getItem(`login_attempts_${email}`);
        const data = attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: 0 };

        localStorage.setItem(`login_attempts_${email}`, JSON.stringify({
          count: data.count + 1,
          lastAttempt: Date.now()
        }));

        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();

      // Limpiar intentos fallidos
      localStorage.removeItem(`login_attempts_${email}`);
      rateLimiter.reset(email);

      // Almacenar token de forma segura
      localStorage.setItem('wildtour-token', data.token);
      setSessionValid(true);

      return data;
    } catch (error) {
      throw error;
    }
  }, [isSecureConnection]);

  const logout = useCallback(() => {
    clearSensitiveData();
    setSessionValid(false);
    // Redirigir a login
    window.location.href = '/login';
  }, []);

  const checkSessionValidity = useCallback(() => {
    const token = localStorage.getItem('wildtour-token');
    const isValid = validateSession(token || '');
    setSessionValid(isValid);

    if (!isValid && token) {
      logout();
    }

    return isValid;
  }, [logout]);

  return {
    isSecureConnection,
    sessionValid,
    bruteForceProtection,
    secureLogin,
    logout,
    checkSessionValidity
  };
};

// Hook para validación segura de formularios
export const useSecureForm = () => {
  const sanitizeInput = useCallback((input: string): string => {
    return sanitizeHtml(input.trim());
  }, []);

  const validateSecureInput = useCallback((input: string, type: 'email' | 'password' | 'name' | 'phone' | 'document'): { isValid: boolean; errors: string[] } => {
    const sanitized = sanitizeInput(input);

    switch (type) {
      case 'email':
        return { isValid: validateInput.email(sanitized), errors: validateInput.email(sanitized) ? [] : ['Email inválido'] };
      case 'password':
        return validateInput.password(sanitized);
      case 'name':
        return { isValid: validateInput.name(sanitized), errors: validateInput.name(sanitized) ? [] : ['Nombre inválido'] };
      case 'phone':
        return { isValid: validateInput.phoneNumber(sanitized), errors: validateInput.phoneNumber(sanitized) ? [] : ['Teléfono inválido'] };
      case 'document':
        return { isValid: validateInput.documentNumber(sanitized), errors: validateInput.documentNumber(sanitized) ? [] : ['Documento inválido'] };
      default:
        return { isValid: false, errors: ['Tipo de validación no reconocido'] };
    }
  }, [sanitizeInput]);

  return {
    sanitizeInput,
    validateSecureInput
  };
};

// Hook para detección de amenazas
export const useThreatDetection = () => {
  const [threats, setThreats] = useState<string[]>([]);

  const detectXSS = useCallback((input: string): boolean => {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }, []);

  const reportThreat = useCallback((threatType: string, details: string) => {
    setThreats(prev => [...prev, `${threatType}: ${details}`]);

    // En producción, enviar a servicio de seguridad
    console.warn(`Amenaza detectada: ${threatType}`, details);
  }, []);

  const clearThreats = useCallback(() => {
    setThreats([]);
  }, []);

  return {
    threats,
    detectXSS,
    reportThreat,
    clearThreats
  };
};

// Hook para gestión segura de archivos
export const useSecureFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const secureUpload = useCallback(async (file: File, endpoint: string): Promise<any> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validar archivo
      const { isValid, errors } = validateInput.file ? validateInput.file(file) : { isValid: true, errors: [] };

      if (!isValid) {
        throw new Error(errors.join(', '));
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', Date.now().toString());

      // Crear XMLHttpRequest para seguimiento del progreso
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              reject(new Error('Respuesta inválida del servidor'));
            }
          } else {
            reject(new Error(`Error del servidor: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red durante la subida'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Tiempo de espera agotado'));
        });

        xhr.open('POST', endpoint);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 30000; // 30 segundos
        xhr.send(formData);
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    uploadProgress,
    isUploading,
    secureUpload
  };
};

// Hook para detección de actividad sospechosa
export const useActivityMonitoring = () => {
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);

  useEffect(() => {
    let clickCount = 0;
    let keyPressCount = 0;
    let lastResetTime = Date.now();

    const handleClick = () => {
      clickCount++;
      checkActivity();
    };

    const handleKeyPress = () => {
      keyPressCount++;
      checkActivity();
    };

    const checkActivity = () => {
      const now = Date.now();
      const timeSinceReset = now - lastResetTime;

      // Detectar actividad excesiva (más de 100 clics o 200 teclas en 10 segundos)
      if (timeSinceReset < 10000 && (clickCount > 100 || keyPressCount > 200)) {
        setSuspiciousActivity(true);
        console.warn('Actividad sospechosa detectada');
      }

      // Reset contadores cada 10 segundos
      if (timeSinceReset > 10000) {
        clickCount = 0;
        keyPressCount = 0;
        lastResetTime = now;
        setSuspiciousActivity(false);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return { suspiciousActivity };
};