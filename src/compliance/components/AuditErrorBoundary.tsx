import React, { Component, ErrorInfo, ReactNode } from 'react';
import { auditApi } from '../services/auditApi';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AuditErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log del error para auditoría
    try {
      await auditApi.logEvent({
        eventType: 'security_incident',
        category: 'security',
        severity: 'high',
        description: `React Error Boundary caught error: ${error.name}`,
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorBoundary: 'AuditErrorBoundary',
          timestamp: new Date().toISOString(),
        },
        ipAddress: '',
        userAgent: navigator.userAgent,
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '7 years',
        shouldAutoDelete: true,
        consentRequired: false,
      });

      // Log adicional si es un error de seguridad potencial
      const securityKeywords = ['unauthorized', 'token', 'permission', 'forbidden', 'csrf', 'xss'];
      const isSecurityRelated = securityKeywords.some(keyword =>
        error.message.toLowerCase().includes(keyword) ||
        error.stack?.toLowerCase().includes(keyword)
      );

      if (isSecurityRelated) {
        await auditApi.logEvent({
          eventType: 'security_incident',
          category: 'security',
          severity: 'critical',
          description: 'Potential security-related error detected',
          details: {
            errorType: 'security_related',
            originalError: error.message,
            detectedKeywords: securityKeywords.filter(keyword =>
              error.message.toLowerCase().includes(keyword) ||
              error.stack?.toLowerCase().includes(keyword)
            ),
            requiresInvestigation: true,
          },
          ipAddress: '',
          userAgent: navigator.userAgent,
          source: 'wildtour-frontend',
          environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
          retentionPeriod: '7 years',
          shouldAutoDelete: false, // No auto-delete para errores de seguridad
          consentRequired: false,
        });
      }
    } catch (auditError) {
      console.error('Failed to log error to audit system:', auditError);
    }

    // Log al console para desarrollo
    console.error('AuditErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-strong border border-neutral-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Algo salió mal
              </h2>

              <p className="text-neutral-600 mb-6">
                Hemos registrado este error y estamos trabajando para solucionarlo.
                Por favor, recarga la página o intenta nuevamente.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary-500 text-white py-2 px-4 rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Recargar página
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-neutral-200 text-neutral-700 py-2 px-4 rounded-xl hover:bg-neutral-300 transition-colors"
                >
                  Volver atrás
                </button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                    Detalles del error (desarrollo)
                  </summary>
                  <div className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs font-mono overflow-auto max-h-32">
                    <div className="text-secondary-600 font-bold">{this.state.error.name}</div>
                    <div className="text-neutral-700 mb-2">{this.state.error.message}</div>
                    {this.state.error.stack && (
                      <pre className="whitespace-pre-wrap text-neutral-600">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}