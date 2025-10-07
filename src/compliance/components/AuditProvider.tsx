import React, { createContext, useContext, useEffect } from 'react';
import { useAuditLogger } from '../hooks/useAuditLogger';
import { useAuthStore } from '../../application/state/useAuthStore';
import { useConsentStore } from '../stores/useConsentStore';

interface AuditContextType {
  logDataAccess: (options: {
    description: string;
    dataCategories: string[];
    dataFields?: string[];
    legalBasis: string;
    endpoint?: string;
  }) => Promise<void>;

  logDataModification: (options: {
    description: string;
    dataCategories: string[];
    dataFields: string[];
    legalBasis: string;
    endpoint?: string;
  }) => Promise<void>;

  logConsentAction: (options: {
    action: 'granted' | 'revoked';
    consentType: string;
    details?: Record<string, any>;
  }) => Promise<void>;

  logRightExercised: (options: {
    rightType: string;
    description: string;
    details?: Record<string, any>;
  }) => Promise<void>;

  logSecurityEvent: (options: {
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details?: Record<string, any>;
    endpoint?: string;
  }) => Promise<void>;

  logPolicyView: (options: {
    policyType: string;
    version?: string;
    language?: string;
  }) => Promise<void>;

  logDataExport: (options: {
    dataCategories: string[];
    format: string;
    requestType: string;
    details?: Record<string, any>;
  }) => Promise<void>;
}

const AuditContext = createContext<AuditContextType | null>(null);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const auditLogger = useAuditLogger();
  const { user } = useAuthStore();
  const { preferences, consentRecords } = useConsentStore();

  // Monitorear cambios de consentimiento
  useEffect(() => {
    if (!preferences) return;

    const consentTypes = Object.keys(preferences);

    consentTypes.forEach(async (consentType) => {
      // Buscar el registro más reciente para este tipo de consentimiento
      const latestRecord = consentRecords
        ?.filter(record => record.type === consentType)
        ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      if (latestRecord && latestRecord.timestamp) {
        // Solo loggear si el consentimiento fue modificado recientemente (últimos 5 segundos)
        const timeDiff = Date.now() - new Date(latestRecord.timestamp).getTime();

        if (timeDiff < 5000) {
          await auditLogger.logConsentAction({
            action: latestRecord.granted ? 'granted' : 'revoked',
            consentType,
            details: {
              recordId: latestRecord.id,
              version: latestRecord.version,
              source: latestRecord.source,
              ipAddress: latestRecord.ipAddress,
              userAgent: latestRecord.userAgent,
            },
          });
        }
      }
    });
  }, [preferences, consentRecords, auditLogger]);

  // Monitorear eventos de seguridad automáticamente
  useEffect(() => {
    // Detectar cambios sospechosos en el localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      if (key.includes('token') || key.includes('auth')) {
        auditLogger.logSecurityEvent({
          description: `LocalStorage modification detected: ${key}`,
          severity: 'medium',
          details: {
            key,
            action: 'setItem',
            timestamp: new Date().toISOString(),
          },
        });
      }
      return originalSetItem.call(this, key, value);
    };

    // Detectar intentos de acceso a datos sensibles en el DOM
    const sensitiveSelectors = [
      'input[type="password"]',
      'input[name*="credit"]',
      'input[name*="card"]',
      'input[name*="ssn"]',
      'input[name*="document"]',
    ];

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          sensitiveSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              auditLogger.logSecurityEvent({
                description: `Sensitive form field detected: ${selector}`,
                severity: 'low',
                details: {
                  selector,
                  count: elements.length,
                  timestamp: new Date().toISOString(),
                },
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      localStorage.setItem = originalSetItem;
      observer.disconnect();
    };
  }, [auditLogger]);

  // Detectar errores JavaScript
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      auditLogger.logSecurityEvent({
        description: `JavaScript error detected: ${event.message}`,
        severity: 'medium',
        details: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date().toISOString(),
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      auditLogger.logSecurityEvent({
        description: `Unhandled promise rejection: ${event.reason}`,
        severity: 'medium',
        details: {
          reason: event.reason,
          timestamp: new Date().toISOString(),
        },
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [auditLogger]);

  const contextValue: AuditContextType = {
    logDataAccess: auditLogger.logDataAccess,
    logDataModification: auditLogger.logDataModification,
    logConsentAction: auditLogger.logConsentAction,
    logRightExercised: auditLogger.logRightExercised,
    logSecurityEvent: auditLogger.logSecurityEvent,
    logPolicyView: auditLogger.logPolicyView,
    logDataExport: auditLogger.logDataExport,
  };

  return (
    <AuditContext.Provider value={contextValue}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}