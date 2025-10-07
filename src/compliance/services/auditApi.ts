const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type AuditEventType =
  | 'data_access'           // Acceso a datos personales
  | 'data_modification'     // Modificación de datos
  | 'data_deletion'         // Eliminación de datos
  | 'consent_granted'       // Consentimiento otorgado
  | 'consent_revoked'       // Consentimiento revocado
  | 'policy_view'           // Visualización de políticas
  | 'right_exercised'       // Ejercicio de derechos
  | 'data_export'           // Exportación de datos
  | 'login_attempt'         // Intento de inicio de sesión
  | 'security_incident'     // Incidente de seguridad
  | 'data_breach'           // Violación de datos
  | 'third_party_share'     // Compartir con terceros
  | 'automated_processing'  // Procesamiento automatizado
  | 'data_transfer';        // Transferencia internacional

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AuditCategory = 'privacy' | 'security' | 'compliance' | 'operational' | 'legal';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  category: AuditCategory;
  severity: AuditSeverity;

  // Información del evento
  timestamp: string;
  description: string;
  details: Record<string, any>;

  // Información del usuario
  userId?: string;
  userEmail?: string;
  sessionId?: string;

  // Información técnica
  ipAddress: string;
  userAgent: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;

  // Información de datos
  dataCategories?: string[];
  dataFields?: string[];
  dataVolume?: number;

  // Información legal
  legalBasis?: string;
  consentRequired?: boolean;
  consentStatus?: 'granted' | 'not_required' | 'missing' | 'expired';

  // Información de terceros
  thirdPartyInvolved?: string;
  transferCountry?: string;

  // Metadatos
  source: string;
  environment: 'production' | 'staging' | 'development';
  correlationId?: string;

  // Retención y eliminación
  retentionPeriod: string;
  shouldAutoDelete: boolean;
  deletionDate?: string;
}

export interface AuditQuery {
  // Filtros temporales
  fromDate?: string;
  toDate?: string;

  // Filtros por tipo
  eventTypes?: AuditEventType[];
  categories?: AuditCategory[];
  severities?: AuditSeverity[];

  // Filtros por usuario
  userId?: string;
  userEmail?: string;

  // Filtros técnicos
  ipAddress?: string;
  endpoint?: string;
  statusCodes?: number[];

  // Filtros de datos
  dataCategories?: string[];

  // Filtros legales
  legalBasis?: string[];
  consentStatus?: string[];

  // Paginación y ordenación
  page?: number;
  pageSize?: number;
  sortBy?: keyof AuditEvent;
  sortOrder?: 'asc' | 'desc';

  // Búsqueda
  searchTerm?: string;
}

export interface AuditReport {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  query: AuditQuery;

  // Resumen
  summary: {
    totalEvents: number;
    dateRange: { from: string; to: string };
    uniqueUsers: number;
    uniqueIPs: number;
    eventsByType: Record<AuditEventType, number>;
    eventsByCategory: Record<AuditCategory, number>;
    eventsBySeverity: Record<AuditSeverity, number>;
  };

  // Análisis de cumplimiento
  compliance: {
    dataAccessCompliance: number;
    consentCompliance: number;
    retentionCompliance: number;
    securityIncidents: number;
    potentialIssues: string[];
  };

  // Recomendaciones
  recommendations: {
    type: 'security' | 'privacy' | 'compliance' | 'operational';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    action: string;
  }[];

  // Archivos del reporte
  files: {
    format: 'pdf' | 'xlsx' | 'csv' | 'json';
    downloadUrl: string;
    expiresAt: string;
  }[];
}

export interface SecurityAlert {
  id: string;
  alertType: 'data_breach' | 'unauthorized_access' | 'suspicious_activity' | 'policy_violation';
  severity: AuditSeverity;
  title: string;
  description: string;

  // Eventos relacionados
  relatedEvents: string[];
  affectedUsers: string[];
  affectedData: string[];

  // Estado
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;

  // Acciones tomadas
  actions: {
    action: string;
    takenBy: string;
    takenAt: string;
    result: string;
  }[];

  // Notificaciones
  notificationsSent: {
    recipient: string;
    type: 'email' | 'sms' | 'internal';
    sentAt: string;
  }[];
}

export interface PrivacyMetrics {
  // Métricas de consentimiento
  consentMetrics: {
    totalConsents: number;
    activeConsents: number;
    revokedConsents: number;
    expiredConsents: number;
    consentRate: number;
  };

  // Métricas de derechos
  rightsMetrics: {
    totalRequests: number;
    accessRequests: number;
    rectificationRequests: number;
    deletionRequests: number;
    averageResponseTime: number;
    complianceRate: number;
  };

  // Métricas de datos
  dataMetrics: {
    totalDataSubjects: number;
    activeDataSubjects: number;
    dataCategories: number;
    dataRetentionCompliance: number;
  };

  // Métricas de seguridad
  securityMetrics: {
    securityIncidents: number;
    dataBreaches: number;
    unauthorizedAccess: number;
    suspiciousActivities: number;
  };
}

class AuditApi {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('wildtour-token');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}/compliance/audit${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Registrar un evento de auditoría
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<{ success: boolean; eventId: string }> {
    try {
      const eventData = {
        ...event,
        timestamp: new Date().toISOString(),
        ipAddress: event.ipAddress || await this.getClientIP(),
        userAgent: event.userAgent || navigator.userAgent,
      };

      return await this.makeRequest('/log', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  }

  /**
   * Buscar eventos de auditoría
   */
  async searchEvents(query: AuditQuery): Promise<{
    events: AuditEvent[];
    totalCount: number;
    page: number;
    pageSize: number;
  }> {
    try {
      return await this.makeRequest('/search', {
        method: 'POST',
        body: JSON.stringify(query),
      });
    } catch (error) {
      console.error('Error searching audit events:', error);
      throw error;
    }
  }

  /**
   * Obtener un evento específico
   */
  async getEvent(eventId: string): Promise<AuditEvent> {
    try {
      return await this.makeRequest(`/event/${eventId}`);
    } catch (error) {
      console.error('Error fetching audit event:', error);
      throw error;
    }
  }

  /**
   * Generar reporte de auditoría
   */
  async generateReport(
    query: AuditQuery,
    options: {
      includeDetails?: boolean;
      includeCompliance?: boolean;
      includeRecommendations?: boolean;
      formats?: ('pdf' | 'xlsx' | 'csv' | 'json')[];
    } = {}
  ): Promise<AuditReport> {
    try {
      return await this.makeRequest('/report', {
        method: 'POST',
        body: JSON.stringify({
          query,
          options: {
            includeDetails: true,
            includeCompliance: true,
            includeRecommendations: true,
            formats: ['pdf', 'xlsx'],
            ...options,
          },
          generatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error generating audit report:', error);
      throw error;
    }
  }

  /**
   * Obtener métricas de privacidad
   */
  async getPrivacyMetrics(
    dateRange: { from: string; to: string }
  ): Promise<PrivacyMetrics> {
    try {
      const params = new URLSearchParams({
        from: dateRange.from,
        to: dateRange.to,
      });

      return await this.makeRequest(`/metrics?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching privacy metrics:', error);
      throw error;
    }
  }

  /**
   * Obtener alertas de seguridad activas
   */
  async getSecurityAlerts(
    options: {
      severity?: AuditSeverity[];
      status?: SecurityAlert['status'][];
      limit?: number;
    } = {}
  ): Promise<SecurityAlert[]> {
    try {
      return await this.makeRequest('/security-alerts', {
        method: 'POST',
        body: JSON.stringify(options),
      });
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      throw error;
    }
  }

  /**
   * Crear alerta de seguridad
   */
  async createSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'createdAt' | 'status' | 'actions' | 'notificationsSent'>): Promise<{
    success: boolean;
    alertId: string;
  }> {
    try {
      return await this.makeRequest('/security-alerts', {
        method: 'POST',
        body: JSON.stringify({
          ...alert,
          createdAt: new Date().toISOString(),
          status: 'open',
        }),
      });
    } catch (error) {
      console.error('Error creating security alert:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de alerta de seguridad
   */
  async updateSecurityAlert(
    alertId: string,
    update: {
      status?: SecurityAlert['status'];
      action?: string;
      result?: string;
    }
  ): Promise<{ success: boolean }> {
    try {
      return await this.makeRequest(`/security-alerts/${alertId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...update,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error updating security alert:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos por usuario específico
   */
  async getUserEvents(
    userId: string,
    options: {
      eventTypes?: AuditEventType[];
      fromDate?: string;
      toDate?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{
    events: AuditEvent[];
    totalCount: number;
    summary: {
      firstActivity: string;
      lastActivity: string;
      totalSessions: number;
      dataAccessed: string[];
      rightsExercised: number;
    };
  }> {
    try {
      const query: AuditQuery = {
        userId,
        ...options,
      };

      return await this.makeRequest('/user-events', {
        method: 'POST',
        body: JSON.stringify(query),
      });
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  /**
   * Detectar actividad sospechosa
   */
  async detectSuspiciousActivity(
    options: {
      timeWindow?: string; // '1h', '24h', '7d'
      thresholds?: {
        maxLoginAttempts?: number;
        maxDataAccess?: number;
        unusualIPCount?: number;
        offHoursActivity?: boolean;
      };
    } = {}
  ): Promise<{
    suspiciousUsers: {
      userId: string;
      riskScore: number;
      indicators: string[];
      events: AuditEvent[];
    }[];
    suspiciousIPs: {
      ipAddress: string;
      riskScore: number;
      indicators: string[];
      events: AuditEvent[];
    }[];
  }> {
    try {
      return await this.makeRequest('/detect-suspicious', {
        method: 'POST',
        body: JSON.stringify(options),
      });
    } catch (error) {
      console.error('Error detecting suspicious activity:', error);
      throw error;
    }
  }

  /**
   * Verificar cumplimiento de retención de datos
   */
  async checkRetentionCompliance(): Promise<{
    complianceRate: number;
    expiredData: {
      category: string;
      count: number;
      oldestRecord: string;
      retentionPeriod: string;
    }[];
    upcomingExpirations: {
      category: string;
      count: number;
      expirationDate: string;
    }[];
    recommendedActions: string[];
  }> {
    try {
      return await this.makeRequest('/retention-compliance');
    } catch (error) {
      console.error('Error checking retention compliance:', error);
      throw error;
    }
  }

  /**
   * Exportar logs de auditoría
   */
  async exportLogs(
    query: AuditQuery,
    format: 'json' | 'csv' | 'xlsx' = 'json'
  ): Promise<{
    exportId: string;
    downloadUrl: string;
    expiresAt: string;
    recordCount: number;
  }> {
    try {
      return await this.makeRequest('/export', {
        method: 'POST',
        body: JSON.stringify({
          query,
          format,
          exportedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  }

  /**
   * Eliminar eventos de auditoría expirados
   */
  async cleanupExpiredEvents(): Promise<{
    deletedCount: number;
    categoriesCleaned: string[];
    nextCleanupDate: string;
  }> {
    try {
      return await this.makeRequest('/cleanup', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error cleaning up expired events:', error);
      throw error;
    }
  }

  /**
   * Verificar integridad de los logs
   */
  async verifyLogIntegrity(
    dateRange: { from: string; to: string }
  ): Promise<{
    isIntact: boolean;
    checksumValid: boolean;
    missingEvents: number;
    tamperedEvents: string[];
    lastVerification: string;
  }> {
    try {
      return await this.makeRequest('/verify-integrity', {
        method: 'POST',
        body: JSON.stringify(dateRange),
      });
    } catch (error) {
      console.error('Error verifying log integrity:', error);
      throw error;
    }
  }

  /**
   * Configurar alertas automáticas
   */
  async configureAlerts(config: {
    rules: {
      name: string;
      condition: {
        eventType?: AuditEventType;
        severity?: AuditSeverity;
        threshold?: number;
        timeWindow?: string;
      };
      actions: {
        email?: string[];
        webhook?: string;
        createAlert?: boolean;
      };
    }[];
  }): Promise<{ success: boolean; configId: string }> {
    try {
      return await this.makeRequest('/configure-alerts', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    } catch (error) {
      console.error('Error configuring alerts:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de rendimiento del sistema de auditoría
   */
  async getSystemStats(): Promise<{
    totalEvents: number;
    eventsToday: number;
    averageEventsPerDay: number;
    storageUsed: string;
    oldestEvent: string;
    systemHealth: 'healthy' | 'warning' | 'critical';
    performanceMetrics: {
      averageLogTime: number;
      averageQueryTime: number;
      errorRate: number;
    };
  }> {
    try {
      return await this.makeRequest('/system-stats');
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }

  /**
   * Obtener IP del cliente
   */
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not fetch client IP:', error);
      return 'unknown';
    }
  }
}

export const auditApi = new AuditApi();