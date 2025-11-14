import { api } from '../http/apiClient';

export interface RNTVerificationRequest {
  rntNumber: string;
  rntType: string;
  businessName: string;
}

export interface RNTVerificationResponse {
  isValid: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'not_found';
  registeredName?: string;
  registeredType?: string;
  registrationDate?: string;
  expirationDate?: string;
  message: string;
}

export const rntApi = {
  /**
   * Verifica si un número de RNT es válido y está activo
   */
  async verifyRNT(data: RNTVerificationRequest): Promise<RNTVerificationResponse> {
    const response = await api.post<RNTVerificationResponse>('/rnt/verify', data);
    return response.data;
  },

  /**
   * Obtiene información detallada de un RNT
   */
  async getRNTDetails(rntNumber: string): Promise<any> {
    const response = await api.get(`/rnt/${rntNumber}`);
    return response.data;
  }
};
