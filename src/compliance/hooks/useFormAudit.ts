import { useCallback } from 'react';
import { useAudit } from '../components/AuditProvider';

interface FormAuditOptions {
  formName: string;
  dataCategories: string[];
  legalBasis: string;
  retentionPeriod?: string;
}

export function useFormAudit(options: FormAuditOptions) {
  const audit = useAudit();

  const logFormStart = useCallback(() => {
    return audit.logDataAccess({
      description: `Form started: ${options.formName}`,
      dataCategories: options.dataCategories,
      legalBasis: options.legalBasis,
    });
  }, [audit, options]);

  const logFormSubmit = useCallback((formData: Record<string, any>) => {
    const sensitiveFields = ['password', 'card', 'ssn', 'document', 'phone'];
    const dataFields = Object.keys(formData).filter(field =>
      !sensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive))
    );

    return audit.logDataModification({
      description: `Form submitted: ${options.formName}`,
      dataCategories: options.dataCategories,
      dataFields,
      legalBasis: options.legalBasis,
    });
  }, [audit, options]);

  const logFormError = useCallback((error: string, fieldName?: string) => {
    return audit.logSecurityEvent({
      description: `Form error in ${options.formName}`,
      severity: 'low',
      details: {
        error,
        fieldName,
        formName: options.formName,
        timestamp: new Date().toISOString(),
      },
    });
  }, [audit, options]);

  const logFieldAccess = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    // Solo loggear campos sensibles
    const sensitiveFields = ['password', 'card', 'ssn', 'document', 'email', 'phone'];
    const isSensitive = sensitiveFields.some(sensitive =>
      fieldName.toLowerCase().includes(sensitive)
    );

    if (isSensitive) {
      return audit.logDataAccess({
        description: `Sensitive field ${action}: ${fieldName} in ${options.formName}`,
        dataCategories: ['personal_data'],
        dataFields: [fieldName],
        legalBasis: options.legalBasis,
      });
    }

    return Promise.resolve();
  }, [audit, options]);

  const logFormValidation = useCallback((validationErrors: Record<string, string[]>) => {
    const errorCount = Object.keys(validationErrors).length;

    if (errorCount > 0) {
      return audit.logSecurityEvent({
        description: `Form validation errors in ${options.formName}`,
        severity: 'low',
        details: {
          errorCount,
          fields: Object.keys(validationErrors),
          formName: options.formName,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return Promise.resolve();
  }, [audit, options]);

  return {
    logFormStart,
    logFormSubmit,
    logFormError,
    logFieldAccess,
    logFormValidation,
  };
}