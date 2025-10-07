// Configuración de seguridad y auditoría para Wild Tour
export const securityConfig = {
  // Configuración de auditoría
  audit: {
    // Tipos de eventos que siempre deben ser loggeados
    criticalEvents: [
      'login_attempt',
      'data_breach',
      'security_incident',
      'consent_revoked',
      'right_exercised',
      'third_party_share',
    ],

    // Configuración de retención de datos por categoría
    retentionPeriods: {
      security: '7 years',
      legal: '10 years',
      privacy: '5 years',
      compliance: '5 years',
      operational: '2 years',
    },

    // Configuración de severidad automática
    autoSeverity: {
      // Eventos que siempre son críticos
      critical: [
        'data_breach',
        'unauthorized_access',
        'script_injection',
        'form_injection',
      ],
      // Eventos que siempre son de alta severidad
      high: [
        'right_exercised',
        'consent_revoked',
        'third_party_share',
        'data_export',
        'hidden_element_click',
      ],
      // Eventos de severidad media
      medium: [
        'login_attempt_failed',
        'data_modification',
        'consent_granted',
        'rapid_clicking',
        'automated_typing',
      ],
      // Eventos de baja severidad
      low: [
        'login_attempt_success',
        'data_access',
        'policy_view',
        'page_navigation',
      ],
    },
  },

  // Configuración del monitor de seguridad
  monitoring: {
    // Umbrales para detectar actividad sospechosa
    thresholds: {
      rapidClicks: 10, // clics por segundo
      rapidKeystrokes: 50, // teclas por período
      mouseSpeed: 5, // píxeles por milisegundo
      inactivityMinutes: 30, // minutos de inactividad
      focusChanges: 20, // cambios de foco excesivos
    },

    // Patrones de comportamiento sospechoso
    suspiciousPatterns: {
      // Combinaciones de teclas que pueden indicar herramientas de desarrollo
      devToolsKeys: [
        { ctrl: true, shift: true, key: 'I' },
        { ctrl: true, shift: true, key: 'J' },
        { ctrl: true, shift: true, key: 'C' },
        { key: 'F12' },
      ],

      // Selectores CSS de elementos sensibles
      sensitiveSelectors: [
        'input[type="password"]',
        'input[name*="credit"]',
        'input[name*="card"]',
        'input[name*="ssn"]',
        'input[name*="document"]',
        'input[name*="phone"]',
        'input[name*="email"]',
      ],

      // Atributos HTML sensibles que no deberían modificarse
      sensitiveAttributes: [
        'action',
        'src',
        'href',
        'onclick',
        'onsubmit',
        'onload',
      ],

      // Palabras clave que indican errores de seguridad
      securityKeywords: [
        'unauthorized',
        'token',
        'permission',
        'forbidden',
        'csrf',
        'xss',
        'injection',
        'bypass',
        'escalation',
      ],
    },

    // Configuración de alertas automáticas
    alerts: {
      // Alertas que se envían inmediatamente
      immediate: [
        'script_injection',
        'form_injection',
        'data_breach',
        'unauthorized_access',
      ],

      // Alertas que se envían en batch
      batched: [
        'rapid_clicking',
        'automated_typing',
        'devtools_attempt',
        'excessive_focus_changes',
      ],

      // Configuración de destinatarios
      recipients: {
        security: ['security@wildtour.com'],
        legal: ['legal@wildtour.com'],
        technical: ['dev@wildtour.com'],
      },
    },
  },

  // Configuración de privacidad y datos
  privacy: {
    // Categorías de datos personales según Ley 1581/2012
    dataCategories: {
      personal_data: {
        name: 'Datos Personales',
        description: 'Información que identifica o puede identificar a una persona',
        fields: ['firstName', 'lastName', 'document', 'birthDate'],
        retention: '5 years',
        legalBasis: 'Article 6 Law 1581/2012 - Consent',
      },
      contact_data: {
        name: 'Datos de Contacto',
        description: 'Información para comunicarse con la persona',
        fields: ['email', 'phone', 'address'],
        retention: '5 years',
        legalBasis: 'Article 6 Law 1581/2012 - Consent',
      },
      financial_data: {
        name: 'Datos Financieros',
        description: 'Información relacionada con pagos y transacciones',
        fields: ['paymentMethod', 'cardLast4', 'billingAddress'],
        retention: '7 years',
        legalBasis: 'Legal obligation - Financial records',
      },
      behavioral_data: {
        name: 'Datos de Comportamiento',
        description: 'Información sobre el uso de la plataforma',
        fields: ['clickPatterns', 'pageViews', 'searchHistory'],
        retention: '2 years',
        legalBasis: 'Legitimate interest - Service improvement',
      },
      technical_data: {
        name: 'Datos Técnicos',
        description: 'Información técnica del dispositivo y navegador',
        fields: ['ipAddress', 'userAgent', 'deviceInfo'],
        retention: '1 year',
        legalBasis: 'Legitimate interest - Security',
      },
    },

    // Bases legales para el tratamiento de datos
    legalBases: {
      consent: {
        name: 'Consentimiento',
        description: 'El titular ha dado su consentimiento específico',
        article: 'Article 6 Law 1581/2012',
        requiresConsent: true,
      },
      contract: {
        name: 'Ejecución de Contrato',
        description: 'Necesario para la ejecución de un contrato',
        article: 'Article 6 Law 1581/2012',
        requiresConsent: false,
      },
      legal_obligation: {
        name: 'Obligación Legal',
        description: 'Necesario para cumplir una obligación legal',
        article: 'Legal requirements',
        requiresConsent: false,
      },
      legitimate_interest: {
        name: 'Interés Legítimo',
        description: 'Necesario para fines legítimos de la empresa',
        article: 'Article 6 Law 1581/2012',
        requiresConsent: false,
      },
    },
  },

  // Configuración de consentimientos
  consent: {
    // Tipos de consentimiento disponibles
    types: {
      essential: {
        name: 'Funcionalidad Esencial',
        required: true,
        purpose: 'Funcionamiento básico de la plataforma',
        dataCategories: ['technical_data'],
        retention: '1 year',
      },
      functional: {
        name: 'Funcionalidad Mejorada',
        required: false,
        purpose: 'Mejoras en la experiencia del usuario',
        dataCategories: ['behavioral_data'],
        retention: '2 years',
      },
      analytics: {
        name: 'Analíticas',
        required: false,
        purpose: 'Análisis y mejora del servicio',
        dataCategories: ['behavioral_data', 'technical_data'],
        retention: '2 years',
      },
      marketing: {
        name: 'Marketing',
        required: false,
        purpose: 'Comunicaciones promocionales personalizadas',
        dataCategories: ['contact_data', 'behavioral_data'],
        retention: '3 years',
      },
      social_media: {
        name: 'Redes Sociales',
        required: false,
        purpose: 'Integración con redes sociales',
        dataCategories: ['personal_data', 'behavioral_data'],
        retention: '2 years',
      },
      data_processing: {
        name: 'Procesamiento de Datos',
        required: true,
        purpose: 'Procesamiento necesario para el servicio',
        dataCategories: ['personal_data', 'contact_data'],
        retention: '5 years',
      },
      third_party_sharing: {
        name: 'Compartir con Terceros',
        required: false,
        purpose: 'Compartir datos con socios de confianza',
        dataCategories: ['personal_data', 'contact_data'],
        retention: '3 years',
      },
    },

    // Configuración de expiración de consentimientos
    expiration: {
      defaultPeriod: '2 years',
      warningBeforeExpiry: '30 days',
      automaticRenewal: false,
    },
  },

  // Configuración de derechos del titular
  dataRights: {
    // Tipos de derechos disponibles
    types: {
      access: {
        name: 'Derecho de Acceso',
        description: 'Conocer qué datos personales se procesan',
        maxResponseTime: '15 días hábiles',
        requiresVerification: true,
      },
      rectification: {
        name: 'Derecho de Rectificación',
        description: 'Corregir datos personales inexactos',
        maxResponseTime: '15 días hábiles',
        requiresVerification: true,
      },
      cancellation: {
        name: 'Derecho de Cancelación',
        description: 'Eliminar datos personales',
        maxResponseTime: '15 días hábiles',
        requiresVerification: true,
      },
      opposition: {
        name: 'Derecho de Oposición',
        description: 'Oponerse al tratamiento de datos',
        maxResponseTime: '15 días hábiles',
        requiresVerification: true,
      },
      portability: {
        name: 'Portabilidad de Datos',
        description: 'Recibir datos en formato estructurado',
        maxResponseTime: '30 días hábiles',
        requiresVerification: true,
      },
      restriction: {
        name: 'Restricción del Tratamiento',
        description: 'Limitar el procesamiento de datos',
        maxResponseTime: '15 días hábiles',
        requiresVerification: true,
      },
      revoke_consent: {
        name: 'Revocación del Consentimiento',
        description: 'Retirar el consentimiento otorgado',
        maxResponseTime: '5 días hábiles',
        requiresVerification: false,
      },
    },

    // Configuración de verificación de identidad
    verification: {
      requiredDocuments: ['cedula', 'passport', 'license'],
      verificationMethods: ['document_upload', 'email_verification', 'phone_verification'],
      maxAttempts: 3,
      verificationExpiry: '7 days',
    },
  },

  // URLs y endpoints importantes
  endpoints: {
    audit: '/api/compliance/audit',
    consent: '/api/compliance/consent',
    dataRights: '/api/compliance/data-rights',
    security: '/api/compliance/security',
  },

  // Configuración del entorno
  environment: {
    production: {
      logLevel: 'error',
      debugMode: false,
      strictMode: true,
    },
    staging: {
      logLevel: 'warn',
      debugMode: true,
      strictMode: true,
    },
    development: {
      logLevel: 'debug',
      debugMode: true,
      strictMode: false,
    },
  },
} as const;

// Función helper para obtener configuración específica del entorno
export function getEnvironmentConfig() {
  const env = import.meta.env.MODE as keyof typeof securityConfig.environment;
  return securityConfig.environment[env] || securityConfig.environment.development;
}

// Función helper para verificar si un evento es crítico
export function isCriticalEvent(eventType: string): boolean {
  return securityConfig.audit.criticalEvents.includes(eventType);
}

// Función helper para obtener la severidad automática de un evento
export function getAutoSeverity(eventType: string): 'low' | 'medium' | 'high' | 'critical' {
  for (const [severity, events] of Object.entries(securityConfig.audit.autoSeverity)) {
    if (events.includes(eventType)) {
      return severity as 'low' | 'medium' | 'high' | 'critical';
    }
  }
  return 'low'; // Severidad por defecto
}