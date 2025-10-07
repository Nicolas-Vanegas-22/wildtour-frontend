const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type DataRightType =
  | 'access'           // Acceso - Art. 8 y 13 Ley 1581/2012
  | 'rectification'    // Rectificación - Art. 8 y 14 Ley 1581/2012
  | 'cancellation'     // Cancelación - Art. 8 y 14 Ley 1581/2012
  | 'opposition'       // Oposición - Art. 8 y 14 Ley 1581/2012
  | 'portability'      // Portabilidad - Art. 8 y 13 Ley 1581/2012
  | 'revocation'       // Revocación - Art. 8 y 15 Ley 1581/2012
  | 'complaint';       // Queja - Art. 8 y 14 Ley 1581/2012

export type RequestStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'expired';

export type RequestUrgency = 'low' | 'medium' | 'high';

export interface DataRightRequest {
  id?: string;
  userId: string;
  type: DataRightType;
  title: string;
  description: string;
  details: string;
  urgency: RequestUrgency;
  legalBasis: string;
  requestedAction: string;
  additionalInfo?: string;

  // Documentos de soporte
  documents?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadPath: string;
    uploadedAt: string;
  }[];

  // Metadatos de la solicitud
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;

  // Estado y seguimiento
  status: RequestStatus;
  expectedResponseDate: string;
  actualResponseDate?: string;

  // Respuesta y resolución
  response?: {
    message: string;
    resolution: string;
    attachments?: string[];
    respondedBy: string;
    respondedAt: string;
  };

  // Cumplimiento legal
  legalCompliance: {
    article: string;
    timeframe: string;
    isUrgent: boolean;
    requiresVerification: boolean;
  };
}

export interface DataAccessResponse {
  personalData: {
    category: string;
    data: Record<string, any>;
    source: string;
    collectedAt: string;
    lastUpdated: string;
    retention: string;
    purposes: string[];
  }[];
  dataSources: string[];
  thirdPartyShares: {
    recipient: string;
    dataShared: string[];
    purpose: string;
    legalBasis: string;
    transferDate: string;
  }[];
  dataRetention: {
    category: string;
    retentionPeriod: string;
    deletionDate?: string;
    reason: string;
  }[];
}

export interface DataExportResponse {
  exportId: string;
  format: 'json' | 'csv' | 'pdf' | 'xml';
  downloadUrl: string;
  expiresAt: string;
  fileSize: number;
  checksum: string;
  encryptionKey?: string;
}

export interface RequestStatistics {
  totalRequests: number;
  requestsByType: Record<DataRightType, number>;
  requestsByStatus: Record<RequestStatus, number>;
  averageResponseTime: number;
  complianceRate: number;
  urgentRequests: number;
}

class DataRightsApi {
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

    const response = await fetch(`${API_BASE_URL}/compliance/data-rights${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Enviar una nueva solicitud de derechos
   */
  async submitRequest(request: Omit<DataRightRequest, 'id' | 'submittedAt' | 'status' | 'expectedResponseDate'>): Promise<{
    success: boolean;
    requestId: string;
    expectedResponseDate: string;
    trackingNumber: string;
  }> {
    try {
      const submissionData = {
        ...request,
        submittedAt: new Date().toISOString(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
      };

      return await this.makeRequest('/submit', {
        method: 'POST',
        body: JSON.stringify(submissionData),
      });
    } catch (error) {
      console.error('Error submitting data rights request:', error);
      throw error;
    }
  }

  /**
   * Obtener el estado de una solicitud específica
   */
  async getRequestStatus(requestId: string): Promise<DataRightRequest> {
    try {
      return await this.makeRequest(`/request/${requestId}`);
    } catch (error) {
      console.error('Error fetching request status:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes de un usuario
   */
  async getUserRequests(
    userId: string,
    options: {
      status?: RequestStatus;
      type?: DataRightType;
      page?: number;
      pageSize?: number;
      sortBy?: 'submittedAt' | 'expectedResponseDate' | 'urgency';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    requests: DataRightRequest[];
    totalCount: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      if (options.status) params.append('status', options.status);
      if (options.type) params.append('type', options.type);
      if (options.page) params.append('page', options.page.toString());
      if (options.pageSize) params.append('pageSize', options.pageSize.toString());
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      return await this.makeRequest(`/user-requests?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  }

  /**
   * Procesar solicitud de acceso a datos
   */
  async processAccessRequest(requestId: string): Promise<DataAccessResponse> {
    try {
      return await this.makeRequest(`/process-access/${requestId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error processing access request:', error);
      throw error;
    }
  }

  /**
   * Exportar datos del usuario en formato específico
   */
  async exportUserData(
    userId: string,
    format: 'json' | 'csv' | 'pdf' | 'xml' = 'json',
    options: {
      includeDeleted?: boolean;
      includeSystemData?: boolean;
      encrypt?: boolean;
      categories?: string[];
    } = {}
  ): Promise<DataExportResponse> {
    try {
      return await this.makeRequest('/export', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          format,
          options,
          requestedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Rectificar datos específicos
   */
  async rectifyData(
    userId: string,
    corrections: {
      field: string;
      currentValue: any;
      newValue: any;
      reason: string;
      category: string;
    }[]
  ): Promise<{
    success: boolean;
    correctedFields: string[];
    validationErrors?: string[];
  }> {
    try {
      return await this.makeRequest('/rectify', {
        method: 'PUT',
        body: JSON.stringify({
          userId,
          corrections,
          requestedAt: new Date().toISOString(),
          ipAddress: await this.getClientIP(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Error rectifying data:', error);
      throw error;
    }
  }

  /**
   * Cancelar/eliminar datos específicos
   */
  async cancelData(
    userId: string,
    dataToDelete: {
      category: string;
      fields?: string[];
      reason: string;
      retainForLegal?: boolean;
    }[]
  ): Promise<{
    success: boolean;
    deletedCategories: string[];
    retainedData?: string[];
    completionDate: string;
  }> {
    try {
      return await this.makeRequest('/cancel', {
        method: 'DELETE',
        body: JSON.stringify({
          userId,
          dataToDelete,
          requestedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error canceling data:', error);
      throw error;
    }
  }

  /**
   * Procesar oposición al tratamiento
   */
  async processOpposition(
    userId: string,
    oppositions: {
      treatmentType: string;
      purpose: string;
      reason: string;
      scope: 'partial' | 'total';
    }[]
  ): Promise<{
    success: boolean;
    stoppedTreatments: string[];
    pendingTreatments?: string[];
  }> {
    try {
      return await this.makeRequest('/opposition', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          oppositions,
          requestedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error processing opposition:', error);
      throw error;
    }
  }

  /**
   * Subir documentos de soporte
   */
  async uploadSupportDocuments(
    requestId: string,
    files: File[]
  ): Promise<{
    success: boolean;
    uploadedFiles: string[];
    rejectedFiles?: { fileName: string; reason: string }[];
  }> {
    try {
      const formData = new FormData();
      formData.append('requestId', requestId);

      files.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });

      const token = localStorage.getItem('wildtour-token');
      const response = await fetch(`${API_BASE_URL}/compliance/data-rights/upload-documents`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  }

  /**
   * Cancelar una solicitud pendiente
   */
  async cancelRequest(
    requestId: string,
    reason: string
  ): Promise<{ success: boolean; canceledAt: string }> {
    try {
      return await this.makeRequest(`/cancel-request/${requestId}`, {
        method: 'POST',
        body: JSON.stringify({
          reason,
          canceledAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error canceling request:', error);
      throw error;
    }
  }

  /**
   * Obtener información sobre tiempos de respuesta legal
   */
  async getLegalTimeframes(): Promise<{
    timeframes: Record<DataRightType, {
      standard: string;
      urgent: string;
      description: string;
      legalArticle: string;
    }>;
    businessDays: boolean;
    excludedDays: string[];
  }> {
    try {
      return await this.makeRequest('/legal-timeframes');
    } catch (error) {
      console.error('Error fetching legal timeframes:', error);
      throw error;
    }
  }

  /**
   * Verificar elegibilidad para ejercer un derecho específico
   */
  async checkEligibility(
    userId: string,
    rightType: DataRightType
  ): Promise<{
    eligible: boolean;
    reason?: string;
    requirements?: string[];
    cooldownPeriod?: string;
  }> {
    try {
      return await this.makeRequest(`/eligibility?userId=${userId}&type=${rightType}`);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      throw error;
    }
  }

  /**
   * Obtener plantillas de solicitud
   */
  async getRequestTemplates(rightType: DataRightType): Promise<{
    template: {
      title: string;
      description: string;
      requiredFields: string[];
      optionalFields: string[];
      documentRequirements: string[];
      examples: string[];
    };
  }> {
    try {
      return await this.makeRequest(`/templates/${rightType}`);
    } catch (error) {
      console.error('Error fetching request templates:', error);
      throw error;
    }
  }

  /**
   * Reportar problema con una respuesta recibida
   */
  async reportIssue(
    requestId: string,
    issue: {
      type: 'incomplete_response' | 'incorrect_data' | 'delayed_response' | 'other';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }
  ): Promise<{ success: boolean; issueId: string }> {
    try {
      return await this.makeRequest('/report-issue', {
        method: 'POST',
        body: JSON.stringify({
          requestId,
          issue,
          reportedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas para administradores
   */
  async getStatistics(
    dateRange: { from: string; to: string }
  ): Promise<RequestStatistics> {
    try {
      const params = new URLSearchParams({
        from: dateRange.from,
        to: dateRange.to,
      });

      return await this.makeRequest(`/statistics?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Verificar estado de cumplimiento general
   */
  async checkComplianceStatus(): Promise<{
    overallCompliance: number;
    responseTimeCompliance: number;
    pendingUrgentRequests: number;
    overdueRequests: DataRightRequest[];
    recentIssues: number;
  }> {
    try {
      return await this.makeRequest('/compliance-status');
    } catch (error) {
      console.error('Error checking compliance status:', error);
      throw error;
    }
  }

  /**
   * Obtener IP del cliente para auditoría
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
   * Generar reporte de cumplimiento
   */
  async generateComplianceReport(
    dateRange: { from: string; to: string },
    format: 'pdf' | 'xlsx' | 'csv' = 'pdf'
  ): Promise<{
    reportId: string;
    downloadUrl: string;
    expiresAt: string;
  }> {
    try {
      return await this.makeRequest('/compliance-report', {
        method: 'POST',
        body: JSON.stringify({
          dateRange,
          format,
          generatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }
}

export const dataRightsApi = new DataRightsApi();