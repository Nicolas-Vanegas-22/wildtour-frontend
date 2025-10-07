import { ConsentType, ConsentRecord, ConsentPreferences } from '../stores/useConsentStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ConsentSubmission {
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
  source: 'banner' | 'form' | 'settings' | 'registration';
  timestamp: string;
  policyVersion: string;
  metadata?: Record<string, any>;
}

export interface ConsentUpdateRequest {
  userId: string;
  preferences: Partial<ConsentPreferences>;
  source: ConsentRecord['source'];
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

export interface ConsentHistoryResponse {
  consents: ConsentRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ConsentValidationResponse {
  isValid: boolean;
  expiresAt?: string;
  lastUpdated: string;
  requiresReconfirmation: boolean;
  reason?: string;
}

export interface ConsentAuditResponse {
  consentId: string;
  userId: string;
  auditTrail: {
    id: string;
    action: 'granted' | 'revoked' | 'updated' | 'expired' | 'viewed';
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    details: Record<string, any>;
  }[];
}

class ConsentApi {
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

    const response = await fetch(`${API_BASE_URL}/compliance/consent${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Registrar un nuevo consentimiento
   */
  async submitConsent(submission: ConsentSubmission): Promise<{ success: boolean; consentId: string }> {
    try {
      return await this.makeRequest('/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
    } catch (error) {
      console.error('Error submitting consent:', error);
      throw error;
    }
  }

  /**
   * Actualizar múltiples consentimientos de una vez
   */
  async updateConsents(request: ConsentUpdateRequest): Promise<{ success: boolean; updatedConsents: string[] }> {
    try {
      return await this.makeRequest('/update', {
        method: 'PUT',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Error updating consents:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de consentimientos de un usuario
   */
  async getConsentHistory(
    userId: string,
    options: {
      consentType?: ConsentType;
      page?: number;
      pageSize?: number;
      fromDate?: string;
      toDate?: string;
    } = {}
  ): Promise<ConsentHistoryResponse> {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      if (options.consentType) params.append('type', options.consentType);
      if (options.page) params.append('page', options.page.toString());
      if (options.pageSize) params.append('pageSize', options.pageSize.toString());
      if (options.fromDate) params.append('fromDate', options.fromDate);
      if (options.toDate) params.append('toDate', options.toDate);

      return await this.makeRequest(`/history?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching consent history:', error);
      throw error;
    }
  }

  /**
   * Verificar si un consentimiento específico es válido
   */
  async validateConsent(
    userId: string,
    consentType: ConsentType
  ): Promise<ConsentValidationResponse> {
    try {
      return await this.makeRequest(`/validate?userId=${userId}&type=${consentType}`);
    } catch (error) {
      console.error('Error validating consent:', error);
      throw error;
    }
  }

  /**
   * Revocar un tipo específico de consentimiento
   */
  async revokeConsent(
    userId: string,
    consentType: ConsentType,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; revocationId: string }> {
    try {
      return await this.makeRequest('/revoke', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          consentType,
          timestamp: new Date().toISOString(),
          metadata: {
            ...metadata,
            ipAddress: await this.getClientIP(),
            userAgent: navigator.userAgent,
          },
        }),
      });
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  }

  /**
   * Revocar todos los consentimientos no esenciales
   */
  async revokeAllNonEssentialConsents(
    userId: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; revokedConsents: ConsentType[] }> {
    try {
      return await this.makeRequest('/revoke-all', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          excludeEssential: true,
          timestamp: new Date().toISOString(),
          metadata: {
            ...metadata,
            ipAddress: await this.getClientIP(),
            userAgent: navigator.userAgent,
          },
        }),
      });
    } catch (error) {
      console.error('Error revoking all consents:', error);
      throw error;
    }
  }

  /**
   * Obtener el estado actual de todos los consentimientos
   */
  async getCurrentConsentStatus(userId: string): Promise<ConsentPreferences> {
    try {
      const response = await this.makeRequest<{ preferences: ConsentPreferences }>(`/status?userId=${userId}`);
      return response.preferences;
    } catch (error) {
      console.error('Error fetching consent status:', error);
      throw error;
    }
  }

  /**
   * Exportar todos los datos de consentimiento de un usuario
   */
  async exportConsentData(
    userId: string,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<{ downloadUrl: string; expiresAt: string }> {
    try {
      return await this.makeRequest(`/export?userId=${userId}&format=${format}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error exporting consent data:', error);
      throw error;
    }
  }

  /**
   * Obtener auditoría completa de un consentimiento específico
   */
  async getConsentAudit(
    userId: string,
    consentType: ConsentType
  ): Promise<ConsentAuditResponse> {
    try {
      return await this.makeRequest(`/audit?userId=${userId}&type=${consentType}`);
    } catch (error) {
      console.error('Error fetching consent audit:', error);
      throw error;
    }
  }

  /**
   * Verificar si se requiere renovación de consentimientos
   */
  async checkConsentRenewal(userId: string): Promise<{
    requiresRenewal: boolean;
    expiredConsents: ConsentType[];
    expiringConsents: {
      type: ConsentType;
      expiresAt: string;
      daysRemaining: number;
    }[];
  }> {
    try {
      return await this.makeRequest(`/check-renewal?userId=${userId}`);
    } catch (error) {
      console.error('Error checking consent renewal:', error);
      throw error;
    }
  }

  /**
   * Registrar visualización de política de privacidad
   */
  async recordPolicyView(
    userId: string,
    policyType: 'privacy' | 'terms' | 'cookies',
    policyVersion: string
  ): Promise<{ success: boolean; viewId: string }> {
    try {
      return await this.makeRequest('/policy-view', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          policyType,
          policyVersion,
          timestamp: new Date().toISOString(),
          ipAddress: await this.getClientIP(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Error recording policy view:', error);
      throw error;
    }
  }

  /**
   * Solicitar prueba de consentimiento para fines legales
   */
  async getConsentProof(
    userId: string,
    consentType: ConsentType,
    purpose: string
  ): Promise<{
    proofDocument: string;
    digitalSignature: string;
    issuedAt: string;
    validUntil: string;
  }> {
    try {
      return await this.makeRequest('/proof', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          consentType,
          purpose,
          requestedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error generating consent proof:', error);
      throw error;
    }
  }

  /**
   * Notificar cambios en políticas que requieren nuevo consentimiento
   */
  async notifyPolicyChange(
    userId: string,
    changeType: 'privacy_policy' | 'terms_of_service' | 'cookie_policy',
    newVersion: string,
    requiresNewConsent: boolean
  ): Promise<{ success: boolean; notificationId: string }> {
    try {
      return await this.makeRequest('/policy-change', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          changeType,
          newVersion,
          requiresNewConsent,
          notifiedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error notifying policy change:', error);
      throw error;
    }
  }

  /**
   * Verificar cumplimiento de retención de datos
   */
  async checkDataRetentionCompliance(
    userId: string
  ): Promise<{
    isCompliant: boolean;
    expiredData: {
      category: string;
      retentionPeriod: string;
      expiredAt: string;
      action: 'delete' | 'anonymize' | 'archive';
    }[];
    nextExpirations: {
      category: string;
      expiresAt: string;
      daysRemaining: number;
    }[];
  }> {
    try {
      return await this.makeRequest(`/retention-compliance?userId=${userId}`);
    } catch (error) {
      console.error('Error checking retention compliance:', error);
      throw error;
    }
  }

  /**
   * Obtener IP del cliente para auditoría (usando servicio externo)
   */
  private async getClientIP(): Promise<string> {
    try {
      // En producción, esto se haría desde el backend por seguridad
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not fetch client IP:', error);
      return 'unknown';
    }
  }

  /**
   * Obtener estadísticas de consentimientos para administradores
   */
  async getConsentStatistics(
    dateRange: { from: string; to: string },
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    totalConsents: number;
    consentsByType: Record<ConsentType, number>;
    consentTrends: {
      date: string;
      granted: number;
      revoked: number;
    }[];
    complianceRate: number;
  }> {
    try {
      const params = new URLSearchParams({
        from: dateRange.from,
        to: dateRange.to,
        groupBy,
      });

      return await this.makeRequest(`/statistics?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching consent statistics:', error);
      throw error;
    }
  }

  /**
   * Programar eliminación automática de datos
   */
  async scheduleDataDeletion(
    userId: string,
    deletionDate: string,
    reason: string
  ): Promise<{ success: boolean; scheduledDeletionId: string }> {
    try {
      return await this.makeRequest('/schedule-deletion', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          deletionDate,
          reason,
          scheduledAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error scheduling data deletion:', error);
      throw error;
    }
  }
}

export const consentApi = new ConsentApi();