import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../../application/state/useAuthStore';
import { auditApi, type AuditEventType, type AuditCategory, type AuditSeverity } from '../services/auditApi';

interface AuditLogOptions {
  category: AuditCategory;
  severity?: AuditSeverity;
  description: string;
  details?: Record<string, any>;
  dataCategories?: string[];
  dataFields?: string[];
  legalBasis?: string;
  consentRequired?: boolean;
  endpoint?: string;
  method?: string;
}

export function useAuditLogger() {
  const { user } = useAuthStore();

  const logEvent = useCallback(async (
    eventType: AuditEventType,
    options: AuditLogOptions
  ) => {
    try {
      await auditApi.logEvent({
        eventType,
        category: options.category,
        severity: options.severity || 'low',
        description: options.description,
        details: options.details || {},

        userId: user?.id,
        userEmail: user?.email,
        sessionId: sessionStorage.getItem('session-id') || undefined,

        ipAddress: '', // Will be filled by API
        userAgent: navigator.userAgent,
        endpoint: options.endpoint,
        method: options.method,

        dataCategories: options.dataCategories,
        dataFields: options.dataFields,

        legalBasis: options.legalBasis,
        consentRequired: options.consentRequired,
        consentStatus: options.consentRequired ? 'granted' : 'not_required',

        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',

        retentionPeriod: getRetentionPeriod(options.category),
        shouldAutoDelete: true,
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // No lanzar error para no afectar la funcionalidad principal
    }
  }, [user]);

  // Funciones específicas para diferentes tipos de eventos
  const logDataAccess = useCallback((options: {
    description: string;
    dataCategories: string[];
    dataFields?: string[];
    legalBasis: string;
    endpoint?: string;
  }) => {
    return logEvent('data_access', {
      category: 'privacy',
      severity: 'medium',
      ...options,
      consentRequired: true,
    });
  }, [logEvent]);

  const logDataModification = useCallback((options: {
    description: string;
    dataCategories: string[];
    dataFields: string[];
    legalBasis: string;
    endpoint?: string;
  }) => {
    return logEvent('data_modification', {
      category: 'privacy',
      severity: 'medium',
      ...options,
      consentRequired: true,
    });
  }, [logEvent]);

  const logConsentAction = useCallback((options: {
    action: 'granted' | 'revoked';
    consentType: string;
    details?: Record<string, any>;
  }) => {
    return logEvent(
      options.action === 'granted' ? 'consent_granted' : 'consent_revoked',
      {
        category: 'compliance',
        severity: 'medium',
        description: `Consent ${options.action} for ${options.consentType}`,
        details: options.details,
        legalBasis: 'Article 9 Law 1581/2012',
        consentRequired: false,
      }
    );
  }, [logEvent]);

  const logRightExercised = useCallback((options: {
    rightType: string;
    description: string;
    details?: Record<string, any>;
  }) => {
    return logEvent('right_exercised', {
      category: 'legal',
      severity: 'high',
      description: options.description,
      details: options.details,
      legalBasis: 'Article 8 Law 1581/2012',
      consentRequired: false,
    });
  }, [logEvent]);

  const logSecurityEvent = useCallback((options: {
    description: string;
    severity: AuditSeverity;
    details?: Record<string, any>;
    endpoint?: string;
  }) => {
    return logEvent('security_incident', {
      category: 'security',
      severity: options.severity,
      description: options.description,
      details: options.details,
      endpoint: options.endpoint,
      consentRequired: false,
    });
  }, [logEvent]);

  const logLoginAttempt = useCallback((options: {
    success: boolean;
    email?: string;
    reason?: string;
    details?: Record<string, any>;
  }) => {
    return logEvent('login_attempt', {
      category: 'security',
      severity: options.success ? 'low' : 'medium',
      description: `Login attempt ${options.success ? 'successful' : 'failed'}${options.email ? ` for ${options.email}` : ''}`,
      details: {
        success: options.success,
        email: options.email,
        reason: options.reason,
        ...options.details,
      },
      endpoint: '/auth/login',
      method: 'POST',
      consentRequired: false,
    });
  }, [logEvent]);

  const logPolicyView = useCallback((options: {
    policyType: string;
    version?: string;
    language?: string;
  }) => {
    return logEvent('policy_view', {
      category: 'compliance',
      severity: 'low',
      description: `Policy viewed: ${options.policyType}`,
      details: {
        policyType: options.policyType,
        version: options.version,
        language: options.language,
      },
      consentRequired: false,
    });
  }, [logEvent]);

  const logDataExport = useCallback((options: {
    dataCategories: string[];
    format: string;
    requestType: string;
    details?: Record<string, any>;
  }) => {
    return logEvent('data_export', {
      category: 'privacy',
      severity: 'high',
      description: `Data export requested - ${options.requestType}`,
      details: options.details,
      dataCategories: options.dataCategories,
      legalBasis: 'Article 8 Law 1581/2012 - Right of Access',
      consentRequired: false,
    });
  }, [logEvent]);

  const logThirdPartyShare = useCallback((options: {
    thirdParty: string;
    dataCategories: string[];
    purpose: string;
    country?: string;
    legalBasis: string;
  }) => {
    return logEvent('third_party_share', {
      category: 'privacy',
      severity: 'high',
      description: `Data shared with third party: ${options.thirdParty}`,
      details: {
        thirdParty: options.thirdParty,
        purpose: options.purpose,
        country: options.country,
      },
      dataCategories: options.dataCategories,
      legalBasis: options.legalBasis,
      consentRequired: true,
    });
  }, [logEvent]);

  // Hook para registrar automáticamente cambios de página
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;

      // Solo registrar páginas con datos sensibles
      const sensitivePages = [
        '/perfil',
        '/mis-reservas',
        '/configuracion',
        '/privacy-center',
        '/data-rights',
        '/admin',
      ];

      if (sensitivePages.some(page => path.startsWith(page))) {
        logEvent('data_access', {
          category: 'privacy',
          severity: 'low',
          description: `Accessed sensitive page: ${path}`,
          details: { page: path },
          endpoint: path,
          method: 'GET',
          dataCategories: ['personal_data'],
          legalBasis: 'Legitimate interest - Service provision',
          consentRequired: true,
        });
      }
    };

    // Registrar la página actual al montar
    handleLocationChange();

    // Escuchar cambios de navegación
    window.addEventListener('popstate', handleLocationChange);

    // Para aplicaciones SPA, también interceptar pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleLocationChange, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleLocationChange, 0);
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [logEvent]);

  return {
    logEvent,
    logDataAccess,
    logDataModification,
    logConsentAction,
    logRightExercised,
    logSecurityEvent,
    logLoginAttempt,
    logPolicyView,
    logDataExport,
    logThirdPartyShare,
  };
}

function getRetentionPeriod(category: AuditCategory): string {
  switch (category) {
    case 'security':
      return '7 years'; // Requerimiento legal para logs de seguridad
    case 'legal':
      return '10 years'; // Requerimiento legal para ejercicio de derechos
    case 'privacy':
      return '5 years'; // Requerimiento RGPD/Ley 1581
    case 'compliance':
      return '5 years'; // Requerimiento RGPD/Ley 1581
    case 'operational':
      return '2 years'; // Logs operacionales
    default:
      return '2 years';
  }
}